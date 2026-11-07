export type TianhaiAcademyMapLabel = {
  id:string;
  name:string;
  category:string;
  points:Array<[number,number]>;
  description:string;
  walkable?:boolean;
  blocked?:boolean;
  foreground?:boolean;
  opacity?:boolean;
  zOrder:number;
};

// Coordinates are authored on the 704×384 PXL planning canvas and converted
// to the 2816×1536 Map Base by px(). The same shapes seed the editor and map guide.
const px=(points:Array<[number,number]>):Array<[number,number]>=>points.map(([x,y])=>[x*4,y*4]);

export const TIANHAI_ACADEMY_PXL_LABELS:TianhaiAcademyMapLabel[]=[
  {id:"zone-outer-students",name:"Outer Student Zone",category:"student-zone",points:px([[38,282],[72,246],[151,238],[244,257],[292,310],[255,354],[147,372],[55,344]]),description:"Outer student grounds, arrival courts, dormitory buildings and open gardens",zOrder:1},
  {id:"zone-inner-students",name:"Inner Student Zone",category:"student-zone",points:px([[204,171],[252,139],[353,132],[458,158],[487,229],[421,270],[296,258],[225,222]]),description:"Inner student learning halls and connected courtyards",zOrder:2},
  {id:"zone-core-students",name:"Core Student Zone",category:"student-zone",points:px([[247,48],[324,34],[419,50],[471,108],[440,164],[356,174],[278,140]]),description:"Restricted core student buildings and the central academy hall",zOrder:3},
  {id:"zone-dojo-west",name:"Martial Dojo and Practice Grounds",category:"dojo",points:px([[58,171],[105,143],[187,157],[227,213],[202,277],[124,290],[65,245]]),description:"Independent practice yards and academy martial instruction grounds",zOrder:2},
  {id:"zone-spirit-training-east",name:"Advanced Spirit Realm Training Area",category:"spirit-training",points:px([[483,55],[567,40],[658,68],[683,137],[646,201],[548,196],[488,150]]),description:"Advanced supervised Spirit Realm training grounds with a protected practice ring",zOrder:2},
  {id:"zone-arcanist-learning",name:"Arcanist Learning and Workshop Area",category:"arcanist-learning",points:px([[454,222],[532,207],[657,226],[687,304],[628,357],[514,352],[450,298]]),description:"Academy-level Arcanist lessons, supervised practice rooms and small workshops; not the separate Tianhai Arcanist Institute",zOrder:2},
  {id:"zone-instructors",name:"Teacher and Instructor Quarters",category:"instructor-quarters",points:px([[37,91],[87,60],[178,73],[222,126],[194,184],[112,204],[49,159]]),description:"Teacher residences, instructor garden and a quiet consultation pavilion",zOrder:2},

  {id:"path-main-approach",name:"Main Entrance Approach",category:"path",points:px([[3,367],[13,349],[36,340],[57,348],[43,367],[25,379],[13,384]]),description:"Organic stone approach from the southern map edge to the small main gate",walkable:true,zOrder:4},
  {id:"path-outer-court",name:"Outer Student Garden Path",category:"path",points:px([[31,337],[47,320],[82,305],[106,314],[92,334],[63,351],[44,358]]),description:"Curving path through the outer student gardens",walkable:true,zOrder:4},
  {id:"path-main-spine-lower",name:"Lower Campus Path",category:"path",points:px([[78,304],[94,285],[126,269],[154,278],[137,298],[112,318],[93,324]]),description:"Organic main route linking the entrance to the outer and inner student zones",walkable:true,zOrder:4},
  {id:"path-main-spine-middle",name:"Central Campus Path",category:"path",points:px([[128,273],[151,253],[185,232],[213,239],[198,259],[169,280],[145,289]]),description:"Main winding campus route connecting the dojo, student courts and inner zone",walkable:true,zOrder:4},
  {id:"path-main-spine-upper",name:"Upper Campus Path",category:"path",points:px([[190,239],[209,218],[236,195],[263,202],[249,222],[226,245],[207,253]]),description:"Upper connecting path to the inner and core student courts",walkable:true,zOrder:4},
  {id:"path-core-approach",name:"Core Hall Approach",category:"path",points:px([[244,202],[267,181],[298,160],[322,168],[306,188],[281,211],[260,218]]),description:"Stone path leading to the core academy hall",walkable:true,zOrder:4},
  {id:"path-east-branch",name:"Eastern Learning Path",category:"path",points:px([[300,187],[330,177],[369,181],[395,197],[381,214],[347,208],[321,204]]),description:"Branching route linking inner students to advanced training and Arcanist classrooms",walkable:true,zOrder:4},
  {id:"path-dojo-branch",name:"Dojo Garden Path",category:"path",points:px([[117,264],[125,242],[145,220],[169,220],[164,241],[148,262],[137,279]]),description:"Winding path through the dojo and instructor grounds",walkable:true,zOrder:4},
  {id:"path-spirit-branch",name:"Spirit Training Approach",category:"path",points:px([[389,193],[416,170],[451,145],[473,151],[461,172],[433,195],[409,211]]),description:"Protected route to the advanced Spirit Realm training area",walkable:true,zOrder:4},
  {id:"path-arcanist-branch",name:"Arcanist Workshop Walk",category:"path",points:px([[391,210],[421,229],[454,248],[447,269],[422,260],[395,240],[380,223]]),description:"Walkway connecting the inner zone to Arcanist classrooms and workshops",walkable:true,zOrder:4},
  {id:"path-garden-east",name:"Eastern Garden Walk",category:"path",points:px([[466,266],[491,251],[524,249],[545,266],[526,282],[497,286],[475,282]]),description:"Small landscaped path around the Arcanist garden pond",walkable:true,zOrder:4},

  {id:"court-outer",name:"Outer Student Courtyard",category:"courtyard",points:px([[72,270],[109,244],[174,248],[222,277],[207,324],[145,344],[85,324]]),description:"Large open outdoor meeting and student practice court",walkable:true,zOrder:2},
  {id:"court-inner",name:"Inner Student Courtyard",category:"courtyard",points:px([[226,161],[276,140],[351,142],[407,174],[388,226],[321,248],[254,219]]),description:"Open learning court between inner student halls",walkable:true,zOrder:2},
  {id:"court-core",name:"Core Academy Forecourt",category:"courtyard",points:px([[275,69],[330,52],[394,67],[431,104],[410,145],[350,158],[300,132]]),description:"Stone forecourt below the main academy hall",walkable:true,zOrder:2},
  {id:"court-dojo",name:"Dojo Practice Yard",category:"training-yard",points:px([[85,202],[116,180],[169,181],[201,216],[182,255],[129,267],[91,240]]),description:"Open martial training ground and sparring space",walkable:true,zOrder:2},
  {id:"court-spirit",name:"Advanced Spirit Realm Practice Court",category:"training-yard",points:px([[507,95],[553,73],[615,79],[651,114],[632,157],[575,173],[524,145]]),description:"Walkable training court surrounding the advanced practice ring",walkable:true,zOrder:2},
  {id:"court-arcanist",name:"Arcanist Workshop Courtyard",category:"courtyard",points:px([[490,251],[534,232],[602,242],[646,282],[620,325],[551,337],[498,304]]),description:"Open work yard between academy Arcanist classrooms and small workshops",walkable:true,zOrder:2},

  {id:"gate-main",name:"Tianhai Academy Main Entrance",category:"gate",points:px([[5,361],[28,356],[39,371],[24,384],[6,381]]),description:"Small formal entrance, approximately two isometric diamonds wide",blocked:true,foreground:true,zOrder:8},
  {id:"pond-west",name:"Western Garden Pond",category:"pond",points:px([[35,181],[52,165],[80,166],[103,183],[112,207],[98,235],[71,246],[44,227],[27,204]]),description:"Irregular garden pond with stone edge and a small crossing bridge",blocked:true,zOrder:3},
  {id:"pond-south-east",name:"Southeastern Reflecting Pond",category:"pond",points:px([[373,292],[397,274],[431,275],[461,293],[467,320],[449,343],[412,350],[383,333],[365,312]]),description:"Natural reflecting pond among the southern gardens",blocked:true,zOrder:3},
  {id:"pond-core",name:"Inner Garden Water Feature",category:"pond",points:px([[250,250],[265,237],[286,239],[300,253],[295,271],[277,280],[257,270]]),description:"Small irregular pond beside the inner garden walk",blocked:true,zOrder:3},

  {id:"building-core-main-hall",name:"Core Academy Main Hall",category:"building",points:px([[336,78],[378,63],[411,86],[407,125],[364,143],[329,119]]),description:"Main teaching hall of the academy, kept compact relative to the campus grounds",blocked:true,foreground:true,zOrder:7},
  {id:"building-core-library",name:"Core Learning Library",category:"building",points:px([[270,96],[296,85],[321,101],[316,127],[288,139],[266,120]]),description:"Library and quiet study pavilion",blocked:true,foreground:true,zOrder:7},
  {id:"building-core-lecture",name:"Core Lecture Pavilion",category:"building",points:px([[420,105],[447,95],[469,111],[461,136],[435,147],[415,128]]),description:"Small lecture pavilion for senior students",blocked:true,foreground:true,zOrder:7},
  {id:"building-inner-east",name:"Inner Student Hall East",category:"building",points:px([[385,166],[412,155],[436,171],[429,197],[403,210],[381,190]]),description:"Inner student lesson hall",blocked:true,foreground:true,zOrder:7},
  {id:"building-inner-west",name:"Inner Student Hall West",category:"building",points:px([[235,174],[261,160],[286,178],[280,202],[253,217],[232,197]]),description:"Inner student lesson hall",blocked:true,foreground:true,zOrder:7},
  {id:"building-teacher-house",name:"Instructor Residence",category:"building",points:px([[126,141],[153,128],[177,143],[172,168],[146,182],[122,162]]),description:"Teacher and instructor residence",blocked:true,foreground:true,zOrder:7},
  {id:"building-teacher-pavilion",name:"Instructor Pavilion",category:"building",points:px([[72,117],[97,105],[119,119],[115,142],[91,153],[70,135]]),description:"Quiet instructor consultation pavilion",blocked:true,foreground:true,zOrder:7},
  {id:"building-dojo-west",name:"Western Dojo",category:"dojo-building",points:px([[111,210],[140,194],[168,210],[163,239],[135,253],[108,231]]),description:"Small timber dojo with a separate practice yard",blocked:true,foreground:true,zOrder:7},
  {id:"building-dojo-east",name:"Eastern Dojo",category:"dojo-building",points:px([[168,230],[192,218],[215,232],[211,255],[188,269],[164,250]]),description:"Secondary martial arts pavilion",blocked:true,foreground:true,zOrder:7},
  {id:"building-spirit-pavilion",name:"Spirit Realm Training Pavilion",category:"building",points:px([[558,83],[588,70],[615,88],[609,113],[580,126],[555,107]]),description:"Instructor station beside the advanced Spirit Realm ring",blocked:true,foreground:true,zOrder:7},
  {id:"building-arcanist-class",name:"Arcanist Learning Hall",category:"building",points:px([[514,265],[542,250],[568,267],[561,291],[533,303],[510,284]]),description:"Academy Arcanist classroom, not the separate Tianhai Arcanist Institute",blocked:true,foreground:true,zOrder:7},
  {id:"building-arcanist-workshop",name:"Arcanist Practice Workshop",category:"building",points:px([[587,271],[614,257],[638,273],[633,296],[605,309],[581,290]]),description:"Small supervised practice workshop for Arcanistry",blocked:true,foreground:true,zOrder:7},
  {id:"building-outer-dorm-west",name:"Outer Student Residence West",category:"building",points:px([[105,298],[131,284],[156,298],[151,322],[126,335],[101,316]]),description:"Outer student residences",blocked:true,foreground:true,zOrder:7},
  {id:"building-outer-dorm-east",name:"Outer Student Residence East",category:"building",points:px([[194,306],[222,292],[248,307],[243,331],[216,344],[190,326]]),description:"Outer student residences",blocked:true,foreground:true,zOrder:7},
  {id:"building-outer-study",name:"Outer Student Study Pavilion",category:"building",points:px([[67,286],[88,274],[108,288],[104,308],[83,319],[64,302]]),description:"Small study pavilion near the arrival court",blocked:true,foreground:true,zOrder:7},

  {id:"spirit-training-ring",name:"Advanced Spirit Realm Training Ring",category:"spirit-training-ring",points:px([[575,111],[594,101],[615,112],[615,132],[595,145],[575,133]]),description:"Clearly bounded supervised training ring",blocked:false,walkable:true,zOrder:5},
  {id:"arcanist-artifact-yard",name:"Arcanist Artifact Practice Yard",category:"arcanist-yard",points:px([[550,306],[583,293],[612,308],[604,330],[574,337],[547,322]]),description:"Practice ground with small artificial-artifact stations",walkable:true,zOrder:4},

  {id:"garden-west",name:"Western Botanical Garden",category:"garden",points:px([[20,107],[54,83],[100,90],[133,124],[125,157],[91,174],[48,157]]),description:"Tree-lined garden beside the instructor quarters",zOrder:2},
  {id:"garden-north",name:"Northern Core Garden",category:"garden",points:px([[228,37],[270,21],[317,35],[331,63],[300,82],[255,74]]),description:"Quiet garden above the core student buildings",zOrder:2},
  {id:"garden-inner",name:"Inner Courtyard Garden",category:"garden",points:px([[290,225],[322,213],[351,228],[349,251],[322,265],[293,249]]),description:"Central landscaped pocket garden",zOrder:2},
  {id:"garden-east",name:"Eastern Spirit Garden",category:"garden",points:px([[625,174],[658,159],[684,177],[678,211],[649,225],[625,202]]),description:"Outer garden bordering the advanced training grounds",zOrder:2},
  {id:"garden-arcanist",name:"Arcanist Workshop Garden",category:"garden",points:px([[462,323],[488,307],[515,322],[510,345],[481,357],[458,340]]),description:"Small garden with water and specimen beds",zOrder:2},

  {id:"tree-cluster-west",name:"Western Garden Tree Canopy",category:"tree-canopy",points:px([[38,130],[51,117],[67,117],[81,132],[79,150],[63,160],[45,151]]),description:"Tree canopy rendered in front of the Player when the character passes behind it",blocked:false,foreground:true,opacity:true,zOrder:9},
  {id:"tree-cluster-instructor",name:"Instructor Garden Tree Canopy",category:"tree-canopy",points:px([[177,120],[190,108],[208,111],[220,127],[216,146],[197,155],[179,144]]),description:"Foreground tree canopy; fade the Player when passing behind it",foreground:true,opacity:true,zOrder:9},
  {id:"tree-cluster-inner",name:"Inner Garden Tree Canopy",category:"tree-canopy",points:px([[307,250],[321,237],[338,239],[351,254],[345,272],[328,280],[310,267]]),description:"Foreground canopy beside the inner garden path",foreground:true,opacity:true,zOrder:9},
  {id:"tree-cluster-east",name:"Eastern Garden Tree Canopy",category:"tree-canopy",points:px([[644,202],[657,190],[674,194],[687,209],[681,227],[664,237],[646,222]]),description:"Foreground canopy beside the advanced training grounds",foreground:true,opacity:true,zOrder:9},
  {id:"tree-cluster-outer",name:"Outer Student Garden Tree Canopy",category:"tree-canopy",points:px([[247,332],[262,320],[279,322],[291,338],[284,355],[267,365],[250,352]]),description:"Foreground canopy in the outer student gardens",foreground:true,opacity:true,zOrder:9},

  {id:"boundary-north",name:"Northern Garden Boundary",category:"boundary",points:px([[18,65],[688,48],[695,57],[25,79]]),description:"Low boundary wall; blocks movement and renders in front of actors",blocked:true,foreground:true,zOrder:8},
  {id:"boundary-east",name:"Eastern Campus Boundary",category:"boundary",points:px([[681,90],[695,90],[699,294],[686,302]]),description:"Low outer campus wall",blocked:true,foreground:true,zOrder:8},
  {id:"bridge-west",name:"Western Garden Bridge",category:"bridge",points:px([[92,197],[111,193],[121,208],[105,215]]),description:"Walkable stone-and-wood bridge across the western pond edge",walkable:true,zOrder:5},
  {id:"bridge-southeast",name:"Southeastern Garden Bridge",category:"bridge",points:px([[433,311],[453,304],[466,318],[449,328]]),description:"Walkable bridge across the reflecting pond inlet",walkable:true,zOrder:5},
];
