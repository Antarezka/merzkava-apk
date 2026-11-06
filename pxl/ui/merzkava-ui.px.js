// Merzkava HUD and inventory artwork. Live text, currency values and interactive hit areas stay HTML.
pal({k:"#18282a",n:"#2b4140",b:"#45645e",B:"#739083",g:"#9d8456",G:"#d5b77a",y:"#f0dcae",w:"#f4ead6",r:"#a35e48",R:"#d18b64",s:"#a8b6ad",S:"#d9e3d6",p:"#876d91",P:"#c0a6c8",c:"#6e9fa5",C:"#a8d1c9"})
function ornateFrame(c,w,h,accent="G"){
 c.hline(4,2,w-8,"k");c.hline(4,3,w-8,accent);c.hline(4,h-4,w-8,"k");c.hline(4,h-3,w-8,accent)
 c.vline(2,4,h-8,"k");c.vline(3,4,h-8,accent);c.vline(w-4,4,h-8,"k");c.vline(w-3,4,h-8,accent)
 for(const [x,y] of [[4,4],[w-5,4],[4,h-5],[w-5,h-5]]){c.rect(x-1,y-1,3,3,"k");c.px(x,y,accent)}
 c.hline(9,6,w-18,"n");c.hline(9,h-7,w-18,"n")
}
sprite("traveler-satchel",{w:32,h:32},c=>{c.rect(9,9,15,19,"k");c.rect(10,10,13,17,"r");c.rect(12,12,9,12,"R");c.hline(10,9,13,"G");c.rect(13,4,7,7,"n");c.hline(12,4,9,"G");c.rect(14,17,6,5,"y");c.px(17,19,"k");c.vline(8,13,11,"G");c.vline(23,13,11,"G")})
sprite("skill-technique",{w:32,h:32},c=>{c.vline(15,4,23,"G");c.vline(16,4,23,"y");c.hline(6,10,20,"w");c.hline(8,12,16,"g");c.rect(13,3,6,4,"G");c.rect(13,25,6,4,"n");c.px(16,15,"R");c.px(16,17,"R")})
sprite("skill-guard",{w:32,h:32},c=>{c.rect(7,5,18,3,"G");c.rect(9,8,14,14,"b");c.rect(11,10,10,9,"B");c.vline(15,10,10,"w");c.rect(12,22,8,4,"G");c.px(16,16,"y")})
sprite("skill-movement",{w:32,h:32},c=>{c.hline(5,15,21,"G");c.hline(8,16,17,"y");c.rect(7,10,4,11,"w");c.rect(21,10,4,11,"w");c.px(6,9,"G");c.px(25,9,"G");c.hline(10,7,12,"B");c.hline(10,23,12,"B")})
sprite("skill-spirit-art",{w:32,h:32},c=>{c.circ(16,16,10,"p");c.circ(16,16,7,"P");c.px(16,5,"w");c.px(25,16,"G");c.px(16,26,"w");c.px(7,16,"G");c.circ(16,16,3,"y");c.px(16,16,"w")})
sprite("ration-small",{w:24,h:24},c=>{c.rect(5,8,14,11,"k");c.rect(6,9,12,9,"g");c.hline(7,7,10,"G");c.px(12,12,"w");c.px(15,14,"Y")})
sprite("ration-standard",{w:24,h:24},c=>{c.rect(4,7,16,12,"k");c.rect(5,8,14,10,"r");c.hline(7,6,10,"G");c.rect(8,11,8,4,"y");c.px(10,12,"w")})
sprite("ration-large",{w:24,h:24},c=>{c.rect(3,6,18,14,"k");c.rect(4,7,16,12,"g");c.rect(6,9,12,8,"G");c.hline(6,5,12,"y");c.px(12,13,"w")})
sprite("bread",{w:24,h:24},c=>{c.ellipse(12,14,9,7,"n");c.ellipse(12,12,8,6,"G");c.hline(8,10,8,"y");c.px(9,12,"w");c.px(15,11,"w")})
sprite("apple",{w:24,h:24},c=>{c.circ(11,14,7,"r");c.circ(15,14,7,"R");c.vline(13,5,5,"n");c.rect(14,6,6,3,"g");c.px(9,11,"w")})
sprite("wood",{w:24,h:24},c=>{c.rect(5,8,14,11,"n");c.rect(6,9,12,9,"y");c.hline(7,11,10,"G");c.vline(9,9,9,"g");c.vline(16,9,9,"g")})
sprite("stone",{w:24,h:24},c=>{c.rect(5,10,14,9,"n");c.rect(7,7,10,4,"s");c.rect(7,10,11,8,"t");c.hline(8,11,7,"S");c.px(16,15,"n")})
sprite("herb",{w:24,h:24},c=>{c.vline(12,8,12,"g");c.rect(6,8,7,4,"G");c.rect(12,5,6,4,"G");c.rect(5,14,7,4,"B");c.rect(13,12,6,4,"g");c.px(12,19,"y")})
sprite("potion",{w:24,h:24},c=>{c.rect(9,4,6,4,"G");c.rect(8,8,8,11,"k");c.rect(9,9,6,9,"r");c.hline(10,10,4,"R");c.px(10,13,"w");c.hline(9,20,6,"G")})
sprite("currency-xc",{w:24,h:24},c=>{c.circ(12,12,9,"n");c.circ(12,12,7,"r");c.circ(12,12,3,"R");c.px(12,12,"y")})
sprite("currency-xs",{w:24,h:24},c=>{c.circ(12,12,9,"n");c.circ(12,12,7,"s");c.circ(12,12,3,"S");c.px(12,12,"w")})
sprite("currency-xg",{w:24,h:24},c=>{c.circ(12,12,9,"n");c.circ(12,12,7,"y");c.circ(12,12,3,"G");c.px(12,12,"w")})
sprite("currency-zj",{w:24,h:24},c=>{c.circ(12,12,9,"n");c.circ(12,12,7,"g");c.circ(12,12,3,"C");c.px(12,12,"w")})
sprite("currency-az",{w:24,h:24},c=>{c.circ(12,12,10,"n");c.circ(12,12,8,"p");c.circ(12,12,5,"P");c.circ(12,12,2,"y")})
sprite("player-frame",{w:320,h:72},c=>ornateFrame(c,320,72,"G"))
sprite("skill-dock-frame",{w:320,h:104},c=>ornateFrame(c,320,104,"g"))
sprite("satchel-panel",{w:256,h:256},c=>ornateFrame(c,256,256,"G"))
sprite("currency-purse",{w:180,h:160},c=>ornateFrame(c,180,160,"y"))
sprite("world-strip",{w:320,h:32},c=>ornateFrame(c,320,32,"G"))
sprite("weather-icon",{w:24,h:24},c=>{c.circ(12,12,6,"Y");for(let a=0;a<8;a++){const x=[12,17,20,17,12,7,4,7][a],y=[3,5,12,19,21,19,12,5][a];c.px(x,y,"G")}})
sprite("minimap-frame",{w:192,h:192},c=>ornateFrame(c,192,192,"g"))
sprite("minimap-toggle",{w:24,h:24},c=>{c.circ(12,12,10,"n");c.circ(12,12,8,"G");c.circ(12,12,6,"k");c.vline(12,2,20,"y");c.hline(2,12,20,"y");c.circ(12,12,3,"w")})
sprite("item-frame-tier-1",{w:36,h:36},c=>ornateFrame(c,36,36,"g"))
sprite("item-frame-tier-2",{w:36,h:36},c=>{ornateFrame(c,36,36,"G");c.px(18,3,"w");c.px(18,32,"w")})
const MARKERS=[["marker-power","R"],["marker-territory","G"],["marker-forest","g"],["marker-sea","c"],["marker-landmark","Y"],["marker-mountains","s"]]
for(const [name,color] of MARKERS)sprite(name,{w:24,h:24},c=>{c.circ(12,12,9,"k");c.circ(12,11,7,color);c.circ(12,11,3,"w");c.vline(12,16,5,"k")})
for(let i=0;i<6;i++)sprite("map-site-"+i,{w:24,h:24},c=>{
 c.circ(12,12,9,"k");c.circ(12,12,7,["R","G","y","c","g","p"][i])
 if(i===0){c.vline(12,5,14,"w");c.hline(6,11,12,"w")}
 if(i===1){c.rect(7,9,10,9,"w");c.rect(9,6,6,5,"G")}
 if(i===2){c.hline(6,11,12,"w");c.vline(9,8,9,"w");c.vline(15,8,9,"w")}
 if(i===3){c.rect(7,7,10,10,"w");c.hline(5,17,14,"y")}
 if(i===4){c.rect(8,6,8,12,"w");c.hline(6,8,12,"G")}
 if(i===5){c.vline(12,5,14,"w");c.hline(6,12,12,"y")}
})
