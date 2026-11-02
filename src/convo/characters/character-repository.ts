import { Capacitor } from "@capacitor/core";
import { getDatabase } from "../../shared/database";

export interface Character {
  id: string;
  name: string;
  age: number;
  origin: string;
  background: string;
  realm: string;
  cultivationLevel: number;
  awakened: boolean;
  createdAt: string;
  registryPath?: string;
  registryCommitSha?: string;
  profileMarkdown?: string;
}

export interface CharacterDraft {
  name: string;
  age: number;
  origin: string;
  background: string;
}

const STORAGE_KEY = "merzkava.characters.v1";

function readPreviewCharacters(): Character[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Character[];
  } catch {
    return [];
  }
}

function writePreviewCharacters(characters: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

export async function listCharacters(): Promise<Character[]> {
  if (!Capacitor.isNativePlatform()) return readPreviewCharacters();
  const db = getDatabase();
  const result = await db.query(
    "SELECT id, name, age, origin, background, realm, cultivation_level, awakened, created_at FROM characters ORDER BY created_at DESC;"
  );
  return (result.values ?? []).map(row => ({
    id: String(row.id),
    name: String(row.name),
    age: Number(row.age),
    origin: String(row.origin),
    background: String(row.background ?? ""),
    realm: String(row.realm),
    cultivationLevel: Number(row.cultivation_level),
    awakened: Number(row.awakened) === 1,
    createdAt: String(row.created_at)
  }));
}

export async function createCharacter(draft: CharacterDraft): Promise<Character> {
  const character: Character = {
    id: crypto.randomUUID(),
    name: draft.name.trim(),
    age: draft.age,
    origin: draft.origin,
    background: draft.background.trim(),
    realm: "Mortal",
    cultivationLevel: 0,
    awakened: false,
    createdAt: new Date().toISOString()
  };

  if (!Capacitor.isNativePlatform()) {
    const characters = readPreviewCharacters();
    characters.unshift(character);
    writePreviewCharacters(characters);
    return character;
  }

  const db = getDatabase();
  // Character and its initial stats form one logical record: never leave a
  // half-created character if the second insert fails.
  await db.execute("BEGIN TRANSACTION;");
  try {
    await db.run(
      "INSERT INTO characters (id, name, age, origin, background, realm, cultivation_level, awakened, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [character.id, character.name, character.age, character.origin, character.background, character.realm, 0, 0, character.createdAt, character.createdAt]
    );
    await db.run(
      "INSERT INTO character_stats (character_id, hp_current, hp_max, stamina_current, stamina_max) VALUES (?, 100, 100, 100, 100);",
      [character.id]
    );
    await db.execute("COMMIT;");
  } catch (error) {
    try {
      await db.execute("ROLLBACK;");
    } catch {
      // Preserve the original insert failure; the database layer reports rollback failures separately.
    }
    throw error;
  }
  return character;
}

export async function deleteCharacter(id: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    writePreviewCharacters(readPreviewCharacters().filter(character => character.id !== id));
    return;
  }
  await getDatabase().run("DELETE FROM characters WHERE id = ?;", [id]);
}
