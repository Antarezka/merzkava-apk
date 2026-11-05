import "./world-map-hierarchy.css";
import "./world-map-hierarchy-scroll.css";
import { playFootstep } from "../audio/sound-effects";
import { animateExpeditionPanel } from "./expedition-animations";
import { getEternalSave, getExpeditionAtmosphere } from "./expedition-game";
import {
  createIsoMapEditorData, DEFAULT_ISOMETRIC_GRID, DEFAULT_ISO_CANVAS_EXPANSION, normalizeIsoCanvasExpansion, isoCellAtPoint, isoCellCenter, isoCellHasLayer,
  isoCellKey, isoMapStorageKey, isoPointerGesture, isoQuadrantAtPoint, isoQuadrantHasLayer, mergeIsoWalkableCells, normalizeIsoMapEditorData, removeIsoWalkableCell, toggleIsoQuadrantLayer, unmergeIsoWalkableCell,
  type IsoMapEditorData, type IsoMapGridConfig, type IsoQuadrant, type IsoQuadrantLayer,
} from "./isometric-map-editor";
import { renderIsometricSvgSceneMarkup, refreshIsometricSvgScene, type IsometricSvgTheme } from "./isometric-svg-board";

type Level = "world" | "regional" | "local" | "interior" | "home" | "map-editor" | "test";
type RegionId = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
const regionData: Record<RegionId, { name: string; subtitle: string; image: string; sites: string[] }> = {
  "golden-dragon-empire": {
    name: "Golden Dragon Empire", subtitle: "EASTERN POWER · IMPERIAL TERRITORIES",
    image: "/game/scenery/golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png",
    sites: ["Imperial Capital", "Tianhai Academy", "Imperial Market", "Eastern Port", "Public Pavilion", "Public Arena"]
  },
  "tianhai-yunzhou": {
    name: "Tianhai Yunzhou", subtitle: "SOUTHWESTERN FLOATING POWER",
    image: "/game/scenery/tianhai-yunzhou/ty-01-floating-island-city-panorama.png",
    sites: ["Yunxiao Terrace", "Cangqiong Harbor", "Haiyue Market", "Linggong District", "Academy", "Five Dojos"]
  },
  "beiming-gu": {
    name: "Beiming Gu", subtitle: "NORTHERN POWER · MOUNTAIN TERRITORIES",
    image: "/game/scenery/beiming-gu/bg-01-northern-territory-panorama.png",
    sites: ["Beiming Heartland", "Dojo Network", "Local Market", "Grand Hall", "Mountain Pass", "Frozen Basin"]
  }
};


type WorldMarkerCategory = "power" | "territory" | "forest" | "sea" | "landmark" | "mountains";
type WorldMarkerId =
  | "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu"
  | "lawless-territories" | "ashen-borderlands" | "black-tide-expanse" | "nine-frost-wastes"
  | "wanluo-sacred-expanse" | "azerion-forest" | "dead-zone" | "inner-azerion"
  | "mega-colossal-labyrinth" | "high-cloud-sea-mountains" | "silverpine-wilds" | "frostmirror-sea"
  | "eastern-azure-sea" | "yunmeng-sea" | "wufeng-sea" | "black-tide-sea"
  | "guixu-canghai" | "lanternhook-isles"
  | "mega-colossal-labyrinth-exit" | "lantern-passage" | "changqion-harbour" | "three-lantern-passage"
  | "southwake-port" | "bitterglass-isle" | "dicewake-isle" | "dongxing-port" | "mingzhu-port"
  | "lanfan-port" | "chaoguan-port" | "yuhai-port" | "yuandeng-port" | "longchao-port";
type WorldMarker = {
  id: WorldMarkerId; name: string; x: number; y: number;
  category: WorldMarkerCategory; subtitle: string; description: string;
  placementStatus: "provisional" | "owner-set";
};
// App defaults are the owner's confirmed map coordinates. Existing local coordinates
// remain authoritative on app updates; use Reset Defaults in the Map Editor and
// Confirm & Lock Positions to replace a device's saved layout with these defaults.
const WORLD_MAP_COORDINATES_KEY = "merzkava.world-map.coordinates.v3";
const defaultWorldMarkers: WorldMarker[] = [
  { id: "golden-dragon-empire", name: "Golden Dragon Empire", x: 78.6, y: 34, category: "power", subtitle: "EASTERN POWER", description: "The eastern imperial power. Its seven internal regions remain part of the Empire, not separate world powers.", placementStatus: "owner-set" },
  { id: "tianhai-yunzhou", name: "Tianhai Yunzhou", x: 19.4, y: 38.4, category: "power", subtitle: "SOUTHWESTERN FLOATING POWER", description: "The maritime power centered on a giant floating island above Yunmeng Sea.", placementStatus: "owner-set" },
  { id: "beiming-gu", name: "Beiming Gu", x: 45.2, y: 7.8, category: "power", subtitle: "NORTHERN POWER", description: "The northern power protected by mountain ranges and severe cold.", placementStatus: "owner-set" },
  { id: "lawless-territories", name: "Lawless Territories", x: 61.2, y: 60.9, category: "territory", subtitle: "EXTERNAL MACRO-REGION", description: "A broad collection of communities and territories outside the direct jurisdiction of the three powers. It is not one unified country and includes Ashen Borderlands, Black Tide Expanse, and Nine Frost Wastes.", placementStatus: "owner-set" },
  { id: "ashen-borderlands", name: "Ashen Borderlands", x: 70.7, y: 49.4, category: "territory", subtitle: "WESTERN / SOUTHWESTERN LAWLESS TERRITORY", description: "Outside the western and southwestern borders of Golden Dragon Empire. Known settlements include Greyrock Village, Blackreed Village, Broken Bell Village, and Dust Lantern Village.", placementStatus: "owner-set" },
  { id: "black-tide-expanse", name: "Black Tide Expanse", x: 50.5, y: 75.6, category: "territory", subtitle: "LAWLESS MARITIME ARCHIPELAGO", description: "Remote islands and sea routes outside Tianhai Yunzhou's direct control. Known settlements include Saltwind Village, Driftwood Haven, Mistbell Village, and Redwake Village. Distinct from Black Tide Sea and Guixu Canghai.", placementStatus: "owner-set" },
  { id: "nine-frost-wastes", name: "Nine Frost Wastes", x: 56.6, y: 8.6, category: "territory", subtitle: "NORTHERN WILDS OUTSIDE BEIMING DEFENSES", description: "Northern wild areas outside Beiming Gu's official defenses, with snowfields, frozen valleys, conifer forests, and difficult mountains.", placementStatus: "owner-set" },
  { id: "wanluo-sacred-expanse", name: "Wanluo Sacred Expanse", x: 76.3, y: 14, category: "territory", subtitle: "SACRED REGION · OWNER-POSITIONED", description: "A broad green plain surrounded by ancient forests and mountains, centered on the World Knowledge Tower. Its sovereignty and position relative to the three powers remain unestablished.", placementStatus: "owner-set" },
  { id: "azerion-forest", name: "Azerion Forest", x: 62.1, y: 31.6, category: "forest", subtitle: "VAST CROSS-REGION FOREST", description: "A major Spirit Beast habitat extending from Lawless Territories into Golden Dragon Empire territory. Its easiest known entrance is on the Lawless side.", placementStatus: "owner-set" },
  { id: "dead-zone", name: "Dead Zone", x: 64.4, y: 36.1, category: "landmark", subtitle: "RESTRICTED CORE OF AZERION FOREST", description: "The deepest inner/core zone of Azerion Forest. It is not a separate forest or a synonym for the whole forest.", placementStatus: "owner-set" },
  { id: "inner-azerion", name: "Inner Azerion", x: 63.4, y: 20.8, category: "landmark", subtitle: "HIDDEN HALF-BEAST CITY", description: "A concealed city in the northern part of Azerion Forest, hidden by extremely dense illusion fog. Safe routes are known only to veteran forest-goers and local hunter tribes.", placementStatus: "owner-set" },
  { id: "mega-colossal-labyrinth", name: "Mega Colossal Labyrinth", x: 58.8, y: 26.2, category: "landmark", subtitle: "ANCIENT UNDERGROUND RUINS", description: "Reached through ruins beneath Azerion Forest's central lake and connected to an exit on the northern deep-sea coast. Its interior has no complete surveyed map.", placementStatus: "owner-set" },
  { id: "high-cloud-sea-mountains", name: "High Cloud-Sea Mountains", x: 72.4, y: 6, category: "mountains", subtitle: "UNNAMED REMOTE MOUNTAIN REGION", description: "Remote high peaks rising above the sea of clouds. Two distinct hidden traditions are associated with this remote mountain setting; exact names, coordinates, and routes are not established.", placementStatus: "owner-set" },
  { id: "silverpine-wilds", name: "Silverpine Wilds", x: 85.8, y: 22.2, category: "forest", subtitle: "BEIMING GU · PINE FOREST WILDERNESS", description: "A northern district of Beiming Gu known for pine forests, Spirit Beast habitat, herbs, and hunting. This is an internal Beiming region, not an independent world power.", placementStatus: "owner-set" },
  { id: "frostmirror-sea", name: "Frostmirror Sea", x: 12.8, y: 18.6, category: "sea", subtitle: "NORTHERN COASTAL SEA", description: "The northern coastal waters of Beiming Gu, connected around the northeastern maritime margin to Eastern Azure Sea.", placementStatus: "owner-set" },
  { id: "eastern-azure-sea", name: "Eastern Azure Sea", x: 94.5, y: 47.9, category: "sea", subtitle: "EASTERN COASTAL SEA", description: "The eastern maritime belt of Golden Dragon Empire, with the established eastern shipping lane and coastal ports.", placementStatus: "owner-set" },
  { id: "yunmeng-sea", name: "Yunmeng Sea", x: 19.4, y: 73, category: "sea", subtitle: "SOUTHWESTERN HOME WATERS", description: "The ocean beneath and around Tianhai Yunzhou's floating island. Its eastern passage connects to Eastern Azure Sea; its western/southern approach faces Lawless Territories.", placementStatus: "owner-set" },
  { id: "wufeng-sea", name: "Wufeng Sea", x: 45, y: 43.7, category: "sea", subtitle: "THE WINDLESS SEA", description: "A still-water basin with no wind, waves, or currents anywhere within its boundaries. Lantern Passage connects it to Yunmeng Sea; Three-Lantern Passage links toward Eastern Azure Sea.", placementStatus: "owner-set" },
  { id: "black-tide-sea", name: "Black Tide Sea", x: 60.8, y: 78.8, category: "sea", subtitle: "ORDINARY SOUTHERN SEA", description: "Ordinary open water south of Lawless Territories and around Black Tide Expanse. It separates the Lawless maritime region from Guixu Canghai.", placementStatus: "owner-set" },
  { id: "guixu-canghai", name: "Guixu Canghai", x: 50.6, y: 88.8, category: "sea", subtitle: "FAR-SOUTHERN POLAR OCEAN", description: "The world's farthest-southern, frigid, most dangerous ocean system, beyond the southern outer boundary of ordinary Black Tide Sea.", placementStatus: "owner-set" },
  { id: "lanternhook-isles", name: "Lanternhook Isles", x: 68.9, y: 74.6, category: "landmark", subtitle: "ARCHIPELAGO IN ORDINARY BLACK TIDE SEA", description: "A small archipelago with Red Lantern Cay (entertainment), Bitterglass Isle (specialist physicians and medicinal trade), and Dicewake Isle (gambling and wagers).", placementStatus: "owner-set" },
  { id: "mega-colossal-labyrinth-exit", name: "Mega Colossal Labyrinth Exit", x: 25.1, y: 22.7, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "lantern-passage", name: "Lantern Passage", x: 34.9, y: 43.8, category: "sea", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "changqion-harbour", name: "Changqion Harbour", x: 26.5, y: 61.4, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "three-lantern-passage", name: "Three Lantern Passage", x: 55.7, y: 43.8, category: "sea", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "southwake-port", name: "Southwake Port", x: 64.1, y: 66.9, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "bitterglass-isle", name: "Bitterglass Isle", x: 68.4, y: 84.6, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "dicewake-isle", name: "Dicewake Isle", x: 75.6, y: 78, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "dongxing-port", name: "Dongxing Port", x: 89.9, y: 25.7, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "mingzhu-port", name: "Mingzhu Port", x: 89.2, y: 33.5, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "lanfan-port", name: "Lanfan Port", x: 85.7, y: 41.8, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "chaoguan-port", name: "Chaoguan Port", x: 82.9, y: 45.6, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "yuhai-port", name: "Yuhai Port", x: 85.8, y: 54.7, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "yuandeng-port", name: "Yuandeng Port", x: 85, y: 60.5, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" },
  { id: "longchao-port", name: "Longchao Port", x: 83.4, y: 65.8, category: "landmark", subtitle: "OWNER-POSITIONED", description: "Position confirmed by the owner on the canonical Merzkava world map.", placementStatus: "owner-set" }
];
function readWorldMarkers(): WorldMarker[] {
  try {
    const saved = JSON.parse(localStorage.getItem(WORLD_MAP_COORDINATES_KEY) || localStorage.getItem("merzkava.world-map.coordinates.v2") || "null");
    if (Array.isArray(saved)) {
      return defaultWorldMarkers.map(item => {
        const entry = saved.find((value: any) => value?.id === item.id);
        return ["mega-colossal-labyrinth-exit","lantern-passage","changqion-harbour","three-lantern-passage","southwake-port","bitterglass-isle","dicewake-isle","dongxing-port","mingzhu-port","lanfan-port","chaoguan-port","yuhai-port","yuandeng-port","longchao-port"].includes(item.id) ? { ...item } : entry && Number.isFinite(Number(entry.x)) && Number.isFinite(Number(entry.y))
          ? { ...item, x: Math.max(0, Math.min(100, Number(entry.x))), y: Math.max(0, Math.min(100, Number(entry.y))), placementStatus: entry.placementStatus === "owner-set" ? "owner-set" : item.placementStatus }
          : { ...item };
      });
    }
  } catch { /* use built-in positions when storage is unavailable or invalid */ }
  return defaultWorldMarkers.map(item => ({ ...item }));
}
function worldMapMarkerMarkup(marker: WorldMarker, editor = false): string {
  // Unplaced additions stay off the canonical world view until the owner assigns coordinates.
  if (!editor && marker.placementStatus === "provisional") return "";
  const number = String(defaultWorldMarkers.findIndex(item => item.id === marker.id) + 1).padStart(2, "0");
  const provisional = marker.placementStatus === "provisional" ? ' title="Provisional placement — adjust in Map Editor"' : "";
  const powerClass = marker.id === "golden-dragon-empire" ? " wmh-power-gde" : marker.id === "tianhai-yunzhou" ? " wmh-power-ty" : marker.id === "beiming-gu" ? " wmh-power-bg" : "";
  return '<button class="wmh-power wmh-marker-' + marker.category + powerClass + (editor ? ' wmh-editor-marker' : '') +
    '" style="left:' + marker.x + '%;top:' + marker.y + '%" ' +
    (editor ? 'type="button" data-wmh-drag-marker="' + marker.id + '" aria-label="Drag ' + marker.name + '"' : 'data-wmh-info="' + marker.id + '"') +
    provisional + '><b>' + number + '</b><span>' + marker.name + '</span></button>';
}
function selectionImage(info: WorldMarker): string {
  const power=regionData[info.id as RegionId];
  if(power)return power.image;
  if(info.id==="lawless-territories"||info.id==="ashen-borderlands"||info.id==="black-tide-expanse")return "/game/scenery/lawless-territories/lt-01-lawless-territory-wilderness.png";
  if(info.id==="silverpine-wilds"||info.id==="nine-frost-wastes"||info.id==="high-cloud-sea-mountains")return "/game/scenery/beiming-gu/bg-05-northern-mountain-pass.png";
  if(info.id==="azerion-forest"||info.id==="inner-azerion"||info.id==="dead-zone")return "/game/scenery/special-locations/az-01-azerion-illusion-fog-boundary.png";
  return "";
}
function selectionMarkup(info: WorldMarker): string {
  const image=selectionImage(info);
  return '<div class="wmh-selection-backdrop" data-wmh-dismiss-layer><section class="wmh-selection-card" data-wmh-selection-card role="dialog" aria-modal="true" aria-label="'+info.name+'"><div class="wmh-selection-glass"><div class="wmh-selection-art">'+(image?'<img class="wmh-selection-scene-image" src="'+image+'" alt="'+info.name+'"/>':'<div class="wmh-selection-art-placeholder"><span>'+info.category.toUpperCase()+'</span><b>'+info.name+'</b><small>AREA ART · PLACEHOLDER</small></div>')+
    '<div class="wmh-selection-glass-glow"></div><span class="wmh-selection-window-label">MERZKAVA · AREA WINDOW</span><div class="wmh-selection-title"><small>'+info.subtitle+'</small><h3>'+info.name+'</h3></div></div></div><div class="wmh-selection-question"><p>Would you like to access <b>'+info.name+'</b>?</p><div><button type="button" data-wmh-action="selection-yes" data-marker-id="'+info.id+'">YES · ENTER</button><button type="button" data-wmh-action="selection-no">NO · STAY HERE</button></div></div></section></div>';
}
function serializeWorldMapCoordinates(markers: WorldMarker[]): string {
  return JSON.stringify({
    format: "merzkava-world-map-coordinates",
    schemaVersion: 2,
    map: "Merzkava Universe World Map",
    image: "/world/Untitled77_20261029054536.png",
    coordinateSystem: {
      type: "normalized-percentage", origin: "top-left",
      xAxis: "left-to-right", yAxis: "top-to-bottom",
      range: "0–100", anchor: "marker-center",
      note: "Coordinates are percentages of the actual displayed map image bounds, not the surrounding editor canvas or pixel positions. New marker placements are provisional until repositioned by the owner."
    },
    markers: markers.map(({ id, name, x, y, category, placementStatus }) => ({ id, name, category, x, y, placementStatus }))
  }, null, 2);
}
function academyMarginGridMarkup(
  width:number,height:number,imageLeft:number,imageTop:number,imageWidth:number,imageHeight:number,cellW:number,cellH:number,
):string {
  const slope=cellH/cellW;
  const first=Math.floor(-slope*width/cellH)-1;
  const last=Math.ceil((height+slope*width)/cellH)+1;
  const lines:string[]=[];
  for(let index=first;index<=last;index++){
    const y=index*cellH;
    lines.push("M0 "+y.toFixed(2)+" L"+width.toFixed(2)+" "+(slope*width+y).toFixed(2));
    lines.push("M0 "+y.toFixed(2)+" L"+width.toFixed(2)+" "+(-slope*width+y).toFixed(2));
  }
  const right=imageLeft+imageWidth,bottom=imageTop+imageHeight;
  // Four clipping bands keep every guide line outside the Academy artwork.
  return '<defs><clipPath id="academy-canvas-margin-only">'+
    '<rect x="0" y="0" width="'+width.toFixed(2)+'" height="'+imageTop.toFixed(2)+'"/>'+
    '<rect x="0" y="'+bottom.toFixed(2)+'" width="'+width.toFixed(2)+'" height="'+Math.max(0,height-bottom).toFixed(2)+'"/>'+
    '<rect x="0" y="'+imageTop.toFixed(2)+'" width="'+imageLeft.toFixed(2)+'" height="'+imageHeight.toFixed(2)+'"/>'+
    '<rect x="'+right.toFixed(2)+'" y="'+imageTop.toFixed(2)+'" width="'+Math.max(0,width-right).toFixed(2)+'" height="'+imageHeight.toFixed(2)+'"/>'+
    '</clipPath></defs>'+
    '<path d="'+lines.join(" ")+'" clip-path="url(#academy-canvas-margin-only)" fill="none" stroke="#d9c9a4" stroke-width="1.5" stroke-opacity=".36"/>'+
    '<rect x=".75" y=".75" width="'+Math.max(0,width-1.5).toFixed(2)+'" height="'+Math.max(0,height-1.5).toFixed(2)+'" fill="none" stroke="#cbb37f" stroke-width="1.5" stroke-opacity=".58"/>'+
    '<rect x="'+imageLeft.toFixed(2)+'" y="'+imageTop.toFixed(2)+'" width="'+imageWidth.toFixed(2)+'" height="'+imageHeight.toFixed(2)+'" fill="none" stroke="#e4d2a9" stroke-width="1.25" stroke-opacity=".42" stroke-dasharray="7 7"/>';
}

function bindWorldMapZoom(dialog: HTMLElement): void {
  const viewport = dialog.querySelector<HTMLElement>("[data-wmh-map-viewport]");
  const surface = dialog.querySelector<HTMLElement>("[data-wmh-map-surface]");
  const image = surface?.querySelector<HTMLImageElement>("img");
  if (!viewport || !surface || !image || viewport.dataset.gesturesBound === "true") return;
  viewport.dataset.gesturesBound = "true";
  let zoom = 1;
  let baseWidth = 0;
  let baseHeight = 0;
  const academyCanvas=surface.hasAttribute("data-wmh-academy-canvas");
  if(academyCanvas)bindAcademyCanvasEditor(dialog);
  const academyGrid=academyCanvas?surface.querySelector<SVGSVGElement>("[data-wmh-academy-margin-grid]"):null;
  // Academy pan and pinch are handled by this pointer controller. Do not let
  // Android WebView begin a competing native scroll gesture on the viewport.
  if(academyCanvas)viewport.style.setProperty("touch-action","none","important");
  let academyImageWidth=0,academyImageHeight=0,academyMarginLeft=0,academyMarginRight=0,academyMarginTop=0,academyMarginBottom=0;
  const academyExpansionKey="merzkava.academy-canvas-expansion.v2";
  let academyExpansion={...DEFAULT_ISO_CANVAS_EXPANSION};
  if(academyCanvas){try{academyExpansion=normalizeIsoCanvasExpansion(JSON.parse(localStorage.getItem(academyExpansionKey)||"{}"));}catch{}}
  const pointers = new Map<number, { x: number; y: number }>();
  let panStart: { x: number; y: number; scrollLeft: number; scrollTop: number } | null = null;
  let pinchStart: { distance: number; zoom: number } | null = null;
  const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint = (a: {x:number;y:number}, b: {x:number;y:number}) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const applySurfaceSize=(scale:number) => {
    surface.style.width=(baseWidth*scale)+"px";
    surface.style.height=(baseHeight*scale)+"px";
    if(academyCanvas){
      const artLeft=academyMarginLeft*scale,artTop=academyMarginTop*scale,artWidth=academyImageWidth*scale,artHeight=academyImageHeight*scale;
      image.style.setProperty("left",artLeft+"px","important");
      image.style.setProperty("top",artTop+"px","important");
      image.style.setProperty("width",artWidth+"px","important");
      image.style.setProperty("height",artHeight+"px","important");
      const overlay=surface.querySelector<SVGSVGElement>("[data-wmh-overlay-svg]");
      if(overlay){overlay.style.left=artLeft+"px";overlay.style.top=artTop+"px";overlay.style.right="auto";overlay.style.bottom="auto";overlay.style.width=artWidth+"px";overlay.style.height=artHeight+"px";overlay.setAttribute("viewBox","0 0 "+(image.naturalWidth||2816)+" "+(image.naturalHeight||1536));}
      const foreground=surface.querySelector<HTMLCanvasElement>("[data-wmh-foreground-canvas]");
      if(foreground){foreground.style.left=artLeft+"px";foreground.style.top=artTop+"px";foreground.style.right="auto";foreground.style.bottom="auto";foreground.style.width=artWidth+"px";foreground.style.height=artHeight+"px";}
      const actors=surface.querySelector<HTMLElement>("[data-wmh-actor-layer]");
      if(actors){actors.style.left=artLeft+"px";actors.style.top=artTop+"px";actors.style.right="auto";actors.style.bottom="auto";actors.style.width=artWidth+"px";actors.style.height=artHeight+"px";}
    }else{
      image.style.width="100%";
      image.style.height="100%";
    }
  };
  const sizeBaseMap = () => {
    const rect = viewport.getBoundingClientRect();
    const ratio = image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1;
    academyImageWidth = Math.max(rect.width, rect.height * ratio);
    academyImageHeight = Math.max(rect.height, rect.width / ratio);
    if(academyCanvas){
      // Each side has its own configurable gap, added outside the artwork.
      const artworkScale=image.naturalWidth>0?academyImageWidth/image.naturalWidth:1;
      const cellW=128*artworkScale,cellH=69.5*artworkScale;
      academyMarginLeft=Math.max(cellW*2,rect.width*2)+academyExpansion.left;
      academyMarginRight=Math.max(cellW*2,rect.width/2)+academyExpansion.right;
      academyMarginTop=Math.max(cellH*2,rect.height/2)+academyExpansion.top;
      academyMarginBottom=Math.max(cellH*2,rect.height/2)+academyExpansion.bottom;
      baseWidth=academyImageWidth+academyMarginLeft+academyMarginRight;
      baseHeight=academyImageHeight+academyMarginTop+academyMarginBottom;
      if(academyGrid){
        academyGrid.setAttribute("viewBox","0 0 "+baseWidth+" "+baseHeight);
        academyGrid.innerHTML=academyMarginGridMarkup(
          baseWidth,baseHeight,academyMarginLeft,academyMarginTop,academyImageWidth,academyImageHeight,cellW,cellH
        );
      }
    }else{
      baseWidth=academyImageWidth;
      baseHeight=academyImageHeight;
    }
    applySurfaceSize(1);
  };
  const applyZoom = (next: number, focusX?: number, focusY?: number) => {
    if (!baseWidth || !baseHeight) sizeBaseMap();
    const previous = zoom;
    zoom = Math.max(1, Math.min(2.5, next));
    const localX = focusX == null ? viewport.clientWidth / 2 : focusX - viewport.getBoundingClientRect().left;
    const localY = focusY == null ? viewport.clientHeight / 2 : focusY - viewport.getBoundingClientRect().top;
    const anchoredX = viewport.scrollLeft + localX;
    const anchoredY = viewport.scrollTop + localY;
    applySurfaceSize(zoom);
    viewport.scrollLeft = anchoredX * zoom / previous - localX;
    viewport.scrollTop = anchoredY * zoom / previous - localY;
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = Math.round(zoom * 100) + "%";
  };
  if(academyCanvas){
    viewport.addEventListener("merzkava-academy-canvas-expansion-preview",((event:Event)=>{
      academyExpansion=normalizeIsoCanvasExpansion((event as CustomEvent<unknown>).detail);
      const left=viewport.scrollLeft,top=viewport.scrollTop;
      sizeBaseMap();applySurfaceSize(zoom);
      viewport.scrollLeft=left;viewport.scrollTop=top;
    }) as EventListener);
  }
  const centerMap = () => {
    sizeBaseMap();
    zoom = 1;
    applySurfaceSize(1);
    viewport.scrollLeft = Math.max(0, (baseWidth - viewport.clientWidth) / 2);
    viewport.scrollTop = Math.max(0, (baseHeight - viewport.clientHeight) / 2);
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = "100%";
  };
  // World-map markers are fixed map anchors: their pointer gestures must never
  // enter the viewport pan/pinch tracker. Keep click bubbling for the preview handler.
  viewport.querySelectorAll<HTMLElement>(".wmh-power:not(.wmh-editor-marker)").forEach(marker => {
    marker.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();
      panStart = null;
      pinchStart = null;
      try { marker.focus({ preventScroll: true }); } catch { /* older WebViews */ }
    });
    for (const type of ["pointermove", "pointerup", "pointercancel"]) {
      marker.addEventListener(type, event => event.stopPropagation());
    }
    marker.addEventListener("dragstart", event => event.preventDefault());
  });
  dialog.querySelectorAll<HTMLElement>("[data-wmh-zoom]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.wmhZoom;
    if (action === "reset") { centerMap(); return; }
    applyZoom(action === "in" ? zoom + .25 : zoom - .25);
  }));
  viewport.addEventListener("pointerdown", event => {
    // A marker tap is a selection, never a map-pan gesture. Do not register it
    // in the gesture tracker; otherwise a stale one-finger pan can move the map.
    if ((event.target as Element).closest(".wmh-power")) {
      panStart = null;
      pinchStart = null;
      return;
    }
    // Keep the custom camera in charge of every Academy drag direction.
    if(academyCanvas)event.preventDefault();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      panStart = { x: event.clientX, y: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };
      try { viewport.setPointerCapture(event.pointerId); } catch { /* pointer capture may be unavailable */ }
    } else if (pointers.size === 2) {
      const pair = [...pointers.values()];
      pinchStart = { distance: Math.max(1, distance(pair[0], pair[1])), zoom };
      panStart = null;
      for (const id of pointers.keys()) {
        try { viewport.setPointerCapture(id); } catch { /* pointer capture may be unavailable */ }
      }
    }
  });
  viewport.addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2 && pinchStart) {
      const pair = [...pointers.values()].slice(0,2);
      const center = midpoint(pair[0], pair[1]);
      applyZoom(pinchStart.zoom * distance(pair[0], pair[1]) / pinchStart.distance, center.x, center.y);
      event.preventDefault();
    } else if (pointers.size === 1 && panStart) {
      viewport.scrollLeft = panStart.scrollLeft - (event.clientX - panStart.x);
      viewport.scrollTop = panStart.scrollTop - (event.clientY - panStart.y);
      event.preventDefault();
    }
  });
  const endPointer = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 1) {
      const remaining = [...pointers.values()][0];
      panStart = { x: remaining.x, y: remaining.y, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };
    } else panStart = null;
  };
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  if (image.complete && image.naturalWidth) centerMap();
  else image.addEventListener("load", centerMap, { once: true });
}
function mapEditorMarkup(): string {
  const markers = readWorldMarkers();
  return '<div class="wmh-map-editor"><div class="wmh-editor-intro"><b>WORLD MAP · COORDINATE EDITOR</b><span>DRAG MARKERS OR EDIT X / Y · NEW PLACEMENTS ARE PROVISIONAL · 0–100%</span></div>' +
    '<div class="wmh-map-zoom" data-wmh-zoom-controls><button type="button" data-wmh-zoom="out" aria-label="Zoom out">−</button><span data-wmh-zoom-level>100%</span><button type="button" data-wmh-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-zoom="reset">RESET</button></div>' +
    '<div class="wmh-editor-canvas" data-wmh-editor-canvas><div class="wmh-editor-map-surface" data-wmh-map-surface><img src="/world/Untitled77_20261029054536.png" alt="World map coordinate canvas" />' +
    markers.map(marker => worldMapMarkerMarkup(marker, true)).join("") + '<div class="wmh-editor-crosshair" aria-hidden="true"></div></div></div>' +
    '<div class="wmh-coordinate-table-wrap"><table class="wmh-coordinate-table"><thead><tr><th>TYPE</th><th>AREA</th><th>X (%)</th><th>Y (%)</th></tr></thead><tbody>' +
    markers.map(marker => '<tr data-wmh-coordinate-row="' + marker.id + '"><td>' + marker.category.toUpperCase() + (marker.placementStatus === "provisional" ? ' · TEMP' : '') + '</td><td>' + marker.name + '</td><td><input type="number" min="0" max="100" step="0.1" value="' + marker.x + '" data-wmh-coordinate="' + marker.id + '" data-axis="x" aria-label="' + marker.name + ' X coordinate" /></td><td><input type="number" min="0" max="100" step="0.1" value="' + marker.y + '" data-wmh-coordinate="' + marker.id + '" data-axis="y" aria-label="' + marker.name + ' Y coordinate" /></td></tr>').join("") +
    '</tbody></table></div><section class="wmh-coordinate-transfer"><div class="wmh-transfer-heading"><b>COORDINATE REFERENCE</b><span>PORTABLE COPY · JSON</span></div><p>Copy this complete reference to preserve every power, territory, forest, sea, and landmark marker. Provisional positions are clearly tagged.</p><textarea readonly spellcheck="false" data-wmh-export aria-label="Exportable world map coordinate reference"></textarea><div class="wmh-editor-actions"><button type="button" data-wmh-action="editor-copy">COPY COORDINATES</button></div><label class="wmh-import-label" for="wmh-coordinate-import">PASTE A PREVIOUS COORDINATE REFERENCE</label><textarea id="wmh-coordinate-import" spellcheck="false" data-wmh-import placeholder="Paste the copied JSON reference here..."></textarea><button class="wmh-import-button" type="button" data-wmh-action="editor-import">IMPORT PASTED COORDINATES</button></section><div class="wmh-editor-actions"><button type="button" data-wmh-action="editor-reset">RESET DEFAULTS</button><button type="button" data-wmh-action="editor-close">← WORLD MAP</button></div><p class="wmh-editor-status" data-wmh-editor-status>New locations use provisional display positions. Move them to their correct map locations, then confirm to save.</p><div class="wmh-editor-confirm-bar"><span>POSITION PREVIEW</span><button type="button" data-wmh-action="editor-confirm">✓ &nbsp; CONFIRM &amp; LOCK POSITIONS</button></div></div>';
}
function bindWorldMapEditor(dialog: HTMLElement): void {
  const canvas = dialog.querySelector<HTMLElement>("[data-wmh-editor-canvas]");
  if (!canvas || canvas.dataset.bound === "true") return;
  canvas.dataset.bound = "true";
  let markers = readWorldMarkers();
  let dragging: { id: WorldMarkerId; pointerId: number; offsetX: number; offsetY: number; scrollLeft: number; scrollTop: number } | null = null;
  const exportField = dialog.querySelector<HTMLTextAreaElement>("[data-wmh-export]");
  const surface = canvas.querySelector<HTMLElement>("[data-wmh-map-surface]");
  const mapImage = surface?.querySelector<HTMLImageElement>("img");
  if (!surface || !mapImage) return;
  let zoom = 1;
  const originalTouchAction = canvas.style.touchAction;
  const applyZoom = () => {
    surface.style.width = (zoom * 100) + "%";
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = Math.round(zoom * 100) + "%";
    markers.forEach(paint);
  };
  const mapBounds = () => surface.getBoundingClientRect();
  const refreshExport = () => { if (exportField) exportField.value = serializeWorldMapCoordinates(markers); };
  refreshExport();
  const setStatus = (message: string) => {
    const status = dialog.querySelector<HTMLElement>("[data-wmh-editor-status]");
    if (status) status.textContent = message;
  };
  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value * 10) / 10));
  const paint = (marker: WorldMarker) => {
    const button = canvas.querySelector<HTMLElement>('[data-wmh-drag-marker="' + marker.id + '"]');
    if (button) {
      button.style.left = marker.x + "%";
      button.style.top = marker.y + "%";
      button.title = marker.placementStatus === "provisional" ? "Provisional placement — adjust this marker" : "Owner-positioned map marker";
    }
    const row = dialog.querySelector<HTMLElement>('[data-wmh-coordinate-row="' + marker.id + '"]');
    row?.querySelectorAll<HTMLInputElement>("input").forEach(input => {
      const axis = input.dataset.axis as "x" | "y";
      if (document.activeElement !== input) input.value = String(marker[axis]);
    });
    if (row) {
      const typeCell = row.querySelector("td");
      if (typeCell) typeCell.textContent = marker.category.toUpperCase() + (marker.placementStatus === "provisional" ? " · TEMP" : "");
    }
  };
  applyZoom();
  if (!mapImage.complete) mapImage.addEventListener("load", () => markers.forEach(paint), { once: true });
  dialog.querySelectorAll<HTMLElement>("[data-wmh-zoom]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.wmhZoom;
    zoom = action === "reset" ? 1 : action === "in" ? Math.min(2.5, zoom + .25) : Math.max(1, zoom - .25);
    applyZoom();
  }));
  const updateMarkerCenter = (id: WorldMarkerId, centerX: number, centerY: number, lifted = false) => {
    const marker = markers.find(item => item.id === id);
    if (!marker) return;
    const bounds = mapBounds();
    // While lifted, the CSS raises the marker by 46 screen pixels. Store the
    // underlying anchor 46px lower so its VISIBLE center follows the retained
    // finger offset instead of applying the lift a second time.
    const layoutCenterY = centerY + (lifted ? 46 : 0);
    marker.x = clamp(((centerX - bounds.left) / bounds.width) * 100);
    marker.y = clamp(((layoutCenterY - bounds.top) / bounds.height) * 100);
    marker.placementStatus = "owner-set";
    paint(marker); refreshExport();
    setStatus(marker.name + " · X " + marker.x + "% · Y " + marker.y + "% · pending confirmation");
  };
  canvas.addEventListener("pointerdown", event => {
    const target = event.target as Element;
    const markerButton = target.closest<HTMLElement>("[data-wmh-drag-marker]");
    if (!markerButton || dragging) return;
    event.preventDefault();
    event.stopPropagation();
    const id = markerButton.dataset.wmhDragMarker as WorldMarkerId;
    canvas.style.touchAction = "none";
    // Lift first, then measure the marker's VISUAL center. The finger-to-marker
    // offset is retained for the entire gesture, including pointerup.
    markerButton.classList.add("wmh-editor-marker-lifted");
    const liftedBounds = markerButton.getBoundingClientRect();
    dragging = {
      id,
      pointerId: event.pointerId,
      offsetX: (liftedBounds.left + liftedBounds.width / 2) - event.clientX,
      offsetY: (liftedBounds.top + liftedBounds.height / 2) - event.clientY,
      scrollLeft: canvas.scrollLeft,
      scrollTop: canvas.scrollTop
    };
    try { markerButton.setPointerCapture(event.pointerId); } catch { /* pointer capture may be unavailable */ }
  });
  canvas.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    event.preventDefault();
    updateMarkerCenter(dragging.id, event.clientX + dragging.offsetX, event.clientY + dragging.offsetY, true);
  });
  const stop = (event: PointerEvent, commitFinalPoint: boolean) => {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    event.preventDefault();
    const active = dragging;
    const finalCenterX = event.clientX + active.offsetX;
    const finalCenterY = event.clientY + active.offsetY;
    // Remove the visual lift BEFORE committing the final anchor. This makes
    // the unlifted marker land exactly where its lifted visual center was.
    canvas.querySelector<HTMLElement>('[data-wmh-drag-marker="' + active.id + '"]')?.classList.remove("wmh-editor-marker-lifted");
    if (commitFinalPoint) updateMarkerCenter(active.id, finalCenterX, finalCenterY, false);
    dragging = null;
    canvas.style.touchAction = originalTouchAction || "pan-x pan-y";
    // A marker drag must never cause the scroll viewport to jump to the release point.
    canvas.scrollLeft = active.scrollLeft;
    canvas.scrollTop = active.scrollTop;
  };
  canvas.addEventListener("pointerup", event => stop(event, true));
  canvas.addEventListener("pointercancel", event => stop(event, false));
  dialog.querySelectorAll<HTMLInputElement>("[data-wmh-coordinate]").forEach(input => {
    input.addEventListener("change", () => {
      const id = input.dataset.wmhCoordinate as WorldMarkerId;
      const marker = markers.find(item => item.id === id);
      if (!marker) return;
      const value = Number(input.value);
      if (!Number.isFinite(value)) { input.value = String(marker[input.dataset.axis as "x" | "y"]); return; }
      const axis = input.dataset.axis as "x" | "y";
      marker.placementStatus = "owner-set";
      marker[axis] = clamp(value);
      paint(marker); refreshExport();
      setStatus(marker.name + " · X " + marker.x + "% · Y " + marker.y + "% · pending confirmation");
    });
  });
  const saveCoordinates = () => {
    try {
      localStorage.setItem(WORLD_MAP_COORDINATES_KEY, JSON.stringify(markers));
      const provisionalCount = markers.filter(marker => marker.placementStatus === "provisional").length;
      setStatus("Positions saved on this device. " + provisionalCount + " location(s) still have provisional placement and can be adjusted later.");
    } catch { setStatus("Could not save: device storage is unavailable. Copy the JSON reference as a backup."); }
  };
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-confirm"]')?.addEventListener("click", saveCoordinates);
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-copy"]')?.addEventListener("click", async () => {
    refreshExport();
    const value = exportField?.value || serializeWorldMapCoordinates(markers);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setStatus("Complete world-map coordinate reference copied.");
      } else throw new Error("Clipboard API unavailable");
    } catch {
      if (exportField) {
        exportField.focus(); exportField.select();
        const copied = document.execCommand?.("copy");
        setStatus(copied ? "Coordinate reference copied." : "Select the JSON text above and use Copy from your device menu.");
      } else setStatus("Clipboard unavailable. Select and copy the JSON reference manually.");
    }
  });
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-import"]')?.addEventListener("click", () => {
    const field = dialog.querySelector<HTMLTextAreaElement>("[data-wmh-import]");
    try {
      const parsed = JSON.parse(field?.value || "");
      const incoming = Array.isArray(parsed) ? parsed : parsed?.markers;
      if (!Array.isArray(incoming) || !incoming.length || incoming.some((item: any) =>
        !defaultWorldMarkers.some(base => base.id === item?.id) ||
        !Number.isFinite(Number(item?.x)) || !Number.isFinite(Number(item?.y)))) {
        throw new Error("Invalid marker coordinates");
      }
      markers = defaultWorldMarkers.map(base => {
        const item = incoming.find((entry: any) => entry.id === base.id);
        return item ? {
          ...base, x: clamp(Number(item.x)), y: clamp(Number(item.y)),
          placementStatus: item.placementStatus === "owner-set" ? "owner-set" : base.placementStatus
        } : { ...base };
      });
      markers.forEach(paint); refreshExport();
      setStatus("Imported coordinates are a preview. Confirm & lock positions to save them on this device.");
    } catch { setStatus("Import failed. Paste a complete Merzkava world-map JSON reference containing at least one known marker ID."); }
  });
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-reset"]')?.addEventListener("click", () => {
    markers = defaultWorldMarkers.map(item => ({ ...item }));
    markers.forEach(paint); refreshExport();
    setStatus("Default coordinates restored in preview. New area placements remain provisional.");
  });
}

function bindIsometricMapArt(dialog: HTMLElement): void {
  const images = Array.from(dialog.querySelectorAll<HTMLImageElement>("[data-wmh-academy-map-art],[data-wmh-map-art]"));
  images.forEach(image => {
    if (image.dataset.mapArtBound === "true") return;
    image.dataset.mapArtBound = "true";
    image.addEventListener("error", () => {
      image.closest<HTMLElement>(".wmh-academy-mini-map-thumb,[data-wmh-board]")?.classList.add("wmh-map-art-missing");
      image.remove();
    }, { once: true });
    const board = image.closest<HTMLElement>("[data-wmh-board]");
    const ready = () => {
      if (!image.naturalWidth) return;
      image.style.width = image.naturalWidth + "px";
      image.style.height = image.naturalHeight + "px";
      image.style.opacity = "1";
      image.style.visibility = "visible";
      image.style.display = "block";
      if (board) drawIsometricForeground(board);
    };
    if (image.complete && image.naturalWidth) ready();
    else if (image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event("error"));
    else image.addEventListener("load", ready, { once: true });
  });
}

function isometricNpcTokensMarkup(mapId:string,interior:boolean):string {
  const maps:Record<string,Array<{id:string;x:number;y:number;gender:"male"|"female"}>>={
    "golden-dragon-empire:tianhai-academy:exterior":[
      {id:"student-lin",x:7,y:4,gender:"female"},{id:"student-wei",x:10,y:9,gender:"male"},
      {id:"teacher-mei",x:6,y:15,gender:"female"},{id:"groundskeeper",x:22,y:5,gender:"male"}],
    "golden-dragon-empire:public-arena:exterior":[
      {id:"arena-referee",x:10,y:3,gender:"male"},{id:"arena-fighter",x:15,y:8,gender:"female"},{id:"arena-spectator",x:19,y:15,gender:"male"}],
    "golden-dragon-empire:sparring-arena:exterior":[
      {id:"arena-referee",x:10,y:3,gender:"male"},{id:"arena-fighter",x:15,y:8,gender:"female"},{id:"arena-spectator",x:19,y:15,gender:"male"}],
    "golden-dragon-empire:imperial-capital:exterior":[
      {id:"gde-warden",x:3,y:4,gender:"male"},{id:"gde-herbalist",x:12,y:9,gender:"female"},{id:"gde-courier",x:20,y:5,gender:"male"}],
    "golden-dragon-empire:imperial-market:exterior":[
      {id:"gde-herbalist",x:8,y:7,gender:"female"},{id:"gde-courier",x:17,y:12,gender:"male"}],
    "tianhai-yunzhou:yunxiao-terrace:exterior":[
      {id:"ty-clerk",x:4,y:4,gender:"female"},{id:"ty-sailor",x:12,y:9,gender:"male"},{id:"ty-arcanist",x:20,y:5,gender:"female"}],
    "tianhai-yunzhou:cangqiong-harbor:exterior":[
      {id:"ty-clerk",x:4,y:4,gender:"female"},{id:"ty-sailor",x:12,y:9,gender:"male"}],
    "beiming-gu:beiming-heartland:exterior":[
      {id:"bg-guide",x:4,y:4,gender:"male"},{id:"bg-trainee",x:12,y:9,gender:"female"},{id:"bg-attendant",x:20,y:5,gender:"male"}],
    "beiming-gu:mountain-pass:exterior":[
      {id:"bg-guide",x:4,y:4,gender:"male"},{id:"bg-trainee",x:12,y:9,gender:"female"}]
  };
  const fallback=interior
    ? [{id:"teacher",x:6,y:2,gender:"male" as const},{id:"student-lin",x:3,y:4,gender:"female" as const}]
    : mapId.startsWith("isometric-render-test:")
      ? [{id:"test-guide",x:3,y:3,gender:"female" as const},{id:"test-scholar",x:12,y:4,gender:"male" as const},{id:"test-mechanic",x:11,y:9,gender:"female" as const}]
      : mapId.startsWith("tianhai-yunzhou:")
        ? [{id:"ty-clerk",x:4,y:4,gender:"female" as const},{id:"ty-sailor",x:12,y:9,gender:"male" as const},{id:"ty-arcanist",x:20,y:5,gender:"female" as const}]
        : mapId.startsWith("beiming-gu:")
          ? [{id:"bg-guide",x:4,y:4,gender:"male" as const},{id:"bg-trainee",x:12,y:9,gender:"female" as const},{id:"bg-attendant",x:20,y:5,gender:"male" as const}]
          : [{id:"gde-warden",x:3,y:4,gender:"male" as const},{id:"gde-herbalist",x:12,y:9,gender:"female" as const}];
  return (maps[mapId]||fallback).map(npc =>
    '<button type="button" class="wmh-character-token wmh-npc-token '+(npc.gender==="female"?"is-female":"is-male")+'" data-wmh-npc="'+npc.id+'" data-token-label="'+(mapId.startsWith("isometric-render-test:")?(npc.id==="test-guide"?"GUIDE":npc.id==="test-scholar"?"SCHOLAR":"ARTIFICER"):"")+'" data-x="'+npc.x+'" data-y="'+npc.y+'" style="--token-x:'+npc.x+';--token-y:'+npc.y+'" aria-label="Talk to '+npc.id+'"><i></i></button>'
  ).join("");
}

function tileMapMarkup(
  interior = false,
  mapId = "academy-exterior",
  mapImage = "",
  regionId: RegionId = "golden-dragon-empire",
  selectedBuilding = "Tianhai Academy",
): string {
  // The live Atlas test yard remains mounted by its untouched SVG interceptor.
  // Retain this dormant fallback only for the legacy test route.
  const isometricTestArea = !interior && mapId.startsWith("isometric-render-test:");
  if (isometricTestArea) {
    const cols=16,rows=12,tileW=72,tileH=36;
    const projectedWidth=(cols+rows-2)*tileW/2+tileW;
    const projectedHeight=(cols+rows-2)*tileH/2+tileH+7;
    const features:Record<string,string>={
      "7-0":"test-gate","8-0":"test-gate","11-2":"test-water","12-2":"test-water",
      "11-3":"test-water","12-3":"test-water","2-2":"test-garden","3-2":"test-garden",
      "2-3":"test-garden","3-3":"test-garden","12-8":"test-garden","13-8":"test-garden",
      "12-9":"test-garden","13-9":"test-garden","4-5":"test-plaza","5-5":"test-plaza",
      "6-5":"test-plaza","9-5":"test-plaza","10-5":"test-plaza","11-5":"test-plaza",
      "3-9":"test-tree","14-4":"test-tree"
    };
    const tiles=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>{
      const feature=features[x+"-"+y]||(((x===7||x===8)&&(y>=1&&y<=11))||((y===6||y===7)&&x>=2&&x<=13)?"test-path":"");
      const surface=feature==="test-water"?"wet":feature==="test-garden"||feature==="test-tree"?"earth":"stone";
      return '<button type="button" class="wmh-tile wmh-tile-'+surface+(feature?' has-feature feature-'+feature:'')+
        '" data-wmh-tile data-x="'+x+'" data-y="'+y+'" data-z="0" data-tile-id="tile-'+x+'-'+y+
        '" data-surface="'+surface+'" style="--tile-x:'+x+';--tile-y:'+y+'" aria-label="Test tile '+x+', '+y+'"></button>';
    }).join("")).join("");
    const npcTokens=isometricNpcTokensMarkup(mapId,interior);
    return '<div class="wmh-iso-controls"><button type="button" data-wmh-iso-zoom="out" aria-label="Zoom out">−</button><span data-wmh-iso-level>100%</span><button type="button" data-wmh-iso-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-iso-zoom="reset">FIT</button><button type="button" data-wmh-iso-center>CENTER MAP</button><small>DRAG TO PAN · PINCH TO ZOOM</small></div>'+
      '<div class="wmh-isometric-wrap" data-wmh-iso-viewport><div class="wmh-isometric-camera" data-wmh-iso-camera><div class="wmh-isometric-board is-exterior is-render-test is-placeholder" data-wmh-board style="--tile-cols:'+cols+';--tile-rows:'+rows+
      ';--iso-center-x:'+(rows*tileW/2)+'px;--iso-board-width:'+projectedWidth+'px;--iso-board-height:'+projectedHeight+'px;--tile-w:'+tileW+'px;--tile-h:'+tileH+
      'px;--iso-half-w:'+(tileW/2)+'px;--iso-half-h:'+(tileH/2)+'px;--iso-offset-y:0px;--slab-depth:7px" data-cols="'+cols+'" data-rows="'+rows+
      '" data-tile-w="'+tileW+'" data-tile-h="'+tileH+'" data-offset-x="0" data-offset-y="0" data-map-id="'+escapeMapEditorText(mapId)+'">'+tiles+
      '<svg class="wmh-area-overlay-svg" data-wmh-overlay-svg viewBox="0 0 '+projectedWidth+' '+projectedHeight+'" preserveAspectRatio="none"><g data-wmh-interaction-grid></g><g data-wmh-overlay-marks></g><g data-wmh-manual-marks></g><g data-wmh-transition-marks></g><path data-wmh-overlay-preview class="wmh-area-mark-preview" d=""></path></svg>'+
      '<button type="button" class="wmh-character-token wmh-player-token" data-wmh-player-token data-token-label="YOU" data-x="5" data-y="10" style="--token-x:5;--token-y:10" aria-label="Player character"><i></i></button>'+npcTokens+
      '</div></div></div>';
  }

  const academyExterior = !interior && mapId.startsWith("golden-dragon-empire:tianhai-academy:exterior");
  const cols = interior ? 12 : 24;
  const rows = interior ? 10 : 20;
  const tileW = academyExterior && mapImage ? 128 : 64;
  const tileH = academyExterior && mapImage ? 69.5 : 32;
  const baseWidth = mapImage ? 2816 : 0;
  const baseHeight = mapImage ? 1536 : 0;
  const grid:IsoMapGridConfig={
    cols,rows,tileW,tileH,offsetX:0,offsetY:0,playerScale:1,npcScale:1
  };
  const projectedWidth=(cols+rows-2)*tileW/2+tileW;
  const projectedHeight=(cols+rows-2)*tileH/2+tileH+7;
  const boardWidth=Math.max(projectedWidth,baseWidth);
  const boardHeight=Math.max(projectedHeight,baseHeight);
  const theme:IsometricSvgTheme=interior?"interior":regionId;
  const title=selectedBuilding+(interior?" · INTERIOR":"");
  const imageMarkup=mapImage
    ? '<img class="wmh-isometric-map-base" data-wmh-map-art src="'+mapImage+'" alt="Tianhai Academy map base" draggable="false" loading="eager" decoding="async"/><canvas class="wmh-isometric-foreground" data-wmh-foreground-canvas aria-hidden="true"></canvas>'
    : "";
  const sceneMarkup=renderIsometricSvgSceneMarkup({
    mapId,grid,theme,title,baseImage:!!mapImage,width:boardWidth,height:boardHeight
  });
  const npcTokens=isometricNpcTokensMarkup(mapId,interior);
  const boardClass='wmh-isometric-board wmh-svg-ground-map '+(interior?'is-interior':'is-exterior')+
    (mapImage?' has-map-base is-minimap-style':' is-placeholder')+
    '';
  return '<div class="wmh-iso-controls"><button type="button" data-wmh-iso-zoom="out" aria-label="Zoom out">−</button><span data-wmh-iso-level>100%</span><button type="button" data-wmh-iso-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-iso-zoom="reset">FIT</button><button type="button" data-wmh-iso-center aria-label="Center isometric map">CENTER MAP</button><small>DRAG TO PAN · PINCH TO ZOOM</small></div>'+
    '<div class="wmh-isometric-wrap" data-wmh-iso-viewport><div class="wmh-isometric-camera" data-wmh-iso-camera><div class="'+boardClass+'" data-wmh-board style="--tile-cols:'+cols+';--tile-rows:'+rows+
    ';--iso-center-x:'+(rows*tileW/2)+'px;--iso-board-width:'+boardWidth+'px;--iso-board-height:'+boardHeight+'px;--tile-w:'+tileW+'px;--tile-h:'+tileH+
    'px;--iso-half-w:'+(tileW/2)+'px;--iso-half-h:'+(tileH/2)+'px;--iso-offset-y:0px;--slab-depth:7px" data-cols="'+cols+'" data-rows="'+rows+
    '" data-tile-w="'+tileW+'" data-tile-h="'+tileH+'" data-offset-x="0" data-offset-y="0" data-map-id="'+escapeMapEditorText(mapId)+
    '" data-map-theme="'+theme+'" data-map-title="'+escapeMapEditorText(title)+'" data-map-interior="'+String(interior)+'">'+
    imageMarkup+sceneMarkup+
    '<svg class="wmh-area-overlay-svg" data-wmh-overlay-svg viewBox="0 0 '+boardWidth+' '+boardHeight+'" preserveAspectRatio="none"><g data-wmh-overlay-marks></g><g data-wmh-manual-marks></g><g data-wmh-transition-marks></g><path data-wmh-overlay-preview class="wmh-area-mark-preview" d=""></path></svg>'+
    '<button type="button" class="wmh-character-token wmh-player-token" data-wmh-player-token data-token-label="" data-x="5" data-y="'+(interior?8:17)+'" style="--token-x:5;--token-y:'+(interior?8:17)+'" aria-label="Player character"><i></i></button>'+npcTokens+
    '</div></div></div>';
}
function isometricMapBaseFor(regionId: RegionId, selectedBuilding: string, interior: boolean): string {
  if (interior) return "";
  const place = selectedBuilding.trim().toLowerCase().replace(/\s+/g, " ");
  if (regionId === "golden-dragon-empire" && (place === "tianhai academy" || place === "academy")) return "/maps/academy/full-map/1_academy.jpg";
  return "";
}
function makeIsometricMapId(regionId: RegionId, selectedBuilding: string, interior: boolean): string {
  const slug=selectedBuilding.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  return regionId+":"+(slug||"unnamed-area")+":"+(interior?"interior":"exterior");
}
function isoMergedGroupBoundaryPath(cells:string[],grid:IsoMapGridConfig):string {
  const edges=new Map<string,{a:{x:number;y:number};b:{x:number;y:number};count:number}>();
  const vertexKey=(point:{x:number;y:number})=>Math.round(point.x*1000)+","+Math.round(point.y*1000);
  const addEdge=(a:{x:number;y:number},b:{x:number;y:number})=>{
    const ka=vertexKey(a),kb=vertexKey(b),key=ka<kb?ka+"|"+kb:kb+"|"+ka;
    const edge=edges.get(key);
    if(edge)edge.count++;else edges.set(key,{a,b,count:1});
  };
  for(const cell of cells){
    const [x,y]=cell.split(",").map(Number),center=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
    const top={x:center.x,y:center.y-hh},right={x:center.x+hw,y:center.y},bottom={x:center.x,y:center.y+hh},left={x:center.x-hw,y:center.y};
    addEdge(top,right);addEdge(right,bottom);addEdge(bottom,left);addEdge(left,top);
  }
  return [...edges.values()].filter(edge=>edge.count===1).map(edge=>"M"+edge.a.x+" "+edge.a.y+" L"+edge.b.x+" "+edge.b.y).join(" ");
}
function isoGridCellExists(data:IsoMapEditorData,x:number,y:number):boolean {
  return (x>=0&&y>=0&&x<data.grid.cols&&y<data.grid.rows)||data.customGridCells.includes(isoCellKey(x,y));
}
function isoCellIsWalkable(data:IsoMapEditorData,x:number,y:number):boolean {
  return isoGridCellExists(data,x,y)&&(!data.walkableAreaEnabled||data.walkableCells.includes(isoCellKey(x,y)))&&!isoCellHasLayer(data,"blockedCells",x,y);
}
function isoCanStep(data:IsoMapEditorData,fromX:number,fromY:number,toX:number,toY:number):boolean {
  if(!isoGridCellExists(data,fromX,fromY)||!isoCellIsWalkable(data,toX,toY))return false;
  const edges:Record<string,[IsoQuadrant,IsoQuadrant]>={"1,0":["br","tl"],"-1,0":["tl","br"],"0,1":["bl","tr"],"0,-1":["tr","bl"]};
  const edge=edges[(toX-fromX)+","+(toY-fromY)];
  return !!edge&&!isoQuadrantHasLayer(data,"blockedQuadrants",fromX,fromY,edge[0])&&!isoQuadrantHasLayer(data,"blockedQuadrants",toX,toY,edge[1]);
}
function isoQuadrantTrianglePoints(x:number,y:number,quadrant:IsoQuadrant,grid:IsoMapGridConfig):string {
  const c=isoCellCenter(x,y,grid),top={x:c.x,y:c.y-grid.tileH/2},right={x:c.x+grid.tileW/2,y:c.y},bottom={x:c.x,y:c.y+grid.tileH/2},left={x:c.x-grid.tileW/2,y:c.y},center={x:c.x,y:c.y};
  const triangles:Record<IsoQuadrant,Array<{x:number;y:number}>>={tl:[top,center,left],tr:[top,right,center],bl:[left,center,bottom],br:[center,right,bottom]};
  return triangles[quadrant].map(point=>point.x+","+point.y).join(" ");
}
function academyInteractionGridMarkup(grid:IsoMapGridConfig,data:IsoMapEditorData):string {
  const cells:string[]=[];
  const addCell=(x:number,y:number,custom:boolean)=>{
    const c=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
    const points=[c.x+","+(c.y-hh),(c.x+hw)+","+c.y,c.x+","+(c.y+hh),(c.x-hw)+","+c.y].join(" ");
    const selected=data.walkableCells.includes(isoCellKey(x,y));
    cells.push('<polygon class="wmh-academy-hit-cell'+(selected?' is-walkable':'')+(custom?' is-custom-grid-cell':'')+'" data-wmh-tile data-x="'+x+'" data-y="'+y+'" data-z="0" data-tile-id="academy-'+x+'-'+y+'" data-surface="earth" points="'+points+'" aria-label="Grid tile '+x+', '+y+'"/>');
    cells.push('<path class="wmh-quadrant-divider" d="M'+c.x+' '+(c.y-hh)+' L'+c.x+' '+(c.y+hh)+' M'+(c.x-hw)+' '+c.y+' L'+(c.x+hw)+' '+c.y+'"/>');
  };
  for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++)addCell(x,y,false);
  data.customGridCells.forEach(key=>{const [x,y]=key.split(",").map(Number);addCell(x,y,true);});
  return cells.join("");
}
function escapeMapEditorText(value: unknown): string {
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}
function isoOverlayKey(board: HTMLElement): string {
  return isoMapStorageKey(board.dataset.mapId||"unnamed-isometric-map");
}
function readIsoMapData(board: HTMLElement): IsoMapEditorData {
  const mapId=board.dataset.mapId||"unnamed-isometric-map";
  const fallback:IsoMapGridConfig={
    ...DEFAULT_ISOMETRIC_GRID,
    cols:Number(board.dataset.cols||24),
    rows:Number(board.dataset.rows||20),
    tileW:Number(board.dataset.tileW||(board.classList.contains("has-map-base")?128:DEFAULT_ISOMETRIC_GRID.tileW)),
    tileH:Number(board.dataset.tileH||(board.classList.contains("has-map-base")?69.5:DEFAULT_ISOMETRIC_GRID.tileH)),
    offsetX:Number(board.dataset.offsetX||0),
    offsetY:Number(board.dataset.offsetY||0),
  };
  try {
    const saved=JSON.parse(localStorage.getItem(isoOverlayKey(board))||"null");
    if(saved)return normalizeIsoMapEditorData(saved,mapId,fallback);
  } catch {}
  // Refreshed map IDs start clean; old maps are not silently imported.
  return createIsoMapEditorData(mapId,fallback);
}
function drawIsometricForeground(board:HTMLElement,data=readIsoMapData(board)):void {
  const canvas=board.querySelector<HTMLCanvasElement>("[data-wmh-foreground-canvas]");
  const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
  if(!canvas||!image||!image.complete||!image.naturalWidth||!image.naturalHeight)return;
  const dataGrid=data.grid;
  // Display the original checked-in JPG directly. Avoid generating a large
  // PNG data URL: the same direct image element works in Android WebView.
  image.style.width=image.naturalWidth+"px";
  image.style.height=image.naturalHeight+"px";
  image.style.opacity="1";
  image.style.visibility="visible";
  image.style.display="block";
  const academyArtwork=board.dataset.academyArtworkBoard==="true";
  const projectedWidth=(dataGrid.cols+dataGrid.rows-2)*dataGrid.tileW/2+dataGrid.tileW;
  const projectedHeight=(dataGrid.cols+dataGrid.rows-2)*dataGrid.tileH/2+dataGrid.tileH+7;
  const boardWidth=academyArtwork?image.naturalWidth:Math.max(projectedWidth,image.naturalWidth);
  const boardHeight=academyArtwork?image.naturalHeight:Math.max(projectedHeight,image.naturalHeight);
  const dimensionsChanged=!academyArtwork&&(board.offsetWidth!==boardWidth||board.offsetHeight!==boardHeight);
  if(dimensionsChanged){
    board.style.setProperty("--iso-board-width",boardWidth+"px");
    board.style.setProperty("--iso-board-height",boardHeight+"px");
    board.style.width=boardWidth+"px";board.style.height=boardHeight+"px";
    board.querySelector<SVGSVGElement>("[data-wmh-overlay-svg]")?.setAttribute("viewBox","0 0 "+boardWidth+" "+boardHeight);
    const camera=board.closest<HTMLElement>("[data-wmh-iso-camera]");
    const viewport=board.closest<HTMLElement>("[data-wmh-iso-viewport]");
    if(camera&&viewport){
      const padX=Number.parseFloat(board.style.getPropertyValue("--wmh-camera-pad-x"))||Math.max(1,viewport.clientWidth)*4;
      const padY=Number.parseFloat(board.style.getPropertyValue("--wmh-camera-pad-y"))||Math.max(1,viewport.clientHeight)*4;
      const zoom=Number.parseFloat(board.style.getPropertyValue("--wmh-camera-zoom"))||1;
      camera.style.width=(boardWidth*zoom+padX*2)+"px";
      camera.style.height=(boardHeight*zoom+padY*2)+"px";
      board.style.setProperty("--wmh-camera-pad-x",padX+"px");
      board.style.setProperty("--wmh-camera-pad-y",padY+"px");
      viewport.scrollLeft=padX+boardWidth*zoom/2-viewport.clientWidth/2;
      viewport.scrollTop=padY+boardHeight*zoom/2-viewport.clientHeight/2;
    }
  }
  const width=image.clientWidth||image.naturalWidth,height=image.clientHeight||image.naturalHeight;
  const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  const scaleX=width/image.naturalWidth,scaleY=height/image.naturalHeight;
  canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
  canvas.style.left=image.offsetLeft+"px";canvas.style.top=image.offsetTop+"px";
  canvas.style.width=width+"px";canvas.style.height=height+"px";
  const ctx=canvas.getContext("2d");if(!ctx)return;
  ctx.setTransform(dpr*scaleX,0,0,dpr*scaleY,0,0);ctx.clearRect(0,0,image.naturalWidth,image.naturalHeight);
  if(!data.foregroundCells.length&&!data.foregroundQuadrants.length)return;
  const halfW=data.grid.tileW/2,halfH=data.grid.tileH/2,left=0,top=0;
  ctx.save();ctx.beginPath();
  for(const key of data.foregroundCells){
    const [x,y]=key.split(",").map(Number),center=isoCellCenter(x,y,data.grid),cx=center.x-left,cy=center.y-top;
    ctx.moveTo(cx,cy-halfH);ctx.lineTo(cx+halfW,cy);ctx.lineTo(cx,cy+halfH);ctx.lineTo(cx-halfW,cy);ctx.closePath();
  }
  for(const key of data.foregroundQuadrants){
    const match=/^(-?[0-9]+),(-?[0-9]+):(tl|tr|bl|br)$/.exec(key);if(!match)continue;
    const points=isoQuadrantTrianglePoints(Number(match[1]),Number(match[2]),match[3] as IsoQuadrant,data.grid).split(" ").map(point=>point.split(",").map(Number));
    ctx.moveTo(points[0][0]-left,points[0][1]-top);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0]-left,points[i][1]-top);
    ctx.closePath();
  }
  ctx.clip();ctx.drawImage(image,0,0,image.naturalWidth,image.naturalHeight);ctx.restore();
}
function isoCanWalkTile(board:HTMLElement,tile:HTMLElement|null,x:number,y:number,data=readIsoMapData(board)):boolean {
  if(!tile)return false;
  return isoCellIsWalkable(data,x,y);
}
function renderIsometricWorldStatus(dialog:HTMLElement):void {
  const hud=dialog.querySelector<HTMLElement>("[data-wmh-isometric-hud]");
  if(!hud)return;
  const save=getEternalSave();
  const atmosphere=getExpeditionAtmosphere();
  const cycle:Record<string,{label:string;icon:string;caption:string}>={
    Dawn:{label:"SUBUH",icon:"◔",caption:"FIRST LIGHT"},
    Morning:{label:"PAGI",icon:"☀",caption:"MORNING"},
    Day:{label:"SIANG",icon:"☼",caption:"DAYLIGHT"},
    Dusk:{label:"SENJA",icon:"◒",caption:"SUNSET"},
    Night:{label:"MALAM",icon:"☾",caption:"NIGHTFALL"},
  };
  const weather:Record<string,{label:string;icon:string}>={
    Clear:{label:"CERAH",icon:"☀"},Cloudy:{label:"BERAWAN",icon:"☁"},
    Fog:{label:"KABUT",icon:"≋"},Rain:{label:"HUJAN",icon:"☂"},Snow:{label:"SALJU",icon:"❄"},
  };
  const c=cycle[atmosphere.cycle]||cycle.Morning;
  const w=weather[atmosphere.weather]||weather.Clear;
  const hour=String(save?.hour??8).padStart(2,"0");
  const minute=String(save?.minute??0).padStart(2,"0");
  const set=(selector:string,value:string)=>{const node=hud.querySelector<HTMLElement>(selector);if(node)node.textContent=value;};
  set("[data-wmh-cycle-icon]",c.icon);set("[data-wmh-cycle-label]",c.label);set("[data-wmh-cycle-caption]",c.caption);
  set("[data-wmh-weather-icon]",w.icon);set("[data-wmh-weather-label]",w.label);
  set("[data-wmh-day]","HARI "+String(save?.day??1).padStart(2,"0"));
  set("[data-wmh-time]",hour+":"+minute);
  const player=dialog.querySelector<HTMLElement>("[data-wmh-board] [data-wmh-player-token]");
  set("[data-wmh-player-grid]",player?"GRID X "+String(player.dataset.x||0).padStart(2,"0")+" · Y "+String(player.dataset.y||0).padStart(2,"0"):"GRID X -- · Y --");
  const overlay=dialog.closest<HTMLElement>("[data-world-map-hierarchy]");
  if(overlay){overlay.dataset.wmhCycle=atmosphere.cycle.toLowerCase();overlay.dataset.wmhWeather=atmosphere.weather.toLowerCase();}
}
function renderIsometricMinimap(board:HTMLElement):void {
  const playScreen=board.closest<HTMLElement>("[data-wmh-isometric-play-screen]");
  const world=playScreen?.querySelector<HTMLElement>("[data-wmh-minimap-world]");
  const actors=world?.querySelector<HTMLElement>("[data-wmh-minimap-actors]");
  if(!world||!actors)return;
  const data=readIsoMapData(board);
  const style=getComputedStyle(board);
  const boardWidth=Number.parseFloat(style.getPropertyValue("--iso-board-width"))||board.offsetWidth||1;
  const boardHeight=Number.parseFloat(style.getPropertyValue("--iso-board-height"))||board.offsetHeight||1;
  world.style.setProperty("aspect-ratio",boardWidth+" / "+boardHeight,"important");

  const isTianhaiAcademy=board.dataset.mapId==="golden-dragon-empire:tianhai-academy:exterior";
  const gridSvg=world.querySelector<SVGSVGElement>("[data-wmh-minimap-grid]");
  const mainGridSvg=board.classList.contains("is-minimap-style")?board.querySelector<SVGSVGElement>("[data-wmh-scene-svg]"):null;
  if(gridSvg)gridSvg.style.display="";
  if(mainGridSvg)mainGridSvg.style.display="";

  // One geometry source for both displays: the minimap's SVG cell layer is also
  // mounted directly over the full-size Map Base. Only its presentation size differs.
  const signature=JSON.stringify({
    grid:data.grid,
    foreground:data.foregroundCells,
    blocked:data.blockedCells,
    opacity:data.opacityCells,
    walkable:data.walkableCells,
    customGridCells:data.customGridCells,
    walkableGroups:data.walkableCellGroups,
    walkableAreaEnabled:data.walkableAreaEnabled,
    foregroundQuadrants:data.foregroundQuadrants,
    blockedQuadrants:data.blockedQuadrants,
    opacityQuadrants:data.opacityQuadrants,
    transitions:data.transitions,
  });
  const renderGrid=(interactive:boolean):string=>{
    const grid=data.grid;
    const polygon=(x:number,y:number,cls:string)=> {
      const c=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
      const points=[c.x+","+(c.y-hh),(c.x+hw)+","+c.y,c.x+","+(c.y+hh),(c.x-hw)+","+c.y].join(" ");
      const tile=interactive
        ? ' data-wmh-tile data-x="'+x+'" data-y="'+y+'" data-z="0" data-tile-id="map-'+x+'-'+y+'" data-surface="earth" aria-label="Map tile '+x+', '+y+'"'
        : "";
      return '<polygon class="wmh-minimap-cell '+cls+'" points="'+points+'"'+tile+'/>';
    };
    const cells:string[]=[];
    for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++)cells.push(polygon(x,y,""));
    const overlays:string[]=[];
    data.customGridCells.forEach(key=>{
      const [x,y]=key.split(",").map(Number);
      overlays.push(polygon(x,y,data.walkableCells.includes(key)?"is-walkable is-custom-grid-cell":"is-custom-grid-cell"));
    });
    data.foregroundCells.forEach(key=>{const [x,y]=key.split(",").map(Number);overlays.push(polygon(x,y,"is-foreground"));});
    data.blockedCells.forEach(key=>{const [x,y]=key.split(",").map(Number);overlays.push(polygon(x,y,"is-blocked"));});
    data.opacityCells.forEach(key=>{const [x,y]=key.split(",").map(Number);overlays.push(polygon(x,y,"is-opacity"));});
    data.walkableCells.forEach(key=>{const [x,y]=key.split(",").map(Number);overlays.push(polygon(x,y,"is-walkable"));});
    data.walkableCellGroups.forEach(group=>{const d=isoMergedGroupBoundaryPath(group.cells,grid);if(d)overlays.push('<path class="wmh-minimap-merged-boundary" d="'+d+'"/>');});
    const addQuadrants=(keys:string[],cls:string)=>{
      keys.forEach(key=>{
        const match=/^(-?[0-9]+),(-?[0-9]+):(tl|tr|bl|br)$/.exec(key);if(!match)return;
        const points=isoQuadrantTrianglePoints(Number(match[1]),Number(match[2]),match[3] as IsoQuadrant,grid);
        overlays.push('<polygon class="wmh-minimap-cell '+cls+' is-quadrant" points="'+points+'"/>');
      });
    };
    addQuadrants(data.foregroundQuadrants,"is-foreground");addQuadrants(data.blockedQuadrants,"is-blocked");addQuadrants(data.opacityQuadrants,"is-opacity");
    const transitions=data.transitions.map(marker=>{
      const c=isoCellCenter(marker.x,marker.y,grid);
      return '<circle class="wmh-minimap-transition '+(marker.label.trim()?"is-named":"is-unlabelled")+'" cx="'+c.x+'" cy="'+c.y+'" r="22"><title>'+escapeMapEditorText(marker.label||"Unlabelled transition")+'</title></circle>';
    }).join("");
    return '<g class="wmh-vector-cells wmh-minimap-grid-cells">'+cells.join("")+'</g><g class="wmh-minimap-overlays">'+overlays.join("")+'</g><g class="wmh-minimap-transitions">'+transitions+'</g>';
  };

  if(gridSvg&&gridSvg.dataset.signature!==signature){
    gridSvg.setAttribute("viewBox","0 0 "+boardWidth+" "+boardHeight);
    gridSvg.innerHTML=renderGrid(false);
    gridSvg.dataset.signature=signature;
  }

  // The full map now receives the exact same SVG cells, overlays and transitions
  // as the minimap instead of maintaining a second, visually separate renderer.
  if(!isTianhaiAcademy&&mainGridSvg){
    mainGridSvg.classList.add("wmh-minimap-grid");
    mainGridSvg.setAttribute("viewBox","0 0 "+boardWidth+" "+boardHeight);
    mainGridSvg.setAttribute("preserveAspectRatio","none");
    if(mainGridSvg.dataset.minimapSignature!==signature){
      mainGridSvg.innerHTML=renderGrid(true);
      mainGridSvg.dataset.minimapSignature=signature;
    }
  }

  const position=(token:HTMLElement)=>{
    const center=isoCellCenter(Number(token.dataset.x||0),Number(token.dataset.y||0),data.grid);
    return {
      x:Math.max(0,Math.min(100,center.x/boardWidth*100)),
      y:Math.max(0,Math.min(100,center.y/boardHeight*100)),
    };
  };
  const player=board.querySelector<HTMLElement>("[data-wmh-player-token]");
  const items:string[]=[];
  if(!board.classList.contains("wmh-overlay-editing")&&player){
    const p=position(player);
    items.push('<span class="wmh-minimap-dot is-player" data-minimap-player style="left:'+p.x+'%;top:'+p.y+'%" aria-label="Player position"></span>');
  }
  if(!board.classList.contains("wmh-overlay-editing"))board.querySelectorAll<HTMLElement>("[data-wmh-npc]").forEach((npc,index)=>{
    const p=position(npc);
    items.push('<span class="wmh-minimap-dot is-npc '+(npc.classList.contains("is-female")?"is-female":"is-male")+'" data-minimap-npc="'+index+'" style="left:'+p.x+'%;top:'+p.y+'%" title="'+escapeMapEditorText(npc.dataset.wmhNpc||"NPC")+'"></span>');
  });
  actors.innerHTML=items.join("");
  const footer=world.closest<HTMLElement>("[data-wmh-minimap]")?.querySelector<HTMLElement>("[data-wmh-minimap-footer]");
  if(footer&&player){
    footer.textContent="YOU · X "+String(player.dataset.x||0).padStart(2,"0")+" / Y "+String(player.dataset.y||0).padStart(2,"0")+" · TAP TO MOVE";
  }
}
function bindAcademyMapControls(dialog:HTMLElement):void {
  const viewport=dialog.querySelector<HTMLElement>("[data-wmh-academy-map-viewport]");
  const surface=viewport?.querySelector<HTMLElement>(".wmh-academy-empty-surface");
  const reset=dialog.querySelector<HTMLButtonElement>("[data-wmh-academy-map-reset]");
  const center=dialog.querySelector<HTMLButtonElement>("[data-wmh-academy-map-center]");
  if(!viewport||!surface||viewport.dataset.controlsBound==="true")return;
  viewport.dataset.controlsBound="true";
  let zoom=1;
  const apply=()=>{surface.style.transform="translate(0,0) scale("+zoom+")";};
  reset?.addEventListener("click",()=>{zoom=1;apply();viewport.scrollTo({left:0,top:0,behavior:"smooth"});});
  center?.addEventListener("click",()=>{
    viewport.scrollTo({left:Math.max(0,(viewport.scrollWidth-viewport.clientWidth)/2),top:Math.max(0,(viewport.scrollHeight-viewport.clientHeight)/2),behavior:"smooth"});
    surface.style.transformOrigin="center center";
    apply();
  });
}
function bindIsometricHud(dialog:HTMLElement):void {
  const hud=dialog.querySelector<HTMLElement>("[data-wmh-isometric-hud]");
  const minimap=dialog.querySelector<HTMLButtonElement>("[data-wmh-minimap]");
  const world=minimap?.querySelector<HTMLElement>("[data-wmh-minimap-world]");
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(!hud)return;
  // Academy is an artwork-only view, so bind its dedicated camera controls without an actor board.
  if(!board){
    renderIsometricWorldStatus(dialog);
    bindAcademyMapControls(dialog);
    return;
  }
  if(minimap&&world&&minimap.dataset.bound!=="true"){
    minimap.dataset.bound="true";
    minimap.addEventListener("click",event=>{
      if(board.classList.contains("wmh-overlay-editing"))return;
      const rect=world.getBoundingClientRect();
      const style=getComputedStyle(board);
      const boardWidth=Number.parseFloat(style.getPropertyValue("--iso-board-width"))||board.offsetWidth||1;
      const boardHeight=Number.parseFloat(style.getPropertyValue("--iso-board-height"))||board.offsetHeight||1;
      const point={
        x:Math.max(0,Math.min(1,(event.clientX-rect.left)/Math.max(1,rect.width)))*boardWidth,
        y:Math.max(0,Math.min(1,(event.clientY-rect.top)/Math.max(1,rect.height)))*boardHeight,
      };
      const data=readIsoMapData(board),cell=isoCellAtPoint(point,data.grid,true);
      if(cell&&isoGridCellExists(data,cell.x,cell.y))walkToTile(dialog,cell.x,cell.y,"earth");
    });
  }
  renderIsometricWorldStatus(dialog);
  if(world)renderIsometricMinimap(board);
}
function relocateActorsFromBlockedCells(board:HTMLElement,data:IsoMapEditorData):boolean {
  const actors=Array.from(board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]"));
  const reserved=new Set<string>();
  const placements:Array<{actor:HTMLElement;x:number;y:number}>=[];
  const cols=data.grid.cols,rows=data.grid.rows;
  const nearestSafe=(startX:number,startY:number):{x:number;y:number}|null=>{
    const candidates:Array<{x:number;y:number;distance:number}>=[];
    const available=new Set<string>();
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)available.add(x+","+y);
    data.customGridCells.forEach(key=>available.add(key));
    for(const key of available){
      const [x,y]=key.split(",").map(Number);
      if(!isoCellIsWalkable(data,x,y)||reserved.has(key))continue;
      candidates.push({x,y,distance:Math.abs(x-startX)+Math.abs(y-startY)});
    }
    candidates.sort((a,b)=>a.distance-b.distance||a.y-b.y||a.x-b.x);
    return candidates[0]?{x:candidates[0].x,y:candidates[0].y}:null;
  };
  // Player gets first claim on its safe cell; NPCs are moved afterward if needed.
  actors.sort((a,b)=>(a.hasAttribute("data-wmh-player-token")?-1:0)-(b.hasAttribute("data-wmh-player-token")?-1:0));
  for(const actor of actors){
    const x=Number(actor.dataset.x||0),y=Number(actor.dataset.y||0);
    const inside=isoGridCellExists(data,x,y);
    const key=x+","+y;
    if(inside&&isoCellIsWalkable(data,x,y)&&!reserved.has(key)){
      reserved.add(key);placements.push({actor,x,y});continue;
    }
    const safe=nearestSafe(x,y);
    if(!safe)return false;
    reserved.add(safe.x+","+safe.y);placements.push({actor,x:safe.x,y:safe.y});
  }
  for(const placement of placements){
    const {actor,x,y}=placement;
    if(Number(actor.dataset.x||0)===x&&Number(actor.dataset.y||0)===y)continue;
    actor.dataset.x=String(x);actor.dataset.y=String(y);
    actor.style.setProperty("--token-x",String(x));actor.style.setProperty("--token-y",String(y));
    actor.dataset.relocatedFromBlocked="true";
  }
  syncIsoDepthAndOcclusion(board);
  return true;
}

function bindIsoAreaEditor(dialog:HTMLElement):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const svg=board?.querySelector<SVGSVGElement>("[data-wmh-overlay-svg]");
  const toggle=dialog.querySelector<HTMLButtonElement>("[data-wmh-overlay-toggle]");
  const panel=dialog.querySelector<HTMLElement>("[data-wmh-overlay-tools]");
  if(!board||!svg||!toggle||!panel||board.dataset.overlayEditorBound==="true")return;
  board.dataset.overlayEditorBound="true";
  const key=isoOverlayKey(board);board.dataset.overlayStorageKey=key;
  let data=readIsoMapData(board),selectedTransitionId:string|null=null;
  const history:IsoMapEditorData[]=[];
  const cellGroup=svg.querySelector<SVGGElement>("[data-wmh-manual-marks]");
  let interactionGroup=svg.querySelector<SVGGElement>("[data-wmh-interaction-grid]");
  if(!interactionGroup){interactionGroup=document.createElementNS("http://www.w3.org/2000/svg","g");interactionGroup.dataset.wmhInteractionGrid="";svg.insertBefore(interactionGroup,cellGroup||svg.firstChild);}
  const transitionGroup=svg.querySelector<SVGGElement>("[data-wmh-transition-marks]");
  const cellTools=panel.querySelector<HTMLElement>("[data-wmh-cell-tools]");
  const selectionCount=panel.querySelector<HTMLElement>("[data-wmh-cell-selection-count]");
  const mergeApplyButton=panel.querySelector<HTMLButtonElement>("[data-wmh-merge-apply]");
  const mergeClearButton=panel.querySelector<HTMLButtonElement>("[data-wmh-merge-clear]");
  const selectedMergeCells=new Set<string>();
  const status=()=>panel.querySelector<HTMLElement>("[data-wmh-overlay-status]");
  const setStatus=(message:string)=>{const node=status();if(node)node.textContent=message;};
  const modeSelect=panel.querySelector<HTMLSelectElement>("[data-wmh-overlay-mode]");
  const walkableToggle=panel.querySelector<HTMLInputElement>("[data-wmh-walkable-enabled]");
  const mode=()=>modeSelect?.value||"cell-add";
  const transitionTools=panel.querySelector<HTMLElement>("[data-wmh-transition-tools]");
  const transitionField=panel.querySelector<HTMLInputElement>("[data-wmh-transition-label]");
  const exportField=panel.querySelector<HTMLTextAreaElement>("[data-wmh-overlay-export]");
  const exportWrap=panel.querySelector<HTMLElement>("[data-wmh-overlay-export-wrap]");
  const importField=panel.querySelector<HTMLTextAreaElement>("[data-wmh-overlay-import-text]");
  const workbench=panel.querySelector<HTMLElement>(".wmh-overlay-tools");
  const dock=dialog.querySelector<HTMLElement>("[data-wmh-editor-dock]");
  const uiKey="merzkava.iso-editor-ui.v1:"+encodeURIComponent(data.mapId);
  const grid:IsoMapGridConfig={...data.grid};
  const readUiPrefs=()=>{
    try{return JSON.parse(localStorage.getItem(uiKey)||"{}") as Record<string,any>;}catch{return {};}
  };
  const writeUiPrefs=(value:Record<string,any>)=>{try{localStorage.setItem(uiKey,JSON.stringify(value));}catch{}};
  const saveBubbleUi=()=>{
    if(!dock||toggle.hidden)return;
    const dockRect=dock.getBoundingClientRect(),bubbleRect=toggle.getBoundingClientRect(),value=readUiPrefs();
    value.bubble={left:Math.round(bubbleRect.left-dockRect.left),top:Math.round(bubbleRect.top-dockRect.top)};
    writeUiPrefs(value);
  };
  const savePanelUi=()=>{
    if(!panel||panel.hidden||!workbench||!dock)return;
    const dockRect=dock.getBoundingClientRect(),panelRect=workbench.getBoundingClientRect(),value=readUiPrefs();
    value.panel={left:Math.round(panelRect.left-dockRect.left),top:Math.round(panelRect.top-dockRect.top),width:Math.round(panelRect.width),height:Math.round(panelRect.height)};
    writeUiPrefs(value);
  };
  try{
    const saved=JSON.parse(localStorage.getItem(uiKey)||"null");
    if(saved?.bubble&&Number.isFinite(saved.bubble.left)&&Number.isFinite(saved.bubble.top)){
      toggle.style.left=saved.bubble.left+"px";toggle.style.top=saved.bubble.top+"px";toggle.style.right="auto";toggle.style.bottom="auto";
    }
    if(saved?.panel&&workbench&&Number.isFinite(saved.panel.left)&&Number.isFinite(saved.panel.top)){
      workbench.style.left=saved.panel.left+"px";workbench.style.top=saved.panel.top+"px";
      workbench.style.right="auto";workbench.style.bottom="auto";
      if(Number.isFinite(saved.panel.width)&&saved.panel.width>=220)workbench.style.width=saved.panel.width+"px";
      if(Number.isFinite(saved.panel.height)&&saved.panel.height>=170)workbench.style.height=saved.panel.height+"px";
    }
  }catch{}
  const remember=()=>{history.push(JSON.parse(JSON.stringify(data)) as IsoMapEditorData);if(history.length>40)history.shift();};
  const redraw=()=>{
    if(interactionGroup){
      if(board.dataset.academyArtworkBoard==="true"){
        interactionGroup.innerHTML=academyInteractionGridMarkup(grid,data);
      }else{
        const marks:string[]=[];
        for(const key of data.customGridCells){
          const [x,y]=key.split(",").map(Number),c=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
          const points=[c.x+","+(c.y-hh),(c.x+hw)+","+c.y,c.x+","+(c.y+hh),(c.x-hw)+","+c.y].join(" ");
          const selected=data.walkableCells.includes(key);
          marks.push('<polygon class="wmh-academy-hit-cell is-custom-grid-cell'+(selected?' is-walkable':'')+'" data-wmh-tile data-x="'+x+'" data-y="'+y+'" data-z="0" data-tile-id="custom-'+x+'-'+y+'" data-surface="earth" points="'+points+'" aria-label="Custom image grid cell '+x+', '+y+'"/>');
          marks.push('<path class="wmh-quadrant-divider" d="M'+c.x+' '+(c.y-hh)+' L'+c.x+' '+(c.y+hh)+' M'+(c.x-hw)+' '+c.y+' L'+(c.x+hw)+' '+c.y+'"/>');
        }
        interactionGroup.innerHTML=marks.join("");
      }
    }
    if(cellGroup){
      const marks:string[]=[];
      const add=(cells:string[],cls:string,symbol:string)=>{
        for(const key of cells){
          const [x,y]=key.split(",").map(Number),c=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
          const points=[c.x+","+(c.y-hh),(c.x+hw)+","+c.y,c.x+","+(c.y+hh),(c.x-hw)+","+c.y].join(" ");
          marks.push('<g class="wmh-cell-mark '+cls+'"><polygon points="'+points+'"/><text x="'+c.x+'" y="'+c.y+'" text-anchor="middle" dominant-baseline="central">'+symbol+'</text></g>');
        }
      };
      const addQuadrants=(cells:string[],cls:string,symbol:string)=>{
        for(const key of cells){
          const match=/^(-?[0-9]+),(-?[0-9]+):(tl|tr|bl|br)$/.exec(key);if(!match)continue;
          const x=Number(match[1]),y=Number(match[2]),q=match[3] as IsoQuadrant;
          const points=isoQuadrantTrianglePoints(x,y,q,grid);
          const vertices=points.split(" ").map(point=>point.split(",").map(Number));
          const cx=vertices.reduce((sum,p)=>sum+p[0],0)/vertices.length,cy=vertices.reduce((sum,p)=>sum+p[1],0)/vertices.length;
          marks.push('<g class="wmh-cell-mark '+cls+' is-quadrant"><polygon points="'+points+'"/><text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central">'+symbol+'</text></g>');
        }
      };
      add(data.foregroundCells,"is-foreground","○");add(data.blockedCells,"is-blocked","X");add(data.opacityCells,"is-opacity","◌");
      addQuadrants(data.foregroundQuadrants,"is-foreground","○");addQuadrants(data.blockedQuadrants,"is-blocked","X");addQuadrants(data.opacityQuadrants,"is-opacity","◌");
      data.walkableCellGroups.forEach(group=>{
        const d=isoMergedGroupBoundaryPath(group.cells,grid);
        if(d)marks.push('<path class="wmh-walkable-merged-boundary" d="'+d+'"><title>MERGED CELL · '+escapeMapEditorText(group.id)+' · '+group.cells.length+' cells</title></path>');
      });
      selectedMergeCells.forEach(key=>{
        const [x,y]=key.split(",").map(Number),c=isoCellCenter(x,y,grid),hw=grid.tileW/2,hh=grid.tileH/2;
        const points=[c.x+","+(c.y-hh),(c.x+hw)+","+c.y,c.x+","+(c.y+hh),(c.x-hw)+","+c.y].join(" ");
        marks.push('<polygon class="wmh-cell-merge-selected" points="'+points+'"/>');
      });
      cellGroup.innerHTML=marks.join("");
    }
    if(selectionCount)selectionCount.textContent=selectedMergeCells.size+" CELLS SELECTED";
    if(transitionGroup)transitionGroup.innerHTML=data.transitions.map(marker=>{
      const c=isoCellCenter(marker.x,marker.y,grid),label=escapeMapEditorText(marker.label),hw=grid.tileW/2,hh=grid.tileH/2;
      return '<g class="wmh-transition-marker '+(marker.label.trim()?"is-named":"is-unlabelled")+(selectedTransitionId===marker.id?" is-selected":"")+'" data-transition-id="'+escapeMapEditorText(marker.id)+'" transform="translate('+c.x+" "+c.y+')"><polygon class="wmh-transition-cell-highlight" points="0 '+(-hh)+' '+hw+' 0 0 '+hh+' '+(-hw)+' 0"/><circle r="11"></circle><text text-anchor="middle" dominant-baseline="central">'+(marker.label.trim()?"↗":"?")+'</text><title>'+(label||"UNLABELLED TRANSITION")+'</title></g>';
    }).join("");
    if(walkableToggle)walkableToggle.checked=data.walkableAreaEnabled;
  };
  const persist=()=>{
    data.grid={...grid};
    // Any subsequent edit invalidates the last explicit confirmation.
    data.confirmed=false;data.confirmedAt="";
    if(exportWrap)exportWrap.hidden=true;
    try{localStorage.setItem(key,JSON.stringify(data));setStatus("Draft auto-saved on this device. Confirm & Save when the image grid is final.");}
    catch{setStatus("Local storage is unavailable. Use COPY DATA FOR AI to create a portable backup.");}
    redraw();drawIsometricForeground(board,data);syncIsoDepthAndOcclusion(board);
  };
  const applyGrid=()=>{
    data.grid={...grid};
    board.dataset.cols=String(grid.cols);board.dataset.rows=String(grid.rows);
    board.dataset.tileW=String(grid.tileW);board.dataset.tileH=String(grid.tileH);
    board.dataset.offsetX=String(grid.offsetX);board.dataset.offsetY=String(grid.offsetY);
    const wanted=new Set<string>();for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++)wanted.add(isoCellKey(x,y));data.customGridCells.forEach(key=>wanted.add(key));
    board.querySelectorAll<HTMLElement>("[data-wmh-tile]").forEach(tile=>{if(!wanted.has(isoCellKey(Number(tile.dataset.x),Number(tile.dataset.y))))tile.remove();});
    const academyArtwork=board.dataset.academyArtworkBoard==="true";
    // Regenerate SVG cells from the active calibration. Academy geometry is
    // strictly an image overlay; it must never resize the map surface/canvas.
    if(!academyArtwork&&!board.querySelector("[data-wmh-scene-svg]")){
      const present=new Set(Array.from(board.querySelectorAll<HTMLElement>("[data-wmh-tile]")).map(t=>isoCellKey(Number(t.dataset.x),Number(t.dataset.y))));
      for(let y=0;y<grid.rows;y++)for(let x=0;x<grid.cols;x++){
        const id=isoCellKey(x,y);if(present.has(id))continue;
        const tile=document.createElement("button");tile.type="button";tile.className="wmh-tile wmh-tile-earth";
        tile.dataset.wmhTile="";tile.dataset.x=String(x);tile.dataset.y=String(y);tile.dataset.z="0";tile.dataset.tileId="tile-"+id;tile.dataset.surface="earth";
        tile.style.setProperty("--tile-x",String(x));tile.style.setProperty("--tile-y",String(y));tile.setAttribute("aria-label","Tile X "+x+", Y "+y);
        const coord=document.createElement("span");coord.className="wmh-tile-coord";coord.textContent="("+x+","+y+")";tile.append(coord);board.append(tile);
      }
    }
    board.style.setProperty("--tile-w",grid.tileW+"px");board.style.setProperty("--tile-h",grid.tileH+"px");
    board.style.setProperty("--iso-half-w",grid.tileW/2+"px");board.style.setProperty("--iso-half-h",grid.tileH/2+"px");
    board.style.setProperty("--iso-center-x",(grid.rows*grid.tileW/2+grid.offsetX)+"px");board.style.setProperty("--iso-offset-y",grid.offsetY+"px");
    board.style.setProperty("--player-scale",String(grid.playerScale));board.style.setProperty("--npc-scale",String(grid.npcScale));
    const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
    const projectedWidth=(grid.cols+grid.rows-2)*grid.tileW/2+grid.tileW;
    const projectedHeight=(grid.cols+grid.rows-2)*grid.tileH/2+grid.tileH+7;
    const width=academyArtwork?(image?.naturalWidth||2816):Math.max(projectedWidth,image?.naturalWidth||0);
    const height=academyArtwork?(image?.naturalHeight||1536):Math.max(projectedHeight,image?.naturalHeight||0);
    if(academyArtwork){
      svg.setAttribute("viewBox","0 0 "+width+" "+height);
      const interaction=svg.querySelector<SVGGElement>("[data-wmh-interaction-grid]");
      if(interaction)interaction.innerHTML=academyInteractionGridMarkup(grid,data);
    }else{
      board.style.setProperty("--iso-board-width",width+"px");board.style.setProperty("--iso-board-height",height+"px");
      board.style.width=width+"px";board.style.height=height+"px";svg.setAttribute("viewBox","0 0 "+width+" "+height);
      if(board.querySelector("[data-wmh-scene-svg]"))refreshIsometricSvgScene(board,grid);
    }
    panel.querySelectorAll<HTMLInputElement>("[data-wmh-grid-control]").forEach(input=>{
      const property=input.dataset.wmhGridControl as keyof IsoMapGridConfig;input.value=String(grid[property]);
      const output=panel.querySelector<HTMLElement>('[data-wmh-grid-value="'+property+'"]');if(output)output.textContent=String(grid[property]);
    });
    redraw();drawIsometricForeground(board,data);syncIsoDepthAndOcclusion(board);
  };
  const setActive=(active:boolean)=>{
    if(active){
      stopNpcWander(dialog);
      const chat=dialog.querySelector<HTMLElement>("[data-wmh-chat]");
      board.dataset.editorChatWasVisible=String(!!chat&&!chat.hidden);
      if(chat)chat.hidden=true;
      const player=board.querySelector<HTMLElement>("[data-wmh-player-token]");
      const movementTimer=Number(player?.dataset.moveTimer||0);
      if(movementTimer){
        window.clearTimeout(movementTimer);delete player!.dataset.moveTimer;
        if((board as HTMLElement & {__wmhPendingPlayerDestination?:{x:number;y:number;surface:string}}).__wmhPendingPlayerDestination)
          board.dataset.editorResumePlayerAfterEdit="true";
      }
      board.dataset.editorPaused="true";
      board.classList.add("wmh-overlay-editing","wmh-editor-paused");
      board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]").forEach(token=>token.getAnimations().forEach(animation=>animation.pause()));
      if(!relocateActorsFromBlockedCells(board,data))setStatus("Warning: this map has no free cell for one or more characters. Clear some X cells before resuming play.");
    }else{
      board.dataset.editorPaused="false";
      board.classList.remove("wmh-overlay-editing","wmh-editor-paused");
      board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]").forEach(token=>token.getAnimations().forEach(animation=>animation.play()));
      const chat=dialog.querySelector<HTMLElement>("[data-wmh-chat]");
      const chatWasVisible=board.dataset.editorChatWasVisible==="true";
      if(chat)chat.hidden=!chatWasVisible;
      delete board.dataset.editorChatWasVisible;
      if(!chatWasVisible&&dialog.closest<HTMLElement>("[data-world-map-hierarchy]")?.dataset.level==="local")startNpcWander(dialog);
      if(board.dataset.editorResumePlayerAfterEdit==="true"&&!chatWasVisible){
        const runtime=board as HTMLElement & {__wmhPendingPlayerDestination?:{x:number;y:number;surface:string}};
        const pending=runtime.__wmhPendingPlayerDestination;
        delete board.dataset.editorResumePlayerAfterEdit;
        if(pending)walkToTile(dialog,pending.x,pending.y,pending.surface);
      }
      renderIsometricMinimap(board);
      renderIsometricWorldStatus(dialog);
      selectedTransitionId=null;
    }
    panel.hidden=!active;
    toggle.hidden=active;
    toggle.setAttribute("aria-pressed",String(active));
    toggle.setAttribute("aria-expanded",String(active));
  };
  let suppressToggleClick=false;
  toggle.addEventListener("click",()=>{if(suppressToggleClick){suppressToggleClick=false;return;}setActive(panel.hidden);});
  dialog.querySelector<HTMLElement>("[data-wmh-overlay-close]")?.addEventListener("click",()=>setActive(false));

  // The bubble can be dragged anywhere inside the isometric play area.
  toggle.addEventListener("pointerdown",event=>{
    if(!panel.hidden)return;
    const startX=event.clientX,startY=event.clientY;
    const startLeft=toggle.offsetLeft,startTop=toggle.offsetTop;
    let moved=false;
    const move=(next:PointerEvent)=>{
      const dx=next.clientX-startX,dy=next.clientY-startY;
      if(!moved&&Math.hypot(dx,dy)<5)return;
      moved=true;next.preventDefault();
      const maxX=Math.max(0,(dock?.clientWidth||window.innerWidth)-toggle.offsetWidth);
      const maxY=Math.max(0,(dock?.clientHeight||window.innerHeight)-toggle.offsetHeight);
      toggle.style.left=Math.max(0,Math.min(maxX,startLeft+dx))+"px";
      toggle.style.top=Math.max(0,Math.min(maxY,startTop+dy))+"px";
      toggle.style.right="auto";toggle.style.bottom="auto";
    };
    const end=(_next:PointerEvent)=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",end);window.removeEventListener("pointercancel",end);
      if(moved){suppressToggleClick=true;saveBubbleUi();window.setTimeout(()=>{suppressToggleClick=false;},450);}
    };
    window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",end);window.addEventListener("pointercancel",end);
  });

  // Drag the workbench by its top header; controls and the close button remain clickable.
  const dragHandle=workbench?.querySelector<HTMLElement>("[data-wmh-overlay-drag-handle]");
  dragHandle?.addEventListener("pointerdown",event=>{
    if((event.target as Element).closest("[data-wmh-overlay-close],[data-wmh-panel-resize-handle]"))return;
    event.preventDefault();
    const container=panel.getBoundingClientRect(),rect=workbench!.getBoundingClientRect();
    const startX=event.clientX,startY=event.clientY,left=rect.left-container.left,top=rect.top-container.top;
    const move=(next:PointerEvent)=>{
      if(next.buttons===0)return;
      next.preventDefault();
      workbench!.style.left=Math.max(0,Math.min(container.width-workbench!.offsetWidth,left+next.clientX-startX))+"px";
      workbench!.style.top=Math.max(0,Math.min(container.height-workbench!.offsetHeight,top+next.clientY-startY))+"px";
      workbench!.style.right="auto";workbench!.style.bottom="auto";
    };
    const end=()=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",end);window.removeEventListener("pointercancel",end);savePanelUi();
    };
    window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",end);window.addEventListener("pointercancel",end);
  });

  // The small upper-left grip resizes from that corner while the opposite corner stays fixed.
  const grip=workbench?.querySelector<HTMLElement>("[data-wmh-panel-resize-handle]");
  grip?.addEventListener("pointerdown",event=>{
    event.preventDefault();event.stopPropagation();
    const container=panel.getBoundingClientRect(),rect=workbench!.getBoundingClientRect();
    const startX=event.clientX,startY=event.clientY;
    const right=rect.right-container.left,bottom=rect.bottom-container.top;
    const move=(next:PointerEvent)=>{
      next.preventDefault();
      const left=Math.max(0,Math.min(right-220,rect.left-container.left+next.clientX-startX));
      const top=Math.max(0,Math.min(bottom-170,rect.top-container.top+next.clientY-startY));
      workbench!.style.left=left+"px";workbench!.style.top=top+"px";
      workbench!.style.right="auto";workbench!.style.bottom="auto";
      workbench!.style.width=Math.max(220,right-left)+"px";
      workbench!.style.height=Math.max(170,bottom-top)+"px";
    };
    const end=()=>{
      window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",end);window.removeEventListener("pointercancel",end);savePanelUi();
    };
    window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",end);window.addEventListener("pointercancel",end);
  });
  const updateModeHelp=()=>{
    if(transitionTools)transitionTools.hidden=mode()!=="transition";
    if(cellTools)cellTools.hidden=!["cell-add","cell-delete","cell-merge","cell-unmerge"].includes(mode());
    if(mergeApplyButton)mergeApplyButton.hidden=mode()!=="cell-merge";
    if(mergeClearButton)mergeClearButton.hidden=mode()!=="cell-merge";
    if(mode()!=="cell-merge")selectedMergeCells.clear();
    redraw();
    setStatus(mode()==="cell-add"?"ADD CELL: tap an existing diamond to select it as walkable, or tap an ungridded part of the Map Base image to create one new diamond there. New cells must fit fully inside the image; canvas margins are excluded. Drag only pans."
      :mode()==="cell-delete"?"DELETE CELL: tap a blue cell to remove it from the walkable area. Extra image cells are removed entirely; original base-grid diamonds remain visible."
      :mode()==="cell-merge"?"SELECT & MERGE: tap two or more adjacent blue cells, including bends, then press MERGE SELECTED CELLS to make one flexible logical area."
      :mode()==="cell-unmerge"?"UNMERGE: tap any cell inside a merged region to split that group back into its individual cells."
      :mode()==="foreground"?"Tap one of the 4 small sectors: ○ redraws that part of the same Map Base above characters."
      :mode()==="blocked"?"Tap one of the 4 small sectors: X blocks movement across that sector's edge."
      :mode()==="opacity"?"Tap one of the 4 small sectors: ◌ makes characters translucent in that image area."
      :"Tap a cell to add/select a transition. Red is unnamed; blue is named.");
  };
  modeSelect?.addEventListener("change",updateModeHelp);
  updateModeHelp();
  if(walkableToggle)walkableToggle.checked=data.walkableAreaEnabled;
  walkableToggle?.addEventListener("change",()=>{
    if(walkableToggle.checked&&!data.walkableCells.length){walkableToggle.checked=false;setStatus("Paint the walkable area first, then turn this limit on.");return;}
    remember();data.walkableAreaEnabled=walkableToggle.checked;
    if(data.walkableAreaEnabled&&!relocateActorsFromBlockedCells(board,data)){
      data.walkableAreaEnabled=false;walkableToggle.checked=false;history.pop();setStatus("The selected area needs at least one free cell per character. Paint a larger area before enabling the limit.");return;
    }
    persist();
    setStatus(data.walkableAreaEnabled?"Movement is limited to blue walkable cells. Characters outside the area were placed on their nearest selected cells.":"Movement limit disabled; all non-X cells may be used.");
  });
  const point=(e:PointerEvent)=>{const r=svg.getBoundingClientRect(),box=svg.viewBox.baseVal;return{x:(e.clientX-r.left)*box.width/Math.max(1,r.width),y:(e.clientY-r.top)*box.height/Math.max(1,r.height)};};
  const isCellInsideMapArtwork=(x:number,y:number):boolean=>{
    const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
    const svgRect=svg.getBoundingClientRect(),view=svg.viewBox.baseVal;
    const imageRect=image?.getBoundingClientRect();
    const scaleX=view.width/Math.max(1,svgRect.width),scaleY=view.height/Math.max(1,svgRect.height);
    const left=imageRect?(imageRect.left-svgRect.left)*scaleX:0;
    const top=imageRect?(imageRect.top-svgRect.top)*scaleY:0;
    const right=imageRect?left+imageRect.width*scaleX:view.width;
    const bottom=imageRect?top+imageRect.height*scaleY:view.height;
    const center=isoCellCenter(x,y,grid),halfW=grid.tileW/2,halfH=grid.tileH/2;
    // New cells must fit entirely inside the Map Base artwork bounds. Canvas
    // expansion margins and the surrounding scroll surface are never eligible.
    return center.x-halfW>=left-0.5&&center.y-halfH>=top-0.5&&center.x+halfW<=right+0.5&&center.y+halfH<=bottom+0.5;
  };
  if(board.dataset.academyArtworkBoard==="true"&&board.dataset.imageTapBound!=="true"){
    board.dataset.imageTapBound="true";
    board.addEventListener("click",event=>{
      if(board.classList.contains("wmh-overlay-editing"))return;
      const target=event.target as Element;
      if(target.closest("[data-wmh-player-token],[data-wmh-npc],[data-wmh-action]"))return;
      const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");if(!image)return;
      const rect=image.getBoundingClientRect();
      const mapPoint={x:(event.clientX-rect.left)*image.naturalWidth/Math.max(1,rect.width),y:(event.clientY-rect.top)*image.naturalHeight/Math.max(1,rect.height)};
      const data=readIsoMapData(board),cell=isoCellAtPoint(mapPoint,grid,true);if(cell&&isoGridCellExists(data,cell.x,cell.y))walkToTile(dialog,cell.x,cell.y,"earth");
    });
  }
  const viewport=board.closest<HTMLElement>("[data-wmh-map-viewport],[data-wmh-iso-viewport]");
  const academyArtwork=board.dataset.academyArtworkBoard==="true";
  let activePointers=new Set<number>();
  let pendingTap:{pointerId:number;startX:number;startY:number;scrollLeft:number;scrollTop:number;dragged:boolean;cancelled:boolean;transitionId:string|null}|null=null;
  const pointerMove=(event:PointerEvent)=>{
    if(!pendingTap||pendingTap.pointerId!==event.pointerId)return;
    if(isoPointerGesture({x:pendingTap.startX,y:pendingTap.startY},{x:event.clientX,y:event.clientY})==="drag"){
      pendingTap.dragged=true;
      // Academy's camera already pans through bindWorldMapZoom. Other map
      // viewports need this one-finger pan while the editor overlay is active.
      if(!academyArtwork&&activePointers.size===1&&viewport){
        viewport.scrollLeft=pendingTap.scrollLeft-(event.clientX-pendingTap.startX);
        viewport.scrollTop=pendingTap.scrollTop-(event.clientY-pendingTap.startY);
      }
    }
  };
  const applyCellTap=(event:PointerEvent,transitionId:string|null)=>{
    const mapPoint=point(event),cell=isoCellAtPoint(mapPoint,grid,true);if(!cell)return;
    if(mode()!=="cell-add"&&!isoGridCellExists(data,cell.x,cell.y)){setStatus("No grid cell exists here yet. Switch to ADD CELL and tap this Map Base area first.");return;}
    if(mode()==="cell-add"){
      const key=isoCellKey(cell.x,cell.y),isBase=cell.x>=0&&cell.y>=0&&cell.x<grid.cols&&cell.y<grid.rows;
      if(isBase){
        if(data.walkableCells.includes(key)){setStatus("This base grid cell is already selected as walkable.");return;}
        remember();data.walkableCells=[...data.walkableCells,key];persist();
        setStatus("Selected existing base grid cell ("+cell.x+","+cell.y+"). It is now blue and can be included in a movement area or merged with adjacent cells.");
        return;
      }
      if(data.customGridCells.includes(key)){
        if(data.walkableCells.includes(key)){setStatus("This extra image cell already exists and is selected.");return;}
        remember();data.walkableCells=[...data.walkableCells,key];persist();
        setStatus("Selected existing extra image cell ("+cell.x+","+cell.y+").");return;
      }
      if(!isCellInsideMapArtwork(cell.x,cell.y)){
        setStatus("Cell not added: the full diamond must fit inside the Map Base image. Canvas expansion margins and blank canvas are excluded.");return;
      }
      remember();
      data.customGridCells=[...data.customGridCells,key];
      data.walkableCells=[...new Set([...data.walkableCells,key])];
      persist();
      setStatus("Added a new image grid cell at ("+cell.x+","+cell.y+"). It is stored as a custom Map Base cell; canvas size and margins were not changed.");
      return;
    }
    if(mode()==="transition"){
      const existing=transitionId?data.transitions.find(marker=>marker.id===transitionId):data.transitions.find(marker=>marker.x===cell.x&&marker.y===cell.y);
      if(existing){
        selectedTransitionId=existing.id;if(transitionField)transitionField.value=existing.label;
        redraw();setStatus(existing.label?"Selected named transition: "+existing.label:"Selected unnamed transition. Enter a destination label.");return;
      }
      remember();
      const marker={id:"transition-"+Date.now()+"-"+data.transitions.length,x:cell.x,y:cell.y,label:""};
      data.transitions.push(marker);selectedTransitionId=marker.id;
      if(transitionField)transitionField.value="";
      persist();setStatus("Transition cell selected. Enter its destination label; it stays red until named.");return;
    }
    const key=isoCellKey(cell.x,cell.y),isWalkable=data.walkableCells.includes(key);
    if(mode()==="cell-delete"){
      if(!isWalkable){setStatus("There is no added cell at ("+cell.x+","+cell.y+").");return;}
      if(data.walkableAreaEnabled&&data.walkableCells.length===1){setStatus("Disable AREA LIMIT before deleting the final walkable cell.");return;}
      const previousCells=[...data.walkableCells],previousCustom=[...data.customGridCells],previousGroups=JSON.parse(JSON.stringify(data.walkableCellGroups)) as IsoMapEditorData["walkableCellGroups"];
      const wasCustom=data.customGridCells.includes(key);
      remember();removeIsoWalkableCell(data,cell.x,cell.y);
      if(wasCustom)data.customGridCells=data.customGridCells.filter(item=>item!==key);
      if(data.walkableAreaEnabled&&!relocateActorsFromBlockedCells(board,data)){
        data.walkableCells=previousCells;data.customGridCells=previousCustom;data.walkableCellGroups=previousGroups;history.pop();redraw();setStatus("Cell deletion cancelled because it would leave a character without a valid destination.");return;
      }
      persist();setStatus(wasCustom?"Deleted extra image cell ("+cell.x+","+cell.y+"). Its merged group was updated automatically.":"Removed base cell ("+cell.x+","+cell.y+") from the selected walkable area; the original base grid remains visible.");return;
    }
    if(mode()==="cell-merge"){
      if(!isWalkable){setStatus("Only added blue cells can be merged. Use ADD CELL first.");return;}
      if(selectedMergeCells.has(key))selectedMergeCells.delete(key);else selectedMergeCells.add(key);
      redraw();setStatus(selectedMergeCells.size+" cells selected. Existing merged groups are absorbed automatically when you merge again. The final selection must connect edge-to-edge.");return;
    }
    if(mode()==="cell-unmerge"){
      const existingGroup=data.walkableCellGroups.find(item=>item.cells.includes(key));
      if(!existingGroup){setStatus("This cell is not part of a merged group.");return;}
      remember();const group=unmergeIsoWalkableCell(data,cell.x,cell.y);
      if(group)persist();
      setStatus("Unmerged "+existingGroup.id+". Its "+existingGroup.cells.length+" component cells can now be edited or merged again.");return;
    }
    const quadrant=isoQuadrantAtPoint(mapPoint,cell.x,cell.y,grid);
    const layer:IsoQuadrantLayer=mode()==="blocked"?"blockedQuadrants":mode()==="opacity"?"opacityQuadrants":"foregroundQuadrants";
    remember();const enabled=toggleIsoQuadrantLayer(data,layer,cell.x,cell.y,quadrant);
    persist();
    setStatus((layer==="foregroundQuadrants"?"○ Foreground":layer==="blockedQuadrants"?"X Blocked":"◌ Opacity")+(enabled?" enabled":" cleared")+" in "+quadrant.toUpperCase()+" sector of ("+cell.x+","+cell.y+"). Tap edits one sector; drag only pans.");
  };
  // Capture movement at the dialog boundary so a finger may leave the grid
  // during a drag. The camera handles Academy pan/pinch; other isometric maps
  // receive the same one-finger scroll behavior here.
  dialog.addEventListener("pointermove",pointerMove,true);
  dialog.addEventListener("pointerup",event=>{
    const pointerEvent=event as PointerEvent;
    activePointers.delete(pointerEvent.pointerId);
    if(!pendingTap||pendingTap.pointerId!==pointerEvent.pointerId)return;
    const completed=pendingTap;pendingTap=null;
    if(!completed.cancelled&&!completed.dragged&&isoPointerGesture(
      {x:completed.startX,y:completed.startY},{x:pointerEvent.clientX,y:pointerEvent.clientY}
    )==="tap")applyCellTap(pointerEvent,completed.transitionId);
  },true);
  dialog.addEventListener("pointercancel",event=>{
    const pointerId=(event as PointerEvent).pointerId;activePointers.delete(pointerId);
    if(pendingTap?.pointerId===pointerId)pendingTap=null;
  },true);
  svg.addEventListener("pointerdown",event=>{
    if(!board.classList.contains("wmh-overlay-editing"))return;
    const target=event.target as Element;
    activePointers.add(event.pointerId);
    if(activePointers.size>1){
      if(pendingTap)pendingTap.cancelled=true;
      return; // two fingers are reserved for the existing pinch-zoom camera
    }
    pendingTap={
      pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,
      scrollLeft:viewport?.scrollLeft||0,scrollTop:viewport?.scrollTop||0,
      dragged:false,cancelled:false,
      transitionId:target.closest<SVGGElement>("[data-transition-id]")?.dataset.transitionId||null
    };
    event.preventDefault();
    try{svg.setPointerCapture(event.pointerId);}catch{/* dialog-level pointer listeners remain the fallback */}
  });
  panel.querySelector<HTMLElement>("[data-wmh-merge-apply]")?.addEventListener("click",()=>{
    if(selectedMergeCells.size<2){setStatus("Select at least two adjacent blue cells first.");return;}
    const cells=[...selectedMergeCells];
    remember();
    const group=mergeIsoWalkableCells(data,cells,"merged-"+Date.now());
    if(!group){history.pop();setStatus("Merge not created. Cells must touch edge-to-edge and cannot already belong to another merged group.");return;}
    selectedMergeCells.clear();persist();setStatus("Merged "+group.cells.length+" cells into "+group.id+". The group shape follows the selected cells, including turns and uneven edges.");
  });
  panel.querySelector<HTMLElement>("[data-wmh-merge-clear]")?.addEventListener("click",()=>{
    selectedMergeCells.clear();redraw();setStatus("Cell merge selection cleared. No map data was changed.");
  });
  panel.querySelector<HTMLElement>("[data-wmh-transition-apply]")?.addEventListener("click",()=>{
    const marker=data.transitions.find(m=>m.id===selectedTransitionId);if(!marker){setStatus("Select a transition marker first.");return;}
    remember();marker.label=(transitionField?.value||"").trim().slice(0,80);persist();setStatus(marker.label?"Destination named. Marker is now blue.":"Destination name cleared. Marker is red.");
  });
  panel.querySelector<HTMLElement>("[data-wmh-transition-delete]")?.addEventListener("click",()=>{
    if(!selectedTransitionId){setStatus("Select a transition marker first.");return;}
    remember();data.transitions=data.transitions.filter(m=>m.id!==selectedTransitionId);selectedTransitionId=null;
    if(transitionField)transitionField.value="";persist();setStatus("Transition marker removed.");
  });
  panel.querySelectorAll<HTMLInputElement>("[data-wmh-grid-control]").forEach(input=>{
    const update=()=>{
      const previous=JSON.parse(JSON.stringify(data)) as IsoMapEditorData;
      const previousGrid={...grid};
      remember();const property=input.dataset.wmhGridControl as keyof IsoMapGridConfig;grid[property]=Number(input.value);
      const previousContains=(x:number,y:number)=>x>=0&&y>=0&&x<previousGrid.cols&&y<previousGrid.rows;
      const nextContains=(x:number,y:number)=>x>=0&&y>=0&&x<grid.cols&&y<grid.rows;
      const promoted=new Set(data.customGridCells);
      const promoteKey=(key:string)=>{
        const match=/^(-?[0-9]+),(-?[0-9]+)(?::(?:tl|tr|bl|br))?$/.exec(key);if(!match)return;
        const x=Number(match[1]),y=Number(match[2]);
        if(previousContains(x,y)&&!nextContains(x,y))promoted.add(x+","+y);
      };
      [...data.walkableCells,...data.foregroundCells,...data.blockedCells,...data.opacityCells,
        ...data.foregroundQuadrants,...data.blockedQuadrants,...data.opacityQuadrants,
        ...data.transitions.map(marker=>marker.x+","+marker.y),
        ...data.walkableCellGroups.flatMap(group=>group.cells)].forEach(promoteKey);
      data.customGridCells=[...promoted];
      data.grid={...grid};
      data=normalizeIsoMapEditorData(data,data.mapId,grid);
      selectedMergeCells.forEach(key=>{if(!data.walkableCells.includes(key))selectedMergeCells.delete(key);});
      applyGrid();
      if(!relocateActorsFromBlockedCells(board,data)){
        data=previous;Object.assign(grid,previousGrid);history.pop();input.value=String(grid[property]);applyGrid();
        setStatus("Grid change cancelled: there is no safe destination for every character.");return;
      }
      persist();
    };
    input.addEventListener("change",update);
    input.closest<HTMLElement>("[data-wmh-grid-row]")?.querySelectorAll<HTMLButtonElement>("[data-wmh-grid-step]").forEach(button=>button.addEventListener("click",()=>{
      input.value=String(Math.max(Number(input.min),Math.min(Number(input.max),Number(input.value)+Number(button.dataset.wmhGridStep||1)*(button.dataset.wmhGridDir==="minus"?-1:1))));update();
    }));
  });
  panel.querySelector<HTMLElement>("[data-wmh-overlay-undo]")?.addEventListener("click",()=>{
    const previous=history.pop();if(!previous){setStatus("There is no editor action to undo.");return;}
    data=normalizeIsoMapEditorData(previous,data.mapId,grid);Object.assign(grid,data.grid);applyGrid();persist();setStatus("Last editor action undone.");
  });
  panel.querySelector<HTMLElement>("[data-wmh-overlay-clear]")?.addEventListener("click",()=>{
    if(!window.confirm("Clear foreground, blocked, opacity, and transition settings for this map?"))return;
    remember();data.foregroundCells=[];data.blockedCells=[];data.opacityCells=[];data.walkableCells=[];data.walkableCellGroups=[];data.walkableAreaEnabled=false;data.foregroundQuadrants=[];data.blockedQuadrants=[];data.opacityQuadrants=[];data.transitions=[];selectedTransitionId=null;selectedMergeCells.clear();if(walkableToggle)walkableToggle.checked=false;
    if(transitionField)transitionField.value="";persist();setStatus("All map cell layers and transitions cleared.");
  });
  const exportPackage=()=>{
    const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]");
    const artworkSrc=image?.getAttribute("src")||null;
    return {
      format:"merzkava-isometric-map-editor",
      version:1,
      purpose:"AI_UPDATE_REFERENCE",
      mapId:data.mapId,
      mapTitle:board.dataset.mapTitle||board.dataset.mapId||data.mapId,
      mapBase:artworkSrc?{src:artworkSrc,width:image?.naturalWidth||null,height:image?.naturalHeight||null}:null,
      confirmed:data.confirmed===true,
      confirmedAt:data.confirmedAt||"",
      grid:{...grid},
      walkableAreaEnabled:data.walkableAreaEnabled,
      walkableCells:[...data.walkableCells],
      customGridCells:[...data.customGridCells],
      walkableCellGroups:data.walkableCellGroups.map(group=>({id:group.id,cells:[...group.cells]})),
      foregroundCells:[...data.foregroundCells],
      blockedCells:[...data.blockedCells],
      opacityCells:[...data.opacityCells],
      foregroundQuadrants:[...data.foregroundQuadrants],
      blockedQuadrants:[...data.blockedQuadrants],
      opacityQuadrants:[...data.opacityQuadrants],
      transitions:data.transitions.map(marker=>({...marker})),
      notes:{
        cellSectorOrder:["top-left","top-right","bottom-left","bottom-right"],
        quadrantKeys:"x,y:tl|tr|bl|br",
        transitionColors:"red=unnamed, blue=named",
        walkableCellGroups:"Connected base cells may be merged into flexible logical cells; every group has an ID and retains its underlying grid coordinates.",
        customGridCells:"Extra isometric diamonds added on Map Base image areas outside the base cols×rows grid. Each coordinate is an individually placed cell; do not fill intervening image or canvas space automatically.",
        cellPlacement:"Tap in an ungridded image area to add one diamond. Drag pans only. Each custom cell is valid only inside the Map Base image bounds.",
        canvasExpansion:"Not included or changed by this grid editor."
      }
    };
  };
  panel.querySelector<HTMLElement>("[data-wmh-overlay-save]")?.addEventListener("click",()=>{
    try{
      data.grid={...grid};data.confirmed=false;data.confirmedAt="";
      localStorage.setItem(key,JSON.stringify(data));
      setStatus("Draft saved on this device. Review the overlay, then use CONFIRM & SAVE.");
    }catch{setStatus("Save failed. Use COPY DATA FOR AI to create a portable backup.");}
  });
  panel.querySelector<HTMLElement>("[data-wmh-overlay-confirm]")?.addEventListener("click",()=>{
    data.grid={...grid};
    const summary=data.mapId+"\n"+grid.cols+" columns × "+grid.rows+" rows"+
      "\nWalkable cells: "+data.walkableCells.length+
      "\nBlocked sectors: "+data.blockedQuadrants.length+
      "\nForeground sectors: "+data.foregroundQuadrants.length+
      "\nOpacity sectors: "+data.opacityQuadrants.length+
      "\nTransitions: "+data.transitions.length+
      "\nConfirm this exact grid configuration and save it on this device?";
    if(!window.confirm(summary)){setStatus("Confirmation cancelled. Your draft remains available.");return;}
    try{
      data.confirmed=true;data.confirmedAt=new Date().toISOString();
      localStorage.setItem(key,JSON.stringify(data));
      if(exportField){if(exportWrap)exportWrap.hidden=false;exportField.value=JSON.stringify(exportPackage(),null,2);}
      setStatus("✓ Configuration confirmed and saved for "+data.mapId+". Use COPY DATA FOR AI to send this exact version.");
    }catch{data.confirmed=false;data.confirmedAt="";setStatus("Confirmation could not be saved. Use COPY DATA FOR AI as a backup.");}
  });
  panel.querySelector<HTMLElement>("[data-wmh-overlay-copy]")?.addEventListener("click",async()=>{
    const json=JSON.stringify(exportPackage(),null,2);
    if(exportField){if(exportWrap)exportWrap.hidden=false;exportField.value=json;}
    try{await navigator.clipboard.writeText(json);setStatus("AI reference copied for "+data.mapId+". Paste this JSON into your next update request.");}
    catch{if(exportField){if(exportWrap)exportWrap.hidden=false;exportField.focus();exportField.select();}setStatus("Clipboard is unavailable. The complete AI reference JSON is shown below; select and copy it.");}
  });
  panel.querySelector<HTMLElement>("[data-wmh-overlay-import]")?.addEventListener("click",()=>{
    const previous=JSON.parse(JSON.stringify(data)) as IsoMapEditorData;
    const previousGrid={...grid};
    try{
      const imported=normalizeIsoMapEditorData(JSON.parse(importField?.value||""),data.mapId,grid);
      remember();data=imported;Object.assign(grid,data.grid);applyGrid();
      if(!relocateActorsFromBlockedCells(board,data)){
        data=previous;Object.assign(grid,previousGrid);history.pop();applyGrid();
        setStatus("Import rejected: the new X cells leave no safe destination for every character.");return;
      }
      persist();if(exportWrap)exportWrap.hidden=true;setStatus("Map data imported for "+data.mapId+". Characters inside X cells were moved to safe cells.");
    }catch{data=previous;Object.assign(grid,previousGrid);setStatus("Import failed. Paste a valid isometric-map JSON backup.");}
  });
  applyGrid();
  if(!relocateActorsFromBlockedCells(board,data))setStatus("Warning: some characters could not be relocated. Clear blocked cells to restore safe movement.");
  redraw();drawIsometricForeground(board,data);syncIsoDepthAndOcclusion(board);
}

function bindIsometricCamera(dialog:HTMLElement):void {
  // Academy artwork uses the same cover-fit, drag and pinch camera as World Map.
  if(dialog.querySelector<HTMLElement>(".wmh-academy-map-viewport[data-wmh-map-viewport]")){
    bindWorldMapZoom(dialog);
    return;
  }
  const viewport=dialog.querySelector<HTMLElement>("[data-wmh-iso-viewport]");
  const camera=dialog.querySelector<HTMLElement>("[data-wmh-iso-camera]");
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(!viewport||!camera||!board||viewport.dataset.cameraBound==="true")return;
  viewport.dataset.cameraBound="true";
  syncIsoDepthAndOcclusion(board);
  let zoom=1,baseW=0,baseH=0,initialFitApplied=false;
  const padX=()=>Math.max(1,viewport.clientWidth)*4;
  const padY=()=>Math.max(1,viewport.clientHeight)*4;
  const measure=()=>{
    const style=getComputedStyle(board);
    // The level may be bound while its parent is hidden; fall back to this
    // map's own calibrated grid instead of assuming Academy dimensions.
    const cols=Number(board.dataset.cols)||12,rows=Number(board.dataset.rows)||10;
    const tileW=Number.parseFloat(style.getPropertyValue("--tile-w"))||64;
    const tileH=Number.parseFloat(style.getPropertyValue("--tile-h"))||32;
    baseW=board.offsetWidth||Number.parseFloat(style.width)||(cols+rows-2)*tileW/2+tileW;
    baseH=board.offsetHeight||Number.parseFloat(style.height)||(cols+rows-2)*tileH/2+tileH+7;
    if(!initialFitApplied){
      const isTianhaiAcademy=board.dataset.mapId==="golden-dragon-empire:tianhai-academy:exterior";
      const fitWidth=(viewport.clientWidth-24)/Math.max(1,baseW);
      const fitHeight=(viewport.clientHeight-190)/Math.max(1,baseH);
      const cover=Math.max(viewport.clientWidth/Math.max(1,baseW),viewport.clientHeight/Math.max(1,baseH));
      zoom=isTianhaiAcademy?Math.max(.08,Math.min(2.4,cover)):Math.max(.08,Math.min(1,fitWidth,fitHeight));
      initialFitApplied=true;
    }
    const px=padX(),py=padY();
    camera.style.position="relative";camera.style.display="block";
    camera.style.width=(baseW*zoom+px*2)+"px";
    camera.style.height=(baseH*zoom+py*2)+"px";
    board.style.setProperty("--wmh-camera-pad-x",px+"px");
    board.style.setProperty("--wmh-camera-pad-y",py+"px");
    board.style.setProperty("--wmh-camera-zoom",String(zoom));
    board.style.setProperty("--wmh-camera-inverse-zoom",String(1/zoom));
    const scaleLabel=dialog.querySelector<HTMLElement>("[data-wmh-iso-level]");
    if(scaleLabel)scaleLabel.textContent=Math.round(zoom*100)+"%";
  };
  const centerMap=()=>{
    if(!baseW||!baseH)measure();
    viewport.scrollLeft=padX()+baseW*zoom/2-viewport.clientWidth/2;
    viewport.scrollTop=padY()+baseH*zoom/2-viewport.clientHeight/2;
  };
  const apply=(next:number,focusX?:number,focusY?:number)=>{
    if(!baseW||!baseH)measure();
    const old=zoom;zoom=Math.max(.08,Math.min(2.4,next));
    const rect=viewport.getBoundingClientRect(),px=padX(),py=padY();
    const fx=focusX==null?viewport.clientWidth/2:focusX-rect.left;
    const fy=focusY==null?viewport.clientHeight/2:focusY-rect.top;
    const ax=viewport.scrollLeft+fx-px,ay=viewport.scrollTop+fy-py;
    camera.style.width=(baseW*zoom+px*2)+"px";
    camera.style.height=(baseH*zoom+py*2)+"px";
    board.style.setProperty("--wmh-camera-pad-x",px+"px");
    board.style.setProperty("--wmh-camera-pad-y",py+"px");
    board.style.setProperty("--wmh-camera-zoom",String(zoom));
    board.style.setProperty("--wmh-camera-inverse-zoom",String(1/zoom));
    viewport.scrollLeft=px+ax*zoom/old-fx;
    viewport.scrollTop=py+ay*zoom/old-fy;
    const label=dialog.querySelector<HTMLElement>("[data-wmh-iso-level]");
    if(label)label.textContent=Math.round(zoom*100)+"%";
  };
  dialog.querySelectorAll<HTMLElement>("[data-wmh-iso-zoom]").forEach(button=>button.addEventListener("click",()=>{
    const action=button.dataset.wmhIsoZoom;
    if(action==="reset"){initialFitApplied=false;measure();centerMap();return;}
    apply(zoom+(action==="in"?.2:-.2));
  }));
  dialog.querySelector<HTMLElement>("[data-wmh-iso-center]")?.addEventListener("click",()=>{measure();centerMap();});
  const pts=new Map<number,{x:number;y:number}>();let pinch:{distance:number;zoom:number}|null=null;
  const dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
  viewport.addEventListener("pointerdown",e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2){const p=[...pts.values()];pinch={distance:Math.max(1,dist(p[0],p[1])),zoom};}});
  viewport.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2&&pinch){const p=[...pts.values()];apply(pinch.zoom*dist(p[0],p[1])/pinch.distance,(p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2);e.preventDefault();}});
  const finish=(e:PointerEvent)=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;};
  viewport.addEventListener("pointerup",finish);viewport.addEventListener("pointercancel",finish);
  // Wait until the map view is visible; hidden-parent measurements can be zero.
  const initialize=()=>{measure();centerMap();};
  requestAnimationFrame(()=>requestAnimationFrame(initialize));
  if(typeof ResizeObserver!=="undefined"){
    const observer=new ResizeObserver(()=>{measure();centerMap();});
    observer.observe(viewport);
  }
}

function isometricEditorMarkup(): string {
  return '<div class="wmh-overlay-editor" data-wmh-editor-dock>'+
    '<button type="button" class="wmh-overlay-float" data-wmh-overlay-toggle aria-label="Open isometric map editor" aria-pressed="false" aria-expanded="false"><i class="wmh-tool-map">⌖</i></button>'+
    '<div class="wmh-overlay-modal" data-wmh-overlay-tools hidden><section class="wmh-overlay-tools" role="dialog" aria-modal="false" aria-label="Isometric map editor">'+
    '<div class="wmh-overlay-resize-grip" data-wmh-panel-resize-handle role="separator" aria-orientation="diagonal" aria-label="Resize editor from its upper-left corner"><span></span></div>'+
    '<header class="wmh-overlay-modal-head" data-wmh-overlay-drag-handle><div><b>ISOMETRIC EDITOR</b><small>MAP CELL WORKBENCH</small></div><button type="button" data-wmh-overlay-close aria-label="Return to editor bubble">×</button></header>'+
    '<label>EDITING MODE<select data-wmh-overlay-mode><option value="cell-add">＋ ADD CELL</option><option value="cell-delete">－ DELETE CELL</option><option value="cell-merge">⇧ SELECT CELLS TO MERGE</option><option value="cell-unmerge">↔ UNMERGE CELL GROUP</option><option value="foreground">○ Foreground quadrants</option><option value="blocked">X Blocked quadrants</option><option value="opacity">◌ Character opacity quadrants</option><option value="transition">Area transition markers</option></select></label><div class="wmh-cell-layout-tools" data-wmh-cell-tools hidden><b>CELL LAYOUT</b><span data-wmh-cell-selection-count>0 CELLS SELECTED</span><button type="button" data-wmh-merge-apply>MERGE SELECTED CELLS</button><button type="button" data-wmh-merge-clear>CLEAR SELECTION</button><small>Tap adjacent cells to select them. Tap-drag only pans the map.</small></div><label class="wmh-walkable-switch"><input type="checkbox" data-wmh-walkable-enabled/> LIMIT MOVEMENT TO BLUE CELLS</label>'+
    '<p class="wmh-editor-mode-note">Paint only the image area that should be used. Each main diamond has 4 sectors: top-left, top-right, bottom-left and bottom-right. X blocks a sector edge, ○ redraws that image sector above characters, and ◌ makes characters translucent. The source image and canvas gaps are never resized by grid calibration.</p>'+
    '<div data-wmh-transition-tools hidden><label>DESTINATION LABEL<input type="text" maxlength="80" data-wmh-transition-label placeholder="e.g. Academy · Main Hall"/></label><button type="button" data-wmh-transition-apply>APPLY LABEL</button><button type="button" data-wmh-transition-delete>DELETE SELECTED</button><p>Red = unnamed. Blue = named. Tap a marker to select it.</p></div>'+
    '<div class="wmh-grid-calibration"><b>GRID CALIBRATION</b>'+
    '<div data-wmh-grid-row><label>Columns <output data-wmh-grid-value="cols">24</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="1">−</button><input type="range" min="1" max="128" step="1" value="24" data-wmh-grid-control="cols"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="1">+</button></div>'+
    '<div data-wmh-grid-row><label>Rows <output data-wmh-grid-value="rows">20</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="1">−</button><input type="range" min="1" max="128" step="1" value="20" data-wmh-grid-control="rows"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="1">+</button></div>'+
    '<div data-wmh-grid-row><label>Cell width <output data-wmh-grid-value="tileW">64</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="1">−</button><input type="range" min="16" max="256" step="1" value="64" data-wmh-grid-control="tileW"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="1">+</button></div>'+
    '<div data-wmh-grid-row><label>Cell height <output data-wmh-grid-value="tileH">32</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="1">−</button><input type="range" min="8" max="128" step="1" value="32" data-wmh-grid-control="tileH"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="1">+</button></div>'+
    '<div data-wmh-grid-row><label>Offset X <output data-wmh-grid-value="offsetX">0</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="2">−</button><input type="range" min="-600" max="600" step="2" value="0" data-wmh-grid-control="offsetX"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="2">+</button></div>'+
    '<div data-wmh-grid-row><label>Offset Y <output data-wmh-grid-value="offsetY">0</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="2">−</button><input type="range" min="-600" max="600" step="2" value="0" data-wmh-grid-control="offsetY"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="2">+</button></div>'+
    '<div data-wmh-grid-row><label>Player scale <output data-wmh-grid-value="playerScale">1</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="0.05">−</button><input type="range" min="0.4" max="2" step="0.05" value="1" data-wmh-grid-control="playerScale"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="0.05">+</button></div>'+
    '<div data-wmh-grid-row><label>NPC scale <output data-wmh-grid-value="npcScale">1</output></label><button type="button" data-wmh-grid-dir="minus" data-wmh-grid-step="0.05">−</button><input type="range" min="0.4" max="2" step="0.05" value="1" data-wmh-grid-control="npcScale"/><button type="button" data-wmh-grid-dir="plus" data-wmh-grid-step="0.05">+</button></div></div>'+
    '<div class="wmh-overlay-tool-actions"><button type="button" data-wmh-overlay-undo>UNDO</button><button type="button" data-wmh-overlay-clear>CLEAR MAP</button><button type="button" data-wmh-overlay-save>SAVE DRAFT</button><button type="button" data-wmh-overlay-confirm>✓ CONFIRM &amp; SAVE</button><button type="button" data-wmh-overlay-copy>COPY DATA FOR AI</button></div>'+
    '<label class="wmh-ai-export" data-wmh-overlay-export-wrap hidden>AI-READY MAP DATA · JSON<textarea data-wmh-overlay-export readonly spellcheck="false" placeholder="Use COPY DATA FOR AI to generate the complete map reference..."></textarea><small>Copy this complete JSON and paste it into your next AI update request. It includes the grid, selected walkable cells, all four-sector flags, and transition labels.</small></label><label>IMPORT MAP DATA<textarea data-wmh-overlay-import-text placeholder="Paste a saved isometric-map JSON reference..."></textarea></label><button type="button" data-wmh-overlay-import>IMPORT MAP DATA</button>'+
    '<small data-wmh-overlay-status>Choose a tool, then tap individual diamond cells. The world pauses while the editor is open.</small></section></div></div>';
}
function isometricHudMarkup(title: string, mapImage: string, showMinimap = true): string {
  // Keep the compact minimap in the HUD for every area, including Academy.
  // Academy uses the same full Map Base image with its matching grid and actor layer.
  const minimapMarkup=
    '<button type="button" class="wmh-rpg-minimap" data-wmh-minimap aria-label="Minimap. Tap a location to walk there." title="Tap the map to move">'+
    '<span class="wmh-minimap-heading">FIELD MAP <i>⌖</i></span><span class="wmh-minimap-world" data-wmh-minimap-world>'+
    (mapImage?'<img data-wmh-academy-map-art src="'+mapImage+'" alt="" aria-hidden="true" draggable="false"/>':"")+
    '<svg class="wmh-minimap-grid" data-wmh-minimap-grid viewBox="0 0 2816 1536" preserveAspectRatio="none" aria-hidden="true"></svg><span class="wmh-minimap-actors" data-wmh-minimap-actors></span></span>'+
    '<span class="wmh-minimap-footer" data-wmh-minimap-footer>YOU · X 05 / Y 17 · TAP TO MOVE</span></button>';
  return '<div class="wmh-isometric-hud" data-wmh-isometric-hud>'+
    '<section class="wmh-world-status" aria-label="World conditions">'+
    '<div class="wmh-world-status-top"><span class="wmh-status-cycle-icon" data-wmh-cycle-icon>☼</span><div><b data-wmh-cycle-label>PAGI</b><small data-wmh-cycle-caption>WORLD CYCLE</small></div></div>'+
    '<div class="wmh-world-status-bottom"><span class="wmh-status-weather"><i data-wmh-weather-icon>☀</i><b data-wmh-weather-label>CLEAR</b></span><span class="wmh-status-day" data-wmh-day>HARI 01</span><strong data-wmh-time>08:00</strong></div>'+
    '<small class="wmh-status-location">'+escapeMapEditorText(title)+'</small><small class="wmh-status-coordinates" data-wmh-player-grid>GRID X 05 · Y 17</small></section>'+
    (showMinimap?minimapMarkup:"")+'</div>';
}
function academyCanvasEditorMarkup(): string {
  const sides=["top","bottom","left","right"] as const;
  return '<div class="wmh-academy-canvas-editor" data-wmh-academy-editor>'+
    '<button type="button" data-wmh-academy-editor-toggle aria-expanded="false">▦ CANVAS EDITOR</button>'+
    '<section data-wmh-academy-editor-panel hidden><b>ACADEMY CANVAS EXPANSION</b><small>Adjust each side independently. Preview updates live; confirm to save.</small>'+
    '<div class="wmh-canvas-default-gap" aria-label="Read-only automatic default gap"><b>DEFAULT GAP · AUTO (READ ONLY)</b><div><span>TOP</span><output data-wmh-default-gap="top">— px</output><span>BOTTOM</span><output data-wmh-default-gap="bottom">— px</output><span>LEFT</span><output data-wmh-default-gap="left">— px</output><span>RIGHT</span><output data-wmh-default-gap="right">— px</output></div><small>Initial automatic gap before your extra values below.</small></div>'+
    sides.map(side=>'<label>'+side.toUpperCase()+' <output data-wmh-canvas-value="'+side+'">'+DEFAULT_ISO_CANVAS_EXPANSION[side]+' px</output><input type="range" min="0" max="12000" step="100" value="'+DEFAULT_ISO_CANVAS_EXPANSION[side]+'" data-wmh-canvas-side="'+side+'"/></label>').join("")+
    '<div class="wmh-academy-canvas-actions"><button type="button" data-wmh-canvas-refresh>↻ REFRESH PREVIEW</button><button type="button" data-wmh-canvas-confirm>✓ CONFIRM & SAVE</button><button type="button" data-wmh-canvas-copy>COPY CONFIG</button></div>'+
    '<textarea data-wmh-canvas-export readonly aria-label="Copyable Academy canvas configuration" placeholder="Confirmed canvas configuration appears here..."></textarea><small data-wmh-canvas-status>Unconfirmed changes are preview-only.</small></section></div>';
}
function bindAcademyCanvasEditor(dialog:HTMLElement):void {
  const editor=dialog.querySelector<HTMLElement>("[data-wmh-academy-editor]");
  const panel=editor?.querySelector<HTMLElement>("[data-wmh-academy-editor-panel]");
  const toggle=editor?.querySelector<HTMLButtonElement>("[data-wmh-academy-editor-toggle]");
  if(!editor||!panel||!toggle||editor.dataset.bound==="true")return;
  editor.dataset.bound="true";
  const key="merzkava.academy-canvas-expansion.v2";
  const controls=[...panel.querySelectorAll<HTMLInputElement>("[data-wmh-canvas-side]")];
  const mapViewport=dialog.querySelector<HTMLElement>("[data-wmh-map-viewport]");
  const status=panel.querySelector<HTMLElement>("[data-wmh-canvas-status]");
  const output=panel.querySelector<HTMLTextAreaElement>("[data-wmh-canvas-export]");
  const read=()=>normalizeIsoCanvasExpansion(Object.fromEntries(controls.map(input=>[input.dataset.wmhCanvasSide||"",Number(input.value)])));
  const gapInfo=()=>{
    const rect=mapViewport?.getBoundingClientRect();
    const image=dialog.querySelector<HTMLImageElement>("[data-wmh-map-surface] img");
    const naturalWidth=image?.naturalWidth||2816,naturalHeight=image?.naturalHeight||1536;
    const viewportWidth=Math.max(1,rect?.width||window.innerWidth),viewportHeight=Math.max(1,rect?.height||window.innerHeight);
    const ratio=naturalWidth/naturalHeight;
    const imageWidth=Math.max(viewportWidth,viewportHeight*ratio);
    const scale=imageWidth/naturalWidth,cellW=128*scale,cellH=69.5*scale;
    const defaults={top:Math.round(Math.max(cellH*2,viewportHeight/2)),bottom:Math.round(Math.max(cellH*2,viewportHeight/2)),left:Math.round(Math.max(cellW*2,viewportWidth*2)),right:Math.round(Math.max(cellW*2,viewportWidth/2))};
    const extra=read();
    return {defaults,extra,final:Object.fromEntries((Object.keys(defaults) as Array<keyof typeof defaults>).map(side=>[side,Math.round(defaults[side]+extra[side])]))};
  };
  const showValues=()=>controls.forEach(input=>{const side=input.dataset.wmhCanvasSide||"",value=panel.querySelector<HTMLOutputElement>('[data-wmh-canvas-value="'+side+'"]');if(value)value.value=Number(input.value).toLocaleString()+" px";});
  const showDefaultGap=()=>{const info=gapInfo();(Object.keys(info.defaults) as Array<keyof typeof info.defaults>).forEach(side=>{const value=panel.querySelector<HTMLOutputElement>('[data-wmh-default-gap="'+side+'"]');if(value)value.value=info.defaults[side].toLocaleString()+" px";});return info;};
  const exportConfig=()=>{const info=showDefaultGap();return {format:"merzkava-academy-canvas-expansion",version:1,mapId:"golden-dragon-empire:tianhai-academy:exterior",defaultGapPx:info.defaults,canvasExpansion:info.extra,finalGapPx:info.final};};
  const preview=()=>{showValues();showDefaultGap();mapViewport?.dispatchEvent(new CustomEvent("merzkava-academy-canvas-expansion-preview",{detail:read()}));if(status)status.textContent="Live preview updated. Confirm to save these values.";};
  try{
    const saved=normalizeIsoCanvasExpansion(JSON.parse(localStorage.getItem(key)||"{}"));
    controls.forEach(input=>{input.value=String(saved[(input.dataset.wmhCanvasSide||"left") as keyof typeof saved]);});showValues();
  }catch{}
  toggle.addEventListener("click",()=>{panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden)showDefaultGap();});
  controls.forEach(input=>input.addEventListener("input",preview));
  panel.querySelector<HTMLElement>("[data-wmh-canvas-refresh]")?.addEventListener("click",preview);
  panel.querySelector<HTMLElement>("[data-wmh-canvas-confirm]")?.addEventListener("click",()=>{
    const value=read();try{localStorage.setItem(key,JSON.stringify(value));if(status)status.textContent="Canvas expansion confirmed and saved on this device.";if(output)output.value=JSON.stringify(exportConfig(),null,2);}
    catch{if(status)status.textContent="Could not save. Use COPY CONFIG to keep the current settings.";}
  });
  panel.querySelector<HTMLElement>("[data-wmh-canvas-copy]")?.addEventListener("click",async()=>{
    const value=JSON.stringify(exportConfig(),null,2);
    if(output)output.value=value;
    try{await navigator.clipboard.writeText(value);if(status)status.textContent="Configuration copied. Send that JSON here.";}
    catch{output?.focus();output?.select();if(status)status.textContent="Clipboard unavailable. Select and copy the JSON shown above.";}
  });
}
function isometricPlayMarkup(regionId: RegionId, selectedBuilding: string, interior: boolean): string {
  const isEmptyAcademy = !interior && regionId === "golden-dragon-empire" &&
    selectedBuilding.trim().toLowerCase() === "tianhai academy";
  if (isEmptyAcademy) {
    const academyMapImage="/maps/academy/full-map/1_academy.jpg";
    const academyMapId="golden-dragon-empire:tianhai-academy:exterior";
    return '<div class="wmh-isometric-play-screen wmh-academy-map-screen" data-wmh-isometric-play-screen>'+
      '<div class="wmh-map-zoom wmh-academy-map-zoom" aria-label="Academy map zoom controls"><button type="button" data-wmh-zoom="out" aria-label="Zoom out">−</button><span data-wmh-zoom-level>100%</span><button type="button" data-wmh-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-zoom="reset">RESET</button></div>'+
      '<div class="wmh-academy-map-viewport" data-wmh-map-viewport><div class="wmh-academy-map-surface" data-wmh-map-surface data-wmh-academy-canvas data-wmh-board data-academy-artwork-board="true" data-map-id="'+academyMapId+'" data-cols="24" data-rows="20" data-tile-w="128" data-tile-h="69.5" data-offset-x="0" data-offset-y="0" data-map-theme="golden-dragon-empire" data-map-title="Tianhai Academy" data-map-interior="false">'+
      '<svg class="wmh-academy-margin-grid" data-wmh-academy-margin-grid preserveAspectRatio="none" aria-hidden="true"></svg>'+
      '<img class="wmh-academy-map-art" data-wmh-academy-map-art data-wmh-map-art src="'+academyMapImage+'" alt="Tianhai Academy full map" draggable="false" loading="eager" decoding="async"/>'+
      '<canvas class="wmh-isometric-foreground" data-wmh-foreground-canvas aria-hidden="true"></canvas>'+
      '<svg class="wmh-area-overlay-svg wmh-academy-grid-overlay" data-wmh-overlay-svg viewBox="0 0 2816 1536" preserveAspectRatio="none" aria-label="Editable isometric interaction grid"><g data-wmh-interaction-grid></g><g data-wmh-overlay-marks></g><g data-wmh-manual-marks></g><g data-wmh-transition-marks></g><path data-wmh-overlay-preview class="wmh-area-mark-preview" d=""></path></svg>'+
      '<div class="wmh-academy-actor-layer" data-wmh-actor-layer><button type="button" class="wmh-character-token wmh-player-token" data-wmh-player-token data-token-label="" data-x="5" data-y="17" aria-label="Player character"><i></i></button>'+isometricNpcTokensMarkup(academyMapId,false)+'</div>'+
      '</div></div>'+academyCanvasEditorMarkup()+isometricEditorMarkup()+
      '<button type="button" class="wmh-map-back wmh-academy-map-back" data-wmh-action="back" aria-label="Return to Golden Dragon Empire map"><i class="wmh-academy-back-icon" aria-hidden="true"></i><b>GOLDEN DRAGON EMPIRE</b></button>'+
      '<section class="wmh-chat-panel" data-wmh-chat hidden role="dialog" aria-label="Character conversation"><div class="wmh-chat-card"><button type="button" class="wmh-chat-close" data-wmh-action="chat-close" aria-label="Close conversation">×</button><div class="wmh-chat-thread" data-wmh-thread></div><div class="wmh-chat-input-row"><span>YOUR RESPONSE</span><div data-wmh-replies></div></div></div></section>'+
      '</div>';
  }
  const mapId=makeIsometricMapId(regionId,selectedBuilding,interior);
  const mapImage=isometricMapBaseFor(regionId,selectedBuilding,interior);
  const title=selectedBuilding+(interior?" · INTERIOR":"");
  return '<div class="wmh-isometric-play-screen" data-wmh-isometric-play-screen>'+
    tileMapMarkup(interior,mapId,mapImage,regionId,selectedBuilding)+
    isometricHudMarkup(title,mapImage)+
    isometricEditorMarkup()+
    '<button type="button" class="wmh-map-back" data-wmh-action="back" aria-label="Leave isometric area"><span>‹</span><b>BACK</b></button>'+
    '<section class="wmh-chat-panel" data-wmh-chat hidden role="dialog" aria-label="Character conversation"><div class="wmh-chat-card"><button type="button" class="wmh-chat-close" data-wmh-action="chat-close" aria-label="Close conversation">×</button><div class="wmh-chat-thread" data-wmh-thread></div><div class="wmh-chat-input-row"><span>YOUR RESPONSE</span><div data-wmh-replies></div></div></div></section>'+
    '</div>';
}

export function renderIsometricMapTestArea(): string {
  const mapId="isometric-render-test:render-yard:exterior";
  return '<div class="wmh-isometric-play-screen" data-wmh-isometric-play-screen>'+
    tileMapMarkup(false,mapId,"")+isometricHudMarkup("ISOMETRIC RENDER TEST","")+isometricEditorMarkup()+
    '<div class="wmh-isometric-test-caption"><b>ISOMETRIC RENDER TEST</b><span>16 × 12 TILES · PLAYER · 3 NPCs · LIVE CAMERA</span></div>'+
    '<button type="button" class="wmh-map-back" data-wmh-action="back" aria-label="Leave isometric test area"><span>‹</span><b>EXIT TEST</b></button>'+
    '<section class="wmh-chat-panel" data-wmh-chat hidden role="dialog" aria-label="Character conversation"><div class="wmh-chat-card"><button type="button" class="wmh-chat-close" data-wmh-action="chat-close" aria-label="Close conversation">×</button><div class="wmh-chat-thread" data-wmh-thread></div><div class="wmh-chat-input-row"><span>YOUR RESPONSE</span><div data-wmh-replies></div></div></div></section></div>';
}

function panelMarkup(level: Level, regionId: RegionId = "golden-dragon-empire", selectedBuilding = "Tianhai Academy", selectedArea?: WorldMarker): string {
  const region = regionData[regionId];
  const header = (kind: string, title: string, subtitle: string) =>
    '<header class="wmh-level-header"><div><span class="wmh-level-tag">'+kind+'</span><h3>'+title+'</h3><p>'+subtitle+'</p></div><button type="button" class="wmh-close" data-wmh-action="close" aria-label="Close map">×</button></header>';
  if (level === "world") return header("WORLD MAP","Merzkava Universe","THREE GREAT POWERS · EXTERNAL TERRITORIES · SEAS")+
    '<div class="wmh-map-zoom"><button type="button" data-wmh-zoom="out">−</button><span data-wmh-zoom-level>100%</span><button type="button" data-wmh-zoom="in">+</button><button type="button" data-wmh-zoom="reset">RESET</button></div>'+
    '<div class="wmh-world-map" data-wmh-map-viewport><div class="wmh-world-map-image" data-wmh-map-surface><img src="/world/Untitled77_20261029054536.png" alt="Merzkava Universe world map"/>'+readWorldMarkers().map(marker=>worldMapMarkerMarkup(marker)).join("")+'</div><div data-wmh-selection-host></div></div>'+
    '<div class="wmh-bottom-actions"><span>SELECT A POWER TO OPEN ITS REGIONAL MAP</span><button type="button" data-wmh-action="test-isometric">▦ ISOMETRIC TEST AREA</button><button data-wmh-action="editor-open">⊞ MAP EDITOR</button></div>';
  if (level === "map-editor") return header("WORLD MAP TOOLS","Map Editor","FLAT WORLD MAP · NORMALIZED COORDINATES")+mapEditorMarkup();
  if (level === "test") return renderIsometricMapTestArea();
  if (level === "regional") return header("REGIONAL MAP",selectedArea?.name||region.name,selectedArea?.subtitle||region.subtitle)+
    '<div class="wmh-regional-placeholder"><div class="wmh-regional-land"><span class="wmh-regional-river"></span><span class="wmh-regional-road road-one"></span><span class="wmh-regional-road road-two"></span><span class="wmh-regional-road road-three"></span><span class="wmh-regional-label">'+(selectedArea?selectedArea.name.toUpperCase():"REGIONAL MAP ART · PLACEHOLDER")+'</span>'+
    (selectedArea?["Central District","Local Settlement","Market Quarter","Public Grounds","Transport Gate","Nearby Landmark"]:region.sites).map((site,i)=>'<button type="button" class="wmh-regional-site site-'+i+'" data-wmh-site="'+site+'" data-wmh-region-id="'+regionId+'"><i>'+["♜","⌘","▤","⚓","⌑","⚔"][i%6]+'</i><b>'+site+'</b></button>').join("")+'</div></div>'+
    '<div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>SELECT A PLACE · LOCAL MAPS OPEN HERE</span></div>';
  if (level === "local") return isometricPlayMarkup(regionId, selectedBuilding, false);
  if (level === "interior") return isometricPlayMarkup(regionId, selectedBuilding, true);
  return header("PERSONAL GROUNDS","Personal Grounds","ISOMETRIC HOME · PLOTS & FACILITIES")+
    '<div class="wmh-home-grid">'+[["Farmland","▧"],["Building Plot","⌂"],["Training Area","⚔"],["Warehouse","▤"],["Fish Pond","◉"],["Lumber Area","♧"]].map(([name,icon])=>'<button data-wmh-plot="'+name+'"><span>'+icon+'</span><b>'+name+'</b><small>VIEW FUNCTION</small></button>').join("")+'</div><div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>PERSONAL DEVELOPMENT AREA</span></div>';
}
export function renderWorldMapHierarchy(): string {
  return '<section class="wmh-overlay" data-world-map-hierarchy aria-label="Map Navigation"><div class="wmh-dialog" data-wmh-dialog>'+panelMarkup("world")+'</div></section>';
}
function resetLegacyIsometricMapLayouts(): void {
  // Clear only Tianhai Academy exterior once; other regions keep their saved editor data.
  const academyMarker="merzkava.isometric-map-academy-reset.v3";
  try {
    if(localStorage.getItem(academyMarker)!=="done"){
      const academyId="golden-dragon-empire:tianhai-academy:exterior";
      localStorage.removeItem(isoMapStorageKey(academyId));
      localStorage.removeItem("merzkava.iso-editor-ui.v1:"+encodeURIComponent(academyId));
      localStorage.removeItem("merzkava.iso-area-overlays.v2:"+encodeURIComponent(academyId));
      localStorage.setItem(academyMarker,"done");
    }
  } catch { /* the Academy starts clean when local persistence is available */ }
  const marker="merzkava.isometric-map-refresh.v2";
  try {
    if(localStorage.getItem(marker)==="done")return;
    const prefixes=["merzkava.isometric-map-editor.v1:","merzkava.iso-area-overlays.v2:","merzkava.iso-editor-ui.v1:"];
    const remove:string[]=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||"";
      if(prefixes.some(prefix=>key.startsWith(prefix)))remove.push(key);
    }
    remove.forEach(key=>localStorage.removeItem(key));
    localStorage.setItem(marker,"done");
  } catch { /* the refreshed editor remains usable without local persistence */ }
}

export function initializeWorldMapHierarchy(root: HTMLElement): void {
  resetLegacyIsometricMapLayouts();
  const overlay=root.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog=overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if(overlay&&dialog&&!overlay.hidden)bindWorldMapZoom(dialog);
}
const npcData: Record<string,{name:string;gender:string;greeting:string;choices:string[];replies:string[]}> = {
  "student-lin":{name:"Lin Yue",gender:"female",greeting:"The academy garden is peaceful this early. I come here whenever the study halls get too noisy.",choices:["Ask about the academy","Ask about the pond","Wish her a good day"],replies:["The instructors rotate lessons between the eastern and western study halls.","The pond is fed by a spring beneath the old cedar. The fish are surprisingly tame.","You too! May your studies go smoothly."]},
  "student-wei":{name:"Shen Wei",gender:"male",greeting:"I was told to practice footwork, but the groundskeeper keeps sending me to carry things. Hah.",choices:["Ask about training","Offer to help","End conversation"],replies:["The sparring court is beyond the southern gate. Keep your stance low.","Really? Thanks. Those planters are heavier than they look.","See you around."]},
  "teacher-mei":{name:"Instructor Mei",gender:"female",greeting:"A student should learn to observe before acting. Even a quiet garden has much to teach.",choices:["Ask about today's lessons","Ask for advice","Take your leave"],replies:["Foundational theory is being taught in the eastern classroom today.","Watch the flow of Spirit Qi, but do not force it. Patience is part of discipline.","Return when you have a question worth asking."]},
  "groundskeeper":{name:"Uncle Qiao",gender:"male",greeting:"Mind the wet stones around the pond, young one. The moss makes them slippery after watering.",choices:["Ask about the garden","Ask about the pond","Thank him"],replies:["The flowering shrubs were planted by the first academy groundskeeper.","The pond is shallow near the bridge, but deep beside the willow.","Take care where you step."]},
  "teacher":{name:"Instructor",gender:"male",greeting:"Settle down. The lesson will begin shortly.",choices:["Ask about the lesson","Ask for guidance"],replies:["Today we review the foundations.","Observe carefully and ask when you are ready."]},
  "arena-referee":{name:"Referee Gao",gender:"male",greeting:"The public arena is open for supervised bouts. No lethal techniques, no attacks after a match is called, and no exceptions.",choices:["Ask about arena rules","Ask about registration","Thank him"],replies:["A bout ends when one side yields, leaves the ring, or the referee intervenes. Keep the crowd outside the boundary.","Register at the bronze desk. Bring your name and current Spirit Realm record; unverified challenges are not accepted.","Clear rules keep a public arena safe."]},
  "arena-fighter":{name:"Meng Rui",gender:"female",greeting:"I am waiting for the next sparring call. My last opponent relied on speed, so today I am practicing how to read a feint.",choices:["Ask about training","Ask about the arena","Wish her luck"],replies:["Short steps, steady breathing, and no wasted motion. It is less impressive than a flashy technique, but it works.","The public arena hosts open practice as well as formal bouts. The western stands are usually quieter.","Watch the footwork if you stay for the match."]},
  "arena-spectator":{name:"Fan Bo",gender:"male",greeting:"I came early to get a seat near the rail. You can learn a surprising amount by watching how experienced fighters control distance.",choices:["Ask who is fighting","Ask about the rules","Enjoy the match"],replies:["The next pairing has not been posted yet. The stewards are still checking registrations.","The outer ring is for spectators. Cross the marked line only when the referee invites you.","Watch carefully and enjoy the bout."]},
  "gde-warden":{name:"Captain Lu Jian",gender:"male",greeting:"Keep to the marked avenue. The imperial district is busy, but visitors are welcome when they respect the posted rules.",choices:["Ask about the district","Ask about the gate","Thank him"],replies:["The main avenue leads toward the administrative quarter and public grounds.","The eastern gate is open to registered travellers. Keep your papers somewhere dry.","Travel safely."]},
  "gde-herbalist":{name:"Madam Su",gender:"female",greeting:"Looking for a remedy or simply browsing? Ordinary herbs are on the front shelf; rarer ingredients stay under lock.",choices:["Ask about herbs","Ask about Spirit Beasts","Browse quietly"],replies:["The pale-leaf variety is useful for simple salves. Anything stronger needs proper identification first.","Never harvest from a Spirit Beast habitat without knowing the local restrictions.","Take your time. Good ingredients deserve a careful look."]},
  "gde-courier":{name:"Zhou An",gender:"male",greeting:"I have three parcels left before the afternoon bell. The city lanes are easy to lose track of when the market gets crowded.",choices:["Ask for directions","Ask about deliveries","Wish him luck"],replies:["Follow the stone lanterns toward the public pavilion, then take the north path.","Most academy parcels are sealed with a blue cord. I never open one; I only check the destination mark.","Thank you. I should get moving."]},
  "ty-clerk":{name:"Yun Suyi",gender:"female",greeting:"Welcome to the skyport. Boarding notices change with the island's route, so check the brass display before approaching a vessel.",choices:["Ask about routes","Ask about safety","Thank her"],replies:["The western platform serves local districts. Long-distance vessels use the upper berths.","Keep behind the gold floor marks while an airship is docking. Its stabilizers can create strong pressure gusts.","Safe travels across Yunzhou."]},
  "ty-sailor":{name:"Chen Luo",gender:"male",greeting:"The clouds look calm from here, but the updrafts around the island edge can change without warning.",choices:["Ask about sailing","Ask about the harbor","Ask about the weather"],replies:["A steady hand matters more than speed. We wait for a clear wind window before leaving the platform.","Cargo is checked at the lower quay. Passenger vessels use the suspended pier above it.","The cloud cover is thinning, but I would still wait for the signal lantern."]},
  "ty-arcanist":{name:"Shu Meilin",gender:"female",greeting:"I maintain the small guide-lamps along this walk. They are simple artificial artifacts, but a loose seal can make them flicker.",choices:["Ask about the guide-lamps","Ask about Arcanistry","Offer to help"],replies:["Each lamp stores a measured portion of energy liquid. It is safer to replace a cartridge than force a damaged core.","Arcanistry begins with careful measurement. A complicated engraving is useless if the base alignment is wrong.","Please keep clear of the marked workbench while the casing is open."]},
  "bg-guide":{name:"Mo Ren",gender:"male",greeting:"The northern path is clear for now. Stay near the stone markers; snowfall can hide the old trail in less than an hour.",choices:["Ask about the pass","Ask about Spirit Beasts","Thank him"],replies:["The mountain pass bends east after the second marker. Do not take the narrow ravine in poor visibility.","Tracks near the frozen basin are fresh. Observe from a distance before deciding whether to approach.","Keep your hands warm and your route familiar."]},
  "bg-trainee":{name:"Beiming Xue",gender:"female",greeting:"I am repeating the opening stance until it becomes natural. The cold makes careless movement even more obvious.",choices:["Ask about practice","Ask about the dojo","Wish her well"],replies:["Start slowly, then increase the pace only when your balance stays steady.","The dojo network shares instructors, but each hall keeps its own training schedule.","May your own practice go smoothly."]},
  "bg-attendant":{name:"Han Yu",gender:"male",greeting:"The grand hall is quiet between audiences. If you need directions, I can point you toward the public records desk.",choices:["Ask about the records","Ask about the hall","Thank him"],replies:["The public records desk keeps route notices and local announcements. Restricted records require an authorized request.","The northern wing is used for formal meetings. Please leave the central passage clear.","The marked corridor is the easiest way back."]},
  "test-guide":{name:"Guide Ren",gender:"female",greeting:"Welcome to the Isometric Render Yard. Every visible diamond is a walkable test tile unless marked otherwise.",choices:["Ask what this area tests","Ask about the markers","Thank her"],replies:["This room uses the same board, camera, tile, player, NPC, and minimap renderer as the Academy, but it has no Academy artwork dependency.","The gold token is you. The rose and blue tokens are NPCs. Their labels should stay attached while they move.","Good luck with the test."]},
  "test-scholar":{name:"Scholar Bo",gender:"male",greeting:"I am checking the stone path and the reflection pool. Both should remain visible while the camera moves.",choices:["Ask about the terrain","Ask about movement"],replies:["The blue area is the pool, the pale strip is the main path, and the green cells mark gardens.","Tap any empty tile to move. The camera FIT and CENTER controls should also work."]},
  "test-mechanic":{name:"Artificer Mei",gender:"female",greeting:"I am watching the player and NPC layers. Their sprites should render above the ground tiles.",choices:["Ask about the map layers","Ask about the editor"],replies:["This test has no image layer. It isolates the isometric grid and character layers from external artwork loading.","Open the floating editor to test the grid and destination markers without leaving this room."]}
};
function syncIsoDepthAndOcclusion(board:HTMLElement):void {
  const data=readIsoMapData(board);
  const tokens=Array.from(board.querySelectorAll<HTMLElement>("[data-wmh-player-token],[data-wmh-npc]"));
  board.querySelectorAll<HTMLElement>("[data-wmh-tile]").forEach(tile=>{
    const x=Number(tile.dataset.x||0),y=Number(tile.dataset.y||0);
    tile.style.zIndex=String(1+x+y);
  });
  tokens.forEach(token=>{
    const x=Number(token.dataset.x||0),y=Number(token.dataset.y||0);
    token.style.setProperty("--character-z",String(20+x+y));
    const opacity=isoCellHasLayer(data,"opacityCells",x,y)||data.opacityQuadrants.some(key=>key.startsWith(x+","+y+":"))?"0.42":"1";
    token.style.setProperty("--character-opacity",opacity);
    if(board.dataset.academyArtworkBoard==="true"){
      const image=board.querySelector<HTMLImageElement>("[data-wmh-map-art]"),width=image?.naturalWidth||2816,height=image?.naturalHeight||1536,center=isoCellCenter(x,y,data.grid);
      token.style.left=(center.x/width*100)+"%";token.style.top=(center.y/height*100)+"%";token.style.zIndex=String(20+x+y);token.style.opacity=opacity;
    }
  });
  renderIsometricMinimap(board);
  const dialog=board.closest<HTMLElement>("[data-wmh-dialog]");
  if(dialog)renderIsometricWorldStatus(dialog);
}

function animateGridMove(token:HTMLElement,update:()=>void):void {
  const before=token.getBoundingClientRect();
  update();
  const board=token.closest<HTMLElement>("[data-wmh-board]");
  if(board)syncIsoDepthAndOcclusion(board);
  const after=token.getBoundingClientRect();
  const dx=before.left-after.left,dy=before.top-after.top;
  token.animate([
    {transform:"translate("+dx+"px,"+dy+"px) translate(-50%,-100%) translateY(-7px)"},
    {transform:"translate(-50%,-100%) translateY(-7px)"}
  ],{duration:225,easing:"cubic-bezier(.2,.72,.25,1)"});
}
function stopNpcWander(dialog:HTMLElement):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const timer=Number(board?.dataset.npcTimer||0);
  if(timer)window.clearInterval(timer);
  if(board)delete board.dataset.npcTimer;
}
function startNpcWander(dialog:HTMLElement):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(!board||board.dataset.editorPaused==="true"||board.classList.contains("wmh-overlay-editing"))return;
  if(dialog.querySelector<HTMLElement>("[data-wmh-chat]")?.hidden===false)return;
  stopNpcWander(dialog);
  const timer=window.setInterval(()=>{
    const mapData=readIsoMapData(board);
    const player=board.querySelector<HTMLElement>("[data-wmh-player-token]");
    board.querySelectorAll<HTMLElement>("[data-wmh-npc]").forEach(npc=>{
      if(Math.random()>.48)return;
      const x=Number(npc.dataset.x||0),y=Number(npc.dataset.y||0);
      const options=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([nx,ny])=>{
        const tile=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+nx+'"][data-y="'+ny+'"]');
        return isoGridCellExists(mapData,nx,ny)&&
          !!tile&&isoCanStep(mapData,x,y,nx,ny)&&
          !(Number(player?.dataset.x||5)===nx&&Number(player?.dataset.y||8)===ny);
      });
      if(!options.length)return;
      const [nx,ny]=options[Math.floor(Math.random()*options.length)];
      npc.dataset.x=String(nx);npc.dataset.y=String(ny);
      animateGridMove(npc,()=>{npc.style.setProperty("--token-x",String(nx));npc.style.setProperty("--token-y",String(ny));});npc.dataset.x=String(nx);npc.dataset.y=String(ny);syncIsoDepthAndOcclusion(board);
    });
  },2400);
  board.dataset.npcTimer=String(timer);
}
function renderChat(dialog:HTMLElement,npcId:string):void {
  const npc=npcData[npcId]; if(!npc)return;
  const chat=dialog.querySelector<HTMLElement>("[data-wmh-chat]");
  const thread=dialog.querySelector<HTMLElement>("[data-wmh-thread]");
  const replies=dialog.querySelector<HTMLElement>("[data-wmh-replies]");
  if(!chat||!thread||!replies)return;
  stopNpcWander(dialog);
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const player=board?.querySelector<HTMLElement>("[data-wmh-player-token]");
  const moveTimer=Number(player?.dataset.moveTimer||0);
  if(moveTimer){window.clearTimeout(moveTimer);delete player!.dataset.moveTimer;}
  chat.hidden=false;
  chat.setAttribute("aria-modal","true");
  thread.innerHTML='<article class="wmh-chat-message npc-message"><div class="wmh-chat-bust '+npc.gender+'"><i></i></div><div class="wmh-chat-copy"><b>'+npc.name+'</b><p>'+npc.greeting+'</p></div></article>';
  replies.innerHTML=npc.choices.map((choice,i)=>'<button type="button" data-wmh-reply="'+i+'" data-npc-id="'+npcId+'">'+choice+'</button>').join("");
}
function walkToTile(dialog:HTMLElement,targetX:number,targetY:number,surface:string):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(board?.dataset.editorPaused==="true"||board?.classList.contains("wmh-overlay-editing"))return;
  const player=board?.querySelector<HTMLElement>("[data-wmh-player-token]");
  if(!board||!player)return;
  const runtime=board as HTMLElement & {__wmhPendingPlayerDestination?:{x:number;y:number;surface:string}};
  const mapData=readIsoMapData(board);
  if(!Number.isInteger(targetX)||!Number.isInteger(targetY)||!isoGridCellExists(mapData,targetX,targetY))return;
  const destination=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+targetX+'"][data-y="'+targetY+'"]');
  if(!destination||!isoCanWalkTile(board,destination,targetX,targetY)){delete runtime.__wmhPendingPlayerDestination;return;}
  runtime.__wmhPendingPlayerDestination={x:targetX,y:targetY,surface};
  const oldTimer=Number(player.dataset.moveTimer||0);
  if(oldTimer)window.clearTimeout(oldTimer);
  const startX=Number(player.dataset.x||5),startY=Number(player.dataset.y||8);
  // Fixed-order breadth-first path: every tap resolves to the exact tile's
  // stored grid coordinates; no random destination or visual-position guess.
  const queue:Array<[number,number]>=[[startX,startY]];
  const previous=new Map<string,string|null>([[startX+","+startY,null]]);
  for(let cursor=0;cursor<queue.length;cursor++){
    const [x,y]=queue[cursor];
    if(x===targetX&&y===targetY)break;
    const neighbors:[[number,number],[number,number],[number,number],[number,number]]=[[x,y-1],[x+1,y],[x,y+1],[x-1,y]];
    for(const [nx,ny] of neighbors){
      const key=nx+","+ny;
      if(!isoGridCellExists(mapData,nx,ny)||previous.has(key))continue;
      const nextTile=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+nx+'"][data-y="'+ny+'"]');
      if(!nextTile||!isoCanStep(mapData,x,y,nx,ny))continue;
      previous.set(key,x+","+y);queue.push([nx,ny]);
    }
  }
  const targetKey=targetX+","+targetY;
  if(!previous.has(targetKey)){delete runtime.__wmhPendingPlayerDestination;return;}
  const path:Array<[number,number]>=[];
  let cursor:string|null=targetKey;
  while(cursor){
    const [x,y]=cursor.split(",").map(Number);
    path.unshift([x,y]);cursor=previous.get(cursor)||null;
  }
  path.shift();
  let step=0;
  const move=()=>{
    if(step>=path.length){delete player.dataset.moveTimer;delete runtime.__wmhPendingPlayerDestination;return;}
    const [x,y]=path[step++];
    const tile=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+x+'"][data-y="'+y+'"]');
    animateGridMove(player,()=>{
      player.dataset.x=String(x);player.dataset.y=String(y);
      player.style.setProperty("--token-x",String(x));
      player.style.setProperty("--token-y",String(y));
    });
    player.dataset.x=String(x);player.dataset.y=String(y);
    syncIsoDepthAndOcclusion(board);
    const material=tile?.dataset.surface||surface;
    playFootstep(material as "earth"|"wet"|"stone"|"wood"|"tile");
    player.dataset.moveTimer=String(window.setTimeout(move,235));
  };
  move();
}
export function handleWorldMapHierarchyClick(target: Element, root: HTMLElement, onAdvanceTime: (minutes: number) => void): boolean {
  const action=target.closest<HTMLElement>("[data-wmh-action],[data-wmh-info],[data-wmh-site],[data-wmh-building],[data-wmh-npc],[data-wmh-plot],[data-wmh-tile],[data-wmh-reply],[data-wmh-dismiss-layer],[data-wmh-selection-card]");
  if(!action)return false;
  const overlay=root.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog=overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if(!overlay||!dialog)return false;
  const current=(overlay.dataset.level as Level)||"world";
  const regionId=(overlay.dataset.region as RegionId)||"golden-dragon-empire";
  const building=overlay.dataset.building||"Tianhai Academy";
  if(action.dataset.wmhAction==="open"){overlay.hidden=false;overlay.dataset.level="world";dialog.innerHTML=panelMarkup("world");bindWorldMapZoom(dialog);return true;}
  if(action.dataset.wmhAction==="editor-open"){overlay.dataset.level="map-editor";dialog.innerHTML=panelMarkup("map-editor");bindWorldMapEditor(dialog);return true;}
  if(action.dataset.wmhAction==="editor-close"){overlay.dataset.level="world";dialog.innerHTML=panelMarkup("world");bindWorldMapZoom(dialog);return true;}
  if(action.dataset.wmhAction==="editor-confirm"||action.dataset.wmhAction==="editor-reset")return true;
  if(action.dataset.wmhAction==="close"){const outerClose=root.querySelector<HTMLButtonElement>("[data-idle-rpg-close]");if(outerClose)outerClose.click();else overlay.hidden=true;return true;}
  if(action.dataset.wmhAction==="test-isometric"){
    stopNpcWander(dialog);
    overlay.dataset.level="test";
    dialog.innerHTML=panelMarkup("test",regionId,"Isometric Render Test");
    bindIsoAreaEditor(dialog);bindIsometricCamera(dialog);bindIsometricMapArt(dialog);bindIsometricHud(dialog);startNpcWander(dialog);
    return true;
  }
  if(action.dataset.wmhAction==="academy-home"){
    if(current==="local"){
      dialog.querySelector<HTMLButtonElement>("[data-wmh-iso-center]")?.click();
      return true;
    }
    stopNpcWander(dialog);
    overlay.dataset.region="golden-dragon-empire";
    overlay.dataset.level="local";
    overlay.dataset.building="Tianhai Academy";
    dialog.innerHTML=panelMarkup("local","golden-dragon-empire","Tianhai Academy");
    bindIsoAreaEditor(dialog);
    bindIsometricCamera(dialog);
    bindIsometricMapArt(dialog);
    bindIsometricHud(dialog);
    startNpcWander(dialog);
    return true;
  }
  if(action.dataset.wmhAction==="back"){
    const next:Level=current==="interior"?"local":current==="local"?"regional":"world";
    stopNpcWander(dialog);overlay.dataset.level=next;dialog.innerHTML=panelMarkup(next,regionId,building);if(next==="world")bindWorldMapZoom(dialog);if(next==="regional")bindIsometricMapArt(dialog);if(next==="local"){bindIsoAreaEditor(dialog);bindIsometricCamera(dialog);bindIsometricMapArt(dialog);bindIsometricHud(dialog);startNpcWander(dialog);}return true;
  }
  if(action.dataset.wmhAction==="chat-close"){
    const chat=dialog.querySelector<HTMLElement>("[data-wmh-chat]");
    if(chat){chat.hidden=true;chat.removeAttribute("aria-modal");}
    if(current==="local")startNpcWander(dialog);
    return true;
  }
  if(action.dataset.wmhInfo){
    const info=readWorldMarkers().find(item=>item.id===action.dataset.wmhInfo);if(!info)return true;
    const host=dialog.querySelector<HTMLElement>("[data-wmh-selection-host]");if(!host)return true;
    host.innerHTML=selectionMarkup(info);
    const card=host.querySelector<HTMLElement>("[data-wmh-selection-card]");if(card)animateExpeditionPanel(card);
    const art=host.querySelector<HTMLElement>(".wmh-selection-scene-image");
    if(art&&!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)art.animate([{transform:"scale(1.045)",filter:"brightness(.78)"},{transform:"scale(1)",filter:"brightness(1)"}],{duration:760,easing:"cubic-bezier(.2,.75,.25,1)"});
    return true;
  }
  if(action.hasAttribute("data-wmh-dismiss-layer")||action.dataset.wmhAction==="selection-no"){dialog.querySelector("[data-wmh-selection-host]")?.replaceChildren();return true;}
  if(action.dataset.wmhAction==="selection-yes"){
    const id=action.dataset.markerId as WorldMarkerId;const info=readWorldMarkers().find(item=>item.id===id);if(!info)return true;
    if(["golden-dragon-empire","tianhai-yunzhou","beiming-gu"].includes(id)){overlay.dataset.region=id;overlay.dataset.level="regional";dialog.innerHTML=panelMarkup("regional",id as RegionId);}
    else {overlay.dataset.region="golden-dragon-empire";overlay.dataset.level="regional";dialog.innerHTML=panelMarkup("regional","golden-dragon-empire",info.name,info);}
    bindIsometricMapArt(dialog);
    return true;
  }
  if(action.dataset.wmhSite){
    overlay.dataset.level="local";overlay.dataset.building=action.dataset.wmhSite;
    dialog.innerHTML=panelMarkup("local",regionId,action.dataset.wmhSite);bindIsoAreaEditor(dialog);bindIsometricCamera(dialog);bindIsometricMapArt(dialog);bindIsometricHud(dialog);startNpcWander(dialog);return true;
  }
  if(action.dataset.wmhBuilding && current==="local"){
    stopNpcWander(dialog);
    overlay.dataset.level="interior";overlay.dataset.building=action.dataset.wmhBuilding;
    dialog.innerHTML=panelMarkup("interior",regionId,action.dataset.wmhBuilding);bindIsoAreaEditor(dialog);bindIsometricCamera(dialog);bindIsometricMapArt(dialog);bindIsometricHud(dialog);return true;
  }
  if(action.hasAttribute("data-wmh-tile")){
    if(dialog.querySelector<HTMLElement>("[data-wmh-board]")?.classList.contains("wmh-overlay-editing"))return true;
    walkToTile(dialog,Number(action.dataset.x),Number(action.dataset.y),action.dataset.surface||"earth");return true;
  }
  if(action.dataset.wmhNpc){
    const npcId=action.dataset.wmhNpc;
    const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
    const player=board?.querySelector<HTMLElement>("[data-wmh-player-token]");
    const px=Number(player?.dataset.x||5),py=Number(player?.dataset.y||8);
    const nx=Number(action.dataset.x||0),ny=Number(action.dataset.y||0);
    const distance=Math.abs(px-nx)+Math.abs(py-ny);
    if(distance<1){dialog.insertAdjacentHTML("beforeend",'<div class="wmh-toast">Stand at least one tile away to interact.</div>');return true;}
    renderChat(dialog,npcId);return true;
  }
  if(action.dataset.wmhReply!==undefined){
    const npcId=action.dataset.npcId||"",npc=npcData[npcId],index=Number(action.dataset.wmhReply);
    const thread=dialog.querySelector<HTMLElement>("[data-wmh-thread]");
    const replies=dialog.querySelector<HTMLElement>("[data-wmh-replies]");
    if(!npc||!thread||!replies)return true;
    const choice=npc.choices[index]||"";
    const reply=npc.replies[index]||"The character gives a small nod.";
    thread.insertAdjacentHTML("beforeend",'<article class="wmh-chat-message player-message"><div class="wmh-chat-copy"><b>YOU</b><p>'+choice+'</p></div><div class="wmh-chat-bust player"><i></i></div></article><article class="wmh-chat-message npc-message"><div class="wmh-chat-bust '+npc.gender+'"><i></i></div><div class="wmh-chat-copy"><b>'+npc.name+'</b><p>'+reply+'</p></div></article>');
    replies.innerHTML=npc.choices.map((c,i)=>'<button type="button" data-wmh-reply="'+i+'" data-npc-id="'+npcId+'">'+c+'</button>').join("");
    return true;
  }
  if(action.dataset.wmhAction==="exit-local"){onAdvanceTime(180);overlay.dataset.level="regional";dialog.innerHTML=panelMarkup("regional",regionId);return true;}
  if(action.dataset.wmhPlot){dialog.insertAdjacentHTML("beforeend",'<div class="wmh-toast">'+action.dataset.wmhPlot+' · function details coming soon</div>');return true;}
  return false;
}
