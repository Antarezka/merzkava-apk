import { describe, expect, it } from "vitest";
import { renderIsometricMapTestArea, renderWorldMapHierarchy } from "../../src/offline-game/world-map-hierarchy";

describe("isolated isometric renderer test area", () => {
  it("provides a separate atlas entry point", () => {
    expect(renderWorldMapHierarchy()).toContain('data-wmh-action="test-isometric"');
  });

  it("renders a full test board with terrain, player, and three NPCs", () => {
    const html = renderIsometricMapTestArea();
    expect(html).toContain('data-map-id="isometric-render-test:render-yard:exterior"');
    expect(html).toContain('class="wmh-isometric-board is-exterior is-render-test is-placeholder"');
    expect(html).toContain('data-cols="16" data-rows="12" data-tile-w="72" data-tile-h="36"');
    expect(html).toContain('data-wmh-player-token');
    expect(html).toContain('data-wmh-npc="test-guide"');
    expect(html).toContain('data-wmh-npc="test-scholar"');
    expect(html).toContain('data-wmh-npc="test-mechanic"');
    expect(html).toContain('data-token-label="GUIDE"');
    expect(html).toContain('data-token-label="SCHOLAR"');
    expect(html).toContain('feature-test-water');
    expect(html).toContain('feature-test-gate');
    expect((html.match(/class="wmh-tile /g) || []).length).toBe(192);
  });
});
