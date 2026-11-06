import { beforeEach, describe, expect, it } from "vitest";
import { renderExpeditionInterface } from "../../src/offline-game/expedition-interface";
import {
  advanceEternalWorldTime, chooseEternalOption, ETERNAL_SCENES, resolveEternalSituationChoice,
  getCurrentDialogue, getCurrentSituation, getEternalSave, getExpeditionAtmosphere, getExpeditionScene,
  getRegionalDialogueCount, resetEternalGame, setEternalLocation, startEternalGame,
} from "../../src/offline-game/expedition-game";

describe("Eternal Path live world scene", () => {
  it("renders the separate pink Augusto PXL TV/console launcher at the existing TV size", () => {
    const html=renderExpeditionInterface();
    expect(html).toContain('class="expedition-pxl-trigger" data-augusto-pxl-open');
    expect(html).toContain('aria-label="Open Augusto PXL integration panel"');
    expect(html).toContain('class="pxl-tv-art" aria-hidden="true"');
    expect(html).toContain('class="pxl-tv-shell"');
    expect(html).toContain('class="pxl-console-box"');
    expect(html).toContain('class="pxl-console-ink">AUGUSTO PXL</small>');
    expect(html).toContain("AUGUSTO PXL");
    expect(html).toContain('class="expedition-pxl-modal" data-augusto-pxl-modal hidden');
    expect(html).toContain("Full visual-production pipeline for Merzkava Universe");
    expect(html).toContain("PixiJS is not being reintroduced");
  });

  beforeEach(() => resetEternalGame());

  it("keeps Journey Manager behind the clerk-emblem dropdown before a journey starts", () => {
    const html=renderExpeditionInterface();
    expect(html).toContain('class="expedition-save-manager is-compact is-prestart"');
    expect(html).toContain('class="expedition-manager-emblem"');
    expect(html).toContain('data-eternal-manager-toggle aria-label="Open Journey Manager" aria-expanded="false"');
    expect(html).toContain('aria-controls="eternal-save-manager-dialog"');
    expect(html).toContain('class="expedition-manager-content" data-eternal-manager-content role="dialog" aria-modal="true" aria-labelledby="eternal-manager-title" hidden');
    expect(html).toContain('id="eternal-start-form" class="expedition-start-form"');
    expect(html).toContain("NO ACTIVE JOURNEY");
    expect(html).toContain("AWAITING YOUR JOURNEY");
    expect(html.indexOf("NO ACTIVE JOURNEY")).toBeLessThan(html.indexOf('class="expedition-environment"'));
    expect(html.indexOf('class="expedition-environment"')).toBeLessThan(html.indexOf("AWAITING YOUR JOURNEY"));
    expect(html.indexOf("AWAITING YOUR JOURNEY")).toBeLessThan(html.indexOf('class="expedition-save-manager'));
    expect(html.indexOf('class="expedition-save-manager')).toBeLessThan(html.indexOf('class="expedition-footer"'));
    expect(html).toContain('title="The Mysterious Registrar · Journey Manager"');
  });

  it("renders the established scene window without temporary test controls", () => {
    const html=renderExpeditionInterface();
    expect(html).toContain('class="expedition-environment"');
    expect(html).toContain('class="expedition-scene-image"');
    expect(html).toContain('data-location="gde-city"');
    expect(html).toContain('class="expedition-fog-motion"');
    expect(html).toContain('class="expedition-cloud-motion"');
    expect(html).toContain('class="expedition-sun-glow"');
    expect(html).toContain('class="expedition-moon-glow"');
    expect(html).toContain('class="expedition-light-rays"');
    expect(html).toContain('class="expedition-weather-particles"');
    expect(html).toContain('class="expedition-lightning-layer"');
    expect(html).toContain("fx-03-sun-glow.png");
    expect(html).toContain("fx-04-moon-glow.png");
    expect(html).toContain("fx-05-volumetric-light-rays.png");
    expect(html).toContain("fx-06-rain-streaks.png");
    expect(html).toContain("fx-07a-floating-snow.png");
    expect(html).toContain("fx-07a-window-frost.png");
    expect(html).toContain("fx-07b-floating-petals.png");
    expect(html).toContain("fx-07c-floating-autumn-leaves.png");
    expect(html).toContain("fx-08-lightning-flash-a.png");
    expect(html).toContain("Imperial city panorama");
    expect(html).toContain("SCENE WINDOW · LIVE WORLD");
    expect(html).not.toContain("SCENE TEST BENCH");
    expect(html).not.toContain("data-eternal-test-toggle");
    expect(html).not.toContain("eternal-preview-scene");
  });

  it("binds scene location to persisted world location, not dialogue scene metadata", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const initialLocation=getEternalSave()?.locationId;
    expect(initialLocation).toBe("gde-city");
    expect(getExpeditionScene().id).toBe("gde-city");
    expect(getCurrentDialogue()).not.toBeNull();
    expect(getRegionalDialogueCount()).toBe(3);

    setEternalLocation("gde-market");
    expect(getExpeditionScene().id).toBe("gde-market");
    expect(getEternalSave()?.locationId).toBe("gde-market");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");

    setEternalLocation("ty-city");
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");
    expect(getRegionalDialogueCount()).toBe(3);
  });

  it("derives day cycle from world clock independently of dialogue progression", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    expect(getExpeditionAtmosphere().cycle).toBe("Morning");
    const completedBefore=getEternalSave()?.completed;
    for(let index=0;index<3;index+=1) advanceEternalWorldTime(180);
    advanceEternalWorldTime(60);
    expect(getExpeditionAtmosphere().cycle).toBe("Dusk");
    expect(getEternalSave()?.completed).toBe(completedBefore);
    expect(renderExpeditionInterface()).toContain('data-cycle="Dusk"');
  });

  it("updates weather from the world day and region, not from dialogue count", () => {
    startEternalGame({name:"Nafila",age:14,region:"beiming-gu"});
    const initialWeather=getExpeditionAtmosphere().weather;
    expect(initialWeather).toBe("Snow");
    for(let index=0;index<5;index+=1) advanceEternalWorldTime(180);
    advanceEternalWorldTime(60);
    expect(getEternalSave()?.day).toBe(2);
    expect(getExpeditionAtmosphere().weather).toBe("Cloudy");
    expect(getEternalSave()?.completed).toBe(0);
  });

  it("renders the context-aware starter node and response sheet", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const html=renderExpeditionInterface();
    expect(html).toContain("✦ MERZKAVA: ETERNAL PATH");
    expect(html).toContain('expedition-character-panel expedition-profile-compact');
    expect(html).toContain("SPIRIT REALM");
    expect(html).toContain("SPIRIT RING");
    expect(html).toContain("SYNC PROGRESS");
    expect(html).toContain("ENERGY");
    expect(html).toContain("INSIGHT");
    expect(html).toContain("True Neutral");
    expect(html).toContain("SETTING / ATMOSPHERE");
    expect(html).toContain("SCENE ACTION");
    expect(html).toContain("CHARACTER BEHAVIOR");
    expect(html).not.toContain("expedition-knowledge-note");
    expect(html).not.toContain("You steady the cart and collect the loose bundles");
    expect(html).toContain("DIALOGUE");
    expect(html).toContain("PERSPECTIVE");
    expect(html).toContain("STARTER SITUATION");
    expect(html).toContain('class="expedition-choice-modal"');
    expect(html).toContain('data-eternal-choice="help"');
    expect(html).toContain('class="expedition-dialogue"');
    expect(html).toContain("DISPOSITION");
    expect(html).toContain("JOURNEY MANAGER");
    expect(html).toContain('class="expedition-manager-trigger"');
    expect(html).toContain('data-eternal-manager-backdrop aria-label="Close Journey Manager" hidden');
    expect(html).toContain('aria-controls="eternal-save-manager-dialog"');
    expect(html).toContain('id="eternal-save-manager-dialog" class="expedition-manager-content" data-eternal-manager-content role="dialog" aria-modal="true" aria-labelledby="eternal-manager-title" hidden');
    expect(html).toContain('class="scene-coordinate scene-clock-ink"');
    expect(html.indexOf("expedition-profile-compact")).toBeLessThan(html.indexOf('class="expedition-environment"'));
    expect(html.indexOf('class="expedition-environment"')).toBeLessThan(html.indexOf('class="expedition-disposition-line"'));
    expect(html.indexOf('class="expedition-disposition-line"')).toBeLessThan(html.indexOf('class="expedition-dialogue"'));
    if(html.includes('class="expedition-outcome"')){
      expect(html.indexOf('class="expedition-disposition-line"')).toBeLessThan(html.indexOf('class="expedition-outcome"'));
      expect(html.indexOf('class="expedition-outcome"')).toBeLessThan(html.indexOf('class="expedition-dialogue"'));
    }
    expect(html.indexOf('class="expedition-dialogue"')).toBeLessThan(html.indexOf('class="expedition-save-manager is-compact is-active"'));
    expect(html.indexOf('class="expedition-save-manager is-compact is-active"')).toBeLessThan(html.indexOf('class="expedition-footer"'));
    expect(html).not.toContain("Manage journeys");
    expect(html).not.toContain("expedition-feature-grid");
    expect(getCurrentSituation()?.id).toBeTruthy();
  });

  it("keeps the local journey while the retired story sequence remains inactive", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const save=getEternalSave();
    expect(save?.character.name).toBe("Nafila");
    expect(renderExpeditionInterface()).toContain("Nafila");
    expect(renderExpeditionInterface()).toContain("SCENE ACTION");
    chooseEternalOption(0);
    expect(getEternalSave()?.completed).toBe(0);
    expect(getEternalSave()?.insight).toBe(0);
    expect(getEternalSave()?.eventIndex).toBe(0);
    expect(getEternalSave()?.narrativeHistory).toHaveLength(0);
  });

  it("keeps the selected world location and dialogue region separate but consistent", () => {
    startEternalGame({name:"Nafila",age:14,region:"tianhai-yunzhou"});
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getRegionalDialogueCount()).toBe(3);
    expect(getCurrentDialogue()).not.toBeNull();
  });

  it("resolves a player choice once, records it, and advances the authoritative world clock", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const node=getCurrentSituation();
    const energyBefore=getEternalSave()?.energy??0;
    const insightBefore=getEternalSave()?.insight??0;
    expect(node).not.toBeNull();
    const result=resolveEternalSituationChoice("help");
    const after=getEternalSave();
    expect(result?.nodeId).toBe(node?.id);
    expect(after?.narrativeHistory).toHaveLength(1);
    expect(after?.narrativeHistory[0].transactionId).toBe(result?.transactionId);
    expect(after?.completed).toBe(1);
    expect(after?.energy).toBe(energyBefore-2);
    expect(after?.insight).toBe(insightBefore+1);
    expect(after?.minute).toBe(10);
    expect(after?.lastOutcome).toBe(result?.outcomeText);
    expect(resolveEternalSituationChoice("not-a-choice")).toBeNull();
  });

  it("can replay regional situations after two other events without immediate repetition", () => {
    startEternalGame({name:"Nafila",age:14,region:"beiming-gu"});
    const seen=new Set<string>();
    for(let index=0;index<3;index+=1){
      const node=getCurrentSituation();
      expect(node).not.toBeNull();
      expect(seen.has(node!.id)).toBe(false);
      seen.add(node!.id);
      expect(resolveEternalSituationChoice("pass")).not.toBeNull();
    }
    const next=getCurrentSituation();
    expect(next).not.toBeNull();
    expect(seen.has(next!.id)).toBe(true);
    expect(getEternalSave()?.narrativeHistory).toHaveLength(3);
  });

  it("keeps all 26 registered scenery assets and ships no retired dialogue nodes", () => {
    expect(getRegionalDialogueCount()).toBe(0);
    expect(getCurrentDialogue()).toBeNull();
    expect(ETERNAL_SCENES).toHaveLength(26);
    expect(new Set(ETERNAL_SCENES.map(scene=>scene.image)).size).toBe(26);
    expect(ETERNAL_SCENES.every(scene=>scene.image.startsWith("/game/scenery/") && scene.provenance==="IN_GAME_ORIGINAL")).toBe(true);
  });
});
