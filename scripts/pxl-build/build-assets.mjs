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
const ALLOWED_OUTPUT_EXTENSIONS = new Set([".png", ".json", ".gif", ".tmj", ".ase"]);

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
  await fs.copyFile(path.join(TOOL_DIR, "LICENSE"), LICENSE_DEST);
  return cli;
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
  for (const [assetId, entry] of Object.entries(mapping.assets)) {
    if (!manifest.assets[assetId]) throw new Error(`Asset map references an unknown manifest ID: ${assetId}`);
    const source = safeRelative(entry.source, `asset ${assetId}`);
    const absolute = path.resolve(EXPORT_DIR, source);
    if (!absolute.startsWith(EXPORT_DIR + path.sep)) throw new Error(`Asset path escapes exports folder: ${source}`);
    await fs.access(absolute);
    const extension = path.extname(source).toLowerCase();
    if (!ALLOWED_OUTPUT_EXTENSIONS.has(extension)) throw new Error(`Unsupported exported asset extension: ${source}`);
    if (entry.type !== "image" && entry.type !== "sprite-sheet") throw new Error(`Asset ${assetId} must be image or sprite-sheet.`);
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
