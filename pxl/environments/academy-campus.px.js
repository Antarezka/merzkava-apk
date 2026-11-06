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

// Academy perimeter and open walking courts.
ground("grass",-19,Z-13,19,Z+15,0)
ground("stone",-8.8,Z-7.6,8.8,Z+7.2,0.06)
ground("stone",-2.4,Z+6.8,2.4,Z+11.7,0.07)
ground("stone",-13.2,Z-5.8,-8.2,Z+8.2,0.05)
ground("stone",8.2,Z-6.4,13.2,Z+8.8,0.05)

// Main courtyard: a broad quiet floor with a ceremonial medallion and clear actor lanes.
const medallion=Array.from({length:32},(_,i)=>{
  const a=2*Math.PI*i/32
  return [Math.cos(a)*2.35,Z+0.8+Math.sin(a)*2.35,0.105]
})
CAMPUS.face("trim",...medallion)
const innerMedallion=Array.from({length:24},(_,i)=>{
  const a=2*Math.PI*i/24
  return [Math.cos(a)*1.35,Z+0.8+Math.sin(a)*1.35,0.112]
})
CAMPUS.face("stone",...innerMedallion)

// The main rear hall and the two flanking study buildings.
academyHall(0,Z-7.1,7.6,4.1,2.45,1.5)
academyHall(-10.1,Z-7.1,5.3,3.5,2.05,1.15)
academyHall(10.1,Z-7.2,5.4,3.5,2.05,1.15)
// An upper pavilion on the central hall creates the layered academy roofline.
academyHall(0,Z-7.15,4.6,2.7,1.05,0.86,3.25)
// Lower wings: library, lecture pavilion and the training-yard hall.
academyHall(-10.4,Z+4.5,4.8,3.0,1.8,0.95)
academyHall(10.6,Z+6.4,5.0,3.2,1.85,1.0)

// Steps leading to the main hall and east training terrace.
for(let i=0;i<6;i++) {
  const y=Z-4.8-i*0.24
  const up=0.08+i*0.11
  block("stone","stone", -2.35-i*0.09,y,2.35+i*0.09,y+0.28,up,up+0.11)
}
for(let i=0;i<5;i++) {
  const y=Z+3.0+i*0.28
  const up=0.06+i*0.08
  block("stone","stone",8.5,y,12.4,y+0.22,up,up+0.10)
}

// West garden pond, its stepping-stone edge and the south reflecting pool.
CAMPUS.face("water",
  [-17,Z-1.5,0.015],[-15.8,Z-3.2,0.015],[-12.1,Z-2.9,0.015],
  [-10.9,Z-0.7,0.015],[-11.6,Z+3.9,0.015],[-14.3,Z+5.1,0.015],
  [-16.8,Z+3.4,0.015])
CAMPUS.face("water",
  [1.5,Z+10.9,0.012],[3.1,Z+9.8,0.012],[8.8,Z+10.1,0.012],
  [10.7,Z+11.3,0.012],[9.5,Z+13.9,0.012],[4.2,Z+14.2,0.012],
  [1.8,Z+12.8,0.012])
// Stone edging around ponds.
for(const [x,z] of [[-16.4,Z-1],[-15.5,Z-3],[-12.2,Z-2.7],[-11.2,Z+0.5],[-12,Z+3.7],[-14.5,Z+4.8],[-16.7,Z+2.8],
                    [2.1,Z+11.1],[4.5,Z+9.9],[8.6,Z+10.3],[10.4,Z+11.4],[9.2,Z+13.6],[4.2,Z+13.9],[2.1,Z+12.8]]) {
  block("stone","stone",x-0.22,z-0.22,x+0.22,z+0.22,0.02,0.22)
}

// Two arched-looking raised bridges over the water channels.
function academyBridge(x,z,width=3.6) {
  block("wood","wood",x-width/2,z-0.42,x+width/2,z+0.42,0.36,0.62)
  block("brass","wood",x-width/2,z-0.48,x+width/2,z-0.38,0.72,0.82)
  block("brass","wood",x-width/2,z+0.38,x+width/2,z+0.48,0.72,0.82)
  for(let i=0;i<=4;i++) {
    const px=x-width/2+i*width/4
    block("wood","wood",px-0.055,z-0.5,px+0.055,z-0.38,0.62,1.12)
    block("wood","wood",px-0.055,z+0.38,px+0.055,z+0.5,0.62,1.12)
  }
}
academyBridge(-10.3,Z+1.4,3.8)
academyBridge(6.5,Z+11.3,4.5)

// Formal southern gate: stone piers, lacquered lintel and a tiled ceremonial cap.
block("stone","stone",-3.0,Z+9.2,-2.35,Z+9.8,0.05,2.5)
block("stone","stone",2.35,Z+9.2,3.0,Z+9.8,0.05,2.5)
block("wood","wood",-3.25,Z+9.0,3.25,Z+10.0,2.3,2.65)
CAMPUS.face("roof",[-3.35,Z+8.9,2.67],[0,Z+8.75,3.35],[3.35,Z+8.9,2.67],[0,Z+9.05,3.35])
block("brass","wood",-0.15,Z+8.85,0.15,Z+9.0,3.25,3.55)

// Training yard on the southeast terrace, separate from the courtyard floor.
ground("stone",8.7,Z+4.5,16.1,Z+9.0,0.08)
block("wood","wood",10.1,Z+5.8,14.7,Z+7.5,0.11,0.29)
block("brass","wood",10.1,Z+5.76,14.7,Z+5.9,0.29,0.34)
block("brass","wood",10.1,Z+7.4,14.7,Z+7.54,0.29,0.34)
block("wood","wood",10.0,Z+5.7,10.16,Z+7.6,0.29,0.36)
block("wood","wood",14.64,Z+5.7,14.8,Z+7.6,0.29,0.36)

// Low garden walls and boundary details; the south gate remains the only formal entrance.
for(const [x1,z1,x2,z2] of [
  [-17,Z-9,-8,Z-8.7],[-7,Z-9,8,Z-8.7],[9,Z-9,17,Z-8.7],
  [-17,Z-8.8,-16.7,Z+8.5],[16.7,Z-8.8,17,Z+9.5],
  [-17,Z+8.5,-4,Z+8.8],[4,Z+8.5,17,Z+8.8],
]) block("stone","stone",x1,z1,x2,z2,0.06,0.62)

// Small ornate garden lamps and carved stone lanterns.
sprite("_academy-cherry", { w:48, h:72, pivot:"bottom", height:3.0 }, c => {
  c.ellipse(24,70,12,3,"k");c.vline(23,43,27,"n");c.vline(25,47,23,"N")
  for(const [x,y,r] of [[15,29,12],[29,24,13],[20,15,10],[36,37,9],[9,41,8]]) {
    c.circ(x,y,r,"r");c.circ(x-2,y-3,Math.max(2,r-4),"R");c.px(x+2,y-4,"W")
  }
  for(const [x,y] of [[12,19],[29,12],[36,32],[8,38],[24,28]])c.px(x,y,"P")
})
sprite("_academy-pine", { w:44, h:72, pivot:"bottom", height:3.2 }, c => {
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
  c.rect(4,35,16,3,"s");c.hline(4,35,16,"S")
})

const treePlaces = [
  [-16,Z-7],[-14,Z-5],[-18,Z+1],[-16,Z+6],[-13,Z+9],[-9,Z+10],[-5,Z+11],
  [4,Z+13],[9,Z+12],[14,Z+10],[17,Z+6],[17,Z+1],[15,Z-5],[12,Z-10],
  [6,Z-10],[-5,Z-11],[-13,Z-11],[-18,Z-5],
]
const sprites = treePlaces.map(([x,z],i)=>({
  name:i%3===0?"_academy-cherry":"_academy-pine",
  at:[x,z],seed:31+i,shadow:0.65,
}))
sprites.push(
  {name:"_academy-shrub",at:[-8.8,Z+1.0],shadow:0.2},
  {name:"_academy-shrub",at:[8.5,Z+2.6],shadow:0.2},
  {name:"_academy-shrub",at:[-12.0,Z-4.4],shadow:0.2},
  {name:"_academy-lantern",at:[-7.1,Z+2.5],light:{r:2.8,strength:0.8},shadow:0.15},
  {name:"_academy-lantern",at:[7.1,Z+2.5],light:{r:2.8,strength:0.8},shadow:0.15},
  {name:"_academy-stone-lantern",at:[-4.2,Z+5.4],shadow:0.25},
  {name:"_academy-stone-lantern",at:[4.2,Z+5.4],shadow:0.25},
)

const LIGHT = {
  light:[-0.72,0.42,0.55],
  sun:{color:"#ffe0b2",strength:1.18},
  sky:{color:"#8baac7",strength:0.42},
  shadows:true,
  lamps:[
    {at:[-7.1,Z+2.5,1.25],color:"#ffbf78",r:3.4,strength:1.15},
    {at:[7.1,Z+2.5,1.25],color:"#ffbf78",r:3.4,strength:1.15},
  ],
}

scene("academy-exterior-render", {
  w:W,h:H,bg:"K",
  sizes:{"academy-exterior":4},
  check:{every:1},
},
  layer("hd2d-campus",(c)=>c.mesh(CAM,CAMPUS.faces,MATS,{sprites,...LIGHT})),
  // A faint guide exists only in the PXL editor/preview; it is excluded from the exported PNG.
  layer("approved-layout-reference",{ref:0.12},stamp("_academy-pixel-source",352,192)),
  post({blur:2,focus:[W/2,H*0.54],sharp:2,soft:[2,6],bloom:{levels:4,strength:0.34,above:0.92},vignette:0.14}),
)
