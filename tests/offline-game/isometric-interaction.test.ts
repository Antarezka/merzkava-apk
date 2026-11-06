import { describe, expect, it } from "vitest";
import { createIsoMapEditorData, DEFAULT_ISOMETRIC_GRID, isoCellCenter, normalizeIsoMapEditorData } from "../../src/offline-game/isometric-map-editor";
import { findIsoQuadrantPath, isIsoQuadrantEdgeFullyBlocked, isIsoQuadrantWalkable, isNpcInteractionCellReachable, isoQuadrantCenterGridPosition, isoSubcellPositionAtPoint, nearestWalkableIsoQuadrant } from "../../src/offline-game/isometric-interaction";

describe("tile-aware NPC interaction reach",()=>{
  it("allows interaction from one orthogonally adjacent walkable cell",()=>{
    const data=createIsoMapEditorData("npc-reach",{cols:8,rows:6});
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(true);
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:2,y:3})).toBe(true);
  });

  it("rejects distant, diagonal, overlapping, and out-of-grid positions",()=>{
    const data=createIsoMapEditorData("npc-range",{cols:8,rows:6});
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:4,y:2})).toBe(false);
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:3})).toBe(false);
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:2,y:2})).toBe(false);
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:8,y:2})).toBe(false);
  });

  it("respects the walkable whitelist and blocked cells on both actor tiles",()=>{
    const data=createIsoMapEditorData("npc-whitelist",{cols:8,rows:6});
    data.walkableAreaEnabled=true;
    data.walkableCells=["2,2","3,2"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(true);
    data.walkableCells=["2,2"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(false);
    data.walkableAreaEnabled=false;
    data.blockedCells=["3,2"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(false);
    data.blockedCells=["2,2"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(false);
  });

  it("respects closed quadrant edges just like movement",()=>{
    const data=createIsoMapEditorData("npc-edge",{cols:8,rows:6});
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(true);
    data.blockedQuadrants=["2,2:br-a"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(true);
    expect(isIsoQuadrantEdgeFullyBlocked(data,2,2,"br")).toBe(false);
    data.blockedQuadrants=["2,2:br-a","2,2:br-b"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(false);
    data.blockedQuadrants=["3,2:tl-a","3,2:tl-b"];
    expect(isNpcInteractionCellReachable(data,{x:2,y:2},{x:3,y:2})).toBe(false);
  });

  it("permits adjacent cells from the explicitly configured custom grid",()=>{
    const data=createIsoMapEditorData("npc-custom",{cols:8,rows:6});
    data.customGridCells=["8,2","9,2"];
    expect(isNpcInteractionCellReachable(data,{x:8,y:2},{x:9,y:2})).toBe(true);
  });
});

describe("fractional isometric actor positions",()=>{
  it("resolves a tap to a fractional point within the selected diamond",()=>{
    const center=isoCellCenter(4,6,DEFAULT_ISOMETRIC_GRID);
    const point={x:center.x+(DEFAULT_ISOMETRIC_GRID.tileW/2)*0.3,y:center.y+(DEFAULT_ISOMETRIC_GRID.tileH/2)*0.1};
    const resolved=isoSubcellPositionAtPoint(point,4,6,DEFAULT_ISOMETRIC_GRID);
    expect(resolved?.x).toBeCloseTo(4.2,5);
    expect(resolved?.y).toBeCloseTo(5.9,5);
  });
  it("keeps edge taps inside the actor-safe diamond while rejecting taps outside",()=>{
    const center=isoCellCenter(2,3,DEFAULT_ISOMETRIC_GRID);
    const halfW=DEFAULT_ISOMETRIC_GRID.tileW/2,halfH=DEFAULT_ISOMETRIC_GRID.tileH/2;
    const nearEdge={x:center.x+(halfW*0.9),y:center.y+(halfH*0.1)};
    const resolved=isoSubcellPositionAtPoint(nearEdge,2,3,DEFAULT_ISOMETRIC_GRID);
    expect(resolved).not.toBeNull();
    expect(Math.abs(resolved!.x-2)+Math.abs(resolved!.y-3)).toBeCloseTo(0.86,5);
    expect(isoSubcellPositionAtPoint({x:center.x+halfW*1.1,y:center.y},2,3,DEFAULT_ISOMETRIC_GRID)).toBeNull();
  });
});


describe("walkable isometric quadrant routing", () => {
  it("uses fractional centers for the eight triangular sectors", () => {
    expect(isoQuadrantCenterGridPosition(2, 3, "tl-a")).toEqual({ x: 2 - 1 / 3, y: 3 - 1 / 6 });
    expect(isoQuadrantCenterGridPosition(2, 3, "br-b")).toEqual({ x: 2 + 1 / 3, y: 3 + 1 / 6 });
  });

  it("routes through the remaining half-edge when one quadrant is blocked", () => {
    const data = createIsoMapEditorData("quadrant-half-edge", { cols: 2, rows: 1 });
    data.blockedQuadrants = ["0,0:br-a"];
    expect(isIsoQuadrantWalkable(data, 0, 0, "br-a")).toBe(false);
    expect(isIsoQuadrantWalkable(data, 0, 0, "br-b")).toBe(true);
    const path = findIsoQuadrantPath(
      data,
      { x: 0, y: 0, quadrant: "tl-a" },
      { x: 1, y: 0, quadrant: "tl-b" },
    );
    expect(path).not.toBeNull();
    expect(path?.some(node => node.x === 0 && node.y === 0 && node.quadrant === "br-a")).toBe(false);
    expect(path?.some(node => node.x === 0 && node.y === 0 && node.quadrant === "br-b")).toBe(true);
  });

  it("closes a full cell edge only when both of its matching half-sectors are blocked", () => {
    const data = createIsoMapEditorData("quadrant-closed-edge", { cols: 2, rows: 1 });
    data.blockedQuadrants = ["0,0:br-a", "0,0:br-b"];
    expect(findIsoQuadrantPath(
      data,
      { x: 0, y: 0, quadrant: "tl-a" },
      { x: 1, y: 0, quadrant: "tl-a" },
    )).toBeNull();
  });

  it("respects the walkable-cell whitelist and chooses a safe start sector", () => {
    const data = createIsoMapEditorData("quadrant-whitelist", { cols: 2, rows: 1 });
    data.walkableAreaEnabled = true;
    data.walkableCells = ["0,0"];
    data.blockedQuadrants = ["0,0:tl-a"];
    expect(nearestWalkableIsoQuadrant(data, 0, 0, { x: 0, y: 0 })).not.toBe("tl-a");
    expect(findIsoQuadrantPath(
      data,
      { x: 0, y: 0, quadrant: "tl-b" },
      { x: 1, y: 0, quadrant: "tl-a" },
    )).toBeNull();
  });
});


describe("isometric transition marker metadata",()=>{
  it("persists a valid target region",()=>{
    const data=createIsoMapEditorData("transition-target",{cols:4,rows:4});
    data.transitions=[{id:"gate",x:2,y:2,label:"Exit Academy",targetRegion:"golden-dragon-empire"}];
    expect(normalizeIsoMapEditorData(data,"transition-target",data.grid).transitions[0]?.targetRegion).toBe("golden-dragon-empire");
  });
  it("drops malformed target region slugs but retains the marker",()=>{
    const data=createIsoMapEditorData("transition-invalid",{cols:4,rows:4});
    data.transitions=[{id:"gate",x:2,y:2,label:"Exit Academy",targetRegion:"../bad path"} as never];
    const marker=normalizeIsoMapEditorData(data,"transition-invalid",data.grid).transitions[0];
    expect(marker?.label).toBe("Exit Academy");
    expect(marker?.targetRegion).toBeUndefined();
  });
});
