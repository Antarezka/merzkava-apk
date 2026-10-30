import { cacheCanonDocument, getCachedCanonDocument, type CachedCanonDocument } from "../database/database";

const CANON_REPOSITORY = "Antarezka/merzkava-universe";
const README_URL = `https://raw.githubusercontent.com/${CANON_REPOSITORY}/main/README.md`;
const API_BASE = `https://api.github.com/repos/${CANON_REPOSITORY}`;

export interface CanonStatus {
  status: "ready" | "cached" | "error";
  commitSha: string;
  version: string;
  updatedAt: string;
  message: string;
}

export interface CanonDocument extends CachedCanonDocument {}

let currentStatus: CanonStatus = {
  status: "error",
  commitSha: "",
  version: "",
  updatedAt: "",
  message: "Canon belum dimuat."
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { Accept: "text/plain" } });
  if (!response.ok) throw new Error(`HTTP ${response.status} saat mengambil sumber canon.`);
  return response.text();
}

async function resolvePinnedCommit(shortHash: string): Promise<string> {
  const response = await fetch(`${API_BASE}/commits/${encodeURIComponent(shortHash)}`, {
    headers: { Accept: "application/vnd.github+json" }
  });
  if (!response.ok) throw new Error(`Hash pin ${shortHash} tidak dapat diverifikasi (HTTP ${response.status}).`);
  const data = await response.json() as { sha?: string };
  if (!data.sha || !/^[a-f0-9]{40}$/i.test(data.sha)) throw new Error("GitHub tidak mengembalikan SHA commit yang valid.");
  return data.sha;
}

function parsePinnedHash(readme: string): string {
  const match = readme.match(/Latest pinned source:\*\*\s*`([a-f0-9]{7,40})`/i);
  if (!match) throw new Error("Baris Latest pinned source tidak ditemukan di README.");
  return match[1];
}

function parseNightlyVersion(markdown: string): string {
  const match = markdown.match(/Current Nightly version:\s*`(v[0-9]+\.[0-9]+\.[0-9]+)`/i);
  if (!match) throw new Error("Current Nightly version tidak ditemukan atau tidak valid.");
  return match[1];
}

function validateCanonPath(path: string): string {
  const normalized = path.trim().replace(/^\/+/, "");
  if (!normalized.endsWith(".md") || normalized.includes("..") || normalized.includes("\\") || normalized.startsWith("backups/")) {
    throw new Error("Path modul harus berupa file Markdown aktif di luar folder backups.");
  }
  return normalized;
}

async function fetchPinnedDocument(path: string, commitSha: string): Promise<CanonDocument> {
  const safePath = validateCanonPath(path);
  const content = await fetchText(`https://raw.githubusercontent.com/${CANON_REPOSITORY}/${commitSha}/${safePath.split("/").map(encodeURIComponent).join("/")}`);
  const document: CanonDocument = { path: safePath, commitSha, content, fetchedAt: new Date().toISOString() };
  await cacheCanonDocument(document);
  return document;
}

export function getCanonStatus(): CanonStatus {
  return { ...currentStatus };
}

export async function getCanonIndex(): Promise<CanonDocument | null> {
  return getCachedCanonDocument("INDEX.md");
}

export async function loadCanonModule(path: string): Promise<CanonDocument> {
  if (!currentStatus.commitSha) throw new Error("Muat atau perbarui INDEX canon terlebih dahulu.");
  const safePath = validateCanonPath(path);
  const index = await getCachedCanonDocument("INDEX.md");
  if (!index || index.commitSha !== currentStatus.commitSha || !index.content.includes(`\`${safePath}\``)) {
    throw new Error("Path tidak tercantum di INDEX pada commit canon aktif.");
  }
  return fetchPinnedDocument(safePath, currentStatus.commitSha);
}

export async function refreshCanon(): Promise<CanonStatus> {
  try {
    const readme = await fetchText(README_URL);
    const shortHash = parsePinnedHash(readme);
    const commitSha = await resolvePinnedCommit(shortHash);
    await fetchPinnedDocument("INDEX.md", commitSha);
    const versionDoc = await fetchPinnedDocument("NIGHTLY_VERSION.md", commitSha);
    const version = parseNightlyVersion(versionDoc.content);
    currentStatus = {
      status: "ready",
      commitSha,
      version,
      updatedAt: new Date().toISOString(),
      message: `Canon terverifikasi · ${commitSha.slice(0, 7)} · ${version}`
    };
    return getCanonStatus();
  } catch (error) {
    const cachedIndex = await getCachedCanonDocument("INDEX.md");
    const cachedVersion = await getCachedCanonDocument("NIGHTLY_VERSION.md");
    if (cachedIndex && cachedVersion) {
      const version = parseNightlyVersion(cachedVersion.content);
      currentStatus = {
        status: "cached",
        commitSha: cachedIndex.commitSha,
        version,
        updatedAt: cachedIndex.fetchedAt,
        message: `Offline: memakai canon tersimpan · ${cachedIndex.commitSha.slice(0, 7)}`
      };
      return getCanonStatus();
    }
    currentStatus = {
      status: "error",
      commitSha: "",
      version: "",
      updatedAt: "",
      message: error instanceof Error ? error.message : "Canon gagal dimuat."
    };
    return getCanonStatus();
  }
}
