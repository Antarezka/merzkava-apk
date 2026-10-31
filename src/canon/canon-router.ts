import { getCanonIndex, getCanonStatus, loadCanonModule, type CanonDocument } from "./canon-loader";

export interface CanonModule {
  path: string;
  description: string;
  category: string;
}

export interface CanonRouteResult {
  query: string;
  modules: CanonModule[];
  loaded: CanonDocument[];
  skipped: string[];
  requiredPaths: string[];
}

const MODULE_PATH = /(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.md/g;
const STOP_WORDS = new Set(["yang", "dan", "atau", "untuk", "dengan", "dari", "pada", "saat", "ketika", "dalam", "the", "and", "for", "with", "when", "during", "about"]);

const REQUIRED_GAMEPLAY_PATHS = [
  "templates/AUTHORITY_ORDER.md",
  "templates/GAMEPLAY_RESPONSE_TEMPLATE.md",
  "templates/CHARACTER_PROFILE_TEMPLATE.md",
  "templates/NARRATIVE_DYNAMICS.md",
  "templates/ANTI_CHEAT_HARD_GATE.md",
  "world/DYNAMIC_EVENTS.md"
];

function categoryFromPath(path: string): string {
  const folder = path.split("/")[0];
  if (folder === path) return "Bootstrap";
  return folder.replace(/[_-]/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function normalize(value: string): string[] {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/** Extract only Markdown paths explicitly referenced by the active INDEX. */
export function parseCanonModules(indexMarkdown: string): CanonModule[] {
  const modules = new Map<string, CanonModule>();
  const lines = indexMarkdown.split(/\r?\n/);
  for (const line of lines) {
    const paths = line.match(MODULE_PATH) ?? [];
    if (!paths.length) continue;
    const description = line.replace(/\|/g, " ").replace(/\*\*/g, "")
      .replace(/`([^`]+)`/g, "$1").replace(/\s+/g, " ").trim();
    for (const rawPath of paths) {
      const path = rawPath.replace(/^\.\//, "");
      if (path.startsWith("backups/") || path.includes("..")) continue;
      const existing = modules.get(path);
      if (!existing || existing.description.length < description.length) {
        modules.set(path, { path, description, category: categoryFromPath(path) });
      }
    }
  }
  return [...modules.values()].sort((a, b) => a.path.localeCompare(b.path));
}

export async function listCanonModules(): Promise<CanonModule[]> {
  const status = getCanonStatus();
  if (!status.commitSha) throw new Error("ACTIVE_SHA belum terverifikasi.");
  const index = await getCanonIndex(status.commitSha);
  if (!index || index.commitSha !== status.commitSha) throw new Error("INDEX canon pada ACTIVE_SHA aktif belum tersedia.");
  return parseCanonModules(index.content);
}

/** Rank modules by words in their path and INDEX description. */
export function searchCanonModules(modules: CanonModule[], query: string, limit = 12): CanonModule[] {
  const terms = normalize(query);
  if (!terms.length) return modules.slice(0, limit);
  return modules.map(module => {
    const pathTokens = normalize(module.path.replace(/[/.]/g, " "));
    const descriptionTokens = normalize(module.description);
    const score = terms.reduce((total, term) => total
      + (pathTokens.includes(term) ? 5 : 0)
      + (descriptionTokens.includes(term) ? 2 : 0), 0);
    return { module, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.module.path.localeCompare(b.module.path))
    .slice(0, limit).map(item => item.module);
}

/** Resolve and load relevant files from the exact active canon snapshot. */
export async function routeCanonActivity(activity: string, limit = 5): Promise<CanonRouteResult> {
  const modules = await listCanonModules();
  const relevant = searchCanonModules(modules, activity, limit);
  const skipped: string[] = [];
  const required = REQUIRED_GAMEPLAY_PATHS.flatMap(path => {
    const module = modules.find(candidate => candidate.path === path);
    if (!module) skipped.push("Wajib tetapi tidak terdaftar di INDEX: " + path);
    return module ? [module] : [];
  });
  const selected = [...required, ...relevant.filter(module => !required.some(item => item.path === module.path))];
  const loaded: CanonDocument[] = [];
  for (const module of selected) {
    try {
      loaded.push(await loadCanonModule(module.path));
    } catch (error) {
      const detail = `${module.path}: ${error instanceof Error ? error.message : "gagal dimuat"}`;
      skipped.push(detail);
      if (REQUIRED_GAMEPLAY_PATHS.includes(module.path)) throw new Error(`BOOTSTRAP FAIL-CLOSED — sumber wajib tidak tersedia: ${detail}`);
    }
  }
  const missing = REQUIRED_GAMEPLAY_PATHS.filter(path => !loaded.some(document => document.path === path));
  if (missing.length) throw new Error("BOOTSTRAP FAIL-CLOSED — modul wajib belum lengkap: " + missing.join(", "));
  return { query: activity, modules: selected, loaded, skipped, requiredPaths: [...REQUIRED_GAMEPLAY_PATHS] };
}
