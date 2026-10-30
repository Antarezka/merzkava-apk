import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from "@capacitor-community/sqlite";

const DATABASE_NAME = "merzkava";
const SCHEMA_VERSION = 3;
let database: SQLiteDBConnection | null = null;

const schema = [
  `CREATE TABLE IF NOT EXISTS characters (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, age INTEGER NOT NULL DEFAULT 0, origin TEXT NOT NULL DEFAULT 'Golden Dragon Empire', background TEXT NOT NULL DEFAULT '', realm TEXT NOT NULL DEFAULT 'Mortal', cultivation_level INTEGER NOT NULL DEFAULT 0, awakened INTEGER NOT NULL DEFAULT 0 CHECK(awakened IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`,
  `CREATE TABLE IF NOT EXISTS character_stats (character_id TEXT PRIMARY KEY NOT NULL, hp_current INTEGER NOT NULL DEFAULT 100, hp_max INTEGER NOT NULL DEFAULT 100, stamina_current INTEGER NOT NULL DEFAULT 100, stamina_max INTEGER NOT NULL DEFAULT 100, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS inventory_items (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, item_key TEXT NOT NULL, item_name TEXT NOT NULL, quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 0), metadata_json TEXT NOT NULL DEFAULT '{}', FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS wallet_ledger (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, currency TEXT NOT NULL CHECK(currency IN ('xc','xs','xg','zj','az')), amount INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS gameplay_logs (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, category TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS canon_documents (path TEXT PRIMARY KEY NOT NULL, commit_sha TEXT NOT NULL, content TEXT NOT NULL, fetched_at TEXT NOT NULL);`
];

export type DatabaseStatus = { mode: "sqlite" | "preview" | "error"; message: string };

export async function initializeDatabase(): Promise<DatabaseStatus> {
  if (!Capacitor.isNativePlatform()) return { mode: "preview", message: "Mode pratinjau browser — penyimpanan lokal perangkat aktif di APK Android." };
  try {
    const connection = new SQLiteConnection(CapacitorSQLite);
    database = await connection.createConnection(DATABASE_NAME, false, "no-encryption", SCHEMA_VERSION, false);
    await database.open();
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

const CANON_PREVIEW_KEY = "merzkava.canon.documents.v1";

function readPreviewCanon(): CachedCanonDocument[] {
  try { return JSON.parse(localStorage.getItem(CANON_PREVIEW_KEY) ?? "[]") as CachedCanonDocument[]; }
  catch { return []; }
}

export async function cacheCanonDocument(document: CachedCanonDocument): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    const documents = readPreviewCanon().filter(item => item.path !== document.path);
    documents.push(document);
    localStorage.setItem(CANON_PREVIEW_KEY, JSON.stringify(documents));
    return;
  }
  await getDatabase().run(
    "INSERT INTO canon_documents (path, commit_sha, content, fetched_at) VALUES (?, ?, ?, ?) ON CONFLICT(path) DO UPDATE SET commit_sha = excluded.commit_sha, content = excluded.content, fetched_at = excluded.fetched_at;",
    [document.path, document.commitSha, document.content, document.fetchedAt]
  );
}

export async function getCachedCanonDocument(path: string): Promise<CachedCanonDocument | null> {
  if (!Capacitor.isNativePlatform()) return readPreviewCanon().find(item => item.path === path) ?? null;
  const result = await getDatabase().query(
    "SELECT path, commit_sha, content, fetched_at FROM canon_documents WHERE path = ? LIMIT 1;",
    [path]
  );
  const row = result.values?.[0];
  return row ? { path: String(row.path), commitSha: String(row.commit_sha), content: String(row.content), fetchedAt: String(row.fetched_at) } : null;
}
