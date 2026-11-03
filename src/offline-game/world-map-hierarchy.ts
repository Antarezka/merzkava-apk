import "./world-map-hierarchy.css";

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
  | "guixu-canghai" | "lanternhook-isles";
type WorldMarker = {
  id: WorldMarkerId; name: string; x: number; y: number;
  category: WorldMarkerCategory; subtitle: string; description: string;
  placementStatus: "provisional" | "owner-set";
};
// v3 preserves the three owner-supplied power coordinates and adds the remaining
// canonical geography. New locations have explicitly provisional map placements
// until the owner adjusts them in the editor.
const WORLD_MAP_COORDINATES_KEY = "merzkava.world-map.coordinates.v3";
const defaultWorldMarkers: WorldMarker[] = [
  { id: "golden-dragon-empire", name: "Golden Dragon Empire", x: 78.6, y: 34, category: "power", subtitle: "EASTERN POWER", description: "The eastern imperial power. Its seven internal regions remain part of the Empire, not separate world powers.", placementStatus: "owner-set" },
  { id: "tianhai-yunzhou", name: "Tianhai Yunzhou", x: 19.4, y: 38.4, category: "power", subtitle: "SOUTHWESTERN FLOATING POWER", description: "The maritime power centered on a giant floating island above Yunmeng Sea.", placementStatus: "owner-set" },
  { id: "beiming-gu", name: "Beiming Gu", x: 45.2, y: 7.8, category: "power", subtitle: "NORTHERN POWER", description: "The northern power protected by mountain ranges and severe cold.", placementStatus: "owner-set" },
  { id: "lawless-territories", name: "Lawless Territories", x: 18, y: 72, category: "territory", subtitle: "EXTERNAL MACRO-REGION · PROVISIONAL PLACEMENT", description: "A broad collection of communities and territories outside the direct jurisdiction of the three powers. It is not one unified country and includes Ashen Borderlands, Black Tide Expanse, and Nine Frost Wastes.", placementStatus: "provisional" },
  { id: "ashen-borderlands", name: "Ashen Borderlands", x: 12, y: 65, category: "territory", subtitle: "WESTERN / SOUTHWESTERN LAWLESS TERRITORY", description: "Outside the western and southwestern borders of Golden Dragon Empire. Known settlements include Greyrock Village, Blackreed Village, Broken Bell Village, and Dust Lantern Village.", placementStatus: "provisional" },
  { id: "black-tide-expanse", name: "Black Tide Expanse", x: 43, y: 80, category: "territory", subtitle: "LAWLESS MARITIME ARCHIPELAGO", description: "Remote islands and sea routes outside Tianhai Yunzhou's direct control. Known settlements include Saltwind Village, Driftwood Haven, Mistbell Village, and Redwake Village. Distinct from Black Tide Sea and Guixu Canghai.", placementStatus: "provisional" },
  { id: "nine-frost-wastes", name: "Nine Frost Wastes", x: 54, y: 17, category: "territory", subtitle: "NORTHERN WILDS OUTSIDE BEIMING DEFENSES", description: "Northern wild areas outside Beiming Gu's official defenses, with snowfields, frozen valleys, conifer forests, and difficult mountains.", placementStatus: "provisional" },
  { id: "wanluo-sacred-expanse", name: "Wanluo Sacred Expanse", x: 72, y: 70, category: "territory", subtitle: "SACRED REGION · POSITION UNCONFIRMED", description: "A broad green plain surrounded by ancient forests and mountains, centered on the World Knowledge Tower. Its sovereignty and position relative to the three powers remain unestablished.", placementStatus: "provisional" },
  { id: "azerion-forest", name: "Azerion Forest", x: 48, y: 47, category: "forest", subtitle: "VAST CROSS-REGION FOREST", description: "A major Spirit Beast habitat extending from Lawless Territories into Golden Dragon Empire territory. Its easiest known entrance is on the Lawless side.", placementStatus: "provisional" },
  { id: "dead-zone", name: "Dead Zone", x: 48, y: 49, category: "landmark", subtitle: "RESTRICTED CORE OF AZERION FOREST", description: "The deepest inner/core zone of Azerion Forest. It is not a separate forest or a synonym for the whole forest.", placementStatus: "provisional" },
  { id: "inner-azerion", name: "Inner Azerion", x: 51, y: 47, category: "landmark", subtitle: "HIDDEN HALF-BEAST CITY", description: "A concealed city in the northern part of Azerion Forest, hidden by extremely dense illusion fog. Safe routes are known only to veteran forest-goers and local hunter tribes.", placementStatus: "provisional" },
  { id: "mega-colossal-labyrinth", name: "Mega Colossal Labyrinth", x: 48, y: 53, category: "landmark", subtitle: "ANCIENT UNDERGROUND RUINS", description: "Reached through ruins beneath Azerion Forest's central lake and connected to an exit on the northern deep-sea coast. Its interior has no complete surveyed map.", placementStatus: "provisional" },
  { id: "high-cloud-sea-mountains", name: "High Cloud-Sea Mountains", x: 82, y: 13, category: "mountains", subtitle: "UNNAMED REMOTE MOUNTAIN REGION · PROVISIONAL", description: "Remote high peaks rising above the sea of clouds. Two distinct hidden traditions are associated with this remote mountain setting; exact names, coordinates, and routes are not established.", placementStatus: "provisional" },
  { id: "silverpine-wilds", name: "Silverpine Wilds", x: 64, y: 24, category: "forest", subtitle: "BEIMING GU · PINE FOREST WILDERNESS", description: "A northern district of Beiming Gu known for pine forests, Spirit Beast habitat, herbs, and hunting. This is an internal Beiming region, not an independent world power.", placementStatus: "provisional" },
  { id: "frostmirror-sea", name: "Frostmirror Sea", x: 26, y: 10, category: "sea", subtitle: "NORTHERN COASTAL SEA", description: "The northern coastal waters of Beiming Gu, connected around the northeastern maritime margin to Eastern Azure Sea.", placementStatus: "provisional" },
  { id: "eastern-azure-sea", name: "Eastern Azure Sea", x: 92, y: 42, category: "sea", subtitle: "EASTERN COASTAL SEA", description: "The eastern maritime belt of Golden Dragon Empire, with the established eastern shipping lane and coastal ports.", placementStatus: "provisional" },
  { id: "yunmeng-sea", name: "Yunmeng Sea", x: 22, y: 61, category: "sea", subtitle: "SOUTHWESTERN HOME WATERS", description: "The ocean beneath and around Tianhai Yunzhou's floating island. Its eastern passage connects to Eastern Azure Sea; its western/southern approach faces Lawless Territories.", placementStatus: "provisional" },
  { id: "wufeng-sea", name: "Wufeng Sea", x: 67, y: 57, category: "sea", subtitle: "THE WINDLESS SEA", description: "A still-water basin with no wind, waves, or currents anywhere within its boundaries. Lantern Passage connects it to Yunmeng Sea; Three-Lantern Passage links toward Eastern Azure Sea.", placementStatus: "provisional" },
  { id: "black-tide-sea", name: "Black Tide Sea", x: 48, y: 88, category: "sea", subtitle: "ORDINARY SOUTHERN SEA", description: "Ordinary open water south of Lawless Territories and around Black Tide Expanse. It separates the Lawless maritime region from Guixu Canghai.", placementStatus: "provisional" },
  { id: "guixu-canghai", name: "Guixu Canghai", x: 56, y: 96, category: "sea", subtitle: "FAR-SOUTHERN POLAR OCEAN", description: "The world's farthest-southern, frigid, most dangerous ocean system, beyond the southern outer boundary of ordinary Black Tide Sea.", placementStatus: "provisional" },
  { id: "lanternhook-isles", name: "Lanternhook Isles", x: 32, y: 83, category: "landmark", subtitle: "ARCHIPELAGO IN ORDINARY BLACK TIDE SEA", description: "A small archipelago with Red Lantern Cay (entertainment), Bitterglass Isle (specialist physicians and medicinal trade), and Dicewake Isle (gambling and wagers).", placementStatus: "provisional" }
];
function readWorldMarkers(): WorldMarker[] {
  try {
    const saved = JSON.parse(localStorage.getItem(WORLD_MAP_COORDINATES_KEY) || localStorage.getItem("merzkava.world-map.coordinates.v2") || "null");
    if (Array.isArray(saved)) {
      return defaultWorldMarkers.map(item => {
        const entry = saved.find((value: any) => value?.id === item.id);
        return entry && Number.isFinite(Number(entry.x)) && Number.isFinite(Number(entry.y))
          ? { ...item, x: Math.max(0, Math.min(100, Number(entry.x))), y: Math.max(0, Math.min(100, Number(entry.y))), placementStatus: entry.placementStatus === "owner-set" ? "owner-set" : item.placementStatus }
          : { ...item };
      });
    }
  } catch { /* use built-in positions when storage is unavailable or invalid */ }
  return defaultWorldMarkers.map(item => ({ ...item }));
}
function worldMapMarkerMarkup(marker: WorldMarker, editor = false): string {
  const number = String(defaultWorldMarkers.findIndex(item => item.id === marker.id) + 1).padStart(2, "0");
  const provisional = marker.placementStatus === "provisional" ? ' title="Provisional placement — adjust in Map Editor"' : "";
  const powerClass = marker.id === "golden-dragon-empire" ? " wmh-power-gde" : marker.id === "tianhai-yunzhou" ? " wmh-power-ty" : marker.id === "beiming-gu" ? " wmh-power-bg" : "";
  return '<button class="wmh-power wmh-marker-' + marker.category + powerClass + (editor ? ' wmh-editor-marker' : '') +
    '" style="left:' + marker.x + '%;top:' + marker.y + '%" ' +
    (editor ? 'type="button" data-wmh-drag-marker="' + marker.id + '" aria-label="Drag ' + marker.name + '"' : 'data-wmh-info="' + marker.id + '"') +
    provisional + '><b>' + number + '</b><span>' + marker.name + '</span></button>';
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
  if (!viewport || !surface || viewport.dataset.gesturesBound === "true") return;
  viewport.dataset.gesturesBound = "true";
  let zoom = 1;
  const pointers = new Map<number, { x: number; y: number }>();
  let panStart: { x: number; y: number; scrollLeft: number; scrollTop: number } | null = null;
  let pinchStart: { distance: number; zoom: number; centerX: number; centerY: number } | null = null;
  const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x,a.y-b.y);
  const midpoint = (a: {x:number;y:number}, b: {x:number;y:number}) => ({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const applyZoom = (next: number, focusX?: number, focusY?: number) => {
    const previous = zoom;
    zoom = Math.max(1, Math.min(2.5, next));
    const localX = focusX == null ? viewport.clientWidth / 2 : focusX - viewport.getBoundingClientRect().left;
    const localY = focusY == null ? viewport.clientHeight / 2 : focusY - viewport.getBoundingClientRect().top;
    const anchoredX = viewport.scrollLeft + localX;
    const anchoredY = viewport.scrollTop + localY;
    surface.style.width = (zoom * 100) + "%";
    viewport.scrollLeft = anchoredX * zoom / previous - localX;
    viewport.scrollTop = anchoredY * zoom / previous - localY;
    const level = dialog.querySelector<HTMLElement>("[data-wmh-zoom-level]");
    if (level) level.textContent = Math.round(zoom * 100) + "%";
  };
  dialog.querySelectorAll<HTMLElement>("[data-wmh-zoom]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.wmhZoom;
    applyZoom(action === "reset" ? 1 : action === "in" ? zoom + .25 : zoom - .25);
  }));
  viewport.addEventListener("pointerdown", event => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      if ((event.target as Element).closest(".wmh-power")) return;
      panStart = { x: event.clientX, y: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };
      try { viewport.setPointerCapture(event.pointerId); } catch { /* pointer capture may be unavailable */ }
    } else if (pointers.size === 2) {
      const pair = [...pointers.values()];
      const center = midpoint(pair[0], pair[1]);
      pinchStart = { distance: Math.max(1, distance(pair[0], pair[1])), zoom, centerX: center.x, centerY: center.y };
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
  applyZoom(zoom);
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
  const updateMarkerCenter = (id: WorldMarkerId, centerX: number, centerY: number) => {
    const marker = markers.find(item => item.id === id);
    if (!marker) return;
    const bounds = mapBounds();
    marker.x = clamp(((centerX - bounds.left) / bounds.width) * 100);
    marker.y = clamp(((centerY - bounds.top) / bounds.height) * 100);
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
    updateMarkerCenter(dragging.id, event.clientX + dragging.offsetX, event.clientY + dragging.offsetY);
  });
  const stop = (event: PointerEvent, commitFinalPoint: boolean) => {
    if (!dragging || event.pointerId !== dragging.pointerId) return;
    event.preventDefault();
    if (commitFinalPoint) updateMarkerCenter(dragging.id, event.clientX + dragging.offsetX, event.clientY + dragging.offsetY);
    const active = dragging;
    canvas.querySelector<HTMLElement>('[data-wmh-drag-marker="' + active.id + '"]')?.classList.remove("wmh-editor-marker-lifted");
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

function panelMarkup(level: Level, regionId: RegionId = "golden-dragon-empire", selectedBuilding = "Tianhai Academy"): string {
  const region = regionData[regionId];
  const header = (kind: string, title: string, subtitle: string) =>
    '<header class="wmh-level-header"><div><span class="wmh-level-tag">' + kind + '</span><h3>' + title + '</h3><p>' + subtitle + '</p></div><button type="button" class="wmh-close" data-wmh-action="close" aria-label="Close map">×</button></header>';
  if (level === "world") return header("WORLD MAP", "Merzkava Universe", "THREE GREAT POWERS · EXTERNAL TERRITORIES · FORESTS · SIX SEAS") +
    '<div class="wmh-map-zoom" data-wmh-zoom-controls><button type="button" data-wmh-zoom="out" aria-label="Zoom out">−</button><span data-wmh-zoom-level>100%</span><button type="button" data-wmh-zoom="in" aria-label="Zoom in">+</button><button type="button" data-wmh-zoom="reset">RESET</button></div>' +
    '<div class="wmh-world-map" data-wmh-map-viewport><div class="wmh-world-map-image" data-wmh-map-surface><img src="/world/Untitled77_20261029054536.png" alt="Canonical Merzkava world and regions map" />' +
    readWorldMarkers().map(marker => worldMapMarkerMarkup(marker)).join("") + '</div></div>' +
    '<div class="wmh-bottom-actions"><button data-wmh-action="home">⌂ &nbsp; OPEN HOME MAP</button><button data-wmh-action="editor-open">⊞ &nbsp; MAP EDITOR</button><span>SELECT A POWER TO EXPLORE ITS TERRITORY</span></div>';
  if (level === "map-editor") return header("WORLD MAP TOOLS", "Map Editor", "FLAT WORLD MAP · NORMALIZED COORDINATES") + mapEditorMarkup();
  if (level === "regional") return header("REGIONAL MAP", region.name, region.subtitle) +
    '<div class="wmh-region-scene"><img src="' + region.image + '" alt="" /><div class="wmh-scene-shade"></div><span class="wmh-map-stamp">REGIONAL TERRITORY</span></div>' +
    '<div class="wmh-site-grid">' + region.sites.map((site, i) =>
      '<button class="wmh-site-card" data-wmh-site="' + site + '" data-wmh-region-id="' + regionId + '"><span>' + ["♜","⌘","▤","⚓","⌑","⚔"][i] + '</span><b>' + site + '</b><small>' + (regionId === "golden-dragon-empire" && site === "Tianhai Academy" ? "EXPLORE COMPLEX" : "COMING SOON") + '</small></button>'
    ).join("") + '</div><div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>SELECT A LOCATION</span></div>';
  if (level === "local") return header("LOCAL AREA", selectedBuilding, "ACADEMY COMPLEX · BUILDINGS & GROUNDS") +
    '<div class="wmh-local-scene"><img src="/game/scenery/golden-dragon-empire/gde-05-cultivation-academy-courtyard.png" alt="" />' +
    '<div class="wmh-local-overlay"><button class="wmh-building wmh-building-class" data-wmh-building="Classroom">CLASSROOM</button><button class="wmh-building wmh-building-dean" data-wmh-building="Dean’s Office">DEAN’S OFFICE</button><button class="wmh-building wmh-building-garden" data-wmh-building="Academy Garden">GARDEN</button><button class="wmh-building wmh-building-training" data-wmh-building="Training Grounds">TRAINING GROUNDS</button>' +
    '<button class="wmh-avatar wmh-player" data-wmh-npc="You" aria-label="Player"><span>✦</span></button><button class="wmh-avatar wmh-npc-one" data-wmh-npc="Student" aria-label="Nearby student"><span>●</span></button><button class="wmh-avatar wmh-npc-two" data-wmh-npc="Academy attendant" aria-label="Academy attendant"><span>●</span></button></div></div>' +
    '<div class="wmh-local-footer"><span>● PLAYER &nbsp; ○ NPC · TAP A BUILDING OR CHARACTER</span><button data-wmh-action="exit-local">← EXIT TO CITY · +3 HOURS</button></div>';
  if (level === "interior") return header("INTERIOR MAP", selectedBuilding, "ISOMETRIC FLOOR PLAN · CLASSROOM") +
    '<div class="wmh-interior"><div class="wmh-classroom-floor"><div class="wmh-blackboard">LESSON BOARD</div><div class="wmh-teacher-desk">TEACHER</div>' +
    '<div class="wmh-desks">' + Array.from({length:6},()=>'<div class="wmh-desk">DESK</div>').join("") + '</div>' +
    '<button class="wmh-avatar wmh-interior-player" data-wmh-npc="You" aria-label="Player"><span>✦</span></button><button class="wmh-avatar wmh-interior-npc-a" data-wmh-npc="Student" aria-label="Student"><span>●</span></button><button class="wmh-avatar wmh-interior-npc-b" data-wmh-npc="Student" aria-label="Student"><span>●</span></button><button class="wmh-avatar wmh-interior-npc-c" data-wmh-npc="Teacher" aria-label="Teacher"><span>●</span></button><div class="wmh-door">DOOR</div></div></div>' +
    '<div class="wmh-local-footer"><span>CHARACTERS ARE SHOWN AS ROUND PORTRAIT TOKENS</span><button data-wmh-action="back">← BACK TO LOCAL AREA</button></div><div class="wmh-dialogue" data-wmh-dialogue hidden><div class="wmh-dialogue-portrait">◉</div><div><small data-wmh-speaker>STUDENT</small><p data-wmh-line>“The lesson has already started. I should return to my seat.”</p></div><button data-wmh-action="dismiss-dialogue">×</button></div>';
  return header("HOME MAP", "Personal Grounds", "ISOMETRIC HOME · PLOTS & FACILITIES") +
    '<div class="wmh-home-grid">' + [["Farmland","▧"],["Building Plot","⌂"],["Training Area","⚔"],["Warehouse","▤"],["Fish Pond","◉"],["Lumber Area","♧"]].map(([name,icon])=>'<button data-wmh-plot="' + name + '"><span>' + icon + '</span><b>' + name + '</b><small>VIEW FUNCTION</small></button>').join("") + '</div><div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>PERSONAL DEVELOPMENT AREA</span></div>';
}

export function renderWorldMapHierarchy(): string {
  return '<button type="button" class="wmh-open" data-wmh-action="open">✧ &nbsp; EXPLORE WORLD MAP</button>' +
    '<section class="wmh-overlay" data-world-map-hierarchy hidden aria-label="World map navigation"><div class="wmh-dialog" data-wmh-dialog>' +
    panelMarkup("world") + '</div></section>';
}

export function handleWorldMapHierarchyClick(target: Element, root: HTMLElement, onAdvanceTime: (minutes: number) => void): boolean {
  const action = target.closest<HTMLElement>("[data-wmh-action],[data-wmh-info],[data-wmh-site],[data-wmh-building],[data-wmh-npc],[data-wmh-plot]");
  if (!action) return false;
  const overlay = root.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog = overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if (!overlay || !dialog) return false;
  const current = (overlay.dataset.level as Level) || "world";
  const regionId = (overlay.dataset.region as RegionId) || "golden-dragon-empire";
  const building = overlay.dataset.building || "Tianhai Academy";
  if (action.dataset.wmhAction === "open") { overlay.hidden = false; overlay.dataset.level = "world"; dialog.innerHTML = panelMarkup("world"); bindWorldMapZoom(dialog); return true; }
  if (action.dataset.wmhAction === "editor-open") { overlay.dataset.level = "map-editor"; dialog.innerHTML = panelMarkup("map-editor"); bindWorldMapEditor(dialog); return true; }
  if (action.dataset.wmhAction === "editor-close") { overlay.dataset.level = "world"; dialog.innerHTML = panelMarkup("world"); bindWorldMapZoom(dialog); return true; }
  if (action.dataset.wmhAction === "editor-confirm" || action.dataset.wmhAction === "editor-reset") return true;
  if (action.dataset.wmhAction === "close") { overlay.hidden = true; return true; }
  if (action.dataset.wmhAction === "back") {
    const next: Level = current === "interior" ? "local" : current === "local" ? "regional" : "world";
    overlay.dataset.level = next; dialog.innerHTML = panelMarkup(next,regionId,building); if (next === "world") bindWorldMapZoom(dialog); return true;
  }
  if (action.dataset.wmhAction === "home") { overlay.dataset.level = "home"; dialog.innerHTML = panelMarkup("home",regionId,building); return true; }
  if (action.dataset.wmhInfo) {
    const id = action.dataset.wmhInfo as WorldMarkerId;
    const info = readWorldMarkers().find(item => item.id === id);
    if (!info) return true;
    dialog.querySelector(".wmh-marker-info")?.remove();
    const placement = info.placementStatus === "provisional" ? '<em>PROVISIONAL MAP PLACEMENT · ADJUST IN MAP EDITOR</em>' : '<em>OWNER-POSITIONED MARKER</em>';
    dialog.insertAdjacentHTML("beforeend", '<section class="wmh-marker-info"><div><small>' + info.category.toUpperCase() + ' · MAP MARKER</small><b>' + info.name + '</b><span>' + info.subtitle + '</span><p>' + info.description + '</p>' + placement + '</div><button type="button" data-wmh-action="dismiss-marker-info" aria-label="Close marker information">×</button></section>');
    return true;
  }
  if (action.dataset.wmhAction === "dismiss-marker-info") { dialog.querySelector(".wmh-marker-info")?.remove(); return true; }
  if (action.dataset.wmhSite) {
    if (action.dataset.wmhSite !== "Tianhai Academy" || action.dataset.wmhRegionId !== "golden-dragon-empire") {
      const site = action.dataset.wmhSite;
      dialog.insertAdjacentHTML("beforeend", '<div class="wmh-toast">This location is reserved for a future map update: ' + site + '</div>'); return true;
    }
    overlay.dataset.level = "local"; overlay.dataset.building = "Tianhai Academy";
    dialog.innerHTML = panelMarkup("local",regionId,"Tianhai Academy"); return true;
  }
  if (action.dataset.wmhBuilding) {
    overlay.dataset.level = "interior"; overlay.dataset.building = action.dataset.wmhBuilding;
    dialog.innerHTML = panelMarkup("interior",regionId,action.dataset.wmhBuilding); return true;
  }
  if (action.dataset.wmhNpc) {
    const speaker = dialog.querySelector<HTMLElement>("[data-wmh-speaker]");
    const line = dialog.querySelector<HTMLElement>("[data-wmh-line]");
    const portrait = dialog.querySelector<HTMLElement>(".wmh-dialogue-portrait");
    if (speaker) speaker.textContent = action.dataset.wmhNpc.toUpperCase();
    if (line) line.textContent = action.dataset.wmhNpc === "You" ? "You look around the room." : "“The lesson is underway. I should finish what I am doing.”";
    if (portrait) portrait.textContent = action.dataset.wmhNpc === "You" ? "✦" : "◉";
    const box = dialog.querySelector<HTMLElement>("[data-wmh-dialogue]"); if (box) box.hidden = false;
    return true;
  }
  if (action.dataset.wmhAction === "dismiss-dialogue") { const box=dialog.querySelector<HTMLElement>("[data-wmh-dialogue]"); if(box) box.hidden=true; return true; }
  if (action.dataset.wmhPlot) {
    dialog.insertAdjacentHTML("beforeend", '<div class="wmh-toast">' + action.dataset.wmhPlot + ' · function details coming soon</div>'); return true;
  }
  if (action.dataset.wmhAction === "exit-local") {
    onAdvanceTime(180);
    overlay.dataset.level = "regional"; dialog.innerHTML = panelMarkup("regional",regionId);
    return true;
  }
  return false;
}
