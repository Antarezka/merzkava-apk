// Merzkava PXL World Atlas: original regional and isometric scene artwork.
// App-owned marker coordinates, region IDs, grid and walkability remain authoritative.
use("endesga32")
genre("atlas-art",{mix:true})

function hill(c,x,y,w,h,base,light){
  for(let row=0;row<h;row++){
    const half=Math.max(1,Math.floor((row+1)*w/(2*h)))
    c.hline(x-half,y-h+row,half*2,base)
    if(row<h*.45)c.hline(x-Math.floor(half*.45),y-h+row,Math.max(1,Math.floor(half*.9)),light)
  }
  c.hline(x-Math.floor(w*.18),y-h+Math.floor(h*.48),Math.floor(w*.36),"w")
}
function pine(c,x,y,s=1,leaf="g"){
  c.ellipse(x,y+7*s,8*s,2*s,"k")
  c.vline(x-1*s,y-5*s,12*s,"n")
  for(let i=0;i<3;i++){
    const half=(7-i*2)*s,yy=y-7*s+i*6*s
    c.hline(x-half,yy,half*2,leaf)
    c.hline(x-half*.55,yy+1,half*1.1,"g")
  }
  c.px(x,y-10*s,"h")
}
function pavilion(c,x,y,s=1,roof="r"){
  c.rect(x-18*s,y-3*s,36*s,17*s,"n")
  c.rect(x-14*s,y,28*s,14*s,"y")
  c.rect(x-3*s,y+4*s,6*s,10*s,"k")
  for(let i=-1;i<=1;i+=2)c.vline(x+i*12*s,y+2*s,12*s,"n")
  for(let row=0;row<8;row++){
    const half=Math.floor((18-row*2.2)*s)
    if(half>0)c.hline(x-half,y-6*s+row*s,half*2,roof)
  }
  c.hline(x-20*s,y-7*s,40*s,"y")
  c.vline(x,y-13*s,5*s,"y")
}
function drawWorld(c){
  c.rect(0,0,1024,610,"b")
  for(let y=9;y<610;y+=22){
    const dx=(Math.floor(y/22)%4)*8
    for(let x=8+dx;x<1020;x+=83){
      c.hline(x,y,23,y%3===0?"c":"b")
      if((x+y)%4===0)c.px(x+13,y+3,"w")
    }
  }
  c.ellipse(560,42,276,95,"g");c.ellipse(552,31,240,73,"g")
  hill(c,460,85,208,115,"s","s");hill(c,575,92,190,124,"s","w");hill(c,682,93,150,95,"n","s")
  for(let i=0;i<13;i++)pine(c,386+i*28,77+(i%4)*13,.62,i%2?"g":"g")
  c.ellipse(843,254,167,143,"g");c.ellipse(850,250,143,120,"g");c.ellipse(796,278,83,77,"h")
  hill(c,942,204,116,82,"s","s");pavilion(c,840,265,1.6,"r")
  for(let i=0;i<14;i++)pine(c,726+(i*53)%250,163+(i*37)%177,.58+(i%3)*.12,"g")
  c.ellipse(178,268,157,119,"g");c.ellipse(179,264,127,93,"g")
  c.ellipse(176,204,82,25,"s");c.ellipse(176,195,72,21,"c");c.ellipse(176,184,50,13,"w")
  hill(c,172,226,75,53,"n","s");pavilion(c,181,231,.92,"p")
  for(const [x,y] of [[68,290],[105,326],[214,315],[252,274],[118,216],[222,233]])pine(c,x,y,.62)
  c.ellipse(520,370,182,104,"g");c.ellipse(522,360,151,82,"g")
  hill(c,505,369,142,80,"n","s");hill(c,602,375,118,70,"s","s")
  for(let i=0;i<22;i++)pine(c,390+(i*47)%260,343+(i*31)%105,.54+(i%3)*.1)
  for(let y=478;y<602;y+=22)for(let x=12+(y%4)*9;x<1020;x+=74)c.hline(x,y,25,"b")
  for(const [x,y,s] of [[702,500,.9],[765,533,.7],[842,507,.8],[911,552,.7],[90,453,.9],[281,493,.7]]){
    c.ellipse(x,y+8,23*s,6*s,"k");c.ellipse(x,y,22*s,6*s,"g");pine(c,x,y-4,.48*s)
  }
  for(const [x,y] of [[272,370],[340,414],[517,470],[706,431],[811,400],[940,371]]){
    c.hline(x,y,38,"y");c.px(x,y,"w");c.px(x+36,y,"w")
  }
}
sprite("world-map-overview",{w:1024,h:610},c=>drawWorld(c))

function drawRegion(c,id,index){
  const sea=/(sea|canghai|passage|harbour|harbor|port|isle)/i.test(id)
  const cold=/(beiming|frost|snow|silverpine|nine-frost|high-cloud)/i.test(id)
  const forest=/(forest|azerion|wilds|wanluo)/i.test(id)
  const ruin=/(labyrinth|dead-zone|exit)/i.test(id)
  const imperial=/(golden-dragon|dongxing|mingzhu|lanfan|chaoguan|yuhai|yuandeng|longchao)/i.test(id)
  const floating=/(tianhai|yunmeng)/i.test(id)
  const ground=sea?"b":cold?"s":forest?"g":ruin?"n":imperial?"g":"h"
  const highlight=sea?"b":cold?"s":forest?"g":ruin?"p":imperial?"y":"c"
  const shade=sea?"n":cold?"n":forest?"g":ruin?"k":imperial?"n":"s"
  c.rect(0,0,480,320,ground)
  for(let y=7;y<318;y+=17){
    const offset=(y/17%4)*11
    for(let x=offset;x<478;x+=61){
      c.hline(x,y,18,highlight)
      if((x+y+index)%5===0)c.px(x+9,y+2,"w")
    }
  }
  if(sea){
    for(let y=29;y<310;y+=25)for(let x=(y%3)*17;x<475;x+=77){
      c.hline(x,y,33,"b");c.hline(x+6,y+4,18,"c")
    }
    c.ellipse(82,261,112,75,"g");c.ellipse(84,254,91,58,"g")
    c.ellipse(417,84,68,51,"g");c.ellipse(418,80,52,34,"g")
  }else{
    c.ellipse(230,170,232,151,"g");c.ellipse(235,162,204,126,"g")
    for(let i=0;i<5;i++)hill(c,56+i*91,164+(i%2)*26,88,65+(i%3)*14,shade,cold?"w":"s")
  }
  if(cold){
    for(let i=0;i<17;i++)pine(c,15+i*27,238+(i%4)*13,.62,i%2?"g":"g")
    for(let i=0;i<16;i++)c.px((i*37+index*13)%476,(i*19+45)%260,"w")
  }else if(forest){
    for(let i=0;i<26;i++)pine(c,18+(i*71+index*17)%450,194+(i*37+index*9)%112,.6+(i%3)*.12)
  }else if(ruin){
    for(const [x,y] of [[76,208],[132,181],[191,218],[276,181],[344,211],[405,189]]){
      c.rect(x-12,y-31,24,42,"n");c.rect(x-7,y-25,14,31,"s");c.hline(x-16,y-33,32,"s");c.rect(x-3,y-16,6,17,"k")
    }
    c.ellipse(242,147,57,37,"p");c.ellipse(242,147,38,24,"p");c.ellipse(242,147,20,12,"k")
  }else{
    if(imperial||floating)pavilion(c,246,218,1.16,floating?"p":"r")
    for(let i=0;i<6;i++)pine(c,62+i*69,251+(i%2)*21,.7)
  }
  if(floating){
    c.ellipse(236,93,116,22,"k");c.ellipse(236,82,112,26,"s");c.ellipse(236,73,90,20,"c")
    hill(c,232,115,84,58,"n","s")
    for(let i=0;i<5;i++)pine(c,160+i*37,70+(i%2)*8,.55)
  }
  if(/port|harbour|harbor/i.test(id)){
    c.rect(33,250,415,9,"n");c.hline(36,249,411,"y")
    for(let x=60;x<435;x+=43){c.vline(x,225,30,"n");c.hline(x-8,225,16,"y")}
    c.vline(213,157,67,"n");c.hline(214,166,48,"r");c.hline(214,171,48,"y")
    for(let i=0;i<4;i++)c.rect(57+i*98,209-(i%2)*18,30,17,"y")
  }
  if(/tower|wanluo/i.test(id)){
    c.rect(224,82,28,128,"n");c.rect(230,88,16,118,"y")
    for(let y=98;y<189;y+=22){c.hline(207,y,62,"r");c.hline(215,y+4,46,"y")}
    c.px(238,69,"w")
  }
  if(/lantern|passage/i.test(id)){
    for(let i=0;i<8;i++){const x=35+i*58;c.vline(x,110+(i%3)*24,80,"n");c.rect(x-5,111+(i%3)*24,11,14,"r");c.px(x,115+(i%3)*24,"y")}
  }
  if(/isle|expanse/i.test(id)){
    for(let i=0;i<6;i++){const x=38+i*78;c.ellipse(x,284-(i%2)*12,25,8,"k");c.ellipse(x,279-(i%2)*12,22,7,"g");pine(c,x,274-(i%2)*12,.45)}
  }
  c.hline(0,305,480,"y");c.hline(0,307,480,shade)
  for(let i=0;i<8;i++)c.px(16+i*62,300,"w")
}
const REGION_IDS=["golden-dragon-empire","tianhai-yunzhou","beiming-gu","lawless-territories","ashen-borderlands","black-tide-expanse","nine-frost-wastes","wanluo-sacred-expanse","azerion-forest","dead-zone","inner-azerion","mega-colossal-labyrinth","high-cloud-sea-mountains","silverpine-wilds","frostmirror-sea","eastern-azure-sea","yunmeng-sea","wufeng-sea","black-tide-sea","guixu-canghai","lanternhook-isles","mega-colossal-labyrinth-exit","lantern-passage","changqion-harbour","three-lantern-passage","southwake-port","bitterglass-isle","dicewake-isle","dongxing-port","mingzhu-port","lanfan-port","chaoguan-port","yuhai-port","yuandeng-port","longchao-port"]
for(let i=0;i<REGION_IDS.length;i++){
  const id=REGION_IDS[i]
  sprite("region-"+id,{w:480,h:320},c=>drawRegion(c,id,i))
}

// 24 × 20 isometric local environments. Player and NPC stay separate 2D sprites.
function isoPoint(x,y){return {x:Math.round(320+(x-y)*16),y:Math.round(5+(x+y)*8.65)}}
function isoTile(c,x,y,top,left,right){
  const p=isoPoint(x,y)
  for(let row=0;row<=16;row++){
    const half=Math.floor(row<=8?row*2:(16-row)*2)
    c.hline(p.x-half,p.y-8+row,Math.max(1,half*2),top)
  }
  for(let row=0;row<6;row++){
    c.hline(p.x-16+row,p.y+9+row,1,left)
    c.hline(p.x+15-row,p.y+9+row,1,right)
  }
  c.px(p.x-13,p.y-1,top==="b"?"c":"h")
}
function isoTree(c,x,y,leaf){
  const p=isoPoint(x,y)
  c.ellipse(p.x,p.y+8,12,3,"k");c.vline(p.x-1,p.y-16,22,"n")
  for(let row=0;row<3;row++){
    const half=15-row*4
    c.hline(p.x-half,p.y-32+row*8,half*2,leaf)
    c.hline(p.x-half/2,p.y-30+row*8,half,"g")
  }
  c.px(p.x+2,p.y-30,"h")
}
function isoHouse(c,x,y,wall,roof){
  const p=isoPoint(x,y)
  c.rect(p.x-12,p.y-24,24,29,"n");c.rect(p.x-9,p.y-20,18,24,wall);c.rect(p.x-3,p.y-9,6,13,"k")
  for(let row=0;row<10;row++){
    const half=Math.floor(18-row*1.8)
    c.hline(p.x-half,p.y-31+row,half*2,roof)
  }
  c.hline(p.x-20,p.y-32,40,"y");c.vline(p.x-12,p.y-21,25,"s");c.vline(p.x+11,p.y-21,25,"s")
}
function drawLocal(c,kind){
  const cfg=kind==="golden-dragon-empire"
    ?{ground:"g",path:"s",left:"g",right:"n",wall:"y",roof:"r",tree:"g",water:"b"}
    :kind==="tianhai-yunzhou"
    ?{ground:"c",path:"w",left:"b",right:"n",wall:"s",roof:"p",tree:"g",water:"b"}
    :{ground:"s",path:"s",left:"n",right:"k",wall:"w",roof:"b",tree:"g",water:"b"}
  c.rect(0,0,704,384,kind==="tianhai-yunzhou"?"b":kind==="beiming-gu"?"s":"g")
  for(let y=0;y<20;y++)for(let x=0;x<24;x++){
    const avenue=(x>=10&&x<=13)||(y>=9&&y<=11)
    const pond=kind==="tianhai-yunzhou"&&((x<4&&y>12)||(x>19&&y<6))
    const top=pond?cfg.water:avenue?cfg.path:cfg.ground
    isoTile(c,x,y,top,cfg.left,cfg.right)
    if(!avenue&&!pond&&(x*13+y*7)%13===0)c.px(isoPoint(x,y).x,isoPoint(x,y).y-2,"h")
  }
  if(kind==="golden-dragon-empire"){
    for(const [x,y] of [[3,3],[7,4],[17,3],[20,6],[4,15],[18,15],[7,17],[16,17]])isoHouse(c,x,y,"y","r")
    for(const [x,y] of [[2,7],[5,12],[18,11],[22,14],[8,4],[15,5],[3,17],[20,17]])isoTree(c,x,y,"g")
    isoHouse(c,12,2,"y","r");isoHouse(c,12,18,"y","r")
    const gate=isoPoint(12,10)
    c.vline(gate.x-32,gate.y-42,36,"n");c.vline(gate.x+32,gate.y-42,36,"n")
    c.hline(gate.x-35,gate.y-43,70,"r");c.hline(gate.x-37,gate.y-40,74,"y")
  }else if(kind==="tianhai-yunzhou"){
    for(const [x,y] of [[4,4],[8,3],[15,3],[19,5],[6,15],[17,15]])isoHouse(c,x,y,"s","p")
    for(const [x,y] of [[2,8],[5,11],[18,9],[22,13],[8,17],[15,17]])isoTree(c,x,y,"g")
    for(let x=3;x<21;x+=2){const p=isoPoint(x,8);c.hline(p.x-12,p.y-15,25,"c")}
    for(let x=5;x<20;x+=3){const p=isoPoint(x,13);c.hline(p.x-9,p.y-10,19,"y")}
    c.ellipse(110,64,78,16,"k");c.ellipse(110,57,72,15,"s");c.ellipse(110,51,58,12,"c")
  }else{
    for(const [x,y] of [[3,3],[7,4],[17,3],[20,6],[4,15],[18,15],[8,17]])isoHouse(c,x,y,"s","b")
    for(const [x,y] of [[2,7],[5,12],[18,11],[22,14],[8,4],[15,5],[3,17],[20,17]])isoTree(c,x,y,"g")
    for(let x=0;x<24;x+=2){const p=isoPoint(x,6);c.hline(p.x-8,p.y-13,16,"w")}
    for(let i=0;i<18;i++)c.px((i*37)%704,(i*53)%370,"c")
  }
}
sprite("local-default",{w:704,h:384},c=>drawLocal(c,"golden-dragon-empire"))
sprite("local-golden-dragon-empire",{w:704,h:384},c=>drawLocal(c,"golden-dragon-empire"))
sprite("local-tianhai-yunzhou",{w:704,h:384},c=>drawLocal(c,"tianhai-yunzhou"))
sprite("local-beiming-gu",{w:704,h:384},c=>drawLocal(c,"beiming-gu"))
sprite("academy-minimap",{w:352,h:192},c=>{
  c.rect(0,0,352,192,"g");c.rect(12,10,328,172,"g")
  c.rect(60,24,232,40,"s");c.rect(139,62,74,82,"s")
  c.rect(24,84,82,54,"s");c.rect(246,82,82,56,"s")
  c.rect(108,145,138,25,"s");c.rect(112,149,130,17,"y")
  c.ellipse(52,52,29,19,"b");c.ellipse(296,150,38,14,"b")
  for(const [x,y] of [[36,41],[285,41],[45,157],[309,158],[173,23],[173,175]])pine(c,x,y,.48)
  pavilion(c,175,145,.38,"r")
})
