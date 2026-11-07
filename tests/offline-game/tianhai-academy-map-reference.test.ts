import { describe, expect, it } from "vitest";
import { TIANHAI_ACADEMY_MAP_REFERENCE as map } from "../../src/offline-game/tianhai-academy-map-reference";
import { TIANHAI_ACADEMY_PXL_LABELS } from "../../src/offline-game/tianhai-academy-map-labels";
import { isoCellAtPoint, isoCellCenter, normalizeIsoMapEditorData } from "../../src/offline-game/isometric-map-editor";

describe("Tianhai Academy PXL sandbox map structure",()=>{
  const normalized=normalizeIsoMapEditorData(map,map.mapId);

  it("keeps the canon location and the original Academy canvas/grid calibration",()=>{
    expect(map.mapId).toBe("pxl-studio:tianhai-academy:exterior");
    expect(normalized.mapTitle).toBe("Tianhai Academy · PXL Sandbox");
    expect(normalized.mapBase).toEqual({src:"/assets/augusto-pxl/placeholders/academy-map-pending.svg",width:2816,height:1536});
    expect(normalized.grid).toMatchObject({cols:24,rows:20,tileW:128,tileH:69.5,offsetX:0,offsetY:0});
    expect(normalized.confirmed).toBe(false);
    expect(normalized.transitions).toEqual([]);
  });

  it("covers all 480 base cells plus the 105 preserved extension diamonds",()=>{
    const coordinates=new Set<string>();
    for(let y=0;y<map.grid.rows;y++)for(let x=0;x<map.grid.cols;x++)coordinates.add(x+","+y);
    for(const key of normalized.customGridCells)coordinates.add(key);
    expect(map.grid.cols*map.grid.rows).toBe(480);
    expect(normalized.customGridCells).toHaveLength(105);
    expect(coordinates.size).toBe(585);
    expect(coordinates.size*8).toBe(4680);
    for(const key of coordinates){
      const [x,y]=key.split(",").map(Number);
      expect(isoCellAtPoint(isoCellCenter(x,y,map.grid),map.grid,true)).toEqual({x,y});
    }
  });

  it("preserves the five custom diamonds that cross the original Map Base edge",()=>{
    const clipped=normalized.customGridCells.filter(key=>{
      const [x,y]=key.split(",").map(Number),center=isoCellCenter(x,y,map.grid);
      return center.x-map.grid.tileW/2<0||center.y-map.grid.tileH/2<0||
        center.x+map.grid.tileW/2>map.mapBase!.width||center.y+map.grid.tileH/2>map.mapBase!.height;
    }).sort();
    expect(clipped).toEqual(["10,30","11,31","12,31","7,27","8,28"]);
  });

  it("keeps Player and all four NPC spawn cells inside one connected walkable network",()=>{
    const starts=["12,31","7,4","10,9","6,15","22,10"];
    for(const coordinate of starts)expect(normalized.walkableCells).toContain(coordinate);
    expect(normalized.customGridCells).toContain("12,31");
    expect(normalized.walkableAreaEnabled).toBe(true);
    const remaining=new Set(normalized.walkableCells);
    const first=remaining.values().next().value as string|undefined;
    expect(first).toBeDefined();
    const connected:string[]=[];
    if(first){
      const queue=[first];remaining.delete(first);
      for(let i=0;i<queue.length;i++){
        const [x,y]=queue[i].split(",").map(Number);
        for(const next of [x+1+","+y,x-1+","+y,x+","+(y+1),x+","+(y-1)]){
          if(remaining.has(next)){remaining.delete(next);queue.push(next);}
        }
      }
      connected.push(...queue);
    }
    expect(remaining.size).toBe(0);
    for(const coordinate of starts)expect(connected).toContain(coordinate);
  });

  it("derives all three independent quadrant layers from the freeform spatial labels",()=>{
    expect(TIANHAI_ACADEMY_PXL_LABELS.length).toBeGreaterThanOrEqual(60);
    expect(TIANHAI_ACADEMY_PXL_LABELS.some(label=>label.category==="pond"&&label.points.length>=7)).toBe(true);
    expect(TIANHAI_ACADEMY_PXL_LABELS.some(label=>label.category==="path"&&label.points.length>=7)).toBe(true);
    expect(TIANHAI_ACADEMY_PXL_LABELS.some(label=>label.category==="building"&&label.blocked&&label.foreground)).toBe(true);
    expect(TIANHAI_ACADEMY_PXL_LABELS.some(label=>label.category==="tree-canopy"&&label.foreground&&label.opacity)).toBe(true);
    expect(normalized.foregroundQuadrants.length).toBeGreaterThan(20);
    expect(normalized.blockedQuadrants.length).toBeGreaterThan(100);
    expect(normalized.opacityQuadrants.length).toBeGreaterThan(10);
    expect(normalized.notes?.quadrantKeys).toContain("tl-a|tl-b");
    expect(normalized.notes?.canvasExpansion).toContain("Canvas Editor owns all four margins");
  });

  it("keeps the entrance, outer/inner/core, dojo, Spirit Realm and Arcanist spatial labels distinct",()=>{
    const ids=new Set(TIANHAI_ACADEMY_PXL_LABELS.map(label=>label.id));
    for(const id of [
      "gate-main","zone-outer-students","zone-inner-students","zone-core-students",
      "zone-dojo-west","zone-spirit-training-east","zone-arcanist-learning","zone-instructors",
      "pond-west","pond-south-east","building-core-main-hall"
    ])expect(ids.has(id)).toBe(true);
  });
});
