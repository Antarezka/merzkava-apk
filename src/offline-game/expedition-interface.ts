import "./expedition-interface.css";
import type { Character } from "../convo/characters/character-repository";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char] ?? char);
}

/**
 * First-pass Offline Game / Expedition Interface.
 * This is presentation scaffolding only: no unimplemented gameplay action or
 * unsourced character statistic is presented as functional or authoritative.
 */
export function renderExpeditionInterface(characters: Character[]): string {
  const options = characters.map(character =>
    `<option value="${escapeHtml(character.id)}">${escapeHtml(character.name)}</option>`
  ).join("");
  return `
    <section class="expedition-page" aria-label="Merzkava Eternal Path">
      <header class="expedition-heading">
        <div>
          <p class="eyebrow">STANDALONE · LOCAL ADVENTURE</p>
          <h2>Merzkava:<br><em>Eternal Path</em></h2>
          <p class="muted">A life shaped by the choices you make.</p>
        </div>
        <span class="expedition-mode-mark" aria-label="Offline mode">EP</span>
      </header>

      <section class="expedition-environment" aria-label="Environment viewport">
        <div class="expedition-scene-copy">
          <span class="scene-kicker">ENVIRONMENT · PREVIEW</span>
          <h3>The world awaits.</h3>
          <p>Choose a character to prepare an expedition.</p>
        </div>
        <span class="scene-coordinate">WORLD DATA · NOT LOADED</span>
      </section>

      <section class="expedition-character-panel">
        <div class="section-heading"><span>YOUR ADVENTURER</span><small>LOCAL CHARACTER REGISTRY</small></div>
        <label for="expedition-character">Select character</label>
        <select id="expedition-character" name="characterId">
          <option value="">No character selected</option>${options}
        </select>
        <p class="expedition-note">${characters.length
          ? "Character selection is available. Offline Game save data and progression are not connected yet."
          : "No local character is available yet. Create a character first; Convo sessions and saves remain separate."}</p>
      </section>

      <section class="expedition-status-grid" aria-label="Character status preview">
        <article class="expedition-stat"><span>HP</span><strong>—</strong><small>Not loaded</small></article>
        <article class="expedition-stat"><span>QI</span><strong>—</strong><small>Not loaded</small></article>
        <article class="expedition-stat"><span>SATIETY</span><strong>—</strong><small>Not loaded</small></article>
        <article class="expedition-stat"><span>REALM</span><strong>—</strong><small>Not loaded</small></article>
      </section>

      <section class="expedition-feature-grid">
        <article class="expedition-feature"><span>01 · EXPLORE</span><h3>World & locations</h3><p>Local world package connection pending.</p></article>
        <article class="expedition-feature"><span>02 · LIVE</span><h3>Daily life</h3><p>Time, needs and life-event loop pending.</p></article>
        <article class="expedition-feature"><span>03 · GROW</span><h3>Progression</h3><p>Training and deterministic progression pending.</p></article>
        <article class="expedition-feature"><span>04 · RECORD</span><h3>Quests & journal</h3><p>Offline event and quest persistence pending.</p></article>
      </section>

      <footer class="expedition-footer">
        <span>EXPEDITION INTERFACE · FOUNDATION BUILD</span>
        <span>GAMEPLAY SYSTEMS NOT YET ACTIVE</span>
      </footer>
    </section>`;
}
