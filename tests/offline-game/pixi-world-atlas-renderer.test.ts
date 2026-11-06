import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { projectIsoActorPosition } from "../../src/offline-game/pixi-world-atlas-projection";

const GRID={cols:24,rows:20,tileW:64,tileH:32,offsetX:0,offsetY:0};

describe("Pixi World Atlas projection",()=>{
  it("projects a fractional actor position without rounding to a cell center",()=>{
    const point=projectIsoActorPosition({x:4.25,y:6.5},GRID);
    expect(point.x).toBeCloseTo(568,8);
    expect(point.y).toBeCloseTo(166,8);
  });

  it("preserves movement within the same logical cell",()=>{
    const first=projectIsoActorPosition({x:4.25,y:6.5},GRID);
    const second=projectIsoActorPosition({x:4.5,y:6.5},GRID);
    expect(second.x-first.x).toBeCloseTo(8,8);
    expect(second.y-first.y).toBeCloseTo(4,8);
  });

  it("projects the Academy Map Base using its image scale and 128 × 69.5 tile calibration",()=>{
    const academy={cols:24,rows:20,tileW:128,tileH:69.5,offsetX:0,offsetY:0};
    const point=projectIsoActorPosition(
      {x:12,y:31},
      academy,
      {halfW:64,halfH:34.75,centerX:1280,offsetY:0,imageScaleX:.5,imageScaleY:.5}
    );
    expect(point.x).toBeCloseTo(32,8);
    expect(point.y).toBeCloseTo(742.5,8);
  });
});

describe("Pixi World Atlas Android input isolation",()=>{
  const rendererSource=readFileSync(new URL("../../src/offline-game/pixi-world-atlas-renderer.ts",import.meta.url),"utf8");
  const mainSource=readFileSync(new URL("../../src/main.ts",import.meta.url),"utf8");
  const dragSource=readFileSync(new URL("../../src/offline-game/idle-trigger-drag.ts",import.meta.url),"utf8");
  const expeditionSource=readFileSync(new URL("../../src/offline-game/expedition-interface.ts",import.meta.url),"utf8");
  const atlasSource=readFileSync(new URL("../../src/offline-game/idle-home-map.ts",import.meta.url),"utf8");
  const atlasCss=readFileSync(new URL("../../src/offline-game/idle-home-map.css",import.meta.url),"utf8");
  const cssStyles=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.css",import.meta.url),"utf8");

  it("removes Pixi pointer and accessibility extensions before renderer initialization",()=>{
    const removal=rendererSource.indexOf("PIXI.extensions.remove(EventSystem, AccessibilitySystem)");
    const initialization=rendererSource.indexOf("app=new PIXI.Application()");
    expect(removal).toBeGreaterThanOrEqual(0);
    expect(initialization).toBeGreaterThan(removal);
    expect(rendererSource).toContain('canvas.style.pointerEvents="none"');
    expect(rendererSource).toContain('canvas.style.zIndex="300"');
    expect(rendererSource).toContain("resolution:1,");
    expect(rendererSource).toContain("antialias:false");
    expect(rendererSource).toContain("powerPreference:"low-power"");
    expect(rendererSource).toContain("autoStart:false,sharedTicker:false");
    expect(rendererSource).toContain('app.stage.eventMode="none"');
    expect(rendererSource).not.toContain('addEventListener("pointerdown"');
    expect(rendererSource).not.toContain('addEventListener("pointermove"');
    expect(rendererSource).not.toContain('addEventListener("touchstart"');
  });

  it("lazy-loads Pixi only from the separate Pixi floating trigger",()=>{
    expect(expeditionSource).toContain('data-idle-rpg-open');
    expect(expeditionSource).toContain('data-idle-pixi-open');
    expect(mainSource).toContain('target.closest("[data-idle-pixi-open]")');
    expect(mainSource).toContain('openWorldAtlasFromTv("pixi")');
    expect(mainSource).toContain('import("./offline-game/pixi-world-atlas-renderer")');
  });

  it("keeps DOM transition markers above the Pixi world canvas",()=>{
    expect(rendererSource).toContain('canvas.style.zIndex="300"');
    expect(cssStyles).toContain(".wmh-isometric-play-screen [data-wmh-transition-layer]{position:absolute;inset:0;z-index:380");
    expect(cssStyles).toContain(".wmh-transition-token");
  });

  it("rebuilds map textures after editor changes and releases the prior layers",()=>{
    expect(rendererSource).toContain("const refreshStaticWorld=async()");
    expect(rendererSource).toContain("worldLayer.removeChildren()");
    expect(rendererSource).toContain("foregroundLayer.removeChildren()");
    expect(rendererSource).toContain("textures.forEach(asset=>asset.release())");
    expect(rendererSource).toContain("if(editorChanged&&!editorNow)");
    expect(rendererSource).toContain('attributeFilter:["data-x","data-y","data-pos-x","data-pos-y","data-scan-tone","data-interaction-ready","class"]');
    expect(rendererSource).toContain('observer.observe(modal,{subtree:true,childList:true})');
    expect(rendererSource).toContain("texture.destroy(true)");
    expect(rendererSource).toContain('image.src=""');

  });

  it("keeps independent draggable positions for the two Eternal Path TVs",()=>{
    expect(dragSource).toContain("merzkava.eternal-path.floating-tv-position.v1");
    expect(dragSource).toContain("merzkava.eternal-path.floating-pixi-tv-position.v1");
    expect(dragSource).toContain(".expedition-page .expedition-idle-trigger,.expedition-page .expedition-pixi-trigger");
  });

  it("keeps the Pixi Architecture annotation tiny and scoped to Pixi Atlas mode",()=>{
    expect(atlasSource).toContain('class="pixi-architecture-ink"');
    expect(atlasCss).toContain('.expedition-idle-modal[data-renderer="pixi"] .pixi-architecture-ink');
    expect(atlasCss).toContain("font:italic 5px/1.2 Georgia,serif");
  });
});
