// Original 2D Academy cast. 8 headings × 4 frames; consistent 32×48 cells and bottom-center ground pivot.
pal({
  k:"#211b20",n:"#49362e",d:"#715044",
  b:"#34536b",B:"#688ea3",g:"#536b4d",G:"#91a878",
  r:"#803f43",R:"#c06d5d",p:"#705a84",P:"#b39ac3",
  y:"#b58a4f",Y:"#ead08b",s:"#b9795e",S:"#e6b18c",
  w:"#e9e1ce",W:"#fff4db",t:"#8f8778",T:"#c7baa4",
  c:"#527e80",C:"#9ac6bb",o:"#9c6948",O:"#d59a67",
})
function drawAcademyCharacter(c,look) {
  const frame=c.frame||0,dir=Math.floor(frame/4),step=frame%4
  const moving=step>=2,walkPhase=step===2?1:step===3?-1:0
  const bob=moving?(step===2?0:1):(step===1?1:0)
  const side=dir===1||dir===2||dir===3?1:dir===5||dir===6||dir===7?-1:0
  const back=dir===4,front=dir===0
  const diagonal=dir===1||dir===3||dir===5||dir===7
  const sx=side===0?0:side
  const skin=look.skin||"S",hair=look.hair||"k",robe=look.robe||"b"
  const trim=look.trim||"Y",sash=look.sash||"r",shoe=look.shoe||"n"
  const armSwing=moving?walkPhase:0

  // Ground shadow and shoes keep the sprite's foot pivot unchanged in every frame.
  c.ellipse(16,46,9,2,"k")
  c.rect(9+armSwing,42+bob,6,4,shoe)
  c.rect(18-armSwing,42+bob,6,4,shoe)
  c.hline(10+armSwing,42+bob,4,trim)
  c.hline(19-armSwing,42+bob,4,trim)

  // Layered robe, wide sleeves and embroidered hem.
  c.rect(10,21+bob,13,19,robe)
  c.rect(7-armSwing,24+bob,5,12,robe)
  c.rect(21+armSwing,24+bob,5,12,robe)
  c.rect(8-armSwing,33+bob,4,3,trim)
  c.rect(21+armSwing,33+bob,4,3,trim)
  c.rect(9,36+bob,15,3,trim)
  c.hline(10,39+bob,13,sash)
  c.vline(16,22+bob,14,sash)
  c.vline(15,23+bob,10,trim)
  c.px(16,27+bob,"W")
  c.px(12,32+bob,trim);c.px(20,32+bob,trim)

  // Face direction is explicit: front, three-quarter, profile and back are not the same mirrored face.
  if(back) {
    c.rect(10,8+bob,13,13,hair)
    c.rect(8,12+bob,4,13,hair);c.rect(21,12+bob,4,13,hair)
    c.rect(10,19+bob,13,4,hair)
    if(look.longHair){c.rect(8,18+bob,4,13,hair);c.rect(21,18+bob,4,13,hair)}
  } else {
    const faceX=11+sx
    c.rect(faceX,9+bob,11,12,skin)
    c.rect(faceX-2,7+bob,15,6,hair)
    c.rect(faceX-3,11+bob,4,9,hair)
    c.rect(faceX+10,11+bob,4,8,hair)
    c.rect(faceX,18+bob,11,4,hair)
    if(front) {
      c.px(faceX+2,14+bob,"k");c.px(faceX+8,14+bob,"k")
      c.hline(faceX+3,17+bob,6,look.lip||"r")
      c.px(faceX+1,16+bob,"s");c.px(faceX+9,16+bob,"s")
    } else {
      const eye=side>0?faceX+7:faceX+2
      c.px(eye,14+bob,"k");c.px(eye,17+bob,"s")
      if(diagonal)c.px(side>0?faceX+2:faceX+7,14+bob,"s")
    }
    if(look.longHair){c.rect(faceX-2,16+bob,4,15,hair);c.rect(faceX+10,16+bob,4,15,hair)}
    if(look.bun){c.circ(faceX+8,6+bob,4,hair);c.px(faceX+8,4+bob,trim)}
    if(look.ribbon){c.rect(faceX-2,9+bob,4,2,look.ribbon);c.rect(faceX+9,9+bob,4,2,look.ribbon)}
    if(look.headband){c.hline(faceX-1,10+bob,13,look.headband)}
    if(look.beard){c.rect(faceX+2,19+bob,8,5,look.beard);c.px(faceX+5,23+bob,trim)}
  }
  if(look.hat) {
    c.rect(7,5+bob,18,3,look.hat)
    c.rect(10,2+bob,12,4,look.hat)
    c.hline(9,8+bob,14,trim)
    c.px(16,3+bob,"W")
  }
  if(look.badge){c.rect(20,28+bob,4,5,look.badge);c.px(22,29+bob,"W")}
  if(look.staff){c.vline(27,19+bob,25,look.staff);c.px(27,17+bob,trim)}
}
const CAST=[
  ["player-idle",{robe:"b",trim:"Y",sash:"r",hair:"k",longHair:true,ribbon:"R",badge:"Y"}],
  ["student-lin-idle",{robe:"w",trim:"Y",sash:"r",hair:"k",ribbon:"R",lip:"r"}],
  ["student-wei-idle",{robe:"b",trim:"G",sash:"y",hair:"n",headband:"Y",badge:"C"}],
  ["teacher-mei-idle",{robe:"p",trim:"Y",sash:"r",hair:"k",longHair:true,bun:true,ribbon:"P",badge:"Y"}],
  ["groundskeeper-idle",{robe:"g",trim:"Y",sash:"n",hair:"n",hat:"t",skin:"S",beard:"n",staff:"n"}],
  ["teacher-master-idle",{robe:"p",trim:"Y",sash:"r",hair:"n",longHair:true,beard:"n",badge:"Y"}],
  ["bg-guide-idle",{robe:"g",trim:"Y",sash:"n",hair:"n",hat:"t",staff:"n"}],
  ["bg-trainee-idle",{robe:"w",trim:"R",sash:"b",hair:"n",headband:"R"}],
  ["bg-attendant-idle",{robe:"c",trim:"G",sash:"y",hair:"n",longHair:true,badge:"Y"}],
]
for(const [name,look] of CAST) {
  anim(name,{w:32,h:48,frames:32,fps:8,pivot:[16,46]},c=>drawAcademyCharacter(c,look))
}
