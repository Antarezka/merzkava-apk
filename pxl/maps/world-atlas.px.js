// Merzkava maps: PXL owns the image treatment; app-owned geometry and map data remain untouched.
// Endesga32 keeps the atlas, Academy and regional crops inside one warm, readable pixel-art palette.
use("endesga32")
genre("atlas-art", { mix: true })

sprite("world-map-overview", {
  png: "references/world-map-source.png",
  shrink: 2,
  palettize: true,
  genre: "atlas-art",
})

// The supplied Academy illustration is the approved composition reference, not a runtime passthrough.
// PXL reduces it to a 704×384 art canvas, resolves it through Endesga32, then exports a 4× scene.
// This returns to the exact 2816×1536 map coordinate space used by the Academy grid and walkability.
sprite("_academy-pixel-source", {
  png: "references/academy-exterior-source.png",
  shrink: 4,
  palettize: true,
  pivot: "center",
  genre: "atlas-art",
})
scene("academy-campus-pixel-pass", {
  w: 704,
  h: 384,
  bg: "0",
  sizes: { "academy-exterior": 4 },
},
  layer("approved-campus-composition", stamp("_academy-pixel-source", 352, 192)),
  // A restrained highlight roll-off and vignette gives the PXL render a model-like HD-2D finish
  // without repainting, shifting, hiding or reinterpreting any playable landmark.
  post({ bloom: { strength: 0.16, r: 3 }, vignette: 0.12 }),
)

sprite("academy-minimap", {
  png: "references/academy-exterior-source.png",
  shrink: 8,
  palettize: true,
  genre: "atlas-art",
})
sprite("local-default", {
  png: "references/local-default-source.png",
  shrink: 2,
  palettize: true,
  genre: "atlas-art",
})

// Crops are strictly presentation assets from the same approved world illustration.
// Cropping precedes PXL reduction so every regional panel retains its original map location.
const REGIONS = [
["golden-dragon-empire",1700,350,800,750],["tianhai-yunzhou",0,425,950,750],["beiming-gu",550,0,1300,675],
["lawless-territories",1200,850,1050,625],["ashen-borderlands",1050,850,650,625],["black-tide-expanse",1150,1175,900,450],
["nine-frost-wastes",0,0,900,700],["wanluo-sacred-expanse",1500,0,850,700],["azerion-forest",1250,375,800,750],
["dead-zone",900,850,700,600],["inner-azerion",1375,475,500,500],["mega-colossal-labyrinth",50,100,725,700],
["high-cloud-sea-mountains",500,0,950,600],["silverpine-wilds",900,0,750,675],["frostmirror-sea",0,100,800,950],
["eastern-azure-sea",2150,200,600,1175],["yunmeng-sea",0,875,850,700],["wufeng-sea",750,450,1150,725],
["black-tide-sea",1100,1100,850,525],["guixu-canghai",0,1125,1300,515],["lanternhook-isles",1500,1025,1000,575],
["mega-colossal-labyrinth-exit",0,300,550,500],["lantern-passage",725,550,525,450],["changqion-harbour",525,775,625,425],
["three-lantern-passage",1200,475,550,475],["southwake-port",1350,875,575,450],["bitterglass-isle",1525,1175,475,425],
["dicewake-isle",1950,1150,500,425],["dongxing-port",2200,275,525,400],["mingzhu-port",2225,425,525,400],
["lanfan-port",2150,550,500,400],["chaoguan-port",2150,675,500,425],["yuhai-port",2100,825,550,450],
["yuandeng-port",2000,925,550,450],["longchao-port",1950,1075,700,500]
]
for (const [id,x,y,w,h] of REGIONS) {
  sprite("region-"+id, {
    png: "references/world-map-source.png",
    area: [x,y,w,h],
    shrink: 2,
    palettize: true,
    genre: "atlas-art",
  })
}
