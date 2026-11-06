// Merzkava HUD and inventory artwork. Live text, currency values and interactive hit areas stay HTML.
pal({k:"#18282a",n:"#2b4140",b:"#45645e",B:"#739083",g:"#9d8456",G:"#d5b77a",y:"#f0dcae",Y:"#ead08e",w:"#f4ead6",r:"#a35e48",R:"#d18b64",s:"#a8b6ad",S:"#d9e3d6",p:"#876d91",P:"#c0a6c8",c:"#6e9fa5",C:"#a8d1c9",t:"#8f8778",T:"#c1b49d",W:"#fff8e8",H:"#c8d9a5"})
function ornateFrame(c,w,h,accent="G"){
  c.hline(3,1,w-6,"k");c.hline(4,2,w-8,accent);c.hline(7,4,w-14,"n")
  c.hline(3,h-3,w-6,"k");c.hline(4,h-4,w-8,accent);c.hline(7,h-6,w-14,"n")
  c.vline(1,3,h-6,"k");c.vline(2,4,h-8,accent);c.vline(4,7,h-14,"n")
  c.vline(w-3,3,h-6,"k");c.vline(w-4,4,h-8,accent);c.vline(w-6,7,h-14,"n")
  for(const [x,y] of [[5,5],[w-6,5],[5,h-6],[w-6,h-6]]){
    c.rect(x-2,y-2,5,5,"k");c.rect(x-1,y-1,3,3,accent);c.px(x,y,"w")
    c.px(x-3,y,"G");c.px(x+3,y,"G");c.px(x,y-3,"G");c.px(x,y+3,"G")
  }
  for(let x=12;x<w-12;x+=18){c.px(x,3,"y");c.px(x,h-4,"y")}
}
sprite("traveler-satchel",{w:32,h:32},c=>{
  c.ellipse(16,29,10,2,"k")
  c.rect(8,9,16,19,"k");c.rect(9,10,14,17,"r");c.rect(11,12,10,13,"R")
  c.hline(10,10,12,"G");c.hline(11,12,10,"Y");c.vline(10,14,10,"r");c.vline(21,14,10,"r")
  c.rect(13,4,7,7,"n");c.hline(12,4,9,"G");c.vline(12,7,5,"y");c.vline(20,7,5,"y")
  c.rect(13,17,7,6,"y");c.rect(14,18,5,4,"G");c.px(16,19,"w")
  c.vline(7,13,13,"G");c.vline(24,13,13,"G");c.px(8,25,"Y");c.px(23,25,"Y")
  c.px(16,7,"W");c.hline(12,27,8,"n")
})
sprite("skill-technique",{w:32,h:32},c=>{
  c.vline(15,4,24,"n");c.vline(16,4,23,"Y");c.vline(17,5,22,"G")
  c.rect(12,3,8,4,"n");c.hline(11,7,10,"G");c.rect(14,26,5,3,"n")
  c.hline(5,11,22,"W");c.hline(7,13,18,"G");c.px(16,15,"R");c.px(16,17,"R")
  c.px(7,10,"Y");c.px(24,10,"Y")
})
sprite("skill-guard",{w:32,h:32},c=>{
  c.rect(6,5,20,4,"n");c.rect(8,8,16,16,"b");c.rect(10,10,12,12,"B")
  c.vline(15,10,13,"w");c.hline(10,15,12,"C");c.px(16,12,"Y")
  c.rect(12,24,8,4,"G");c.px(16,28,"y")
})
sprite("skill-movement",{w:32,h:32},c=>{
  c.hline(4,15,24,"G");c.hline(7,16,18,"Y")
  c.rect(7,9,4,13,"w");c.rect(21,9,4,13,"w");c.px(5,8,"G");c.px(26,8,"G")
  c.hline(10,7,12,"B");c.hline(10,23,12,"B")
  c.px(13,12,"W");c.px(18,20,"W")
})
sprite("skill-spirit-art",{w:32,h:32},c=>{
  // Flame-and-rune crest, deliberately distinct from absorbed Spirit Rings.
  c.poly([16,2,20,8,23,13,27,17,24,23,20,28,16,30,12,27,8,22,6,17,10,12,13,7],"p")
  c.poly([16,8,20,15,19,21,16,26,12,22,11,17],"P")
  c.vline(16,11,11,"y");c.hline(13,16,7,"Y")
  c.px(16,10,"w");c.px(21,17,"C");c.px(11,20,"C")
  c.px(16,27,"w");c.px(9,13,"G");c.px(23,13,"G")
})
sprite("ration-small",{w:24,h:24},c=>{
  c.rect(4,8,16,11,"k");c.rect(5,9,14,9,"g");c.hline(6,7,12,"G")
  c.px(8,11,"H");c.px(12,13,"w");c.px(16,15,"Y");c.hline(7,18,10,"n")
})
sprite("ration-standard",{w:24,h:24},c=>{
  c.rect(4,7,16,12,"k");c.rect(5,8,14,10,"r");c.hline(6,6,12,"G")
  c.rect(7,10,10,5,"y");c.hline(8,11,8,"W");c.px(10,13,"Y");c.px(16,14,"R")
})
sprite("ration-large",{w:24,h:24},c=>{
  c.rect(3,6,18,14,"k");c.rect(4,7,16,12,"g");c.rect(6,9,12,8,"G")
  c.hline(6,5,12,"Y");c.hline(8,11,8,"H");c.px(12,13,"W");c.hline(7,18,10,"n")
})
sprite("bread",{w:24,h:24},c=>{
  c.ellipse(12,15,10,7,"n");c.ellipse(12,12,9,6,"G");c.hline(7,9,10,"Y")
  c.px(8,12,"w");c.px(13,10,"W");c.px(16,13,"Y");c.hline(8,17,8,"g")
})
sprite("apple",{w:24,h:24},c=>{
  c.circ(10,14,7,"r");c.circ(15,14,7,"R");c.vline(13,5,5,"n")
  c.rect(14,6,7,3,"g");c.px(8,11,"W");c.px(16,10,"Y")
})
sprite("wood",{w:24,h:24},c=>{
  c.rect(4,8,16,11,"n");c.rect(5,9,14,9,"y");c.hline(6,10,12,"G")
  c.vline(8,10,7,"g");c.vline(17,10,7,"g");c.px(7,18,"W");c.px(17,18,"W")
})
sprite("stone",{w:24,h:24},c=>{
  c.rect(5,10,14,9,"n");c.rect(7,7,10,4,"s");c.rect(7,10,11,8,"t")
  c.hline(8,11,7,"S");c.px(16,15,"n");c.px(9,16,"w")
})
sprite("herb",{w:24,h:24},c=>{
  c.vline(12,7,13,"g");c.rect(5,8,8,4,"G");c.rect(12,5,7,4,"G")
  c.rect(4,14,8,4,"B");c.rect(13,12,7,4,"g");c.px(12,20,"y");c.px(17,8,"W")
})
sprite("potion",{w:24,h:24},c=>{
  c.rect(9,4,6,4,"G");c.rect(8,8,8,12,"k");c.rect(9,9,6,10,"r")
  c.hline(10,10,4,"R");c.px(10,13,"w");c.px(14,16,"Y");c.hline(9,20,6,"G")
})

// Distinct denominations use different metal, geometry and engraved sigils. Amounts remain live HTML.
function coin(name,metal,highlight,sigil){
  sprite(name,{w:24,h:24},c=>{
    c.circ(12,12,10,"k");c.circ(12,12,8,metal);c.circ(12,12,6,highlight)
    c.circ(12,12,4,metal);c.px(12,12,"W")
    if(sigil==="copper"){c.hline(8,11,8,"R");c.vline(12,8,8,"R")}
    if(sigil==="silver"){c.vline(12,7,10,"w");c.hline(8,12,8,"w");c.px(12,9,"W")}
    if(sigil==="gold"){c.hline(8,9,8,"Y");c.hline(8,14,8,"Y");c.vline(12,8,8,"Y")}
    if(sigil==="jade"){c.circ(12,12,3,"C");c.vline(12,8,8,"w");c.hline(9,12,6,"w")}
    if(sigil==="ancient"){c.circ(12,12,3,"P");c.hline(8,9,8,"W");c.hline(8,15,8,"W");c.px(12,12,"Y")}
  })
}
coin("currency-xc","r","R","copper")
coin("currency-xs","s","S","silver")
coin("currency-xg","y","Y","gold")
coin("currency-zj","g","C","jade")
coin("currency-az","p","P","ancient")

sprite("player-frame",{w:320,h:72},c=>{ornateFrame(c,320,72,"G");c.hline(16,13,42,"y");c.hline(262,13,42,"y")})
sprite("skill-dock-frame",{w:320,h:104},c=>{ornateFrame(c,320,104,"g");c.hline(20,12,34,"Y");c.hline(266,12,34,"Y")})
sprite("satchel-panel",{w:256,h:256},c=>{ornateFrame(c,256,256,"G");for(let y=24;y<240;y+=24)c.hline(12,y,232,"n")})
sprite("currency-purse",{w:180,h:160},c=>{ornateFrame(c,180,160,"y");c.hline(24,22,132,"Y")})
sprite("world-strip",{w:320,h:32},c=>{ornateFrame(c,320,32,"G");c.hline(18,14,284,"n")})
sprite("weather-icon",{w:24,h:24},c=>{
  c.circ(12,12,6,"Y")
  for(let a=0;a<8;a++){const x=[12,17,20,17,12,7,4,7][a],y=[3,5,12,19,21,19,12,5][a];c.px(x,y,"G")}
  c.px(10,9,"W")
})
sprite("minimap-frame",{w:192,h:192},c=>{ornateFrame(c,192,192,"g");c.hline(12,24,168,"Y")})
sprite("minimap-toggle",{w:24,h:24},c=>{
  c.circ(12,12,10,"n");c.circ(12,12,8,"G");c.circ(12,12,6,"k")
  c.vline(12,2,20,"y");c.hline(2,12,20,"y");c.circ(12,12,3,"w")
})
sprite("item-frame-tier-1",{w:36,h:36},c=>{ornateFrame(c,36,36,"g")})
sprite("item-frame-tier-2",{w:36,h:36},c=>{ornateFrame(c,36,36,"G");c.px(18,3,"w");c.px(18,32,"w")})
const MARKERS=[["marker-power","R"],["marker-territory","G"],["marker-forest","g"],["marker-sea","c"],["marker-landmark","Y"],["marker-mountains","s"]]
for(const [name,color] of MARKERS)sprite(name,{w:24,h:24},c=>{
  c.circ(12,12,9,"k");c.circ(12,11,7,color);c.circ(12,11,3,"w");c.vline(12,16,5,"k")
})
for(let i=0;i<6;i++)sprite("map-site-"+i,{w:24,h:24},c=>{
  c.circ(12,12,9,"k");c.circ(12,12,7,["R","G","y","c","g","p"][i])
  if(i===0){c.vline(12,5,14,"w");c.hline(6,11,12,"w")}
  if(i===1){c.rect(7,9,10,9,"w");c.rect(9,6,6,5,"G")}
  if(i===2){c.hline(6,11,12,"w");c.vline(9,8,9,"w");c.vline(15,8,9,"w")}
  if(i===3){c.rect(7,7,10,10,"w");c.hline(5,17,14,"y")}
  if(i===4){c.rect(8,6,8,12,"w");c.hline(6,8,12,"G")}
  if(i===5){c.vline(12,5,14,"w");c.hline(6,12,12,"y")}
})
