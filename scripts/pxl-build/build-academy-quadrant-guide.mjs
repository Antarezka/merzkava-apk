import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const REFERENCE=path.join(ROOT,"src/offline-game/tianhai-academy-map-reference.ts");
const OUTPUT=path.join(ROOT,"pxl/maps/references");
const WIDTH=704,HEIGHT=384,SCALE=4;
const SECTORS=["tl-a","tl-b","tr-a","tr-b","bl-a","bl-b","br-a","br-b"];

function requiredMatch(source,regex,label){
  const match=source.match(regex);
  if(!match)throw new Error("Academy quadrant guide could not read "+label+" from "+path.relative(ROOT,REFERENCE));
  return match[1];
}
function readNumber(source,name){
  return Number(requiredMatch(source,new RegExp("\\b"+name+"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)"),name));
}
function readKeys(source,name){
  const raw=requiredMatch(source,new RegExp("\\b"+name+"\\s*:\\s*keys\\(\\s*\`([\\s\\S]*?)\`\\s*\\)"),name);
  return raw.trim().split(/\s+/).filter(Boolean);
}
function coordinateKey(x,y){return x+","+y;}
function parseCoordinate(token,label){
  const match=/^(-?\d+),(-?\d+)$/.exec(token);
  if(!match)throw new Error("Invalid "+label+" entry: "+token);
  return {x:Number(match[1]),y:Number(match[2])};
}
function readQuadrantKeys(source,name){
  const values=new Set();
  for(const token of readKeys(source,name)){
    const match=/^(-?\d+),(-?\d+):(tl|tr|bl|br)(?:-([ab]))?$/.exec(token);
    if(!match)throw new Error("Invalid "+name+" quadrant key: "+token);
    const x=Number(match[1]),y=Number(match[2]),parent=match[3],half=match[4];
    for(const sector of (half?[parent+"-"+half]:[parent+"-a",parent+"-b"]))values.add(coordinateKey(x,y)+":"+sector);
  }
  return values;
}
function maskFor(values,x,y){
  let mask=0;
  for(let i=0;i<SECTORS.length;i++)if(values.has(coordinateKey(x,y)+":"+SECTORS[i]))mask|=(1<<i);
  return mask;
}
function centerOf(x,y,grid){
  return {
    x:(x-y)*grid.tileW/2+grid.rows*grid.tileW/2+grid.offsetX,
    y:(x+y)*grid.tileH/2+grid.offsetY+grid.tileH/2
  };
}
function insideImage(center,grid,width,height){
  return center.x-grid.tileW/2>=-0.001&&center.y-grid.tileH/2>=-0.001&&
    center.x+grid.tileW/2<=width+0.001&&center.y+grid.tileH/2<=height+0.001;
}
function sectorTriangles(center,grid){
  const top={x:center.x,y:center.y-grid.tileH/2};
  const right={x:center.x+grid.tileW/2,y:center.y};
  const bottom={x:center.x,y:center.y+grid.tileH/2};
  const left={x:center.x-grid.tileW/2,y:center.y};
  const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const nw=midpoint(top,left),ne=midpoint(top,right),sw=midpoint(left,bottom),se=midpoint(right,bottom);
  return {
    "tl-a":[top,center,nw],"tl-b":[center,left,nw],
    "tr-a":[top,ne,center],"tr-b":[ne,right,center],
    "bl-a":[left,center,sw],"bl-b":[sw,bottom,center],
    "br-a":[center,right,se],"br-b":[se,bottom,center]
  };
}

// Minimal self-contained RGBA/PNG writer; no canvas package or network dependency is needed in CI.
function crc32(buffer){
  let crc=0xffffffff;
  for(const byte of buffer){
    crc^=byte;
    for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
function pngChunk(type,data){
  const name=Buffer.from(type,"ascii"),length=Buffer.alloc(4),checksum=Buffer.alloc(4);
  length.writeUInt32BE(data.length,0);
  checksum.writeUInt32BE(crc32(Buffer.concat([name,data])),0);
  return Buffer.concat([length,name,data,checksum]);
}
function encodePng(width,height,pixels){
  const rowBytes=width*4,raw=Buffer.alloc((rowBytes+1)*height);
  for(let y=0;y<height;y++){
    const out=y*(rowBytes+1);raw[out]=0;
    pixels.copy(raw,out+1,y*rowBytes,(y+1)*rowBytes);
  }
  const header=Buffer.alloc(13);
  header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);
  header[8]=8;header[9]=6;header[10]=0;header[11]=0;header[12]=0;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk("IHDR",header),pngChunk("IDAT",deflateSync(raw,{level:9})),pngChunk("IEND",Buffer.alloc(0))
  ]);
}
const pixels=Buffer.alloc(WIDTH*HEIGHT*4);
function blendPixel(x,y,color){
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=WIDTH||y>=HEIGHT)return;
  const offset=(y*WIDTH+x)*4,alpha=color[3]/255,oldAlpha=pixels[offset+3]/255,outAlpha=alpha+oldAlpha*(1-alpha);
  if(outAlpha<=0)return;
  for(let c=0;c<3;c++)pixels[offset+c]=Math.round((color[c]*alpha+pixels[offset+c]*oldAlpha*(1-alpha))/outAlpha);
  pixels[offset+3]=Math.round(outAlpha*255);
}
function line(a,b,color){
  let x0=Math.round(a.x/SCALE),y0=Math.round(a.y/SCALE),x1=Math.round(b.x/SCALE),y1=Math.round(b.y/SCALE);
  const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
  let error=dx+dy;
  for(;;){
    blendPixel(x0,y0,color);
    if(x0===x1&&y0===y1)break;
    const twice=2*error;
    if(twice>=dy){error+=dy;x0+=sx;}
    if(twice<=dx){error+=dx;y0+=sy;}
  }
}
function circle(cx,cy,radius,color){
  let previous=null;
  for(let step=0;step<=24;step++){
    const angle=step*Math.PI*2/24;
    const current={x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius};
    if(previous)line(previous,current,color);
    previous=current;
  }
}
function marker(kind,x,y){
  const px=x/SCALE,py=y/SCALE;
  if(kind==="O"){
    circle(px*SCALE,py*SCALE,1.8*SCALE,[70,202,255,245]);
  }else if(kind==="X"){
    line({x:(px-1.7)*SCALE,y:(py-1.7)*SCALE},{x:(px+1.7)*SCALE,y:(py+1.7)*SCALE},[255,102,105,255]);
    line({x:(px+1.7)*SCALE,y:(py-1.7)*SCALE},{x:(px-1.7)*SCALE,y:(py+1.7)*SCALE},[255,102,105,255]);
  }else{
    circle(px*SCALE,py*SCALE,2.1*SCALE,[207,157,255,255]);
    circle(px*SCALE+1.1*SCALE,py*SCALE,0.65*SCALE,[207,157,255,255]);
  }
}

const source=await fs.readFile(REFERENCE,"utf8");
const grid={
  cols:readNumber(source,"cols"),rows:readNumber(source,"rows"),
  tileW:readNumber(source,"tileW"),tileH:readNumber(source,"tileH"),
  offsetX:readNumber(source,"offsetX"),offsetY:readNumber(source,"offsetY")
};
const width=Number(requiredMatch(source,/mapBase\s*:\s*\{[^}]*width\s*:\s*(\d+)/,"Map Base width"));
const height=Number(requiredMatch(source,/mapBase\s*:\s*\{[^}]*height\s*:\s*(\d+)/,"Map Base height"));
if(width!==2816||height!==1536||grid.cols!==24||grid.rows!==20||grid.tileW!==128||grid.tileH!==69.5){
  throw new Error("Academy map calibration changed. Update the documented PXL scale contract before building.");
}
const custom=new Set(readKeys(source,"customGridCells"));
const walkable=new Set(readKeys(source,"walkableCells"));
const marks={
  O:readQuadrantKeys(source,"foregroundQuadrants"),
  X:readQuadrantKeys(source,"blockedQuadrants"),
  opacity:readQuadrantKeys(source,"opacityQuadrants")
};
const coordinates=new Map();
const addCell=(token,kind)=>{
  const {x,y}=typeof token==="string"?parseCoordinate(token,kind):token;
  const key=coordinateKey(x,y);
  if(!coordinates.has(key))coordinates.set(key,{x,y,kind});
  else if(kind==="custom-grid")coordinates.get(key).kind="custom-grid";
};
for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++)addCell({x,y},"base-grid");
for(const key of custom)addCell(key,"custom-grid");
for(const key of walkable)addCell(key,custom.has(key)?"custom-grid":"reference-only");
for(const values of Object.values(marks)){
  for(const key of values){
    const coordinate=key.split(":")[0];
    addCell(coordinate,custom.has(coordinate)?"custom-grid":"reference-only");
  }
}
const records=[...coordinates.values()].sort((a,b)=>a.y-b.y||a.x-b.x);
const edgeCells=[],assigned={O:0,X:0,opacity:0},markedSectors=new Set();
const pixelsEdges=new Set();
for(const record of records){
  const {x,y,kind}=record,center=centerOf(x,y,grid),inside=insideImage(center,grid,width,height);
  const foregroundMask=maskFor(marks.O,x,y),blockedMask=maskFor(marks.X,x,y),opacityMask=maskFor(marks.opacity,x,y);
  const masks={O:foregroundMask,X:blockedMask,opacity:opacityMask};
  for(const [name,mask] of Object.entries(masks)){
    for(let i=0;i<SECTORS.length;i++)if(mask&(1<<i)){
      assigned[name]++;
      markedSectors.add(coordinateKey(x,y)+":"+SECTORS[i]);
    }
  }
  if(kind==="custom-grid"&&!inside)edgeCells.push(coordinateKey(x,y));
  record.centerPx={x:center.x,y:center.y};
  record.kind=kind;
  record.walkable=walkable.has(coordinateKey(x,y));
  record.fitsMapBase=inside;
  record.masks=masks;
  const triangles=sectorTriangles(center,grid);
  const color=kind==="custom-grid"?[232,190,122,115]:kind==="reference-only"?[255,160,116,125]:[190,220,232,86];
  for(const triangle of Object.values(triangles)){
    for(let edge=0;edge<3;edge++){
      const a=triangle[edge],b=triangle[(edge+1)%3];
      const ax=Math.round(a.x*100)/100,ay=Math.round(a.y*100)/100,bx=Math.round(b.x*100)/100,by=Math.round(b.y*100)/100;
      const ka=ax+","+ay,kb=bx+","+by,key=ka<kb?ka+"|"+kb:kb+"|"+ka;
      if(!pixelsEdges.has(key)){pixelsEdges.add(key);line(a,b,color);}
    }
  }
  for(let sectorIndex=0;sectorIndex<SECTORS.length;sectorIndex++){
    const sector=SECTORS[sectorIndex],flags=[];
    if(foregroundMask&(1<<sectorIndex))flags.push("O");
    if(blockedMask&(1<<sectorIndex))flags.push("X");
    if(opacityMask&(1<<sectorIndex))flags.push("opacity");
    if(!flags.length)continue;
    const triangle=triangles[sector],point={
      x:(triangle[0].x+triangle[1].x+triangle[2].x)/3,
      y:(triangle[0].y+triangle[1].y+triangle[2].y)/3
    };
    const offsets=flags.length===1?[0]:flags.length===2?[-2.2,2.2]:[-3.1,0,3.1];
    flags.forEach((name,index)=>marker(name,point.x+offsets[index]*SCALE,point.y));
  }
}
const baseCellCount=grid.cols*grid.rows;
if(records.filter(record=>record.kind==="base-grid").length!==baseCellCount)throw new Error("Academy base grid coverage is incomplete.");
if(records.filter(record=>record.kind==="reference-only").length)throw new Error("A walkability/marker key refers to a cell absent from both the base and custom grid.");
const totalQuadrants=records.length*SECTORS.length;
const json={
  format:"merzkava-academy-quadrant-map",schemaVersion:1,
  mapId:"golden-dragon-empire:tianhai-academy:exterior",
  source:"src/offline-game/tianhai-academy-map-reference.ts",
  mapBase:{width,height,scalePreview:"1:4"},
  grid:{...grid,sectorOrder:SECTORS},
  markerLegend:{O:"Foreground: redraw this Map Base sector above Player/NPC",X:"Blocked: movement-sector/half-edge restriction",opacity:"Character opacity where the actor is behind this sector"},
  coverage:{
    baseCells:baseCellCount,baseQuadrants:baseCellCount*SECTORS.length,
    customCells:custom.size,totalMappedCells:records.length,totalMappedQuadrants:totalQuadrants,
    walkableCells:records.filter(record=>record.walkable).length,
    markedQuadrants:assigned,neutralQuadrants:totalQuadrants-markedSectors.size,
    edgeClippedCustomCells:edgeCells.sort()
  },
  cells:records.map(({x,y,kind,centerPx,walkable,fitsMapBase,masks})=>({x,y,kind,centerPx,walkable,fitsMapBase,masks}))
};
await fs.mkdir(OUTPUT,{recursive:true});
await fs.writeFile(path.join(OUTPUT,"academy-quadrant-map.json"),JSON.stringify(json,null,2)+"\n");
await fs.writeFile(path.join(OUTPUT,"academy-quadrant-guide.png"),encodePng(WIDTH,HEIGHT,pixels));
console.log("Academy quadrant reference generated: "+records.length+" cells / "+totalQuadrants+" sectors.");
console.log("Assigned marks: O "+assigned.O+", X "+assigned.X+", opacity "+assigned.opacity+"; edge-clipped custom cells: "+edgeCells.sort().join(", ")+".");
