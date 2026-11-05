import { describe, expect, it } from "vitest";
import {
  ACADEMY_ISOMETRIC_GRID,
  ACADEMY_MAP_BASE_DIMENSIONS,
  createIsoMapEditorData,
  DEFAULT_ISOMETRIC_GRID,
  DEFAULT_ISO_CANVAS_EXPANSION,
  isoMapBoardSize,
  isoCellAtPoint,
  isoCellCenter,
  isoCellHasLayer,
  isoQuadrantAtPoint,
  isoQuadrantHasLayer,
  isoQuadrantKey,
  isoMapStorageKey,
  isoPointerGesture,
  mergeIsoWalkableCells,
  normalizeIsoMapEditorData,
  removeIsoWalkableCell,
  unmergeIsoWalkableCell,
  normalizeIsoCanvasExpansion,
  toggleIsoCellLayer,
  toggleIsoQuadrantLayer,
} from "../../src/offline-game/isometric-map-editor";

describe("shared isometric map editor data", () => {
  it("provides default gaps for all four canvas sides", () => {
    expect(DEFAULT_ISO_CANVAS_EXPANSION).toEqual({ top: 0, bottom: 0, left: 800, right: 0 });
    expect(normalizeIsoCanvasExpansion({})).toEqual(DEFAULT_ISO_CANVAS_EXPANSION);
    expect(normalizeIsoCanvasExpansion({ left: 1200 })).toEqual({ top: 0, bottom: 0, left: 1200, right: 0 });
  });

  it("normalizes four independent canvas expansion values", () => {
    expect(normalizeIsoCanvasExpansion({ top: 250, bottom: 500, left: 900, right: -2 }))
      .toEqual({ top: 250, bottom: 500, left: 900, right: 0 });
    expect(normalizeIsoCanvasExpansion({ left: 99999 }).left).toBe(12000);
  });

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

  it("keeps walkable regions and quadrant flags independent", () => {
    const data = createIsoMapEditorData("quadrant-test");
    expect(data.walkableAreaEnabled).toBe(false);
    expect(data.walkableCells).toEqual([]);
    expect(data.foregroundQuadrants).toEqual([]);
    expect(data.blockedQuadrants).toEqual([]);
    expect(data.opacityQuadrants).toEqual([]);

    data.walkableAreaEnabled = true;
    data.walkableCells = ["4,6"];
    expect(toggleIsoQuadrantLayer(data, "blockedQuadrants", 4, 6, "tl")).toBe(true);
    expect(toggleIsoQuadrantLayer(data, "foregroundQuadrants", 4, 6, "br")).toBe(true);
    expect(toggleIsoQuadrantLayer(data, "opacityQuadrants", 4, 6, "tr")).toBe(true);
    expect(isoQuadrantHasLayer(data, "blockedQuadrants", 4, 6, "tl")).toBe(true);
    expect(isoQuadrantHasLayer(data, "foregroundQuadrants", 4, 6, "br")).toBe(true);
    expect(isoQuadrantHasLayer(data, "opacityQuadrants", 4, 6, "tr")).toBe(true);
    expect(isoQuadrantKey(4, 6, "bl")).toBe("4,6:bl");
    expect(toggleIsoQuadrantLayer(data, "blockedQuadrants", 4, 6, "tl")).toBe(false);
    expect(isoQuadrantHasLayer(data, "foregroundQuadrants", 4, 6, "br")).toBe(true);
  });

  it("merges adjacent walkable cells into one flexible logical cell and can split it", () => {
    const data = createIsoMapEditorData("merge-test");
    data.walkableCells = ["2,2", "3,2", "3,3", "4,3"];
    const group = mergeIsoWalkableCells(data, ["2,2", "3,2", "3,3"], "pathway-west");
    expect(group).toEqual({ id: "pathway-west", cells: ["2,2", "3,2", "3,3"] });
    expect(data.walkableCellGroups).toHaveLength(1);
    expect(mergeIsoWalkableCells(data, ["2,2", "5,5"], "separate")).toBeNull();
    const expanded = mergeIsoWalkableCells(data, ["3,2", "3,3", "4,3"], "pathway-expanded");
    expect(expanded).toEqual({ id: "pathway-expanded", cells: ["3,2", "3,3", "4,3", "2,2"] });
    expect(data.walkableCellGroups).toHaveLength(1);

    const split = unmergeIsoWalkableCell(data, 3, 2);
    expect(split).toEqual(expanded);
    expect(data.walkableCellGroups).toEqual([]);
    expect(data.walkableCells).toEqual(["2,2", "3,2", "3,3", "4,3"]);
  });

  it("preserves connected merged cells and rejects invalid imported groups", () => {
    const data = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6 },
      walkableCells: ["1,1", "2,1", "2,2", "5,5"],
      walkableCellGroups: [
        { id: "valid", cells: ["1,1", "2,1", "2,2"] },
        { id: "disconnected", cells: ["1,1", "5,5"] },
        { id: "outside", cells: ["1,1", "8,1"] },
      ],
    }, "merge-import");
    expect(data.walkableCellGroups).toEqual([{ id: "valid", cells: ["1,1", "2,1", "2,2"] }]);
    expect(removeIsoWalkableCell(data, 2, 1)).toBe(true);
    expect(data.walkableCells).toEqual(["1,1", "2,2", "5,5"]);
    expect(data.walkableCellGroups).toEqual([]);
  });

  it("resolves extra grid cells outside the base grid only when explicitly allowed", () => {
    const grid = { ...DEFAULT_ISOMETRIC_GRID, cols: 8, rows: 6, tileW: 80, tileH: 40 };
    const extraCenter = isoCellCenter(8, 2, grid);
    expect(isoCellAtPoint(extraCenter, grid)).toBeNull();
    expect(isoCellAtPoint(extraCenter, grid, true)).toEqual({ x: 8, y: 2 });
    expect(isoCellAtPoint(isoCellCenter(4, 3, grid), grid, true)).toEqual({ x: 4, y: 3 });
  });

  it("preserves sparse custom grid cells, walkable flags and merged groups outside base bounds", () => {
    const data = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6 },
      customGridCells: ["8,2", "9,2", "-1,3", "1,1", "600,1", "bad"],
      walkableCells: ["8,2", "9,2", "-1,3", "1,2"],
      walkableCellGroups: [
        { id: "outer-path", cells: ["8,2", "9,2"] },
      ],
      foregroundQuadrants: ["8,2:tl", "-1,3:br", "1,2:tr"],
      blockedQuadrants: ["9,2:bl"],
      opacityQuadrants: ["-1,3:tr"],
      transitions: [{ id: "outer-gate", x: 8, y: 2, label: "Academy Outer Gate" }],
    }, "custom-grid");
    expect(data.customGridCells).toEqual(["8,2", "9,2", "-1,3"]);
    expect(data.walkableCells).toEqual(["1,2", "8,2", "9,2", "-1,3"]);
    expect(data.walkableCellGroups).toEqual([{ id: "outer-path", cells: ["8,2", "9,2"] }]);
    expect(data.foregroundQuadrants).toEqual(["8,2:tl", "-1,3:br", "1,2:tr"]);
    expect(data.blockedQuadrants).toEqual(["9,2:bl"]);
    expect(data.opacityQuadrants).toEqual(["-1,3:tr"]);
    expect(data.transitions).toEqual([{ id: "outer-gate", x: 8, y: 2, label: "Academy Outer Gate" }]);
  });

  it("resolves the four sub-sectors inside one diamond", () => {
    const grid = { ...DEFAULT_ISOMETRIC_GRID, tileW: 120, tileH: 60 };
    const center = isoCellCenter(3, 5, grid);
    expect(isoQuadrantAtPoint({ x: center.x - 20, y: center.y - 10 }, 3, 5, grid)).toBe("tl");
    expect(isoQuadrantAtPoint({ x: center.x + 20, y: center.y - 10 }, 3, 5, grid)).toBe("tr");
    expect(isoQuadrantAtPoint({ x: center.x - 20, y: center.y + 10 }, 3, 5, grid)).toBe("bl");
    expect(isoQuadrantAtPoint({ x: center.x + 20, y: center.y + 10 }, 3, 5, grid)).toBe("br");
  });

  it("normalizes walkable areas and quadrant keys while dropping invalid sectors", () => {
    const data = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6 },
      walkableAreaEnabled: true,
      walkableCells: ["1,2", "1,2", "8,2", "bad"],
      foregroundQuadrants: ["1,2:tl", "1,2:br", "1,2:middle", "8,2:tr", "bad"],
      blockedQuadrants: ["4,5:bl", "4,6:br"],
      opacityQuadrants: ["0,0:tr"],
    }, "map-quadrants");
    expect(data.walkableAreaEnabled).toBe(true);
    expect(data.walkableCells).toEqual(["1,2"]);
    expect(data.foregroundQuadrants).toEqual(["1,2:tl", "1,2:br"]);
    expect(data.blockedQuadrants).toEqual(["4,5:bl"]);
    expect(data.opacityQuadrants).toEqual(["0,0:tr"]);
  });

  it("preserves explicit confirmation metadata for saved AI references", () => {
    const confirmed = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6 },
      confirmed: true,
      confirmedAt: "2026-11-05T12:00:00.000Z",
      walkableAreaEnabled: true,
      walkableCells: ["1,2"],
      blockedQuadrants: ["1,2:tl"],
    }, "map-confirmed");
    expect(confirmed.confirmed).toBe(true);
    expect(confirmed.confirmedAt).toBe("2026-11-05T12:00:00.000Z");
    expect(confirmed.walkableCells).toEqual(["1,2"]);
    expect(confirmed.blockedQuadrants).toEqual(["1,2:tl"]);

    const draft = normalizeIsoMapEditorData({
      grid: { cols: 8, rows: 6 },
      confirmed: false,
      confirmedAt: "stale-confirmation",
    }, "map-draft");
    expect(draft.confirmed).toBe(false);
    expect(draft.confirmedAt).toBe("");
  });

  it("separates a cell tap from a map drag using a movement threshold", () => {
    expect(isoPointerGesture({ x: 40, y: 80 }, { x: 44, y: 83 })).toBe("tap");
    expect(isoPointerGesture({ x: 40, y: 80 }, { x: 49, y: 80 })).toBe("drag");
    expect(isoPointerGesture({ x: 40, y: 80 }, { x: 40, y: 90 })).toBe("drag");
    expect(isoPointerGesture({ x: 40, y: 80 }, { x: 48, y: 80 })).toBe("drag");
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
    expect(data.walkableCells).toEqual([]);
    expect(data.walkableCellGroups).toEqual([]);
    expect(data.walkableAreaEnabled).toBe(false);
    expect(data.foregroundQuadrants).toEqual([]);
    expect(data.blockedQuadrants).toEqual([]);
    expect(data.opacityQuadrants).toEqual([]);
    expect(data.confirmed).toBe(false);
    expect(data.confirmedAt).toBe("");
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
