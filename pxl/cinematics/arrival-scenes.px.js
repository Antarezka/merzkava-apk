// Small visual-novel plates for entry/transition moments; no narrative text baked into the images.
pal({k:"#18242a",n:"#30464b",b:"#4a7777",B:"#80aaa0",g:"#55724f",G:"#9db778",y:"#c9a56b",Y:"#f2dca3",r:"#8e5149",R:"#d48a67",s:"#a5b7c2",S:"#e2e9df",w:"#fff4da",p:"#77678e",P:"#c5addb"})
sprite("academy-arrival",{w:320,h:180},c=>{
 c.rect(0,0,320,180,"b");c.rect(0,110,320,70,"g");c.hline(0,111,320,"G")
 for(let i=0;i<8;i++){const x=18+i*42;c.rect(x,60-(i%3)*8,30,55,"n");c.rect(x-5,54-(i%3)*8,40,8,"r");c.hline(x-4,53-(i%3)*8,38,"Y");c.rect(x+4,74-(i%3)*8,22,41,"B")}
 c.ellipse(160,145,145,23,"b");c.ellipse(160,142,135,18,"S");c.hline(30,143,260,"Y")
 c.circ(260,33,18,"Y");c.circ(260,33,13,"w")
 for(let i=0;i<12;i++){const x=20+i*25;c.px(x,125+(i%3)*5,"G")}
})
sprite("spirit-awakening",{w:320,h:180},c=>{
 c.rect(0,0,320,180,"k");c.rect(0,115,320,65,"n");c.hline(0,116,320,"p")
 c.circ(160,84,58,"p");c.circ(160,84,52,"P");c.circ(160,84,44,"k");c.circ(160,84,35,"b");c.circ(160,84,28,"B")
 for(let i=0;i<24;i++){const a=i*Math.PI/12,x=Math.round(160+Math.cos(a)*65),y=Math.round(84+Math.sin(a)*65);c.px(x,y,"Y")}
 c.ellipse(160,132,13,5,"k");c.rect(151,94,18,34,"b");c.circ(160,86,10,"S");c.rect(151,76,18,10,"n");c.vline(160,104,20,"G")
})
sprite("transition-frame",{w:320,h:180},c=>{
 c.hline(5,5,310,"k");c.hline(5,6,310,"G");c.hline(5,173,310,"k");c.hline(5,174,310,"G")
 c.vline(5,8,164,"k");c.vline(6,8,164,"G");c.vline(313,8,164,"k");c.vline(314,8,164,"G")
 for(let i=0;i<12;i++){c.px(20+i*25,90+(i%3)*3,"Y");c.px(22+i*25,89+(i%3)*3,"w")}
})
