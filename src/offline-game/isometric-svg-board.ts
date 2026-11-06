import type { IsoMapGridConfig } from "./isometric-map-editor";

export type IsometricSvgTheme = "golden-dragon-empire" | "tianhai-yunzhou" | "beiming-gu" | "interior";

export type IsometricSvgSceneOptions = {
  mapId: string;
  grid: IsoMapGridConfig;
  theme: IsometricSvgTheme;
  title: string;
  baseImage?: boolean;
  width?: number;
  height?: number;
};

type CellFeature = "ground" | "path" | "plaza" | "water" | "garden" | "tree" | "hall" | "wood" | "floor";

const palettes: Record<IsometricSvgTheme, Record<CellFeature, string>> = {
  "golden-dragon-empire": {
    ground: "#637b5d", path: "#bba681", plaza: "#d9cba6", water: "#4b92a4",
    garden: "#71985e", tree: "#527b4e", hall: "#c9a56e", wood: "#8c6947", floor: "#b89b70",
  },
  "tianhai-yunzhou": {
    ground: "#527b78", path: "#b9c4ae", plaza: "#d4d2b8", water: "#438da5",
    garden: "#6f9a8d", tree: "#477d73", hall: "#d4b879", wood: "#8d795c", floor: "#c0b28f",
  },
  "beiming-gu": {
    ground: "#71848a", path: "#c4c5b7", plaza: "#e0dfd0", water: "#6fabc0",
    garden: "#788e80", tree: "#496c67", hall: "#c7b58f", wood: "#746c5e", floor: "#aaa99b",
  },
  interior: {
    ground: "#765b42", path: "#a5815a", plaza: "#c1a077", water: "#547b82",
    garden: "#64714e", tree: "#4c6244", hall: "#d1ad70", wood: "#8c6745", floor: "#a9845c",
  },
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  }[char] || char));
}

function cellCenter(x: number, y: number, grid: IsoMapGridConfig): { x: number; y: number } {
  const halfW = grid.tileW / 2;
  const halfH = grid.tileH / 2;
  return {
    x: (x - y) * halfW + grid.rows * halfW + grid.offsetX,
    y: (x + y) * halfH + grid.offsetY + halfH,
  };
}

function cellFeature(
  x: number,
  y: number,
  grid: IsoMapGridConfig,
  theme: IsometricSvgTheme,
): CellFeature {
  const midX = Math.floor(grid.cols / 2);
  const midY = Math.floor(grid.rows / 2);

  if (theme === "interior") {
    if (y === grid.rows - 2 && x >= midX - 1 && x <= midX + 1) return "path";
    if (x >= midX - 2 && x <= midX + 1 && y >= midY - 2 && y <= midY + 1) return "plaza";
    if ((x === 2 || x === grid.cols - 3) && y >= 2 && y <= grid.rows - 3) return "wood";
    return "floor";
  }

  if ((x === midX || x === midX - 1) && y >= 1 && y < grid.rows - 1) return "path";
  if ((y === midY || y === midY - 1) && x >= 1 && x < grid.cols - 1) return "path";
  if (x >= midX - 2 && x <= midX + 2 && y >= midY - 2 && y <= midY + 1) return "plaza";

  if (theme === "beiming-gu") {
    if (x >= grid.cols - 6 && y >= 2 && y <= 7) return "water";
    if ((x <= 4 || x >= grid.cols - 4) && (y <= 5 || y >= grid.rows - 5)) return "tree";
    if ((x >= 3 && x <= 5 && y >= 3 && y <= 5) || (x >= grid.cols - 7 && x <= grid.cols - 5 && y >= grid.rows - 7 && y <= grid.rows - 5)) return "garden";
  } else if (theme === "tianhai-yunzhou") {
    if (x >= 2 && x <= 5 && y >= 2 && y <= 5) return "water";
    if (x >= grid.cols - 6 && x <= grid.cols - 3 && y >= grid.rows - 7 && y <= grid.rows - 4) return "water";
    if ((x <= 3 || x >= grid.cols - 4) && y >= 6 && y <= grid.rows - 6) return "garden";
    if ((x === 3 || x === grid.cols - 4) && (y === 3 || y === grid.rows - 4)) return "tree";
  } else {
    if (x >= grid.cols - 7 && x <= grid.cols - 4 && y >= 2 && y <= 5) return "water";
    if ((x <= 4 || x >= grid.cols - 4) && y >= 5 && y <= grid.rows - 5) return "garden";
    if ((x === 3 || x === grid.cols - 4) && (y === 3 || y === grid.rows - 4)) return "tree";
  }
  if (y === 0 || y === grid.rows - 1 || x === 0 || x === grid.cols - 1) return "ground";
  return "ground";
}

function surfaceFor(feature: CellFeature, theme: IsometricSvgTheme): string {
  if (feature === "water") return "wet";
  if (feature === "wood" || theme === "interior") return "wood";
  if (feature === "garden" || feature === "tree") return "earth";
  if (feature === "plaza") return "tile";
  return feature === "path" ? "stone" : "earth";
}

function cellMarkup(
  x: number,
  y: number,
  grid: IsoMapGridConfig,
  theme: IsometricSvgTheme,
  baseImage: boolean,
): string {
  const center = cellCenter(x, y, grid);
  const halfW = grid.tileW / 2;
  const halfH = grid.tileH / 2;
  const feature = baseImage ? "ground" : cellFeature(x, y, grid, theme);
  const points = [
    center.x + "," + (center.y - halfH),
    (center.x + halfW) + "," + center.y,
    center.x + "," + (center.y + halfH),
    (center.x - halfW) + "," + center.y,
  ].join(" ");
  const palette = palettes[theme];
  const fill = baseImage ? "transparent" : palette[feature];
  const fillOpacity = baseImage ? "0" : feature === "ground" ? ".88" : ".96";
  // Academy artwork remains the visible ground; its isometric grid is only a thin coordinate guide.
  // Gameplay keeps the editor geometry but presents it as a quiet, warm-gold coordinate guide.
  const stroke = "#d0b477";
  const strokeOpacity = baseImage ? "0.18" : feature === "ground" ? ".16" : ".24";
  return '<polygon class="wmh-vector-cell feature-' + feature + '" data-wmh-tile data-x="' + x +
    '" data-y="' + y + '" data-z="0" data-tile-id="' + escapeXml("map-" + x + "-" + y) +
    '" data-surface="' + surfaceFor(feature, theme) + '" points="' + points + '" fill="' + fill +
    '" fill-opacity="' + fillOpacity + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
    '" stroke-width="' + "0.65" + '" aria-label="Tile ' + x + ', ' + y + ' · ' + feature + '"><title>' +
    x + ", " + y + " · " + feature + "</title></polygon>";
}

function treeMarkup(center: { x: number; y: number }, theme: IsometricSvgTheme): string {
  const colors = palettes[theme];
  return '<g transform="translate(' + center.x + " " + center.y + ')">' +
    '<path d="M0 0V-28" stroke="' + colors.wood + '" stroke-width="7"/>' +
    '<circle cy="-39" r="20" fill="' + colors.tree + '" stroke="#d5d6b0" stroke-width="1.5"/>' +
    '<circle cx="-12" cy="-31" r="12" fill="' + colors.garden + '"/>' +
    '<circle cx="12" cy="-31" r="12" fill="' + colors.tree + '"/>' +
    "</g>";
}

function exteriorScenery(grid: IsoMapGridConfig, theme: IsometricSvgTheme): string {
  const midX = Math.floor(grid.cols / 2);
  const gate = cellCenter(midX, 0, grid);
  const hall = cellCenter(Math.min(grid.cols - 3, midX + 4), Math.max(2, Math.floor(grid.rows / 2) - 3), grid);
  const treeA = cellCenter(3, Math.max(3, Math.floor(grid.rows * .68)), grid);
  const treeB = cellCenter(Math.max(0, grid.cols - 4), Math.max(2, Math.floor(grid.rows * .28)), grid);
  const pond = cellCenter(Math.max(1, grid.cols - 6), 4, grid);
  const title = theme === "tianhai-yunzhou" ? "SKY DISTRICT" : theme === "beiming-gu" ? "NORTHERN DISTRICT" : "IMPERIAL DISTRICT";
  const gateTitle = theme === "tianhai-yunzhou" ? "SKY GATE" : theme === "beiming-gu" ? "FROST GATE" : "DISTRICT GATE";
  const colors = palettes[theme];
  return '<g class="wmh-vector-scenery" pointer-events="none">' +
    '<g transform="translate(' + gate.x + " " + (gate.y - 5) + ')">' +
      '<path d="M-31 7V-31H-22V7 M22 7V-31H31V7" fill="' + colors.wood + '" stroke="#f4dfb5" stroke-width="1.6"/>' +
      '<path d="M-39 -30Q0 -56 39 -30L32 -22Q0 -41 -32 -22Z" fill="' + colors.hall + '" stroke="#fff0cb" stroke-width="1.6"/>' +
      '<path d="M-22 -15H22" stroke="#fff0cb" stroke-width="1.5"/>' +
      '<text x="0" y="-61" fill="#fff0cb" text-anchor="middle" font-size="9" font-weight="bold" letter-spacing="1.6">' + gateTitle + "</text>" +
    "</g>" +
    '<g transform="translate(' + hall.x + " " + (hall.y - 4) + ')">' +
      '<path d="M-39 -7L0 -33L39 -7L31 -1L0 -22L-31 -1Z" fill="' + colors.hall + '" stroke="#fff0cb" stroke-width="1.6"/>' +
      '<path d="M-29 -2V20 M29 -2V20 M-9 -17V20 M9 -17V20" stroke="' + colors.wood + '" stroke-width="4"/>' +
      '<path d="M-35 20H35" stroke="#473b2b" stroke-width="5"/>' +
      '<text x="0" y="35" text-anchor="middle" fill="#fff0cb" font-size="8" font-weight="bold">PAVILION</text>' +
    "</g>" +
    treeMarkup(treeA, theme) + treeMarkup(treeB, theme) +
    '<g transform="translate(' + pond.x + " " + pond.y + ')">' +
      '<path d="M-24 0Q-10 -7 4 0T25 0M-21 9Q-7 2 8 9T22 9" fill="none" stroke="#e3ffff" stroke-width="2"/>' +
      '<circle r="3" cy="-3" fill="#f0ffff"/>' +
    "</g>" +
    '<g transform="translate(20 24)"><text fill="#f1dfb5" font-size="9" font-weight="bold" letter-spacing="1.8">MERZKAVA · ' + title +
      '</text><text y="13" fill="#bac9aa" font-size="7" letter-spacing="1">ISOMETRIC FIELD MAP</text></g>' +
    "</g>";
}

function interiorScenery(grid: IsoMapGridConfig, theme: IsometricSvgTheme): string {
  const center = cellCenter(Math.floor(grid.cols / 2), Math.floor(grid.rows / 2), grid);
  const palette = palettes[theme];
  return '<g class="wmh-vector-scenery" pointer-events="none">' +
    '<g transform="translate(' + center.x + " " + center.y + ')">' +
      '<rect x="-54" y="-28" width="108" height="46" rx="4" fill="' + palette.wood + '" stroke="#ead3a1" stroke-width="2"/>' +
      '<path d="M-48 -20H48M-48 10H48" stroke="#d8bd8b" stroke-width="2" opacity=".75"/>' +
      '<circle cx="0" cy="-5" r="7" fill="#e8c779" stroke="#fff0c4" stroke-width="1.5"/>' +
      '<text x="0" y="34" fill="#fff0cb" text-anchor="middle" font-size="8" font-weight="bold">CENTRAL DESK</text>' +
    "</g>" +
    '<g transform="translate(' + (center.x - 110) + " " + (center.y - 70) + ')"><rect x="-22" y="-14" width="44" height="28" fill="#493a2c" stroke="#cfad76" stroke-width="2"/><path d="M-16 -7H16M-16 0H16M-16 7H16" stroke="#d9c39b" stroke-width="2"/></g>' +
    '<g transform="translate(' + (center.x + 110) + " " + (center.y - 70) + ')"><rect x="-20" y="-12" width="40" height="24" fill="#493a2c" stroke="#cfad76" stroke-width="2"/><path d="M-14 -6H14M-14 1H14" stroke="#d9c39b" stroke-width="2"/></g>' +
    '<g transform="translate(20 24)"><text fill="#f1dfb5" font-size="9" font-weight="bold" letter-spacing="1.8">MERZKAVA · INTERIOR</text></g>' +
    "</g>";
}

/** Shared SVG ground renderer used by every playable isometric area. */
export function renderIsometricSvgSceneMarkup(options: IsometricSvgSceneOptions): string {
  const { mapId, grid, theme, title, baseImage = false } = options;
  const projectedWidth = (grid.cols + grid.rows - 2) * grid.tileW / 2 + grid.tileW;
  const projectedHeight = (grid.cols + grid.rows - 2) * grid.tileH / 2 + grid.tileH + 7;
  const width = Math.max(projectedWidth, options.width || 0);
  const height = Math.max(projectedHeight, options.height || 0);
  const id = "iso-" + mapId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const cells: string[] = [];
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) cells.push(cellMarkup(x, y, grid, theme, baseImage));
  }
  const floor = baseImage
    ? ""
    : '<defs><radialGradient id="' + id + '-ground"><stop stop-color="' +
      (theme === "beiming-gu" ? "#334950" : theme === "tianhai-yunzhou" ? "#244747" : theme === "interior" ? "#3b2a1d" : "#3c5945") +
      '"/><stop offset="1" stop-color="#101a16"/></radialGradient></defs><rect width="' + width + '" height="' + height + '" fill="url(#' + id + '-ground)"/>';
  const scenery = baseImage ? "" : theme === "interior" ? interiorScenery(grid, theme) : exteriorScenery(grid, theme);
  return '<svg class="wmh-area-scene-svg" data-wmh-scene-svg viewBox="0 0 ' + width + " " + height +
    '" width="' + width + '" height="' + height + '" preserveAspectRatio="none" aria-label="' + escapeXml(title) +
    ' isometric map" role="img"><g class="wmh-vector-background">' + floor + '</g><g class="wmh-vector-cells" data-wmh-tile-grid>' +
    cells.join("") + "</g>" + scenery + "</svg>";
}

/** Re-render one editable map's SVG grid after calibration changes. */
export function refreshIsometricSvgScene(board: HTMLElement, grid: IsoMapGridConfig): void {
  const scene = board.querySelector<SVGSVGElement>("[data-wmh-scene-svg]");
  if (!scene) return;
  const mapId = board.dataset.mapId || "unnamed-isometric-map";
  const theme = (board.dataset.mapTheme || "golden-dragon-empire") as IsometricSvgTheme;
  const title = board.dataset.mapTitle || mapId;
  const width = Number.parseFloat(board.style.getPropertyValue("--iso-board-width")) || board.offsetWidth;
  const height = Number.parseFloat(board.style.getPropertyValue("--iso-board-height")) || board.offsetHeight;
  scene.outerHTML = renderIsometricSvgSceneMarkup({
    mapId, grid, theme, title, baseImage: board.classList.contains("has-map-base"), width, height,
  });
}
