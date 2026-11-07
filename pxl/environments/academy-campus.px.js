// Tianhai Academy — an original PXL 3D-look HD-2D campus environment.
// The editor-generated labels and full quadrant map are authoring-only guides; never bake them into runtime artwork.
// Merzkava remains authoritative for coordinates, grid, walkability, actor placement and minimap.
pal({
  k:"#211d24", K:"#403742", n:"#5a4a3e", N:"#786252",
  s:"#8b8479", S:"#b5aa98", p:"#d4c9b4", P:"#eee2ca",
  w:"#e2d7c3", W:"#fff1d8",
  b:"#263e55", B:"#416580", c:"#477e83", C:"#83b8ad",
  g:"#405b43", G:"#71885a", h:"#a7a979", H:"#d4d7a0",
  r:"#603941", R:"#965451", y:"#ad8247", Y:"#e4c37b",
  a:"#8d6f56", A:"#b59a73", v:"#8c7897", V:"#c3a4ca",
})
ramps("kKnN","sSpPW","bBcC","gGhH","rRyY","ayAY","vV","nyY")

// The approved map and the full cell/quadrant calibration are non-exported authoring guides.
genre("academy-reference", { mix: true })
sprite("_academy-quadrant-guide", {
  png: "../maps/references/academy-quadrant-guide.png",
  shrink: 1,
  pivot: "center",
  genre: "academy-reference",
})
sprite("_academy-pixel-source", {
  png: "../maps/references/academy-exterior-source.png",
  shrink: 4,
  palettize: true,
  pivot: "center",
  genre: "academy-reference",
})

const W = 704, H = 384
const CAM = perspective({ w: W, h: H, pitch: -44, fov: 34, ppm: 18 })
const Z = CAM.z
const CAMPUS = model()
// Build a simple depth-aware architectural box from the PXL model's native faces API.
// top is the horizontal cap material; side is used on the two camera-facing walls.
const block = (top, side, x0, z0, x1, z1, base, height) => {
  CAMPUS.face(top,
    [x0,z0,height],[x1,z0,height],[x1,z1,height],[x0,z1,height])
  CAMPUS.face(side,
    [x0,z1,base],[x1,z1,base],[x1,z1,height],[x0,z1,height])
  CAMPUS.face(side,
    [x1,z0,base],[x1,z1,base],[x1,z1,height],[x1,z0,height])
}
const ground = (mat, x1, z1, x2, z2, up = 0) =>
  CAMPUS.face(mat, [x1,z1,up], [x2,z1,up], [x2,z2,up], [x1,z2,up])

// Seamless PXL-authored surfaces. Each face is textured at the camera's screen scale.
sprite("_academy-grass", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) {
    const q=hash(x>>2,y>>2,17)
    c.px(x,y,q<0.18?"g":q<0.62?"G":q<0.84?"h":"H")
    if((x*7+y*11)%29===0)c.px(x,y,"g")
  }
})
sprite("_academy-stone", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) {
    const row=Math.floor(y/8), col=Math.floor((x+(row%2)*8)/16)
    const edge=y%8===0 || (x+(row%2)*8)%16===0
    c.px(x,y,edge?"n":hash(col,row,23)<0.25?"s":hash(x>>2,y>>2,29)<0.5?"S":"p")
  }
  c.hline(3,5,8,"W");c.hline(19,21,7,"W")
})
sprite("_academy-plaster", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) c.px(x,y,(y%16===0 || x%16===0)?"a":hash(x>>2,y>>2,31)<0.15?"P":hash(x>>1,y>>1,33)<0.5?"p":"S")
})
sprite("_academy-wood", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) c.px(x,y,x%8===0?"K":hash(x>>1,y>>2,37)<0.28?"n":hash(x>>2,y>>2,41)<0.5?"N":"a")
  c.vline(5,2,26,"A");c.vline(21,4,24,"A")
})
sprite("_academy-roof", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) {
    const seam=y%8===0 || (x+(Math.floor(y/8)%2)*8)%16===0
    c.px(x,y,seam?"k":hash(x>>2,y>>3,43)<0.25?"K":hash(x>>1,y>>2,47)<0.5?"b":"B")
  }
  c.hline(2,3,12,"C");c.hline(18,19,10,"C")
})
sprite("_academy-water", { w:32, h:32, wrap:true }, c => {
  for(let y=0;y<32;y++) for(let x=0;x<32;x++) c.px(x,y,hash(x>>2,y>>2,53)<0.5?"b":"B")
  c.hline(3,6,10,"C");c.hline(17,14,12,"C");c.hline(8,25,8,"c")
  c.px(7,5,"W");c.px(22,13,"W");c.px(14,24,"W")
})
sprite("_academy-brass", { w:16, h:16, wrap:true }, c => {
  c.rect(0,0,16,16,"y");c.rect(2,2,12,12,"Y");c.rect(5,5,6,6,"A");c.px(7,7,"W")
})

const MATS = {
  grass:   { tex:"_academy-grass", texel:CAM.floor.map(v=>v/1.3), block:1 },
  stone:   { tex:"_academy-stone", texel:CAM.floor, block:1 },
  plaster: { tex:"_academy-plaster", texel:CAM.wall, block:1 },
  wood:    { tex:"_academy-wood", texel:CAM.wall, block:1 },
  roof:    { tex:"_academy-roof", texel:CAM.wall, block:1 },
  water:   { tex:"_academy-water", texel:CAM.floor, block:1 },
  brass:   { tex:"_academy-brass", texel:CAM.wall, block:1 },
  dark:    { ramp:"kK" },
  trim:    { ramp:"nyY" },
  jade:    { ramp:"gGhH" },
}

// A raised timber hall with tiled double-slope roof, gold eaves, deep doors and window recesses.
function academyHall(x,z,w,d,wallH,rise,base=0) {
  const x1=x-w/2,x2=x+w/2,z1=z-d/2,z2=z+d/2
  block("stone","stone",x1-0.18,z1-0.18,x2+0.18,z2+0.18,base,base+0.34)
  block("stone","plaster",x1,z1,x2,z2,base+0.34,base+wallH)
  const front=z2+0.055
  for(let i=0;i<=4;i++) {
    const px=x1+(w*i/4)
    block("wood","wood",px-0.075,front,px+0.075,front+0.08,base+0.34,base+wallH)
  }
  block("dark","wood",x-0.48,front+0.01,x+0.48,front+0.12,base+0.34,base+1.65)
  block("brass","wood",x-0.53,front+0.03,x-0.43,front+0.13,base+0.42,base+1.68)
  for(const dx of [-w*0.28,w*0.28]) {
    block("dark","wood",x+dx-0.36,front+0.015,x+dx+0.36,front+0.11,base+1.0,base+1.72)
    block("brass","wood",x+dx-0.39,front+0.03,x+dx+0.39,front+0.13,base+1.02,base+1.1)
  }
  const eave=base+wallH, peak=eave+rise, ox=0.62, oz=0.58
  CAMPUS.face("roof",[x1-ox,z1-oz,eave],[x,z1-oz,peak],[x,z2+oz,peak],[x1-ox,z2+oz,eave])
  CAMPUS.face("roof",[x,z1-oz,peak],[x2+ox,z1-oz,eave],[x2+ox,z2+oz,eave],[x,z2+oz,peak])
  block("brass","wood",x1-ox,z2+oz-0.05,x2+ox,z2+oz+0.07,eave-0.08,eave+0.04)
  block("wood","wood",x-0.08,z1-oz-0.04,x+0.08,z2+oz+0.04,peak-0.04,peak+0.12)
  // Carved ridge finials; small enough to stay crisp when the map is viewed on a phone.
  block("brass","wood",x-0.13,z-0.12,x+0.13,z+0.12,peak+0.08,peak+0.42)
}

// The approved composition is calibrated against the complete Tianhai Map Base grid.
// All 3D geometry anchors pass through fractional isometric cell coordinates before CAM projection.
// The preview is exactly 1:4 of the 2816 × 1536 Map Base; these constants must match the owner reference.
const MAP_GRID = { cols:24, rows:20, tileW:128, tileH:69.5, offsetX:0, offsetY:0 }
const MAP_PREVIEW_SCALE = 4
function previewToGrid(sx,sy) {
  const imageX=sx*MAP_PREVIEW_SCALE, imageY=sy*MAP_PREVIEW_SCALE
  const dx=(imageX-(MAP_GRID.rows*MAP_GRID.tileW/2+MAP_GRID.offsetX))/(MAP_GRID.tileW/2)
  const dy=(imageY-(MAP_GRID.offsetY+MAP_GRID.tileH/2))/(MAP_GRID.tileH/2)
  return { x:(dx+dy)/2, y:(dy-dx)/2 }
}
function gridToPreview(cellX,cellY) {
  return {
    x:((cellX-cellY)*MAP_GRID.tileW/2+MAP_GRID.rows*MAP_GRID.tileW/2+MAP_GRID.offsetX)/MAP_PREVIEW_SCALE,
    y:((cellX+cellY)*MAP_GRID.tileH/2+MAP_GRID.offsetY+MAP_GRID.tileH/2)/MAP_PREVIEW_SCALE
  }
}
function atGrid(cellX,cellY) {
  const preview=gridToPreview(cellX,cellY)
  const point=CAM.at(preview.x,preview.y)
  if(!point) throw new Error("Academy grid anchor is above the perspective horizon: "+cellX+","+cellY)
  return point
}
// Compatibility adapter for the approved landmark anchors. Their coordinates are immediately
// converted into the owner-defined grid; no geometry is projected from an independent pixel grid.
function atScreen(sx,sy) {
  const cell=previewToGrid(sx,sy)
  return atGrid(cell.x,cell.y)
}
function groundScreen(mat,x1,y1,x2,y2,up=0) {
  const pts=[[x1,y1],[x2,y1],[x2,y2],[x1,y2]].map(([sx,sy])=>{
    const [x,z]=atScreen(sx,sy)
    return [x,z,up]
  })
  CAMPUS.face(mat,...pts)
}
function polygonScreen(mat,points,up=0) {
  const pts=points.map(([sx,sy])=>{
    const [x,z]=atScreen(sx,sy)
    return [x,z,up]
  })
  CAMPUS.face(mat,...pts)
}
function blockAtScreen(top,side,sx,sy,w,d,base,height) {
  const [x,z]=atScreen(sx,sy)
  block(top,side,x-w/2,z-d/2,x+w/2,z+d/2,base,height)
}
function hallAtScreen(sx,sy,w,d,wallH,rise,base=0) {
  const [x,z]=atScreen(sx,sy)
  academyHall(x,z,w,d,wallH,rise,base)
}
function bridgeAtScreen(sx,sy,width=3.6) {
  const [x,z]=atScreen(sx,sy)
  block("wood","wood",x-width/2,z-0.42,x+width/2,z+0.42,0.36,0.62)
  block("brass","wood",x-width/2,z-0.48,x+width/2,z-0.38,0.72,0.82)
  block("brass","wood",x-width/2,z+0.38,x+width/2,z+0.48,0.72,0.82)
  for(let i=0;i<=4;i++) {
    const px=x-width/2+i*width/4
    block("wood","wood",px-0.055,z-0.5,px+0.055,z-0.38,0.62,1.12)
    block("wood","wood",px-0.055,z+0.38,px+0.055,z+0.5,0.62,1.12)
  }
}

// Full campus footprint. The map remains a 2816×1536 Map Base (704×384 PXL preview).
// Landmark anchors follow the spatial-label IDs in pxl/maps/tianhai-academy-map-structure.json.
// The quadrant and label guides are build-only references; neither enters the final art.
ground("grass",-55,Z-55,55,Z+55,0)

// Natural lawn pockets keep the open areas visually varied without rigid tile blocks.
polygonScreen("grass",[[12,72],[54,48],[112,61],[142,102],[118,143],[64,151],[25,119]],0.025)
polygonScreen("grass",[[222,28],[275,14],[324,30],[345,64],[315,86],[260,76],[230,55]],0.025)
polygonScreen("grass",[[292,228],[324,210],[358,224],[359,257],[329,277],[298,258]],0.025)
polygonScreen("grass",[[623,168],[659,150],[687,172],[682,211],[650,229],[624,205]],0.025)
polygonScreen("grass",[[452,320],[487,300],[520,318],[515,351],[479,365],[450,344]],0.025)

// Organic stone paths: each segment follows the lassoed centerline and widens at junctions.
polygonScreen("stone",[[3,367],[14,347],[37,326],[57,333],[42,353],[18,380],[7,390]],0.075)
polygonScreen("stone",[[31,337],[50,315],[80,292],[103,302],[84,326],[57,350],[42,359]],0.075)
polygonScreen("stone",[[70,312],[92,286],[122,258],[149,239],[172,250],[151,272],[124,294],[96,320]],0.075)
polygonScreen("stone",[[140,269],[163,244],[192,219],[220,194],[245,202],[224,226],[197,250],[169,278]],0.075)
polygonScreen("stone",[[190,236],[214,211],[242,185],[270,160],[298,137],[322,111],[344,91],[362,101],[343,126],[320,151],[292,176],[264,201],[236,225],[210,251]],0.075)
polygonScreen("stone",[[305,158],[331,137],[359,132],[392,142],[420,155],[449,142],[480,120],[511,96],[542,75],[569,65],[591,82],[565,106],[536,131],[505,155],[475,179],[445,199],[416,207],[386,194],[354,180],[327,179]],0.075)
polygonScreen("stone",[[414,188],[439,202],[468,223],[497,243],[527,261],[559,277],[591,293],[579,317],[548,302],[516,284],[484,267],[454,246],[430,225],[409,205]],0.075)
polygonScreen("stone",[[450,151],[477,126],[507,105],[538,91],[566,88],[590,102],[575,122],[547,128],[520,140],[492,160],[471,179]],0.075)
polygonScreen("stone",[[423,230],[446,235],[473,247],[498,266],[524,282],[550,296],[569,307],[556,326],[529,314],[503,297],[478,281],[454,265],[431,251]],0.075)
polygonScreen("stone",[[93,205],[116,191],[142,184],[168,193],[188,212],[180,231],[156,224],[135,211],[111,222]],0.07)

// Open student courts are deliberately irregular and visually smaller than the campus landscape.
polygonScreen("stone",[[74,270],[109,245],[172,246],[221,276],[207,319],[146,340],[87,322]],0.055)
polygonScreen("stone",[[224,164],[276,139],[351,141],[406,174],[389,224],[321,247],[254,218]],0.055)
polygonScreen("stone",[[275,70],[330,53],[394,67],[431,104],[410,145],[350,158],[300,132]],0.065)
polygonScreen("stone",[[85,202],[116,180],[169,181],[201,216],[182,254],[129,267],[91,240]],0.06)
polygonScreen("stone",[[507,95],[553,73],[615,79],[651,114],[632,157],[575,173],[524,145]],0.06)
polygonScreen("stone",[[490,251],[534,232],[602,242],[646,282],[620,325],[551,337],[498,304]],0.06)

// Western and southeastern garden ponds, each with a natural bank instead of rectangular borders.
polygonScreen("water",[[35,181],[48,165],[72,165],[96,179],[110,198],[108,221],[91,238],[67,246],[45,233],[28,211]],0.018)
polygonScreen("water",[[373,292],[393,275],[423,273],[448,286],[465,305],[462,327],[445,344],[417,351],[389,338],[370,317]],0.018)
polygonScreen("water",[[250,250],[265,237],[286,239],[300,253],[295,271],[277,280],[257,270]],0.02)

// Soft stone edging: short separated pieces leave the waterline organic.
for(const [sx,sy] of [
  [38,185],[51,170],[74,168],[97,182],[109,202],[105,223],[88,239],[63,243],[41,228],
  [377,295],[398,278],[425,276],[450,290],[463,309],[458,329],[440,345],[415,349],[389,336],
  [253,251],[269,239],[289,254],[292,271],
]) blockAtScreen("stone","stone",sx,sy,0.25,0.25,0.02,0.15)

// Low bridges connect the gardens without blocking the organic route network.
bridgeAtScreen(105,210,2.8)
bridgeAtScreen(446,316,3.0)

// Small entrance gate at the southwest edge: about two isometric diamonds wide.
const [gateX,gateZ]=atScreen(16,365)
block("stone","stone",gateX-1.05,gateZ-0.26,gateX-0.76,gateZ+0.26,0.03,1.9)
block("stone","stone",gateX+0.76,gateZ-0.26,gateX+1.05,gateZ+0.26,0.03,1.9)
block("wood","wood",gateX-1.16,gateZ-0.34,gateX+1.16,gateZ+0.34,1.75,1.98)
CAMPUS.face("roof",
  [gateX-1.28,gateZ-0.38,2.0],[gateX,gateZ-0.52,2.38],
  [gateX+1.28,gateZ-0.38,2.0],[gateX,gateZ-0.20,2.38])
block("brass","wood",gateX-0.08,gateZ-0.5,gateX+0.08,gateZ-0.38,2.32,2.55)

// Teacher and instructor quarters: several small pavilions dispersed through a garden.
hallAtScreen(93,133,2.25,1.55,1.18,0.66)
hallAtScreen(151,158,2.05,1.45,1.08,0.58)
hallAtScreen(184,132,1.85,1.25,0.98,0.55)
hallAtScreen(113,177,1.55,1.1,0.88,0.48)

// Western dojo cluster and its open training yard.
hallAtScreen(130,211,2.55,1.7,1.35,0.75)
hallAtScreen(184,241,1.95,1.35,1.05,0.58)
blockAtScreen("wood","wood",145,242,2.1,1.25,0.08,0.34)
blockAtScreen("brass","wood",145,238,2.0,0.12,0.35,0.42)
for(const [sx,sy] of [[112,246],[129,252],[161,254],[179,229]]) {
  blockAtScreen("wood","wood",sx,sy,0.16,0.16,0.06,0.72)
}

// Outer student zone: low residences and study huts separated by broad lawns.
hallAtScreen(83,296,1.95,1.35,1.0,0.54)
hallAtScreen(137,315,2.2,1.45,1.12,0.62)
hallAtScreen(216,315,2.05,1.4,1.05,0.57)
hallAtScreen(246,284,1.8,1.25,0.92,0.48)
hallAtScreen(67,326,1.45,1.0,0.78,0.42)

// Inner student zone: modest lecture halls around a spacious landscaped court.
hallAtScreen(265,181,2.0,1.38,1.1,0.6)
hallAtScreen(412,183,2.2,1.5,1.18,0.66)
hallAtScreen(366,220,1.8,1.22,0.9,0.5)
hallAtScreen(300,225,1.55,1.1,0.84,0.46)

// Core student zone: the central academy hall is important, but not oversized.
hallAtScreen(368,101,3.0,2.0,1.72,0.96)
hallAtScreen(293,117,2.05,1.42,1.12,0.62)
hallAtScreen(442,123,1.95,1.34,1.02,0.55)
hallAtScreen(397,151,1.65,1.12,0.88,0.48)

// Small steps and a pair of open terraces, not one oversized central slab.
for(let i=0;i<4;i++) {
  const inset=i*3.4,y=129-i*3.1,up=0.06+i*0.075
  groundScreen("stone",348-inset,y,389+inset,y+3.3,up)
}
groundScreen("stone",274,147,312,170,0.08)
groundScreen("stone",417,150,449,170,0.08)

// Advanced Spirit Realm grounds: a protected ring, light perimeter stones and instructor pavilion.
hallAtScreen(590,101,2.15,1.48,1.15,0.62)
hallAtScreen(642,151,1.65,1.15,0.88,0.48)
hallAtScreen(516,91,1.7,1.18,0.92,0.50)
polygonScreen("trim",[[557,102],[579,89],[607,91],[629,108],[630,134],[609,153],[581,151],[558,133]],0.09)
polygonScreen("stone",[[567,106],[582,98],[605,99],[620,112],[620,130],[605,143],[582,141],[568,128]],0.105)
for(const [sx,sy] of [[574,106],[616,106],[616,136],[574,136]])blockAtScreen("wood","wood",sx,sy,0.12,0.12,0.1,0.82)
blockAtScreen("brass","wood",594,121,0.25,0.25,0.11,0.6)

// Academy-level Arcanist learning and small workshops; the separate Tianhai Institute is not depicted here.
hallAtScreen(523,273,2.25,1.55,1.2,0.66)
hallAtScreen(610,284,2.1,1.45,1.08,0.6)
hallAtScreen(555,321,1.75,1.2,0.92,0.5)
hallAtScreen(649,248,1.5,1.08,0.82,0.44)
groundScreen("stone",533,294,567,313,0.08)
blockAtScreen("brass","wood",550,303,0.25,0.25,0.09,0.82)
blockAtScreen("brass","wood",574,304,0.25,0.25,0.09,0.82)
blockAtScreen("wood","wood",594,306,0.6,0.45,0.08,0.32)

// Low walls define selected compounds while leaving every main route connected.
for(const [sx,sy,w,d] of [
  [49,84,2.0,0.12],[91,72,1.8,0.12],[190,87,1.6,0.12],
  [252,46,2.0,0.12],[324,34,1.8,0.12],[433,57,1.7,0.12],
  [667,79,0.12,1.8],[683,185,0.12,1.9],[38,249,0.12,1.8],
]) blockAtScreen("stone","stone",sx,sy,w,d,0.04,0.34)

// Reusable compact garden sprites. The campus scale is carried by landscape, not giant trees.
sprite("_academy-cherry",{w:48,h:72,pivot:"bottom",height:1.35},c=>{
  c.ellipse(24,70,12,3,"k");c.vline(23,43,27,"n");c.vline(25,47,23,"N")
  for(const [x,y,r] of [[15,29,12],[29,24,13],[20,15,10],[36,37,9],[9,41,8]]){c.circ(x,y,r,"r");c.circ(x-2,y-3,Math.max(2,r-4),"R");c.px(x+2,y-4,"W")}
  for(const [x,y] of [[12,19],[29,12],[36,32],[8,38],[24,28]])c.px(x,y,"P")
})
sprite("_academy-pine",{w:44,h:72,pivot:"bottom",height:1.45},c=>{
  c.vline(21,41,29,"n");c.vline(23,45,25,"N")
  for(let t=0;t<4;t++){const y=12+t*11,r=17-t*2;c.px(22,y-8,"H");c.circ(22,y,r,"g");c.circ(19,y-3,Math.max(3,r-5),"G");c.hline(22-r+3,y+2,r*2-6,t%2?"G":"h")}
  c.px(13,31,"H");c.px(31,42,"H")
})
sprite("_academy-shrub",{w:32,h:24,pivot:"bottom",height:0.48},c=>{
  c.ellipse(16,21,14,3,"k");c.circ(10,13,8,"g");c.circ(20,11,8,"G");c.circ(25,15,6,"g");c.px(9,9,"H");c.px(19,7,"H")
})
sprite("_academy-lantern",{w:20,h:42,pivot:"bottom",height:0.92},c=>{
  c.ellipse(10,41,6,1,"k");c.vline(9,5,34,"n");c.vline(11,5,34,"N");c.rect(4,12,12,17,"k");c.rect(5,13,10,15,"r");c.rect(7,15,6,11,"Y");c.hline(3,11,14,"y");c.hline(4,30,12,"y");c.px(10,17,"W")
})
sprite("_academy-stone-lantern",{w:24,h:38,pivot:"bottom",height:0.82},c=>{
  c.rect(4,29,16,6,"s");c.rect(6,19,12,11,"S");c.rect(3,16,18,4,"n");c.rect(5,8,14,8,"s");c.rect(2,6,20,3,"S");c.px(12,11,"Y");c.rect(2,34,20,4,"s");c.hline(4,33,16,"S")
})

const treePlaces=[
  [34,130],[56,256],[82,92],[108,157],[172,105],[205,129],[229,329],[273,306],
  [286,49],[327,286],[349,260],[456,237],[477,202],[496,67],[526,189],[650,193],
  [672,248],[462,68],[604,340],[646,324],[37,291],[188,291],[245,171],[417,241],
]
const sprites=treePlaces.map(([sx,sy],i)=>{
  const [x,z]=atScreen(sx,sy)
  return {name:i%4===0?"_academy-cherry":"_academy-pine",at:[x,z],seed:41+i,shadow:0.34}
})
const shrubPlaces=[[70,184],[95,170],[177,179],[214,190],[248,244],[301,275],[389,252],[455,289],[493,226],[624,220],[655,303],[256,83],[330,55],[436,77]]
for(const [sx,sy] of shrubPlaces){const [x,z]=atScreen(sx,sy);sprites.push({name:"_academy-shrub",at:[x,z],shadow:0.12})}
const lanternPlaces=[[58,318],[141,278],[227,234],[304,190],[392,177],[468,182],[545,234],[608,247],[570,325],[349,135]]
for(const [sx,sy] of lanternPlaces){const [x,z]=atScreen(sx,sy);sprites.push({name:"_academy-lantern",at:[x,z],light:{r:1.2,strength:0.22},shadow:0.08})}
const stoneLanternPlaces=[[104,247],[198,185],[286,155],[431,206],[500,169],[633,169]]
for(const [sx,sy] of stoneLanternPlaces){const [x,z]=atScreen(sx,sy);sprites.push({name:"_academy-stone-lantern",at:[x,z],shadow:0.14})}

const LIGHT = {
  light:[-0.72,0.42,0.55],
  sun:{color:"#ffe0b2",strength:1.12},
  sky:{color:"#9ab2c9",strength:0.65},
  shadows:true,
  lamps:[
    {at:[lanternOne[0],lanternOne[1],1.25],color:"#ffbf78",r:2.6,strength:0.8},
    {at:[lanternTwo[0],lanternTwo[1],1.25],color:"#ffbf78",r:2.6,strength:0.8},
  ],
}

scene("academy-exterior-render", {
  w:W,h:H,bg:"K",
  sizes:{"academy-exterior":4},
  check:{every:1},
},
  // Both guides are authoring-only and are excluded from the exported runtime PNG.
  layer("approved-layout-reference",{ref:0.12},stamp("_academy-pixel-source",352,192)),
  layer("quadrant-layout-reference",{ref:0.48},stamp("_academy-quadrant-guide",352,192)),
  (c)=>c.mesh(CAM,CAMPUS.faces,MATS,{sprites,...LIGHT}),
  post({bloom:{levels:3,strength:0.18,above:0.95},vignette:0.06}),
)
