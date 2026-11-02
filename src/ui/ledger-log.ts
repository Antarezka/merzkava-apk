import { animate } from "animejs";
import { canonLabelMarkup, type CanonLabelCategory } from "./canon-labels";
export type LedgerCategory = "wallet" | "inventory" | "hp" | "satiety" | "body" | "equipment" | "cultivation" | "other";
export type LedgerTone = "positive" | "negative" | "neutral";

export interface LedgerProposalEvent {
  kind: "item" | "currency";
  direction: "in" | "out";
  item?: string;
  quantity?: number;
  unit?: string;
  currency?: "xc" | "xs" | "xg" | "zj" | "az";
  amount?: number;
  reason: string;
}

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

const bubbleMotion = new WeakMap<HTMLElement, ReturnType<typeof animate>>();
const bubbleTimers = new WeakMap<HTMLElement, number>();

function removeBubble(bubble: HTMLElement): void {
  if (bubble.dataset.popping === "true") return;
  bubble.dataset.popping = "true";
  bubbleMotion.get(bubble)?.pause();
  const timer = bubbleTimers.get(bubble);
  if (timer) window.clearTimeout(timer);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bubble.remove();
    return;
  }

  bubble.classList.add("is-popping");
  const flakes: HTMLSpanElement[] = [];
  for (let index = 0; index < 14; index += 1) {
    const flake = document.createElement("span");
    flake.className = "ledger-snowflake";
    flake.setAttribute("aria-hidden", "true");
    bubble.append(flake);
    flakes.push(flake);
  }

  animate(bubble, {
    scale: [1, 1.16, 0.72],
    opacity: [1, 0.72, 0],
    filter: ["blur(0px)", "blur(2px)", "blur(5px)"],
    duration: 430,
    ease: "outCubic",
    onComplete: () => bubble.remove()
  });

  flakes.forEach((flake, index) => {
    const angle = (Math.PI * 2 * index) / flakes.length;
    const distance = 24 + (index % 4) * 13;
    animate(flake, {
      translateX: Math.cos(angle) * distance,
      translateY: Math.sin(angle) * distance - 7,
      scale: [0.45, 1, 0.12],
      opacity: [0, 0.95, 0],
      rotate: (index % 2 ? 1 : -1) * (90 + index * 17),
      duration: 360 + (index % 4) * 65,
      delay: index % 3 * 18,
      ease: "outCubic"
    });
  });
}

function floatBubble(bubble: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const motion = animate(bubble, {
    translateX: [0, -13, 8, -9, 0],
    translateY: [0, -15, -33, -48, -66],
    rotate: [-1.4, 1.8, -1.2, 1.5, 0],
    scale: [0.96, 1.015, 0.99, 1.02, 0.98],
    duration: 5000,
    ease: "inOutSine"
  });
  bubbleMotion.set(bubble, motion);
}

function showBubble(entry: LedgerEntry): void {
  initializeLedgerNotifications();
  if (!bubbleHost) return;

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.className = `ledger-bubble tone-${entry.tone}`;
  const lane = bubbleHost.children.length % 4;
  bubble.style.right = `${14 + lane * 22}px`;
  bubble.style.bottom = `${18 + lane * 13}px`;
  bubble.setAttribute("aria-label", `${entry.title}: ${entry.change}. Tap to pop and dismiss.`);
  bubble.innerHTML = `
    <span class="ledger-bubble-glint" aria-hidden="true"></span>
    <span class="ledger-bubble-kicker">${escapeHtml(entry.title)}</span>
    <strong class="ledger-bubble-change">${escapeHtml(entry.change)}</strong>
    ${entry.before || entry.after ? `<span class="ledger-bubble-total">${escapeHtml(entry.before ?? "")}${entry.before && entry.after ? " → " : ""}${escapeHtml(entry.after ?? "")}</span>` : ""}
    ${entry.labelCategory && entry.label ? canonLabelMarkup(entry.labelCategory, entry.label, entry.stage) : ""}
    ${entry.detail ? `<span class="ledger-bubble-detail">${escapeHtml(entry.detail)}</span>` : ""}
  `;
  bubble.addEventListener("click", () => removeBubble(bubble), { once: true });
  bubbleHost.append(bubble);
  floatBubble(bubble);

  while (bubbleHost.children.length > 4) {
    const oldest = bubbleHost.firstElementChild;
    if (oldest instanceof HTMLElement) removeBubble(oldest);
  }
  bubbleTimers.set(bubble, window.setTimeout(() => {
    if (bubble.isConnected) removeBubble(bubble);
  }, 5200));
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

/** Show a clearly provisional event bubble; this does not write to the ledger or mutate character state. */
export function showLedgerProposalBubble(event: LedgerProposalEvent): void {
  const incoming = event.direction === "in";
  const label = event.kind === "item" ? (incoming ? "ITEM MASUK" : "ITEM KELUAR") : (incoming ? "UANG MASUK" : "UANG KELUAR");
  const amount = event.kind === "item" ? `${incoming ? "+" : "−"}${event.quantity} ${event.unit ?? "×"} · ${event.item}` : `${incoming ? "+" : "−"}${event.amount} ${event.currency}`;
  showBubble({
    id: `proposal-${Date.now()}-${Math.random()}`, characterId: "pending",
    category: event.kind === "item" ? "inventory" : "wallet", title: label,
    change: amount, tone: incoming ? "positive" : "negative", createdAt: new Date().toISOString(),
    detail: `Belum disahkan · ${event.reason}`
  });
}
