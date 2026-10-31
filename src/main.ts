import "./style.css";
import "./ui/floating-ledger.css";
import "./ui/floating-control.css";
import { cancelOpeningSequence, playButtonSound, playOpeningSequence, playSnapshotSlideSound, playWarningBeep } from "./audio/sound-effects";
const splashLogoUrl = new URL("../Untitled78_20261030213901.png", import.meta.url).href;
import { getGameplaySessionRecord, initializeDatabase, saveGameplaySessionRecord } from "./database/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./characters/character-repository";
import { validateCharacterDraft } from "./engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { getCanonIndex, getCanonStatus, loadCanonModule, loadPlayerRegistry, loadRegisteredPlayerProfile, refreshCanon, refreshLatestPlayerRegistry, type CanonDocument } from "./canon/canon-loader";
import { routeCanonActivity } from "./canon/canon-router";
import { assembleGameplayContext } from "./canon/context-assembler";
import { requestGMProposal, validateGMResponse, type GMProposal } from "./engine/gm-engine";
import { getAuthSession, isSupabaseConfigured, restoreAuthSession, signInWithPassword, signOut } from "./auth/supabase-auth";
import { GatewayGMProvider, isGMGatewayConfigured } from "./engine/gateway-gm-provider";
import { getLedgerLog, initializeLedgerNotifications } from "./ui/ledger-log";
import { canonLabelMarkup } from "./ui/canon-labels";
import { startFloatingMode, requestFloatingOverlayPermission, getFloatingReadiness, requestFloatingNotifications, requestFloatingBatteryExemption, showFloatingBubble, stopFloatingService, type FloatingReadiness } from "./native/floating-window";
import { floatingControlMarkup } from "./app/floating-control";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");
const root = app;
let menuRevealPending = false;
initializeLedgerNotifications();

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
    if (event.target === splash.querySelector(".splash-content") && event.animationName === "splash-depart") splash.remove();
  });
  document.body.append(splash);
  return splash;
}

async function playEntrySplash(): Promise<void> {
  const splash = showOpeningSplash();
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    splash.classList.add("is-closing");
  };
  splash.addEventListener("click", () => { cancelOpeningSequence(); close(); }, { once: true });
  await playOpeningSequence();
  await new Promise<void>(resolve => {
    splash.addEventListener("animationend", event => {
      if (event.target === splash.querySelector(".splash-content") && event.animationName === "splash-depart") resolve();
    });
    close();
  });
  menuRevealPending = true;
}

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "gameplay", label: "Play", icon: "✧" },
  { id: "character", label: "Character", icon: "◉" }, { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Map", icon: "⌖" }, { id: "journal", label: "Journal", icon: "☷" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

type AppScreen = ScreenId | "control";
let activeScreen: AppScreen = "control";
let floatingReadiness: FloatingReadiness = { displayOverApps: false, notifications: false, batteryExemption: false, serviceRunning: false };
let floatingBusy = false;
async function refreshFloatingReadiness(): Promise<void> {
  try { floatingReadiness = await getFloatingReadiness(); }
  catch { floatingReadiness = { ...floatingReadiness, serviceRunning: false }; }
  if (activeScreen === "control") render();
}
function floatingSetupComplete(): boolean {
  return floatingReadiness.displayOverApps && floatingReadiness.notifications && floatingReadiness.batteryExemption;
}
let databaseMessage = "Checking local storage…";
let characters: Character[] = [];
let registeredCharacters: Character[] = [];
let playerRegistryBusy = false;
let playerRegistryMessage = "Registry players.md belum dimuat.";
let notice = "";
let lastPlayWarningNotice = "";
let canonMessage = "Canon belum dimuat.";
let canonDocument: CanonDocument | null = null;
let canonBusy = false;
let canonRouteBusy = false;
let canonRouteMessage = "";
let canonRouteDocuments: CanonDocument[] = [];
let gameplayContextBusy = false;
let gameplaySnapshot = "";
let gameplayVersion = "";
let activeProfileMarkdown = "";
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
  if (!activeChat.messages.length && characterId) void restoreGameplayTranscript(characterId);
}

async function restoreGameplayTranscript(characterId: string): Promise<void> {
  try {
    const record = await getGameplaySessionRecord(characterId);
    if (!record || activeCharacterId !== characterId || activeChat.messages.length) return;
    const stored = JSON.parse(record.stateJson) as { transcript?: unknown };
    if (!Array.isArray(stored.transcript)) return;
    const messages = stored.transcript.filter((item): item is ChatMessage => Boolean(item) && typeof item === "object" && ((item as ChatMessage).role === "player" || (item as ChatMessage).role === "gm") && typeof (item as ChatMessage).text === "string" && typeof (item as ChatMessage).createdAt === "string");
    if (!messages.length || activeCharacterId !== characterId || activeChat.messages.length) return;
    activeChat = { messages, started: true, showOptions: activeChat.showOptions };
    saveCharacterChat();
    renderChat();
  } catch (error) {
    recordBug(error, "Restore gameplay transcript", "Gameplay save");
  }
}
function characterName(characterId: string): string {
  return availableCharacters().find(item => item.id === characterId)?.name ?? "";
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
  if (status) status.textContent = activeChat.started ? "Sesi aktif · " + (characterName(activeCharacterId) || "Karakter") : (activeCharacterId ? "Profil siap · Mulai sesi baru" : "Pilih karakter untuk memulai");
  const startPanel = root.querySelector<HTMLElement>("[data-session-start]");
  const composePanel = root.querySelector<HTMLElement>("[data-session-compose]");
  if (startPanel) startPanel.hidden = activeChat.started;
  if (composePanel) composePanel.hidden = !activeChat.started;
  const routeForm = root.querySelector<HTMLFormElement>("#gameplay-route-form");
  if (routeForm) routeForm.dataset.sessionMode = activeChat.started ? "continue" : "new";
  const character = availableCharacters().find(item => item.id === activeCharacterId);
  const record = root.querySelector<HTMLElement>("#player-character-record");
  if (record) record.innerHTML = character
    ? '<details open><summary>PROFIL KARAKTER</summary><dl><dt>Nama</dt><dd>' + escapeHtml(character.name) + '</dd><dt>Usia</dt><dd>' + (character.origin === "Registry" ? "See source profile" : character.age) + '</dd><dt>Spirit Realm</dt><dd>' + canonLabelMarkup("spirit-realm", character.realm) + '</dd><dt>Sync progress</dt><dd>Belum disinkronkan</dd><dt>Spirit Ring Absorption</dt><dd>Belum disinkronkan</dd><dt>Martial Soul</dt><dd>Belum disinkronkan</dd><dt>Arcanist Grade</dt><dd>???</dd><dt>Arcanist Focus</dt><dd>Belum diverifikasi</dd><dt>HP</dt><dd>Belum disinkronkan</dd><dt>Satiety</dt><dd>Belum disinkronkan</dd><dt>Qi</dt><dd>Belum disinkronkan</dd><dt>Kondisi Tubuh</dt><dd>Belum disinkronkan</dd><dt>Equipment</dt><dd>Belum disinkronkan</dd><dt>Asal</dt><dd>' + escapeHtml(character.origin) + '</dd><dt>Awakening</dt><dd>' + (character.origin === "Registry" ? "See source profile" : (character.awakened ? "Awakened" : "Not awakened")) + '</dd><dt>Background</dt><dd>' + escapeHtml(character.background || "—") + '</dd></dl></details><details><summary>INV & KEUANGAN</summary><p>Inventory: Belum disinkronkan</p><p>Assets Bangunan: Belum disinkronkan</p><p>Wallet (wealth): Belum diverifikasi · xc | xs | xg | zj | az</p></details><details><summary>TEKNIK & TUJUAN</summary><p>Teknik / Kemampuan: Belum disinkronkan</p><p>Tujuan Saat Ini: Belum disinkronkan</p></details><details><summary>CATATAN PEMAIN & KONSISTENSI</summary><p>State kanonis dan Ledger Log belum disinkronkan dari GM. Aplikasi tidak mengarang atau mengubah nilai yang belum diverifikasi.</p></details>'
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
type BugReport = { title: string; stage: string; message: string; stack: string; timestamp: string; source: string };
let bugReport: BugReport | null = null;
let bugPanelMinimized = false;
function recordBug(error: unknown, stage: string, source = "Merzkava"): void {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  bugReport = {
    title: stage,
    stage,
    message,
    stack: error instanceof Error ? (error.stack ?? "") : "",
    timestamp: new Date().toISOString(),
    source
  };
  bugPanelMinimized = false;
}
function bugReportText(): string {
  if (!bugReport) return "";
  return [
    "MERZKAVA BUG REPORT",
    "Stage: " + bugReport.stage,
    "Source: " + bugReport.source,
    "Time: " + bugReport.timestamp,
    "Error: " + bugReport.message,
    "App screen: " + activeScreen,
    "Android/WebView: " + navigator.userAgent,
    "Viewport: " + window.innerWidth + "x" + window.innerHeight,
    "Floating readiness: " + JSON.stringify(floatingReadiness),
    bugReport.stack ? "Stack:\n" + bugReport.stack : ""
  ].filter(Boolean).join("\n");
}
function bugPanelMarkup(): string {
  if (!bugReport) return "";
  if (bugPanelMinimized) return '<button class="bug-report-minimized" data-bug-restore type="button">⚠ Bug report · Open</button>';
  return `<div class="bug-report-backdrop" role="presentation">
    <section class="bug-report-panel" role="alertdialog" aria-modal="false" aria-labelledby="bug-report-title">
      <div class="bug-report-heading"><span>MERZKAVA · DIAGNOSTICS</span><span>ERROR</span></div>
      <h2 id="bug-report-title">${escapeHtml(bugReport.title)}</h2>
      <p class="bug-report-message">${escapeHtml(bugReport.message)}</p>
      <p class="bug-report-hint">Salin laporan ini lalu kirimkan ke developer. Laporan berisi detail teknis perangkat dan error, bukan isi percakapan.</p>
      <div class="bug-report-actions">
        <button type="button" data-bug-copy>Salin laporan</button>
        <button type="button" data-bug-minimize>Minimize</button>
        <button type="button" data-bug-dismiss>OK</button>
      </div>
    </section>
  </div>`;
}
function render(): void {
  if (activeScreen === "gameplay" && notice && notice !== lastPlayWarningNotice) {
    playWarningBeep();
    lastPlayWarningNotice = notice;
  } else if (!notice || activeScreen !== "gameplay") {
    lastPlayWarningNotice = "";
  }
  const isControl = activeScreen === "control";
  const content = isControl
    ? floatingControlMarkup(floatingReadiness)
    : renderScreen(activeScreen as ScreenId, availableCharacters(), playerRegistryMessage, activeCharacterId ? getLedgerLog(activeCharacterId) : []);
  root.innerHTML = `<div class="app-shell ${isControl ? "control-shell" : ""} ${menuRevealPending ? "is-entering" : ""}">
    ${isControl ? "" : '<header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><button class="header-settings" data-floating-action="start-bubble" aria-label="Start Bubble Mode" title="Start Bubble Mode">◉</button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></header>'}
    ${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}
    ${isControl ? content : `<main class="main-content">${content}${activeScreen === "settings" ? authPanel() + canonPanel() : ""}</main>`}
    ${isControl ? "" : `<nav class="bottom-nav" aria-label="Main navigation">${navigation.map(item => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span>${item.icon}</span><small>${item.label}</small></button>`).join("")}</nav>`}
    ${isControl ? "" : `<div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>`}
    ${activeScreen === "gameplay" ? snapshotBlindMarkup() : ""}
    ${activeScreen === "home" && noticeboardVisible ? noticeboardMarkup() : ""}
    ${bugPanelMarkup()}
  </div>`;
  menuRevealPending = false;
  updateSessionCalendar();
  renderChat();
}

async function refreshCharacters(): Promise<void> {
  try { characters = await listCharacters(); }
  catch (error) { recordBug(error, "Load characters", "Character storage"); notice = error instanceof Error ? error.message : "Could not load characters."; }
}

function availableCharacters(): Character[] {
  return [...registeredCharacters, ...characters.filter(local => !registeredCharacters.some(registered => registered.name === local.name))];
}

async function refreshPlayerRegistry(): Promise<void> {
  if (playerRegistryBusy) return;
  playerRegistryBusy = true;
  playerRegistryMessage = "Mengambil daftar karakter dari players.md…";
  try {
    const status = getCanonStatus();
    if (!status.commitSha || status.status === "error") throw new Error("Canon ACTIVE_SHA belum terverifikasi; registry tidak boleh memakai sumber lain.");
    const result = await refreshLatestPlayerRegistry(status.commitSha);
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
      registryPath: player.path,
      registryCommitSha: result.commitSha
    }));
    playerRegistryMessage = `${registeredCharacters.length} karakter dari players.md · snapshot ${result.commitSha}`;
    if (activeScreen === "character" || activeScreen === "gameplay") render();
  } catch (error) {
    recordBug(error, "Load player registry", "Player registry");
    playerRegistryMessage = error instanceof Error ? error.message : "Gagal memuat players.md.";
    notice = playerRegistryMessage;
    if (activeScreen === "character" || activeScreen === "gameplay") render();
  } finally {
    playerRegistryBusy = false;
  }
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
      playSnapshotSlideSound(blindOpen ? "down" : "up");
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

  const bugCopyButton = target.closest<HTMLButtonElement>("[data-bug-copy]");
  if (bugCopyButton) {
    const report = bugReportText();
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(report);
      else {
        const field = document.createElement("textarea");
        field.value = report;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Clipboard API tidak tersedia di perangkat ini.");
      }
      bugCopyButton.textContent = "Tersalin ✓";
    } catch (error) {
      bugCopyButton.textContent = "Gagal menyalin";
      recordBug(error, "Copy bug report", "Diagnostics");
      render();
    }
    return;
  }
  if (target.closest("[data-bug-minimize]")) { bugPanelMinimized = true; render(); return; }
  if (target.closest("[data-bug-restore]")) { bugPanelMinimized = false; render(); return; }
  if (target.closest("[data-bug-dismiss]")) { bugReport = null; render(); return; }

  const floatingAction = target.closest<HTMLButtonElement>("[data-floating-action]");
  if (floatingAction) {
    const action = floatingAction.dataset.floatingAction;
    if (floatingBusy) return;
    floatingBusy = true;
    floatingAction.disabled = true;
    try {
      if (action === "overlay") {
        await requestFloatingOverlayPermission();
      } else if (action === "notifications") {
        await requestFloatingNotifications();
      } else if (action === "battery") {
        await requestFloatingBatteryExemption();
      } else if (action === "start-bubble") {
        await refreshFloatingReadiness();
        if (!floatingSetupComplete()) throw new Error("Selesaikan tiga izin pertama secara berurutan sebelum memulai bubble mode.");
        // Run the opening scene before entering Bubble Mode, then leave the WebView on the main menu.
        await playEntrySplash();
        activeScreen = "home";
        render();
        await showFloatingBubble();
      } else if (action === "open-game") {
        await stopFloatingService();
        await playEntrySplash();
        activeScreen = "home";
        render();
      } else if (action === "open-window") {
        await refreshFloatingReadiness();
        if (!floatingReadiness.displayOverApps) throw new Error("Aktifkan izin Display over the app terlebih dahulu.");
        // Preserve the normal entry experience before switching the WebView into the floating mini window.
        await playEntrySplash();
        activeScreen = "gameplay";
        loadCharacterWorldTime(activeCharacterId);
        loadCharacterChat(activeCharacterId);
        render();
        await startFloatingMode();
      } else if (action === "stop") {
        await stopFloatingService();
      } else if (action === "donate") {
        notice = "Donation link belum dipasang. Tidak ada tautan pembayaran yang akan dibuka sebelum alamat resminya tersedia.";
      }
      await refreshFloatingReadiness();
      if (activeScreen === "control") render();
      else if (notice) render();
    } catch (error) {
      recordBug(error, "Floating Control · " + (action ?? "unknown action"), "Floating Mode");
      notice = error instanceof Error ? error.message : "Floating Control action failed.";
      await refreshFloatingReadiness();
      render();
    } finally {
      floatingBusy = false;
    }
    return;
  }

  const startSessionButton = target.closest<HTMLButtonElement>("[data-start-session]");
  if (startSessionButton) {
    const characterId = root.querySelector<HTMLSelectElement>("#gameplay-character")?.value ?? "";
    if (!characterId || !availableCharacters().some(item => item.id === characterId)) {
      notice = "Pilih profil karakter terlebih dahulu.";
      render();
      return;
    }
    activeCharacterId = characterId;
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
  if (refreshPlayersButton && !playerRegistryBusy) { await refreshPlayerRegistry(); return; }
  const floatingStartButton = target.closest<HTMLButtonElement>("[data-floating-start]");
  if (floatingStartButton) {
    floatingStartButton.disabled = true;
    try {
      await startFloatingMode();
    } catch (error) {
      recordBug(error, "Start Floating Mode", "Floating Mode");
      notice = error instanceof Error ? error.message : "Floating Mode could not start.";
      render();
    }
    return;
  }

  const refreshCanonButton = target.closest<HTMLButtonElement>("[data-refresh-canon]");
  if (refreshCanonButton && !canonBusy) {
    canonBusy = true; canonMessage = "Memverifikasi snapshot canon yang dikonfigurasi dan mengambil INDEX…"; render();
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
      recordBug(error, "Sign out", "Authentication");
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
    } catch (error) { recordBug(error, "Delete character", "Character storage"); notice = error instanceof Error ? error.message : "Could not delete character."; render(); }
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
      recordBug(error, "Sign in", "Authentication");
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
    const mode = form.dataset.sessionMode === "new" ? "new" : (activeChat.started ? "continue" : "new");
    if (gameplayContextBusy || !characterId || (mode === "continue" && !typedActivity)) return;
    const character = availableCharacters().find(item => item.id === characterId);
    if (!character) { notice = "Karakter tidak ditemukan."; render(); return; }
    if (!isGMGatewayConfigured() || !getAuthSession()) {
      notice = "AI Game Master belum siap. Login dan lengkapi konfigurasi Gateway di Settings sebelum memulai atau melanjutkan sesi.";
      render();
      return;
    }
    activeCharacterId = characterId;
    loadCharacterWorldTime(characterId);
    if (mode === "new") activeChat = { messages: [], started: false, showOptions: activeChat.showOptions };
    let activeStatus = getCanonStatus();
    if (mode === "new") {
      activeStatus = await refreshCanon();
      if (activeStatus.status !== "ready" || !activeStatus.commitSha) {
        notice = "Sesi baru membutuhkan koneksi dan latest hash yang berhasil diverifikasi. Periksa koneksi lalu coba lagi.";
        render();
        return;
      }
    }
    if (mode === "continue" && !gameplaySnapshot) { notice = "Belum ada sesi tersimpan untuk karakter ini. Tekan New session terlebih dahulu."; render(); return; }
    let activeSha = mode === "new" ? activeStatus.commitSha : gameplaySnapshot;
    const trigger = "analisis link berikut ini secara penuh dan pelajari dengan seksama untuk memulai permainan roleplay ini : https://raw.githubusercontent.com/Antarezka/merzkava-universe/" + activeSha + "/INDEX.md?v=1 dan https://raw.githubusercontent.com/Antarezka/merzkava-universe/" + activeSha + "/players.md?v=1 untuk Memulai permainan sebagai ( " + character.name + " )!";
    const activity = mode === "new" ? trigger : typedActivity;
    const routeQuery = mode === "new" ? "new session character introduction starting location initial character state" : activity;
    gameplayContextBusy = true;
    const sendButton = root.querySelector<HTMLButtonElement>("#gameplay-route-form button[type=submit]");
    const startButton = root.querySelector<HTMLButtonElement>("[data-start-session]");
    if (sendButton) sendButton.disabled = true;
    if (startButton) startButton.disabled = true;
    try {
      if (mode === "continue") { activeStatus = await refreshCanon(activeSha); if (activeStatus.status === "error" || !activeStatus.commitSha) throw new Error(activeStatus.message); activeSha = activeStatus.commitSha; }
      const route = await routeCanonActivity(routeQuery, 7);
      const indexDocument = await getCanonIndex(activeSha);
      if (!indexDocument || indexDocument.commitSha !== activeSha) throw new Error("Bootstrap gagal: INDEX.md pada ACTIVE_SHA penuh tidak tersedia.");
      const playerRegistry = mode === "new" ? await loadPlayerRegistry(activeSha) : null;
      const exactRegistryRow = playerRegistry ? [...playerRegistry.content.matchAll(/^\|\s*([^|]+?)\s*\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|/gm)].find(row => row[1].trim() === character.name) : null;
      const exactRegistryPath = exactRegistryRow ? decodeURIComponent(exactRegistryRow[2].trim()) : null;
      if (mode === "new" && character.registryPath && exactRegistryPath !== character.registryPath) throw new Error("Identitas registry tidak cocok persis dengan players.md pada ACTIVE_SHA.");
      const registeredProfile = mode === "new" && exactRegistryPath ? await loadRegisteredPlayerProfile(activeSha, exactRegistryPath) : null;
      const contextCharacter = registeredProfile ? { ...character, origin: "Registry" } : character;
      const savedSession = mode === "continue" ? await getGameplaySessionRecord(characterId) : null;
      if (mode === "continue" && savedSession && savedSession.snapshotSha !== activeSha) throw new Error("Save sesi dan ACTIVE_SHA berbeda. Sesi tidak boleh mencampur snapshot canon.");
      activeProfileMarkdown = mode === "new" ? (registeredProfile?.content ?? "") : (savedSession?.profileMarkdown ?? "");
      const context = assembleGameplayContext({ ...route, query: activity }, contextCharacter, activeSha, activeStatus.version, 220000);
      context.prompt = "## FULL INDEX.md · HARD GATE · ACTIVE_SHA " + activeSha + "\n" + indexDocument.content + "\n\n" + context.prompt;
      if (playerRegistry) context.prompt += "\n\n## FULL players.md · ACTIVE_SHA " + activeSha + "\n" + playerRegistry.content;
      if (registeredProfile) context.prompt += "\n\n## FULL REGISTERED CHARACTER PROFILE · " + registeredProfile.path + " · ACTIVE_SHA " + activeSha + "\n" + registeredProfile.content;
      const previous = mode === "new" ? [] : activeChat.messages;
      context.prompt += "\n\n## VERIFIED CHARACTER PROFILE SOURCE\n" + (activeProfileMarkdown || (mode === "new" ? "No registered profile markdown is available; use the official new-character bootstrap template and preserve unknowns." : "Legacy session has no persisted verified profile source. Use its chronological transcript only as unverified continuity; do not reset the character or invent state. Ask for a verified save/profile when an action depends on missing state.")) +
        "\n\n## PERSISTED STATE TRUST\n" + (mode === "new" ? "New-session profile source is the baseline. Do not invent missing values." : (savedSession?.stateVerified ? "The persisted state record is marked verified." : "The persisted record is NOT mechanically verified. Preserve only source-backed facts; do not promote prior GM proposals or unverified changes into facts. If an action depends on an unverified value, stop and ask for reconciliation.")) +
        "\n\n## SESSION MODE\n" + (mode === "new" ? "NEW SESSION: initialize from the exact trigger below." : "CONTINUING SESSION: continue without resetting established state.") +
        "\n\n## EXACT TRIGGER\n" + (mode === "new" ? trigger : "Not applicable; continuation.") +
        "\n\n## CHRONOLOGICAL PLAYER/GM TRANSCRIPT\n" + (previous.length ? previous.map(item => (item.role === "player" ? "PLAYER: " : "GM: ") + item.text).join("\n\n") : "No previous turns.") +
        "\n\n## PLAYER PRESENTATION\n" + (activeChat.showOptions ? "Include concise optional GM suggestions at the end." : "Do not provide suggested action options.") +
        "\n\n## LAST GM WORLD TIME\n" + (Object.values(worldTime).some(Boolean) ? JSON.stringify(worldTime) : "No time reported. Do not invent missing fields.") +
        "\nOnly use GM-reported world time. Never use device time. Preserve all established character state.";
      gameplaySnapshot = activeSha;
      gameplayVersion = activeStatus.version;
      const result = await requestGMProposal(new GatewayGMProvider(), context);
      if (!result.valid) throw new Error(result.errors.join(" "));
      gmProposal = result.proposal;
      applyGMWorldTime(gmProposal);
      activeChat.messages.push({ role: "player", text: mode === "new" ? "Memulai sesi baru sebagai " + character.name + "." : typedActivity, createdAt: new Date().toISOString() });
      activeChat.messages.push({ role: "gm", text: gmProposal.narration + (gmProposal.outcome ? "\n\n" + gmProposal.outcome : ""), createdAt: new Date().toISOString() });
      activeChat.started = true;
      form.dataset.sessionMode = "continue";
      saveCharacterChat();
      await saveGameplaySessionRecord({
        characterId,
        snapshotSha: activeSha,
        canonVersion: activeStatus.version,
        profileMarkdown: activeProfileMarkdown,
        stateJson: JSON.stringify({ status: "unverified", worldTime: { ...worldTime }, transcript: activeChat.messages, lastProposal: { snapshot: gmProposal.snapshot, version: gmProposal.version, proposedChanges: gmProposal.proposed_changes }, note: "GM proposals are not authoritative state; deterministic reconciliation is not implemented yet." }),
        stateVerified: false,
        updatedAt: new Date().toISOString()
      });
      renderChat();
      const action = root.querySelector<HTMLTextAreaElement>("#gameplay-action");
      if (action) action.value = "";
    } catch (error) {
      recordBug(error, "Game Master response", "Gameplay");
      notice = error instanceof Error ? error.message : "Game Master gagal merespons.";
      const feed = root.querySelector<HTMLElement>("#conversation-feed");
      if (feed) feed.insertAdjacentHTML("beforeend", '<p class="canon-status" role="alert">' + escapeHtml(notice) + '</p>');
      playWarningBeep();
      lastPlayWarningNotice = notice;
    } finally {
      gameplayContextBusy = false;
      if (sendButton) sendButton.disabled = false;
      if (startButton) startButton.disabled = false;
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
      recordBug(error, "Canon Router", "Canon");
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
      recordBug(error, "Load canon module", "Canon");
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
    recordBug(error, "Save character", "Character storage");
    if (errorNode) errorNode.textContent = error instanceof Error ? error.message : "Could not save character.";
  }
});

window.addEventListener("error", event => { recordBug(event.error ?? event.message, "Uncaught JavaScript error", "Global handler"); render(); });
window.addEventListener("unhandledrejection", event => { recordBug(event.reason, "Unhandled promise rejection", "Global handler"); render(); });
render();
void refreshFloatingReadiness();
document.addEventListener("visibilitychange", () => { if (!document.hidden) void refreshFloatingReadiness(); });
window.addEventListener("focus", () => { void refreshFloatingReadiness(); });
void initializeDatabase().then(async status => {
  databaseMessage = status.message;
  await refreshCharacters();
  try {
    await restoreAuthSession();
    authMessage = getAuthSession() ? "Saved secure session restored." : "";
  } catch (error) {
    recordBug(error, "Restore authentication session", "Authentication");
    authMessage = error instanceof Error ? error.message : "Could not restore secure session.";
  }
  render();
  const canonStatus = await refreshCanon();
  canonMessage = canonStatus.message;
  if (canonStatus.status !== "error" && canonStatus.commitSha) await refreshPlayerRegistry();
  render();
});
