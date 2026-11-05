import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderWorldMapHierarchy, setWorldMapDeveloperMode } from "../../src/offline-game/world-map-hierarchy";

beforeEach(() => setWorldMapDeveloperMode(true));
afterEach(() => setWorldMapDeveloperMode(false));
import { renderIsometricVectorYard } from "../../src/offline-game/isometric-render-yard-interceptor";

describe("standalone SVG isometric render yard", () => {
  it("keeps a world-atlas entry point for the test area", () => {
    expect(renderWorldMapHierarchy()).toContain('data-wmh-action="test-isometric"');
  });

  it("renders 192 visible SVG ground polygons without the legacy CSS tile renderer", () => {
    const html = renderIsometricVectorYard();
    expect(html).toContain('class="wmh-vector-map"');
    expect((html.match(/<polygon class="wmh-vector-cell/g) || []).length).toBe(192);
    expect(html).toContain('data-wmh-player-token');
    expect(html).toContain('data-wmh-npc="test-guide"');
    expect(html).toContain('data-wmh-npc="test-scholar"');
    expect(html).toContain('data-wmh-npc="test-mechanic"');
    expect(html).toContain('NORTH GATE');
    expect(html).toContain('PAVILION');
    expect(html).not.toContain('class="wmh-tile ');
  });
});
