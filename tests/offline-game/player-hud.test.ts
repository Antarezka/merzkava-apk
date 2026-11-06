import { describe, expect, it } from "vitest";
import {
  consumePlayerHudPreviewItem, createDefaultPlayerHudPreviewState, renderPlayerHudMarkup,
  simulatePlayerHudPreviewAwakeHour,
} from "../../src/offline-game/player-hud";

describe("in-world player HUD preview",()=>{
  it("renders identity, status, affiliation, skill tiers and test inventory",()=>{
    const html=renderPlayerHudMarkup();
    expect(html).toContain("WORLD ATLAS · PLAYER");
    expect(html).toContain("SPIRIT REALM");
    expect(html).toContain("AFFILIATION");
    expect(html).toContain("Clan · Sect · Trade Guild · Assassin Guild · Empire Unit");
    expect((html.match(/class="wmh-skill-slot"/g)||[]).length).toBe(4);
    expect(html).toContain('data-realm-tier="0"');
    expect(html).toContain('data-realm-tier="3"');
    expect(html).toContain("TURN-BASED · TIME ORDER NOT CONNECTED");
    expect(html).toContain('data-hud-panel="quests"');
    expect(html).toContain('data-hud-panel="social"');
    expect((html.match(/data-hud-action="consume"/g)||[]).length).toBe(3);
    expect(html).toContain("NON-CANON FIXTURE");
    expect(html).toContain("×999");
  });
  it("decreases Mortal Satiety by the official one-hour awake LIGHT interval",()=>{
    const initial=createDefaultPlayerHudPreviewState(),result=simulatePlayerHudPreviewAwakeHour(initial);
    expect(result.valid).toBe(true);
    expect(result.drain).toBeCloseTo(100/24*1.25,8);
    expect(result.state.satiety).toBeCloseTo(80-(100/24*1.25),8);
    expect(initial.satiety).toBe(80);
  });
  it("consumes test portions through official portion gains and caps Satiety at 100",()=>{
    const initial=createDefaultPlayerHudPreviewState(),small=consumePlayerHudPreviewItem(initial,"ration-small");
    expect(small.valid).toBe(true);expect(small.gain).toBe(10);expect(small.state.satiety).toBe(90);
    expect(small.state.items["ration-small"]).toBe(998);
    const large=consumePlayerHudPreviewItem(small.state,"ration-large");
    expect(large.valid).toBe(true);expect(large.gain).toBe(10);expect(large.state.satiety).toBe(100);
    expect(large.state.items["ration-large"]).toBe(998);
  });
  it("does not consume an unknown item or a depleted stack",()=>{
    const initial=createDefaultPlayerHudPreviewState();
    expect(consumePlayerHudPreviewItem(initial,"unlisted-item").valid).toBe(false);
    expect(consumePlayerHudPreviewItem({...initial,items:{"ration-small":0}},"ration-small").valid).toBe(false);
  });
});
