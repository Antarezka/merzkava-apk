// Visual-novel plates. No words are baked into the artwork; dialogue and titles stay live UI.
use("endesga32")
genre("atlas-art", { mix: true })
pal({k:"#18242a",n:"#30464b",b:"#4a7777",B:"#80aaa0",g:"#55724f",G:"#9db778",y:"#c9a56b",Y:"#f2dca3",r:"#8e5149",R:"#d48a67",s:"#a5b7c2",S:"#e2e9df",w:"#fff4da",p:"#77678e",P:"#c5addb"})
// The arrival plate now uses the approved campus illustration as a cinematic detail crop,
// processed through the same Endesga32 palette instead of the previous repeated placeholder blocks.
sprite("academy-arrival",{
 png:"../maps/references/academy-exterior-source.png",
 area:[768,256,1280,720],
 shrink:4,
 palettize:true,
 genre:"atlas-art",
})
sprite("spirit-awakening",{w:320,h:180},c=>{
 c.rect(0,0,320,180,"k");c.rect(0,126,320,54,"n");c.hline(0,126,320,"p")
 // A subdued ceremonial hall: pillars, upper screens and floor lines frame the central awakening.
 for(let i=0;i<5;i++){const x=22+i*68;c.rect(x,18,8,115,"n");c.rect(x+3,18,3,115,"B");c.rect(x-5,13,18,8,"Y");c.rect(x-3,29,14,2,"r")}
 c.rect(70,35,180,3,"y");c.hline(78,39,164,"G");c.hline(78,43,164,"p")
 // Concentric spirit formation, layered rather than a flat neon disc.
 c.circ(160,91,63,"p");c.circ(160,91,58,"P");c.circ(160,91,50,"k");c.circ(160,91,43,"b");c.circ(160,91,36,"B");c.circ(160,91,27,"n");c.circ(160,91,20,"g");c.circ(160,91,13,"G")
 for(let i=0;i<32;i++){const a=i*Math.PI/16,x=Math.round(160+Math.cos(a)*68),y0=Math.round(91+Math.sin(a)*68);c.px(x,y0,i%4===0?"w":i%2?"Y":"P")}
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.round(160+Math.cos(a)*47),y0=Math.round(91+Math.sin(a)*47);c.circ(x,y0,3,i%2?"Y":"w")}
 // The student silhouette keeps its feet grounded and reads clearly against the spirit light.
 c.ellipse(160,145,17,5,"k");c.rect(149,111,22,31,"n");c.rect(152,114,16,26,"b");c.poly([152,117,160,125,168,117,166,140,154,140], "B")
 c.circ(160,102,10,"S");c.rect(150,92,20,8,"k");c.rect(153,89,14,5,"n");c.vline(160,125,13,"Y")
 c.hline(152,140,16,"G");c.px(154,144,"Y");c.px(166,144,"Y")
})
sprite("transition-frame",{w:320,h:180},c=>{
 c.hline(5,5,310,"k");c.hline(5,6,310,"G");c.hline(5,173,310,"k");c.hline(5,174,310,"G")
 c.vline(5,8,164,"k");c.vline(6,8,164,"G");c.vline(313,8,164,"k");c.vline(314,8,164,"G")
 for(let i=0;i<12;i++){c.px(20+i*25,90+(i%3)*3,"Y");c.px(22+i*25,89+(i%3)*3,"w")}
 for(let i=0;i<4;i++){c.px(12+i*2,12,"P");c.px(298-i*2,166,"P")}
})
