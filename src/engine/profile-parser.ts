export const PROFILE_FIELDS = [
  "Nama", "Usia", "Spirit Realm", "Sync progress", "Spirit Ring Absorption",
  "Martial Soul", "Arcanist Grade", "Arcanist Focus", "HP", "Satiety", "Qi",
  "Kondisi Tubuh", "Equipment", "Inventory", "Assets Bangunan", "Wallet (wealth)",
  "Teknik / Kemampuan", "Tujuan Saat Ini"
] as const;

export type ProfileField = typeof PROFILE_FIELDS[number];
export type ParsedCharacterProfile = {
  fields: Record<ProfileField, string>;
  source: "markdown";
};

export type ProfileParseResult =
  | { valid: true; profile: ParsedCharacterProfile }
  | { valid: false; errors: string[] };

function cleanValue(value: string): string {
  return value.trim().replace(/^\`\`([\s\S]*)\`\`$/, "$1").replace(/^\*\*([\s\S]*)\*\*$/, "$1").trim();
}

/** Read only the canonical profile bullets; never infer absent fields from local UI defaults. */
export function parseCharacterProfile(markdown: string): ProfileParseResult {
  if (!markdown.trim()) return { valid: false, errors: ["Sumber profil kosong; state karakter tidak dapat direkonstruksi."] };
  const allowed = new Set<string>(PROFILE_FIELDS);
  const found = new Map<ProfileField, string>();
  const duplicates: string[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\s*[-*]\s+\*\*(.+?)\*\*\s*:?[ \t]*(.*?)\s*$/);
    if (!match) continue;
    const label = match[1].trim().replace(/:$/, "").trim();
    if (!allowed.has(label)) continue;
    const field = label as ProfileField;
    if (found.has(field)) { duplicates.push(field); continue; }
    found.set(field, cleanValue(match[2]));
  }
  const missing = PROFILE_FIELDS.filter(field => !found.has(field));
  const errors = [
    ...missing.map(field => "Field profil wajib tidak ditemukan: " + field + "."),
    ...[...new Set(duplicates)].map(field => "Field profil muncul lebih dari sekali: " + field + ".")
  ];
  if (errors.length) return { valid: false, errors };
  const fields = Object.fromEntries(PROFILE_FIELDS.map(field => [field, found.get(field) ?? ""])) as Record<ProfileField, string>;
  return { valid: true, profile: { fields, source: "markdown" } };
}

export function validateCharacterProfile(profile: ParsedCharacterProfile): string[] {
  const f = profile.fields;
  const errors: string[] = [];
  const hp = f.HP.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!hp || Number(hp[2]) <= 0 || Number(hp[1]) > Number(hp[2])) errors.push("HP harus berbentuk current/max dan current tidak boleh melebihi maksimum.");
  const satiety = f.Satiety.match(/^(\d+)\s*\/\s*100$/);
  if (!satiety || Number(satiety[1]) > 100) errors.push("Satiety harus berada pada rentang 0–100 dengan format N/100.");
  if (!/^\d+\s*xc\s*\|\s*\d+\s*xs\s*\|\s*\d+\s*xg\s*\|\s*\d+\s*zj\s*\|\s*\d+\s*az$/i.test(f["Wallet (wealth)"])) {
    errors.push("Wallet harus memakai urutan xc | xs | xg | zj | az dan nominal bilangan bulat.");
  }
  if (!/^\d+(?:\.\d+)?%\s*\/\s*\d+(?:\.\d+)?%$/.test(f["Sync progress"])) errors.push("Sync progress harus berbentuk persentase saat ini/cap.");
  if (!f.Nama.trim()) errors.push("Nama karakter tidak boleh kosong.");
  if (!f["Spirit Realm"].trim()) errors.push("Spirit Realm tidak boleh kosong.");
  if (!f["Spirit Ring Absorption"].trim()) errors.push("Spirit Ring Absorption tidak boleh kosong.");
  if (!f["Arcanist Grade"].trim() || !f["Arcanist Focus"].trim()) errors.push("Arcanist Grade dan Arcanist Focus wajib diisi.");
  return errors;
}
