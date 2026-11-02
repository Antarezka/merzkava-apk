import "./style.css";
import "./ui/floating-ledger.css";
import "./ui/floating-control.css";
import { cancelOpeningSequence, playButtonSound, playNavigationTick, playOpeningSequence, playSnapshotSlideSound, playWarningBeep, setSoundEnabled } from "./audio/sound-effects";
import { getGameplaySessionRecord, initializeDatabase, saveGameplaySessionRecord } from "./shared/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./convo/characters/character-repository";
import { validateCharacterDraft } from "./convo/engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { animateExpeditionChoiceModal, animateExpeditionPanel, mountExpeditionAnimations } from "./offline-game/expedition-animations";
import { chooseEternalOption, deleteEternalSave, exportEternalSave, importEternalSave, loadEternalSave, renameEternalSave, resetEternalGame, startEternalGame, unloadEternalGame, type EternalRegion } from "./offline-game/expedition-game";
import { getCanonIndex, getCanonStatus, loadCanonModule, loadPlayerRegistry, loadRegisteredPlayerProfile, refreshCanon, refreshLatestPlayerRegistry, type CanonDocument } from "./convo/canon/canon-loader";
import { routeCanonActivity } from "./convo/canon/canon-router";
import { assembleGameplayContext } from "./convo/canon/context-assembler";
import { requestGMProposal, validateGMResponse, type GMProposal } from "./convo/engine/gm-engine";
import { parseCharacterProfile, parseGameplayResponseProfile, validateCharacterProfile } from "./convo/engine/profile-parser";
import { reconcileGMProposal } from "./convo/engine/state-reconciliation";
import { selectTrustedProfileBaseline } from "./convo/engine/profile-baseline";
import { buildSaveCheckpointPrompt } from "./convo/engine/save-checkpoint";
import { getAuthSession, isSupabaseConfigured, restoreAuthSession, signInWithPassword, signOut } from "./convo/auth/supabase-auth";
import { GatewayGMProvider, isGMGatewayConfigured } from "./convo/engine/gateway-gm-provider";
import { getLedgerLog, initializeLedgerNotifications, showLedgerProposalBubble } from "./ui/ledger-log";
import { startFloatingMode, requestFloatingOverlayPermission, getFloatingReadiness, requestFloatingNotifications, requestFloatingBatteryExemption, showFloatingBubble, stopFloatingService, type FloatingReadiness } from "./native/floating-window";
import { floatingControlMarkup } from "./app/floating-control";
import { animateOpeningSplash, animateSplashCurtain } from "./ui/splash-animation";
import { animateAppScreen } from "./ui/app-shell-motion";
import { closeLoreEntry, closeLoreSource, closeLorePlaceholder, openLoreEntry, openLoreSource, openLorePlaceholder, setLoreCategory, setLoreSearch, renderLoreResults } from "./world-archive/lore-library";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");
const root = app;


type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "merzkava-theme-mode";
const SOUND_STORAGE_KEY = "merzkava-sound-enabled";
function readPreference(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
let themeMode: ThemeMode = readPreference(THEME_STORAGE_KEY, "dark") === "dark" ? "dark" : "light";
let soundEnabled = readPreference(SOUND_STORAGE_KEY, "true") !== "false";
function applyAppPreferences(): void {
  document.documentElement.dataset.theme = themeMode;
  setSoundEnabled(soundEnabled);
}
function saveAppPreferences(): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  } catch { /* Preferences remain active for this app session. */ }
}
applyAppPreferences();
let menuRevealPending = false;
let cleanupExpeditionAnimations: (() => void) | undefined;
let lastAnimatedScreen: AppScreen | null = null;
const splashAnimationCleanup=new WeakMap<HTMLDivElement,()=>void>();
initializeLedgerNotifications();

function showOpeningSplash(): HTMLDivElement {
  const splash = document.createElement("div");
  splash.className = "opening-splash";
  splash.setAttribute("role", "status");
  splash.setAttribute("aria-label", "Opening Merzkava Universe");
  splash.innerHTML = `
    <div class="splash-content">
      <p class="splash-kicker">WELCOME TO THE EASTERN REALMS</p>
      <div class="splash-stage">
        <div class="splash-wordmark" aria-hidden="true">MERZKAVA</div>
        <div class="splash-light-ray" aria-hidden="true"></div>
        <div class="splash-mascot" role="img" aria-label="Kitty, Merzkava’s black-cat mascot">
          <img class="kitty-layer kitty-shadow" src="/kitty/shadow/kitty-shadow.png" alt="" />
          <img class="kitty-layer kitty-tail" src="/kitty/ekor/kitty-tail.png" alt="" />
          <img class="kitty-layer kitty-body" src="/kitty/body/kitty-body.png" alt="" />
          <img class="kitty-layer kitty-head" src="/kitty/kepala/kitty-head.png" alt="" />
        </div>
      </div>
      <span class="splash-rule" aria-hidden="true"></span>
      <small class="splash-tagline">THE WORLD AWAITS</small>
    </div>`;
  document.body.append(splash);
  splashAnimationCleanup.set(splash,animateOpeningSplash(splash));
  return splash;
}

async function playEntrySplash(): Promise<void> {
  const splashStartedAt=Date.now();
  const splash=showOpeningSplash();
  let closePromise:Promise<void>|null=null;
  const close=():Promise<void>=>{
    if(closePromise) return closePromise;
    closePromise=new Promise(resolve=>{
      animateSplashCurtain(splash,()=>{
        splashAnimationCleanup.get(splash)?.();
        splashAnimationCleanup.delete(splash);
        splash.remove();
        resolve();
      });
    });
    return closePromise;
  };
  splash.addEventListener("click",()=>{cancelOpeningSequence();void close();},{once:true});
  await playOpeningSequence();
  const remainingEntrance=2400-(Date.now()-splashStartedAt);
  if(remainingEntrance>0) await new Promise<void>(resolve=>window.setTimeout(resolve,remainingEntrance));
  await close();
  menuRevealPending=true;
}

const navigation: { id: ScreenId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" }, { id: "gameplay", label: "Convo", icon: "✧" }, { id: "offline-game", label: "Eternal Path", icon: "✦" },
  { id: "character", label: "Character", icon: "◉" }, { id: "inventory", label: "Inventory", icon: "▤" },
  { id: "map", label: "Archive", icon: "⌘" }, { id: "journal", label: "Journal", icon: "☷" },
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
let formatToolbarOpen = false;
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
type ChatMessage = { role: "player" | "gm"; text: string; createdAt: string; kind?: "save"; continued?: boolean };
type CharacterChat = { messages: ChatMessage[]; started: boolean; showOptions: boolean };
const CHAT_STORE_KEY = "merzkava.chat-by-character.v1";
let activeChat: CharacterChat = { messages: [], started: false, showOptions: false };
let saveBusy = false;
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
async function persistChatTranscriptToSQLite(): Promise<void> {
  if (!activeCharacterId) return;
  const record = await getGameplaySessionRecord(activeCharacterId);
  if (!record) return;
  let state: Record<string, unknown> = {};
  try { const parsed = JSON.parse(record.stateJson); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) state = parsed as Record<string, unknown>; } catch { /* Keep the transcript even when an older state payload is malformed. */ }
  await saveGameplaySessionRecord({ ...record, stateJson: JSON.stringify({ ...state, transcript: activeChat.messages, worldTime: { ...worldTime } }), updatedAt: new Date().toISOString() });
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
function latestGameplayProfile(): ReturnType<typeof parseGameplayResponseProfile> | null {
  const latest = [...activeChat.messages].reverse().find(message => message.role === "gm" && message.kind !== "save");
  if (!latest) return null;
  const parsed = parseGameplayResponseProfile(latest.text);
  return parsed.errors.length ? null : parsed;
}
function profileValue(profile: ReturnType<typeof parseGameplayResponseProfile> | null, field: keyof ReturnType<typeof parseGameplayResponseProfile>["profile"]["fields"], fallback = "Belum disinkronkan"): string {
  return profile?.profile.fields[field] || fallback;
}

function renderChat(): void {
  if (activeScreen !== "gameplay") return;
  const feed = root.querySelector<HTMLElement>("#conversation-feed");
  if (feed) {
    feed.innerHTML = activeChat.messages.length
      ? activeChat.messages.map((message, index) => message.kind === "save"
        ? '<article class="chat-message gm save-checkpoint"><small>CHARACTER CHECKPOINT · SAVE</small><div class="save-checkpoint-content">' + escapeHtml(message.text).replace(/\n/g, "<br>") + '</div><div class="save-checkpoint-actions"><button type="button" data-save-copy="' + index + '">Copy</button>' + (message.continued ? '<span class="save-resumed-label">SCENE RESUMED</span>' : '<button type="button" data-save-continue="' + index + '">Lanjut ↗</button>') + '</div></article>'
        : '<article class="chat-message ' + message.role + '"><small>' + (message.role === "gm" ? "GAME MASTER" : "AKSI PEMAIN") + '</small><p>' + escapeHtml(message.text).replace(/\n/g, "<br>") + '</p></article>').join("")
      : '<div class="conversation-empty"><span class="conversation-ornament">✧</span><h3>Your story begins here</h3><p>Mulai sesi baru atau lanjutkan perjalanan yang tersimpan untuk karakter ini.</p></div>';
    feed.scrollTop = feed.scrollHeight;
  }
  const setting = root.querySelector<HTMLSelectElement>("#gm-options-setting");
  if (setting) setting.value = activeChat.showOptions ? "yes" : "no";
  const status = root.querySelector<HTMLElement>("#session-status");
  if (status) status.textContent = activeChat.started ? "Sesi aktif · " + (characterName(activeCharacterId) || "Karakter") : (activeCharacterId ? "Profil siap · Mulai sesi baru" : "Pilih karakter untuk memulai");
  const saveButton = root.querySelector<HTMLButtonElement>("[data-save-session]");
  if (saveButton) { saveButton.hidden = !activeChat.started; saveButton.disabled = saveBusy || gameplayContextBusy; saveButton.textContent = saveBusy ? "Menyusun…" : "Save ✧"; }
  const characterSelect = root.querySelector<HTMLSelectElement>("#gameplay-character");
  if (characterSelect) characterSelect.disabled = saveBusy || gameplayContextBusy;
  const actionInput = root.querySelector<HTMLTextAreaElement>("#gameplay-action");
  if (actionInput) actionInput.disabled = saveBusy || gameplayContextBusy;
  const actionButton = root.querySelector<HTMLButtonElement>("#gameplay-send-action");
  if (actionButton) actionButton.disabled = saveBusy || gameplayContextBusy;
  const startPanel = root.querySelector<HTMLElement>("[data-session-start]");
  const composePanel = root.querySelector<HTMLElement>("[data-session-compose]");
  if (startPanel) startPanel.hidden = activeChat.started;
  if (composePanel) composePanel.hidden = !activeChat.started;
  const routeForm = root.querySelector<HTMLFormElement>("#gameplay-route-form");
  if (routeForm) routeForm.dataset.sessionMode = activeChat.started ? "continue" : "new";
  const character = availableCharacters().find(item => item.id === activeCharacterId);
  const record = root.querySelector<HTMLElement>("#player-character-record");
  const sourceProfile = character?.profileMarkdown ? parseCharacterProfile(character.profileMarkdown) : null;
  const currentProfile = latestGameplayProfile() ?? (sourceProfile?.valid
    ? { profile: sourceProfile.profile, panels: { character: "", inventory: "", techniques: "", continuity: "" }, errors: [] }
    : null);
  const field = (label: string, value: string) => '<dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(value) + '</dd>';
  if (record) record.innerHTML = character
    ? '<details open><summary>PROFIL KARAKTER</summary><dl>' +
      field("Nama", profileValue(currentProfile, "Nama", character.name)) +
      field("Usia", profileValue(currentProfile, "Usia", character.origin === "Registry" ? "Lihat profil registry" : String(character.age))) +
      field("Spirit Realm", profileValue(currentProfile, "Spirit Realm", character.realm)) +
      field("Sync progress", profileValue(currentProfile, "Sync progress")) +
      field("Spirit Ring Absorption", profileValue(currentProfile, "Spirit Ring Absorption")) +
      field("Martial Soul", profileValue(currentProfile, "Martial Soul")) +
      field("Arcanist Grade", profileValue(currentProfile, "Arcanist Grade")) +
      field("Arcanist Focus", profileValue(currentProfile, "Arcanist Focus")) +
      field("HP", profileValue(currentProfile, "HP")) +
      field("Satiety", profileValue(currentProfile, "Satiety")) +
      field("Qi", profileValue(currentProfile, "Qi")) +
      field("Kondisi Tubuh", profileValue(currentProfile, "Kondisi Tubuh")) +
      field("Equipment", profileValue(currentProfile, "Equipment")) +
      field("Asal", character.origin) +
      field("Awakening", character.origin === "Registry" ? "Lihat profil registry" : (character.awakened ? "Awakened" : "Not awakened")) +
      field("Background", character.background || "—") +
      '</dl></details><details><summary>INV & KEUANGAN</summary><p>Inventory: ' + escapeHtml(profileValue(currentProfile, "Inventory")) + '</p><p>Assets Bangunan: ' + escapeHtml(profileValue(currentProfile, "Assets Bangunan")) + '</p><p>Wallet (wealth): ' + escapeHtml(profileValue(currentProfile, "Wallet (wealth)", "Belum diverifikasi · xc | xs | xg | zj | az")) + '</p></details><details><summary>TEKNIK & TUJUAN</summary><p>Teknik / Kemampuan: ' + escapeHtml(profileValue(currentProfile, "Teknik / Kemampuan")) + '</p><p>Tujuan Saat Ini: ' + escapeHtml(profileValue(currentProfile, "Tujuan Saat Ini")) + '</p></details><details><summary>CATATAN PEMAIN & KONSISTENSI</summary><p>' + (currentProfile ? "Nilai terakhir berasal dari respons GM dan masih menunggu verifikasi mekanik serta persetujuan pemain." : "Belum ada profil gameplay dari GM. Aplikasi tidak mengarang atau mengubah nilai yang belum diverifikasi.") + '</p></details>'
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

interface NoticeboardUpdate { title: string; hash: string; version: string; description: string; }
let noticeboardUpdates: NoticeboardUpdate[] = [];
let noticeboardSourceStatus = "Connecting to the World Archive…";
function escapeNoticeText(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}
function highlightNoticeKeywords(value: string): string {
  let safe = escapeNoticeText(value).replace(/\*\*(.+?)\*\*/g, '<mark class="noticeboard-highlight">$1</mark>').replace(/`([^`]+)`/g, '<mark class="noticeboard-highlight">$1</mark>');
  const keywords = ["Golden Dragon Empire", "Tianhai Yunzhou", "Beiming Gu", "Merzkava Universe", "World Map", "Investigation Board", "Spirit Realms", "Spirit Rings", "Spirit Beasts", "Martial Souls", "Arcanists", "Artificial Artifacts", "character records", "regional maps", "maritime routes", "coastal shelves", "deep-sea bathymetry", "Spirit systems", "ancient ruins", "factions"];
  const pattern = new RegExp("<[^>]+>|\\b(" + keywords.join("|") + ")\\b", "gi");
  safe = safe.replace(pattern, (match, keyword: string | undefined) => keyword ? '<mark class="noticeboard-highlight">' + match + '</mark>' : match);
  return safe;
}
function parseNoticeboardUpdates(readme: string): NoticeboardUpdate[] {
  const start = readme.indexOf("**THE LATEST FROM MERZKAVA**");
  if (start < 0) throw new Error("Latest update section not found.");
  const pattern = /^- ✦ \*\*(.+?)\*\*\s*\n\s*Hash:\s*``([^`]+)``\s*\|\s*Ver:\s*``([^`]+)``\s*\n([\s\S]*?)(?=\n- ✦ \*\*|\n<\/div>|$)/gm;
  const result: NoticeboardUpdate[] = [];
  for (const match of readme.slice(start).matchAll(pattern)) { result.push({ title: match[1].trim(), hash: match[2].trim(), version: match[3].trim(), description: match[4].trim().replace(/\s+/g, " ") }); if (result.length === 3) break; }
  if (!result.length) throw new Error("No valid README update bullets found.");
  return result;
}
async function refreshNoticeboardUpdates(): Promise<void> {
  try { const response = await fetch("https://raw.githubusercontent.com/Antarezka/merzkava-universe/main/README.md?noticeboard=" + Date.now(), { cache: "no-store" }); if (!response.ok) throw new Error("README request failed: " + response.status); noticeboardUpdates = parseNoticeboardUpdates(await response.text()); noticeboardSourceStatus = "LIVE · WORLD ARCHIVE"; }
  catch (error) { noticeboardSourceStatus = "ARCHIVE CONNECTION UNAVAILABLE"; console.warn("Noticeboard sync failed:", error); }
  if (noticeboardVisible) render();
}
function noticeboardMarkup(): string {
  const entries = noticeboardUpdates.map((item, index) => '<article class="noticeboard-entry"><span class="noticeboard-entry-index">' + String(index + 1).padStart(2, "0") + '</span><div class="noticeboard-entry-content"><h3>' + highlightNoticeKeywords(item.title) + '</h3><p>' + highlightNoticeKeywords(item.description) + '</p><div class="noticeboard-entry-meta"><span>HASH · ' + escapeNoticeText(item.hash) + '</span><span>' + escapeNoticeText(item.version) + '</span></div></div></article>').join("");
  const content = entries || '<p class="noticeboard-loading">' + escapeNoticeText(noticeboardSourceStatus) + '</p>';
  return '<div class="noticeboard-backdrop" data-noticeboard-backdrop><section class="noticeboard-panel" role="dialog" aria-modal="true" aria-labelledby="noticeboard-title"><div class="noticeboard-topline"><span>MERZKAVA UNIVERSE</span><span>' + (entries ? 'LATEST ARCHIVE NOTES' : 'WORLD ARCHIVE') + '</span></div><button class="noticeboard-close" data-notice-dismiss="once" aria-label="Close noticeboard">×</button><div class="noticeboard-seal">M</div><p class="noticeboard-kicker">A DISPATCH FROM THE WORLD ARCHIVE</p><h2 id="noticeboard-title">The Latest<br><em>Notices</em></h2><div class="noticeboard-rule"><span>✦</span></div><p class="noticeboard-copy">The world does not stand still. These are the latest records from the Merzkava archive.</p><div class="noticeboard-feed">' + content + '</div><div class="noticeboard-actions"><button class="noticeboard-today" data-notice-dismiss="today">Close for today</button><button class="noticeboard-ignore" data-notice-dismiss="once">Dismiss</button></div><p class="noticeboard-footnote">' + escapeNoticeText(noticeboardSourceStatus) + ' · Tap outside to close</p></section></div>';
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
  // Each render replaces the screen DOM. Stop all Anime.js loops/listeners
  // attached to the previous Eternal Path tree before those nodes are detached.
  // Without this, route switches and repeated game actions accumulate infinite
  // scene animations and pointer listeners, which can exhaust Android WebView memory.
  if (cleanupExpeditionAnimations) {
    try { cleanupExpeditionAnimations(); }
    finally { cleanupExpeditionAnimations = undefined; }
  }
  if (activeScreen === "gameplay" && notice && notice !== lastPlayWarningNotice) {
    playWarningBeep();
    lastPlayWarningNotice = notice;
  } else if (!notice || activeScreen !== "gameplay") {
    lastPlayWarningNotice = "";
  }
  const isControl = activeScreen === "control";
  const shouldAnimateScreen = !isControl && (lastAnimatedScreen !== activeScreen || menuRevealPending);
  const selectedCharacter = availableCharacters().find(item => item.id === activeCharacterId);
  const sourceProfile = selectedCharacter?.profileMarkdown ? parseCharacterProfile(selectedCharacter.profileMarkdown) : null;
  const currentProfile = latestGameplayProfile() ?? (sourceProfile?.valid
    ? { profile: sourceProfile.profile, panels: { character: "", inventory: "", techniques: "", continuity: "" }, errors: [] }
    : null);
  const inventorySnapshot = currentProfile ? { inventory: currentProfile.profile.fields.Inventory, assets: currentProfile.profile.fields["Assets Bangunan"], wallet: currentProfile.profile.fields["Wallet (wealth)"] } : undefined;
  const content = isControl
    ? floatingControlMarkup(floatingReadiness)
    : renderScreen(activeScreen as ScreenId, availableCharacters(), playerRegistryMessage, activeCharacterId ? getLedgerLog(activeCharacterId) : [], inventorySnapshot);
  root.innerHTML = `<div class="app-shell ${isControl ? "control-shell" : ""} ${menuRevealPending ? "is-entering" : ""}">
    ${isControl ? "" : `<header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span class="brand-wordmark"><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><div class="header-context"><small>TACTICAL ACADEMY</small><strong>${navigation.find(item => item.id === activeScreen)?.label ?? "Command Hall"}</strong></div><div class="header-tools"><button class="header-settings" data-floating-action="start-bubble" aria-label="Start Bubble Mode" title="Start Bubble Mode">◉</button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></div></header>`}
    ${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}
    ${isControl ? content : `<main class="main-content">${content}${activeScreen === "settings" ? authPanel() + canonPanel() : ""}</main>`}
    ${isControl ? "" : `<nav class="bottom-nav" aria-label="Academy navigation">${navigation.map((item, index) => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span class="nav-index">${String(index + 1).padStart(2, "0")}</span><span class="nav-icon">${item.icon}</span><small>${item.label}</small></button>`).join("")}</nav>`}
    ${isControl ? "" : `<div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>`}
    ${activeScreen === "gameplay" ? snapshotBlindMarkup() : ""}
    ${activeScreen === "home" && noticeboardVisible ? noticeboardMarkup() : ""}
    ${bugPanelMarkup()}
  </div>`;
  // Keep the navigation rail anchored at its initial scroll position on route changes.
  // Users may still swipe the rail manually; selecting a screen must not move the rail.
  menuRevealPending = false;
  if (shouldAnimateScreen) animateAppScreen(root.querySelector<HTMLElement>(".app-shell"));
  if (activeScreen === "offline-game") {
    const expeditionPage = root.querySelector<HTMLElement>(".expedition-page");
    if (expeditionPage) cleanupExpeditionAnimations = mountExpeditionAnimations(expeditionPage);
  }
  if (!isControl) lastAnimatedScreen = activeScreen;
  updateSessionCalendar();
  renderChat();
  root.querySelectorAll<HTMLButtonElement>("[data-theme-mode]").forEach(button => {
    const selected = button.dataset.themeMode === themeMode;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const soundToggle = root.querySelector<HTMLButtonElement>("[data-sound-toggle]");
  if (soundToggle) {
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
  }
  const formatToggle = root.querySelector<HTMLButtonElement>("[data-format-toggle]");
  const formatPanel = root.querySelector<HTMLElement>("#composer-format-panel");
  if (formatToggle && formatPanel) {
    formatPanel.hidden = !formatToolbarOpen;
    formatToggle.setAttribute("aria-expanded", String(formatToolbarOpen));
    const chevron = formatToggle.querySelector<HTMLElement>(".composer-format-chevron");
    if (chevron) chevron.textContent = formatToolbarOpen ? "▴" : "▾";
  }
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
      background: player.background,
      realm: player.realm,
      cultivationLevel: 0,
      awakened: false,
      createdAt: "",
      registryPath: player.path,
      registryCommitSha: result.commitSha,
      profileMarkdown: player.profileMarkdown
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

let navigationScrollIntent = false;
let lastNavigationTick = -1;
let navigationIntentTimer: number | undefined;
root.addEventListener("pointerdown", event => {
  if ((event.target as Element | null)?.closest(".bottom-nav")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("touchstart", event => {
  if ((event.target as Element | null)?.closest(".bottom-nav")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("wheel", event => {
  if ((event.target as Element | null)?.closest(".bottom-nav")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("scroll", event => {
  const nav = event.target;
  if (!(nav instanceof HTMLElement) || !nav.matches(".bottom-nav") || !navigationScrollIntent) return;
  const itemWidth = nav.clientWidth / 4;
  if (!itemWidth) return;
  const tick = Math.round(nav.scrollLeft / itemWidth);
  if (tick !== lastNavigationTick) {
    lastNavigationTick = tick;
    playNavigationTick();
  }
  window.clearTimeout(navigationIntentTimer);
  navigationIntentTimer = window.setTimeout(() => { navigationScrollIntent = false; }, 650);
}, true);

window.addEventListener("popstate", () => {
  const modal=root.querySelector<HTMLElement>(".expedition-choice-modal:not([hidden])");
  if(!modal) return;
  animateExpeditionChoiceModal(modal,false,()=>root.querySelector<HTMLButtonElement>("[data-eternal-open-choices]")?.focus());
  document.body.classList.remove("eternal-choice-open");
});
root.addEventListener("keydown", event => {
  const modal=root.querySelector<HTMLElement>(".expedition-choice-modal:not([hidden])");
  if(!modal) return;
  if(event.key==="Escape") {
    animateExpeditionChoiceModal(modal,false,()=>root.querySelector<HTMLButtonElement>("[data-eternal-open-choices]")?.focus());
    document.body.classList.remove("eternal-choice-open");
    if(history.state?.eternalChoiceModal) history.back();
    return;
  }
  if(event.key==="Tab") {
    const focusable=Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])'));
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
root.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const activeEternalModal=root.querySelector<HTMLElement>(".expedition-choice-modal:not([hidden])");
  if(activeEternalModal && !target.closest(".expedition-choice-modal")) return;
  if (event.detail !== 0 && suppressNextPointerClick) {
    suppressNextPointerClick = false;
    return;
  }
  const interactive = target.closest(
    "button:not(:disabled), a[href], [role='button'], [role='tab'], [role='menuitem'], input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled), summary"
  );
  if (interactive) playButtonSound();

  const eternalChoice = target.closest<HTMLButtonElement>("[data-eternal-choice]");
  if (target.closest("[data-eternal-choice-dismiss]")) { const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); if(modal){animateExpeditionChoiceModal(modal,false,()=>root.querySelector<HTMLButtonElement>("[data-eternal-open-choices]")?.focus());} document.body.classList.remove("eternal-choice-open"); if(history.state?.eternalChoiceModal) history.back(); return; }
  if (eternalChoice) { if(eternalChoice.disabled) return; const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); modal?.querySelectorAll<HTMLButtonElement>("[data-eternal-choice]").forEach(button=>{button.disabled=true;}); document.body.classList.remove("eternal-choice-open"); if(history.state?.eternalChoiceModal) history.back(); if(modal) animateExpeditionChoiceModal(modal,false,()=>{chooseEternalOption(Number(eternalChoice.dataset.eternalChoice));render();}); else {chooseEternalOption(Number(eternalChoice.dataset.eternalChoice));render();} return; }
  if (target.closest("[data-eternal-open-choices]")) { const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); if(modal){animateExpeditionChoiceModal(modal,true);document.body.classList.add("eternal-choice-open");history.pushState({eternalChoiceModal:true},"");modal.querySelector<HTMLButtonElement>(".expedition-choice-close")?.focus();} return; }

  if (target.closest("[data-eternal-manager-toggle]")) {
    const panel=root.querySelector<HTMLElement>("[data-eternal-manager-content]");
    const trigger=root.querySelector<HTMLButtonElement>(".expedition-manager-trigger");
    if(panel){
      panel.hidden=!panel.hidden;
      trigger?.setAttribute("aria-expanded",String(!panel.hidden));
      if(!panel.hidden){
        animateExpeditionPanel(panel);
        panel.querySelector<HTMLButtonElement>(".expedition-manager-close")?.focus();
      } else trigger?.focus();
    }
    return;
  }
  if (target.closest("[data-eternal-new-form]")) {
    const form=root.querySelector<HTMLElement>("#eternal-start-form");
    if(form){form.hidden=!form.hidden;if(!form.hidden){animateExpeditionPanel(form);form.querySelector<HTMLInputElement>("#eternal-name")?.focus();}}
    return;
  }
  const loadJourney=target.closest<HTMLButtonElement>("[data-eternal-save-load]");
  if(loadJourney){if(loadEternalSave(loadJourney.dataset.eternalSaveLoad??"")){notice="Journey loaded.";render();}return;}
  const deleteJourney=target.closest<HTMLButtonElement>("[data-eternal-save-delete]");
  if(deleteJourney){const id=deleteJourney.dataset.eternalSaveDelete??"";if(id&&window.confirm("Delete this journey and all of its non-canon data? This cannot be undone.")){deleteEternalSave(id);notice="Journey deleted.";render();}return;}
  const renameToggle=target.closest<HTMLButtonElement>("[data-eternal-save-rename-toggle]");
  if(renameToggle){const form=renameToggle.closest<HTMLElement>("[data-save-card]")?.querySelector<HTMLElement>("[data-eternal-rename-form]");if(form){form.hidden=!form.hidden;if(!form.hidden){animateExpeditionPanel(form);form.querySelector<HTMLInputElement>("input")?.focus();}}return;}
  const exportJourney=target.closest<HTMLButtonElement>("[data-eternal-save-export]");
  if(exportJourney){const payload=exportEternalSave(exportJourney.dataset.eternalSaveExport??"");if(payload){const blob=new Blob([payload],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="merzkava-eternal-path-"+(exportJourney.dataset.eternalSaveExport??"journey")+".json";link.click();URL.revokeObjectURL(url);}return;}
  if (target.closest("[data-eternal-reset-all]")) {
    if(window.confirm("Delete ALL Eternal Path journeys and their non-canon data?")&&window.confirm("Confirm permanent reset. The World Archive and Convo characters will not be changed.")){
      resetEternalGame();notice="All Eternal Path journeys were reset.";render();
    }
    return;
  }
  if (target.closest("[data-eternal-end]")) { unloadEternalGame(); notice="Journey saved. You can load it again from Journey Manager."; render(); return; }
  const saveCopyButton = target.closest<HTMLButtonElement>("[data-save-copy]");
  if (saveCopyButton) {
    const message = activeChat.messages[Number(saveCopyButton.dataset.saveCopy)];
    if (!message || message.kind !== "save") return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(message.text);
      else {
        const field = document.createElement("textarea"); field.value = message.text; field.setAttribute("readonly", ""); field.style.position = "fixed"; field.style.opacity = "0"; document.body.append(field); field.select();
        const copied = document.execCommand("copy"); field.remove(); if (!copied) throw new Error("Clipboard API tidak tersedia di perangkat ini.");
      }
      saveCopyButton.textContent = "Tersalin ✓";
    } catch (error) { recordBug(error, "Copy character checkpoint", "Gameplay Save"); render(); }
    return;
  }
  const resumeSaveButton = target.closest<HTMLButtonElement>("[data-save-continue]");
  if (resumeSaveButton) {
    const message = activeChat.messages[Number(resumeSaveButton.dataset.saveContinue)];
    if (!message || message.kind !== "save") return;
    message.continued = true;
    saveCharacterChat();
    try { await persistChatTranscriptToSQLite(); } catch (error) { recordBug(error, "Persist resumed gameplay transcript", "Gameplay Save"); }
    renderChat();
    root.querySelector<HTMLTextAreaElement>("#gameplay-action")?.focus();
    return;
  }
  const saveSessionButton = target.closest<HTMLButtonElement>("[data-save-session]");
  if (saveSessionButton) {
    if (saveBusy || gameplayContextBusy || !activeChat.started || !activeCharacterId || !gameplaySnapshot || !gameplayVersion) return;
    if (!isGMGatewayConfigured() || !getAuthSession()) { notice = "AI Game Master belum siap. Login dan lengkapi konfigurasi Gateway di Settings sebelum membuat Save."; render(); return; }
    saveBusy = true;
    renderChat();
    try {
      const gameplayMessages = activeChat.messages.filter(item => item.kind !== "save");
      const latestGM = [...gameplayMessages].reverse().find(item => item.role === "gm");
      if (!latestGM) throw new Error("Belum ada respons gameplay dari GM untuk dijadikan checkpoint.");
      const profile = parseGameplayResponseProfile(latestGM.text);
      const profileStatus = profile.errors.length ? "Panel profil terakhir tidak dapat diparse: " + profile.errors.join(" ") : "Panel profil gameplay terakhir tersedia dan menjadi acuan status saat ini.";
      const prompt = buildSaveCheckpointPrompt({
        characterName: characterName(activeCharacterId) || "Belum diketahui",
        profileMarkdown: activeProfileMarkdown,
        lastProfileStatus: profileStatus,
        transcript: gameplayMessages.map(item => ({ role: item.role, text: item.text }))
      });
      const checkpoint = await new GatewayGMProvider().generate(prompt, { snapshot: gameplaySnapshot, version: gameplayVersion });
      if (!checkpoint.trim()) throw new Error("GM mengembalikan Save kosong.");
      activeChat.messages.push({ role: "gm", kind: "save", text: checkpoint.trim(), createdAt: new Date().toISOString() });
      saveCharacterChat();
      await persistChatTranscriptToSQLite();
      renderChat();
      const feed = root.querySelector<HTMLElement>("#conversation-feed");
      if (feed) feed.scrollTop = feed.scrollHeight;
    } catch (error) {
      recordBug(error, "Create character checkpoint", "Gameplay Save");
      notice = error instanceof Error ? error.message : "Save gagal dibuat.";
      render();
    } finally {
      saveBusy = false;
      renderChat();
    }
    return;
  }
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

  const themeButton = target.closest<HTMLButtonElement>("[data-theme-mode]");
  if (themeButton) {
    const requested = themeButton.dataset.themeMode;
    if (requested === "light" || requested === "dark") {
      themeMode = requested;
      applyAppPreferences();
      saveAppPreferences();
      render();
    }
    return;
  }
  const soundToggle = target.closest<HTMLButtonElement>("[data-sound-toggle]");
  if (soundToggle) {
    soundEnabled = !soundEnabled;
    applyAppPreferences();
    saveAppPreferences();
    render();
    return;
  }

  const formatToggle = target.closest<HTMLButtonElement>("[data-format-toggle]");
  if (formatToggle) {
    formatToolbarOpen = !formatToolbarOpen;
    const panel = root.querySelector<HTMLElement>("#composer-format-panel");
    panel && (panel.hidden = !formatToolbarOpen);
    formatToggle.setAttribute("aria-expanded", String(formatToolbarOpen));
    const chevron = formatToggle.querySelector<HTMLElement>(".composer-format-chevron");
    if (chevron) chevron.textContent = formatToolbarOpen ? "▴" : "▾";
    return;
  }
  const formatButton = target.closest<HTMLButtonElement>("[data-action-format]");
  if (formatButton) {
    const textarea = root.querySelector<HTMLTextAreaElement>("#gameplay-action");
    if (!textarea) return;
    const format = formatButton.dataset.actionFormat;
    const wrappers: Record<string, [string, string]> = {
      italic: ["*", "*"],
      bold: ["**", "**"],
      code: ["`", "`"]
    };
    const wrapper = format ? wrappers[format] : undefined;
    if (!wrapper) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const [prefix, suffix] = wrapper;
    textarea.setRangeText(prefix + selected + suffix, start, end, "select");
    if (selected) textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    else textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
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
  const factionEntry = target.closest<HTMLButtonElement>("[data-faction-entry]");
  if (factionEntry?.dataset.factionEntry) {
    if (openLoreEntry(factionEntry.dataset.factionEntry)) {
      activeScreen = "map";
      notice = "";
      render();
    }
    return;
  }
  const lorePlaceholderOpen = target.closest<HTMLElement>("[data-lore-placeholder-open]");
  if (lorePlaceholderOpen?.dataset.lorePlaceholderOpen) {
    if (openLorePlaceholder(lorePlaceholderOpen.dataset.lorePlaceholderOpen)) render();
    return;
  }
  if (target.closest("[data-lore-placeholder-back]")) {
    closeLorePlaceholder();
    render();
    return;
  }
  const loreSourceOpen = target.closest<HTMLElement>("[data-lore-source-open]");
  if (loreSourceOpen?.dataset.loreSourceOpen) {
    if (openLoreSource(loreSourceOpen.dataset.loreSourceOpen)) render();
    return;
  }
  if (target.closest("[data-lore-source-back]")) {
    closeLoreSource();
    render();
    return;
  }
  const loreOpen = target.closest<HTMLElement>("[data-lore-open]");
  if (loreOpen?.dataset.loreOpen) {
    if (openLoreEntry(loreOpen.dataset.loreOpen)) render();
    return;
  }
  if (target.closest("[data-lore-back]")) {
    closeLoreEntry();
    render();
    return;
  }
  const loreCategory = target.closest<HTMLElement>("[data-lore-category]");
  if (loreCategory?.dataset.loreCategory) {
    setLoreCategory(loreCategory.dataset.loreCategory);
    render();
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

root.addEventListener("input", event => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.id === "lore-search") {
    setLoreSearch(target.value);
    const results = root.querySelector<HTMLElement>("#lore-results");
    if (results) results.innerHTML = renderLoreResults();
  }
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

root.addEventListener("change", async event => {
  const input=event.target;
  if(!(input instanceof HTMLInputElement)||!input.matches("[data-eternal-import]")) return;
  const file=input.files?.[0];if(!file) return;
  try {
    importEternalSave(await file.text());
    notice="Journey backup imported successfully.";
    render();
  } catch(error) {
    notice=error instanceof Error?error.message:"Could not import this journey backup.";
    render();
  }
});

root.addEventListener("submit", async (event: SubmitEvent) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.matches("[data-eternal-rename-form]")) {
    event.preventDefault();
    const id=form.getAttribute("data-eternal-rename-form")??"";
    const name=String(new FormData(form).get("name")??"");
    if(renameEternalSave(id,name)){notice="Journey name updated.";render();}
    return;
  }
  if (form.id === "eternal-start-form") {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const age = Number(data.get("age"));
    const region = String(data.get("region")) as EternalRegion;
    if (name.length < 2 || !Number.isInteger(age) || age < 1 || age > 120) return;
    startEternalGame({name,age,region});
    notice = "";
    render();
    return;
  }
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
    // Continuing player actions can only be submitted by the dedicated paper-plane button.
    if (mode === "continue" && (!(event.submitter instanceof HTMLButtonElement) || event.submitter.id !== "gameplay-send-action")) return;
    if (saveBusy || gameplayContextBusy || !characterId || (mode === "continue" && !typedActivity)) return;
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
    const sendButton = root.querySelector<HTMLButtonElement>("#gameplay-send-action");
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
      const previous = mode === "new" ? [] : activeChat.messages.filter(item => item.kind !== "save");
      const baselineParse = selectTrustedProfileBaseline({
        mode,
        profileMarkdown: activeProfileMarkdown,
        stateVerified: savedSession?.stateVerified === true
      });
      const profileValidationErrors = baselineParse.valid ? [] : baselineParse.errors;
      const usableProfile = baselineParse.valid ? baselineParse.profile : null;
      const context = assembleGameplayContext({ ...route, query: activity }, contextCharacter, activeSha, activeStatus.version, 220000);
      context.prompt = "## FULL INDEX.md · HARD GATE · ACTIVE_SHA " + activeSha + "\n" + indexDocument.content + "\n\n" + context.prompt;
      if (playerRegistry) context.prompt += "\n\n## FULL players.md · ACTIVE_SHA " + activeSha + "\n" + playerRegistry.content;
      if (registeredProfile) context.prompt += "\n\n## FULL REGISTERED CHARACTER PROFILE · " + registeredProfile.path + " · ACTIVE_SHA " + activeSha + "\n" + registeredProfile.content;
      const profileSourceHeading = mode === "new" || savedSession?.stateVerified === true
        ? "VERIFIED CHARACTER PROFILE SOURCE"
        : "ORIGINAL CHARACTER PROFILE SOURCE · NOT A VERIFIED CURRENT STATE";
      context.prompt += "\n\n## " + profileSourceHeading + "\n" + (activeProfileMarkdown || (mode === "new" ? "No registered profile markdown is available; use the official new-character bootstrap template and preserve unknowns." : "No verified current profile checkpoint exists. Use the chronological transcript only as unverified continuity; do not reset the character or promote prior GM proposals into facts. Ask for a verified save/profile when an action depends on missing state.")) +
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
      const responsePanels = parseGameplayResponseProfile(gmProposal.player_response);
      if (responsePanels.errors.length) throw new Error("Respons GM ditolak karena tidak sesuai empat panel resmi: " + responsePanels.errors.join(" "));
      const responseProfileErrors = validateCharacterProfile(responsePanels.profile);
      if (responseProfileErrors.length) throw new Error("Nilai panel profil GM tidak valid: " + responseProfileErrors.join(" "));
      const stateReconciliation = reconcileGMProposal(usableProfile, gmProposal, responsePanels.profile, gmProposal.player_response);
      if (usableProfile && (stateReconciliation.status === "rejected" || stateReconciliation.errors.length > 0)) throw new Error("Panel profil dan Ledger Log tidak konsisten dengan baseline: " + stateReconciliation.errors.join(" "));
      const resourceChangesAreCandidates = usableProfile !== null && stateReconciliation.errors.length === 0 && stateReconciliation.changes.every(change => change.status === "candidate");
      const eventFields = new Set(gmProposal.ledger_events.map(event => event.kind === "item" ? "Inventory" : "Wallet (wealth)"));
      const declaredResourceFields = new Set(gmProposal.state_changes.filter(change => change.field === "Inventory" || change.field === "Wallet (wealth)").map(change => change.field));
      if (declaredResourceFields.size > 0 && gmProposal.ledger_events.length === 0) {
        throw new Error("Perubahan Inventory/Wallet wajib memiliki rincian peristiwa item atau uang agar notifikasi tidak terlewat.");
      }
      if (gmProposal.ledger_events.length && (!resourceChangesAreCandidates || [...eventFields].some(field => !declaredResourceFields.has(field)))) {
        throw new Error("Peristiwa item/uang tidak cocok dengan perubahan Inventory/Wallet yang lolos rekonsiliasi.");
      }
      if (resourceChangesAreCandidates) gmProposal.ledger_events.forEach(showLedgerProposalBubble);
      applyGMWorldTime(gmProposal);
      activeChat.messages.push({ role: "player", text: mode === "new" ? "Memulai sesi baru sebagai " + character.name + "." : typedActivity, createdAt: new Date().toISOString() });
      activeChat.messages.push({ role: "gm", text: gmProposal.player_response, createdAt: new Date().toISOString() });
      activeChat.started = true;
      form.dataset.sessionMode = "continue";
      saveCharacterChat();
      await saveGameplaySessionRecord({
        characterId,
        snapshotSha: activeSha,
        canonVersion: activeStatus.version,
        profileMarkdown: activeProfileMarkdown,
        stateJson: JSON.stringify({ status: "unverified", worldTime: { ...worldTime }, transcript: activeChat.messages, profileValidation: { valid: profileValidationErrors.length === 0, errors: profileValidationErrors }, responseProfile: responsePanels.profile.fields, lastProposal: { snapshot: gmProposal.snapshot, version: gmProposal.version, proposedChanges: gmProposal.proposed_changes, stateChanges: gmProposal.state_changes }, reconciliation: stateReconciliation, note: "Player-facing response is the exact four-panel template output. Panel fields are parsed and cross-checked against structured deltas and the prior profile. No proposal is applied; canon-mechanics verification and explicit player approval are still required." }),
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
    target.innerHTML = "<article class=\"record-card\"><div class=\"record-top\"><span>GM PROPOSAL</span><span class=\"record-status\">VALIDATED · NOT APPLIED</span></div><h3>Canonical player response</h3><p>" + escapeHtml(gmProposal.player_response).replace(/\n/g, "<br>") + "</p><h3>Canon basis</h3>" + list(gmProposal.canon_basis) + "<h3>Proposed changes (not applied)</h3>" + list(gmProposal.proposed_changes) + "<h3>Unresolved questions</h3>" + list(gmProposal.unresolved_questions) + "<p class=\"canon-status\" role=\"status\">Structure valid. No game state has been changed.</p></article>";
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
void refreshNoticeboardUpdates();
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
