import { beforeEach, describe, expect, it } from "vitest";
import { renderExpeditionInterface } from "../../src/offline-game/expedition-interface";
import {
  advanceEternalWorldTime, chooseEternalOption, ETERNAL_DIALOGUES, ETERNAL_SCENES,
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
    for(let index=0;index<5;index+=1) chooseEternalOption(0);
    expect(getExpeditionScene().id).not.toBe(getCurrentDialogue()?.sceneId);

    setEternalLocation("gde-market");
    expect(getExpeditionScene().id).toBe("gde-market");
    expect(getEternalSave()?.locationId).toBe("gde-market");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");

    setEternalLocation("ty-city");
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getEternalSave()?.character.region).toBe("golden-dragon-empire");
    expect(getRegionalDialogueCount()).toBe(60);
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

  it("uses the compact narrative-first layout and keeps choice outcomes hidden", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const dialogue=getCurrentDialogue();
    const html=renderExpeditionInterface();
    expect(html).toContain("✦ MERZKAVA: ETERNAL PATH");
    expect(html).toContain('expedition-character-panel expedition-profile-compact');
    expect(html).toContain("SPIRIT REALM");
    expect(html).toContain("SPIRIT RING");
    expect(html).toContain("SYNC PROGRESS");
    expect(html).toContain("ARCANIST FOCUS");
    expect(html).toContain("TRUE NEUTRAL");
    expect(html).toContain('class="expedition-choice-modal" hidden');
    expect(html).toContain("data-eternal-choice");
    expect(html).not.toContain("expedition-feature-grid");
    expect(html).not.toContain(dialogue?.choices[0].response ?? "__missing_choice_response__");
  });

  it("keeps a separate local character/save and starts an interactive chronicle", () => {
    startEternalGame({name:"Nafila",age:14,region:"golden-dragon-empire"});
    const save=getEternalSave();
    expect(save?.character.name).toBe("Nafila");
    expect(renderExpeditionInterface()).toContain("Nafila");
    expect(renderExpeditionInterface()).toContain("Observe and listen");
    chooseEternalOption(0);
    expect(getEternalSave()?.completed).toBe(1);
    expect(getEternalSave()?.insight).toBe(2);
  });

  it("keeps the selected world location and dialogue region separate but consistent", () => {
    startEternalGame({name:"Nafila",age:14,region:"tianhai-yunzhou"});
    expect(getExpeditionScene().region).toBe("tianhai-yunzhou");
    expect(getRegionalDialogueCount()).toBe(60);
    expect(ETERNAL_SCENES.find(scene=>scene.id===getCurrentDialogue()?.sceneId)?.region).toBe("tianhai-yunzhou");
  });

  it("ships 240 deterministic dialogue nodes across eight scene compositions", () => {
    expect(ETERNAL_DIALOGUES).toHaveLength(240);
    expect(ETERNAL_SCENES).toHaveLength(8);
    expect(ETERNAL_DIALOGUES.every(node=>node.provenance==="IN_GAME_ORIGINAL" && node.choices.length===2)).toBe(true);
    expect(ETERNAL_DIALOGUES.every(node=>node.sourceRefs.length===1 && node.sourceRefs[0].universeCommit==="2f76a864150528afb0e3d26cb16f9396ce610ff6")).toBe(true);
    expect(new Set(ETERNAL_DIALOGUES.map(node=>node.id)).size).toBe(240);
  });
});
