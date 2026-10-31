export type CanonLabelCategory =
  | "spirit-realm"
  | "arcanist-grade"
  | "arcanist-focus"
  | "economic-quality"
  | "artifact-condition"
  | "martial-soul-rarity"
  | "spirit-beast"
  | "beast-trait"
  | "beast-age-grade"
  | "spirit-ring"
  | "spirit-realm-tradition";

const palettes: Record<CanonLabelCategory, Record<string, string>> = {
  "spirit-realm": {
    "Spirit Initiate": "#8BC7D9",
    "Spirit Adept": "#63C9B8",
    "Spirit Elder": "#8CCB83",
    "Spirit Monarch": "#C5D779",
    "Spirit King": "#E5C36C",
    "Spirit Ancestor": "#E9A36B",
    "Spirit Emperor": "#E78B82",
    "Spirit Sovereign": "#C69BEA",
    "Spirit Primordial": "#F0D6A0"
  },
  "arcanist-grade": {
    "Arcanist Grade 1": "#9AB8C7",
    "Arcanist Grade 2": "#88B8C5",
    "Arcanist Grade 3": "#78BDBE",
    "Arcanist Grade 4": "#6EBFAF",
    "Arcanist Grade 5": "#65C5A3",
    "Arcanist Grade 6": "#66C99A",
    "Arcanist Grade 7": "#7CCB8C",
    "Arcanist Grade 8": "#9ACB7E",
    "Arcanist Grade 9": "#B6C977",
    "Arcanist Grade 10": "#D5C36F"
  },
  "arcanist-focus": {
    "Pemula": "#A5ADB8",
    "Initiate": "#8BC7D9",
    "Beginner": "#65C8B8",
    "Ordinary": "#91BD83",
    "Ahli": "#B59AE5",
    "Expert": "#E8C47B"
  },
  "economic-quality": {
    "Common": "#A6ADB5",
    "Standard": "#91B7A9",
    "Good": "#80C7A1",
    "Excellent": "#79BCE0",
    "Premium": "#8C9FEA",
    "Rare-grade quality": "#B294E6",
    "Superior": "#D69BE0",
    "Peak quality": "#E6A5B9",
    "Legendary quality": "#F0C77E"
  },
  "artifact-condition": {
    "Buruk": "#E66F70",
    "Rendah": "#E99A66",
    "Standar": "#A8B0BA",
    "Baik": "#79C99A",
    "Origin": "#70C9D6"
  },
  "martial-soul-rarity": {
    "Common": "#A6ADB5",
    "Uncommon": "#83C99A",
    "Rare": "#75B9E8",
    "Epic": "#AD91E8",
    "Legendary": "#E8B86D",
    "Myth": "#ED8BAF"
  },
  "spirit-beast": {
    "Ordinary Beast": "#A6ADB5",
    "Spirit Beast": "#83C99A",
    "Supreme Beast": "#A98CE0",
    "Demonic Beast": "#E4777D",
    "Heavenly Beast": "#E8C77E"
  },
  "beast-trait": {
    "Rare": "#AD91E8",
    "Unique": "#AD91E8",
    "Mutated": "#70C9D6",
    "Corrupted": "#A83F48"
  },
  "beast-age-grade": {
    "Beast Age Grade 1": "#9AAFC0",
    "Beast Age Grade 2": "#7FAFBE",
    "Beast Age Grade 3": "#70BFAF",
    "Beast Age Grade 4": "#83C38C",
    "Beast Age Grade 5": "#B6C46F",
    "Beast Age Grade 6": "#D9B66A",
    "Beast Age Grade 7": "#DE926D",
    "Beast Age Grade 8": "#C47FAD",
    "Beast Age Grade 9": "#E6D39A"
  },
  "spirit-ring": {
    "Maroon": "#800000",
    "Gold": "#D4AF37",
    "Purple": "#8B55B7",
    "Pink": "#E98CB5",
    "Dark Vienna": "#30263C"
  },
  "spirit-realm-tradition": {
    "Soul-Nyuma": "#75C9B0",
    "Soul-Zoun": "#B18AE8"
  }
};

const neutral = "#A8B0BA";

export function getCanonLabelColor(category: CanonLabelCategory, label: string): string {
  if (/^unknown$|^\?+$/i.test(label.trim())) return neutral;
  if (category === "arcanist-grade" || category === "beast-age-grade" || category === "economic-quality") {
    const number = label.match(/(?:Grade\s*|Tier\s*)?(\d{1,2})$/i)?.[1];
    if (number) {
      if (category === "arcanist-grade") return palettes[category]["Arcanist Grade " + Number(number)] ?? neutral;
      if (category === "beast-age-grade") return palettes[category]["Beast Age Grade " + Number(number)] ?? neutral;
      const quality = ["Common", "Standard", "Good", "Excellent", "Premium", "Rare-grade quality", "Superior", "Peak quality", "Legendary quality"][Number(number) - 1];
      return quality ? palettes[category][quality] : neutral;
    }
  }
  return palettes[category][label.trim()] ?? neutral;
}
export function canonLabelStyle(category: CanonLabelCategory, label: string): string {
  const color = getCanonLabelColor(category, label);
  return `--canon-label-color:${color}`;
}

export function canonLabelMarkup(category: CanonLabelCategory, label: string, stage?: string): string {
  const safeLabel = label.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
  const safeStage = stage ? stage.replace(/[&<>"']/g, "") : "";
  return `<span class="canon-label" data-canon-category="${category}"${safeStage ? ` data-canon-stage="${safeStage}"` : ""} style="${canonLabelStyle(category, label)}">${safeLabel}</span>`;
}
