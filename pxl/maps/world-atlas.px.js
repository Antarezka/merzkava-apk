// Merzkava map illustrations: source crops only; never alter gameplay geometry.
sprite("world-map-overview", { png: "references/world-map-source.png", shrink: 3 })
sprite("academy-exterior", { png: "references/academy-exterior-source.png" })
sprite("academy-minimap", { png: "references/academy-exterior-source.png", shrink: 8 })
sprite("local-default", { png: "references/local-default-source.png", shrink: 2 })
const REGIONS = [
["golden-dragon-empire",3400,700,1600,1500],["tianhai-yunzhou",0,850,1900,1500],["beiming-gu",1100,0,2600,1350],
["lawless-territories",2400,1700,2100,1250],["ashen-borderlands",2100,1700,1300,1250],["black-tide-expanse",2300,2350,1800,900],
["nine-frost-wastes",0,0,1800,1400],["wanluo-sacred-expanse",3000,0,1700,1400],["azerion-forest",2500,750,1600,1500],
["dead-zone",1800,1700,1400,1200],["inner-azerion",2750,950,1000,1000],["mega-colossal-labyrinth",100,200,1450,1400],
["high-cloud-sea-mountains",1000,0,1900,1200],["silverpine-wilds",1800,0,1500,1350],["frostmirror-sea",0,200,1600,1900],
["eastern-azure-sea",4300,400,1200,2350],["yunmeng-sea",0,1750,1700,1400],["wufeng-sea",1500,900,2300,1450],
["black-tide-sea",2200,2200,1700,1050],["guixu-canghai",0,2250,2600,1030],["lanternhook-isles",3000,2050,2000,1150],
["mega-colossal-labyrinth-exit",0,600,1100,1000],["lantern-passage",1450,1100,1050,900],["changqion-harbour",1050,1550,1250,850],
["three-lantern-passage",2400,950,1100,950],["southwake-port",2700,1750,1150,900],["bitterglass-isle",3050,2350,950,850],
["dicewake-isle",3900,2300,1000,850],["dongxing-port",4400,550,1050,800],["mingzhu-port",4450,850,1050,800],
["lanfan-port",4300,1100,1000,800],["chaoguan-port",4300,1350,1000,850],["yuhai-port",4200,1650,1100,900],
["yuandeng-port",4000,1850,1100,900],["longchao-port",3900,2150,1400,1000]
]
for (const [id,x,y,w,h] of REGIONS) sprite("region-"+id,{png:"references/world-map-source.png",area:[x,y,w,h],shrink:3})
