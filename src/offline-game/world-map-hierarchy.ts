import "./world-map-hierarchy.css";
import { playFootstep } from "../audio/sound-effects";
import { animateExpeditionPanel } from "./expedition-animations";

type Level = "world" | "regional" | "local" | "interior" | "home" | "map-editor";
type RegionId = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
const regionData: Record<RegionId, { name: string; subtitle: string; image: string; sites: string[] }> = {
  "golden-dragon-empire": {
    name: "Golden Dragon Empire", subtitle: "EASTERN POWER · IMPERIAL TERRITORIES",
    image: "/game/scenery/golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png",
    sites: ["Imperial Capital", "Tianhai Academy", "Imperial Market", "Eastern Port", "Public Pavilion", "Sparring Arena"]
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
function bindWorldMapZoom(dialog: HTMLElement): void {
  const viewport = dialog.querySelector<HTMLElement>("[data-wmh-map-viewport]");
  const surface = dialog.querySelector<HTMLElement>("[data-wmh-map-surface]");
  const image = surface?.querySelector<HTMLImageElement>("img");
  if (!viewport || !surface || !image || viewport.dataset.gesturesBound === "true") return;
  viewport.dataset.gesturesBound = "true";
  let zoom = 1;
  let baseWidth = 0;
  let baseHeight = 0;
  const pointers = new Map<number, { x: number; y: number }>();
  let panStart: { x: number; y: number; scrollLeft: number; scrollTop: number } | null = null;
  let pinchStart: { distance: number; zoom: number } | null = null;
  const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint = (a: {x:number;y:number}, b: {x:number;y:number}) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const sizeBaseMap = () => {
    const rect = viewport.getBoundingClientRect();
    const ratio = image.naturalWidth > 0 && image.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : 1;
    // Cover the complete viewport at minimum zoom: no map edge or empty canvas
    // is exposed. The larger dimension remains pannable inside the viewport.
    baseWidth = Math.max(rect.width, rect.height * ratio);
    baseHeight = Math.max(rect.height, rect.width / ratio);
    surface.style.width = baseWidth + "px";
    surface.style.height = baseHeight + "px";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "fill";
  };
  const applyZoom = (next: number, focusX?: number, focusY?: number) => {
    if (!baseWidth || !baseHeight) sizeBaseMap();
    const previous = zoom;
    zoom = Math.max(1, Math.min(2.5, next));
    const localX = focusX == null ? viewport.clientWidth / 2 : focusX - viewport.getBoundingClientRect().left;
    const localY = focusY == null ? viewport.clientHeight / 2 : focusY - viewport.getBoundingClientRect().top;
    const anchoredX = viewport.scrollLeft + localX;
    const anchoredY = viewport.scrollTop + localY;
    surface.style.width = (baseWidth * zoom) + "px";
    surface.style.height = (baseHeight * zoom) + "px";
    viewport.scrollLeft = anchoredX * zoom / previous - localX;
    viewport.scrollTop = anchoredY * zoom / previous - localY;
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = Math.round(zoom * 100) + "%";
  };
  const centerMap = () => {
    sizeBaseMap();
    zoom = 1;
    surface.style.width = baseWidth + "px";
    surface.style.height = baseHeight + "px";
    viewport.scrollLeft = Math.max(0, (baseWidth - viewport.clientWidth) / 2);
    viewport.scrollTop = Math.max(0, (baseHeight - viewport.clientHeight) / 2);
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = "100%";
  };
  // World-map markers are fixed map anchors: their pointer gestures must never
  // enter the viewport pan/pinch tracker. Keep click bubbling for the preview handler.
  viewport.querySelectorAll<HTMLElement>(".wmh-power:not(.wmh-editor-marker)").forEach(marker => {
    for (const type of ["pointerdown", "pointermove", "pointerup", "pointercancel"]) {
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

function tileMapMarkup(interior = false): string {
  const cols = 12, rows = 10;
  const features: Record<string,string> = interior
    ? {"2-1":"blackboard","5-1":"teacher-desk","3-3":"desk","5-3":"desk","7-3":"desk","3-5":"desk","5-5":"desk","7-5":"desk","10-8":"door"}
    : {"5-1":"pond","6-1":"pond","7-1":"pond","8-1":"pond","1-2":"tree","2-2":"tree","10-2":"tree","1-3":"flower","3-3":"flower","9-3":"flower","11-3":"tree","2-5":"garden","3-5":"garden","8-5":"garden","9-5":"garden","4-7":"gate","5-7":"gate","6-7":"gate","7-7":"gate","2-8":"bench","9-8":"bench","3-2":"study-hall","9-4":"teachers-house","5-6":"learning-building"};
  const tiles = Array.from({length: rows}, (_,y) => Array.from({length:cols},(_,x) => {
    const key=x+"-"+y, feature=features[key] || "";
    const surface = interior ? (y<2?"wood":"tile") : (feature==="pond"?"wet":feature==="gate"?"stone":feature==="tree"||feature==="flower"||feature==="garden"?"earth":y>7?"stone":"earth");
    const label = feature==="pond"?"POND":feature==="tree"?"TREE":feature==="flower"?"FLOWER":feature==="garden"?"GARDEN":feature==="gate"?"ACADEMY GATE":feature==="bench"?"BENCH":feature==="blackboard"?"BOARD":feature==="teacher-desk"?"TEACHER":feature==="desk"?"DESK":feature==="door"?"DOOR":feature==="study-hall"?"STUDY HALL":feature==="teachers-house"?"TEACHERS’ HALL":feature==="learning-building"?"LEARNING HALL":"";
    const building=feature==="study-hall"?"Study Hall":feature==="teachers-house"?"Teachers’ Hall":feature==="learning-building"?"Learning Hall":"";
    return '<button type="button" class="wmh-tile wmh-tile-'+surface+' '+(feature?'has-feature feature-'+feature:'')+'" data-wmh-tile data-x="'+x+'" data-y="'+y+'" data-z="0" data-tile-id="tile-'+x+'-'+y+'" data-surface="'+surface+'" style="--tile-x:'+x+';--tile-y:'+y+'" '+(building?'data-wmh-building="'+building+'"':'')+' aria-label="Tile X '+x+', Y '+y+', Z 0 · '+(label||surface)+'"><span class="wmh-tile-coord">('+x+','+y+',0)</span>'+(label?'<b>'+label+'</b>':'')+'</button>';
  }).join("")).join("");
  return '<div class="wmh-iso-controls"><button type="button" data-wmh-iso-zoom="out" aria-label="Zoom out">−</button><span data-wmh-iso-level>100%</span><button type="button" data-wmh-iso-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-iso-zoom="reset">RESET</button><small>DRAG TO PAN · PINCH TO ZOOM</small></div><div class="wmh-isometric-wrap" data-wmh-iso-viewport><div class="wmh-isometric-camera" data-wmh-iso-camera><div class="wmh-isometric-board '+(interior?'is-interior':'is-exterior')+'" data-wmh-board style="--tile-cols:'+cols+';--tile-rows:'+rows+';--tile-w:64px;--tile-h:32px;--slab-depth:7px">'+tiles+
    '<button type="button" class="wmh-character-token wmh-player-token" data-wmh-player-token data-x="5" data-y="8" style="--token-x:5;--token-y:8" aria-label="Player character"><i></i></button>'+
    (interior ? '<button type="button" class="wmh-character-token wmh-npc-token is-male" data-wmh-npc="teacher" data-x="6" data-y="2" style="--token-x:6;--token-y:2" aria-label="Teacher"><i></i></button><button type="button" class="wmh-character-token wmh-npc-token is-female" data-wmh-npc="student-lin" data-x="3" data-y="4" style="--token-x:3;--token-y:4" aria-label="Student Lin"><i></i></button>' :
      '<button type="button" class="wmh-character-token wmh-npc-token is-female" data-wmh-npc="student-lin" data-x="5" data-y="3" style="--token-x:5;--token-y:3" aria-label="Student Lin"><i></i></button>'+
      '<button type="button" class="wmh-character-token wmh-npc-token is-male" data-wmh-npc="student-wei" data-x="9" data-y="5" style="--token-x:9;--token-y:5" aria-label="Student Wei"><i></i></button>'+
      '<button type="button" class="wmh-character-token wmh-npc-token is-female" data-wmh-npc="teacher-mei" data-x="2" data-y="6" style="--token-x:2;--token-y:6" aria-label="Instructor Mei"><i></i></button>'+
      '<button type="button" class="wmh-character-token wmh-npc-token is-male" data-wmh-npc="groundskeeper" data-x="10" data-y="2" style="--token-x:10;--token-y:2" aria-label="Groundskeeper"><i></i></button>')+
    '</div></div></div>';
}
function bindIsometricCamera(dialog:HTMLElement):void {
  const viewport=dialog.querySelector<HTMLElement>("[data-wmh-iso-viewport]");
  const camera=dialog.querySelector<HTMLElement>("[data-wmh-iso-camera]");
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(!viewport||!camera||!board||viewport.dataset.cameraBound==="true")return;
  viewport.dataset.cameraBound="true";
  let zoom=1;
  const baseW=704,baseH=368;
  const apply=(next:number,focusX?:number,focusY?:number)=>{
    const old=zoom;zoom=Math.max(.65,Math.min(2.4,next));
    const rect=viewport.getBoundingClientRect();
    const fx=focusX==null?viewport.clientWidth/2:focusX-rect.left;
    const fy=focusY==null?viewport.clientHeight/2:focusY-rect.top;
    const ax=viewport.scrollLeft+fx,ay=viewport.scrollTop+fy;
    camera.style.width=(baseW*zoom)+"px";camera.style.height=(baseH*zoom)+"px";
    board.style.transform="scale("+zoom+")";board.style.transformOrigin="top left";
    viewport.scrollLeft=ax*zoom/old-fx;viewport.scrollTop=ay*zoom/old-fy;
    const label=dialog.querySelector<HTMLElement>("[data-wmh-iso-level]");
    if(label)label.textContent=Math.round(zoom*100)+"%";
  };
  dialog.querySelectorAll<HTMLElement>("[data-wmh-iso-zoom]").forEach(button=>button.addEventListener("click",()=>{
    const a=button.dataset.wmhIsoZoom;apply(a==="reset"?1:zoom+(a==="in"?.2:-.2));
    if(button.dataset.wmhIsoZoom==="reset"){viewport.scrollLeft=0;viewport.scrollTop=0;}
  }));
  const pts=new Map<number,{x:number;y:number}>();let pinch:{distance:number;zoom:number}|null=null;
  const dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
  viewport.addEventListener("pointerdown",e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2){const p=[...pts.values()];pinch={distance:Math.max(1,dist(p[0],p[1])),zoom};}});
  viewport.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pts.size===2&&pinch){const p=[...pts.values()];apply(pinch.zoom*dist(p[0],p[1])/pinch.distance,(p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2);e.preventDefault();}});
  const end=(e:PointerEvent)=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;};
  viewport.addEventListener("pointerup",end);viewport.addEventListener("pointercancel",end);
}
function panelMarkup(level: Level, regionId: RegionId = "golden-dragon-empire", selectedBuilding = "Tianhai Academy", selectedArea?: WorldMarker): string {
  const region = regionData[regionId];
  const header = (kind: string, title: string, subtitle: string) =>
    '<header class="wmh-level-header"><div><span class="wmh-level-tag">'+kind+'</span><h3>'+title+'</h3><p>'+subtitle+'</p></div><button type="button" class="wmh-close" data-wmh-action="close" aria-label="Close map">×</button></header>';
  if (level === "world") return header("WORLD MAP","Merzkava Universe","THREE GREAT POWERS · EXTERNAL TERRITORIES · SEAS")+
    '<div class="wmh-map-zoom"><button type="button" data-wmh-zoom="out">−</button><span data-wmh-zoom-level>100%</span><button type="button" data-wmh-zoom="in">+</button><button type="button" data-wmh-zoom="reset">RESET</button></div>'+
    '<div class="wmh-world-map" data-wmh-map-viewport><div class="wmh-world-map-image" data-wmh-map-surface><img src="/world/Untitled77_20261029054536.png" alt="Merzkava Universe world map"/>'+readWorldMarkers().map(marker=>worldMapMarkerMarkup(marker)).join("")+'</div><div data-wmh-selection-host></div></div>'+
    '<div class="wmh-bottom-actions"><span>SELECT A POWER TO OPEN ITS REGIONAL MAP</span><button data-wmh-action="editor-open">⊞ MAP EDITOR</button></div>';
  if (level === "map-editor") return header("WORLD MAP TOOLS","Map Editor","FLAT WORLD MAP · NORMALIZED COORDINATES")+mapEditorMarkup();
  if (level === "regional") return header("REGIONAL MAP",selectedArea?.name||region.name,selectedArea?.subtitle||region.subtitle)+
    '<div class="wmh-regional-placeholder"><div class="wmh-regional-land"><span class="wmh-regional-river"></span><span class="wmh-regional-road road-one"></span><span class="wmh-regional-road road-two"></span><span class="wmh-regional-road road-three"></span><span class="wmh-regional-label">'+(selectedArea?selectedArea.name.toUpperCase():"REGIONAL MAP ART · PLACEHOLDER")+'</span>'+
    (selectedArea?["Central District","Local Settlement","Market Quarter","Public Grounds","Transport Gate","Nearby Landmark"]:region.sites).map((site,i)=>'<button type="button" class="wmh-regional-site site-'+i+'" data-wmh-site="'+site+'" data-wmh-region-id="'+regionId+'"><i>'+["♜","⌘","▤","⚓","⌑","⚔"][i%6]+'</i><b>'+site+'</b></button>').join("")+'</div></div>'+
    '<div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>SELECT A PLACE · LOCAL MAPS OPEN HERE</span></div>';
  if (level === "local") return header("EXTERIOR AREA",selectedBuilding, "PLACEHOLDER MAP · TAP A TILE TO WALK · NPCs TO CHAT")+
    '<div class="wmh-area-legend"><span>ACADEMY GATE</span><span>GARDEN & POND</span><span>CLASSROOMS</span><span>TEACHERS’ COURT</span></div>'+
    tileMapMarkup(false)+
    '<div class="wmh-local-footer"><span>PLAYER TOKEN · TAP WALKABLE TILES · NPC INTERACTION REQUIRES 1-TILE DISTANCE</span><button data-wmh-action="back">← REGIONAL MAP</button></div>'+
    '<section class="wmh-chat-panel" data-wmh-chat hidden><div class="wmh-chat-thread" data-wmh-thread></div><div class="wmh-chat-input-row"><span>YOUR RESPONSE</span><div data-wmh-replies></div></div></section>';
  if (level === "interior") return header("BUILDING INTERIOR",selectedBuilding,"ISOMETRIC TILE PLACEHOLDER · TAP TO EXPLORE")+
    tileMapMarkup(true)+'<div class="wmh-local-footer"><span>INTERIOR FLOOR PLAN · PLACEHOLDER</span><button data-wmh-action="back">← EXTERIOR AREA</button></div>'+
    '<section class="wmh-chat-panel" data-wmh-chat hidden><div class="wmh-chat-thread" data-wmh-thread></div><div class="wmh-chat-input-row"><span>YOUR RESPONSE</span><div data-wmh-replies></div></div></section>';
  return header("PERSONAL GROUNDS","Personal Grounds","ISOMETRIC HOME · PLOTS & FACILITIES")+
    '<div class="wmh-home-grid">'+[["Farmland","▧"],["Building Plot","⌂"],["Training Area","⚔"],["Warehouse","▤"],["Fish Pond","◉"],["Lumber Area","♧"]].map(([name,icon])=>'<button data-wmh-plot="'+name+'"><span>'+icon+'</span><b>'+name+'</b><small>VIEW FUNCTION</small></button>').join("")+'</div><div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>PERSONAL DEVELOPMENT AREA</span></div>';
}
export function renderWorldMapHierarchy(): string {
  return '<section class="wmh-overlay" data-world-map-hierarchy aria-label="Map Navigation"><div class="wmh-dialog" data-wmh-dialog>'+panelMarkup("world")+'</div></section>';
}
export function initializeWorldMapHierarchy(root: HTMLElement): void {
  const overlay=root.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog=overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if(overlay&&dialog&&!overlay.hidden)bindWorldMapZoom(dialog);
}
const npcData: Record<string,{name:string;gender:string;greeting:string;choices:string[];replies:string[]}> = {
  "student-lin":{name:"Lin Yue",gender:"female",greeting:"The academy garden is peaceful this early. I come here whenever the study halls get too noisy.",choices:["Ask about the academy","Ask about the pond","Wish her a good day"],replies:["The instructors rotate lessons between the eastern and western study halls.","The pond is fed by a spring beneath the old cedar. The fish are surprisingly tame.","You too! May your studies go smoothly."]},
  "student-wei":{name:"Shen Wei",gender:"male",greeting:"I was told to practice footwork, but the groundskeeper keeps sending me to carry things. Hah.",choices:["Ask about training","Offer to help","End conversation"],replies:["The sparring court is beyond the southern gate. Keep your stance low.","Really? Thanks. Those planters are heavier than they look.","See you around."]},
  "teacher-mei":{name:"Instructor Mei",gender:"female",greeting:"A student should learn to observe before acting. Even a quiet garden has much to teach.",choices:["Ask about today's lessons","Ask for advice","Take your leave"],replies:["Foundational theory is being taught in the eastern classroom today.","Watch the flow of Spirit Qi, but do not force it. Patience is part of discipline.","Return when you have a question worth asking."]},
  "groundskeeper":{name:"Uncle Qiao",gender:"male",greeting:"Mind the wet stones around the pond, young one. The moss makes them slippery after watering.",choices:["Ask about the garden","Ask about the pond","Thank him"],replies:["The flowering shrubs were planted by the first academy groundskeeper.","The pond is shallow near the bridge, but deep beside the willow.","Take care where you step."]},
  "teacher":{name:"Instructor",gender:"male",greeting:"Settle down. The lesson will begin shortly.",choices:["Ask about the lesson","Ask for guidance"],replies:["Today we review the foundations.","Observe carefully and ask when you are ready."]}
};
function animateGridMove(token:HTMLElement,update:()=>void):void {
  const before=token.getBoundingClientRect();
  update();
  const after=token.getBoundingClientRect();
  const dx=before.left-after.left,dy=before.top-after.top;
  token.animate([
    {transform:"translate("+dx+"px,"+dy+"px) translateY(-6px)"},
    {transform:"translateY(-6px)"}
  ],{duration:125,easing:"ease-out"});
}
function stopNpcWander(dialog:HTMLElement):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const timer=Number(board?.dataset.npcTimer||0);
  if(timer)window.clearInterval(timer);
}
function startNpcWander(dialog:HTMLElement):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  if(!board)return;
  stopNpcWander(dialog);
  const timer=window.setInterval(()=>{
    const player=board.querySelector<HTMLElement>("[data-wmh-player-token]");
    board.querySelectorAll<HTMLElement>("[data-wmh-npc]").forEach(npc=>{
      if(Math.random()>.48)return;
      const x=Number(npc.dataset.x||0),y=Number(npc.dataset.y||0);
      const options=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([nx,ny])=>
        nx>=0&&nx<12&&ny>=0&&ny<10&&
        !(Number(player?.dataset.x||5)===nx&&Number(player?.dataset.y||8)===ny)
      );
      if(!options.length)return;
      const [nx,ny]=options[Math.floor(Math.random()*options.length)];
      npc.dataset.x=String(nx);npc.dataset.y=String(ny);
      animateGridMove(npc,()=>{npc.style.setProperty("--token-x",String(nx));npc.style.setProperty("--token-y",String(ny));});
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
  chat.hidden=false;
  thread.innerHTML='<article class="wmh-chat-message npc-message"><div class="wmh-chat-bust '+npc.gender+'"><i></i></div><div class="wmh-chat-copy"><b>'+npc.name+'</b><p>'+npc.greeting+'</p></div></article>';
  replies.innerHTML=npc.choices.map((choice,i)=>'<button type="button" data-wmh-reply="'+i+'" data-npc-id="'+npcId+'">'+choice+'</button>').join("");
}
function walkToTile(dialog:HTMLElement,targetX:number,targetY:number,surface:string):void {
  const board=dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const player=board?.querySelector<HTMLElement>("[data-wmh-player-token]");
  if(!board||!player)return;
  const cols=12,rows=10;
  if(!Number.isInteger(targetX)||!Number.isInteger(targetY)||targetX<0||targetX>=cols||targetY<0||targetY>=rows)return;
  const destination=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+targetX+'"][data-y="'+targetY+'"]');
  if(!destination)return;
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
      if(nx<0||nx>=cols||ny<0||ny>=rows||previous.has(key))continue;
      previous.set(key,x+","+y);queue.push([nx,ny]);
    }
  }
  const targetKey=targetX+","+targetY;
  if(!previous.has(targetKey))return;
  const path:Array<[number,number]>=[];
  let cursor:string|null=targetKey;
  while(cursor){
    const [x,y]=cursor.split(",").map(Number);
    path.unshift([x,y]);cursor=previous.get(cursor)||null;
  }
  path.shift();
  let step=0;
  const move=()=>{
    if(step>=path.length){delete player.dataset.moveTimer;return;}
    const [x,y]=path[step++];
    const tile=board.querySelector<HTMLElement>('[data-wmh-tile][data-x="'+x+'"][data-y="'+y+'"]');
    animateGridMove(player,()=>{
      player.style.setProperty("--token-x",String(x));
      player.style.setProperty("--token-y",String(y));
    });
    player.dataset.x=String(x);player.dataset.y=String(y);
    const material=tile?.dataset.surface||surface;
    playFootstep(material as "earth"|"wet"|"stone"|"wood"|"tile");
    player.dataset.moveTimer=String(window.setTimeout(move,145));
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
  if(action.dataset.wmhAction==="back"){
    const next:Level=current==="interior"?"local":current==="local"?"regional":"world";
    stopNpcWander(dialog);overlay.dataset.level=next;dialog.innerHTML=panelMarkup(next,regionId,building);if(next==="world")bindWorldMapZoom(dialog);if(next==="local"){bindIsometricCamera(dialog);startNpcWander(dialog);}return true;
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
    return true;
  }
  if(action.dataset.wmhSite){
    overlay.dataset.level="local";overlay.dataset.building=action.dataset.wmhSite;
    dialog.innerHTML=panelMarkup("local",regionId,action.dataset.wmhSite);bindIsometricCamera(dialog);startNpcWander(dialog);return true;
  }
  if(action.dataset.wmhBuilding && current==="local"){
    stopNpcWander(dialog);
    overlay.dataset.level="interior";overlay.dataset.building=action.dataset.wmhBuilding;
    dialog.innerHTML=panelMarkup("interior",regionId,action.dataset.wmhBuilding);bindIsometricCamera(dialog);return true;
  }
  if(action.hasAttribute("data-wmh-tile")){
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
