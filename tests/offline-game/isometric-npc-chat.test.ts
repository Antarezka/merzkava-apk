import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderIsometricMapTestArea, setWorldMapDeveloperMode } from "../../src/offline-game/world-map-hierarchy";

beforeEach(() => setWorldMapDeveloperMode(true));
afterEach(() => setWorldMapDeveloperMode(false));
import { readFileSync } from "node:fs";

const worldMapSource = readFileSync(new URL("../../src/offline-game/world-map-hierarchy.ts", import.meta.url), "utf8");

const chatStyles = readFileSync(new URL("../../src/offline-game/world-map-hierarchy.css", import.meta.url), "utf8");

describe("isometric NPC conversations", () => {
  it("keeps the NPC conversation panel, message thread, and reply choices mounted", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('class="wmh-chat-panel" data-wmh-chat hidden role="dialog"');
    expect(html).toContain('data-wmh-thread');
    expect(html).toContain('data-wmh-replies');
    expect(html).toContain('data-wmh-npc="test-guide"');
    expect(html).toContain('data-wmh-npc="test-scholar"');
    expect(html).toContain('data-wmh-npc="test-mechanic"');
  });

  it("centers the choice conversation over a dimmed map", () => {
    const rules = [...chatStyles.matchAll(/\.wmh-isometric-play-screen \.wmh-chat-panel\{([^}]*)\}/g)];
    const finalRule = rules.filter(rule => rule[1].includes("position:fixed")).at(-1)?.[1] ?? "";
    expect(finalRule).toContain("position:fixed");
    expect(finalRule).toContain("inset:0");
    expect(finalRule).toContain("place-items:center");
    expect(finalRule).toContain("backdrop-filter:blur");
  });

  it("renders the shared world HUD and map-tool drawer on the isometric play screen", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('data-wmh-isometric-hud');
    expect(html).toContain('data-wmh-cycle-icon');
    expect(html).toContain('data-wmh-weather-icon');
    expect(html).toContain('data-wmh-day');
    expect(html).toContain('data-wmh-time');
    expect(html).toContain('data-wmh-overlay-toggle');
    expect(html).toContain('data-wmh-overlay-tools');
    expect(html).toContain('class="wmh-overlay-drawer-lever"');
    expect(html).not.toContain('wmh-iso-controls');
  });

  it("places the Academy player at its named entrance and starts NPCs on the approved path", () => {
    expect(worldMapSource).toContain('data-wmh-player-token data-scan-tone="unknown" data-token-label="" data-x="12" data-y="31"');
    expect(worldMapSource).toContain('{id:"student-lin",x:7,y:4,gender:"female",scanTone:"friendly"}');
    expect(worldMapSource).toContain('{id:"student-wei",x:10,y:9,gender:"male",scanTone:"friendly"}');
    expect(worldMapSource).toContain('{id:"teacher-mei",x:6,y:15,gender:"female",scanTone:"friendly"}');
    expect(worldMapSource).toContain('{id:"groundskeeper",x:22,y:10,gender:"male",scanTone:"friendly"}');
    expect(worldMapSource).toContain('const occupiedNpcs=new Set');
    expect(worldMapSource).toContain("!occupied.has(key)");
  });

  it("does not render editor controls when Developer Mode is disabled", () => {
    setWorldMapDeveloperMode(false);
    const html=renderIsometricMapTestArea();
    expect(html).not.toContain("data-wmh-editor-dock");
    expect(html).not.toContain("data-wmh-academy-editor");
  });


  it("keeps recurring sonar pulses presentation-only and updates contacts at startup", () => {
    const start = worldMapSource.indexOf("function startActorScanners");
    const end = worldMapSource.indexOf("function animateGridMove", start);
    const scannerBlock = worldMapSource.slice(start, end);
    const pulseBlock = scannerBlock.slice(scannerBlock.indexOf("const pulse=()=>"), scannerBlock.indexOf("  pulse();"));
    expect(scannerBlock).toContain("updateScannerContacts(board);");
    expect(pulseBlock).not.toContain("updateScannerContacts(board)");
  });

  it("uses a shared tile/actor snapshot for NPC wandering instead of per-NPC DOM queries", () => {
    const start = worldMapSource.indexOf("function startNpcWander");
    const end = worldMapSource.indexOf("function renderChat", start);
    const wanderBlock = worldMapSource.slice(start, end);
    expect(wanderBlock).toContain('const actors=Array.from(board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]"))');
    expect(wanderBlock).toContain("const tilesByCell=new Map<string,HTMLElement>()");
    expect(wanderBlock).not.toContain("board.querySelector<HTMLElement>('[data-wmh-tile]");
  });

  it("keeps the hidden state intact until a player taps an NPC", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('data-wmh-chat hidden');
    expect(chatStyles).toContain(".wmh-isometric-play-screen .wmh-chat-panel[hidden]{display:none!important}");
    expect(chatStyles).toContain(".wmh-transition-notice{align-items:center!important;justify-content:center!important;background:#030806d9!important}");
    expect(chatStyles).toContain(".wmh-isometric-play-screen .wmh-overlay-float span{writing-mode:vertical-rl");
    expect(chatStyles).toContain(".wmh-sonar-ring{");
    expect(chatStyles).toContain(".wmh-tile-trail-wave{");
    expect(worldMapSource).toContain("merzkava:field-scanner-overlap");
    expect(worldMapSource).toContain("function emitTileTrailWave");
    expect(worldMapSource).toContain("function startActorScanners");
    expect(worldMapSource).toContain("updateNpcInteractionProximity(board)");
    expect(worldMapSource).toContain("isNpcInteractionCellReachable(");
    expect(worldMapSource).toContain("dataset.interactionReady");
    expect(chatStyles).toContain(".wmh-npc-proximity-glow");
    expect(worldMapSource).toContain("getIsoMovementOffset(from,to,grid,zoom,renderScaleX,renderScaleY)");
    expect(worldMapSource).toContain("startNativeMotion(token");
    expect(worldMapSource).toContain('translate:dx+"px "+dy+"px"');
    expect(worldMapSource).toContain("duration:225");
    expect(worldMapSource).toContain("scanTone:\"friendly\"");
    expect(worldMapSource).toContain("const minimizeWorkbench=()=>");
    expect(worldMapSource).toContain("const restoreWorkbench=()=>");
  });
});
