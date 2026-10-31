import type { Character } from "../characters/character-repository";

export type ScreenId = "home" | "gameplay" | "character" | "inventory" | "map" | "journal" | "settings";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

function characterView(characters: Character[]): string {
  const cards = characters.length
    ? characters.map(character => `<article class="character-card"><div class="record-top"><span>${escapeHtml(character.origin)}</span><span class="record-status">${character.awakened ? "AWAKENED" : "NOT AWAKENED"}</span></div><h3>${escapeHtml(character.name)}</h3><p class="muted">Age ${character.age} · ${escapeHtml(character.realm)} · Cultivation ${character.cultivationLevel}</p><p class="muted">${escapeHtml(character.background || "No background recorded.")}</p><button class="text-button danger" data-delete-character="${escapeHtml(character.id)}">Delete character</button></article>`).join("")
    : `<div class="empty-state compact"><h3>No character yet</h3><p>Create your first adventurer using the form above.</p></div>`;
  return `<div class="page-heading"><p class="eyebrow">YOUR IDENTITY</p><h2>Character</h2><p class="muted">Create a character. Its starting state is validated by the local game engine.</p></div>
  <form id="character-form" class="record-card character-form">
    <div class="record-top"><span>NEW CHARACTER</span><span class="record-status">MORTAL / NOT AWAKENED</span></div>
    <label for="character-name">Character name</label><input id="character-name" name="name" maxlength="40" minlength="2" placeholder="Enter a name" required />
    <label for="character-age">Age</label><input id="character-age" name="age" type="number" min="1" max="120" value="14" required />
    <label for="character-origin">Starting region</label><select id="character-origin" name="origin" required><option>Golden Dragon Empire</option><option>Tianhai Yunzhou</option><option>Beiming Gu</option></select>
    <label for="character-background">Background <span class="optional">(optional)</span></label><textarea id="character-background" name="background" rows="3" maxlength="500" placeholder="A short description of your character…"></textarea>
    <p id="character-error" class="form-message" aria-live="polite"></p>
    <button class="action-button" type="submit">Create character <span>↗</span></button>
  </form>
  <section class="section-block"><div class="section-heading"><span>YOUR CHARACTERS</span><small>${characters.length} SAVED</small></div><div class="character-list">${cards}</div></section>`;
}

const views: Record<Exclude<ScreenId, "character">, string> = {
home:`<section class="hero-panel"><p class="eyebrow">THE EASTERN REALMS AWAIT</p><h2>A new journey<br><em>will rise.</em></h2><p class="muted">Your world, your choices. The rules remain consistent; the story responds to you.</p><button class="action-button" data-screen="gameplay">Enter the world <span>↗</span></button></section><section class="section-block"><div class="section-heading"><span>YOUR WORLD</span><small>OVERVIEW</small></div><div class="overview-grid"><article class="overview-card"><span class="card-index">01</span><h3>Character</h3><p>Identity and cultivation</p></article><article class="overview-card"><span class="card-index">02</span><h3>Inventory</h3><p>Items and finances</p></article><article class="overview-card"><span class="card-index">03</span><h3>World Map</h3><p>Three great powers</p></article><article class="overview-card"><span class="card-index">04</span><h3>Journal</h3><p>Your recorded story</p></article></div></section>`,
gameplay:`<section class="session-calendar-panel" aria-label="Conversation date and time"><div class="calendar-heading"><span>MERZKAVA · SESSION RECORD</span><span class="calendar-live"><i></i> LIVE</span></div><div class="calendar-main"><div class="calendar-date"><span id="session-weekday">SATURDAY</span><strong id="session-day">31</strong><span id="session-month-year">OCTOBER 2026</span></div><div class="calendar-time"><span class="calendar-time-label">LOCAL TIME</span><strong id="session-clock">--:--</strong><span id="session-timezone">DEVICE TIME</span></div></div><div class="calendar-footer"><span>SESSION STARTED</span><time id="session-started">Opening session…</time></div></section><div class="page-heading"><p class="eyebrow">THE STORY UNFOLDS</p><h2>Gameplay</h2><p class="muted">Prepare a canon-grounded GM prompt and validate the AI response.</p></div><div class="record-card"><div class="record-top"><span>AI GAME MASTER</span><span class="record-status">INDEX-DRIVEN</span></div><form id="gameplay-route-form"><label for="gameplay-character">Active character</label><select id="gameplay-character" name="characterId"><option value="">No character selected</option>{{CHARACTER_OPTIONS}}</select><label for="gameplay-action">What is happening in the world?</label><textarea id="gameplay-action" name="activity" rows="3" maxlength="500" placeholder="Example: Yuha travels from a village toward the nearest city…" required></textarea><p class="muted">The app will select relevant official canon modules from the active pinned snapshot.</p><button class="action-button" type="submit">Prepare GM prompt <span>↗</span></button></form><div id="gameplay-context" aria-live="polite"></div></div><div class="empty-state compact"><span class="empty-symbol">✧</span><h3>AI Game Master</h3><p>Sign in from Settings to send this canon-grounded action to the configured AI Gateway. Responses remain proposals until the local game engine validates them.</p><button class="text-button" data-screen="character">Manage characters ↗</button></div>`,
inventory:`<div class="page-heading"><p class="eyebrow">POSSESSIONS & FINANCES</p><h2>Inventory</h2><p class="muted">Items, equipment, structures, and wallet.</p></div><div class="wallet-card"><span class="eyebrow">WALLET</span><div class="wallet-values"><span>xc</span><span>xs</span><span>xg</span><span>zj</span><span>az</span></div><p class="muted">Balances will be calculated and validated by the game engine.</p></div><div class="empty-state compact"><h3>Inventory is empty</h3><p>Items acquired during gameplay will be recorded here.</p></div>`,
map:`<div class="page-heading"><p class="eyebrow">THE KNOWN WORLD</p><h2>World Map</h2><p class="muted">The three great powers of Merzkava Universe.</p></div><div class="realm-list"><article><span>01 / EAST</span><h3>Golden Dragon Empire</h3><p>Imperial territories and orthodox academies.</p></article><article><span>02 / SOUTHWEST</span><h3>Tianhai Yunzhou</h3><p>A floating island realm above the sea.</p></article><article><span>03 / NORTH</span><h3>Beiming Gu</h3><p>A northern power of ancient spirit heritage.</p></article></div>`,
journal:`<div class="page-heading"><p class="eyebrow">YOUR RECORDED HISTORY</p><h2>Journal</h2><p class="muted">Quests, discoveries, and gameplay events.</p></div><div class="empty-state"><span class="empty-symbol">⌁</span><h3>No entries yet</h3><p>Verified events and important story moments will be recorded here.</p></div>`,
settings:`<div class="page-heading"><p class="eyebrow">APPLICATION</p><h2>Settings</h2><p class="muted">Device storage and AI configuration.</p></div><div class="setting-row"><div><h3>Save location</h3><p>Local device database</p></div><span class="setting-value">SQLITE</span></div><div class="setting-row"><div><h3>AI Game Master</h3><p>Sign in with Supabase to use the authenticated AI Gateway.</p></div><span class="setting-value">GATEWAY</span></div><div class="setting-row"><div><h3>Canon source</h3><p>Antarezka / merzkava-universe</p></div><span class="setting-value">PLANNED</span></div>`
};
export function renderScreen(screen: ScreenId, characters: Character[] = []): string {
  if (screen === "character") return characterView(characters);
  if (screen === "gameplay") {
    const options = characters.map(character => `<option value="${escapeHtml(character.id)}">${escapeHtml(character.name)}</option>`).join("");
    return views.gameplay.replace("{{CHARACTER_OPTIONS}}", options);
  }
  return views[screen];
}
