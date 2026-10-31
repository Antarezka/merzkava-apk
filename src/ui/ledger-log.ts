import { canonLabelMarkup, type CanonLabelCategory } from "./canon-labels";
export type LedgerCategory = "wallet" | "inventory" | "hp" | "satiety" | "body" | "equipment" | "cultivation" | "other";
export type LedgerTone = "positive" | "negative" | "neutral";\n\nexport interface LedgerProposalEvent {\n  kind: "item" | "currency";\n  direction: "in" | "out";\n  item?: string;\n  quantity?: number;\n  unit?: string;\n  currency?: "xc" | "xs" | "xg" | "zj" | "az";\n  amount?: number;\n  reason: string;\n}

export interface LedgerEntry {
  id: string;
  characterId: string;
  category: LedgerCategory;
  title: string;
  change: string;
  before?: string;
  after?: string;
  tone: LedgerTone;
  createdAt: string;
  detail?: string;
  labelCategory?: CanonLabelCategory;
  label?: string;
  stage?: string;
}

const STORAGE_PREFIX = "merzkava.ledger-log.v1:";
const MAX_LOG_ENTRIES = 500;
let bubbleHost: HTMLDivElement | null = null;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function storageKey(characterId: string): string {
  return STORAGE_PREFIX + encodeURIComponent(characterId);
}

export function getLedgerLog(characterId: string): LedgerEntry[] {
  if (!characterId) return [];
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(characterId)) ?? "[]");
    return Array.isArray(value) ? value.filter(isLedgerEntry).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];
  } catch {
    return [];
  }
}

function isLedgerEntry(value: unknown): value is LedgerEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<LedgerEntry>;
  const categories: LedgerCategory[] = ["wallet", "inventory", "hp", "satiety", "body", "equipment", "cultivation", "other"];
  const tones: LedgerTone[] = ["positive", "negative", "neutral"];
  const labelCategories: CanonLabelCategory[] = ["spirit-realm", "arcanist-grade", "arcanist-focus", "economic-quality", "artifact-condition", "martial-soul-rarity", "spirit-beast", "beast-trait", "beast-age-grade", "spirit-ring", "spirit-realm-tradition"];
  return typeof entry.id === "string"
    && typeof entry.characterId === "string"
    && typeof entry.category === "string" && categories.includes(entry.category as LedgerCategory)
    && typeof entry.title === "string"
    && typeof entry.change === "string"
    && typeof entry.tone === "string" && tones.includes(entry.tone as LedgerTone)
    && typeof entry.createdAt === "string"
    && (entry.before === undefined || typeof entry.before === "string")
    && (entry.after === undefined || typeof entry.after === "string")
    && (entry.detail === undefined || typeof entry.detail === "string")
    && (entry.labelCategory === undefined || (typeof entry.labelCategory === "string" && labelCategories.includes(entry.labelCategory)))
    && (entry.label === undefined || typeof entry.label === "string")
    && (entry.stage === undefined || typeof entry.stage === "string");
}

export function initializeLedgerNotifications(): void {
  if (bubbleHost?.isConnected) return;
  bubbleHost = document.createElement("div");
  bubbleHost.id = "ledger-bubble-stack";
  bubbleHost.setAttribute("aria-live", "polite");
  bubbleHost.setAttribute("aria-label", "Recent game state changes");
  document.body.append(bubbleHost);
}

function removeBubble(bubble: HTMLElement): void {
  bubble.classList.add("is-popping");
  bubble.addEventListener("animationend", () => bubble.remove(), { once: true });
  window.setTimeout(() => bubble.remove(), 260);
}

function showBubble(entry: LedgerEntry): void {
  initializeLedgerNotifications();
  if (!bubbleHost) return;

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.className = `ledger-bubble tone-${entry.tone}`;
  bubble.setAttribute("aria-label", `${entry.title}: ${entry.change}. Tap to dismiss.`);
  bubble.innerHTML = `
    <span class="ledger-bubble-kicker">${escapeHtml(entry.title)}</span>
    <strong class="ledger-bubble-change">${escapeHtml(entry.change)}</strong>
    ${entry.before || entry.after ? `<span class="ledger-bubble-total">${escapeHtml(entry.before ?? "")}${entry.before && entry.after ? " → " : ""}${escapeHtml(entry.after ?? "")}</span>` : ""}
    ${entry.labelCategory && entry.label ? canonLabelMarkup(entry.labelCategory, entry.label, entry.stage) : ""}
    ${entry.detail ? `<span class="ledger-bubble-detail">${escapeHtml(entry.detail)}</span>` : ""}
  `;
  bubble.addEventListener("click", () => removeBubble(bubble), { once: true });
  bubbleHost.append(bubble);

  while (bubbleHost.children.length > 4) bubbleHost.firstElementChild?.remove();
  window.setTimeout(() => {
    if (bubble.isConnected) removeBubble(bubble);
  }, 5200);
}

export function recordLedgerChange(input: Omit<LedgerEntry, "id" | "createdAt">): LedgerEntry {
  if (!input.characterId.trim()) throw new Error("Ledger entry requires an active character.");
  const entry: LedgerEntry = {
    ...input,
    id: `ledger-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString()
  };
  const entries = [...getLedgerLog(input.characterId), entry].slice(-MAX_LOG_ENTRIES);
  try {
    localStorage.setItem(storageKey(input.characterId), JSON.stringify(entries));
  } catch {
    throw new Error("Ledger could not be saved on this device.");
  }
  showBubble(entry);
  window.dispatchEvent(new CustomEvent<LedgerEntry>("merzkava:ledger-change", { detail: entry }));
  return entry;
}

export function subscribeToLedgerChanges(listener: (entry: LedgerEntry) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<LedgerEntry>).detail);
  window.addEventListener("merzkava:ledger-change", handler);
  return () => window.removeEventListener("merzkava:ledger-change", handler);
}


/** Show a clearly provisional event bubble; this does not write to the ledger or mutate character state. */\nexport function showLedgerProposalBubble(event: LedgerProposalEvent): void {\n  const incoming = event.direction === "in";\n  const label = event.kind === "item" ? (incoming ? "ITEM MASUK" : "ITEM KELUAR") : (incoming ? "UANG MASUK" : "UANG KELUAR");\n  const amount = event.kind === "item" ? `${event.quantity} ${event.unit ?? "×"} · ${event.item}` : `${event.amount} ${event.currency}`;\n  showBubble({\n    id: `proposal-${Date.now()}-${Math.random()}`, characterId: "pending",\n    category: event.kind === "item" ? "inventory" : "wallet", title: `MENUNGGU VERIFIKASI · ${label}`,\n    change: amount, tone: incoming ? "positive" : "negative", createdAt: new Date().toISOString(),\n    detail: `${event.reason} · Belum masuk ledger; menunggu verifikasi canon dan persetujuan pemain.`\n  });\n}\n