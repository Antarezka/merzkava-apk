import "./isometric-render-yard-interceptor";
import "./world-map-hierarchy-scroll.css";
export type IsoMapGridConfig = {
  cols: number;
  rows: number;
  tileW: number;
  tileH: number;
  offsetX: number;
  offsetY: number;
  playerScale: number;
  npcScale: number;
};

export type IsoCellLayer = "foregroundCells" | "blockedCells" | "opacityCells";

export type IsoTransitionMarker = {
  id: string;
  x: number;
  y: number;
  label: string;
};

export type IsoMapEditorData = {
  format: "merzkava-isometric-map-editor";
  version: 1;
  mapId: string;
  grid: IsoMapGridConfig;
  foregroundCells: string[];
  blockedCells: string[];
  opacityCells: string[];
  transitions: IsoTransitionMarker[];
};

export type IsoMapPoint = { x: number; y: number };

export const DEFAULT_ISOMETRIC_GRID: IsoMapGridConfig = {
  cols: 24,
  rows: 20,
  tileW: 64,
  tileH: 32,
  offsetX: 0,
  offsetY: 0,
  playerScale: 1,
  npcScale: 1,
};

export const ACADEMY_MAP_BASE_DIMENSIONS = { width: 2816, height: 1536 } as const;
export const ACADEMY_ISOMETRIC_GRID: IsoMapGridConfig = {
  cols: 24,
  rows: 20,
  tileW: 128,
  tileH: 69.5,
  offsetX: 0,
  offsetY: 0,
  playerScale: 1,
  npcScale: 1,
};

export function isoMapBoardSize(
  grid: IsoMapGridConfig,
  baseWidth = 0,
  baseHeight = 0,
): { width: number; height: number } {
  const projectedWidth = (grid.cols + grid.rows - 2) * grid.tileW / 2 + grid.tileW;
  const projectedHeight = (grid.cols + grid.rows - 2) * grid.tileH / 2 + grid.tileH + 7;
  return {
    width: Math.max(projectedWidth, baseWidth),
    height: Math.max(projectedHeight, baseHeight),
  };
}

export function isoCellKey(x: number, y: number): string {
  return x + "," + y;
}

export function isoMapStorageKey(mapId: string): string {
  return "merzkava.isometric-map-editor.v2:" + encodeURIComponent(mapId);
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
}

function cleanCells(value: unknown, grid: IsoMapGridConfig): string[] {
  if (!Array.isArray(value)) return [];
  const result = new Set<string>();
  for (const item of value) {
    const match = /^(\d+),(\d+)$/.exec(String(item));
    if (!match) continue;
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (x >= 0 && x < grid.cols && y >= 0 && y < grid.rows) result.add(isoCellKey(x, y));
  }
  return [...result];
}

export function createIsoMapEditorData(
  mapId: string,
  grid: IsoMapGridConfig = DEFAULT_ISOMETRIC_GRID,
): IsoMapEditorData {
  return {
    format: "merzkava-isometric-map-editor",
    version: 1,
    mapId,
    grid: { ...grid },
    foregroundCells: [],
    blockedCells: [],
    opacityCells: [],
    transitions: [],
  };
}

export function normalizeIsoMapEditorData(
  value: unknown,
  mapId: string,
  fallbackGrid: IsoMapGridConfig = DEFAULT_ISOMETRIC_GRID,
): IsoMapEditorData {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawGrid = source.grid && typeof source.grid === "object"
    ? source.grid as Record<string, unknown>
    : {};
  const grid: IsoMapGridConfig = {
    cols: Math.round(clamp(rawGrid.cols, 1, 128, fallbackGrid.cols)),
    rows: Math.round(clamp(rawGrid.rows, 1, 128, fallbackGrid.rows)),
    tileW: clamp(rawGrid.tileW, 16, 256, fallbackGrid.tileW),
    tileH: clamp(rawGrid.tileH, 8, 128, fallbackGrid.tileH),
    offsetX: clamp(rawGrid.offsetX, -2000, 2000, fallbackGrid.offsetX),
    offsetY: clamp(rawGrid.offsetY, -2000, 2000, fallbackGrid.offsetY),
    playerScale: clamp(rawGrid.playerScale, 0.25, 3, fallbackGrid.playerScale),
    npcScale: clamp(rawGrid.npcScale, 0.25, 3, fallbackGrid.npcScale),
  };
  const transitions = Array.isArray(source.transitions)
    ? source.transitions.flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const marker = item as Record<string, unknown>;
      const x = Math.floor(Number(marker.x));
      const y = Math.floor(Number(marker.y));
      if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x >= grid.cols || y < 0 || y >= grid.rows) return [];
      return [{
        id: String(marker.id || "transition-import-" + index).slice(0, 96),
        x,
        y,
        label: String(marker.label || "").slice(0, 80),
      }];
    })
    : [];

  return {
    format: "merzkava-isometric-map-editor",
    version: 1,
    mapId,
    grid,
    foregroundCells: cleanCells(source.foregroundCells, grid),
    blockedCells: cleanCells(source.blockedCells, grid),
    opacityCells: cleanCells(source.opacityCells, grid),
    transitions,
  };
}

export function toggleIsoCellLayer(
  data: IsoMapEditorData,
  layer: IsoCellLayer,
  x: number,
  y: number,
): boolean {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= data.grid.cols || y >= data.grid.rows) {
    return false;
  }
  const key = isoCellKey(x, y);
  const cells = new Set(data[layer]);
  const enabled = !cells.has(key);
  if (enabled) cells.add(key);
  else cells.delete(key);
  data[layer] = [...cells];
  return enabled;
}

export function isoCellHasLayer(
  data: IsoMapEditorData,
  layer: IsoCellLayer,
  x: number,
  y: number,
): boolean {
  return data[layer].includes(isoCellKey(x, y));
}

export function isoCellCenter(
  x: number,
  y: number,
  grid: IsoMapGridConfig,
): IsoMapPoint {
  const halfW = grid.tileW / 2;
  const halfH = grid.tileH / 2;
  return {
    x: (x - y) * halfW + grid.rows * halfW + grid.offsetX,
    y: (x + y) * halfH + grid.offsetY + halfH,
  };
}

/** Resolve a pointer position to the isometric diamond cell under it. */
export function isoCellAtPoint(
  point: IsoMapPoint,
  grid: IsoMapGridConfig,
): { x: number; y: number } | null {
  const halfW = grid.tileW / 2;
  const halfH = grid.tileH / 2;
  if (halfW <= 0 || halfH <= 0) return null;

  const dx = (point.x - (grid.rows * halfW + grid.offsetX)) / halfW;
  const dy = (point.y - grid.offsetY - halfH) / halfH;
  const worldX = (dx + dy) / 2;
  const worldY = (dy - dx) / 2;
  const x = Math.round(worldX);
  const y = Math.round(worldY);
  const distance = Math.abs(worldX - x) + Math.abs(worldY - y);

  if (distance > 1.000001 || x < 0 || y < 0 || x >= grid.cols || y >= grid.rows) return null;
  return { x, y };
}
