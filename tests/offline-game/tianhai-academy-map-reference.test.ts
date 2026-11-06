import { describe, expect, it } from "vitest";
import { TIANHAI_ACADEMY_MAP_REFERENCE as map } from "../../src/offline-game/tianhai-academy-map-reference";
import { isoCellAtPoint, isoCellCenter, normalizeIsoMapEditorData } from "../../src/offline-game/isometric-map-editor";

describe("Tianhai Academy owner-supplied map reference", () => {
  const normalized=normalizeIsoMapEditorData(map,map.mapId);

  it("preserves the image calibration and explicit unconfirmed state", () => {
    expect(normalized.mapTitle).toBe("Tianhai Academy");
    expect(normalized.mapBase).toEqual({src:"/maps/academy/full-map/1_academy.jpg",width:2816,height:1536});
    expect(normalized.grid).toMatchObject({cols:24,rows:20,tileW:128,tileH:69.5,offsetX:0,offsetY:0,playerScale:1,npcScale:1});
    expect(normalized.confirmed).toBe(false);
    expect(normalized.confirmedAt).toBe("");
  });

  it("maps every base and custom Academy diamond through one calibrated image-space projection", () => {
    const coordinates=new Set<string>();
    for(let y=0;y<map.grid.rows;y++)for(let x=0;x<map.grid.cols;x++)coordinates.add(x+","+y);
    for(const key of normalized.customGridCells)coordinates.add(key);
    expect(map.grid.cols*map.grid.rows).toBe(480);
    expect(coordinates.size).toBe(480+normalized.customGridCells.filter(key=>{
      const [x,y]=key.split(",").map(Number);
      return x<0||y<0||x>=map.grid.cols||y>=map.grid.rows;
    }).length);
    for(const key of coordinates){
      const [x,y]=key.split(",").map(Number);
      expect(isoCellAtPoint(isoCellCenter(x,y,map.grid),map.grid,true)).toEqual({x,y});
    }
  });

  it("preserves the five existing custom diamonds that cross the Map Base edge without shifting them", () => {
    const clipped=normalized.customGridCells.filter(key=>{
      const [x,y]=key.split(",").map(Number),center=isoCellCenter(x,y,map.grid);
      return center.x-map.grid.tileW/2<0||center.y-map.grid.tileH/2<0||
        center.x+map.grid.tileW/2>map.mapBase!.width||center.y+map.grid.tileH/2>map.mapBase!.height;
    }).sort();
    expect(clipped).toEqual(["10,30","11,31","12,31","7,27","8,28"]);
  });

  it("keeps the entrance, NPC start cells and event cells in the selected walkable area", () => {
    for(const coordinate of ["12,31","11,31","9,3","14,-5","7,4","10,9","6,15","22,10"]) {
      expect(normalized.walkableCells).toContain(coordinate);
    }
    expect(normalized.customGridCells).toContain("12,31");
    expect(normalized.customGridCells).toContain("14,-5");
    expect(normalized.walkableAreaEnabled).toBe(true);
  });

  it("retains the four transition actions and their owner-set positions", () => {
    expect(normalized.transitions).toEqual([
      {id:"transition-1793864008899-0",x:11,y:31,label:"Akses ke map golden dragon empire"},
      {id:"transition-1793864011340-1",x:12,y:31,label:"Akses ke map golden dragon empire"},
      {id:"transition-1793864745728-2",x:9,y:3,label:"Dialog box: you're not qualified yet"},
      {id:"transition-1793864803234-3",x:14,y:-5,label:"Event scene: pengenalan dunia merzkava tentang spirit realm dan archanistry"},
    ]);
  });

  it("keeps the reference explicitly unconfirmed until the owner confirms it", () => {
    expect(map.confirmed).toBe(false);
    expect(map.confirmedAt).toBe("");
  });

  it("retains the eight-sector layer flags and owner notes", () => {
    expect(normalized.foregroundQuadrants.length).toBeGreaterThan(20);
    expect(normalized.blockedQuadrants.length).toBeGreaterThan(100);
    expect(normalized.opacityQuadrants.length).toBeGreaterThan(10);
    expect(normalized.notes?.quadrantKeys).toContain("tl-a|tl-b");
    expect(normalized.notes?.canvasExpansion).toContain("Not included or changed");
  });
});
