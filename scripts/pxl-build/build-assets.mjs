import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PXL_REPOSITORY = "https://github.com/augusto-scarvalho/claude-pxl.git";
const PXL_COMMIT = "13a797ee15b05186a49eb8520a4fcfed73d555ae";
const MIN_NODE = [22, 18, 0];
const TOOL_DIR = path.join(ROOT, ".tools", "claude-pxl");
const SOURCE_DIR = path.join(ROOT, "pxl");
const EXPORT_DIR = path.join(ROOT, "public", "assets", "augusto-pxl", "exports");
const MANIFEST_PATH = path.join(ROOT, "public", "assets", "augusto-pxl", "manifest.json");
const ASSET_MAP_PATH = path.join(SOURCE_DIR, "asset-map.json");
const LICENSE_DEST = path.join(ROOT, "public", "assets", "augusto-pxl", "licenses", "claude-pxl-MIT.txt");
const REFERENCE_DIR = path.join(SOURCE_DIR, "maps", "references");
const ALLOWED_OUTPUT_EXTENSIONS = new Set([".png", ".json", ".tmj", ".ase"]);

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: "inherit", ...options });
}
function checkNodeVersion() {
  const parts = process.versions.node.split(".").map(Number);
  const current = parts.map((value, index) => value - (MIN_NODE[index] ?? 0));
  if (parts[0] < MIN_NODE[0] || (parts[0] === MIN_NODE[0] && parts[1] < MIN_NODE[1])) {
    throw new Error(`Augusto PXL requires Node >= 22.18.0; current runtime is ${process.versions.node}.`);
  }
}
async function walk(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith(".px.js")) output.push(full);
  }
  return output.sort();
}
async function ensurePinnedPxl() {
  await fs.mkdir(path.dirname(TOOL_DIR), { recursive: true });
  await fs.rm(TOOL_DIR, { recursive: true, force: true });
  run("git", ["clone", "--filter=blob:none", "--no-checkout", PXL_REPOSITORY, TOOL_DIR]);
  run("git", ["fetch", "--depth=1", "origin", PXL_COMMIT], { cwd: TOOL_DIR });
  run("git", ["checkout", "--detach", PXL_COMMIT], { cwd: TOOL_DIR });
  const actual = execFileSync("git", ["rev-parse", "HEAD"], { cwd: TOOL_DIR, encoding: "utf8" }).trim();
  if (actual !== PXL_COMMIT) throw new Error(`PXL pin mismatch: expected ${PXL_COMMIT}, got ${actual}`);
  const cli = path.join(TOOL_DIR, "bin", "pxl.js");
  await fs.access(cli);
  await fs.mkdir(path.dirname(LICENSE_DEST), { recursive: true });
  await fs.copyFile(path.join(TOOL_DIR, "LICENSE"), LICENSE_DEST);
  return cli;
}
async function ensurePxlReferences() {
  await fs.mkdir(REFERENCE_DIR, { recursive: true });
  const sources = [
    ["public/world/Untitled77_20261029054536.png", "world-map-source.png", "scale=2752:1640"],
    ["assets/maps/academy/full-map/1_academy.jpg", "academy-exterior-source.png"],
    ["public/game/scenery/tianhai-yunzhou/ty-05-academy-environment.png", "local-default-source.png"],
  ];
  for (const [relativeInput, outputName, scaleFilter] of sources) {
    const input = path.join(ROOT, relativeInput);
    const output = path.join(REFERENCE_DIR, outputName);
    await fs.access(input);
    run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "mjpeg", "-i", input,
      ...(scaleFilter ? ["-vf", scaleFilter] : []),
      "-frames:v", "1", "-update", "1", "-pix_fmt", "rgba", output,
    ]);
    const png = await fs.readFile(output);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    if (png.length < 24 || !png.subarray(0, 8).equals(signature)) {
      throw new Error("Reference conversion did not produce a valid PNG: " + relativeInput);
    }
    console.log("Prepared PXL reference: " + outputName + " (" + png.readUInt32BE(16) + "×" + png.readUInt32BE(20) + ")");
  }
}

function safeRelative(value, label) {
  if (typeof value !== "string" || !value || path.isAbsolute(value) || value.split(/[\\/]/).includes("..")) {
    throw new Error(`Invalid ${label} path: ${String(value)}`);
  }
  return value.split(path.sep).join("/");
}
async function copyGeneratedOutput(sourceFile) {
  const sourceRelative = path.relative(SOURCE_DIR, sourceFile);
  const sourceFolder = path.dirname(sourceRelative);
  const outputFolder = path.join(path.dirname(sourceFile), "out");
  let entries;
  try { entries = await fs.readdir(outputFolder, { withFileTypes: true }); }
  catch { throw new Error(`PXL did not create expected output folder: ${path.relative(ROOT, outputFolder)}`); }
  let copied = 0;
  async function copyTree(from, relative = "") {
    for (const entry of await fs.readdir(from, { withFileTypes: true })) {
      const source = path.join(from, entry.name);
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await copyTree(source, child);
      else if (entry.isFile() && ALLOWED_OUTPUT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        const destination = path.join(EXPORT_DIR, sourceFolder, child);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.copyFile(source, destination);
        copied += 1;
      }
    }
  }
  await copyTree(outputFolder);
  console.log(`Exported ${copied} files from ${sourceRelative}`);
  if (!copied) throw new Error(`PXL output folder contains no supported files: ${path.relative(ROOT, outputFolder)}`);
}
async function applyAssetMap() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const mapping = JSON.parse(await fs.readFile(ASSET_MAP_PATH, "utf8"));
  if (manifest.schemaVersion !== 1 || mapping.schemaVersion !== 1 || !mapping.assets || typeof mapping.assets !== "object") {
    throw new Error("Unsupported Augusto PXL manifest or asset-map schema.");
  }
  const unmapped = Object.keys(manifest.assets).filter((assetId) => !mapping.assets[assetId]);
  if (unmapped.length) throw new Error("Unmapped manifest assets (" + unmapped.length + "): " + unmapped.join(", "));
  for (const asset of Object.values(manifest.assets)) {
    delete asset.src;
    delete asset.frameWidth;
    delete asset.frameHeight;
    delete asset.columns;
    delete asset.animations;
    delete asset.directions;
    asset.status = "pending";
  }
  for (const [assetId, entry] of Object.entries(mapping.assets)) {
    if (!manifest.assets[assetId]) throw new Error(`Asset map references an unknown manifest ID: ${assetId}`);
    const source = safeRelative(entry.source, `asset ${assetId}`);
    const absolute = path.resolve(EXPORT_DIR, source);
    if (!absolute.startsWith(EXPORT_DIR + path.sep)) throw new Error(`Asset path escapes exports folder: ${source}`);
    await fs.access(absolute);
    const extension = path.extname(source).toLowerCase();
    if (!ALLOWED_OUTPUT_EXTENSIONS.has(extension)) throw new Error(`Unsupported exported asset extension: ${source}`);
    if (entry.type !== "image" && entry.type !== "sprite-sheet") throw new Error(`Asset ${assetId} must be image or sprite-sheet.`);
    const image = await fs.readFile(absolute);
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    if (image.length < 24 || !image.subarray(0, 8).equals(pngSignature)) {
      throw new Error(`Asset ${assetId} is not a valid PNG: ${source}`);
    }
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);
    if (entry.expectedWidth !== undefined && width !== entry.expectedWidth) {
      throw new Error(`Asset ${assetId} width mismatch: expected ${entry.expectedWidth}, got ${width}`);
    }
    if (entry.expectedHeight !== undefined && height !== entry.expectedHeight) {
      throw new Error(`Asset ${assetId} height mismatch: expected ${entry.expectedHeight}, got ${height}`);
    }
    const result = {
      status: "ready",
      type: entry.type,
      src: "/assets/augusto-pxl/exports/" + source,
    };
    if (entry.type === "sprite-sheet") {
      for (const field of ["frameWidth", "frameHeight", "columns"]) {
        if (!Number.isInteger(entry[field]) || entry[field] <= 0) throw new Error(`Sprite asset ${assetId} requires positive integer ${field}.`);
      }
      result.frameWidth = entry.frameWidth;
      result.frameHeight = entry.frameHeight;
      if (width % entry.frameWidth !== 0 || height % entry.frameHeight !== 0 || width / entry.frameWidth !== entry.columns) {
        throw new Error(`Sprite sheet ${assetId} layout mismatch: ${width}×${height}, frame ${entry.frameWidth}×${entry.frameHeight}, columns ${entry.columns}`);
      }
      const frameCount = (width / entry.frameWidth) * (height / entry.frameHeight);
      const validateFrames = (label, animation) => {
        if (!animation || !Array.isArray(animation.frames) || animation.frames.length === 0) {
          throw new Error(`Sprite sheet ${assetId} has an empty animation: ${label}`);
        }
        for (const frame of animation.frames) {
          if (!Number.isInteger(frame) || frame < 0 || frame >= frameCount) {
            throw new Error(`Sprite sheet ${assetId} animation ${label} references invalid frame ${frame} (count ${frameCount})`);
          }
        }
      };
      for (const [name, animation] of Object.entries(entry.animations ?? {})) validateFrames(name, animation);
      for (const [direction, motions] of Object.entries(entry.directions ?? {})) {
        for (const [motion, animation] of Object.entries(motions)) validateFrames(direction + "." + motion, animation);
      }
      result.columns = entry.columns;
      if (entry.animations) result.animations = entry.animations;
      if (entry.directions) result.directions = entry.directions;
    }
    manifest.assets[assetId] = result;
  }
  manifest.pipeline.lastBuild = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Updated Augusto PXL manifest from pxl/asset-map.json");
}
async function main() {
  checkNodeVersion();
  for (const directory of [SOURCE_DIR, EXPORT_DIR]) await fs.access(directory);
  await ensurePxlReferences();
  const cli = await ensurePinnedPxl();
  const sources = await walk(SOURCE_DIR);
  if (!sources.length) throw new Error("No .px.js sources were found under pxl/.");
  await fs.rm(EXPORT_DIR, { recursive: true, force: true });
  await fs.mkdir(EXPORT_DIR, { recursive: true });
  for (const source of sources) {
    console.log("\n--- PXL check: " + path.relative(ROOT, source) + " ---");
    run(process.execPath, [cli, "check", source], { cwd: ROOT });
    console.log("--- PXL build: " + path.relative(ROOT, source) + " ---");
    run(process.execPath, [cli, "build", source], { cwd: ROOT });
    await copyGeneratedOutput(source);
  }
  await applyAssetMap();
  console.log(`Augusto PXL pinned build complete: ${PXL_COMMIT}`);
}
main().catch(error => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
