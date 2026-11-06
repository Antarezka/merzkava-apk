import { describe, expect, it } from "vitest";
import { createIsoMapEditorData, DEFAULT_ISOMETRIC_GRID, isoCellCenter } from "../../src/offline-game/isometric-map-editor";
import { isIsoQuadrantEdgeFullyBlocked, isNpcInteractionCellReachable, isoSubcellPositionAtPoint } from "../../src/offline-game/isometric-interaction";

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
