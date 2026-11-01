import "./expedition-interface.css";
import {
  getCurrentDialogue, getEternalSave, getExpeditionAtmosphere, getExpeditionScene, getRegionalDialogueCount,
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
  const startPanel=save?`<section class="expedition-character-panel expedition-profile-compact" aria-label="Your adventurer profile">
    <div class="expedition-profile-identity"><div><span class="expedition-profile-kicker">YOUR ADVENTURER</span><h3 class="expedition-player-name">${escapeHtml(save.character.name)}</h3><p class="expedition-note">Age ${save.character.age} · ${escapeHtml(regionNames[scene.region])} · Day ${save.day}</p></div><span class="expedition-disposition" aria-label="Disposition">${escapeHtml(save.disposition.label.toUpperCase())}</span></div>
    <div class="expedition-profile-meta"><span>SPIRIT REALM <b>Not recorded</b></span><span>MARTIAL SOUL <b>Not recorded</b></span><span>ARCANIST GRADE <b>Not recorded</b></span></div>
    <button type="button" class="text-button danger" data-eternal-end>End local journey</button></section>`
    :`<section class="expedition-character-panel"><div class="section-heading"><span>BEGIN A SEPARATE JOURNEY</span><small>OFFLINE · LOCAL SAVE</small></div><p class="expedition-note">This character is created for Eternal Path only. It does not import or alter Convo characters.</p>
      <form id="eternal-start-form" class="expedition-start-form"><label for="eternal-name">Character name</label><input id="eternal-name" name="name" minlength="2" maxlength="32" required placeholder="Your adventurer's name" />
      <div class="expedition-form-row"><div><label for="eternal-age">Age</label><input id="eternal-age" name="age" type="number" min="1" max="120" value="14" required /></div><div><label for="eternal-region">Starting power</label><select id="eternal-region" name="region"><option value="golden-dragon-empire">Golden Dragon Empire</option><option value="tianhai-yunzhou">Tianhai Yunzhou</option><option value="beiming-gu">Beiming Gu</option></select></div></div>
      <button type="submit" class="action-button">Begin Eternal Path <span>↗</span></button></form></section>`;
  const story=save&&dialogue?`<section class="expedition-dialogue" aria-live="polite"><div class="section-heading"><span>THE MOMENT · ${String((save.eventIndex % getRegionalDialogueCount())+1).padStart(3,"0")} / ${getRegionalDialogueCount()}</span><small>${escapeHtml(dialogue.chapter)}</small></div>
    <article class="expedition-dialogue-card">
      <div class="expedition-narrative-layer"><span class="expedition-narrative-label">ENVIRONMENT</span><p class="expedition-sensory-copy">${escapeHtml(scene.detail)} The air carries the day's changing temperature; nearby footsteps and distant voices blend into the ordinary rhythm of the region.</p></div>
      <div class="expedition-narrative-layer"><span class="expedition-narrative-label">SCENE</span><h3>${escapeHtml(dialogue.title)}</h3><p>${escapeHtml(dialogue.summary)}</p></div>
      <div class="expedition-narrative-layer expedition-npc-line"><span class="expedition-narrative-label">${escapeHtml(dialogue.speaker)}</span><p>“${escapeHtml(dialogue.text)}”</p></div>
      <div class="expedition-provenance">IN-GAME ORIGINAL · ETERNAL PATH STORY CONTENT</div>
      <button type="button" class="expedition-open-choices" data-eternal-open-choices>Respond · Choose your approach <span>↗</span></button>
    </article></section>`:`<section class="expedition-dialogue expedition-dialogue-locked"><div class="section-heading"><span>THE NARRATIVE</span><small>AWAITING YOUR JOURNEY</small></div><p>Create a separate Eternal Path character to begin the opening sequence.</p></section>`;
  const choiceModal=save&&dialogue?`<div class="expedition-choice-modal" hidden data-eternal-choice-modal>
    <button class="expedition-choice-backdrop" type="button" aria-label="Close choices" data-eternal-choice-dismiss></button>
    <section class="expedition-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="eternal-choice-title">
      <div class="expedition-choice-topline"><span>YOUR RESPONSE</span><button type="button" class="expedition-choice-close" data-eternal-choice-dismiss aria-label="Close choices">×</button></div>
      <h3 id="eternal-choice-title">How will you respond?</h3><p class="expedition-choice-hint">Your approach will shape what happens next.</p>
      <div class="expedition-choice-list">${dialogue.choices.map((choice,index)=>`<button type="button" class="expedition-choice" data-eternal-choice="${index}"><span>0${index+1}</span><strong>${escapeHtml(choice.label)}</strong></button>`).join("")}</div>
    </section>
  </div>`:"";
  return `<section class="expedition-page" aria-label="Merzkava Eternal Path"><header class="expedition-heading"><div><p class="eyebrow">STANDALONE</p><h2>✦ MERZKAVA: ETERNAL PATH</h2></div></header>
    ${sceneWindow}${startPanel}
    ${save?`<div class="expedition-disposition-line"><span>DISPOSITION</span><strong>${escapeHtml(save.disposition.label)}</strong></div>`:""}
    ${story}${choiceModal}
    <footer class="expedition-footer"><span>ETERNAL PATH · LOCAL CONTENT PACK</span><span>WORLD ARCHIVE · READ ONLY</span></footer></section>`;
}
