const WIDTH = 784;
const HEIGHT = 527;
const COLS = 16;
const ROWS = 12;
const TILE_W = 56;
const TILE_H = 32;
const HALF_W = TILE_W / 2;
const HALF_H = TILE_H / 2;
const OFFSET_Y = 72;
const CENTER_X = ROWS * HALF_W;

function tileFeature(x: number, y: number): string {
  if ((x === 7 || x === 8) && y <= 10) return "path";
  if ((y === 6 || y === 7) && x >= 2 && x <= 13) return "path";
  if (x >= 4 && x <= 6 && y >= 3 && y <= 4) return "plaza";
  if (x >= 10 && x <= 12 && y >= 2 && y <= 3) return "water";
  if ((x === 2 || x === 3) && (y === 2 || y === 3)) return "garden";
  if ((x === 12 || x === 13) && (y === 8 || y === 9)) return "garden";
  if ((x === 3 && y === 9) || (x === 14 && y === 4)) return "tree";
  if ((x === 7 || x === 8) && y === 0) return "gate";
  return "ground";
}

function center(x: number, y: number): { x: number; y: number } {
  return {
    x: CENTER_X + (x - y) * HALF_W,
    y: OFFSET_Y + (x + y) * HALF_H + HALF_H,
  };
}

function vectorMapMarkup(): string {
  const fill: Record<string, string> = {
    ground: "#637b5d", path: "#bba681", plaza: "#d9cba6",
    water: "#4b92a4", garden: "#71985e", tree: "#527b4e", gate: "#c9a56e",
  };
  const cells: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = center(x, y);
      const feature = tileFeature(x, y);
      const points = [
        c.x + "," + (c.y - HALF_H),
        (c.x + HALF_W) + "," + c.y,
        c.x + "," + (c.y + HALF_H),
        (c.x - HALF_W) + "," + c.y,
      ].join(" ");
      cells.push(
        '<polygon class="wmh-vector-cell feature-' + feature + '" data-wmh-tile data-x="' + x + '" data-y="' + y +
        '" data-z="0" data-tile-id="yard-' + x + '-' + y + '" data-surface="' +
        (feature === "water" ? "wet" : feature === "garden" || feature === "tree" ? "earth" : feature === "ground" ? "stone" : "tile") +
        '" points="' + points + '" fill="' + fill[feature] + '" stroke="#e5e5c5" stroke-opacity="' +
        (feature === "ground" ? ".42" : ".85") + '" stroke-width="1.4" aria-label="Tile ' + x + ', ' + y + ' · ' + feature + '"><title>' +
        x + ", " + y + " · " + feature + '</title></polygon>'
      );
    }
  }
  const gate = center(7.5, 0);
  const hall = center(9.5, 3.5);
  const treeA = center(3, 9);
  const treeB = center(14, 4);
  const pool = center(11.5, 2.5);
  return '<svg class="wmh-vector-map" viewBox="0 0 ' + WIDTH + ' ' + HEIGHT + '" aria-label="Fresh isometric vector map" role="img">' +
    '<defs><linearGradient id="yard-roof" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ead7a9"/><stop offset="1" stop-color="#876642"/></linearGradient>' +
    '<linearGradient id="yard-water" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a8e5dc"/><stop offset="1" stop-color="#34788c"/></linearGradient>' +
    '<radialGradient id="yard-ground"><stop stop-color="#3c5945"/><stop offset="1" stop-color="#14241b"/></radialGradient></defs>' +
    '<rect width="' + WIDTH + '" height="' + HEIGHT + '" fill="url(#yard-ground)"/>' +
    '<g class="wmh-vector-cells">' + cells.join("") + '</g>' +
    '<g class="wmh-vector-scenery" pointer-events="none">' +
      '<g transform="translate(' + gate.x + ' ' + (gate.y - 8) + ')">' +
        '<path d="M-39 8V-43H-27V8 M27 8V-43H39V8" fill="#70583e" stroke="#f4dfb5" stroke-width="2"/>' +
        '<path d="M-47 -42Q0 -72 47 -42L39 -32Q0 -53 -39 -32Z" fill="url(#yard-roof)" stroke="#fff0cb" stroke-width="2"/>' +
        '<path d="M-27 -23H27" stroke="#fff0cb" stroke-width="2"/>' +
        '<text x="0" y="-79" fill="#fff0cb" text-anchor="middle" font-size="10" font-weight="bold" letter-spacing="2">NORTH GATE</text>' +
      '</g>' +
      '<g transform="translate(' + hall.x + ' ' + (hall.y - 6) + ')">' +
        '<path d="M-45 -10L0 -39L45 -10L36 -4L0 -27L-36 -4Z" fill="url(#yard-roof)" stroke="#fff0cb" stroke-width="2"/>' +
        '<path d="M-34 -5V25 M34 -5V25 M-11 -21V25 M11 -21V25" stroke="#dec18e" stroke-width="5"/>' +
        '<path d="M-41 25H41" stroke="#5e4932" stroke-width="7"/>' +
        '<text x="0" y="42" text-anchor="middle" fill="#fff0cb" font-size="9" font-weight="bold">PAVILION</text>' +
      '</g>' +
      '<g transform="translate(' + treeA.x + ' ' + treeA.y + ')"><path d="M0 0V-33" stroke="#684a32" stroke-width="9"/><circle cy="-45" r="24" fill="#426e49" stroke="#b4ce8c" stroke-width="2"/><circle cx="-14" cy="-34" r="15" fill="#5b8951"/><circle cx="15" cy="-34" r="15" fill="#6a9558"/></g>' +
      '<g transform="translate(' + treeB.x + ' ' + treeB.y + ')"><path d="M0 0V-33" stroke="#684a32" stroke-width="9"/><circle cy="-45" r="24" fill="#426e49" stroke="#b4ce8c" stroke-width="2"/><circle cx="-14" cy="-34" r="15" fill="#5b8951"/><circle cx="15" cy="-34" r="15" fill="#6a9558"/></g>' +
      '<g transform="translate(' + pool.x + ' ' + pool.y + ')"><path d="M-29 0Q-12 -8 5 0T29 0M-25 10Q-8 2 9 10T26 10" fill="none" stroke="#e3ffff" stroke-width="2.5"/><circle r="4" cy="-3" fill="#f0ffff"/></g>' +
      '<g transform="translate(22 28)"><text fill="#f1dfb5" font-size="9" font-weight="bold" letter-spacing="2">MERZKAVA · ISOMETRIC YARD</text><text y="13" fill="#bac9aa" font-size="7" letter-spacing="1">SVG VECTOR GROUND · NO IMAGE OR CSS TILE ART</text></g>' +
    '</g></svg>';
}

function actorMarkup(id: string, label: string, x: number, y: number, gender: "male" | "female", player = false): string {
  return '<button type="button" class="wmh-character-token ' + (player ? "wmh-player-token" : "wmh-npc-token is-" + gender) +
    '" ' + (player ? "data-wmh-player-token" : 'data-wmh-npc="' + id + '"') +
    ' data-token-label="' + label + '" data-x="' + x + '" data-y="' + y +
    '" style="--token-x:' + x + ';--token-y:' + y + '" aria-label="' +
    (player ? "Player character" : "Talk to " + id) + '"><i></i></button>';
}

export function renderIsometricVectorYard(): string {
  const viewport = '<div class="wmh-isometric-wrap wmh-vector-viewport" data-wmh-iso-viewport>' +
    '<div class="wmh-isometric-camera wmh-vector-camera" data-wmh-iso-camera>' +
    '<div class="wmh-isometric-board is-exterior is-vector-test" data-wmh-board ' +
    'style="--tile-cols:16;--tile-rows:12;--iso-center-x:' + CENTER_X + 'px;--iso-board-width:' + WIDTH + 'px;--iso-board-height:' + HEIGHT +
    'px;--tile-w:56px;--tile-h:32px;--iso-half-w:28px;--iso-half-h:16px;--iso-offset-y:' + OFFSET_Y + 'px;--slab-depth:6px" ' +
    'data-cols="16" data-rows="12" data-tile-w="56" data-tile-h="32" data-offset-x="0" data-offset-y="' + OFFSET_Y +
    '" data-map-id="isometric-render-test:render-yard:exterior">' +
    vectorMapMarkup() +
    '<button type="button" class="wmh-character-token wmh-player-token" data-wmh-player-token data-token-label="YOU" data-x="5" data-y="10" style="--token-x:5;--token-y:10" aria-label="Player character"><i></i></button>' +
    actorMarkup("test-guide", "GUIDE", 3, 3, "female") +
    actorMarkup("test-scholar", "SCHOLAR", 12, 4, "male") +
    actorMarkup("test-mechanic", "ARTIFICER", 11, 9, "female") +
    '</div></div></div>';
  return '<div class="wmh-isometric-play-screen wmh-vector-yard" data-wmh-isometric-play-screen>' +
    '<div class="wmh-vector-yard-heading"><b>ISOMETRIC RENDER YARD</b><span>16 × 12 VECTOR TILES · PLAYER · 3 NPCs</span></div>' +
    '<div class="wmh-vector-yard-controls"><button type="button" data-yard-zoom="-">−</button><span data-yard-zoom-label>FIT</span><button type="button" data-yard-zoom="+">+</button><small>TAP THE GROUND TO WALK</small></div>' +
    viewport +
    '<button type="button" class="wmh-map-back" data-wmh-action="back" aria-label="Leave isometric test area"><span>‹</span><b>EXIT TEST</b></button></div>';
}

function mountYard(dialog: HTMLElement): void {
  dialog.innerHTML = renderIsometricVectorYard();
  const viewport = dialog.querySelector<HTMLElement>("[data-wmh-iso-viewport]");
  const camera = dialog.querySelector<HTMLElement>("[data-wmh-iso-camera]");
  const board = dialog.querySelector<HTMLElement>("[data-wmh-board]");
  const label = dialog.querySelector<HTMLElement>("[data-yard-zoom-label]");
  if (!viewport || !camera || !board) return;
  let zoom = Math.min(0.72, Math.max(0.36, (viewport.clientWidth - 28) / WIDTH));
  const applyZoom = () => {
    const cameraW = Math.max(viewport.clientWidth, WIDTH * zoom);
    const cameraH = Math.max(viewport.clientHeight, HEIGHT * zoom);
    camera.style.width = cameraW + "px";
    camera.style.height = cameraH + "px";
    board.style.setProperty("--vector-left", (cameraW / 2) + "px");
    board.style.setProperty("--vector-top", (cameraH / 2) + "px");
    board.style.setProperty("--vector-zoom", String(zoom));
    viewport.scrollLeft = Math.max(0, (cameraW - viewport.clientWidth) / 2);
    viewport.scrollTop = Math.max(0, (cameraH - viewport.clientHeight) / 2);
    if (label) label.textContent = Math.round(zoom * 100) + "%";
  };
  dialog.querySelectorAll<HTMLElement>("[data-yard-zoom]").forEach(button => {
    button.addEventListener("click", () => {
      zoom = Math.max(0.3, Math.min(1.25, zoom + (button.dataset.yardZoom === "+" ? 0.12 : -0.12)));
      applyZoom();
    });
  });
  applyZoom();
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => applyZoom());
    observer.observe(viewport);
  }
}

function captureTestArea(event: Event): void {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const button = target.closest<HTMLElement>('[data-wmh-action="test-isometric"]');
  if (!button) return;
  const overlay = document.querySelector<HTMLElement>("[data-world-map-hierarchy]");
  const dialog = overlay?.querySelector<HTMLElement>("[data-wmh-dialog]");
  if (!overlay || !dialog) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  overlay.dataset.level = "test";
  mountYard(dialog);
}

if (typeof document !== "undefined") {
  document.addEventListener("click", captureTestArea, true);
}
