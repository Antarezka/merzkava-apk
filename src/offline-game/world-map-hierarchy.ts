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


type WorldMarkerId = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu";
type WorldMarker = { id: WorldMarkerId; name: string; x: number; y: number };
const WORLD_MAP_COORDINATES_KEY = "merzkava.world-map.coordinates.v1";
const defaultWorldMarkers: WorldMarker[] = [
  { id: "golden-dragon-empire", name: "Golden Dragon Empire", x: 3, y: 20 },
  { id: "tianhai-yunzhou", name: "Tianhai Yunzhou", x: 98, y: 52 },
  { id: "beiming-gu", name: "Beiming Gu", x: 3, y: 86 }
];
function readWorldMarkers(): WorldMarker[] {
  try {
    const saved = JSON.parse(localStorage.getItem(WORLD_MAP_COORDINATES_KEY) || "null");
    if (Array.isArray(saved) && defaultWorldMarkers.every(item => saved.some((entry: any) =>
      entry?.id === item.id && Number.isFinite(entry.x) && Number.isFinite(entry.y)))) {
      return defaultWorldMarkers.map(item => {
        const entry = saved.find((value: any) => value.id === item.id);
        return { ...item, x: Math.max(0, Math.min(100, Number(entry.x))), y: Math.max(0, Math.min(100, Number(entry.y))) };
      });
    }
  } catch { /* use built-in coordinates when storage is unavailable or invalid */ }
  return defaultWorldMarkers.map(item => ({ ...item }));
}
function worldMapMarkerMarkup(marker: WorldMarker, editor = false): string {
  return '<button class="wmh-power wmh-power-' + (marker.id === "golden-dragon-empire" ? "gde" : marker.id === "tianhai-yunzhou" ? "ty" : "bg") +
    (editor ? ' wmh-editor-marker' : '') + '" style="left:' + marker.x + '%;top:' + marker.y + '%" ' +
    (editor ? 'type="button" data-wmh-drag-marker="' + marker.id + '" aria-label="Drag ' + marker.name + '"' : 'data-wmh-region="' + marker.id + '"') +
    '><b>' + (marker.id === "golden-dragon-empire" ? "01" : marker.id === "tianhai-yunzhou" ? "02" : "03") + '</b><span>' + marker.name + '</span></button>';
}
function serializeWorldMapCoordinates(markers: WorldMarker[]): string {
  return JSON.stringify({
    format: "merzkava-world-map-coordinates",
    schemaVersion: 1,
    map: "Merzkava Universe World Map",
    image: "/world/Untitled77_20261029054536.png",
    coordinateSystem: {
      type: "normalized-percentage", origin: "top-left",
      xAxis: "left-to-right", yAxis: "top-to-bottom",
      range: "0–100", anchor: "marker-center",
      note: "Coordinates are percentages of the displayed flat map canvas, not pixel positions."
    },
    markers: markers.map(({ id, name, x, y }) => ({ id, name, x, y }))
  }, null, 2);
}
function mapEditorMarkup(): string {
  const markers = readWorldMarkers();
  return '<div class="wmh-map-editor"><div class="wmh-editor-intro"><b>WORLD MAP · COORDINATE EDITOR</b><span>DRAG A MARKER OR EDIT ITS X / Y VALUES · 0–100%</span></div>' +
    '<div class="wmh-editor-canvas" data-wmh-editor-canvas><img src="/world/Untitled77_20261029054536.png" alt="World map coordinate canvas" />' +
    markers.map(marker => worldMapMarkerMarkup(marker, true)).join("") + '<div class="wmh-editor-crosshair" aria-hidden="true"></div></div>' +
    '<div class="wmh-coordinate-table-wrap"><table class="wmh-coordinate-table"><thead><tr><th>AREA</th><th>X (%)</th><th>Y (%)</th></tr></thead><tbody>' +
    markers.map(marker => '<tr data-wmh-coordinate-row="' + marker.id + '"><td>' + marker.name + '</td><td><input type="number" min="0" max="100" step="0.1" value="' + marker.x + '" data-wmh-coordinate="' + marker.id + '" data-axis="x" aria-label="' + marker.name + ' X coordinate" /></td><td><input type="number" min="0" max="100" step="0.1" value="' + marker.y + '" data-wmh-coordinate="' + marker.id + '" data-axis="y" aria-label="' + marker.name + ' Y coordinate" /></td></tr>').join("") +
    '</tbody></table></div><section class="wmh-coordinate-transfer"><div class="wmh-transfer-heading"><b>COORDINATE REFERENCE</b><span>PORTABLE COPY · JSON</span></div><p>Copy this reference and keep it as the source of truth when placing areas, buildings, objects, or other map points.</p><textarea readonly spellcheck="false" data-wmh-export aria-label="Exportable world map coordinate reference"></textarea><div class="wmh-editor-actions"><button type="button" data-wmh-action="editor-copy">COPY COORDINATES</button><button type="button" data-wmh-action="editor-save">SAVE ON DEVICE</button></div><label class="wmh-import-label" for="wmh-coordinate-import">PASTE A PREVIOUS COORDINATE REFERENCE</label><textarea id="wmh-coordinate-import" spellcheck="false" data-wmh-import placeholder="Paste the copied JSON reference here..."></textarea><button class="wmh-import-button" type="button" data-wmh-action="editor-import">IMPORT PASTED COORDINATES</button></section><div class="wmh-editor-actions"><button type="button" data-wmh-action="editor-reset">RESET DEFAULTS</button><button type="button" data-wmh-action="editor-close">← WORLD MAP</button></div><p class="wmh-editor-status" data-wmh-editor-status>Changes are a preview until saved. Copy the reference to transfer it elsewhere.</p></div>';
}
function bindWorldMapEditor(dialog: HTMLElement): void {
  const canvas = dialog.querySelector<HTMLElement>("[data-wmh-editor-canvas]");
  if (!canvas || canvas.dataset.bound === "true") return;
  canvas.dataset.bound = "true";
  let markers = readWorldMarkers();
  let dragging: WorldMarkerId | null = null;
  const exportField = dialog.querySelector<HTMLTextAreaElement>("[data-wmh-export]");
  const refreshExport = () => { if (exportField) exportField.value = serializeWorldMapCoordinates(markers); };
  refreshExport();
  const setStatus = (message: string) => {
    const status = dialog.querySelector<HTMLElement>("[data-wmh-editor-status]");
    if (status) status.textContent = message;
  };
  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value * 10) / 10));
  const paint = (marker: WorldMarker) => {
    const button = canvas.querySelector<HTMLElement>('[data-wmh-drag-marker="' + marker.id + '"]');
    if (button) { button.style.left = marker.x + "%"; button.style.top = marker.y + "%"; }
    const row = dialog.querySelector<HTMLElement>('[data-wmh-coordinate-row="' + marker.id + '"]');
    row?.querySelectorAll<HTMLInputElement>("input").forEach(input => {
      const axis = input.dataset.axis as "x" | "y";
      if (document.activeElement !== input) input.value = String(marker[axis]);
    });
  };
  const update = (id: WorldMarkerId, x: number, y: number) => {
    const marker = markers.find(item => item.id === id);
    if (!marker) return;
    marker.x = clamp(x); marker.y = clamp(y); paint(marker); refreshExport();
    setStatus(marker.name + " · X " + marker.x + "% · Y " + marker.y + "% · unsaved preview");
  };
  canvas.addEventListener("pointerdown", event => {
    const target = event.target as Element;
    const markerButton = target.closest<HTMLElement>("[data-wmh-drag-marker]");
    if (!markerButton) return;
    event.preventDefault();
    dragging = markerButton.dataset.wmhDragMarker as WorldMarkerId;
    try { canvas.setPointerCapture(event.pointerId); } catch { /* pointer capture may be unavailable */ }
  });
  canvas.addEventListener("pointermove", event => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    update(dragging, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
  });
  const stop = () => { dragging = null; };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  dialog.querySelectorAll<HTMLInputElement>("[data-wmh-coordinate]").forEach(input => {
    input.addEventListener("change", () => {
      const id = input.dataset.wmhCoordinate as WorldMarkerId;
      const marker = markers.find(item => item.id === id);
      if (!marker) return;
      const value = Number(input.value);
      if (!Number.isFinite(value)) { input.value = String(marker[input.dataset.axis as "x" | "y"]); return; }
      const axis = input.dataset.axis as "x" | "y";
      update(id, axis === "x" ? value : marker.x, axis === "y" ? value : marker.y);
    });
  });
  const saveCoordinates = () => {
    try {
      localStorage.setItem(WORLD_MAP_COORDINATES_KEY, JSON.stringify(markers));
      setStatus("Coordinates saved on this device. The portable JSON reference is ready to copy.");
    } catch { setStatus("Could not save: device storage is unavailable. Copy the JSON reference as a backup."); }
  };
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-save"]')?.addEventListener("click", saveCoordinates);
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-copy"]')?.addEventListener("click", async () => {
    refreshExport();
    const value = exportField?.value || serializeWorldMapCoordinates(markers);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setStatus("Coordinate reference copied. You can paste it into chat, notes, or another editor.");
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
      if (!Array.isArray(incoming) || !defaultWorldMarkers.every(base => incoming.some((item: any) =>
        item?.id === base.id && Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y))))) {
        throw new Error("Missing or invalid marker coordinates");
      }
      markers = defaultWorldMarkers.map(base => {
        const item = incoming.find((entry: any) => entry.id === base.id);
        return { ...base, x: clamp(Number(item.x)), y: clamp(Number(item.y)) };
      });
      markers.forEach(paint); refreshExport(); saveCoordinates();
      setStatus("Imported and saved. These coordinates now control the World Map markers on this device.");
    } catch { setStatus("Import failed. Paste a valid Merzkava World Map JSON reference with all three area IDs."); }
  });
  dialog.querySelector<HTMLElement>('[data-wmh-action="editor-reset"]')?.addEventListener("click", () => {
    markers = defaultWorldMarkers.map(item => ({ ...item }));
    markers.forEach(paint); refreshExport();
    setStatus("Default coordinates restored in preview. Save on device to keep them.");
  });
}

function panelMarkup(level: Level, regionId: RegionId = "golden-dragon-empire", selectedBuilding = "Tianhai Academy"): string {
  const region = regionData[regionId];
  const header = (kind: string, title: string, subtitle: string) =>
    '<header class="wmh-level-header"><div><span class="wmh-level-tag">' + kind + '</span><h3>' + title + '</h3><p>' + subtitle + '</p></div><button type="button" class="wmh-close" data-wmh-action="close" aria-label="Close map">×</button></header>';
  if (level === "world") return header("WORLD MAP", "Merzkava Universe", "THREE GREAT POWERS · SEAS · UNCHARTED LANDS") +
    '<div class="wmh-world-map"><img src="/world/Untitled77_20261029054536.png" alt="Canonical Merzkava world and regions map" />' +
    readWorldMarkers().map(marker => worldMapMarkerMarkup(marker)).join("") + '</div>' +
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
  const action = target.closest<HTMLElement>("[data-wmh-action],[data-wmh-region],[data-wmh-site],[data-wmh-building],[data-wmh-npc],[data-wmh-plot]");
  if (!action) return false;
  const overlay = root.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog = overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if (!overlay || !dialog) return false;
  const current = (overlay.dataset.level as Level) || "world";
  const regionId = (overlay.dataset.region as RegionId) || "golden-dragon-empire";
  const building = overlay.dataset.building || "Tianhai Academy";
  if (action.dataset.wmhAction === "open") { overlay.hidden = false; overlay.dataset.level = "world"; dialog.innerHTML = panelMarkup("world"); return true; }
  if (action.dataset.wmhAction === "editor-open") { overlay.dataset.level = "map-editor"; dialog.innerHTML = panelMarkup("map-editor"); bindWorldMapEditor(dialog); return true; }
  if (action.dataset.wmhAction === "editor-close") { overlay.dataset.level = "world"; dialog.innerHTML = panelMarkup("world"); return true; }
  if (action.dataset.wmhAction === "editor-save" || action.dataset.wmhAction === "editor-reset") return true;
  if (action.dataset.wmhAction === "close") { overlay.hidden = true; return true; }
  if (action.dataset.wmhAction === "back") {
    const next: Level = current === "interior" ? "local" : current === "local" ? "regional" : "world";
    overlay.dataset.level = next; dialog.innerHTML = panelMarkup(next,regionId,building); return true;
  }
  if (action.dataset.wmhAction === "home") { overlay.dataset.level = "home"; dialog.innerHTML = panelMarkup("home",regionId,building); return true; }
  if (action.dataset.wmhRegion) {
    const id = action.dataset.wmhRegion as RegionId; if (!regionData[id]) return true;
    overlay.dataset.level = "regional"; overlay.dataset.region = id; dialog.innerHTML = panelMarkup("regional",id); return true;
  }
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
