import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from "@capacitor-community/sqlite";

const DATABASE_NAME = "merzkava";
const SCHEMA_VERSION = 2;
let database: SQLiteDBConnection | null = null;

const schema = [
  `CREATE TABLE IF NOT EXISTS characters (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, age INTEGER NOT NULL DEFAULT 0, origin TEXT NOT NULL DEFAULT 'Golden Dragon Empire', background TEXT NOT NULL DEFAULT '', realm TEXT NOT NULL DEFAULT 'Mortal', cultivation_level INTEGER NOT NULL DEFAULT 0, awakened INTEGER NOT NULL DEFAULT 0 CHECK(awakened IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`,
  `CREATE TABLE IF NOT EXISTS character_stats (character_id TEXT PRIMARY KEY NOT NULL, hp_current INTEGER NOT NULL DEFAULT 100, hp_max INTEGER NOT NULL DEFAULT 100, stamina_current INTEGER NOT NULL DEFAULT 100, stamina_max INTEGER NOT NULL DEFAULT 100, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS inventory_items (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, item_key TEXT NOT NULL, item_name TEXT NOT NULL, quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 0), metadata_json TEXT NOT NULL DEFAULT '{}', FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS wallet_ledger (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, currency TEXT NOT NULL CHECK(currency IN ('xc','xs','xg','zj','az')), amount INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`,
  `CREATE TABLE IF NOT EXISTS gameplay_logs (id TEXT PRIMARY KEY NOT NULL, character_id TEXT NOT NULL, category TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE);`
];

export type DatabaseStatus = { mode: "sqlite" | "preview" | "error"; message: string };

export async function initializeDatabase(): Promise<DatabaseStatus> {
  if (!Capacitor.isNativePlatform()) return { mode: "preview", message: "Mode pratinjau browser — penyimpanan lokal perangkat aktif di APK Android." };
  try {
    const connection = new SQLiteConnection(CapacitorSQLite);
    database = await connection.createConnection(DATABASE_NAME, false, "no-encryption", SCHEMA_VERSION, false);
    await database.open();
    for (const statement of schema) await database.execute(statement);
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
