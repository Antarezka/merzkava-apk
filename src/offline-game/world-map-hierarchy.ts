import "./world-map-hierarchy.css";

type Level = "world" | "regional" | "local" | "interior" | "home";
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
const regionIds: RegionId[] = ["golden-dragon-empire", "tianhai-yunzhou", "beiming-gu"];

function panelMarkup(level: Level, regionId: RegionId, selectedBuilding = "Tianhai Academy"): string {
  const region = regionData[regionId];
  const header = (kind: string, title: string, subtitle: string) =>
    '<header class="wmh-level-header"><div><span class="wmh-level-tag">' + kind + '</span><h3>' + title + '</h3><p>' + subtitle + '</p></div><button type="button" class="wmh-close" data-wmh-action="close" aria-label="Close map">×</button></header>';
  if (level === "world") return header("WORLD MAP", "Merzkava Universe", "THREE GREAT POWERS · SEAS · UNCHARTED LANDS") +
    '<div class="wmh-world-map"><img src="/world/kanban-map-regions-cloud-gold-v2.svg" alt="Canonical Merzkava world and regions map" />' +
    '<button class="wmh-power wmh-power-gde" data-wmh-region="golden-dragon-empire"><b>01</b><span>Golden Dragon Empire</span></button>' +
    '<button class="wmh-power wmh-power-ty" data-wmh-region="tianhai-yunzhou"><b>02</b><span>Tianhai Yunzhou</span></button>' +
    '<button class="wmh-power wmh-power-bg" data-wmh-region="beiming-gu"><b>03</b><span>Beiming Gu</span></button></div>' +
    '<div class="wmh-bottom-actions"><button data-wmh-action="home">⌂ &nbsp; OPEN HOME MAP</button><span>SELECT A POWER TO EXPLORE ITS TERRITORY</span></div>';
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
    '<div class="wmh-desks">' + Array.from({length:6},(_,i)=>'<div class="wmh-desk">DESK</div>').join("") + '</div>' +
    '<button class="wmh-avatar wmh-interior-player" data-wmh-npc="You" aria-label="Player"><span>✦</span></button><button class="wmh-avatar wmh-interior-npc-a" data-wmh-npc="Student" aria-label="Student"><span>●</span></button><button class="wmh-avatar wmh-interior-npc-b" data-wmh-npc="Student" aria-label="Student"><span>●</span></button><button class="wmh-avatar wmh-interior-npc-c" data-wmh-npc="Teacher" aria-label="Teacher"><span>●</span></button><div class="wmh-door">DOOR</div></div></div>' +
    '<div class="wmh-local-footer"><span>CHARACTERS ARE SHOWN AS ROUND PORTRAIT TOKENS</span><button data-wmh-action="back">← BACK TO LOCAL AREA</button></div><div class="wmh-dialogue" data-wmh-dialogue hidden><div class="wmh-dialogue-portrait">◉</div><div><small data-wmh-speaker>STUDENT</small><p data-wmh-line>“The lesson has already started. I should return to my seat.”</p></div><button data-wmh-action="dismiss-dialogue">×</button></div>';
  return header("HOME MAP", "Personal Grounds", "ISOMETRIC HOME · PLOTS & FACILITIES") +
    '<div class="wmh-home-grid">' + [["Farmland","▧"],["Building Plot","⌂"],["Training Area","⚔"],["Warehouse","▤"],["Fish Pond","◉"],["Lumber Area","♧"]].map(([name,icon])=>'<button data-wmh-plot="' + name + '"><span>' + icon + '</span><b>' + name + '</b><small>VIEW FUNCTION</small></button>').join("") + '</div><div class="wmh-bottom-actions"><button data-wmh-action="back">← WORLD MAP</button><span>PERSONAL DEVELOPMENT AREA</span></div>';
}

export function renderWorldMapHierarchy(): string {
  return '<button type="button" class="wmh-open" data-wmh-action="open">✧ &nbsp; EXPLORE WORLD MAP</button>' +
    '<section class="wmh-overlay" data-world-map-hierarchy hidden aria-label="World map navigation"><div class="wmh-dialog" data-wmh-dialog>' +
    panelMarkup("world","Merzkava Universe","") + '</div></section>';
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
  if (action.dataset.wmhAction === "open") { overlay.hidden = false; overlay.dataset.level = "world"; dialog.innerHTML = panelMarkup("world","Merzkava Universe",""); return true; }
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
