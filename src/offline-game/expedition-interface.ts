import "./expedition-interface.css";
import {
  getCurrentSituation, getEternalSave, getExpeditionAtmosphere, getExpeditionScene, listEternalSaves,
} from "./expedition-game";

function escapeHtml(value:string):string {
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]??char));
}
const regionNames:Record<string,string>={"golden-dragon-empire":"Golden Dragon Empire","tianhai-yunzhou":"Tianhai Yunzhou","beiming-gu":"Beiming Gu","lawless-territories":"Lawless Territories","special-locations":"Special Locations"};

export function renderExpeditionInterface():string {
  const save=getEternalSave(), scene=getExpeditionScene(), atmosphere=getExpeditionAtmosphere(), situation=getCurrentSituation();
  const sceneWindow=`<section class="expedition-environment" aria-label="Eternal Path scene window" data-location="${scene.id}" data-region="${scene.region}" data-cycle="${atmosphere.cycle}" data-weather="${atmosphere.weather}" data-animation-state="${save?`${save.day}:${save.hour}:${save.minute}:${atmosphere.weather}:${scene.id}`:`preview:${scene.id}:${atmosphere.cycle}:${atmosphere.weather}`}" style="--scene-fog-opacity:${atmosphere.fog}">
    <img class="expedition-scene-image" src="${scene.image}" alt="" />
    <div class="expedition-cloud-layer" aria-hidden="true"><img class="expedition-cloud-motion" src="/game/scenery/shared/fx-01-soft-cloud-layer.png" alt="" /></div>
    <div class="expedition-light-layer" aria-hidden="true"></div>
    <div class="expedition-sun-glow" aria-hidden="true"><img class="expedition-sun-glow-image" src="/game/scenery/shared/fx-03-sun-glow.png" alt="" /></div>
    <div class="expedition-moon-glow" aria-hidden="true"><img class="expedition-moon-glow-image" src="/game/scenery/shared/fx-04-moon-glow.png" alt="" /></div>
    <div class="expedition-light-rays" aria-hidden="true"><img class="expedition-light-rays-image" src="/game/scenery/shared/fx-05-volumetric-light-rays.png" alt="" /></div>
    <div class="expedition-weather-layer" aria-hidden="true"></div>
    <div class="expedition-rain-streaks" aria-hidden="true"><img class="expedition-rain-streak-image" src="/game/scenery/shared/fx-06-rain-streaks.png" alt="" /></div>
    <div class="expedition-snow-texture" aria-hidden="true"><img src="/game/scenery/shared/fx-07a-floating-snow.png" alt="" /></div>
    <div class="expedition-petal-texture" aria-hidden="true"><img src="/game/scenery/shared/fx-07b-floating-petals.png" alt="" /></div>
    <div class="expedition-leaf-texture" aria-hidden="true"><img src="/game/scenery/shared/fx-07c-floating-autumn-leaves.png" alt="" /></div>
    <div class="expedition-weather-particles" aria-hidden="true"></div>
    <div class="expedition-lightning-layer" aria-hidden="true"><img class="expedition-lightning-flash-image" src="/game/scenery/shared/fx-08-lightning-flash-a.png" alt="" /></div>
    <div class="expedition-fog-layer" aria-hidden="true"><img class="expedition-fog-motion" src="/game/scenery/shared/fx-02-atmospheric-fog.png" alt="" /></div>
    <div class="expedition-window-frost" aria-hidden="true"><img class="expedition-window-frost-image" src="/game/scenery/shared/fx-07a-window-frost.png" alt="" /></div>
    <div class="expedition-window-frame" aria-hidden="true"></div><span class="expedition-window-label">SCENE WINDOW · LIVE WORLD</span>
    <div class="expedition-scene-copy"><span class="scene-kicker">${escapeHtml(regionNames[scene.region])} · ${escapeHtml(atmosphere.cycle)} · ${escapeHtml(atmosphere.weather)}</span><h3>${escapeHtml(scene.label)}</h3><p>${escapeHtml(scene.detail)}</p></div>
    <span class="scene-coordinate scene-clock-ink">${save? `DAY ${save.day} · ${String(save.hour).padStart(2,"0")}:${String(save.minute).padStart(2,"0")}`:"WORLD SCENE PREVIEW"}</span>
  </section>`;
  const startPanel=save?`<section class="expedition-character-panel expedition-profile-compact" aria-label="Your adventurer profile">
    <div class="expedition-profile-identity"><div><span class="expedition-profile-kicker">YOUR ADVENTURER</span><h3 class="expedition-player-name">${escapeHtml(save.character.name)}</h3><p class="expedition-note">Age ${save.character.age} · ${escapeHtml(regionNames[scene.region])} · Day ${save.day}</p></div></div>
    <div class="expedition-profile-meta"><span>SPIRIT REALM <b>Not recorded</b></span><span>MARTIAL SOUL <b>Not recorded</b></span><span>SPIRIT RING ABSORPTION <b>Not recorded</b></span><span>SYNC PROGRESS <b>Not recorded</b></span><span>ENERGY <b>${save.energy}/100</b></span><span>INSIGHT <b>${save.insight}</b></span><span>ARCANIST GRADE <b>Not recorded</b></span><span>ARCANIST FOCUS <b>Not recorded</b></span><span>HP <b>Not recorded</b></span><span>SATIETY <b>Not recorded</b></span></div>
    <div class="expedition-profile-actions"><span class="expedition-save-label">SAVE · ${escapeHtml(save.saveName)}</span><button type="button" class="text-button danger" data-eternal-end>Leave journey</button></div></section>`
    :`<section class="expedition-character-panel expedition-empty-profile"><span class="expedition-profile-kicker">NO ACTIVE JOURNEY</span><p class="expedition-note">Create a new local journey or load one of your saved adventures below. World Archive remains read-only.</p></section>`;
  const savedSlots=listEternalSaves();
  const saveCards=savedSlots.map(slot=>`<article class="expedition-save-card" data-save-card="${escapeHtml(slot.id)}">
    <div class="expedition-save-card-heading"><div><strong>${escapeHtml(slot.name)}</strong><small>${escapeHtml(slot.characterName)} · Day ${slot.day}</small></div><span>${slot.active?"ACTIVE":escapeHtml(regionNames[slot.region])}</span></div>
    <div class="expedition-save-actions">${slot.active?"":`<button type="button" data-eternal-save-load="${escapeHtml(slot.id)}">Load</button>`}<button type="button" data-eternal-save-rename-toggle="${escapeHtml(slot.id)}">Rename</button><button type="button" data-eternal-save-export="${escapeHtml(slot.id)}">Export</button><button type="button" class="danger" data-eternal-save-delete="${escapeHtml(slot.id)}">Delete</button></div>
    <form class="expedition-rename-form" data-eternal-rename-form="${escapeHtml(slot.id)}" hidden><label>Journey name<input name="name" minlength="2" maxlength="48" required value="${escapeHtml(slot.name)}"/></label><button type="submit">Save name</button></form>
  </article>`).join("");
  const createJourneyForm=`<form id="eternal-start-form" class="expedition-start-form" ${save?"hidden":""}><div class="section-heading"><span>NEW JOURNEY</span><small>NON-CANON · LOCAL SAVE</small></div><label for="eternal-name">Character name</label><input id="eternal-name" name="name" minlength="2" maxlength="32" required placeholder="Your adventurer's name" />
      <div class="expedition-form-row"><div><label for="eternal-age">Age</label><input id="eternal-age" name="age" type="number" min="1" max="120" value="14" required /></div><div><label for="eternal-region">Starting region</label><select id="eternal-region" name="region"><option value="golden-dragon-empire">Golden Dragon Empire</option><option value="tianhai-yunzhou">Tianhai Yunzhou</option><option value="beiming-gu">Beiming Gu</option></select></div></div>
      <button type="submit" class="action-button">Begin new journey <span>↗</span></button></form>`;
  const managerPanel=`<section class="expedition-save-manager ${save?"is-compact":""}" aria-label="Eternal Path save manager">
    ${save?`<button type="button" class="expedition-manager-trigger" data-eternal-manager-toggle aria-label="Open Save Manager" aria-expanded="false" aria-controls="eternal-save-manager-dialog" title="Save Manager"><span aria-hidden="true">▤</span></button><button type="button" class="expedition-manager-backdrop" data-eternal-manager-backdrop aria-label="Close Save Manager" hidden></button>`:`<div class="section-heading"><span>JOURNEY MANAGER</span><small>${savedSlots.length} SAVED</small></div>`}
    <div id="eternal-save-manager-dialog" class="expedition-manager-content" data-eternal-manager-content ${save?'role="dialog" aria-modal="true" aria-labelledby="eternal-manager-title" hidden':""}>
      ${save?`<div class="expedition-manager-heading"><span id="eternal-manager-title">JOURNEY MANAGER · ${savedSlots.length} SAVED</span><button type="button" class="expedition-manager-close" data-eternal-manager-toggle aria-label="Close Save Manager">×</button></div>`:""}
      <div class="expedition-save-list">${saveCards||`<p class="expedition-note">No saved journeys yet. Your first journey will appear here.</p>`}</div>
      ${save?`<button type="button" class="text-button" data-eternal-new-form>＋ Create another journey</button>`:""}
      ${createJourneyForm}
      <label class="expedition-import-label">IMPORT JOURNEY BACKUP<input type="file" accept="application/json,.json" data-eternal-import /></label>
      <p class="expedition-save-footnote">Saves are isolated per journey. Deleting a journey never changes the official World Archive.</p>${savedSlots.length?`<button type="button" class="text-button danger" data-eternal-reset-all>Delete all journeys</button>`:""}
    </div></section>`;
  const outcome=save?.lastOutcome?'<aside class="expedition-outcome" aria-live="polite"><span class="expedition-narrative-label">AFTERMATH</span><p>'+escapeHtml(save.lastOutcome)+'</p></aside>':"";
  const story=save&&situation?'<section class="expedition-dialogue" aria-live="polite"><div class="section-heading"><span>THE MOMENT · '+String(save.eventIndex+1).padStart(3,"0")+'</span><small>'+escapeHtml(situation.category.replace(/-/g," ").toUpperCase())+' · '+escapeHtml(situation.patchVersion)+'</small></div>'+
    '<article class="expedition-dialogue-card">'+
      '<div class="expedition-narrative-layer"><span class="expedition-narrative-label">SETTING / ATMOSPHERE</span><p class="expedition-sensory-copy">'+escapeHtml(situation.setting)+'</p></div>'+
      '<div class="expedition-narrative-layer expedition-scene-action"><span class="expedition-narrative-label">SCENE ACTION</span><h3>'+escapeHtml(situation.title)+'</h3>'+situation.sceneAction.map(line=>'<p>'+escapeHtml(line)+'</p>').join("")+'</div>'+
      situation.actors.map(actor=>'<div class="expedition-narrative-layer expedition-npc-line"><span class="expedition-narrative-label">CHARACTER BEHAVIOR · '+escapeHtml(actor.label)+'</span><p>'+escapeHtml(actor.observableBehavior)+'</p></div>').join("")+
      '<div class="expedition-narrative-layer expedition-npc-line"><span class="expedition-narrative-label">DIALOGUE · '+escapeHtml(situation.dialogue.speaker)+'</span><p>“'+escapeHtml(situation.dialogue.text)+'”</p></div>'+
      '<div class="expedition-narrative-layer expedition-player-question"><span class="expedition-narrative-label">PERSPECTIVE</span><p>'+escapeHtml(situation.closingQuestion)+'</p></div>'+
      '<div class="expedition-provenance">IN-GAME ORIGINAL · STARTER SITUATION · NOT UNIVERSE CANON</div>'+
      '<button type="button" class="expedition-open-choices" data-eternal-open-choices>Consider your response <span>↗</span></button></article></section>':save?'<section class="expedition-dialogue expedition-dialogue-locked" aria-live="polite"><div class="section-heading"><span>THE CHRONICLE</span><small>STARTER SITUATIONS COMPLETE</small></div><article class="expedition-dialogue-card expedition-story-placeholder"><span class="expedition-narrative-label">A QUIET MOMENT</span><h3>'+(save.lastOutcome?"The moment has passed.":"No eligible situation right now.")+'</h3><p>'+(save.lastOutcome?"The outcome has been recorded in this journey. The starter situation set for this region has been explored; additional reviewed narrative patches will expand the world.":"There is no starter situation matching the current journey context. More reviewed narrative content will be added in a later patch.")+'</p></article></section>':'<section class="expedition-dialogue expedition-dialogue-locked"><div class="section-heading"><span>THE NARRATIVE</span><small>AWAITING YOUR JOURNEY</small></div><p>Create a separate Eternal Path character to begin a journey.</p></section>';
  const choiceModal=save&&situation?'<div class="expedition-choice-modal" hidden data-eternal-choice-modal><button class="expedition-choice-backdrop" type="button" aria-label="Close choices" data-eternal-choice-dismiss></button><section class="expedition-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="eternal-choice-title"><div class="expedition-choice-topline"><span>YOUR RESPONSE</span><button type="button" class="expedition-choice-close" data-eternal-choice-dismiss aria-label="Close choices">×</button></div><h3 id="eternal-choice-title">Consider the situation</h3><p class="expedition-choice-hint">Only your chosen words or actions are shown before resolution.</p><div class="expedition-choice-list">'+situation.choices.map((choice,index)=>'<button type="button" class="expedition-choice" data-eternal-choice="'+escapeHtml(choice.id)+'"><span>0'+(index+1)+'</span><strong>'+escapeHtml(choice.label)+'</strong></button>').join("")+'</div></section></div>':"";
  const disposition=save?`<div class="expedition-disposition-line"><span>DISPOSITION</span><strong>${escapeHtml(save.disposition.label)}</strong></div>`:"";
  const activeJourneyLayout=save?`${sceneWindow}${disposition}${outcome}${story}${startPanel}${managerPanel}`:`${sceneWindow}${startPanel}${managerPanel}${story}`;
  return `<section class="expedition-page" aria-label="Merzkava Eternal Path"><header class="expedition-heading"><div><p class="eyebrow">STANDALONE</p><h2>✦ MERZKAVA: ETERNAL PATH</h2></div></header>
    ${activeJourneyLayout}${choiceModal}
    <footer class="expedition-footer"><span>ETERNAL PATH · LOCAL JOURNEY</span><span>WORLD ARCHIVE · READ ONLY</span></footer></section>`;
}
