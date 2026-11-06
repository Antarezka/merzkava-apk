// Original stylized 2D Academy cast. Eight genuinely distinct headings × four frames.
// Frame canvas and bottom-center foot pivot are fixed at 32×48 / [16,46] for the existing actor layer.
pal({k:"#241d1b",n:"#49362e",d:"#715044",b:"#456b73",B:"#78a0a0",g:"#667b59",G:"#9cac7b",r:"#8c4140",R:"#c16f59",p:"#785e83",P:"#b39ac0",y:"#b58a4f",Y:"#ead08b",s:"#b9795e",S:"#e6b18c",w:"#e9e1ce",W:"#fff4db",t:"#8f8778"})
function drawAcademyCharacter(c,look){
 const frame=c.frame||0,dir=Math.floor(frame/4),step=frame%4,walking=step>=2
 const bob=walking?(step===2?0:1):(step===1?1:0)
 const stride=walking?(step===2?1:-1):0
 const right=[1,2,3].includes(dir),left=[5,6,7].includes(dir)
 const front=dir===0,frontDiagonal=dir===1||dir===7,profile=dir===2||dir===6
 const backDiagonal=dir===3||dir===5,back=dir===4
 const sideOffset=right?1:left?-1:0,mirror=left
 const skin=look.skin||"S",hair=look.hair||"k",robe=look.robe||"b",trim=look.trim||"Y",sash=look.sash||"r"
 const headX=profile?(right?15:9):frontDiagonal?(right?12:10):16
 const faceWidth=profile?8:frontDiagonal?11:12
 const robeLeft=profile?(right?13:9):10,robeWidth=profile?10:13

 // Ground shadow, shoes and trouser legs stay registered to the same foot pivot in every frame.
 c.ellipse(16,45,8,2,"k")
 c.rect(11+stride,38+bob,4,7,"n");c.rect(18-stride,38+bob,4,7,"n")
 c.rect(9+stride,44+bob,7,2,"y");c.rect(17-stride,44+bob,7,2,"y")
 c.hline(10+stride,44+bob,5,"Y");c.hline(18-stride,44+bob,5,"Y")

 // Layered academy robe: dark silhouette, broad shoulder line, crossed lapels and an anchored hem.
 c.rect(robeLeft-2,22+bob,robeWidth+4,18,"k")
 c.rect(robeLeft,22+bob,robeWidth,17,robe)
 if(!profile){
  c.rect(7,24+bob,5,11,robe);c.rect(20,24+bob,5,11,robe)
  c.rect(7,32+bob,6,4,trim);c.rect(19,32+bob,6,4,trim)
  c.rect(9,37+bob,14,2,trim)
  c.vline(10,25+bob,10,"d");c.vline(22,25+bob,10,"n")
  c.vline(12,24+bob,12,"B");c.vline(20,24+bob,12,"n")
  c.vline(16,23+bob,14,sash);c.hline(11,27+bob,10,trim)
  c.poly([12,22+bob,16,27+bob,20,22+bob,18,22+bob,16,25+bob,14,22+bob],trim)
  c.hline(10,38+bob,13,trim)
 }else{
  const sleeveX=right?20:6
  c.rect(sleeveX,24+bob,6,12,robe);c.rect(sleeveX,33+bob,6,3,trim)
  c.vline(robeLeft+2,24+bob,13,"B");c.vline(robeLeft+robeWidth-2,24+bob,13,"n")
  c.vline(right?robeLeft+2:robeLeft+robeWidth-2,23+bob,14,sash)
  c.hline(robeLeft,38+bob,robeWidth,trim)
 }
 c.px(16+sideOffset,30+bob,"W");c.px(16+sideOffset,32+bob,trim)
 if(look.emblem){c.rect(14+sideOffset,34+bob,5,3,look.emblem);c.px(16+sideOffset,35+bob,"W")}

 // Neck and face planes. South, both front diagonals, and east/west profiles each get their own view.
 c.rect(headX+2,18+bob,faceWidth-4,5,skin)
 if(front||frontDiagonal||profile){
  c.rect(headX,8+bob,faceWidth,12,skin)
  c.hline(headX+2,8+bob,faceWidth-4,"W")
  if(front){
   c.px(headX+3,14+bob,"k");c.px(headX+faceWidth-4,14+bob,"k")
   c.hline(headX+5,17+bob,3,"r")
  }else if(frontDiagonal){
   const eye=right?headX+faceWidth-4:headX+3
   c.px(eye,14+bob,"k");c.px(eye+(right?-1:1),17+bob,"s")
   c.px(right?headX+3:headX+faceWidth-4,"d")
  }else{
   const eye=right?headX+faceWidth-3:headX+2
   c.px(eye,14+bob,"k");c.px(eye+(right?-1:1),17+bob,"s")
   c.vline(right?headX:headX+faceWidth-1,12+bob,5,"d")
  }
 }else{
  // North and rear diagonals expose the hair silhouette, tied section and robe collar—not a front face.
  c.rect(headX,8+bob,faceWidth,13,hair)
  c.rect(headX+1,18+bob,faceWidth-2,4,hair)
  c.hline(headX+2,7+bob,faceWidth-4,"n")
  if(backDiagonal){c.rect(right?headX:headX+faceWidth-3,12+bob,3,8,"d")}
 }

 // Hair cap and locks. A profile is narrow; diagonals keep one side of the face visible.
 if(front||frontDiagonal||profile){
  c.rect(headX-1,6+bob,faceWidth+2,5,hair)
  c.rect(headX-1,10+bob,3,8,hair)
  c.rect(headX+faceWidth-2,10+bob,3,7,hair)
  c.hline(headX+2,18+bob,faceWidth-4,hair)
 }else{
  c.rect(headX-1,6+bob,faceWidth+2,7,hair)
  c.rect(headX-2,11+bob,4,12,hair)
  c.rect(headX+faceWidth-2,11+bob,4,12,hair)
 }
 if(look.longHair){
  c.rect(headX-1,14+bob,4,14,hair);c.rect(headX+faceWidth-3,14+bob,4,14,hair)
  c.hline(headX+2,25+bob,faceWidth-4,"d")
 }
 if(look.hat){c.rect(headX-3,5+bob,faceWidth+6,3,look.hat);c.rect(headX+2,1+bob,faceWidth-4,5,look.hat);c.hline(headX-2,8+bob,faceWidth+4,trim)}
 if(look.hairOrnament){c.px(headX+faceWidth-2,8+bob,look.hairOrnament);c.px(headX+faceWidth,10+bob,"W")}
 if(look.glasses&& (front||frontDiagonal||profile)){
  c.hline(headX+1,13+bob,faceWidth-2,"t");c.px(headX+2,14+bob,"W");c.px(headX+faceWidth-3,14+bob,"W")
 }
 // Sleeve cuffs and hem glints remain small enough to read at the actual phone scale.
 c.hline(8,35+bob,5,trim);c.hline(19,35+bob,5,trim)
 c.px(11,39+bob,"W");c.px(21,39+bob,"W")
}
const CAST=[
 ["player-idle",{robe:"b",trim:"Y",sash:"r",hair:"k",glasses:true}],
 ["student-lin-idle",{robe:"w",trim:"Y",sash:"r",hair:"k",hairOrnament:"R"}],
 ["student-wei-idle",{robe:"b",trim:"G",sash:"y",hair:"n"}],
 ["teacher-mei-idle",{robe:"p",trim:"Y",sash:"r",hair:"k",longHair:true,hairOrnament:"P"}],
 ["groundskeeper-idle",{robe:"g",trim:"Y",sash:"n",hair:"n",hat:"t",skin:"S"}],
 ["teacher-master-idle",{robe:"p",trim:"Y",sash:"r",hair:"n",longHair:true,hairOrnament:"y"}],
 ["bg-guide-idle",{robe:"g",trim:"Y",sash:"n",hair:"n",hat:"t"}],
 ["bg-trainee-idle",{robe:"w",trim:"R",sash:"b",hair:"n"}],
 ["bg-attendant-idle",{robe:"b",trim:"G",sash:"y",hair:"n",hairOrnament:"Y"}],
]
for(const [name,look] of CAST)anim(name,{w:32,h:48,frames:32,fps:8,pivot:[16,46]},c=>drawAcademyCharacter(c,look))
