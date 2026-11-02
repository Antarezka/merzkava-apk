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
  const hp = f.HP.match(/^(\d+)\s*\/\s*(\d+)/);
  if (!hp || Number(hp[2]) <= 0 || Number(hp[1]) > Number(hp[2])) errors.push("HP harus berbentuk current/max dan current tidak boleh melebihi maksimum.");
  const satiety = f.Satiety.match(/^(\d+)\s*\/\s*100/);
  if (!satiety || Number(satiety[1]) > 100) errors.push("Satiety harus berada pada rentang 0–100 dengan format N/100.");
  if (!/^\d+\s*xc\s*\|\s*\d+\s*xs\s*\|\s*\d+\s*xg\s*\|\s*\d+\s*zj\s*\|\s*\d+\s*az(?:\s|$)/i.test(f["Wallet (wealth)"])) {
    errors.push("Wallet harus memakai urutan xc | xs | xg | zj | az dan nominal bilangan bulat.");
  }
  if (!/^\d+(?:\.\d+)?%\s*\/\s*\d+(?:\.\d+)?%(?:\s|$)/.test(f["Sync progress"])) errors.push("Sync progress harus berbentuk persentase saat ini/cap.");
  for (const field of PROFILE_FIELDS) if (!f[field].trim()) errors.push("Field profil tidak boleh kosong: " + field + ".");
  if (!/^(?:``)?[^`]+(?:``)?\s*\|\s*(?:\?+|\d+|∞)\s*Day left$/i.test(f["Spirit Ring Absorption"])) errors.push("Spirit Ring Absorption harus memakai format ``status`` | Day left.");
  if (!f.Nama.trim()) errors.push("Nama karakter tidak boleh kosong.");
  if (!f["Spirit Realm"].trim()) errors.push("Spirit Realm tidak boleh kosong.");
  if (!f["Spirit Ring Absorption"].trim()) errors.push("Spirit Ring Absorption tidak boleh kosong.");
  if (!f["Arcanist Grade"].trim() || !f["Arcanist Focus"].trim()) errors.push("Arcanist Grade dan Arcanist Focus wajib diisi.");
  return errors;
}


export const RESPONSE_PANEL_HEADERS = [
  "◈━━┫ PROFIL KARAKTER ┣━━◈",
  "◈━━┫ INV & KEUANGAN ┣━━◈",
  "◈━━┫ TEKNIK & TUJUAN ┣━━◈",
  "◈━━┫ CATATAN PEMAIN & KONSISTENSI ┣━━◈"
] as const;

const RESPONSE_FIELD_ORDER: ProfileField[] = [
  "Nama", "Usia", "Spirit Realm", "Sync progress", "Spirit Ring Absorption",
  "Martial Soul", "Arcanist Grade", "Arcanist Focus", "HP", "Satiety", "Qi",
  "Kondisi Tubuh", "Equipment", "Inventory", "Assets Bangunan", "Wallet (wealth)",
  "Teknik / Kemampuan", "Tujuan Saat Ini"
];

export interface GameplayResponseProfile {
  profile: ParsedCharacterProfile;
  panels: {
    character: string;
    inventory: string;
    techniques: string;
    continuity: string;
  };
  errors: string[];
}

function findFieldLines(section: string, fields: ProfileField[]): { values: Partial<Record<ProfileField, string>>; errors: string[] } {
  const values: Partial<Record<ProfileField, string>> = {};
  const errors: string[] = [];
  for (const field of fields) {
    const escaped = field.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
    const matches = [...section.matchAll(new RegExp("^" + escaped + ":\\s*(.*)$", "gm"))];
    if (matches.length !== 1) {
      errors.push(matches.length === 0 ? "Field panel hilang: " + field + "." : "Field panel duplikat: " + field + ".");
    } else {
      values[field] = cleanValue(matches[0][1]);
    }
  }
  return { values, errors };
}

/** Parse the four literal player-facing panels inside the GM's complete response, not the source profile file. */
export function parseGameplayResponseProfile(response: string): GameplayResponseProfile {
  const errors: string[] = [];
  const positions = RESPONSE_PANEL_HEADERS.map(header => response.indexOf(header));
  if (positions.some(position => position < 0)) errors.push("Respons GM wajib memuat keempat panel profil resmi.");
  if (positions.every(position => position >= 0) && positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    errors.push("Urutan empat panel respons GM tidak sesuai template resmi.");
  }
  const section = (start: number, end: number) => response.slice(start, end);
  const boundaries = positions.map((position, index) => {
    const next = positions[index + 1] ?? response.length;
    return position < 0 ? "" : section(position, next);
  });
  const panelFields: ProfileField[][] = [
    RESPONSE_FIELD_ORDER.slice(0, 13),
    RESPONSE_FIELD_ORDER.slice(13, 16),
    RESPONSE_FIELD_ORDER.slice(16, 18),
    []
  ];
  const values: Partial<Record<ProfileField, string>> = {};
  for (let i = 0; i < 3; i++) {
    if (!boundaries[i]) continue;
    const parsed = findFieldLines(boundaries[i], panelFields[i]);
    const fieldPositions = panelFields[i].map(field => boundaries[i].indexOf(field + ":"));
    if (fieldPositions.some((position, index) => position < 0 || (index > 0 && position <= fieldPositions[index - 1]))) {
      errors.push("Urutan field pada panel ke-" + (i + 1) + " tidak sesuai template resmi.");
    }
    Object.assign(values, parsed.values);
    errors.push(...parsed.errors);
  }
  const requiredFrames = [
    ["╱━━━━━━━━━━━━━━━━━━━━━━╲", "╲━━━━━━━━━━━━━━━━━━━━━━╱"],
    ["╱━━━━━━━━━━━━━━━━━━━━━━╲", "╲━━━━━━━━━━━━━━━━━━━━━━╱"],
    ["╱━━━━━━━━━━━━━━━━━━━━╲", "╲━━━━━━━━━━━━━━━━━━━━╱"],
    ["╱━━━━━━━━━━━━━━━━━━━━━━╲", "╲━━━━━━━━━━━━━━━━━━━━━━╱"]
  ];
  for (let i = 0; i < 4; i++) {
    if (boundaries[i] && requiredFrames[i].some(frame => !boundaries[i].includes(frame))) {
      errors.push("Bingkai panel ke-" + (i + 1) + " tidak sama dengan kerangka literal.");
    }
  }
  if (boundaries[3] && !/╲━━━━━━━━━━━━━━━━━━━━━━╱/.test(boundaries[3])) {
    errors.push("Panel CATATAN PEMAIN & KONSISTENSI tidak memiliki bingkai penutup resmi.");
  }
  const ringStatus = values["Spirit Ring Absorption"] ?? "";
  if (!/^``[^`]+``\s*\|\s*(?:\?+|\d+|∞)\s*Day left$/i.test(ringStatus)) {
    errors.push("Spirit Ring Absorption pada panel gameplay wajib memakai token status ber-double-backtick dan format Day left kanonis.");
  }
  const missing = RESPONSE_FIELD_ORDER.filter(field => typeof values[field] !== "string");
  if (missing.length) errors.push(...missing.map(field => "Nilai panel belum terbaca: " + field + "."));
  const fields = Object.fromEntries(RESPONSE_FIELD_ORDER.map(field => [field, values[field] ?? ""])) as Record<ProfileField, string>;
  return {
    profile: { fields, source: "markdown" },
    panels: {
      character: boundaries[0] ?? "",
      inventory: boundaries[1] ?? "",
      techniques: boundaries[2] ?? "",
      continuity: boundaries[3] ?? ""
    },
    errors
  };
}
