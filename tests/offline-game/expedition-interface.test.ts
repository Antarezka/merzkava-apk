import { beforeEach, describe, expect, it } from "vitest";
import { renderExpeditionInterface } from "../../src/offline-game/expedition-interface";
import { chooseEternalOption, ETERNAL_DIALOGUES, ETERNAL_SCENES, getEternalSave, resetEternalGame, resetExpeditionPreview, setExpeditionPreview, startEternalGame } from "../../src/offline-game/expedition-game";

describe("Eternal Path scene and prologue", () => {
  beforeEach(() => { resetEternalGame(); resetExpeditionPreview(); });
  it("composes an illustrated location with a separate translucent fog texture", () => {
    const html=renderExpeditionInterface();
    expect(html).toContain('class="expedition-environment"');
    expect(html).toContain('class="expedition-scene-image"');
    expect(html).toContain('class="expedition-fog-motion"');
    expect(html).toContain("Imperial city panorama");
    expect(html).toContain("SCENE WINDOW");
    expect(html).toContain("data-eternal-test-toggle");
  });
  it("provides temporary scene, cycle, weather and fog controls", () => {
    setExpeditionPreview({sceneId:"bg-settlement",cycle:"Night",weather:"Snow",fog:0.18});
    const html=renderExpeditionInterface();
    expect(html).toContain("SCENE TEST BENCH");
    expect(html).toContain("Snowbound settlement");
    expect(html).toContain('data-cycle="Night"');
    expect(html).toContain('data-weather="Snow"');
    expect(html).toContain("--scene-fog-opacity:0.18");
    expect(html).toContain("do not advance, save, or alter the game clock");
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
  it("ships 240 deterministic branching dialogue nodes across eight scene compositions", () => {
    expect(ETERNAL_DIALOGUES).toHaveLength(240);
    expect(ETERNAL_SCENES).toHaveLength(8);
    expect(ETERNAL_DIALOGUES.every(node=>node.provenance==="IN_GAME_ORIGINAL" && node.choices.length===2)).toBe(true);
    expect(new Set(ETERNAL_DIALOGUES.map(node=>node.id)).size).toBe(240);
  });
});
