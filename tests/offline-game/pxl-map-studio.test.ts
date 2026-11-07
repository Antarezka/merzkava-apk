import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderPxlMapStudioMarkup, TIANHAI_PXL_SANDBOX_MAP_ID } from "../../src/offline-game/pxl-map-studio";

describe("dedicated Augusto PXL Map Studio",()=>{
  const markup=renderPxlMapStudioMarkup();

  it("keeps the new authoring surface independent from the legacy Isometric Cell Editor",()=>{
    expect(TIANHAI_PXL_SANDBOX_MAP_ID).toBe("pxl-studio:tianhai-academy:exterior");
    expect(markup).toContain('data-pxl-studio-rail');
    expect(markup).toContain('data-pxl-studio-grip');
    expect(markup).toContain('data-pxl-studio-window');
    expect(markup).toContain('data-pxl-studio-drag');
    expect(markup).toContain('data-pxl-studio-minimize');
    expect(markup).not.toContain('data-wmh-overlay-tools');
  });

  it("provides freeform lasso labels with editable shape metadata",()=>{
    for(const marker of [
      "FREEFORM SPATIAL LABELS","DRAW LASSO","FINISH / CANCEL",
      "data-pxl-label-name","data-pxl-label-category","data-pxl-label-description",
      "data-pxl-studio-label-list","data-pxl-studio-label-delete"
    ])expect(markup).toContain(marker);
    const source=readFileSync(new URL("../../src/offline-game/pxl-map-studio.ts",import.meta.url),"utf8");
    expect(source).toContain("data-pxl-label-vertex");
    expect(source).toContain("contextmenu");
    expect(source).toContain("dragVertex");
  });

  it("exposes the three original O, X and opacity marker meanings",()=>{
    expect(markup).toContain('data-pxl-studio-marker="O"');
    expect(markup).toContain('data-pxl-studio-marker="X"');
    expect(markup).toContain('data-pxl-studio-marker="opacity"');
    expect(markup).toContain("O draws the same Map Base above actors");
    expect(markup).toContain("X blocks movement");
    expect(markup).toContain("opacity dims actors behind");
  });

  it("has separate Save, Confirm and Copy Data actions and full-coverage validation",()=>{
    expect(markup).toContain('data-pxl-studio-save');
    expect(markup).toContain('data-pxl-studio-confirm');
    expect(markup).toContain('data-pxl-studio-copy');
    expect(markup).toContain('data-pxl-studio-validate');
    const source=readFileSync(new URL("../../src/offline-game/pxl-map-studio.ts",import.meta.url),"utf8");
    expect(source).toContain("counts.totalCells!==585");
    expect(source).toContain("counts.totalQuadrants");
    expect(source).toContain("isolatedWalkableCells");
    expect(source).toContain("canvasExpansion");
    expect(source).toContain("spatialLabels:labels");
  });

  it("keeps the board overlay out of the floating panel so it can be anchored to the map camera",()=>{
    expect(markup).not.toContain('data-pxl-studio-svg');
    const world=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.ts",import.meta.url),"utf8");
    expect(world).toContain('data-pxl-studio-svg viewBox="0 0 2816 1536"');
    expect(world).toContain('if(current==="pxl-studio")');
    expect(world).toContain('dataset.visualMode="augusto-pxl"');
    expect(world).toContain('regionId==="golden-dragon-empire"');
    const css=readFileSync(new URL("../../src/offline-game/pxl-map-studio.css",import.meta.url),"utf8");
    expect(css).toContain("right:0;top:36%");
    expect(css).toContain("width:min(310px,calc(100vw - 84px))");
    expect(css).toContain("overflow-y:auto");
  });

  it("keeps the original Canvas Editor margins separate from label/cell mapping",()=>{
    const source=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.ts",import.meta.url),"utf8");
    expect(source).toContain("function academyCanvasEditorMarkup()");
    expect(source).toContain("data-wmh-canvas-side");
    expect(source).toContain("merzkava.academy-canvas-expansion.v2");
    expect(source).toContain('format:"merzkava-academy-canvas-expansion",version:2');
  });
});
