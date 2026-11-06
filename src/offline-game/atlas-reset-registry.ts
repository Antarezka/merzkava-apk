export interface AtlasResetRegistryName {
  name: string;
  path: string;
}

/** Parse only linked player-profile rows from a verified players.md registry. */
export function parseAtlasResetRegistryNames(content: string): AtlasResetRegistryName[] {
  const rows = content.matchAll(/^\|\s*([^|]+?)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+?)\s*\|$/gm);
  const seen = new Set<string>();
  const result: AtlasResetRegistryName[] = [];
  for (const row of rows) {
    const name = row[1].trim();
    let path = "";
    try { path = decodeURIComponent(row[3].trim()); } catch { continue; }
    if (!name || !path.startsWith("players/") || !path.endsWith(".md") || path.split("/").includes("..")) continue;
    const key = name.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ name, path });
  }
  return result;
}
