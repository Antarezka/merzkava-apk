// Original stylized 2D Academy cast. 8 headings × 4 frames, feet anchored at y=46.
pal({k:"#241d1b",n:"#49362e",d:"#715044",b:"#456b73",B:"#78a0a0",g:"#667b59",G:"#9cac7b",r:"#8c4140",R:"#c16f59",p:"#785e83",P:"#b39ac0",y:"#b58a4f",Y:"#ead08b",s:"#b9795e",S:"#e6b18c",w:"#e9e1ce",W:"#fff4db",t:"#8f8778"})
function drawAcademyCharacter(c,look){
 const frame=c.frame||0,dir=Math.floor(frame/4),step=frame%4,walking=step>=2
 const side=dir>=1&&dir<=3?1:dir>=5?-1:0,back=dir===4
 const bob=walking?(step===2?0:1):(step===1?1:0),swing=walking&&step===2?1:walking&&step===3?-1:0
 const skin=look.skin||"S",hair=look.hair||"k",robe=look.robe||"b",trim=look.trim||"Y",sash=look.sash||"r"
 c.ellipse(16,45,9,2,"k")
 c.rect(10+swing,39+bob,5,6,"n");c.rect(18-swing,39+bob,5,6,"n")
 c.rect(9+swing,44+bob,7,2,"y");c.rect(17-swing,44+bob,7,2,"y")
 c.rect(10,21+bob,13,18,robe);c.rect(7,24+bob,5,11,robe);c.rect(21,24+bob,5,11,robe)
 c.rect(9,36+bob,16,3,trim);c.vline(16,22+bob,15,sash);c.hline(10,29+bob,13,trim);c.px(16,26+bob,"W")
 if(back){c.rect(10,7+bob,13,14,hair);c.rect(8,11+bob,4,12,hair);c.rect(21,11+bob,4,12,hair);c.rect(11,19+bob,11,4,hair)}
 else{
  const shift=side<0?-1:side>0?1:0
  c.rect(11+shift,8+bob,11,12,skin);c.rect(9+shift,6+bob,14,6,hair)
  c.rect(8+shift,10+bob,4,9,hair);c.rect(20+shift,10+bob,4,8,hair);c.rect(11+shift,17+bob,11,4,hair)
  if(side===0){c.px(13,14+bob,"k");c.px(19,14+bob,"k");c.hline(14,17+bob,5,"r")}
  else{c.px(side>0?19:12,14+bob,"k");c.px(side>0?19:12,17+bob,"s")}
 }
 if(look.hat){c.rect(8,5+bob,16,3,look.hat);c.rect(11,2+bob,10,4,look.hat);c.hline(10,8+bob,14,trim)}
 if(look.longHair){c.rect(9,15+bob,4,13,hair);c.rect(21,15+bob,4,13,hair)}
 c.px(16,32+bob,trim);c.hline(12,39+bob,9,robe)
}
const CAST=[
["player-idle",{robe:"b",trim:"Y",sash:"r",hair:"k"}],
["student-lin-idle",{robe:"w",trim:"Y",sash:"r",hair:"k"}],
["student-wei-idle",{robe:"b",trim:"G",sash:"y",hair:"n"}],
["teacher-mei-idle",{robe:"p",trim:"Y",sash:"r",hair:"k",longHair:true}],
["groundskeeper-idle",{robe:"g",trim:"Y",sash:"n",hair:"n",hat:"t",skin:"S"}]
]
for(const [name,look] of CAST)anim(name,{w:32,h:48,frames:32,fps:8,pivot:[16,46]},c=>drawAcademyCharacter(c,look))
