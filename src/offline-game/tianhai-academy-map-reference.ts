import type { IsoMapEditorData, IsoMapPoint, IsoMapGridConfig, IsoQuadrant } from "./isometric-map-editor";
import { TIANHAI_ACADEMY_PXL_LABELS } from "./tianhai-academy-map-labels";

const MAP_ID="pxl-studio:tianhai-academy:exterior";
const GRID:IsoMapGridConfig={cols:24,rows:20,tileW:128,tileH:69.5,offsetX:0,offsetY:0,playerScale:1,npcScale:1};
const CUSTOM_GRID_CELLS=`11,21 11,30 1,20 11,29 11,28 11,27 11,26 11,25 11,24 11,23 11,22 12,25 13,25 14,25 14,26 14,27 14,28 13,28 12,27 13,26 12,26 13,27 12,28 12,29 12,30 10,27 9,27 8,27 8,28 9,28 10,28 10,29 10,30 8,26 8,25 9,25 10,25 10,26 9,26 11,31 12,31 10,22 9,22 8,22 7,21 7,22 7,20 8,20 8,21 9,20 9,21 10,21 10,20 11,20 12,20 12,21 12,22 13,22 13,21 13,20 24,8 26,9 26,8 25,8 27,8 27,9 28,9 28,8 28,7 29,9 29,8 28,10 28,11 27,11 28,12 28,13 27,13 27,12 24,10 24,11 24,12 24,13 24,14 24,15 24,16 24,17 24,18 21,20 20,20 20,21 19,21 19,20 18,20 17,20 7,27 7,26 7,25 10,23 10,24 9,23 14,-1 14,-2 14,-3 14,-4 14,-5`.trim().split(/\s+/);
const SECTORS:IsoQuadrant[]=["tl-a","tl-b","tr-a","tr-b","bl-a","bl-b","br-a","br-b"];
const key=(x:number,y:number)=>x+","+y;

function centerOf(x:number,y:number):IsoMapPoint {
  return {
    x:(x-y)*GRID.tileW/2+GRID.rows*GRID.tileW/2+GRID.offsetX,
    y:(x+y)*GRID.tileH/2+GRID.offsetY+GRID.tileH/2,
  };
}
function pointInPolygon(point:IsoMapPoint,polygon:Array<[number,number]>):boolean {
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const [xi,yi]=polygon[i],[xj,yj]=polygon[j];
    const crosses=((yi>point.y)!==(yj>point.y))&&
      point.x<(xj-xi)*(point.y-yi)/(yj-yi||1e-9)+xi;
    if(crosses)inside=!inside;
  }
  return inside;
}
function sectorCenters(x:number,y:number):Record<IsoQuadrant,IsoMapPoint> {
  const c=centerOf(x,y),hw=GRID.tileW/2,hh=GRID.tileH/2;
  const t={x:c.x,y:c.y-hh},r={x:c.x+hw,y:c.y},b={x:c.x,y:c.y+hh},l={x:c.x-hw,y:c.y};
  const midpoint=(a:IsoMapPoint,b:IsoMapPoint)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const nw=midpoint(t,l),ne=midpoint(t,r),sw=midpoint(l,b),se=midpoint(r,b);
  const centroid=(a:IsoMapPoint,b:IsoMapPoint,d:IsoMapPoint)=>({x:(a.x+b.x+d.x)/3,y:(a.y+b.y+d.y)/3});
  return {
    "tl-a":centroid(t,c,nw),"tl-b":centroid(c,l,nw),
    "tr-a":centroid(t,ne,c),"tr-b":centroid(ne,r,c),
    "bl-a":centroid(l,c,sw),"bl-b":centroid(sw,b,c),
    "br-a":centroid(c,r,se),"br-b":centroid(se,b,c),
  };
}
const allCells=new Set<string>();
for(let y=0;y<GRID.rows;y++)for(let x=0;x<GRID.cols;x++)allCells.add(key(x,y));
for(const coordinate of CUSTOM_GRID_CELLS)allCells.add(coordinate);
const labels=TIANHAI_ACADEMY_PXL_LABELS;
const has=(point:IsoMapPoint,flag:"walkable"|"blocked"|"foreground"|"opacity")=>
  labels.some(label=>label[flag]===true&&pointInPolygon(point,label.points));
const walkableCells=[...allCells].filter(coordinate=>{
  const [x,y]=coordinate.split(",").map(Number);
  return (has(centerOf(x,y),"walkable")&&coordinate!=="22,14")||["12,31","7,4","10,9","6,15","22,10"].includes(coordinate);
}).sort((a,b)=>{
  const [ax,ay]=a.split(",").map(Number),[bx,by]=b.split(",").map(Number);
  return ay-by||ax-bx;
});
const flagged=(flag:"blocked"|"foreground"|"opacity")=>{
  const result:string[]=[];
  for(const coordinate of allCells){
    const [x,y]=coordinate.split(",").map(Number);
    const points=sectorCenters(x,y);
    for(const sector of SECTORS)if(has(points[sector],flag))result.push(coordinate+":"+sector);
  }
  return result;
};

export const TIANHAI_ACADEMY_MAP_REFERENCE:IsoMapEditorData={
  format:"merzkava-isometric-map-editor",
  version:1,
  purpose:"AI_UPDATE_REFERENCE",
  mapId:MAP_ID,
  mapTitle:"Tianhai Academy · PXL Sandbox",
  mapBase:{src:"/assets/augusto-pxl/placeholders/academy-map-pending.svg",width:2816,height:1536},
  confirmed:false,
  confirmedAt:"",
  grid:GRID,
  cameraCenter:{x:1408,y:768},
  foregroundCells:[],
  blockedCells:[],
  opacityCells:[],
  walkableCells,
  customGridCells:CUSTOM_GRID_CELLS,
  walkableCellGroups:[],
  walkableAreaEnabled:true,
  foregroundQuadrants:flagged("foreground"),
  blockedQuadrants:flagged("blocked"),
  opacityQuadrants:flagged("opacity"),
  transitions:[],
  notes:{
    cellSectorOrder:["tl-a","tl-b","tr-a","tr-b","bl-a","bl-b","br-a","br-b"],
    quadrantKeys:"x,y:tl-a|tl-b|tr-a|tr-b|bl-a|bl-b|br-a|br-b",
    transitionColors:"Sandbox map has no live world exit until its route is explicitly authored.",
    walkableCellGroups:"Walkability is generated from the labelled path and courtyard polygons; markers remain independent.",
    customGridCells:"The 105 original extension diamonds are retained as sparse coordinates; no intervening cell or blank canvas is inferred.",
    cellPlacement:"All base and custom coordinates are image-space anchored to the 2816×1536 Map Base.",
    canvasExpansion:"The existing Canvas Editor owns all four margins and retains the legacy automatic gap calculation; it is exported separately.",
  },
};
