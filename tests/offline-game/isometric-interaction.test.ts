import { describe, expect, it } from "vitest";
import { createIsoMapEditorData } from "../../src/offline-game/isometric-map-editor";
import { isIsoQuadrantEdgeFullyBlocked, isNpcInteractionCellReachable } from "../../src/offline-game/isometric-interaction";

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
