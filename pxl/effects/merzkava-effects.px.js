// Lightweight PXL sprite-sheet effects. All are decorative overlays and can be paused independently.
pal({k:"#171d25",n:"#34404a",b:"#496b70",B:"#80a5a0",g:"#587d58",G:"#a0c17c",y:"#d2a75b",Y:"#f2db91",r:"#9f514a",R:"#df8766",p:"#806baf",P:"#c4a9e8",c:"#6b9db7",C:"#b5e4eb",w:"#f4efd9"})
function ringFrame(c,tier){
 const f=c.frame||0,phase=f*Math.PI/4,colors=[["b","B"],["g","G"],["y","Y"],["p","P"]][tier-1]
 const radius=10+tier*2
 for(let y=2;y<46;y++)for(let x=2;x<46;x++){
  const dx=x-24,dy=y-24,d=Math.sqrt(dx*dx+dy*dy)
  const wobble=Math.sin(Math.atan2(dy,dx)*4+phase)*1.5
  if(Math.abs(d-radius-wobble)<1.7)c.px(x,y,colors[0])
  if(Math.abs(d-radius-wobble)<0.7)c.px(x,y,colors[1])
 }
 for(let i=0;i<8;i++){const a=phase+i*Math.PI/4,x=Math.round(24+Math.cos(a)*(radius+4)),y=Math.round(24+Math.sin(a)*(radius+4));c.px(x,y,"w")}
}
for(let tier=1;tier<=4;tier++)anim("spirit-ring-tier-"+tier,{w:48,h:48,frames:8,fps:8,pivot:"center"},c=>ringFrame(c,tier))
anim("water-shimmer",{w:64,h:32,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0
 for(let row=0;row<4;row++){const y=5+row*6,offset=(f*3+row*9)%64;for(let i=0;i<18;i++){const x=(offset+i*4)%64;if(i%4!==3)c.px(x,y+(i%3===0?1:0),i%2?"C":"B")}}
})
anim("foliage-idle",{w:48,h:48,frames:8,fps:6,pivot:"center"},c=>{
 const f=c.frame||0,dx=Math.round(Math.sin(f*Math.PI/4)*1)
 for(const [x,y,r] of [[15,17,8],[27,13,7],[22,25,9],[34,24,6]]){c.circ(x+dx,y,r,"g");c.circ(x+dx-2,y-2,Math.max(2,r-3),"G");c.px(x+dx+1,y-3,"Y")}
 c.vline(23,25,17,"n");c.vline(24,27,15,"y")
})
anim("foliage-wind",{w:48,h:48,frames:8,fps:10,pivot:"center"},c=>{
 const f=c.frame||0,dx=Math.round(Math.sin(f*Math.PI/4)*4)
 c.vline(23,24,19,"n")
 for(const [x,y] of [[12,17],[20,12],[29,15],[34,24],[16,28],[27,29]]){c.ellipse(x+dx,y,7,4,"g");c.ellipse(x+dx-1,y-1,4,2,"G")}
})
anim("cloud-motion",{w:64,h:32,frames:8,fps:6,pivot:"center"},c=>{
 const dx=(c.frame||0)*2
 c.circ(18+dx,18,8,"B");c.circ(28+dx,14,10,"C");c.circ(39+dx,18,8,"B");c.hline(13+dx,21,33,"C")
})
anim("weather-rain",{w:32,h:48,frames:8,fps:12,pivot:"center"},c=>{
 const f=c.frame||0
 for(let i=0;i<8;i++){const x=(i*9+f*3)%32,y=(i*13+f*6)%48;c.vline(x,y,4,"C");c.px(x+1,y+3,"B")}
})
anim("weather-snow",{w:32,h:48,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0
 for(let i=0;i<10;i++){const x=(i*11+Math.round(Math.sin(f+i)*2)+32)%32,y=(i*7+f*3)%48;c.px(x,y,"w");c.px(x+1,y,"C");if(i%2===0)c.px(x,y+1,"w")}
})
anim("weather-petals",{w:32,h:48,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0
 for(let i=0;i<7;i++){const x=(i*13+f*2)%32,y=(i*9+f*4)%48;c.ellipse(x,y,2,1,i%2?"P":"R");c.px(x+1,y,"w")}
})
sprite("lighting-day",{w:64,h:64},c=>{for(let i=0;i<8;i++){c.hline(5,8+i*7,54,"Y");c.hline(10,9+i*7,44,"G")}c.circ(50,13,5,"w")})
sprite("lighting-dusk",{w:64,h:64},c=>{for(let i=0;i<8;i++)c.hline(5,8+i*7,54,"r");c.circ(48,18,7,"Y");c.hline(5,55,54,"p")})
sprite("lighting-night",{w:64,h:64},c=>{c.circ(48,14,8,"C");c.circ(52,11,7,"b");for(const [x,y] of [[10,10],[24,18],[38,7],[15,39],[51,42]])c.px(x,y,"w")})
anim("martial-soul-activation",{w:48,h:48,frames:8,fps:12,pivot:"center"},c=>{
 const f=c.frame||0,r=7+f*2
 for(let a=0;a<16;a++){const angle=(a/16)*Math.PI*2+f*.18,x=Math.round(24+Math.cos(angle)*r),y=Math.round(24+Math.sin(angle)*r);c.px(x,y,a%2?"Y":"w")}
 c.circ(24,24,3,"G")
})
anim("martial-soul-aura",{w:48,h:48,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0
 for(let i=0;i<12;i++){const a=i*Math.PI/6+f*.12,r=10+(i%3)*3,x=Math.round(24+Math.cos(a)*r),y=Math.round(24+Math.sin(a)*r);c.circ(x,y,2,i%2?"G":"Y")}
})
anim("arcanistry-cast",{w:48,h:48,frames:8,fps:12,pivot:"center"},c=>{
 const f=c.frame||0
 for(let i=0;i<4;i++){const x=8+i*10,y=8+((f+i*3)%8)*4;c.rect(x,y,3,3,i%2?"C":"P");c.px(x+1,y-2,"w")}
 c.circ(24,24,9,"p");c.circ(24,24,6,"P");c.px(24,24,"w")
})
anim("artifact-pulse",{w:48,h:48,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0,r=6+f*2
 for(let a=0;a<24;a++){const angle=a*Math.PI/12,x=Math.round(24+Math.cos(angle)*r),y=Math.round(24+Math.sin(angle)*r);c.px(x,y,a%3?"G":"w")}
 c.rect(19,19,10,10,"n");c.rect(21,21,6,6,"y");c.px(24,24,"w")
})
anim("spirit-beast-appearance",{w:64,h:48,frames:8,fps:8,pivot:"center"},c=>{
 const f=c.frame||0,r=7+f
 c.circ(32,25,r,"g");c.circ(32,23,Math.max(2,r-3),"G");c.px(29,22,"k");c.px(35,22,"k")
 for(let i=0;i<4;i++){const x=14+i*12;c.px(x,8+(i*3+f)%8,"Y")}
})
anim("spirit-beast-movement",{w:64,h:48,frames:8,fps:10,pivot:"center"},c=>{
 const f=c.frame||0,dx=f%2?2:0
 c.ellipse(32+dx,29,15,7,"g");c.circ(45+dx,20,7,"G");c.px(47+dx,19,"k")
 c.rect(20+dx,30,4,10,"n");c.rect(37+dx,30,4,10,"n")
 c.ellipse(16+dx,19,10,5,"G");c.px(48+dx,23,"Y")
})
