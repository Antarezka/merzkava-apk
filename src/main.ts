import "./style.css";
const splashLogoUrl = new URL("../Untitled78_20261030213901.png", import.meta.url).href;
import { initializeDatabase } from "./database/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./characters/character-repository";
import { validateCharacterDraft } from "./engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { getCanonStatus, loadCanonModule, refreshCanon, type CanonDocument } from "./canon/canon-loader";
import { routeCanonActivity } from "./canon/canon-router";
import { assembleGameplayContext } from "./canon/context-assembler";
import { buildGMInstruction, validateGMResponse, type GMProposal } from "./engine/gm-engine";

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
let canonDocument: CanonDocument | null = null;
let canonBusy = false;
let canonRouteBusy = false;
let canonRouteMessage = "";
let canonRouteDocuments: CanonDocument[] = [];
let gameplayContextText = "";
let gameplayContextMessage = "";
let gameplayContextBusy = false;
let gameplaySnapshot = "";
let gameplayVersion = "";
let gmProposal: GMProposal | null = null;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function canonPanel(): string {
  const status = getCanonStatus();
  const label = status.status === "ready" ? "VERIFIED" : status.status === "cached" ? "CACHED" : "NOT LOADED";
  const routePreviews = canonRouteDocuments.map(document => `<div class="canon-document"><div class="section-heading"><span>${escapeHtml(document.path)}</span><small>${document.commitSha.slice(0,7)}</small></div><pre>${escapeHtml(document.content.slice(0,12000))}${document.content.length > 12000 ? "\\n\\n[Preview limited to 12,000 characters]" : ""}</pre></div>`).join("");
  return `<section class="section-block canon-panel"><div class="section-heading"><span>CANON SOURCE</span><small>${label}</small></div><p class="muted">Public source: Antarezka / merzkava-universe</p><p class="canon-status" role="status">${escapeHtml(canonMessage)}</p><button class="action-button" data-refresh-canon ${canonBusy ? "disabled" : ""}>${canonBusy ? "Checking…" : "Refresh canon"} <span>↻</span></button>
    <form id="canon-route-form" class="canon-module-form"><label for="canon-activity">Route modules for an activity</label><input id="canon-activity" name="activity" placeholder="e.g. travel, combat, Spirit Ring absorption" autocomplete="off" required /><button class="text-button" type="submit" ${canonRouteBusy ? "disabled" : ""}>${canonRouteBusy ? "Routing…" : "Find & load relevant canon ↗"}</button></form>
    ${canonRouteMessage ? `<p class="canon-status" role="status">${escapeHtml(canonRouteMessage)}</p>` : ""}
    ${routePreviews}
    <form id="canon-module-form" class="canon-module-form"><label for="canon-module-path">Load a specific canon module</label><input id="canon-module-path" name="path" placeholder="core/CULTIVATION_SYSTEM.md" autocomplete="off" required /><button class="text-button" type="submit">Load module ↗</button></form>
    ${canonDocument ? `<div class="canon-document"><div class="section-heading"><span>${escapeHtml(canonDocument.path)}</span><small>${canonDocument.commitSha.slice(0,7)}</small></div><pre>${escapeHtml(canonDocument.content.slice(0,12000))}${canonDocument.content.length > 12000 ? "\\n\\n[Preview limited to 12,000 characters]" : ""}</pre></div>` : ""}</section>`;
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
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "gameplay-route-form") {
    event.preventDefault();
    const formData = new FormData(form);
    const activity = String(formData.get("activity") ?? "").trim();
    const characterId = String(formData.get("characterId") ?? "");
    if (!activity || gameplayContextBusy) return;
    gameplayContextBusy = true;
    gameplayContextMessage = "Mengambil modul canon yang relevan…";
    gameplayContextText = "";
    render();
    try {
      const route = await routeCanonActivity(activity, 5);
      const status = getCanonStatus();
      const selectedCharacter = characters.find(character => character.id === characterId) ?? null;
      const context = assembleGameplayContext(route, selectedCharacter, status.commitSha, status.version);
      gameplaySnapshot = context.snapshot;
      gameplayVersion = context.version;
      gmProposal = null;
      gameplayContextText = buildGMInstruction(context);
      gameplayContextMessage = `Context siap: ${context.documents.length} modul dimasukkan, ${context.omittedModules.length} dilewati karena batas ukuran. Snapshot ${context.snapshot || "tidak terverifikasi"}.${route.skipped.length ? " Modul gagal: " + route.skipped.join(" | ") : ""}`;
      const output = root.querySelector<HTMLElement>("#gameplay-context");
      if (output) output.innerHTML = `<p class="canon-status" role="status">${escapeHtml(gameplayContextMessage)}</p><h3>GM instruction ready</h3><p class="muted">Copy this instruction into your AI provider. The app does not send data to an AI service yet.</p><label for="gameplay-context-output">GM prompt (read-only)</label><textarea id="gameplay-context-output" rows="10" readonly>${escapeHtml(gameplayContextText)}</textarea><label for="gm-response">Paste the AI Game Master's JSON response</label><form id="gm-response-form"><textarea id="gm-response" name="response" rows="8" maxlength="24000" placeholder='{"snapshot":"…","version":"…","narration":"…","outcome":"…","canon_basis":[],"proposed_changes":[],"unresolved_questions":[]}' required></textarea><button class="action-button" type="submit">Validate GM response ↗</button></form><div id="gm-result" aria-live="polite"></div><p class="muted">${gameplayContextText.length.toLocaleString()} characters · no game state changes performed</p>`;
    } catch (error) {
      gameplayContextMessage = error instanceof Error ? error.message : "Context gagal disusun.";
      const output = root.querySelector<HTMLElement>("#gameplay-context");
      if (output) output.innerHTML = `<p class="canon-status" role="alert">${escapeHtml(gameplayContextMessage)}</p>`;
    }
    gameplayContextBusy = false;
    return;
  }
  if (form.id === "gm-response-form") {
    event.preventDefault();
    const response = String(new FormData(form).get("response") ?? "");
    const result = validateGMResponse(response, gameplaySnapshot, gameplayVersion);
    const target = root.querySelector<HTMLElement>("#gm-result");
    if (!target) return;
    if (!result.valid) {
      gmProposal = null;
      target.innerHTML = "<p class=\"canon-status\" role=\"alert\">" + escapeHtml(result.errors.join(" ")) + "</p>";
      return;
    }
    gmProposal = result.proposal;
    const list = (items: string[]) => items.length
      ? "<ul>" + items.map(item => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul>"
      : "<p class=\"muted\">None</p>";
    target.innerHTML = "<article class=\"record-card\"><div class=\"record-top\"><span>GM PROPOSAL</span><span class=\"record-status\">VALIDATED · NOT APPLIED</span></div><h3>Story response</h3><p>" + escapeHtml(gmProposal.narration) + "</p><h3>Outcome</h3><p>" + escapeHtml(gmProposal.outcome) + "</p><h3>Canon basis</h3>" + list(gmProposal.canon_basis) + "<h3>Proposed changes (not applied)</h3>" + list(gmProposal.proposed_changes) + "<h3>Unresolved questions</h3>" + list(gmProposal.unresolved_questions) + "<p class=\"canon-status\" role=\"status\">Structure valid. No game state has been changed.</p></article>";
    return;
  }
  if (form.id === "canon-route-form") {
    event.preventDefault();
    const activity = String(new FormData(form).get("activity") ?? "").trim();
    if (!activity || canonRouteBusy) return;
    canonRouteBusy = true;
    canonRouteMessage = "Mencocokkan aktivitas dengan modul di INDEX…";
    canonRouteDocuments = [];
    render();
    try {
      const result = await routeCanonActivity(activity, 5);
      canonRouteDocuments = result.loaded;
      canonRouteMessage = result.loaded.length
        ? `Router memilih ${result.modules.length} modul dan berhasil memuat ${result.loaded.length} dari snapshot ${result.loaded[0].commitSha.slice(0,7)}.${result.skipped.length ? " Gagal: " + result.skipped.join(" | ") : ""}`
        : `Tidak ada modul yang cocok atau modul gagal dimuat.${result.skipped.length ? " " + result.skipped.join(" | ") : ""}`;
    } catch (error) {
      canonRouteMessage = error instanceof Error ? error.message : "Canon Router gagal.";
    }
    canonRouteBusy = false;
    render();
    return;
  }
  if (form.id === "canon-module-form") {
    event.preventDefault();
    const path = String(new FormData(form).get("path") ?? "");
    canonMessage = "Mengambil modul dari commit canon yang terverifikasi…";
    render();
    try {
      canonDocument = await loadCanonModule(path);
      canonMessage = `Modul ${canonDocument.path} berhasil dimuat.`;
    } catch (error) {
      canonMessage = error instanceof Error ? error.message : "Modul gagal dimuat.";
    }
    render();
    return;
  }
  if (form.id !== "character-form") return;
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
  const canonStatus = await refreshCanon();
  canonMessage = canonStatus.message;
  render();
});
