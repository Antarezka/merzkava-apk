// Tianhai Academy — an original PXL 3D-look HD-2D campus environment.
// The old approved map is a faint editor-only composition guide. It is not baked into the export.
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

// The approved map is a faint editor-only layout guide, never baked into the runtime scene.
genre("academy-reference", { mix: true })
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

// Place the 3D scene by screen-space anchors taken from the approved campus composition.
// CAM.at() converts those exact preview pixels back to the ground plane, preserving the old landmark layout.
function atScreen(sx,sy) {
  const point=CAM.at(sx,sy)
  if(!point) throw new Error("Academy layout anchor is above the perspective horizon: "+sx+","+sy)
  return point
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

// The full ground plane extends beyond all four screen edges so the exported map has no blank border.
ground("grass",-55,Z-55,55,Z+55,0)

// Courtyard, the main east/west walkways and the southern approach.
// The center stays open for the existing player/NPC grid and touch targets.
groundScreen("stone",158,91,548,252,0.06)
groundScreen("stone",325,235,387,305,0.07)
groundScreen("stone",112,181,205,226,0.055)
groundScreen("stone",505,177,578,254,0.055)
groundScreen("stone",112,252,184,322,0.065)
groundScreen("stone",520,207,687,294,0.075)

// Small ceremonial medallion, kept clear of actor spawn and navigation lanes.
const medallion=Array.from({length:32},(_,i)=>{
  const a=2*Math.PI*i/32
  const [x,z]=atScreen(353+Math.cos(a)*19,173+Math.sin(a)*18)
  return [x,z,0.105]
})
CAMPUS.face("trim",...medallion)
const innerMedallion=Array.from({length:24},(_,i)=>{
  const a=2*Math.PI*i/24
  const [x,z]=atScreen(353+Math.cos(a)*9,173+Math.sin(a)*8)
  return [x,z,0.112]
})
CAMPUS.face("stone",...innerMedallion)

// Three rear study halls and the layered central academy hall.
hallAtScreen(104,78,5.9,3.9,2.05,1.18)
hallAtScreen(352,70,7.5,4.2,2.5,1.55)
hallAtScreen(604,82,5.8,3.8,2.05,1.18)
hallAtScreen(352,63,4.4,2.6,1.05,0.88,3.25)

// Side wings, lecture pavilions and the small waterside pavilion.
hallAtScreen(194,205,4.9,3.1,1.8,0.98)
hallAtScreen(533,190,5.2,3.25,1.85,1.02)
hallAtScreen(424,295,3.45,2.25,1.28,0.78)

// Main hall steps: shallow horizontal risers that lead from the court to the upper terrace.
for(let i=0;i<6;i++) {
  const inset=i*5, y=111-i*3, up=0.07+i*0.10
  groundScreen("stone",316-inset,y,388+inset,y+5,up)
}
for(let i=0;i<5;i++) {
  const y=217+i*4, up=0.06+i*0.075
  groundScreen("stone",520+i*2,y,574+i*2,y+4,up)
}

// Western garden pond and the large southern reflecting pond, placed at their approved map positions.
polygonScreen("water",[
  [28,149],[41,126],[73,113],[112,119],[145,140],
  [156,166],[144,190],[112,204],[71,198],[39,177],
],0.015)
polygonScreen("water",[
  [235,318],[252,291],[294,279],[353,275],[413,282],
  [457,300],[479,324],[462,347],[414,360],[354,364],
  [296,357],[258,342],
],0.012)

// Irregular stone edging keeps the waterline readable without covering the clear walkable lanes.
for(const [sx,sy] of [
  [31,151],[45,130],[74,116],[111,121],[142,141],[153,166],[141,188],[111,201],[72,196],[40,177],
  [239,318],[258,294],[297,282],[351,278],[411,285],[453,302],[474,324],[458,345],[411,357],[355,361],[298,354],[263,340],
]) blockAtScreen("stone","stone",sx,sy,0.34,0.34,0.02,0.18)

// Garden bridges cross the western pond path and the east lip of the reflecting pond.
bridgeAtScreen(151,169,3.8)
bridgeAtScreen(468,322,4.5)

// Southern ceremonial gate, moved to the original southwest entrance instead of the middle of the map.
const [gateX,gateZ]=atScreen(148,289)
block("stone","stone",gateX-2.95,gateZ-0.34,gateX-2.28,gateZ+0.34,0.05,2.5)
block("stone","stone",gateX+2.28,gateZ-0.34,gateX+2.95,gateZ+0.34,0.05,2.5)
block("wood","wood",gateX-3.15,gateZ-0.48,gateX+3.15,gateZ+0.48,2.3,2.65)
CAMPUS.face("roof",
  [gateX-3.25,gateZ-0.52,2.67],[gateX,gateZ-0.72,3.35],
  [gateX+3.25,gateZ-0.52,2.67],[gateX,gateZ-0.25,3.35])
block("brass","wood",gateX-0.15,gateZ-0.7,gateX+0.15,gateZ-0.55,3.25,3.55)

// The southeast training yard keeps its own rectangular floor and raised practice platform.
groundScreen("stone",520,207,687,294,0.075)
groundScreen("stone",538,222,671,281,0.09)
groundScreen("trim",566,233,641,269,0.105)
blockAtScreen("wood","wood",603,251,4.5,2.1,0.11,0.29)
blockAtScreen("brass","wood",603,246,4.5,0.14,0.29,0.34)
blockAtScreen("brass","wood",603,257,4.5,0.14,0.29,0.34)

// Low boundary stones define gardens while leaving every central route visually open.
for(const [sx,sy,w,d] of [
  [31,102,3.2,0.22],[112,96,3.0,0.22],[194,93,2.8,0.22],
  [510,98,2.8,0.22],[599,106,3.0,0.22],[677,138,0.22,3.2],
  [20,215,0.22,3.0],[682,234,0.22,3.0],
]) blockAtScreen("stone","stone",sx,sy,w,d,0.06,0.48)

// Small ornate garden lamps and carved stone lanterns.
sprite("_academy-cherry", { w:48, h:72, pivot:"bottom", height:2.55 }, c => {
  c.ellipse(24,70,12,3,"k");c.vline(23,43,27,"n");c.vline(25,47,23,"N")
  for(const [x,y,r] of [[15,29,12],[29,24,13],[20,15,10],[36,37,9],[9,41,8]]) {
    c.circ(x,y,r,"r");c.circ(x-2,y-3,Math.max(2,r-4),"R");c.px(x+2,y-4,"W")
  }
  for(const [x,y] of [[12,19],[29,12],[36,32],[8,38],[24,28]])c.px(x,y,"P")
})
sprite("_academy-pine", { w:44, h:72, pivot:"bottom", height:2.7 }, c => {
  c.vline(21,41,29,"n");c.vline(23,45,25,"N")
  for(let t=0;t<4;t++) {
    const y=12+t*11, r=17-t*2
    c.px(22,y-8,"H");c.circ(22,y,r,"g");c.circ(19,y-3,Math.max(3,r-5),"G")
    c.hline(22-r+3,y+2,r*2-6,t%2?"G":"h")
  }
  c.px(13,31,"H");c.px(31,42,"H")
})
sprite("_academy-shrub", { w:32, h:24, pivot:"bottom", height:0.9 }, c => {
  c.ellipse(16,21,14,3,"k");c.circ(10,13,8,"g");c.circ(20,11,8,"G");c.circ(25,15,6,"g")
  c.px(9,9,"H");c.px(19,7,"H")
})
sprite("_academy-lantern", { w:20, h:42, pivot:"bottom", height:1.75 }, c => {
  c.ellipse(10,41,6,1,"k");c.vline(9,5,34,"n");c.vline(11,5,34,"N")
  c.rect(4,12,12,17,"k");c.rect(5,13,10,15,"r");c.rect(7,15,6,11,"Y")
  c.hline(3,11,14,"y");c.hline(4,30,12,"y");c.px(10,17,"W")
})
sprite("_academy-stone-lantern", { w:24, h:38, pivot:"bottom", height:1.6 }, c => {
  c.rect(4,29,16,6,"s");c.rect(6,19,12,11,"S");c.rect(3,16,18,4,"n")
  c.rect(5,8,14,8,"s");c.rect(2,6,20,3,"S");c.px(12,11,"Y")
  c.rect(2,34,20,4,"s");c.hline(4,33,16,"S")
  c.rect(4,35,16,3,"s");c.hline(4,35,16,"S")
})

const treePlaces = [
  [24,127],[28,213],[142,112],[170,225],[222,345],
  [468,350],[508,296],[647,112],[683,181],[672,249],
  [286,39],[478,46],[34,260],
]
const sprites = treePlaces.map(([sx,sy],i)=>{
  const [x,z]=atScreen(sx,sy)
  return {name:i%3===0?"_academy-cherry":"_academy-pine",at:[x,z],seed:31+i,shadow:0.55}
})
const shrubPlaces=[[166,132],[198,246],[491,211],[501,280],[75,222]]
for(const [sx,sy] of shrubPlaces){
  const [x,z]=atScreen(sx,sy)
  sprites.push({name:"_academy-shrub",at:[x,z],shadow:0.18})
}
const lanternOne=atScreen(214,238),lanternTwo=atScreen(493,232)
const stoneLanternOne=atScreen(243,295),stoneLanternTwo=atScreen(455,294)
sprites.push(
  {name:"_academy-lantern",at:lanternOne,light:{r:2.5,strength:0.65},shadow:0.12},
  {name:"_academy-lantern",at:lanternTwo,light:{r:2.5,strength:0.65},shadow:0.12},
  {name:"_academy-stone-lantern",at:stoneLanternOne,shadow:0.2},
  {name:"_academy-stone-lantern",at:stoneLanternTwo,shadow:0.2},
)

const LIGHT = {
  light:[-0.72,0.42,0.55],
  sun:{color:"#ffe0b2",strength:1.12},
  sky:{color:"#9ab2c9",strength:0.45},
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
  // The faint guide is editor-only and excluded from the exported PNG.
  layer("approved-layout-reference",{ref:0.12},stamp("_academy-pixel-source",352,192)),
  (c)=>c.mesh(CAM,CAMPUS.faces,MATS,{sprites,...LIGHT}),
  post({bloom:{levels:3,strength:0.18,above:0.95},vignette:0.06}),
)
