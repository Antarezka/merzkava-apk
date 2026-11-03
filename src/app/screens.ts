import type { LedgerEntry } from "../ui/ledger-log";
import { canonLabelMarkup } from "../ui/canon-labels";
import type { Character } from "../convo/characters/character-repository";
import { PROFILE_FIELDS, parseCharacterProfile, type ProfileField } from "../convo/engine/profile-parser";
import { renderLoreLibrary } from "../world-archive/lore-library";
import { renderExpeditionInterface } from "../offline-game/expedition-interface";

const PROFILE_FIELD_GROUPS = [
  { title: "PROFIL KARAKTER", fields: PROFILE_FIELDS.slice(0, 13) },
  { title: "INV & KEUANGAN", fields: PROFILE_FIELDS.slice(13, 16) },
  { title: "TEKNIK & TUJUAN", fields: PROFILE_FIELDS.slice(16, 18) }
] as const;

export type ScreenId = "home" | "gameplay" | "offline-game" | "character" | "inventory" | "map" | "journal" | "settings";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function registryProfileMarkup(character: Character): string {
  if (!character.profileMarkdown) return "";
  const parsed = parseCharacterProfile(character.profileMarkdown);
  const fields = parsed.valid ? parsed.profile.fields : null;
  const read = (label: ProfileField): string => {
    if (fields) return fields[label] || "Belum tercatat";
    const line = character.profileMarkdown?.split(/\r?\n/).find(item => item.trimStart().startsWith("- **" + label + ":**"));
    return line?.replace(/^\s*-\s*\*\*[^*]+:\*\*\s*/, "").trim() || "Belum tercatat";
  };
  const display = (value: string) => value
    .split(String.fromCharCode(96, 96)).join("")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
  const groups = PROFILE_FIELD_GROUPS.map(group =>
    '<section class="registry-profile-group"><h4>' + group.title + '</h4><dl>' +
    group.fields.map(label => "<dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(display(read(label))) + "</dd>").join("") +
    '</dl></section>'
  ).join("");
  const warning = parsed.valid ? "" : '<p class="registry-profile-warning">Profil belum lengkap atau formatnya tidak sesuai: ' + escapeHtml(parsed.errors.join(" ")) + '</p>';
  return '<details class="registry-profile"><summary>FULL CHARACTER PROFILE · players.md · 18 FIELDS</summary>' + warning + groups + '</details>';
}
function characterView(characters: Character[], registryStatus: string): string {
  const cards = characters.length
    ? characters.map(character => `<article class="character-card"><div class="record-top"><span>${escapeHtml(character.origin)}</span><span class="record-status">${character.registryPath ? "PINNED PROFILE" : character.awakened ? "AWAKENED" : "NOT AWAKENED"}</span></div><h3>${escapeHtml(character.name)}</h3><p class="muted">Age ${character.age ? character.age : "—"} · ${canonLabelMarkup("spirit-realm", character.realm)}${character.registryPath ? "" : " · Cultivation " + character.cultivationLevel}</p><p class="muted">${escapeHtml(character.background || "No background recorded.")}</p>${character.registryPath ? `<span class="record-status">REGISTERED · players.md</span>${registryProfileMarkup(character)}` : `<button class="text-button danger" data-delete-character="${escapeHtml(character.id)}">Delete character</button>`}</article>`).join("")
    : `<div class="empty-state compact"><h3>No character yet</h3><p>Create your first adventurer using the form above.</p></div>`;
  return `<div class="page-heading"><p class="eyebrow">YOUR IDENTITY</p><h2>Character</h2><p class="muted">Create a local character, or refresh the official players.md registry below to select a registered character.</p></div>
  <form id="character-form" class="record-card character-form">
    <div class="record-top"><span>NEW CHARACTER</span><span class="record-status">MORTAL / NOT AWAKENED</span></div>
    <label for="character-name">Character name</label><input id="character-name" name="name" maxlength="40" minlength="2" placeholder="Enter a name" required />
    <label for="character-age">Age</label><input id="character-age" name="age" type="number" min="1" max="120" value="14" required />
    <label for="character-origin">Starting region</label><select id="character-origin" name="origin" required><option>Golden Dragon Empire</option><option>Tianhai Yunzhou</option><option>Beiming Gu</option></select>
    <label for="character-background">Background <span class="optional">(optional)</span></label><textarea id="character-background" name="background" rows="3" maxlength="500" placeholder="A short description of your character…"></textarea>
    <p id="character-error" class="form-message" aria-live="polite"></p>
    <button class="action-button" type="submit">Create character <span>↗</span></button>
  </form>
  <section class="section-block"><div class="section-heading"><span>PLAYER REGISTRY · players.md</span><button class="text-button" type="button" data-refresh-players>↻ Refresh players</button></div><p class="muted" id="player-registry-status">${escapeHtml(registryStatus)}</p><div class="section-heading"><span>YOUR CHARACTERS</span><small>${characters.length} AVAILABLE</small></div><div class="character-list">${cards}</div></section>`;
}


function ledgerLogMarkup(entries: LedgerEntry[]): string {
  if (!entries.length) return '<div class="empty-state compact"><h3>No ledger entries yet</h3><p>Only verified changes to character state will appear here. GM narration alone never changes your records.</p></div>';
  return '<ol class="ledger-log-list">' + [...entries].reverse().map(entry => `
    <li class="ledger-log-entry tone-${entry.tone}">
      <div class="ledger-log-meta"><span>${escapeHtml(entry.title)}</span><time datetime="${escapeHtml(entry.createdAt)}">${escapeHtml(new Date(entry.createdAt).toLocaleString())}</time></div>
      <strong>${escapeHtml(entry.change)}</strong>
      ${entry.labelCategory && entry.label ? canonLabelMarkup(entry.labelCategory, entry.label, entry.stage) : ""}
      ${entry.before || entry.after ? `<p>${escapeHtml(entry.before ?? "")}${entry.before && entry.after ? " → " : ""}${escapeHtml(entry.after ?? "")}</p>` : ""}
      ${entry.detail ? `<small>${escapeHtml(entry.detail)}</small>` : ""}
    </li>`).join("") + "</ol>";
}

type InventorySnapshot = { inventory: string; assets: string; wallet: string };
function inventoryView(entries: LedgerEntry[], snapshot?: InventorySnapshot): string {
  const walletMatch = snapshot?.wallet.match(/^(\d+)\s*xc\s*\|\s*(\d+)\s*xs\s*\|\s*(\d+)\s*xg\s*\|\s*(\d+)\s*zj\s*\|\s*(\d+)\s*az/i);
  const wallet = walletMatch ? walletMatch.slice(1).map((amount, index) => `<span>${amount} ${["xc","xs","xg","zj","az"][index]}</span>`).join("") : `<span>— xc</span><span>— xs</span><span>— xg</span><span>— zj</span><span>— az</span>`;
  const inventory = snapshot?.inventory || "Belum disinkronkan";
  const assets = snapshot?.assets || "Belum disinkronkan";
  return `<div class="page-heading"><p class="eyebrow">POSSESSIONS & FINANCES</p><h2>Inventory</h2><p class="muted">Items, equipment, structures, and wallet.</p></div>
    <div class="wallet-card"><span class="eyebrow">WALLET · GM REPORTED</span><div class="wallet-values">${wallet}</div><p class="muted">${snapshot ? "Saldo dari panel profil gameplay terakhir · belum disahkan." : "Saldo belum tersedia. Mulai sesi dan tunggu profil karakter dari GM."}</p></div>
    <section class="section-block"><div class="section-heading"><span>INVENTORY</span><small>GM REPORTED</small></div><article class="record-card"><p class="muted">${escapeHtml(inventory)}</p></article></section>
    <section class="section-block"><div class="section-heading"><span>BUILDING ASSETS</span><small>GM REPORTED</small></div><article class="record-card"><p class="muted">${escapeHtml(assets)}</p></article></section>
    <section class="section-block ledger-log-panel"><div class="section-heading"><span>LEDGER LOG</span><small>${entries.length} RECORDED CHANGES</small></div>${ledgerLogMarkup(entries)}</section>`;
}

const views: Record<Exclude<ScreenId, "character" | "offline-game">, string> = {
home:`<section class="hero-panel home-hero"><div class="hero-hero-mark" aria-hidden="true">✧</div><p class="eyebrow">TACTICAL ACADEMY · COMMAND HALL</p><h2>Command<br><em>the chronicle.</em></h2><p class="muted">Three powers. Countless lives. One world shaped by the choices made within it.</p><button class="action-button" data-screen="gameplay">Continue your chronicle <span>↗</span></button><span class="hero-edition">COMMAND HALL · THREE POWERS · ONE WORLD</span></section><section class="faction-section"><div class="faction-section-heading"><div><span class="section-kicker">POLITICAL ATLAS · 01—03</span><h2>Three great powers</h2><p>Choose a dossier to explore its place in Merzkava.</p></div><span class="faction-count">03 <small>RECORDS</small></span></div><div class="faction-card-grid"><button class="faction-card faction-golden" type="button" data-faction-entry="golden-dragon" aria-label="Open Golden Dragon Empire dossier"><span class="faction-art" aria-hidden="true"><i class="faction-orbit"></i><b>龍</b><i class="faction-art-line"></i></span><span class="faction-card-content"><span class="faction-index">EASTERN POWER · 01</span><strong>Golden Dragon<br>Empire</strong><span class="faction-description">Imperial administration · Eastern territories</span><span class="faction-open">OPEN DOSSIER <b>↗</b></span></span></button><button class="faction-card faction-tianhai" type="button" data-faction-entry="tianhai" aria-label="Open Tianhai Yunzhou dossier"><span class="faction-art" aria-hidden="true"><i class="faction-orbit"></i><b>海</b><i class="faction-art-line"></i></span><span class="faction-card-content"><span class="faction-index">SOUTHWESTERN POWER · 02</span><strong>Tianhai<br>Yunzhou</strong><span class="faction-description">Floating island · Maritime civilisation</span><span class="faction-open">OPEN DOSSIER <b>↗</b></span></span></button><button class="faction-card faction-beiming" type="button" data-faction-entry="beiming" aria-label="Open Beiming Gu dossier"><span class="faction-art" aria-hidden="true"><i class="faction-orbit"></i><b>北</b><i class="faction-art-line"></i></span><span class="faction-card-content"><span class="faction-index">NORTHERN POWER · 03</span><strong>Beiming Gu</strong><span class="faction-description">Northern highlands · Ancient spiritual heritage</span><span class="faction-open">OPEN DOSSIER <b>↗</b></span></span></button></div></section><section class="section-block home-quick-access"><div class="section-heading"><span>COMMAND DECK</span><small>QUICK ACCESS</small></div><div class="overview-grid"><button class="overview-card" type="button" data-screen="character"><span class="card-index">01</span><h3>Character</h3><p>Identity and cultivation</p><span class="quick-arrow">↗</span></button><button class="overview-card" type="button" data-screen="inventory"><span class="card-index">02</span><h3>Inventory</h3><p>Items and finances</p><span class="quick-arrow">↗</span></button><button class="overview-card" type="button" data-screen="map"><span class="card-index">03</span><h3>World Archive</h3><p>Places, history and records</p><span class="quick-arrow">↗</span></button><button class="overview-card" type="button" data-screen="journal"><span class="card-index">04</span><h3>Journal</h3><p>Your recorded story</p><span class="quick-arrow">↗</span></button></div></section>`,
gameplay:`<section class="world-time-panel" aria-label="Waktu Merzkava Universe">
  <div class="world-time-heading"><span>MERZKAVA · WORLD TIME</span><span class="gm-source">GM REPORTED</span></div>
  <div class="world-time-main"><div class="world-time-era"><small>ERA</small><strong id="session-era"></strong><span>YEAR <b id="session-year"></b></span></div><div class="world-time-clock"><small>WORLD CLOCK</small><strong id="session-clock"></strong><span id="session-cycle"></span></div></div>
  <div class="world-time-details"><span id="session-weekday"></span><span id="session-day"></span><span id="session-season"></span><span id="session-weather"></span></div>
</section>
<section class="conversation-window" aria-label="Conversation">
  <div class="conversation-heading"><span>THE CHRONICLE</span><span>PLAYER SESSION</span></div>
  <div id="conversation-feed" class="conversation-feed" aria-live="polite"><div class="conversation-empty"><span class="conversation-ornament">✧</span><h3>Your story begins here</h3><p>Pilih karakter, lalu mulai sesi baru. Riwayat percakapan tersimpan terpisah untuk setiap karakter.</p></div></div>
  <div class="player-tools"><details class="player-record"><summary>Catatan karakter & status</summary><div id="player-character-record" class="player-record-content">Pilih karakter untuk melihat catatan lokalnya.</div></details><label class="gm-options-toggle"><span>Show GM options</span><select id="gm-options-setting"><option value="no">No</option><option value="yes">Yes</option></select></label></div>
  <form id="gameplay-route-form" class="conversation-composer" data-session-mode="new">
    <div class="composer-topline"><label for="gameplay-character">ACTIVE CHARACTER</label><button class="text-button" type="button" data-refresh-players>↻</button><select id="gameplay-character" name="characterId"><option value="">No character selected</option>{{CHARACTER_OPTIONS}}</select></div>
    <div class="session-actions"><span id="session-status" class="composer-status">Pilih karakter untuk memulai</span><button type="button" class="text-button session-save-button" data-save-session hidden>Save ✧</button></div>
    <div data-session-start><button class="action-button" type="button" data-start-session>Mulai Convo <span>↗</span></button></div>
    <div data-session-compose hidden>
      <label class="composer-label" for="gameplay-action">Aksiku</label>
      <div class="composer-entry-row">
        <textarea id="gameplay-action" name="activity" rows="2" maxlength="1200" enterkeyhint="enter" placeholder="Ceritakan tindakan karaktermu…"></textarea>
        <button id="gameplay-send-action" class="composer-send-button" type="submit" aria-label="Kirim aksi" title="Kirim aksi">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 3.1 21.6 11.2 2.8 20.9l2.1-8.1 8.2-1.1-8.2-1.1L2.8 3.1Z" fill="currentColor"/><path d="m4.9 12.8 8.2-1.1" fill="none" stroke="#eee7d6" stroke-width="1.05" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="composer-format">
        <button class="composer-format-toggle" type="button" data-format-toggle aria-expanded="false" aria-controls="composer-format-panel">
          <span>FORMAT TEKS</span><span class="composer-format-chevron" aria-hidden="true">▾</span>
        </button>
        <div id="composer-format-panel" class="composer-format-panel" hidden>
          <button type="button" data-action-format="italic" aria-label="Italic" title="Italic"><span>*</span><small>Italic</small></button>
          <button type="button" data-action-format="bold" aria-label="Bold" title="Bold"><span>**</span><small>Bold</small></button>
          <button type="button" data-action-format="code" aria-label="Code" title="Code"><span>&#96;</span><small>Code</small></button>
        </div>
      </div>
    </div>
  </form>
</section>`,
inventory:`<div class="page-heading"><p class="eyebrow">POSSESSIONS & FINANCES</p><h2>Inventory</h2><p class="muted">Items, equipment, structures, and wallet.</p></div><div class="wallet-card"><span class="eyebrow">WALLET</span><div class="wallet-values"><span>xc</span><span>xs</span><span>xg</span><span>zj</span><span>az</span></div><p class="muted">Balances will be calculated and validated by the game engine.</p></div><div class="empty-state compact"><h3>Inventory is empty</h3><p>Items acquired during gameplay will be recorded here.</p></div>`,
map:"",
journal:`<div class="page-heading"><p class="eyebrow">YOUR RECORDED HISTORY</p><h2>Journal</h2><p class="muted">Quests, discoveries, and gameplay events.</p></div><div class="empty-state"><span class="empty-symbol">⌁</span><h3>No entries yet</h3><p>Verified events and important story moments will be recorded here.</p></div>`,
settings:`<div class="page-heading"><p class="eyebrow">PERSONAL COMMAND DECK</p><h2>Settings</h2><p class="muted">Atur pengalaman aplikasi dan kelola koneksi ke dunia Merzkava secara terpisah.</p></div><section class="section-block preference-panel"><div class="section-heading"><span>APPEARANCE</span><small>DISPLAY MODE</small></div><p class="muted">The Academy Obsidian theme is the default command-hall palette. Parchment mode switches to a warmer, light reading surface.</p><div class="preference-choice" role="group" aria-label="Appearance"><button type="button" data-theme-mode="light" aria-pressed="true">☼ &nbsp; Parchment Light</button><button type="button" data-theme-mode="dark" aria-pressed="false">☾ &nbsp; Academy Obsidian</button></div></section><section class="section-block preference-panel"><div class="section-heading"><span>SOUND</span><small>APP AUDIO</small></div><div class="setting-row"><div><h3>Sound effects & voice</h3><p>Opening chime, spoken title, interface clicks, and subtle interface sounds.</p></div><button class="preference-toggle" type="button" data-sound-toggle aria-pressed="true">Sound On</button></div></section><section class="section-block floating-mode-settings"><div class="section-heading"><span>FLOATING MODE</span><small>ANDROID OVERLAY</small></div><p class="muted">Keep the same interactive Merzkava session in a movable mini window above other apps. Android will ask for permission the first time.</p><button class="action-button" type="button" data-floating-start>Start Floating Mode <span>↗</span></button></section><div class="setting-row"><div><h3>Save location</h3><p>Local device database</p></div><span class="setting-value">SQLITE</span></div><div class="setting-row"><div><h3>AI Game Master</h3><p>Sign in with Supabase to use the authenticated AI Gateway.</p></div><span class="setting-value">GATEWAY</span></div><div class="setting-row"><div><h3>Canon source</h3><p>Antarezka / merzkava-universe</p></div><span class="setting-value">ACTIVE</span></div>`
};
export function renderScreen(screen: ScreenId, characters: Character[] = [], registryStatus = "Registered characters are loaded from the pinned players.md snapshot.", ledgerEntries: LedgerEntry[] = [], inventorySnapshot?: InventorySnapshot): string {
  if (screen === "offline-game") return renderExpeditionInterface();
  if (screen === "character") return characterView(characters, registryStatus);
  if (screen === "inventory") return inventoryView(ledgerEntries, inventorySnapshot);
  if (screen === "map") return renderLoreLibrary();
  if (screen === "gameplay") {
    const options = characters.map(character => `<option value="${escapeHtml(character.id)}">${escapeHtml(character.name)}</option>`).join("");
    return views.gameplay.replace("{{CHARACTER_OPTIONS}}", options);
  }
  return views[screen];
}
