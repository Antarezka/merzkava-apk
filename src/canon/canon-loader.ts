import { cacheCanonDocument, getCachedCanonDocument, type CachedCanonDocument } from "../database/database";

const CANON_REPOSITORY = "Antarezka/merzkava-universe";
// Update this full commit SHA only when the owner deliberately advances the Universe pinned source. Runtime never bootstraps from README.
const DEFAULT_CANON_SNAPSHOT = "58693e13ead18dc44528f8f0259ca89cfb7faff9";
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

async function verifyPinnedCommit(shortHash: string): Promise<string> {
  const response = await fetch(`${API_BASE}/commits/${encodeURIComponent(shortHash)}`, {
    headers: { Accept: "application/vnd.github+json" }
  });
  if (!response.ok) throw new Error(`Hash pin ${shortHash} tidak dapat diverifikasi (HTTP ${response.status}).`);
  const data = await response.json() as { sha?: string };
  if (!data.sha || !/^[a-f0-9]{40}$/i.test(data.sha) || !data.sha.toLowerCase().startsWith(shortHash.toLowerCase())) {
    throw new Error("GitHub tidak mengonfirmasi hash pendek yang cocok dengan commit.");
  }
  return data.sha.toLowerCase();
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

export async function getCanonIndex(activeSha?: string): Promise<CanonDocument | null> {
  return getCachedCanonDocument("INDEX.md", activeSha);
}

export async function loadPlayerRegistry(activeSha: string): Promise<CanonDocument> {
  const expected = activeSha.toLowerCase();
  if (!/^[a-f0-9]{40}$/.test(expected) || currentStatus.commitSha !== expected) throw new Error("ACTIVE_SHA penuh tidak cocok dengan canon yang sedang diverifikasi.");
  return fetchPinnedDocument("players.md", expected);
}

export async function loadCanonModule(path: string): Promise<CanonDocument> {
  if (!currentStatus.commitSha) throw new Error("Muat atau perbarui INDEX canon terlebih dahulu.");
  const safePath = validateCanonPath(path);
  const index = await getCachedCanonDocument("INDEX.md", currentStatus.commitSha);
  if (!index || index.commitSha !== currentStatus.commitSha || !index.content.includes(`\`${safePath}\``)) {
    throw new Error("Path tidak tercantum di INDEX pada commit canon aktif.");
  }
  try {
    return await fetchPinnedDocument(safePath, currentStatus.commitSha);
  } catch (error) {
    const cached = await getCachedCanonDocument(safePath, currentStatus.commitSha);
    if (cached && cached.commitSha === currentStatus.commitSha && cached.content.trim()) return cached;
    throw new Error(`Canon module ${safePath} unavailable for ACTIVE_SHA ${currentStatus.commitSha.slice(0,7)}: ${error instanceof Error ? error.message : "fetch failed"}`);
  }
}

export async function activateCanonSnapshot(snapshot: string): Promise<CanonStatus> {
  const requested = snapshot.trim();
  if (!/^[a-f0-9]{7,40}$/i.test(requested)) throw new Error("ACTIVE_SHA tidak valid.");
  const fullSha = await verifyPinnedCommit(requested);
  const index = await fetchPinnedDocument("INDEX.md", fullSha);
  const authority = await fetchPinnedDocument("templates/AUTHORITY_ORDER.md", fullSha);
  const versionDoc = await fetchPinnedDocument("NIGHTLY_VERSION.md", fullSha);
  if (!index.content.trim()) throw new Error("INDEX.md kosong pada ACTIVE_SHA.");
  if (!authority.content.trim()) throw new Error("templates/AUTHORITY_ORDER.md kosong pada ACTIVE_SHA.");
  const version = parseNightlyVersion(versionDoc.content);
  currentStatus = { status: "ready", commitSha: fullSha, version, updatedAt: new Date().toISOString(), message: `Canon snapshot terverifikasi · ${fullSha.slice(0,7)} · ${version}` };
  return getCanonStatus();
}

export async function refreshCanon(snapshot = DEFAULT_CANON_SNAPSHOT): Promise<CanonStatus> {
  try { return await activateCanonSnapshot(snapshot); }
  catch (error) {
    const requested = snapshot.trim().toLowerCase();
    const cachedIndex = await getCachedCanonDocument("INDEX.md");
    const cachedVersion = await getCachedCanonDocument("NIGHTLY_VERSION.md");
    const cachedAuthority = await getCachedCanonDocument("templates/AUTHORITY_ORDER.md");
    if (/^[a-f0-9]{7,40}$/.test(requested) && cachedIndex && cachedVersion && cachedAuthority && cachedIndex.commitSha.startsWith(requested) && cachedVersion.commitSha === cachedIndex.commitSha && cachedAuthority.commitSha === cachedIndex.commitSha) {
      const version = parseNightlyVersion(cachedVersion.content);
      currentStatus = { status: "cached", commitSha: cachedIndex.commitSha, version, updatedAt: cachedIndex.fetchedAt, message: `Offline: memakai snapshot canon tersimpan yang sama · ${cachedIndex.commitSha.slice(0,7)}` };
      return getCanonStatus();
    }
    currentStatus = { status: "error", commitSha: "", version: "", updatedAt: "", message: error instanceof Error ? error.message : "Canon gagal dimuat." };
    return getCanonStatus();
  }
}


export interface RegisteredPlayer {
  name: string;
  path: string;
  age: number | null;
  realm: string;
  background: string;
  profileMarkdown: string;
}

export async function refreshLatestPlayerRegistry(activeSha: string): Promise<{ commitSha: string; players: RegisteredPlayer[] }> {
  const fullSha = activeSha.toLowerCase();
  if (!/^[a-f0-9]{40}$/.test(fullSha) || currentStatus.commitSha !== fullSha) throw new Error("Registry harus dimuat dari ACTIVE_SHA penuh yang sedang aktif.");
  const registry = await fetchPinnedDocument("players.md", fullSha);
  const rows = [...registry.content.matchAll(/^\|\s*([^|]+?)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+?)\s*\|$/gm)];
  const players: RegisteredPlayer[] = [];
  for (const row of rows) {
    const name = row[1].trim();
    const relativePath = decodeURIComponent(row[3].trim());
    if (!name || !relativePath.startsWith("players/") || !relativePath.endsWith(".md")) continue;
    const path = relativePath.split("/").map(encodeURIComponent).join("/");
    const profile = await fetchText(`https://raw.githubusercontent.com/${CANON_REPOSITORY}/${fullSha}/${path}`);
    const ageMatch = profile.match(/^-\s*\*\*Usia:\*\*\s*(\d+)/m);
    const realmMatch = profile.match(/^-\s*\*\*Spirit Realm:\*\*\s*([^\n]+)/m);
    const backgroundMatch = profile.match(/(?:^|\n)## Latar Belakang Orisinal[^\n]*\n([\s\S]*?)(?=\n## |\s*$)/);
    players.push({
      name,
      path: relativePath,
      age: ageMatch ? Number(ageMatch[1]) : null,
      realm: realmMatch?.[1].trim() ?? "Belum ditetapkan",
      background: backgroundMatch?.[1].trim().replace(/\n{2,}/g, " ") ?? "",
      profileMarkdown: profile
    });
  }
  if (!players.length) throw new Error("Tidak ada karakter valid yang ditemukan pada tabel Daftar Karakter di players.md.");
  return { commitSha: fullSha, players };
}

export async function loadRegisteredPlayerProfile(activeSha: string, path: string): Promise<CanonDocument> {
  const fullSha = activeSha.toLowerCase();
  if (!/^[a-f0-9]{40}$/.test(fullSha) || currentStatus.commitSha !== fullSha) throw new Error("Profil hanya boleh dimuat dari ACTIVE_SHA penuh yang aktif.");
  const registry = await fetchPinnedDocument("players.md", fullSha);
  const safePath = validateCanonPath(path);
  const listed = [...registry.content.matchAll(/^\|\s*([^|]+?)\s*\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|/gm)]
    .some(row => decodeURIComponent(row[2].trim()) === safePath);
  if (!listed || !safePath.startsWith("players/")) throw new Error("Profil karakter tidak tercantum di players.md pada snapshot aktif.");
  return fetchPinnedDocument(safePath, fullSha);
}
