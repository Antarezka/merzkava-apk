import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderWorldMapHierarchy } from "../../src/offline-game/world-map-hierarchy";
import { renderPlayerHudMarkup } from "../../src/offline-game/player-hud";

describe("Augusto PXL World Atlas visual mode", () => {
  it("keeps the existing DOM/SVG World Atlas as the default legacy mode", () => {
    const html=renderWorldMapHierarchy();
    expect(html).toContain('data-visual-mode="legacy"');
    expect(html).toContain('/world/Untitled77_20261029054536.png');
    expect(html).not.toContain('data-pxl-asset-id="map.world.overview"');
  });

  it("renders a separate hidden PXL Atlas using only app-bundled artwork paths", () => {
    const html=renderWorldMapHierarchy("augusto-pxl",true);
    expect(html).toContain('data-visual-mode="augusto-pxl"');
    expect(html).toContain('aria-label="Map Navigation" hidden');
    expect(html).toContain('data-pxl-asset-id="map.world.overview"');
    expect(html).toContain('/assets/augusto-pxl/placeholders/world-map-pending.svg');
    expect(html).not.toContain('/world/Untitled77_20261029054536.png');
    expect(html).not.toContain("pixi.js");
  });

  it("adds PXL art hooks to the bag, item, currency, skill and Spirit Ring visuals only in pink mode", () => {
    const pxl=renderPlayerHudMarkup("augusto-pxl");
    expect(pxl).toContain('data-pxl-asset-id="ui.hud.traveler-satchel"');
    expect(pxl).toContain('data-pxl-asset-id="ui.item.ration-small"');
    expect(pxl).toContain('data-pxl-asset-id="ui.currency.xc"');
    expect(pxl).toContain('data-pxl-asset-id="ui.skill.technique"');
    expect(pxl).toContain('data-pxl-asset-id="effect.spirit-ring.tier-1"');
    const ringStart=pxl.indexOf('<aside class="wmh-spirit-ring-list"');
    const ringEnd=pxl.indexOf("</aside>",ringStart);
    const dockStart=pxl.indexOf('<section class="wmh-player-dock"');
    const dockEnd=pxl.indexOf("</section>",dockStart);
    expect(pxl.slice(ringStart,ringEnd)).toContain('data-pxl-asset-id="effect.spirit-ring.tier-1"');
    expect(pxl.slice(dockStart,dockEnd)).not.toContain('data-pxl-asset-id="effect.spirit-ring.');
    expect(pxl.slice(dockStart,dockEnd)).toContain('data-pxl-asset-id="ui.skill.spirit-art"');
    const hudCss=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.css",import.meta.url),"utf8");
    expect(hudCss).toContain('.wmh-overlay[data-visual-mode="augusto-pxl"] .wmh-skill-ring{');
    expect(hudCss).toContain("border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;");
    const actorCss=readFileSync(new URL("../../src/offline-game/world-map-hierarchy.css",import.meta.url),"utf8");
    expect(actorCss).not.toContain("background-position:center bottom!important");
    const actorRuntime=readFileSync(new URL("../../src/offline-game/augusto-pxl-runtime.ts",import.meta.url),"utf8");
    expect(actorRuntime).toContain('element.style.backgroundSize=(asset.columns*asset.frameWidth)+"px "+asset.frameHeight+"px"');
    const legacy=renderPlayerHudMarkup("legacy");
    expect(legacy).not.toContain("data-pxl-asset-id");
  });
});
