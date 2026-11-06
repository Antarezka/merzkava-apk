import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  consumePlayerHudPreviewItem, createDefaultPlayerHudPreviewState, renderPlayerHudMarkup,
  simulatePlayerHudPreviewAwakeHour,
} from "../../src/offline-game/player-hud";

const hudStyles=readFileSync(new URL("../../src/offline-game/player-hud.css",import.meta.url),"utf8");
const worldStyles=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.css",import.meta.url),"utf8");
const hudMotionSource=readFileSync(new URL("../../src/offline-game/player-hud.ts",import.meta.url),"utf8");
const worldMapSource=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.ts",import.meta.url),"utf8");

describe("in-world player HUD and Traveler Satchel",()=>{
  it("renders text-only character status and the approved 25-slot inventory",()=>{
    const html=renderPlayerHudMarkup();
    expect(html).toContain('class="wmh-player-card"');
    expect(html).toContain('class="wmh-player-topline"');
    expect(html).toContain('class="wmh-player-bottomline"');
    expect(html).toContain("MORTAL");
    expect(html).toContain("AFFILIATION");
    expect((html.match(/class="wmh-inventory-slot/g)||[]).length).toBe(25);
    expect((html.match(/data-hud-item-id=/g)||[]).length).toBe(9);
    expect(html).toContain("Field Ration");
    expect(html).toContain("Bread");
    expect(html).toContain("Wood");
    expect(html).toContain("data-hud-item-tooltip");
    expect(html).toContain("data-hud-consume-dialog");
  });

  it("keeps currency in a separate purse with all five official denominations",()=>{
    const html=renderPlayerHudMarkup();
    for(const code of ["xc","xs","xg","zj","az"])expect(html).toContain('data-hud-currency="'+code+'"');
    expect(html).toContain("CURRENCY PURSE");
    expect(html).toContain("79 xc");
    expect(html).toContain("9 xs");
    expect(html).toContain("4 xg");
  });

  it("renders tier frames inside item slots and tiny item glyphs",()=>{
    const html=renderPlayerHudMarkup();
    expect(html).toContain('class="wmh-item-tier-frame"');
    expect(html).toContain('data-tier="1"');
    expect(html).toContain('data-tier="2"');
    expect(hudStyles).toContain(".wmh-item-tier-frame");
    expect(hudStyles).toContain(".wmh-item-icon");
    expect(hudStyles).toContain(".wmh-item-quantity");
  });

  it("uses hold tooltip and consumption-only confirmation interactions",()=>{
    expect(hudMotionSource).toContain("pointerdown");
    expect(hudMotionSource).toContain("420");
    expect(hudMotionSource).toContain('kind==="inventory-item"');
    expect(hudMotionSource).toContain('item.kind!=="consumable"');
    expect(hudMotionSource).toContain('kind==="confirm-consume"');
    expect(hudMotionSource).toContain('kind==="cancel-consume"');
    expect(hudMotionSource).toContain("Material items are reserved for trade or Home construction");
  });

  it("renders a draggable minimap window and low-opacity top information strip",()=>{
    expect(worldMapSource).toContain("wmh-minimap-toggle");
    expect(worldMapSource).toContain("wmh-minimap-window");
    expect(worldMapSource).toContain("data-wmh-minimap-drag-handle");
    expect(worldMapSource).toContain("pointermove");
    expect(worldStyles).toContain(".wmh-top-info");
    expect(worldStyles).toContain("rgba(13,17,13,.24)");
  });

  it("applies internal scrolling and touch resizing to long windows",()=>{
    expect(hudMotionSource).toContain("bindScrollableResizableWindows");
    expect(hudMotionSource).toContain("wmh-window-resize-handle");
    expect(hudStyles).toContain(".wmh-scroll-resize-window");
    expect(hudStyles).toContain("resize:both!important");
    expect(worldMapSource).toContain("bindScrollableResizableWindows(dialog)");
  });

  it("keeps tactical ring animation lightweight and pauses it when hidden",()=>{
    expect(hudStyles).toContain("@keyframes wmh-hud-ring-spin");
    expect(hudStyles).toContain("--ring-speed:42s");
    expect(hudStyles).toContain(".wmh-player-hud.wmh-hud-motion-paused");
    expect(hudMotionSource).toContain('document.addEventListener("visibilitychange",sync,{passive:true})');
    expect(hudMotionSource).not.toContain('import { animate, createScope } from "animejs"');
    expect(hudMotionSource).not.toContain("animate(ring");
  });

  it("decreases Mortal Satiety by the official one-hour awake LIGHT interval",()=>{
    const initial=createDefaultPlayerHudPreviewState(),result=simulatePlayerHudPreviewAwakeHour(initial);
    expect(result.valid).toBe(true);
    expect(result.drain).toBeCloseTo(100/24*1.25,8);
    expect(result.state.satiety).toBeCloseTo(80-(100/24*1.25),8);
    expect(initial.satiety).toBe(80);
  });

  it("consumes test food through official portion gains and caps Satiety at 100",()=>{
    const initial=createDefaultPlayerHudPreviewState(),small=consumePlayerHudPreviewItem(initial,"ration-small");
    expect(small.valid).toBe(true);expect(small.gain).toBe(10);expect(small.state.satiety).toBe(90);
    expect(small.state.items["ration-small"]).toBe(4);
    const large=consumePlayerHudPreviewItem(small.state,"ration-large");
    expect(large.valid).toBe(true);expect(large.gain).toBe(10);expect(large.state.satiety).toBe(100);
    expect(large.state.items["ration-large"]).toBe(1);
  });

  it("rejects material use, unknown items and depleted consumable stacks",()=>{
    const initial=createDefaultPlayerHudPreviewState();
    expect(consumePlayerHudPreviewItem(initial,"wood").valid).toBe(false);
    expect(consumePlayerHudPreviewItem(initial,"unlisted-item").valid).toBe(false);
    expect(consumePlayerHudPreviewItem({...initial,items:{"ration-small":0}},"ration-small").valid).toBe(false);
  });

  it("keeps HUD fields transparent and moves Back clear of the Arcanistry machine",()=>{
    expect(hudStyles).toContain("background:transparent!important;border:0!important");
    expect(worldStyles).toContain(".has-archanistry-machine .wmh-map-back");
    expect(worldMapSource).toContain("data-arcanistry-machine");
    expect(worldMapSource).toContain("wmh-machine-back-offset");
  });
});
