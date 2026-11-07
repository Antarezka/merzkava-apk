import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const STRUCTURE=path.join(ROOT,"pxl/maps/tianhai-academy-map-structure.json");
const OUTPUT=path.join(ROOT,"pxl/maps/references");
const SCALE=4;
const SECTORS=["tl-a","tl-b","tr-a","tr-b","bl-a","bl-b","br-a","br-b"];
const EXPECTED={width:2816,height:1536,cols:24,rows:20,tileW:128,tileH:69.5,customCells:105};

function assert(condition,message){if(!condition)throw new Error(message);}
function key(x,y){return x+","+y;}
function centerOf(x,y,grid){
  return {
    x:(x-y)*grid.tileW/2+grid.rows*grid.tileW/2+grid.offsetX,
    y:(x+y)*grid.tileH/2+grid.offsetY+grid.tileH/2,
  };
}
function pointInPolygon(point,polygon){
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const [xi,yi]=polygon[i],[xj,yj]=polygon[j];
    if(((yi>point.y)!==(yj>point.y))&&point.x<(xj-xi)*(point.y-yi)/(yj-yi||1e-9)+xi)inside=!inside;
  }
  return inside;
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
    "br-a":[center,right,se],"br-b":[se,bottom,center],
  };
}
function crc32(buffer){
  let crc=0xffffffff;
  for(const byte of buffer){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
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
  for(let y=0;y<height;y++){const out=y*(rowBytes+1);raw[out]=0;pixels.copy(raw,out+1,y*rowBytes,(y+1)*rowBytes);}
  const header=Buffer.alloc(13);
  header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk("IHDR",header),pngChunk("IDAT",deflateSync(raw,{level:9})),pngChunk("IEND",Buffer.alloc(0))]);
}
function blendPixel(pixels,width,height,x,y,color){
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=width||y>=height)return;
  const offset=(y*width+x)*4,alpha=color[3]/255,oldAlpha=pixels[offset+3]/255,outAlpha=alpha+oldAlpha*(1-alpha);
  if(outAlpha<=0)return;
  for(let channel=0;channel<3;channel++)pixels[offset+channel]=Math.round((color[channel]*alpha+pixels[offset+channel]*oldAlpha*(1-alpha))/outAlpha);
  pixels[offset+3]=Math.round(outAlpha*255);
}
function line(pixels,width,height,a,b,color){
  let x0=Math.round(a.x),y0=Math.round(a.y),x1=Math.round(b.x),y1=Math.round(b.y);
  const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
  let error=dx+dy;
  for(;;){blendPixel(pixels,width,height,x0,y0,color);if(x0===x1&&y0===y1)break;const twice=2*error;if(twice>=dy){error+=dy;x0+=sx;}if(twice<=dx){error+=dx;y0+=sy;}}
}
function fillPolygon(pixels,width,height,points,color){
  const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p[1]))));
  const maxY=Math.min(height-1,Math.ceil(Math.max(...points.map(p=>p[1]))));
  for(let y=minY;y<=maxY;y++){
    const scanY=y+0.5,intersections=[];
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const [x1,y1]=points[j],[x2,y2]=points[i];
      if((y1>scanY)!==(y2>scanY))intersections.push(x1+(scanY-y1)*(x2-x1)/(y2-y1));
    }
    intersections.sort((a,b)=>a-b);
    for(let i=0;i+1<intersections.length;i+=2){
      const left=Math.max(0,Math.ceil(intersections[i])),right=Math.min(width-1,Math.floor(intersections[i+1]));
      for(let x=left;x<=right;x++)blendPixel(pixels,width,height,x,y,color);
    }
  }
}
function polyline(pixels,width,height,points,color,closed=true){
  for(let i=0;i<points.length-(closed?0:1);i++)line(pixels,width,height,points[i],points[(i+1)%points.length],color);
}
function marker(pixels,width,height,kind,point){
  const x=point.x/SCALE,y=point.y/SCALE;
  if(kind==="O"){
    for(let i=0;i<20;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;line(pixels,width,height,{x:x+Math.cos(a)*2.2,y:y+Math.sin(a)*2.2},{x:x+Math.cos(b)*2.2,y:y+Math.sin(b)*2.2},[70,202,255,245]);}
  }else if(kind==="X"){
    line(pixels,width,height,{x:x-1.8,y:y-1.8},{x:x+1.8,y:y+1.8},[255,102,105,255]);
    line(pixels,width,height,{x:x+1.8,y:y-1.8},{x:x-1.8,y:y+1.8},[255,102,105,255]);
  }else{
    for(let i=0;i<20;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10;line(pixels,width,height,{x:x+Math.cos(a)*2.3,y:y+Math.sin(a)*2.3},{x:x+Math.cos(b)*2.3,y:y+Math.sin(b)*2.3},[207,157,255,255]);}
    blendPixel(pixels,width,height,x,y,[207,157,255,255]);
  }
}
function boundsFit(center,grid,width,height){
  return center.x-grid.tileW/2>=0&&center.y-grid.tileH/2>=0&&center.x+grid.tileW/2<=width&&center.y+grid.tileH/2<=height;
}
function connectedComponents(cells){
  const remaining=new Set(cells),components=[];
  while(remaining.size){
    const first=remaining.values().next().value,queue=[first];remaining.delete(first);
    for(let i=0;i<queue.length;i++){
      const [x,y]=queue[i].split(",").map(Number);
      for(const next of [key(x+1,y),key(x-1,y),key(x,y+1),key(x,y-1)])if(remaining.has(next)){remaining.delete(next);queue.push(next);}
    }
    components.push(queue);
  }
  return components.sort((a,b)=>b.length-a.length);
}
function labelColor(category){
  const colors={
    "student-zone":[233,197,107,220],"dojo":[223,138,104,230],"spirit-training":[197,141,230,235],
    "arcanist-learning":[121,196,210,230],"instructor-quarters":[134,191,146,220],
    "path":[126,213,154,220],"courtyard":[211,198,154,210],"training-yard":[219,149,105,220],
    "gate":[241,216,140,240],"pond":[101,184,213,235],"building":[224,169,109,230],
    "dojo-building":[224,139,112,230],"spirit-training-ring":[203,154,233,245],
    "arcanist-yard":[131,200,213,230],"garden":[147,196,123,220],
    "tree-canopy":[168,207,121,235],"boundary":[217,139,115,240],"bridge":[212,186,135,235],
  };
  return colors[category]||[215,200,160,220];
}
function assertUnique(values,label){
  const set=new Set(values);
  assert(set.size===values.length,label+" contains duplicate identifiers.");
}
const structure=JSON.parse(await fs.readFile(STRUCTURE,"utf8"));
const {mapBase,grid,labels,customGridCells,actorStarts}=structure;
assert(structure.mapId==="pxl-studio:tianhai-academy:exterior","Academy must remain in its own Tianhai Yunzhou PXL sandbox map ID.");
assert(mapBase?.width===EXPECTED.width&&mapBase?.height===EXPECTED.height,"Academy Map Base must remain 2816×1536.");
assert(grid?.cols===EXPECTED.cols&&grid?.rows===EXPECTED.rows&&grid?.tileW===EXPECTED.tileW&&grid?.tileH===EXPECTED.tileH,"Academy isometric calibration changed without owner approval.");
assert(Array.isArray(customGridCells)&&customGridCells.length===EXPECTED.customCells,"Expected the original 105 custom extension cells.");
assert(Array.isArray(labels)&&labels.length>=60,"Full Academy lasso label map is incomplete.");
assertUnique(labels.map(label=>label.id),"Academy label IDs");
assert(Array.isArray(actorStarts)&&actorStarts.length===5,"Player and all four Academy NPC spawn points are required.");
for(const label of labels){
  assert(label.id&&label.name&&label.category&&Array.isArray(label.points)&&label.points.length>=3,"Invalid lasso label: "+(label.id||"unknown"));
  assert(label.points.every(point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)),"Invalid polygon coordinates: "+label.id);
}
const width=mapBase.width,height=mapBase.height,previewWidth=width/SCALE,previewHeight=height/SCALE;
assert(Number.isInteger(previewWidth)&&Number.isInteger(previewHeight),"Preview dimensions must be exact 1:4.");
const cells=new Set();
for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++)cells.add(key(x,y));
for(const coordinate of customGridCells){
  assert(/^-?\d+,-?\d+$/.test(coordinate),"Invalid custom cell coordinate: "+coordinate);
  cells.add(coordinate);
}
assert(cells.size===585,"The Academy map must include exactly 585 base and extension cells.");
const walkable=new Set();
const actors=new Set(actorStarts.map(actor=>key(actor.x,actor.y)));
const labelsByFlag={
  walkable:labels.filter(label=>label.walkable),
  blocked:labels.filter(label=>label.blocked),
  foreground:labels.filter(label=>label.foreground),
  opacity:labels.filter(label=>label.opacity),
};
const hasFlag=(point,flag)=>labelsByFlag[flag].some(label=>pointInPolygon(point,label.points));
for(const coordinate of cells){
  const [x,y]=coordinate.split(",").map(Number),center=centerOf(x,y,grid);
  if(hasFlag(center,"walkable")||actors.has(coordinate))walkable.add(coordinate);
}
walkable.delete("22,14"); // This isolated shoreline cell is scenery, not a playable route node.
const components=connectedComponents([...walkable]);
assert(components.length===1,"Walkable route graph is disconnected: "+components.map(component=>component.length).join(", "));
assert(actorStarts.every(actor=>walkable.has(key(actor.x,actor.y))),"A Player/NPC start cell is missing from the walkable graph.");
const markerSets={O:new Set(),X:new Set(),opacity:new Set()};
const mappedCells=[],quadPixels=Buffer.alloc(previewWidth*previewHeight*4);
const labelPixels=Buffer.alloc(previewWidth*previewHeight*4);
const totalAssigned={O:0,X:0,opacity:0};
const edgeCells=[];
const neutralEdges=new Set();
for(const coordinate of cells){
  const [x,y]=coordinate.split(",").map(Number),center=centerOf(x,y,grid);
  const fitsMapBase=boundsFit(center,grid,width,height);
  const triangles=sectorTriangles(center,grid);
  const masks={O:0,X:0,opacity:0};
  for(let index=0;index<SECTORS.length;index++){
    const sector=SECTORS[index],triangle=triangles[sector];
    const centroid={x:(triangle[0].x+triangle[1].x+triangle[2].x)/3,y:(triangle[0].y+triangle[1].y+triangle[2].y)/3};
    for(const flag of ["O","X","opacity"]){
      const labelFlag=flag==="O"?"foreground":flag==="X"?"blocked":"opacity";
      if(hasFlag(centroid,labelFlag)){masks[flag]|=1<<index;markerSets[flag].add(coordinate+":"+sector);totalAssigned[flag]++;marker(quadPixels,previewWidth,previewHeight,flag,centroid);}
    }
    const pixelTriangle=triangle.map(point=>({x:point.x/SCALE,y:point.y/SCALE}));
    for(let edge=0;edge<3;edge++){
      const a=pixelTriangle[edge],b=pixelTriangle[(edge+1)%3];
      const ka=a.x.toFixed(2)+","+a.y.toFixed(2),kb=b.x.toFixed(2)+","+b.y.toFixed(2);
      const edgeKey=ka<kb?ka+"|"+kb:kb+"|"+ka;
      if(!neutralEdges.has(edgeKey)){neutralEdges.add(edgeKey);line(quadPixels,previewWidth,previewHeight,a,b,[220,207,175,105]);}
    }
  }
  if(!fitsMapBase&&!customGridCells.includes(coordinate))edgeCells.push(coordinate);
  mappedCells.push({
    x,y,coordinate,centerPx:center,kind:customGridCells.includes(coordinate)?"custom-grid":"base-grid",
    fitsMapBase,walkable:walkable.has(coordinate),masks
  });
}
for(const label of labels){
  const color=labelColor(label.category);
  const points=label.points.map(([x,y])=>[x/SCALE,y/SCALE]);
  fillPolygon(labelPixels,previewWidth,previewHeight,points,[color[0],color[1],color[2],Math.round(color[3]*0.13)]);
  polyline(labelPixels,previewWidth,previewHeight,points,[color[0],color[1],color[2],Math.min(255,color[3])],true);
}
const totalQuadrants=mappedCells.length*SECTORS.length;
const coverage={
  baseCells:grid.cols*grid.rows,customCells:customGridCells.length,totalMappedCells:mappedCells.length,
  totalMappedQuadrants:totalQuadrants,walkableCells:walkable.size,
  connectedWalkableCells:components[0].length,labels:labels.length,
  markedQuadrants:{O:totalAssigned.O,X:totalAssigned.X,opacity:totalAssigned.opacity},
  neutralQuadrants:totalQuadrants-new Set([...markerSets.O,...markerSets.X,...markerSets.opacity]).size,
  edgeClippedCustomCells:edgeCells.sort(),
};
const quadrantMap={
  format:"merzkava-academy-quadrant-map",schemaVersion:2,mapId:structure.mapId,
  source:"pxl/maps/tianhai-academy-map-structure.json",mapBase:{width,height,scalePreview:"1:4"},
  grid:{...grid,sectorOrder:SECTORS},markerLegend:structure.markerLegend,
  coverage,cells:mappedCells,spatialLabels:labels
};
await fs.mkdir(OUTPUT,{recursive:true});
await fs.writeFile(path.join(OUTPUT,"academy-quadrant-map.json"),JSON.stringify(quadrantMap,null,2)+"\n");
await fs.writeFile(path.join(OUTPUT,"academy-quadrant-guide.png"),encodePng(previewWidth,previewHeight,quadPixels));
await fs.writeFile(path.join(OUTPUT,"academy-label-guide.png"),encodePng(previewWidth,previewHeight,labelPixels));
console.log("Academy mapping guide generated: "+coverage.totalMappedCells+" cells / "+totalQuadrants+" sectors / "+coverage.labels+" freeform labels.");
console.log("Walkable graph: "+coverage.connectedWalkableCells+" connected cells; O "+totalAssigned.O+", X "+totalAssigned.X+", opacity "+totalAssigned.opacity+".");
