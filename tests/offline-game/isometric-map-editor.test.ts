import { describe, expect, it } from "vitest";
import {
  ACADEMY_ISOMETRIC_GRID,
  ACADEMY_MAP_BASE_DIMENSIONS,
  createIsoMapEditorData,
  DEFAULT_ISOMETRIC_GRID,
  isoMapBoardSize,
  isoCellAtPoint,
  isoCellCenter,
  isoCellHasLayer,
  isoMapStorageKey,
  normalizeIsoMapEditorData,
  toggleIsoCellLayer,
} from "../../src/offline-game/isometric-map-editor";

describe("shared isometric map editor data", () => {
  it("keeps foreground, blocking, and opacity cell flags independent", () => {
    const data = createIsoMapEditorData("academy-exterior");
    expect(toggleIsoCellLayer(data, "foregroundCells", 4, 6)).toBe(true);
    expect(toggleIsoCellLayer(data, "blockedCells", 4, 6)).toBe(true);
    expect(toggleIsoCellLayer(data, "opacityCells", 4, 6)).toBe(true);

    expect(isoCellHasLayer(data, "foregroundCells", 4, 6)).toBe(true);
    expect(isoCellHasLayer(data, "blockedCells", 4, 6)).toBe(true);
    expect(isoCellHasLayer(data, "opacityCells", 4, 6)).toBe(true);

    toggleIsoCellLayer(data, "foregroundCells", 4, 6);
    expect(isoCellHasLayer(data, "foregroundCells", 4, 6)).toBe(false);
    expect(isoCellHasLayer(data, "blockedCells", 4, 6)).toBe(true);
    expect(isoCellHasLayer(data, "opacityCells", 4, 6)).toBe(true);
  });

  it("maps isometric diamond centers back to their exact cells with grid offsets", () => {
    const grid = { ...DEFAULT_ISOMETRIC_GRID, offsetX: 18, offsetY: -12, tileW: 72, tileH: 36 };
    const center = isoCellCenter(7, 9, grid);
    expect(isoCellAtPoint(center, grid)).toEqual({ x: 7, y: 9 });
    expect(isoCellAtPoint(isoCellCenter(0, 0, grid), grid)).toEqual({ x: 0, y: 0 });
    expect(isoCellAtPoint(isoCellCenter(23, 19, grid), grid)).toEqual({ x: 23, y: 19 });
  });

  it("normalizes imported cell data and drops invalid or out-of-grid entries", () => {
    const data = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6, tileW: 70, tileH: 35 },
      foregroundCells: ["1,2", "1,2", "99,99", "bad"],
      blockedCells: ["1,2"],
      opacityCells: ["4,5"],
      transitions: [{ id: "a", x: 7, y: 5, label: "North Gate" }, { id: "b", x: 8, y: 5, label: "outside" }],
    }, "map-b");
    expect(data.mapId).toBe("map-b");
    expect(data.foregroundCells).toEqual(["1,2"]);
    expect(data.blockedCells).toEqual(["1,2"]);
    expect(data.opacityCells).toEqual(["4,5"]);
    expect(data.transitions).toEqual([{ id: "a", x: 7, y: 5, label: "North Gate" }]);
  });

  it("calibrates the Academy grid against the complete PNG base dimensions", () => {
    expect(isoMapBoardSize(
      ACADEMY_ISOMETRIC_GRID,
      ACADEMY_MAP_BASE_DIMENSIONS.width,
      ACADEMY_MAP_BASE_DIMENSIONS.height,
    )).toEqual({ width: 2816, height: 1536 });
    expect(ACADEMY_ISOMETRIC_GRID).toMatchObject({
      cols: 24, rows: 20, tileW: 128, tileH: 69.5,
    });
  });

  it("starts the Academy image map with an empty editable surface", () => {
    const data = createIsoMapEditorData("golden-dragon-empire:tianhai-academy:exterior", ACADEMY_ISOMETRIC_GRID);
    expect(data.grid).toMatchObject({ cols: 24, rows: 20, tileW: 128, tileH: 69.5 });
    expect(data.foregroundCells).toEqual([]);
    expect(data.blockedCells).toEqual([]);
    expect(data.opacityCells).toEqual([]);
    expect(data.transitions).toEqual([]);
  });

  it("uses a fresh storage namespace for the reinstalled isometric areas", () => {
    expect(isoMapStorageKey("golden-dragon-empire:tianhai-academy:exterior")
      .startsWith("merzkava.isometric-map-editor.v2:")).toBe(true);
    expect(isoMapStorageKey("golden-dragon-empire:tianhai-academy:exterior"))
      .not.toBe(isoMapStorageKey("golden-dragon-empire:tianhai-academy:interior"));
    expect(isoMapStorageKey("golden-dragon-empire:tianhai-academy:exterior"))
      .not.toBe(isoMapStorageKey("tianhai-yunzhou:academy:exterior"));
  });

  it("keeps editor settings isolated for different isometric map IDs", () => {
    expect(isoMapStorageKey("golden-dragon-empire:academy:exterior"))
      .not.toBe(isoMapStorageKey("golden-dragon-empire:academy:interior"));
    expect(isoMapStorageKey("golden-dragon-empire:academy:exterior"))
      .not.toBe(isoMapStorageKey("tianhai-yunzhou:academy:exterior"));
  });

  it("rejects clicks outside the isometric diamond grid", () => {
    const outside = isoCellAtPoint({ x: -500, y: -500 }, DEFAULT_ISOMETRIC_GRID);
    expect(outside).toBeNull();
  });

  it("ignores cell edits outside map bounds", () => {
    const data = createIsoMapEditorData("small-room", { ...DEFAULT_ISOMETRIC_GRID, cols: 4, rows: 3 });
    expect(toggleIsoCellLayer(data, "blockedCells", 4, 0)).toBe(false);
    expect(data.blockedCells).toEqual([]);
  });
});
