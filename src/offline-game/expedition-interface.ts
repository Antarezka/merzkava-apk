import "./expedition-interface.css";
import {
  ETERNAL_DIALOGUES, getCurrentDialogue, getEternalSave, getExpeditionAtmosphere, getExpeditionScene, getRegionalDialogueCount,
} from "./expedition-game";

function escapeHtml(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]??char));
}
const regionNames:Record<string,string>={"golden-dragon-empire":"Golden Dragon Empire","tianhai-yunzhou":"Tianhai Yunzhou","beiming-gu":"Beiming Gu"};
export function renderExpeditionInterface():string {
  const save=getEternalSave(), scene=getExpeditionScene(), atmosphere=getExpeditionAtmosphere(), dialogue=getCurrentDialogue();
  const sceneWindow=`<section class="expedition-environment" aria-label="Eternal Path scene window" data-location="${scene.id}" data-region="${scene.region}" data-cycle="${atmosphere.cycle}" data-weather="${atmosphere.weather}" style="--scene-fog-opacity:${atmosphere.fog}">
    <img class="expedition-scene-image" src="${scene.image}" alt="" />
    <div class="expedition-light-layer" aria-hidden="true"></div><div class="expedition-weather-layer" aria-hidden="true"></div>
    <div class="expedition-fog-layer" aria-hidden="true"><img class="expedition-fog-motion" src="/game/scenery/shared/fx-02-atmospheric-fog.png" alt="" /></div>
    <div class="expedition-window-frame" aria-hidden="true"></div><span class="expedition-window-label">SCENE WINDOW · LIVE WORLD</span>
    <div class="expedition-scene-copy"><span class="scene-kicker">${escapeHtml(regionNames[scene.region])} · ${escapeHtml(atmosphere.cycle)} · ${escapeHtml(atmosphere.weather)}</span><h3>${escapeHtml(scene.label)}</h3><p>${escapeHtml(scene.detail)}</p></div>
    <span class="scene-coordinate">${save? `DAY ${save.day} · ${String(save.hour).padStart(2,"0")}:${String(save.minute).padStart(2,"0")}`:"WORLD SCENE PREVIEW"}</span>
  </section>`;
  const startPanel=save?`<section class="expedition-character-panel"><div class="section-heading"><span>YOUR ADVENTURER</span><small>LOCAL ETERNAL PATH SAVE</small></div><h3 class="expedition-player-name">${escapeHtml(save.character.name)}</h3><p class="expedition-note">Age ${save.character.age} · ${escapeHtml(regionNames[scene.region])} · Day ${save.day}</p>
    <div class="expedition-status-grid"><article class="expedition-stat"><span>ENERGY</span><strong>${save.energy}</strong><small>Local game state</small></article><article class="expedition-stat"><span>INSIGHT</span><strong>${save.insight}</strong><small>Choices recorded</small></article><article class="expedition-stat"><span>BONDS</span><strong>${save.bonds}</strong><small>Social choices</small></article><article class="expedition-stat"><span>EVENTS</span><strong>${save.completed}</strong><small>Of ${ETERNAL_DIALOGUES.length} nodes</small></article></div>
    <button type="button" class="text-button danger" data-eternal-end>End local journey</button></section>`
    :`<section class="expedition-character-panel"><div class="section-heading"><span>BEGIN A SEPARATE JOURNEY</span><small>OFFLINE · LOCAL SAVE</small></div><p class="expedition-note">This character is created for Eternal Path only. It does not import or alter Convo characters.</p>
      <form id="eternal-start-form" class="expedition-start-form"><label for="eternal-name">Character name</label><input id="eternal-name" name="name" minlength="2" maxlength="32" required placeholder="Your adventurer's name" />
      <div class="expedition-form-row"><div><label for="eternal-age">Age</label><input id="eternal-age" name="age" type="number" min="1" max="120" value="14" required /></div><div><label for="eternal-region">Starting power</label><select id="eternal-region" name="region"><option value="golden-dragon-empire">Golden Dragon Empire</option><option value="tianhai-yunzhou">Tianhai Yunzhou</option><option value="beiming-gu">Beiming Gu</option></select></div></div>
      <button type="submit" class="action-button">Begin Eternal Path <span>↗</span></button></form></section>`;
  const story=save&&dialogue?`<section class="expedition-dialogue" aria-live="polite"><div class="section-heading"><span>CHRONICLE · ${String((save.eventIndex % getRegionalDialogueCount())+1).padStart(3,"0")} / ${getRegionalDialogueCount()}</span><small>${escapeHtml(dialogue.chapter)}</small></div>
    <article class="expedition-dialogue-card"><span class="expedition-speaker">${escapeHtml(dialogue.speaker)}</span><h3>${escapeHtml(dialogue.title)}</h3><p>${escapeHtml(dialogue.text)}</p><div class="expedition-provenance">IN-GAME ORIGINAL · Eternal Path story content</div>
      <div class="expedition-choice-list">${dialogue.choices.map((choice,index)=>`<button type="button" class="expedition-choice" data-eternal-choice="${index}"><span>0${index+1}</span><strong>${escapeHtml(choice.label)}</strong><small>${escapeHtml(choice.response)}</small></button>`).join("")}</div></article></section>`:`<section class="expedition-dialogue expedition-dialogue-locked"><div class="section-heading"><span>THE CHRONICLE</span><small>240 INTERACTIVE NODES</small></div><p>Create a separate Eternal Path character to begin the opening sequence.</p></section>`;
  return `<section class="expedition-page" aria-label="Merzkava Eternal Path"><header class="expedition-heading"><div><p class="eyebrow">STANDALONE · LOCAL LIFE SIMULATION RPG</p><h2>Merzkava:<br><em>Eternal Path</em></h2><p class="muted">A life shaped by the choices you make.</p></div><span class="expedition-mode-mark" aria-label="Offline mode">EP</span></header>
    <div class="expedition-scene-toolbar"><span class="expedition-scene-caption">${escapeHtml(scene.detail)}</span></div>${sceneWindow}${startPanel}${story}
    <section class="expedition-feature-grid"><article class="expedition-feature"><span>01 · EXPLORE</span><h3>World & locations</h3><p>Eight illustrated regional scene compositions, with more locations gated by reviewed Archive sources.</p></article><article class="expedition-feature"><span>02 · LIVE</span><h3>Daily life</h3><p>Actions advance the local clock; day cycle and weather drive the scene presentation.</p></article><article class="expedition-feature"><span>03 · GROW</span><h3>Progression</h3><p>Insight, energy, and bonds respond to deterministic choices.</p></article><article class="expedition-feature"><span>04 · RECORD</span><h3>Chronicle</h3><p>Separate local save; no Convo session or character data is shared.</p></article></section>
    <footer class="expedition-footer"><span>ETERNAL PATH · LOCAL CONTENT PACK</span><span>SCENE ART & DIALOGUE: IN-GAME ORIGINAL</span></footer></section>`;
}
