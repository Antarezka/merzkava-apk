import "./style.css";
const splashLogoUrl = new URL("../Untitled78_20261030213901.png", import.meta.url).href;
import { initializeDatabase } from "./database/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./characters/character-repository";
import { validateCharacterDraft } from "./engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { getCanonStatus, loadCanonModule, refreshCanon, type CanonDocument } from "./canon/canon-loader";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");
const root = app;

function showOpeningSplash(): void {
  const splash = document.createElement("div");
  splash.className = "opening-splash";
  splash.setAttribute("role", "status");
  splash.setAttribute("aria-label", "Opening Merzkava Universe");
  splash.innerHTML = `
    <div class="splash-content">
      <img class="splash-logo" src="${splashLogoUrl}" alt="Black Kitty, the Merzkava mascot" />
      <p class="splash-kicker">MERZKAVA UNIVERSE</p>
      <h1>Merzkava</h1>
      <span class="splash-rule" aria-hidden="true"></span>
      <small class="splash-tagline">THE WORLD AWAITS</small>
    </div>`;
  splash.addEventListener("animationend", event => {
    if (event.target === splash && event.animationName === "splash-curtain") {
      splash.remove();
    }
  });
  document.body.append(splash);
}

showOpeningSplash();

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "gameplay", label: "Play", icon: "✧" },
  { id: "character", label: "Character", icon: "◉" }, { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Map", icon: "⌖" }, { id: "journal", label: "Journal", icon: "☷" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

let activeScreen: ScreenId = "home";
let databaseMessage = "Checking local storage…";
let characters: Character[] = [];
let notice = "";
let canonMessage = "Canon belum dimuat.";
let canonDetails = "";
let canonDocument: CanonDocument | null = null;
let canonBusy = false;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function canonPanel(): string {
  const status = getCanonStatus();
  const label = status.status === "ready" ? "VERIFIED" : status.status === "cached" ? "CACHED" : "NOT LOADED";
  return `<section class="section-block canon-panel"><div class="section-heading"><span>CANON SOURCE</span><small>${label}</small></div><p class="muted">Public source: Antarezka / merzkava-universe</p><p class="canon-status" role="status">${escapeHtml(canonMessage)}</p><button class="action-button" data-refresh-canon ${canonBusy ? "disabled" : ""}>${canonBusy ? "Checking…" : "Refresh canon"} <span>↻</span></button><form id="canon-module-form" class="canon-module-form"><label for="canon-module-path">Load a canon module</label><input id="canon-module-path" name="path" placeholder="core/CULTIVATION_SYSTEM.md" autocomplete="off" required /><button class="text-button" type="submit">Load module ↗</button></form>${canonDocument ? `<div class="canon-document"><div class="section-heading"><span>${escapeHtml(canonDocument.path)}</span><small>${canonDocument.commitSha.slice(0,7)}</small></div><pre>${escapeHtml(canonDocument.content.slice(0,12000))}${canonDocument.content.length > 12000 ? "\\n\\n[Preview limited to 12,000 characters]" : ""}</pre></div>` : ""}</section>`;
}

function render(): void {
  root.innerHTML = `<div class="app-shell">
    <header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></header>
    <main class="main-content">${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}${renderScreen(activeScreen, characters)}${activeScreen === "settings" ? canonPanel() : ""}</main>
    <nav class="bottom-nav" aria-label="Main navigation">${navigation.map(item => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span>${item.icon}</span><small>${item.label}</small></button>`).join("")}</nav>
    <div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>
  </div>`;
}

async function refreshCharacters(): Promise<void> {
  try { characters = await listCharacters(); }
  catch (error) { notice = error instanceof Error ? error.message : "Could not load characters."; }
}

root.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const refreshCanonButton = target.closest<HTMLButtonElement>("[data-refresh-canon]");
  if (refreshCanonButton && !canonBusy) {
    canonBusy = true; canonMessage = "Memeriksa pin README dan mengambil INDEX…"; render();
    const status = await refreshCanon();
    canonBusy = false; canonMessage = status.message; render();
    return;
  }
  const deleteButton = target.closest<HTMLButtonElement>("[data-delete-character]");
  if (deleteButton?.dataset.deleteCharacter) {
    try {
      await deleteCharacter(deleteButton.dataset.deleteCharacter);
      await refreshCharacters();
      notice = "Character deleted.";
      render();
    } catch (error) { notice = error instanceof Error ? error.message : "Could not delete character."; render(); }
    return;
  }
  const button = target.closest<HTMLButtonElement>("[data-screen]");
  const nextScreen = button?.dataset.screen as ScreenId | undefined;
  if (!nextScreen || !navigation.some(item => item.id === nextScreen)) return;
  activeScreen = nextScreen;
  notice = "";
  render();
});

root.addEventListener("submit", async (event: SubmitEvent) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "character-form") return;
  event.preventDefault();
  const data = new FormData(form);
  const draft = {
    name: String(data.get("name") ?? ""),
    age: Number(data.get("age")),
    origin: String(data.get("origin") ?? ""),
    background: String(data.get("background") ?? "")
  };
  const validation = validateCharacterDraft(draft);
  const errorNode = form.querySelector<HTMLElement>("#character-error");
  if (!validation.valid) {
    if (errorNode) errorNode.textContent = validation.errors.join(" ");
    return;
  }
  try {
    await createCharacter(validation.value);
    await refreshCharacters();
    notice = "Character created and saved on this device.";
    render();
  } catch (error) {
    if (errorNode) errorNode.textContent = error instanceof Error ? error.message : "Could not save character.";
  }
});

render();
void initializeDatabase().then(async status => {
  databaseMessage = status.message;
  await refreshCharacters();
  render();
});
