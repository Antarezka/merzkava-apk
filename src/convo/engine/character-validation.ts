import type { CharacterDraft } from "../characters/character-repository";

export type ValidationResult =
  | { valid: true; value: CharacterDraft }
  | { valid: false; errors: string[] };

const validOrigins = ["Golden Dragon Empire", "Tianhai Yunzhou", "Beiming Gu"] as const;

export function validateCharacterDraft(input: CharacterDraft): ValidationResult {
  const errors: string[] = [];
  const name = input.name.trim();
  if (name.length < 2) errors.push("Nama karakter minimal 2 karakter.");
  if (name.length > 40) errors.push("Nama karakter maksimal 40 karakter.");
  if (!Number.isInteger(input.age) || input.age < 1 || input.age > 120) errors.push("Usia harus berupa angka bulat antara 1 dan 120.");
  if (!validOrigins.includes(input.origin as typeof validOrigins[number])) errors.push("Pilih salah satu wilayah asal yang tersedia.");
  if (input.background.trim().length > 500) errors.push("Latar belakang maksimal 500 karakter.");
  if (errors.length) return { valid: false, errors };
  return { valid: true, value: { ...input, name } };
}
