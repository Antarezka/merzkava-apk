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
    const legacy=renderPlayerHudMarkup("legacy");
    expect(legacy).not.toContain("data-pxl-asset-id");
  });
});
