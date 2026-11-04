import { describe, expect, it } from "vitest";
import { renderIsometricSvgSceneMarkup } from "../../src/offline-game/isometric-svg-board";
import type { IsoMapGridConfig } from "../../src/offline-game/isometric-map-editor";

const regionalGrid: IsoMapGridConfig = {
  cols: 24, rows: 20, tileW: 64, tileH: 32,
  offsetX: 0, offsetY: 0, playerScale: 1, npcScale: 1,
};
const academyGrid: IsoMapGridConfig = {
  cols: 24, rows: 20, tileW: 128, tileH: 69.5,
  offsetX: 0, offsetY: 0, playerScale: 1, npcScale: 1,
};

describe("shared SVG isometric map renderer", () => {
  it("renders a complete clickable SVG grid for regional maps", () => {
    const html = renderIsometricSvgSceneMarkup({
      mapId: "golden-dragon-empire:imperial-capital:exterior",
      grid: regionalGrid,
      theme: "golden-dragon-empire",
      title: "Imperial Capital",
    });
    expect(html).toContain('class="wmh-area-scene-svg"');
    expect(html).toContain('data-wmh-tile-grid');
    expect((html.match(/<polygon class="wmh-vector-cell/g) || []).length).toBe(480);
    expect(html).toContain('data-wmh-tile data-x="0" data-y="0"');
    expect(html).toContain('data-surface="stone"');
    expect(html).toContain("DISTRICT GATE");
    expect(html).toContain("PAVILION");
  });

  it("uses the original Academy JPG as the base and overlays transparent SVG diamonds", () => {
    const html = renderIsometricSvgSceneMarkup({
      mapId: "golden-dragon-empire:tianhai-academy:exterior",
      grid: academyGrid,
      theme: "golden-dragon-empire",
      title: "Tianhai Academy",
      baseImage: true,
      width: 2816,
      height: 1536,
    });
    expect(html).toContain('viewBox="0 0 2816 1536"');
    expect((html.match(/<polygon class="wmh-vector-cell/g) || []).length).toBe(480);
    expect(html).toContain('fill="transparent" fill-opacity="0"');
    expect(html).toContain('stroke="#fff3d7"');
    expect(html).not.toContain("PAVILION");
    expect(html).not.toContain("<rect width=");
  });

  it("uses distinct vector scenery for Tianhai Yunzhou and Beiming Gu", () => {
    const tianhai = renderIsometricSvgSceneMarkup({
      mapId: "tianhai-yunzhou:yunxiao-terrace:exterior",
      grid: regionalGrid,
      theme: "tianhai-yunzhou",
      title: "Yunxiao Terrace",
    });
    const beiming = renderIsometricSvgSceneMarkup({
      mapId: "beiming-gu:beiming-heartland:exterior",
      grid: regionalGrid,
      theme: "beiming-gu",
      title: "Beiming Heartland",
    });
    expect(tianhai).toContain("SKY GATE");
    expect(tianhai).toContain('fill="#438da5"');
    expect(beiming).toContain("FROST GATE");
    expect(beiming).toContain('fill="#6fabc0"');
  });

  it("renders a separate wood-toned vector floor for interiors", () => {
    const html = renderIsometricSvgSceneMarkup({
      mapId: "golden-dragon-empire:tianhai-academy:interior",
      grid: { ...regionalGrid, cols: 12, rows: 10 },
      theme: "interior",
      title: "Tianhai Academy · Interior",
    });
    expect((html.match(/<polygon class="wmh-vector-cell/g) || []).length).toBe(120);
    expect(html).toContain("CENTRAL DESK");
    expect(html).toContain('data-surface="wood"');
  });
});
