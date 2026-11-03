import "./style.css";
import "./ui/floating-ledger.css";
import "./ui/floating-control.css";
import "./ui/gravity-pull-cord.css";
import { cancelOpeningSequence, playButtonSound, playClockworkRatchet, playNavigationTick, playOpeningSequence, playSnapshotSlideSound, playWarningBeep, setSoundEnabled } from "./audio/sound-effects";
import { getGameplaySessionRecord, initializeDatabase, saveGameplaySessionRecord } from "./shared/database";
import { createCharacter, deleteCharacter, listCharacters, type Character } from "./convo/characters/character-repository";
import { validateCharacterDraft } from "./convo/engine/character-validation";
import { renderScreen, type ScreenId } from "./app/screens";
import { initializeIdleTriggerDrag } from "./offline-game/idle-trigger-drag";
import { animateExpeditionChoiceModal, animateExpeditionPanel, mountExpeditionAnimations } from "./offline-game/expedition-animations";
import { deleteEternalSave, exportEternalSave, importEternalSave, loadEternalSave, renameEternalSave, resetEternalGame, resolveEternalSituationChoice, startEternalGame, unloadEternalGame, type EternalRegion } from "./offline-game/expedition-game";
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
import { dustyLetterMarkup } from "./app/dusty-letter";
import { APP_NAME, APP_VERSION } from "./app/app-meta";
import { getLanguage, languagePanelMarkup, translateLabel, translateRenderedContent, setLanguage, type AppLanguage } from "./i18n";
import { animateOpeningSplash, animateSplashCurtain } from "./ui/splash-animation";
import { animateAppScreen } from "./ui/app-shell-motion";
import { initializeGravityPullCord } from "./ui/gravity-pull-cord";
import { closeLoreEntry, closeLoreSource, closeLorePlaceholder, openLoreEntry, openLoreSource, openLorePlaceholder, setLoreCategory, setLoreSearch, renderLoreResults } from "./world-archive/lore-library";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App root element was not found.");
const root = app;
document.title = APP_NAME + " · " + APP_VERSION;


type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "merzkava-theme-mode";
const SOUND_STORAGE_KEY = "merzkava-sound-enabled";
const NAV_COLLAPSED_STORAGE_KEY = "merzkava-nav-collapsed";
let currentLanguage: AppLanguage = getLanguage();
let navigationCollapsed = readPreference(NAV_COLLAPSED_STORAGE_KEY, "false") === "true";
function readPreference(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
let themeMode: ThemeMode = readPreference(THEME_STORAGE_KEY, "dark") === "dark" ? "dark" : "light";
let soundEnabled = readPreference(SOUND_STORAGE_KEY, "true") !== "false";
type ConvoWallpaper = "astral" | "scholar" | "imperial" | "arcanist";
type EternalWallpaper = "spirit" | "clouds" | "echoes" | "tower";
const CONVO_WALLPAPER_KEY = "merzkava-convo-wallpaper.v1";
const ETERNAL_WALLPAPER_KEY = "merzkava-eternal-wallpaper.v1";
let convoWallpaper: ConvoWallpaper = (["astral","scholar","imperial","arcanist"] as string[]).includes(readPreference(CONVO_WALLPAPER_KEY,"astral")) ? readPreference(CONVO_WALLPAPER_KEY,"astral") as ConvoWallpaper : "astral";
let eternalWallpaper: EternalWallpaper = (["spirit","clouds","echoes","tower"] as string[]).includes(readPreference(ETERNAL_WALLPAPER_KEY,"spirit")) ? readPreference(ETERNAL_WALLPAPER_KEY,"spirit") as EternalWallpaper : "spirit";
function applyAppPreferences(): void {
  document.documentElement.dataset.theme = themeMode;
  document.documentElement.dataset.convoWallpaper = convoWallpaper;
  document.documentElement.dataset.eternalWallpaper = eternalWallpaper;
  setSoundEnabled(soundEnabled);
}
function saveAppPreferences(): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    localStorage.setItem(CONVO_WALLPAPER_KEY, convoWallpaper);
    localStorage.setItem(ETERNAL_WALLPAPER_KEY, eternalWallpaper);
  } catch { /* Preferences remain active for this app session. */ }
}
function updateWallpaperSelectionUI(): void {
  root.querySelectorAll<HTMLButtonElement>("[data-wallpaper-select]").forEach(button => {
    const selected = button.dataset.wallpaperSelect === "convo"
      ? button.dataset.wallpaperValue === convoWallpaper
      : button.dataset.wallpaperValue === eternalWallpaper;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const selectedConvo = root.querySelector<HTMLButtonElement>(`[data-wallpaper-select="convo"][data-wallpaper-value="${convoWallpaper}"]`);
  const selectedEternal = root.querySelector<HTMLButtonElement>(`[data-wallpaper-select="eternal"][data-wallpaper-value="${eternalWallpaper}"]`);
  const convoLabel = root.querySelector<HTMLElement>('[data-wallpaper-current="convo"]');
  const eternalLabel = root.querySelector<HTMLElement>('[data-wallpaper-current="eternal"]');
  if (convoLabel && selectedConvo) convoLabel.textContent = selectedConvo.textContent?.trim() ?? "";
  if (eternalLabel && selectedEternal) eternalLabel.textContent = selectedEternal.textContent?.trim() ?? "";
}
applyAppPreferences();
let menuRevealPending = false;
let menuToggleAnimationPending = false;
let languageAnimationPending = false;
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
  { id: "home", label: "Home", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 13.5 20 10l12 3.5v17H8z" fill="#d9c49a" stroke="#8e7047" stroke-width="1.5"/><path d="M15 12V8.5h10V12M13 16v14M27 16v14" fill="none" stroke="#80623f" stroke-width="1.8" stroke-linecap="round"/><path d="M17 19h6v5h-6z" fill="#80623f"/><path d="M18.5 30v-4h3v4" fill="#f0e5cc" stroke="#80623f" stroke-width="1"/></svg>` },
  { id: "offline-game", label: "Eternal Path", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6.5 11.5q7-3 13.5 1v19q-6.5-4-13.5-1zM33.5 11.5q-7-3-13.5 1v19q6.5-4 13.5-1z" fill="#e7ddc7" stroke="#94764b" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 13v18M10 16q4-1 7 1M30 16q-4-1-7 1" fill="none" stroke="#a28354" stroke-width="1.2"/><path d="m20 5 1.2 2.3 2.5.4-1.8 1.8.4 2.5-2.3-1.2-2.3 1.2.4-2.5-1.8-1.8 2.5-.4z" fill="#c5a36c"/></svg>` },
  { id: "map", label: "Archive", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 5.5h15l7 7v22H9z" fill="#e8dfca" stroke="#94764b" stroke-width="1.5" stroke-linejoin="round"/><path d="M24 5.5v7h7M14 18h12M14 22h12M14 26h8" fill="none" stroke="#a17e4e" stroke-width="1.4" stroke-linecap="round"/><circle cx="26.5" cy="29.5" r="3.5" fill="#b18b57" stroke="#80623f" stroke-width="1"/><path d="M26.5 27.5v4" stroke="#f0dfc1" stroke-width="1"/></svg>` },
  { id: "character", label: "Profile", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 6.5c8 0 13.5 6 13.5 13.5S28 33.5 20 33.5 6.5 28 6.5 20 12 6.5 20 6.5z" fill="#e8dfca" stroke="#94764b" stroke-width="1.5"/><path d="M20 11.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM11.5 29c1.5-4 4.2-6 8.5-6s7 2 8.5 6" fill="#b99a6a" stroke="#80623f" stroke-width="1.4" stroke-linecap="round"/></svg>` },
  { id: "gameplay", label: "Convo", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 9.5h24v17H19l-7 5v-5H8z" fill="#e8dfca" stroke="#94784f" stroke-width="1.5" stroke-linejoin="round"/><path d="m17 21 9-10-2 8-7 2z" fill="#b18b57"/><path d="m17 21 4-1" stroke="#6d5437" stroke-width="1.5" stroke-linecap="round"/><circle cx="13" cy="17.5" r="1" fill="#8d714b"/><circle cx="17" cy="17.5" r="1" fill="#8d714b"/></svg>` },
  { id: "inventory", label: "Inventory", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 14h24l-2 18H10z" fill="#e6dcc5" stroke="#94764b" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 14v-3.5a6 6 0 0 1 12 0V14" fill="none" stroke="#b18b57" stroke-width="2"/><path d="M16 21h8" stroke="#80623f" stroke-width="1.5" stroke-linecap="round"/><path d="M20 18v7" stroke="#80623f" stroke-width="1.5" stroke-linecap="round"/></svg>` },
  { id: "journal", label: "Journal", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 7.5h21v26H10q-3 0-3-3V10.5q0-3 3-3z" fill="#e7ddc7" stroke="#94764b" stroke-width="1.5"/><path d="M12 7.5v26M17 14h10M17 19h10M17 24h7" stroke="#9b7a4d" stroke-width="1.4" stroke-linecap="round"/><path d="M27 7.5v6l-2-1.5-2 1.5v-6" fill="#b18b57"/></svg>` },
  { id: "settings", label: "Settings", icon: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 6 3 2 3.5-.5 1.5 3 3 1.5-.5 3.5 2 3-2 3 .5 3.5-3 1.5-1.5 3-3.5-.5-3 2-3-2-3.5.5-1.5-3-3-1.5.5-3.5-2-3 2-3-.5-3.5 3-1.5 1.5-3L17 8z" fill="#d9c49a" stroke="#94764b" stroke-width="1.4" stroke-linejoin="round"/><circle cx="20" cy="20" r="5" fill="#263a33" stroke="#80623f" stroke-width="1.5"/></svg>` }
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
  initializeIdleTriggerDrag();
  translateRenderedContent(root, currentLanguage);
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
    ? floatingControlMarkup(floatingReadiness, currentLanguage)
    : renderScreen(activeScreen as ScreenId, availableCharacters(), playerRegistryMessage, activeCharacterId ? getLedgerLog(activeCharacterId) : [], inventorySnapshot);
  const previousNavigation = root.querySelector<HTMLElement>(".nav-roulette-track");
  if (previousNavigation) savedNavigationScrollLeft = previousNavigation.scrollLeft;
  root.innerHTML = `<div class="app-shell ${isControl ? "control-shell" : ""} ${menuRevealPending ? "is-entering" : ""} ${navigationCollapsed ? "is-nav-collapsed" : ""}">
    ${isControl ? "" : `<header class="app-header"><button class="brand" data-screen="home" aria-label="Merzkava home"><span class="brand-mark">M</span><span class="brand-wordmark"><small>MERZKAVA UNIVERSE</small><strong>Merzkava</strong></span></button><div class="header-context"><small>TACTICAL ACADEMY</small><strong>${translateLabel(navigation.find(item => item.id === activeScreen)?.label ?? "Command Hall", currentLanguage)}</strong></div><div class="header-tools"><button class="header-settings header-kitty-trigger" data-floating-action="start-bubble" aria-label="Start Bubble Mode" title="Start Bubble Mode"><span class="header-kitty-mascot" aria-hidden="true"><img class="header-kitty-layer header-kitty-shadow" src="/kitty/shadow/kitty-shadow.png" alt="" /><img class="header-kitty-layer header-kitty-tail" src="/kitty/ekor/kitty-tail.png" alt="" /><img class="header-kitty-layer header-kitty-body" src="/kitty/body/kitty-body.png" alt="" /><img class="header-kitty-layer header-kitty-head" src="/kitty/kepala/kitty-head.png" alt="" /></span></button><button class="header-settings" data-screen="settings" aria-label="Settings">⚙</button></div></header>
    `}${notice ? `<p class="notice" role="status">${escapeHtml(notice)}</p>` : ""}
    ${isControl ? content : `<main class="main-content">${activeScreen === "settings" ? `<details class="settings-category app-settings-category" open><summary><span>APP SETTINGS</span><small>Appearance · Wallpapers · Language · Sound · Storage</small></summary><div class="settings-category-content">${languagePanelMarkup(currentLanguage)}${content}</div></details><details class="settings-category world-settings-category"><summary><span>WORLD & ACCOUNT</span><small>Supabase · AI Gateway · Canon Source</small></summary><div class="settings-category-content">${authPanel()}${canonPanel()}</div></details>` : `${content}${activeScreen === "home" ? dustyLetterMarkup(currentLanguage, APP_VERSION) : ""}`}</main>`}
    ${isControl ? "" : `<nav class="bottom-nav" aria-label="Academy navigation"><span class="nav-cable nav-cable-left" aria-hidden="true"></span><span class="nav-cable nav-cable-right" aria-hidden="true"></span><div class="nav-roulette-track">${navigation.map((item, index) => `<button class="nav-item ${activeScreen === item.id ? "active" : ""}" data-screen="${item.id}" ${activeScreen === item.id ? 'aria-current="page"' : ""}><span class="nav-item-motion"><span class="nav-index">${String(index + 1).padStart(2, "0")}</span><span class="nav-rotor" aria-hidden="true"><span class="nav-rotor-mark"></span><span class="nav-rotor-grip" data-nav-rotor="${item.id}"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="none" stroke="transparent" stroke-width="7" pointer-events="stroke"/></svg></span><span class="nav-icon-frame nav-icon-frame-${item.id}"><span class="nav-icon"><span class="nav-icon-art">${item.icon}</span></span></span></span><small>${translateLabel(item.label, currentLanguage)}</small></span></button>`).join("")}</div></nav>`}
    ${!isControl ? `<div class="gravity-pull-cord" data-gravity-cord aria-hidden="true"><span class="gravity-cord-anchor"></span><svg class="gravity-cord-line" viewBox="0 0 54 210" aria-hidden="true"><defs><linearGradient id="cord-braid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#491416"/><stop offset=".28" stop-color="#9d302c"/><stop offset=".52" stop-color="#d26b52"/><stop offset=".72" stop-color="#9d302c"/><stop offset="1" stop-color="#491416"/></linearGradient></defs><path data-cord-line d="M 27 5 C 27 48, 27 76, 27 118"/><path class="cord-thread-highlight" d="M 27 5 C 27 48, 27 76, 27 118"/></svg><button class="gravity-cord-terminal" type="button" data-cord-handle aria-label="${translateLabel(navigationCollapsed ? "Pull upward to show toolbar" : "Pull downward to hide toolbar", currentLanguage)}" title="${translateLabel(navigationCollapsed ? "Show toolbar" : "Hide toolbar", currentLanguage)}"><span class="gravity-cord-jewel" aria-hidden="true"></span></button></div>` : ""}

    ${isControl ? "" : `<div class="storage-status"><span class="status-dot"></span>${databaseMessage}</div>`}
    ${activeScreen === "gameplay" ? snapshotBlindMarkup() : ""}
    ${activeScreen === "home" && noticeboardVisible ? noticeboardMarkup() : ""}
    ${bugPanelMarkup()}
  </div>`;
  translateRenderedContent(root, currentLanguage);
  // Preserve the rail's manual roulette offset and each independent mechanical dial angle across rerenders.
  const renderedNavigation = root.querySelector<HTMLElement>(".nav-roulette-track");
  if (renderedNavigation) {
    renderedNavigation.scrollLeft = savedNavigationScrollLeft;
    renderedNavigation.querySelectorAll<HTMLElement>("[data-nav-rotor]").forEach(rotor => {
      const id = rotor.dataset.navRotor;
      if (id) applyNavigationRotor(rotor, id);
    });
    const navigationDock = renderedNavigation.closest<HTMLElement>(".bottom-nav");
    navigationDock?.style.setProperty("--cable-left-offset", `${navigationCableTension}px`);
    navigationDock?.style.setProperty("--cable-right-offset", `${-navigationCableTension}px`);
    navigationDock?.style.setProperty("--cable-gear-angle", `${navigationCableRotation}deg`);
  }
  menuRevealPending = false;
  if (shouldAnimateScreen || menuToggleAnimationPending || languageAnimationPending) {
    animateAppScreen(root.querySelector<HTMLElement>(".app-shell"), { menuToggle: menuToggleAnimationPending });
    menuToggleAnimationPending = false;
    languageAnimationPending = false;
  }
  if (activeScreen === "offline-game") {
    const expeditionPage = root.querySelector<HTMLElement>(".expedition-page");
    if (expeditionPage) cleanupExpeditionAnimations = mountExpeditionAnimations(expeditionPage);
  }
  if (!isControl) lastAnimatedScreen = activeScreen;
  updateSessionCalendar();
  renderChat();
  translateRenderedContent(root, currentLanguage);
  root.querySelectorAll<HTMLButtonElement>("[data-theme-mode]").forEach(button => {
    const selected = button.dataset.themeMode === themeMode;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateWallpaperSelectionUI();
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
let savedNavigationScrollLeft = 0;
const navigationRotorAngles = new Map<string, number>();
let navigationCableTension = 0;
let navigationCableRotation = 0;
let activeNavigationRotor: { element: HTMLElement; pointerId: number; lastPointerAngle: number; startX: number; startY: number; lastTick: number } | null = null;

function applyNavigationRotor(element: HTMLElement, id: string): void {
  const angle = navigationRotorAngles.get(id) ?? 0;
  const tilt = Math.max(-7, Math.min(7, Math.sin(angle * Math.PI / 180) * 7));
  element.style.setProperty("--rotor-angle", `${angle}deg`);
  element.style.setProperty("--icon-tilt", `${tilt}deg`);
}

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
  // Some WebViews do not emit click after a drag/scroll gesture. Release the
  // suppression guard after this pointer sequence so the next tap is independent.
  if (suppressNextPointerClick) window.setTimeout(() => { suppressNextPointerClick = false; }, 0);
}, { passive: true });

root.addEventListener("pointercancel", () => {
  blindDragStartY = null;
  pointerStart = null;
  suppressNextPointerClick = false;
}, { passive: true });

function pointerAngleOnRotor(element: HTMLElement, event: PointerEvent): number {
  const rect = element.getBoundingClientRect();
  return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
}
root.addEventListener("pointerdown", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const rotor = target.closest<HTMLElement>("[data-nav-rotor]");
  if (!rotor || (event.pointerType === "mouse" && event.button !== 0)) return;
  const id = rotor.dataset.navRotor;
  if (!id) return;
  activeNavigationRotor = {
    element: rotor,
    pointerId: event.pointerId,
    lastPointerAngle: pointerAngleOnRotor(rotor, event),
    startX: event.clientX,
    startY: event.clientY,
    lastTick: Math.floor((navigationRotorAngles.get(id) ?? 0) / 22)
  };
  try { rotor.setPointerCapture(event.pointerId); } catch { /* pointer capture may be unavailable in embedded WebViews */ }
}, { passive: true });
root.addEventListener("pointermove", event => {
  const active = activeNavigationRotor;
  if (!active || active.pointerId !== event.pointerId) return;
  const id = active.element.dataset.navRotor;
  if (!id) return;
  const nextPointerAngle = pointerAngleOnRotor(active.element, event);
  let delta = nextPointerAngle - active.lastPointerAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  active.lastPointerAngle = nextPointerAngle;
  if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) > 7) suppressNextPointerClick = true;
  if (Math.abs(delta) > 0.05) {
    const angle = (navigationRotorAngles.get(id) ?? 0) + delta;
    navigationRotorAngles.set(id, angle);
    applyNavigationRotor(active.element, id);
    navigationCableTension = Math.sin(angle * Math.PI / 180) * 2.2;
    navigationCableRotation = angle * 0.42;
    const rail = active.element.closest<HTMLElement>(".bottom-nav");
    rail?.style.setProperty("--cable-left-offset", `${navigationCableTension}px`);
    rail?.style.setProperty("--cable-right-offset", `${-navigationCableTension}px`);
    rail?.style.setProperty("--cable-gear-angle", `${navigationCableRotation}deg`);
    const tick = Math.floor(angle / 22);
    if (tick !== active.lastTick) {
      active.lastTick = tick;
      playClockworkRatchet();
    }
  }
  if (suppressNextPointerClick) event.preventDefault();
}, { passive: false });
root.addEventListener("pointerup", event => {
  if (!activeNavigationRotor || activeNavigationRotor.pointerId !== event.pointerId) return;
  try {
    if (activeNavigationRotor.element.hasPointerCapture(event.pointerId)) activeNavigationRotor.element.releasePointerCapture(event.pointerId);
  } catch { /* pointer capture may already have been released */ }
  activeNavigationRotor = null;
}, { passive: true });
root.addEventListener("pointercancel", event => {
  if (activeNavigationRotor?.pointerId === event.pointerId) activeNavigationRotor = null;
}, { passive: true });

let navigationScrollIntent = false;
let lastNavigationTick = -1;
let navigationIntentTimer: number | undefined;
root.addEventListener("pointerdown", event => {
  if ((event.target as Element | null)?.closest(".nav-roulette-track")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("touchstart", event => {
  if ((event.target as Element | null)?.closest(".bottom-nav")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("wheel", event => {
  if ((event.target as Element | null)?.closest(".bottom-nav")) navigationScrollIntent = true;
}, { passive: true });
root.addEventListener("scroll", event => {
  const nav = event.target;
  if (!(nav instanceof HTMLElement) || !nav.matches(".nav-roulette-track")) return;
  savedNavigationScrollLeft = nav.scrollLeft;
  if (!navigationScrollIntent) return;
  const itemWidth = nav.querySelector<HTMLElement>(".nav-item")?.offsetWidth ?? nav.clientWidth / 4;
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
  const idleNotice=root.querySelector<HTMLElement>("[data-idle-rpg-modal]");
  if(idleNotice&&!idleNotice.hidden){
    idleNotice.hidden=true;
    root.querySelector(".app-shell")?.classList.remove("is-idle-world");
    root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]")?.setAttribute("aria-expanded","false");
    root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]")?.focus();
    return;
  }
  const manager=root.querySelector<HTMLElement>("[data-eternal-manager-content]");
  if(manager&&!manager.hidden){
    manager.hidden=true;
    const backdrop=root.querySelector<HTMLButtonElement>("[data-eternal-manager-backdrop]");
    if(backdrop) backdrop.hidden=true;
    root.querySelector<HTMLButtonElement>(".expedition-manager-trigger")?.setAttribute("aria-expanded","false");
    root.querySelector<HTMLButtonElement>(".expedition-manager-trigger")?.focus();
    return;
  }
  const modal=root.querySelector<HTMLElement>(".expedition-choice-modal:not([hidden])");
  if(!modal) return;
  animateExpeditionChoiceModal(modal,false,()=>root.querySelector<HTMLButtonElement>("[data-eternal-open-choices]")?.focus());
  document.body.classList.remove("eternal-choice-open");
});
root.addEventListener("keydown", event => {
  const idleNotice=root.querySelector<HTMLElement>("[data-idle-rpg-modal]");
  if(event.key==="Escape"&&idleNotice&&!idleNotice.hidden){
    idleNotice.hidden=true;
    root.querySelector(".app-shell")?.classList.remove("is-idle-world");
    root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]")?.setAttribute("aria-expanded","false");
    root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]")?.focus();
    if(history.state?.idleRpgNotice) history.back();
    return;
  }
  if(event.key==="Tab"&&idleNotice&&!idleNotice.hidden){
    const focusable=Array.from(idleNotice.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])'));
    if(focusable.length){
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
    return;
  }
  const manager=root.querySelector<HTMLElement>("[data-eternal-manager-content]");
  if(event.key==="Escape"&&manager&&!manager.hidden){
    manager.hidden=true;
    const backdrop=root.querySelector<HTMLButtonElement>("[data-eternal-manager-backdrop]");
    if(backdrop) backdrop.hidden=true;
    root.querySelector<HTMLButtonElement>(".expedition-manager-trigger")?.setAttribute("aria-expanded","false");
    root.querySelector<HTMLButtonElement>(".expedition-manager-trigger")?.focus();
    if(history.state?.eternalManager) history.back();
    return;
  }
  if(event.key==="Tab"&&manager&&!manager.hidden){
    const focusable=Array.from(manager.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])'));
    if(focusable.length){
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
    return;
  }
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
function commitNavLeverToggle(): void {
  navigationCollapsed = !navigationCollapsed;
  try { localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, String(navigationCollapsed)); } catch { /* Keep the control available for this session. */ }
  menuToggleAnimationPending = false;
  render();
}
initializeGravityPullCord(root, {
  isCollapsed: () => navigationCollapsed,
  toggle: commitNavLeverToggle
});

// Noticeboard dismissal is handled separately from the app's delegated actions.
// A backdrop tap closes it, while a swipe outside the panel is ignored.
let noticeboardBackdropPointer: { id: number; x: number; y: number } | null = null;

function dismissNoticeboard(mode: "once" | "today" = "once"): void {
  if (!noticeboardVisible) return;
  if (mode === "today") {
    try { localStorage.setItem(noticeboardStorageKey, "1"); } catch { /* Session-only dismissal still works. */ }
  }
  noticeboardVisible = false;
  document.body.classList.remove("noticeboard-open");
  noticeboardBackdropPointer = null;
  render();
}

root.addEventListener("pointerdown", (event: PointerEvent) => {
  if (!event.isPrimary || !noticeboardVisible) return;
  const target = event.target;
  if (!(target instanceof Element) || !target.matches(".noticeboard-backdrop")) {
    noticeboardBackdropPointer = null;
    return;
  }
  noticeboardBackdropPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
}, true);

root.addEventListener("pointerup", (event: PointerEvent) => {
  const start = noticeboardBackdropPointer;
  noticeboardBackdropPointer = null;
  if (!start || start.id !== event.pointerId || !noticeboardVisible) return;
  const target = event.target;
  if (!(target instanceof Element) || !target.matches(".noticeboard-backdrop")) return;
  const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
  if (moved > 12) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  dismissNoticeboard("once");
}, true);

root.addEventListener("pointercancel", () => {
  noticeboardBackdropPointer = null;
}, true);

root.addEventListener("click", (event: MouseEvent) => {
  if (!noticeboardVisible) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const dismiss = target.closest<HTMLElement>("[data-notice-dismiss]");
  if (!dismiss) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  dismissNoticeboard(dismiss.dataset.noticeDismiss === "today" ? "today" : "once");
}, true);

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key !== "Escape" || !noticeboardVisible) return;
  event.preventDefault();
  dismissNoticeboard("once");
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
  if (interactive && !target.closest("[data-cord-handle]")) playButtonSound();

  const eternalChoice = target.closest<HTMLButtonElement>("[data-eternal-choice]");
  if (target.closest("[data-eternal-choice-dismiss]")) { const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); if(modal){animateExpeditionChoiceModal(modal,false,()=>root.querySelector<HTMLButtonElement>("[data-eternal-open-choices]")?.focus());} document.body.classList.remove("eternal-choice-open"); if(history.state?.eternalChoiceModal) history.back(); return; }
  if (eternalChoice) { if(eternalChoice.disabled) return; const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); modal?.querySelectorAll<HTMLButtonElement>("[data-eternal-choice]").forEach(button=>{button.disabled=true;}); document.body.classList.remove("eternal-choice-open"); if(history.state?.eternalChoiceModal) history.back(); const choiceId=eternalChoice.dataset.eternalChoice??""; if(modal) animateExpeditionChoiceModal(modal,false,()=>{const result=resolveEternalSituationChoice(choiceId);notice=result? "The moment has been recorded in your journey.": "That response is no longer available.";render();}); else {const result=resolveEternalSituationChoice(choiceId);notice=result? "The moment has been recorded in your journey.": "That response is no longer available.";render();} return; }
  if (target.closest("[data-eternal-open-choices]")) { const modal=root.querySelector<HTMLElement>("[data-eternal-choice-modal]"); if(modal){animateExpeditionChoiceModal(modal,true);document.body.classList.add("eternal-choice-open");history.pushState({eternalChoiceModal:true},"");modal.querySelector<HTMLButtonElement>(".expedition-choice-close")?.focus();} return; }

  const idleRegionButton=target.closest<HTMLButtonElement>("[data-idle-region]");
  if(idleRegionButton){
    const regionId=idleRegionButton.dataset.idleRegion;
    root.querySelectorAll<HTMLElement>("[data-idle-map-region]").forEach(panel=>{
      const active=panel.dataset.idleMapRegion===regionId;
      panel.hidden=!active;
      panel.classList.toggle("is-active",active);
    });
    root.querySelectorAll<HTMLButtonElement>("[data-idle-region]").forEach(button=>button.classList.toggle("is-active",button===idleRegionButton));
    const activePanel=root.querySelector<HTMLElement>("[data-idle-map-region='"+regionId+"']");
    const regionName=idleRegionButton.textContent?.replace(/^\d+/,"").trim()??"";
    const caption=root.querySelector<HTMLElement>("[data-idle-region-name]");
    const subtitle=root.querySelector<HTMLElement>("[data-idle-region-subtitle]");
    if(caption) caption.textContent=regionName;
    if(subtitle) subtitle.textContent=activePanel?.dataset.terrain?.toUpperCase()??"REGIONAL TERRITORY";
    const placeName=root.querySelector<HTMLElement>("[data-idle-place-name]");
    const placeNote=root.querySelector<HTMLElement>("[data-idle-place-note]");
    if(placeName) placeName.textContent="Choose a destination";
    if(placeNote) placeNote.textContent="Select a place from the index or directly on the map.";
    const destinationList=root.querySelector<HTMLElement>("[data-idle-destination-list]");
    if(destinationList&&activePanel){
      destinationList.replaceChildren();
      const mapMarkers=Array.from(activePanel.querySelectorAll<HTMLButtonElement>("[data-idle-place]"));
      mapMarkers.forEach((marker,index)=>{
        const option=document.createElement("button");
        option.type="button";
        option.className="idle-destination-option";
        option.dataset.idlePlace=marker.dataset.idlePlace??"";
        option.dataset.idleGroup="regional";
        option.dataset.idleNote=marker.dataset.idleNote??"";
        const number=document.createElement("span"); number.className="idle-destination-index"; number.textContent=String(index+1).padStart(2,"0");
        const symbol=document.createElement("span"); symbol.className="idle-destination-symbol"; symbol.textContent=marker.querySelector("span")?.textContent??"◇";
        const name=document.createElement("span"); name.className="idle-destination-name"; name.textContent=marker.querySelector("small")?.textContent?.trim()??"Destination";
        const arrow=document.createElement("span"); arrow.className="idle-destination-arrow"; arrow.textContent="›";
        option.append(number,symbol,name,arrow); destinationList.append(option);
      });
      const count=root.querySelector<HTMLElement>("[data-idle-destination-count]");
      if(count) count.textContent=String(mapMarkers.length).padStart(2,"0")+" LOCATIONS";
    }
    return;
  }
  const idlePlaceButton=target.closest<HTMLButtonElement>("[data-idle-place]");
  if(idlePlaceButton){
    const placeName=root.querySelector<HTMLElement>("[data-idle-place-name]");
    const placeNote=root.querySelector<HTMLElement>("[data-idle-place-note]");
    const selectedName=idlePlaceButton.querySelector(".idle-destination-name,small")?.textContent?.trim()??"Destination";
    if(placeName) placeName.textContent=selectedName;
    if(placeNote) placeNote.textContent=idlePlaceButton.dataset.idleNote??"This destination is reserved for a future update.";
    const placeId=idlePlaceButton.dataset.idlePlace;
    const placeGroup=idlePlaceButton.dataset.idleGroup??"regional";
    root.querySelectorAll<HTMLButtonElement>("[data-idle-place]").forEach(button=>{
      const selected=button.dataset.idlePlace===placeId&&button.dataset.idleGroup===placeGroup;
      button.classList.toggle("is-selected",selected);
    });
    return;
  }
  if (target.closest("[data-idle-rpg-open]")) {
    const modal=root.querySelector<HTMLElement>("[data-idle-rpg-modal]");
    const trigger=root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]");
    if(modal&&!modal.hidden){
      modal.hidden=true;
      root.querySelector(".app-shell")?.classList.remove("is-idle-world");
      trigger?.setAttribute("aria-expanded","false");
      trigger?.focus();
      if(history.state?.idleRpgNotice) history.back();
    } else if(modal){
      modal.hidden=false;
      root.querySelector(".app-shell")?.classList.add("is-idle-world");
      trigger?.setAttribute("aria-expanded","true");
      history.pushState({idleRpgNotice:true},"");
      modal.querySelector<HTMLButtonElement>("[data-idle-rpg-close]")?.focus();
    }
    return;
  }
  if (target.closest("[data-idle-rpg-close]")) {
    const modal=root.querySelector<HTMLElement>("[data-idle-rpg-modal]");
    const trigger=root.querySelector<HTMLButtonElement>("[data-idle-rpg-open]");
    if(modal&&!modal.hidden){
      modal.hidden=true;
      root.querySelector(".app-shell")?.classList.remove("is-idle-world");
      trigger?.setAttribute("aria-expanded","false");
      trigger?.focus();
      if(history.state?.idleRpgNotice) history.back();
    }
    return;
  }
  if (target.closest("[data-eternal-manager-toggle]")) {
    const panel=root.querySelector<HTMLElement>("[data-eternal-manager-content]");
    const trigger=root.querySelector<HTMLButtonElement>(".expedition-manager-trigger");
    if(panel){
      panel.hidden=!panel.hidden;
      trigger?.setAttribute("aria-expanded",String(!panel.hidden));
      const backdrop=root.querySelector<HTMLButtonElement>("[data-eternal-manager-backdrop]");
      if(backdrop) backdrop.hidden=panel.hidden;
      if(!panel.hidden){
        history.pushState({eternalManager:true},"");
        animateExpeditionPanel(panel);
        panel.querySelector<HTMLButtonElement>(".expedition-manager-close")?.focus();
      } else {
        if(history.state?.eternalManager) history.back();
        trigger?.focus();
      }
    }
    return;
  }
  if (target.closest("[data-eternal-manager-backdrop]")) {
    const panel=root.querySelector<HTMLElement>("[data-eternal-manager-content]");
    const trigger=root.querySelector<HTMLButtonElement>(".expedition-manager-trigger");
    if(panel&&!panel.hidden){
      panel.hidden=true;
      const backdrop=root.querySelector<HTMLButtonElement>("[data-eternal-manager-backdrop]");
      if(backdrop) backdrop.hidden=true;
      trigger?.setAttribute("aria-expanded","false");
      trigger?.focus();
      if(history.state?.eternalManager) history.back();
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

  const wallpaperButton = target.closest<HTMLButtonElement>("[data-wallpaper-select]");
  if (wallpaperButton) {
    const group = wallpaperButton.dataset.wallpaperSelect;
    const value = wallpaperButton.dataset.wallpaperValue;
    if (group === "convo" && value && ["astral","scholar","imperial","arcanist"].includes(value)) convoWallpaper = value as ConvoWallpaper;
    if (group === "eternal" && value && ["spirit","clouds","echoes","tower"].includes(value)) eternalWallpaper = value as EternalWallpaper;
    applyAppPreferences();
    saveAppPreferences();
    updateWallpaperSelectionUI();
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
  if (target instanceof HTMLSelectElement && target.matches("[data-language-select]")) {
    currentLanguage = setLanguage(target.value);
    languageAnimationPending = true;
    render();
    return;
  }
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
