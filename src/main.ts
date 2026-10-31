im
async function refreshPlayerRegistry(): Promise<void> {
  if (playerRegistryBusy) return;
  playerRegistryBusy = true;
  playerRegistryMessage = "Mengambil daftar karakter dari players.md…";
  try {
    const result = await refreshLatestPlayerRegistry();
    registeredCharacters = result.players.map(player => ({
      id: "registry:" + player.path,
      name: player.name,
      age: player.age ?? 0,
      origin: "Registry",
      background: "",
      realm: player.realm,
      cultivationLevel: 0,
      awakened: false,
      createdAt: "",
      registryPath: player.path
    }));
    playerRegistryMessage = `${registeredCharacters.length} karakter dari players.md · snapshot ${result.commitSha}`;
    const statusNode = root.querySelector<HTMLElement>("#player-registry-status");
    if (statusNode) statusNode.textContent = playerRegistryMessage;
    if (activeScreen === "character" || activeScreen === "gameplay") render();
  } catch (error) {
    playerRegistryMessage = error instanceof Error ? error.message : "Gagal memuat players.md.";
    const statusNode = root.querySelector<HTMLElement>("#player-registry-status");
    if (statusNode) statusNode.textContent = playerRegistryMessage;
    notice = playerRegistryMessage;
  } finally {
    playerRegistryBusy = false;
  }
}
port "./style.css";
import { cancelOpeningSequence, playButtonSound, playOpeningSequence } from "./audio/sound-effects";
const splashLogoUrl = new URL("../Untitled78_20261030213901.png", import.meta.url).href;
import { initializeDatabase } from "./database/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./characters/character-repository";
import { validateCharacterDraft } from "./engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { activateCanonSnapshot, getCanonIndex, getCanonStatus, loadCanonModule, loadPlayerRegistry, loadRegisteredPlayerProfile, refreshCanon, refreshLatestPlayerRegistry, type CanonDocument } from "./canon/canon-loader";
import { routeCanonActivity } from "./canon/canon-router";
import { assembleGameplayContext } from "./canon/context-assembler";
import { requestGMProposal, validateGMResponse, type GMProposal } from "./engine/gm-engine";
import { getAuthSession, isSupabaseConfigured, restoreAuthSession, signInWithPassword, signOut } from "./auth/supabase-auth";
import { GatewayGMProvider, isGMGatewayConfigured } from "./engine/gateway-gm-provider";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");
const root = app;

function showOpeningSplash(): HTMLDivElement {
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
    if (event.target === splash && event.animationName === "splash-curtain") splash.remove();
  });
  document.body.append(splash);
  return splash;
}

const openingSplash = showOpeningSplash();
let openingSplashClosed = false;
function closeOpeningSplash(): void {
  if (openingSplashClosed) return;
  openingSplashClosed = true;
  openingSplash.classList.add("is-closing");
}
openingSplash.addEventListener("click", () => {
  if (openingSplashClosed) return;
  cancelOpeningSequence();
  closeOpeningSplash();
});
void playOpeningSequence().then(closeOpeningSplash);

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "gameplay", label: "Play", icon: "✧" },
  { id: "character", label: "Character", icon: "◉" }, { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Map", icon: "⌖" }, { id: "journal", label: "Journal", icon: "☷" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

let activeScreen: ScreenId = "home";
let databaseMessage = "Checking local storage…";
let characters: Character[] = [];
let registeredCharacters: Character[] = [];
let playerRegistryBusy = false;
let playerRegistryMessage = "Registry players.md belum dimuat.";
let notice = "";
let canonMessage = "Canon belum dimuat.";
let canonDocument: CanonDocument | null = null;
let canonBusy = false;
let canonRouteBusy = false;
let canonRouteMessage = "";
let canonRouteDocuments: CanonDocument[] = [];
let gameplayContextBusy = false;
let gameplaySnapshot = "";
let gameplayVersion = "";
let gmProposal: GMProposal | null = null;
let authMessage = "";
let authBusy = false;
type WorldTimeState = { era: string; year: string; season: string; date: string; weekday: string; weather: string; hour: string; cycle: string };
const EMPTY_WORLD_TIME: WorldTimeState = { era:"", year:"", season:"", date:"", weekday:"", weather:"", hour:"", cycle:"" };
let activeCharacterId = "";
let worldTime: WorldTimeState = { ...EMPTY_WORLD_TIME };
let blindOpen = false;
type ChatMessage = { role: "player" | "gm"; text: string; createdAt: string };
type CharacterChat = { messages: ChatMessage[]; started: boolean; showOptions: boolean };
const CHAT_STORE_KEY = "merzkava.chat-by-character.v1";
let activeChat: CharacterChat = { messages: [], started: false, showOptions: false };
function readChatStore(): Record<string, CharacterChat> {
  try { return JSON.parse(localStorage.getItem(CHAT_STORE_KEY) ?? "{}") as Record<string, CharacterChat>; }
  catch { return {}; }
}
function saveCharacterChat(): void {
  if (!activeCharacterId) return;
  const store = readChatStore();
  store[activeCharacterId] = activeChat;
  try { localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(store)); } catch { notice = "Penyimpanan percakapan tidak tersedia."; }
}
function loadCharacterChat(characterId: string): void {
  const saved = characterId ? readChatStore()[characterId] : undefined;
  activeChat = saved ? { messages: Array.isArray(saved.messages) ? saved.messages : [], started: Boolean(saved.started), showOptions: Boolean(saved.showOptions) } : { messages: [], started: false, showOptions: false };
  renderChat();
}
function renderChat(): void {
  if (activeScreen !== "gameplay") return;
  const feed = root.querySelector<HTMLElement>("#conversation-feed");
  if (feed) {
    feed.innerHTML = activeChat.messages.length
      ? activeChat.messages.map(message => '<article class="chat-message ' + message.role + '"><small>' + (message.role === "gm" ? "GAME MASTER" : "AKSI PEMAIN") + '</small><p>' + escapeHtml(message.text).replace(/\\n/g, "<br>") + '</p></article>').join("")
      : '<div class="conversation-empty"><span class="conversation-ornament">✧</span><h3>Your story begins here</h3><p>Mulai sesi baru atau lanjutkan perjalanan yang tersimpan untuk karakter ini.</p></div>';
    feed.scrollTop = feed.scrollHeight;
  }
  const setting = root.querySelector<HTMLSelectElement>("#gm-options-setting");
  if (setting) setting.value = activeChat.showOptions ? "yes" : "no";
  const status = root.querySelector<HTMLElement>("#session-status");
  if (status) status.textContent = activeChat.started ? "Sesi tersimpan di perangkat" : "Belum ada sesi aktif";
  const character = [...registeredCharacters, ...characters].find(item => item.id === activeCharacterId);
  const record = root.querySelector<HTMLElement>("#player-character-record");
  if (record) record.innerHTML = character
    ? '<details open><summary>PROFIL KARAKTER</summary><dl><dt>Nama</dt><dd>' + escapeHtml(character.name) + '</dd><dt>Usia</dt><dd>' + character.age + '</dd><dt>Spirit Realm</dt><dd>' + escapeHtml(character.realm) + '</dd><dt>Sync progress</dt><dd>Belum disinkronkan</dd><dt>Spirit Ring Absorption</dt><dd>Belum disinkronkan</dd><dt>Martial Soul</dt><dd>Belum disinkronkan</dd><dt>Arcanist Grade</dt><dd>???</dd><dt>Arcanist Focus</dt><dd>Belum diverifikasi</dd><dt>HP</dt><dd>Belum disinkronkan</dd><dt>Satiety</dt><dd>Belum disinkronkan</dd><dt>Qi</dt><dd>Belum disinkronkan</dd><dt>Kondisi Tubuh</dt><dd>Belum disinkronkan</dd><dt>Equipment</dt><dd>Belum disinkronkan</dd><dt>Asal</dt><dd>' + escapeHtml(character.origin) + '</dd><dt>Awakening</dt><dd>' + (character.awakened ? "Awakened" : "Not awakened") + '</dd><dt>Background</dt><dd>' + escapeHtml(character.background || "—") + '</dd></dl></details><details><summary>INV & KEUANGAN</summary><p>Inventory: Belum disinkronkan</p><p>Assets Bangunan: Belum disinkronkan</p><p>Wallet (wealth): Belum diverifikasi · xc | xs | xg | zj | az</p></details><details><summary>TEKNIK & TUJUAN</summary><p>Teknik / Kemampuan: Belum disinkronkan</p><p>Tujuan Saat Ini: Belum disinkronkan</p></details><details><summary>CATATAN PEMAIN & KONSISTENSI</summary><p>State kanonis dan Ledger Log belum disinkronkan dari GM. Aplikasi tidak mengarang atau mengubah nilai yang belum diverifikasi.</p></details>'
    : "Pilih karakter untuk melihat catatan lokalnya.";
}

const WORLD_TIME_KEY = "merzkava.world-time-by-character.v1";
type CharacterSessionRecord = { worldTime: WorldTimeState; snapshot: string; version: string };
function readWorldTimeStore(): Record<string, CharacterSessionRecord> {
  try { return JSON.parse(localStorage.getItem(WORLD_TIME_KEY) ?? "{}") as Record<string, CharacterSessionRecord>; }
  catch { return {}; }
}
function loadCharacterWorldTime(characterId: string): void {
  activeCharacterId = characterId;
  const saved = characterId ? readWorldTimeStore()[characterId] : undefined;
  worldTime = saved?.worldTime ? { ...EMPTY_WORLD_TIME, ...saved.worldTime } : { ...EMPTY_WORLD_TIME };
  gameplaySnapshot = saved?.snapshot ?? "";
  gameplayVersion = saved?.version ?? "";
}
function saveCharacterWorldTime(): void {
  if (!activeCharacterId) return;
  const store = readWorldTimeStore();
  store[activeCharacterId] = { worldTime: { ...worldTime }, snapshot: gameplaySnapshot, version: gameplayVersion };
  try { localStorage.setItem(WORLD_TIME_KEY, JSON.stringify(store)); } catch { /* Keep this session in memory if storage is unavailable. */ }
}
function applyGMWorldTime(proposal: GMProposal): void {
  if (proposal.world_time) {
    for (const key of Object.keys(EMPTY_WORLD_TIME) as (keyof WorldTimeState)[]) {
      const value = proposal.world_time[key];
      if (typeof value === "string" && value.trim()) worldTime[key] = value.trim();
    }
  }
  gameplaySnapshot = proposal.snapshot;
  gameplayVersion = proposal.version;
  saveCharacterWorldTime();
  updateSessionCalendar();
}

function localDayStamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const noticeboardStorageKey = `merzkava-noticeboard-dismissed:${localDayStamp()}`;
let noticeboardVisible = (() => {
  try { return localStorage.getItem(noticeboardStorageKey) !== "1"; }
  catch { return true; }
})();

function noticeboardMarkup(): string {
  return `<div class="noticeboard-backdrop" data-noticeboard-backdrop>
    <section class="noticeboard-panel" role="dialog" aria-modal="true" aria-labelledby="noticeboard-title">
      <div class="noticeboard-topline"><span>MERZKAVA UNIVERSE</span><span>DAILY BULLETIN · 001</span></div>
      <button class="noticeboard-close" data-notice-dismiss="once" aria-label="Close noticeboard">×</button>
      <div class="noticeboard-seal">M</div>
      <p class="noticeboard-kicker">A NOTE FROM THE ARCHIVE</p>
      <h2 id="noticeboard-title">Today's<br><em>Noticeboard</em></h2>
      <div class="noticeboard-rule"></div>
      <p class="noticeboard-copy">The world is waiting beyond these pages. Review your records, prepare your character, and let the next chapter begin.</p>
      <div class="noticeboard-entry"><span>01</span><div><strong>YOUR JOURNEY</strong><small>Characters, memories, and discoveries belong to your own archive.</small></div></div>
      <div class="noticeboard-actions">
        <button class="noticeboard-today" data-notice-dismiss="today">Close for today</button>
        <button class="noticeboard-ignore" data-notice-dismiss="once">Dismiss</button>
      </div>
      <p class="noticeboard-footnote">Tap outside this notice to close it.</p>
    </section>
  </div>`;
}

function updateSessionCalendar(): void {
  if (activeScreen !== "gameplay") return;
  const set = (id: string, value: string) => {
    const node = root.querySelector<HTMLElement>(id);
    if (node) node.textContent = value;
  };
  set("#session-era", worldTime.era);
  set("#session-year", worldTime.year);
  set("#session-season", worldTime.season);
  set("#session-day", worldTime.date);
  set("#session-weekday", worldTime.weekday);
  set("#session-weather", worldTime.weather);
  set("#session-clock", worldTime.hour);
  set("#session-cycle", worldTime.cycle);
  set("#blind-hash", gameplaySnapshot ? gameplaySnapshot.slice(0, 7) : "");
  set("#blind-version", gameplayVersion);
}

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

function authPanel(): string {
  const session = getAuthSession();
  const configured = isSupabaseConfigured() && isGMGatewayConfigured();
  const status = session ? "Signed in as " + escapeHtml(session.user.email ?? session.user.id) : "Not signed in";
  const statusLabel = session ? "SIGNED IN" : "SIGNED OUT";
  const configWarning = configured ? "" : "<p class=\"canon-status\">Configuration missing. Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_GM_GATEWAY_URL in the build environment.</p>";
  const controls = session
    ? "<button class=\"text-button\" data-auth-logout " + (authBusy ? "disabled" : "") + ">" + (authBusy ? "Signing out…" : "Sign out ↗") + "</button>"
    : "<form id=\"auth-form\"><label for=\"auth-email\">Email</label><input id=\"auth-email\" name=\"email\" type=\"email\" autocomplete=\"username\" maxlength=\"254\" required /><label for=\"auth-password\">Password</label><input id=\"auth-password\" name=\"password\" type=\"password\" autocomplete=\"current-password\" minlength=\"6\" maxlength=\"128\" required /><button class=\"action-button\" type=\"submit\" " + (authBusy || !configured ? "disabled" : "") + ">" + (authBusy ? "Signing in…" : "Sign in ↗") + "</button></form>";
  return "<section class=\"section-block record-card\"><div class=\"record-top\"><span>SUPABASE AUTH</span><span class=\"record-status\">" + statusLabel + "</span></div><p class=\"muted\">" + status + "</p>" + (authMessage ? "<p class=\"canon-status\" role=\"status\">" + escapeHtml(authMessage) + "</p>" : "") + configWarning + controls + "<p class=\"muted\">Create or confirm the account in your Supabase Authentication dashboard. The app never stores passwords. Native Android sessions use Android Keystore-backed secure storage; browser preview does not persist sessions.</p></section>";
}
function snapshotBlindMarkup(): string {
  return `<section class="snapshot-blind ${blindOpen ? "is-open" : ""}" data-snapshot-blind aria-label="Session snapshot">
    <button class="blind-handle" type="button" data-blind-toggle aria-expanded="${blindOpen}" aria-controls="blind-content">
      <span class="blind-handle-line"></span><span class="blind-handle-label">SESSION SNAPSHOT</span><span class="blind-chevron">${blindOpen ? "⌃" : "⌄"}</span>
    </button>
    <div class="blind-content" id="blind-content">
      <div><small>HASH · ACTIVE SNAPSHOT</small><strong id="blind-hash">${escapeHtml(gameplaySnapshot ? gameplaySnapshot.slice(0,7) : "")}</strong></div>
      <div><small>VERSION · GM SESSION</small><strong id="blind-version">${escapeHtml(gameplayVersion)}</strong></div>
    </div>
  </section>`;
}
function render(): void {
  root.innerHTML = `<div class="app-shell">
    <header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></header>
    <main class="main-content">${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}${renderScreen(activeScreen, availableCharacters(), playerRegistryMessage)}${activeScreen === "settings" ? authPanel() + canonPanel() : ""}</main>
    <nav class="bottom-nav" aria-label="Main navigation">${navigation.map(item => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span>${item.icon}</span><small>${item.label}</small></button>`).join("")}</nav>
    <div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>
    ${activeScreen === "gameplay" ? snapshotBlindMarkup() : ""}
    ${activeScreen === "home" && noticeboardVisible ? noticeboardMarkup() : ""}
  </div>`;
  updateSessionCalendar();
  renderChat();
}

function availableCharacters(): Character[] {
  return [...registeredCharacters, ...characters.filter(local => !registeredCharacters.some(registered => registered.name === local.name))];
}

async function refreshCharacters(): Promise<void> {
  try { characters = await listCharacters(); }
  catch (error) { notice = error instanceof Error ? error.message : "Could not load characters."; }
}

let pointerStart: { x: number; y: number } | null = null;
let suppressNextPointerClick = false;

let blindDragStartY: number | null = null;
root.addEventListener("pointerdown", event => {
  if ((event.target as Element).closest?.("[data-blind-toggle]")) blindDragStartY = event.clientY;
  pointerStart = { x: event.clientX, y: event.clientY };
  suppressNextPointerClick = false;
}, { passive: true });

root.addEventListener("pointermove", event => {
  if (!pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  if (distance > 10) suppressNextPointerClick = true;
}, { passive: true });

root.addEventListener("pointerup", event => {
  if (blindDragStartY !== null) {
    const delta = event.clientY - blindDragStartY;
    if (Math.abs(delta) > 24) {
      blindOpen = delta > 0;
      const blind = root.querySelector<HTMLElement>("[data-snapshot-blind]");
      const handle = blind?.querySelector<HTMLButtonElement>("[data-blind-toggle]");
      blind?.classList.toggle("is-open", blindOpen);
      handle?.setAttribute("aria-expanded", String(blindOpen));
      const chevron = handle?.querySelector<HTMLElement>(".blind-chevron");
      if (chevron) chevron.textContent = blindOpen ? "⌃" : "⌄";
      suppressNextPointerClick = true;
    }
    blindDragStartY = null;
  }
  pointerStart = null;
}, { passive: true });

root.addEventListener("pointercancel", () => {
  blindDragStartY = null;
  pointerStart = null;
  suppressNextPointerClick = false;
}, { passive: true });

root.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (event.detail !== 0 && suppressNextPointerClick) {
    suppressNextPointerClick = false;
    return;
  }
  const interactive = target.closest(
    "button:not(:disabled), a[href], [role='button'], [role='tab'], [role='menuitem'], input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled), summary"
  );
  if (interactive) playButtonSound();

  const startSessionButton = target.closest<HTMLButtonElement>("[data-start-session]");
  if (startSessionButton) {
    const characterId = root.querySelector<HTMLSelectElement>("#gameplay-character")?.value ?? "";
    if (!characterId) { notice = "Pilih karakter terlebih dahulu."; render(); return; }
    activeCharacterId = characterId;
    activeChat = { messages: [], started: false, showOptions: activeChat.showOptions };
    saveCharacterChat();
    const form = root.querySelector<HTMLFormElement>("#gameplay-route-form");
    if (form) form.dataset.sessionMode = "new";
    form?.requestSubmit();
    return;
  }
  const noticeDismissButton = target.closest<HTMLElement>("[data-notice-dismiss]");
  if (noticeDismissButton) {
    if (noticeDismissButton.dataset.noticeDismiss === "today") {
      try { localStorage.setItem(noticeboardStorageKey, "1"); } catch { /* Session-only dismissal still works. */ }
    }
    noticeboardVisible = false;
    render();
    return;
  }
  if (target.classList.contains("noticeboard-backdrop")) {
    noticeboardVisible = false;
    render();
    return;
  }

  const refreshPlayersButton = target.closest<HTMLButtonElement>("[data-refresh-players]");
  if (refreshPlayersButton && !playerRegistryBusy) {
    await refreshPlayerRegistry();
    return;
  }
  const refreshCanonButton = target.closest<HTMLButtonElement>("[data-refresh-canon]");
  if (refreshCanonButton && !canonBusy) {
    canonBusy = true; canonMessage = "Memeriksa pin README dan mengambil INDEX…"; render();
    const status = await refreshCanon();
    canonBusy = false; canonMessage = status.message; render();
    return;
  }
  const logoutButton = target.closest<HTMLButtonElement>("[data-auth-logout]");
  if (logoutButton && !authBusy) {
    authBusy = true;
    authMessage = "Signing out…";
    render();
    try {
      await signOut();
      authMessage = "Signed out successfully.";
    } catch (error) {
      authMessage = error instanceof Error ? error.message : "Could not clear the local session.";
    }
    authBusy = false;
    render();
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
  const blindButton = target.closest<HTMLButtonElement>("[data-blind-toggle]");
  if (blindButton) {
    blindOpen = !blindOpen;
    const blind = root.querySelector<HTMLElement>("[data-snapshot-blind]");
    if (blind) {
      blind.classList.toggle("is-open", blindOpen);
      blindButton.setAttribute("aria-expanded", String(blindOpen));
      const chevron = blindButton.querySelector<HTMLElement>(".blind-chevron");
      if (chevron) chevron.textContent = blindOpen ? "⌃" : "⌄";
    }
    return;
  }
  const button = target.closest<HTMLButtonElement>("[data-screen]");
  const nextScreen = button?.dataset.screen as ScreenId | undefined;
  if (!nextScreen || !navigation.some(item => item.id === nextScreen)) return;
  if (nextScreen === "gameplay" && activeScreen !== "gameplay") {
    const selected = root.querySelector<HTMLSelectElement>("#gameplay-character")?.value ?? activeCharacterId;
    loadCharacterWorldTime(selected);
    loadCharacterChat(selected);
    blindOpen = false;
  }
  activeScreen = nextScreen;
  notice = "";
  render();
});

root.addEventListener("change", event => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.id === "gameplay-character") {
    loadCharacterWorldTime(target.value);
    loadCharacterChat(target.value);
    updateSessionCalendar();
  }
  if (target instanceof HTMLSelectElement && target.id === "gm-options-setting") {
    activeChat.showOptions = target.value === "yes";
    saveCharacterChat();
  }
});

root.addEventListener("submit", async (event: SubmitEvent) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "auth-form") {
    event.preventDefault();
    if (authBusy) return;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    authBusy = true;
    authMessage = "Signing in with Supabase…";
    render();
    try {
      const session = await signInWithPassword(email, password);
      authMessage = "Signed in as " + (session.user.email ?? session.user.id) + ".";
    } catch (error) {
      authMessage = error instanceof Error ? error.message : "Sign-in failed.";
    }
    authBusy = false;
    render();
    return;
  }
  if (form.id === "gameplay-route-form") {
    event.preventDefault();
    const data = new FormData(form);
    const typedActivity = String(data.get("activity") ?? "").trim();
    const characterId = String(data.get("characterId") ?? "");
    const mode = form.dataset.sessionMode === "new" ? "new" : "continue";
    if (gameplayContextBusy || !characterId || (mode === "continue" && !typedActivity)) return;
    const character = availableCharacters().find(item => item.id === characterId);
    if (!character) { notice = "Karakter tidak ditemukan."; render(); return; }
    activeCharacterId = characterId;
    loadCharacterWorldTime(characterId);
    if (mode === "new") activeChat = { messages: [], started: false, showOptions: activeChat.showOptions };
    let activeStatus = getCanonStatus();
    if (mode === "new" && activeStatus.status !== "ready") { notice = "Sesi baru memerlukan canon aktif yang baru diverifikasi. Refresh canon terlebih dahulu."; render(); return; }
    if (mode === "continue" && !gameplaySnapshot) { notice = "Belum ada sesi tersimpan untuk karakter ini. Tekan New session terlebih dahulu."; render(); return; }
    const activeSha = mode === "new" ? activeStatus.commitSha.slice(0, 7) : gameplaySnapshot.slice(0, 7);
    const trigger = "analisis link berikut ini secara penuh dan pelajari dengan seksama untuk memulai permainan roleplay ini : https://raw.githubusercontent.com/Antarezka/merzkava-universe/" + activeSha + "/INDEX.md?v=1 dan https://raw.githubusercontent.com/Antarezka/merzkava-universe/" + activeSha + "/players.md?v=1 untuk Memulai permainan sebagai " + character.name + "!";
    const activity = mode === "new" ? trigger : typedActivity;
    const routeQuery = mode === "new" ? "new session character introduction starting location initial character state" : activity;
    gameplayContextBusy = true;
    const sendButton = root.querySelector<HTMLButtonElement>("#gameplay-route-form button[type=submit]");
    if (sendButton) sendButton.disabled = true;
    try {
      if (mode === "continue") activeStatus = await activateCanonSnapshot(activeSha);
      const route = await routeCanonActivity(routeQuery, 7);
      const indexDocument = await getCanonIndex();
      if (!indexDocument || indexDocument.commitSha.slice(0, 7) !== activeSha) throw new Error("Bootstrap gagal: INDEX.md pada ACTIVE_SHA tidak tersedia.");
      const playerRegistry = mode === "new" ? await loadPlayerRegistry(activeSha) : null;
      const context = assembleGameplayContext({ ...route, query: activity }, character, activeSha, activeStatus.version, 140000);
      context.prompt += "\n\n## FULL INDEX.md · HARD GATE · ACTIVE_SHA " + activeSha + "\n" + indexDocument.content;
      if (playerRegistry) context.prompt += "\n\n## FULL players.md · ACTIVE_SHA " + activeSha + "\n" + playerRegistry.content;
      const previous = mode === "new" ? [] : activeChat.messages;
      context.prompt += "\n\n## SESSION MODE\n" + (mode === "new" ? "NEW SESSION: initialize from the exact trigger below." : "CONTINUING SESSION: continue without resetting established state.") +
        "\n\n## EXACT TRIGGER\n" + (mode === "new" ? trigger : "Not applicable; continuation.") +
        "\n\n## CHRONOLOGICAL PLAYER/GM TRANSCRIPT\n" + (previous.length ? previous.map(item => (item.role === "player" ? "PLAYER: " : "GM: ") + item.text).join("\n\n") : "No previous turns.") +
        "\n\n## PLAYER PRESENTATION\n" + (activeChat.showOptions ? "Include concise optional GM suggestions at the end." : "Do not provide suggested action options.") +
        "\n\n## LAST GM WORLD TIME\n" + (Object.values(worldTime).some(Boolean) ? JSON.stringify(worldTime) : "No time reported. Do not invent missing fields.") +
        "\nOnly use GM-reported world time. Never use device time. Preserve all established character state.";
      gameplaySnapshot = activeSha;
      gameplayVersion = activeStatus.version;
      if (!isGMGatewayConfigured() || !getAuthSession()) throw new Error("AI Game Master belum siap. Periksa login dan konfigurasi Gateway di Settings.");
      const result = await requestGMProposal(new GatewayGMProvider(), context);
      if (!result.valid) throw new Error(result.errors.join(" "));
      gmProposal = result.proposal;
      applyGMWorldTime(gmProposal);
      activeChat.messages.push({ role: "player", text: mode === "new" ? "Memulai sesi baru sebagai " + character.name + "." : typedActivity, createdAt: new Date().toISOString() });
      activeChat.messages.push({ role: "gm", text: gmProposal.narration + (gmProposal.outcome ? "\n\n" + gmProposal.outcome : ""), createdAt: new Date().toISOString() });
      activeChat.started = true;
      form.dataset.sessionMode = "continue";
      saveCharacterChat();
      renderChat();
      const action = root.querySelector<HTMLTextAreaElement>("#gameplay-action");
      if (action) action.value = "";
    } catch (error) {
      notice = error instanceof Error ? error.message : "Game Master gagal merespons.";
      const feed = root.querySelector<HTMLElement>("#conversation-feed");
      if (feed) feed.insertAdjacentHTML("beforeend", '<p class="canon-status" role="alert">' + escapeHtml(notice) + '</p>');
    } finally {
      gameplayContextBusy = false;
      if (sendButton) sendButton.disabled = false;
    }
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
    applyGMWorldTime(gmProposal);
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
  try {
    await restoreAuthSession();
    authMessage = getAuthSession() ? "Saved secure session restored." : "";
  } catch (error) {
    authMessage = error instanceof Error ? error.message : "Could not restore secure session.";
  }
  render();
  const canonStatus = await refreshCanon();
  canonMessage = canonStatus.message;
  render();
});
