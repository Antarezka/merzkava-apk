// Reusable, original Academy props. These remain visual children; the map editor owns placement and collision.
pal({k:"#241f1a",n:"#49362a",b:"#66503a",B:"#987a50",g:"#516b4c",G:"#8eaa6b",y:"#c39d5f",Y:"#ead08e",s:"#9c9c8a",S:"#ddd2b9",c:"#4c8990",C:"#8cc4bd",r:"#864b3d",w:"#f4eddc"})
sprite("academy-gate",{w:96,h:80,pivot:"bottom"},c=>{
 c.rect(12,28,8,45,"n");c.rect(76,28,8,45,"n");c.rect(8,23,80,7,"b");c.hline(8,23,80,"Y")
 c.rect(22,15,52,10,"r");c.rect(27,8,42,9,"n");c.hline(24,14,48,"Y")
 c.rect(27,31,42,42,"b");c.rect(32,35,32,38,"B");c.vline(47,35,38,"n");c.hline(33,48,31,"Y")
 c.rect(43,3,10,8,"G");c.px(48,1,"Y")
})
sprite("academy-roof",{w:96,h:48,pivot:"bottom"},c=>{
 c.rect(13,16,70,25,"n");c.rect(8,13,80,8,"b");c.rect(3,10,90,6,"k")
 for(let i=0;i<7;i++){c.vline(13+i*11,15,22,"B");c.px(8+i*13,9,"Y")}
 c.hline(8,22,80,"Y");c.rect(44,2,8,8,"y")
})
sprite("academy-stairs",{w:64,h:48,pivot:"bottom"},c=>{
 for(let i=0;i<7;i++){c.rect(7+i*3,9+i*5,50-i*6,5,"S");c.hline(8+i*3,9+i*5,48-i*6,"Y");c.hline(9+i*3,13+i*5,46-i*6,"s")}
})
sprite("academy-bridge",{w:96,h:56,pivot:"bottom"},c=>{
 c.rect(8,30,80,12,"b");c.rect(12,32,72,7,"B");c.hline(8,28,80,"Y")
 c.vline(12,16,15,"n");c.vline(84,16,15,"n");c.hline(12,16,72,"Y")
 for(let i=0;i<7;i++)c.vline(18+i*10,18,11,"n")
 c.rect(3,39,10,6,"s");c.rect(83,39,10,6,"s")
})
sprite("academy-trees",{w:64,h:80,pivot:"bottom"},c=>{
 c.vline(30,42,34,"n");c.vline(32,46,30,"b")
 c.circ(31,25,18,"g");c.circ(18,34,12,"G");c.circ(45,34,12,"g");c.circ(27,15,10,"G")
 c.px(20,21,"Y");c.px(39,29,"Y");c.px(28,36,"B")
})
sprite("academy-pond",{w:96,h:56,pivot:"center"},c=>{
 c.ellipse(48,28,43,22,"n");c.ellipse(48,26,40,19,"c");c.ellipse(40,22,18,6,"C")
 c.hline(54,31,22,"B");c.hline(65,22,12,"w");c.px(27,35,"G");c.px(73,37,"G")
})
sprite("academy-training-yard",{w:96,h:64,pivot:"bottom"},c=>{
 c.rect(8,12,80,44,"n");c.rect(11,15,74,38,"B");c.hline(15,20,66,"S");c.hline(15,47,66,"S")
 c.vline(15,20,27,"S");c.vline(80,20,27,"S");c.rect(42,27,12,12,"y");c.hline(36,25,24,"Y")
})
sprite("academy-lanterns",{w:32,h:56,pivot:"bottom"},c=>{
 c.vline(15,4,50,"n");c.rect(8,13,16,23,"k");c.rect(10,15,12,19,"r");c.rect(12,17,8,15,"Y")
 c.hline(6,12,20,"G");c.hline(9,38,14,"G");c.px(16,6,"y")
})
