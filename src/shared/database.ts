import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from "@capacitor-community/sqlite";

const DATABASE_NAME = "merzkava";
const SCHEMA_VERSION = 6;
let database: SQLiteDBConnection | null = null;

const schema = [
  `CREATE TABLE IF NOT EXISTS characters (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, age INTEGER NOT NULL DEFAULT 0, origin TEXT NOT NULL DEFAULT 'Golden Dragon Empire', background TEXT NOT NULL DEFAULT '', realm TEXT NOT NULL DEFAULT 'Mortal', cultivation_level INTEGER NOT NULL DEFAULT 0, awakened INTEGER NOT NULL DEFAULT 0 CHECK(awakened IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`,
  `CREATE TABLE IF NOT EXISTS character_stats (character_id TEXT PRIMARY KEY NOT NULL, hp_current INTEGER NOT NULL DEFAULT 100, hp_max INTEGER NOT NULL DEFAULT 100, stamina_current INTEGER NOT NULL DEFAULT 100, stamina_max INTEGER NOT NULL DEFAULT 100, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS inventory_items (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, item_key TEXT NOT NULL, item_name TEXT NOT NULL, quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 0), metadata_json TEXT NOT NULL DEFAULT '{}', FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS wallet_ledger (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, currency TEXT NOT NULL CHECK(currency IN ('xc','xs','xg','zj','az')), amount INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS gameplay_logs (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, category TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS canon_documents (path TEXT PRIMARY KEY NOT NULL, commit_sha TEXT NOT NULL, content TEXT NOT NULL, fetched_at TEXT NOT NULL);`,
  `CREATE TABLE IF NOT EXISTS canon_documents_snapshot (path TEXT NOT NULL, commit_sha TEXT NOT NULL, content TEXT NOT NULL, fetched_at TEXT NOT NULL, PRIMARY KEY (path, commit_sha));`,
  `CREATE TABLE IF NOT EXISTS gameplay_sessions (character_id TEXT PRIMARY KEY NOT NULL, snapshot_sha TEXT NOT NULL, canon_version TEXT NOT NULL, profile_markdown TEXT NOT NULL DEFAULT '', state_json TEXT NOT NULL DEFAULT '{}', state_verified INTEGER NOT NULL DEFAULT 0 CHECK(state_verified IN (0,1)), updated_at TEXT NOT NULL);`,
  `CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_inventory_items_character_id ON inventory_items(character_id);`,
  `CREATE INDEX IF NOT EXISTS idx_wallet_ledger_character_id ON wallet_ledger(character_id);`,
  `CREATE INDEX IF NOT EXISTS idx_gameplay_logs_character_id ON gameplay_logs(character_id);`
];

export type DatabaseStatus = { mode: "sqlite" | "preview" | "error"; message: string };

export async function initializeDatabase(): Promise<DatabaseStatus> {
  if (!Capacitor.isNativePlatform()) return { mode: "preview", message: "Mode pratinjau browser — penyimpanan lokal perangkat aktif di APK Android." };
  try {
    const connection = new SQLiteConnection(CapacitorSQLite);
    database = await connection.createConnection(DATABASE_NAME, false, "no-encryption", SCHEMA_VERSION, false);
    await database.open();
    // SQLite does not guarantee FK enforcement unless enabled per connection.
    await database.execute("PRAGMA foreign_keys = ON;");
    for (const statement of schema) await database.execute(statement);

    // Additive migrations keep existing local saves readable after app updates.
    const columns = await database.query("PRAGMA table_info(characters);");
    const columnNames = new Set((columns.values ?? []).map(column => String(column.name)));
    if (!columnNames.has("origin")) await database.execute("ALTER TABLE characters ADD COLUMN origin TEXT NOT NULL DEFAULT 'Golden Dragon Empire';");
    if (!columnNames.has("background")) await database.execute("ALTER TABLE characters ADD COLUMN background TEXT NOT NULL DEFAULT '';"); 
    if (!columnNames.has("awakened")) await database.execute("ALTER TABLE characters ADD COLUMN awakened INTEGER NOT NULL DEFAULT 0 CHECK(awakened IN (0,1));");
    await database.execute(`PRAGMA user_version = ${SCHEMA_VERSION};`);
    return { mode: "sqlite", message: "Database SQLite lokal siap di perangkat." };
  } catch (error) {
    database = null;
    const detail = error instanceof Error ? error.message : "Unknown database error";
    return { mode: "error", message: `SQLite gagal diinisialisasi: ${detail}` };
  }
}

export function getDatabase(): SQLiteDBConnection {
  if (!database) throw new Error("SQLite belum diinisialisasi. Jalankan di APK Android.");
  return database;
}


export interface CachedCanonDocument {
  path: string;
  commitSha: string;
  content: string;
  fetchedAt: string;
}

const CANON_PREVIEW_KEY = "merzkava.canon.documents.v2";

function readPreviewCanon(): CachedCanonDocument[] {
  try {
    const stored = JSON.parse(localStorage.getItem(CANON_PREVIEW_KEY) ?? "[]") as CachedCanonDocument[];
    return stored;
  } catch { return []; }
}

export async function cacheCanonDocument(document: CachedCanonDocument): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    const documents = readPreviewCanon().filter(item => !(item.path === document.path && item.commitSha === document.commitSha));
    documents.push(document);
    localStorage.setItem(CANON_PREVIEW_KEY, JSON.stringify(documents));
    return;
  }
  await getDatabase().run(
     "INSERT INTO canon_documents_snapshot (path, commit_sha, content, fetched_at) VALUES (?, ?, ?, ?) ON CONFLICT(path, commit_sha) DO UPDATE SET content = excluded.content, fetched_at = excluded.fetched_at;",
    [document.path, document.commitSha, document.content, document.fetchedAt]
  );
}

export async function getCachedCanonDocument(path: string, commitSha?: string): Promise<CachedCanonDocument | null> {
  if (!Capacitor.isNativePlatform()) {
    const matches = readPreviewCanon().filter(item => item.path === path && (!commitSha || item.commitSha === commitSha));
    return matches.sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt))[0] ?? null;
  }
  const result = await getDatabase().query(
    "SELECT path, commit_sha, content, fetched_at FROM canon_documents_snapshot WHERE path = ? AND (? IS NULL OR commit_sha = ?) ORDER BY fetched_at DESC LIMIT 1;",
    [path, commitSha ?? null, commitSha ?? null]
  );
  const row = result.values?.[0];
  return row ? { path: String(row.path), commitSha: String(row.commit_sha), content: String(row.content), fetchedAt: String(row.fetched_at) } : null;
}


export interface GameplaySessionRecord {
  characterId: string;
  snapshotSha: string;
  canonVersion: string;
  profileMarkdown: string;
  stateJson: string;
  stateVerified: boolean;
  updatedAt: string;
}

const GAMEPLAY_SESSION_PREVIEW_KEY = "merzkava.gameplay-sessions.v1";
function readPreviewGameplaySessions(): Record<string, GameplaySessionRecord> {
  try { return JSON.parse(localStorage.getItem(GAMEPLAY_SESSION_PREVIEW_KEY) ?? "{}") as Record<string, GameplaySessionRecord>; }
  catch { return {}; }
}

/** Persist source profile and verification status; AI proposals are not authoritative state. */
export async function saveGameplaySessionRecord(record: GameplaySessionRecord): Promise<void> {
  if (!record.characterId || !/^[a-f0-9]{40}$/i.test(record.snapshotSha)) throw new Error("Gameplay save membutuhkan character ID dan ACTIVE_SHA penuh yang terverifikasi.");
  if (!record.canonVersion.trim() || !record.stateJson.trim()) throw new Error("Gameplay save membutuhkan versi canon dan representasi state.");
  if (!Capacitor.isNativePlatform()) {
    const store = readPreviewGameplaySessions();
    store[record.characterId] = record;
    localStorage.setItem(GAMEPLAY_SESSION_PREVIEW_KEY, JSON.stringify(store));
    return;
  }
  await getDatabase().run(
    "INSERT INTO gameplay_sessions (character_id, snapshot_sha, canon_version, profile_markdown, state_json, state_verified, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(character_id) DO UPDATE SET snapshot_sha = excluded.snapshot_sha, canon_version = excluded.canon_version, profile_markdown = excluded.profile_markdown, state_json = excluded.state_json, state_verified = excluded.state_verified, updated_at = excluded.updated_at;",
    [record.characterId, record.snapshotSha, record.canonVersion, record.profileMarkdown, record.stateJson, record.stateVerified ? 1 : 0, record.updatedAt]
  );
}

export async function getGameplaySessionRecord(characterId: string): Promise<GameplaySessionRecord | null> {
  if (!Capacitor.isNativePlatform()) return readPreviewGameplaySessions()[characterId] ?? null;
  const result = await getDatabase().query(
    "SELECT character_id, snapshot_sha, canon_version, profile_markdown, state_json, state_verified, updated_at FROM gameplay_sessions WHERE character_id = ? LIMIT 1;",
    [characterId]
  );
  const row = result.values?.[0];
  return row ? { characterId: String(row.character_id), snapshotSha: String(row.snapshot_sha), canonVersion: String(row.canon_version), profileMarkdown: String(row.profile_markdown ?? ""), stateJson: String(row.state_json ?? "{}"), stateVerified: Number(row.state_verified) === 1, updatedAt: String(row.updated_at) } : null;
}
