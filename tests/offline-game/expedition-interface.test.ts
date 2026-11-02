import { beforeEach, describe, expect, it } from "vitest";
import { renderExpeditionInterface } from "../../src/offline-game/expedition-interface";
import {
  advanceEternalWorldTime, chooseEternalOption, ETERNAL_SCENES,
  getCurrentDialogue, getEternalSave, getExpeditionAtmosphere, getExpeditionScene,
  getRegionalDialogueCount, resetEternalGame, setEternalLocation, startEternalGame,
} from "../../src/offline-game/expedition-game";

describe("Eternal Path live world scene", () => {
  beforeEach(() => resetEternalGame());

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
    expect(getCurrentDialogue()).toBeNull();
    expect(getRegionalDialogueCount()).toBe(0);

    setEternalLocation("gde-market");
    expect(getExpeditionScene().id).toBe("gde-market");
    expect(getEternalSave()?.locationId).toBe("gde-market");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");

    setEternalLocation("ty-city");
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");
    expect(getRegionalDialogueCount()).toBe(0);
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

  it("uses the compact narrative-first layout while Patch 1 is pending", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const html=renderExpeditionInterface();
    expect(html).toContain("✦ MERZKAVA: ETERNAL PATH");
    expect(html).toContain('expedition-character-panel expedition-profile-compact');
    expect(html).toContain("SPIRIT REALM");
    expect(html).toContain("SPIRIT RING");
    expect(html).toContain("SYNC PROGRESS");
    expect(html).toContain("ARCANIST FOCUS");
    expect(html).toContain("True Neutral");
    expect(html).toContain("PATCH 1 · PLANNED");
    expect(html).toContain("NARRATIVE SYSTEM REBUILD");
    expect(html).not.toContain('class="expedition-choice-modal"');
    expect(html).not.toContain("data-eternal-choice");
    expect(html).toContain('class="expedition-dialogue expedition-dialogue-locked"');
    expect(html).toContain("DISPOSITION");
    expect(html).toContain("JOURNEY MANAGER");
    expect(html).toContain('class="expedition-manager-trigger"');
    expect(html).toContain('class="expedition-manager-content" data-eternal-manager-content hidden');
    expect(html).toContain('class="scene-coordinate scene-clock-ink"');
    expect(html.indexOf('class="expedition-environment"')).toBeLessThan(html.indexOf('class="expedition-disposition-line"'));
    expect(html.indexOf('class="expedition-disposition-line"')).toBeLessThan(html.indexOf('class="expedition-dialogue expedition-dialogue-locked"'));
    expect(html.indexOf('class="expedition-dialogue expedition-dialogue-locked"')).toBeLessThan(html.indexOf('expedition-profile-compact'));
    expect(html).not.toContain("Manage journeys");
    expect(html).not.toContain("expedition-feature-grid");
    expect(html).toContain("The previous repetitive opening sequence has been retired.");
  });

  it("keeps the local journey while the retired story sequence remains inactive", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const save=getEternalSave();
    expect(save?.character.name).toBe("Nafila");
    expect(renderExpeditionInterface()).toContain("Nafila");
    expect(renderExpeditionInterface()).toContain("PATCH 1 · PLANNED");
    chooseEternalOption(0);
    expect(getEternalSave()?.completed).toBe(0);
    expect(getEternalSave()?.insight).toBe(0);
    expect(getEternalSave()?.eventIndex).toBe(0);
  });

  it("keeps the selected world location and dialogue region separate but consistent", () => {
    startEternalGame({name:"Nafila",age:14,region:"tianhai-yunzhou"});
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getRegionalDialogueCount()).toBe(0);
    expect(getCurrentDialogue()).toBeNull();
  });

  it("keeps all 26 registered scenery assets and ships no retired dialogue nodes", () => {
    expect(getRegionalDialogueCount()).toBe(0);
    expect(getCurrentDialogue()).toBeNull();
    expect(ETERNAL_SCENES).toHaveLength(26);
    expect(new Set(ETERNAL_SCENES.map(scene=>scene.image)).size).toBe(26);
    expect(ETERNAL_SCENES.every(scene=>scene.image.startsWith("/game/scenery/") && scene.provenance==="IN_GAME_ORIGINAL")).toBe(true);
  });
});
