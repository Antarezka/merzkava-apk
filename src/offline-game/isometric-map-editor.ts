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
export type IsoQuadrantParent = "tl" | "tr" | "bl" | "br";
export type IsoQuadrant = "tl-a" | "tl-b" | "tr-a" | "tr-b" | "bl-a" | "bl-b" | "br-a" | "br-b";
const ISO_QUADRANT_CHILDREN: Record<IsoQuadrantParent, readonly [IsoQuadrant, IsoQuadrant]> = {
  tl: ["tl-a", "tl-b"], tr: ["tr-a", "tr-b"], bl: ["bl-a", "bl-b"], br: ["br-a", "br-b"],
};
export type IsoQuadrantLayer = "foregroundQuadrants" | "blockedQuadrants" | "opacityQuadrants";
export type IsoWalkableCellGroup = { id: string; cells: string[] };

export type IsoTransitionMarker = {
  id: string;
  x: number;
  y: number;
  label: string;
  targetRegion?: string;
};

export type IsoMapEditorData = {
  format: "merzkava-isometric-map-editor";
  version: 1;
  mapId: string;
  grid: IsoMapGridConfig;
  /** Optional camera focal point in Map Base pixel coordinates. */
  cameraCenter?: { x: number; y: number };
  foregroundCells: string[];
  blockedCells: string[];
  opacityCells: string[];
  /** Optional movement whitelist; when enabled, only these image cells are traversable. */
  walkableCells: string[];
  /** Additional image cells beyond the original rectangular grid bounds. */
  customGridCells: string[];
  /** Connected sets of walkable diamonds merged into one logical area/cell. */
  walkableCellGroups: IsoWalkableCellGroup[];
  walkableAreaEnabled: boolean;
  /** Fine-grained sector flags use keys such as "4,7:tl-a"; legacy parent keys expand on import. */
  foregroundQuadrants: string[];
  blockedQuadrants: string[];
  opacityQuadrants: string[];
  confirmed: boolean;
  confirmedAt: string;
  transitions: IsoTransitionMarker[];
  purpose?: "AI_UPDATE_REFERENCE";
  mapTitle?: string;
  mapBase?: { src: string; width: number; height: number };
  notes?: {
    cellSectorOrder?: string[];
    quadrantKeys?: string;
    transitionColors?: string;
    walkableCellGroups?: string;
    customGridCells?: string;
    cellPlacement?: string;
    canvasExpansion?: string;
  };
};

export type IsoMapPoint = { x: number; y: number };

export type IsoCanvasExpansion = { top: number; bottom: number; left: number; right: number };
export const DEFAULT_ISO_CANVAS_EXPANSION: IsoCanvasExpansion = { top: 0, bottom: 0, left: 800, right: 0 };
export function normalizeIsoCanvasExpansion(value: unknown): IsoCanvasExpansion {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const read = (side: keyof IsoCanvasExpansion) => Math.round(clamp(source[side], 0, 12000, DEFAULT_ISO_CANVAS_EXPANSION[side]));
  return { top: read("top"), bottom: read("bottom"), left: read("left"), right: read("right") };
}

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
    walkableCells: [],
    customGridCells: [],
    walkableCellGroups: [],
    walkableAreaEnabled: false,
    foregroundQuadrants: [],
    blockedQuadrants: [],
    opacityQuadrants: [],
    confirmed: false,
    confirmedAt: "",
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
  const customGridCells = Array.isArray(source.customGridCells)
    ? [...new Set(source.customGridCells.flatMap(item=>{
        const match=/^(-?\d+),(-?\d+)$/.exec(String(item));if(!match)return [];
        const x=Number(match[1]),y=Number(match[2]);
        if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||Math.abs(x)>512||Math.abs(y)>512)return [];
        if(x>=0&&x<grid.cols&&y>=0&&y<grid.rows)return [];
        return [isoCellKey(x,y)];
      }))]
    : [];
  const isConfiguredCell=(x:number,y:number)=>(
    (x>=0&&y>=0&&x<grid.cols&&y<grid.rows)||customGridCells.includes(isoCellKey(x,y))
  );
  const transitions = Array.isArray(source.transitions)
    ? source.transitions.flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const marker = item as Record<string, unknown>;
      const x = Math.floor(Number(marker.x));
      const y = Math.floor(Number(marker.y));
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isInteger(x) || !Number.isInteger(y) || !isConfiguredCell(x,y)) return [];
      return [{
        id: String(marker.id || "transition-import-" + index).slice(0, 96),
        x,
        y,
        label: String(marker.label || "").slice(0, 80),
        ...(typeof marker.targetRegion==="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(marker.targetRegion.trim())
          ?{targetRegion:marker.targetRegion.trim().toLowerCase().slice(0,80)}:{}),
      }];
    })
    : [];

  const cleanQuadrants = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    const result = new Set<string>();
    for (const item of value) {
      const match = /^(-?[0-9]+),(-?[0-9]+):(tl|tr|bl|br)(?:-([ab]))?$/.exec(String(item));
      if (!match) continue;
      const x = Number(match[1]), y = Number(match[2]), parent = match[3] as IsoQuadrantParent;
      if (!isConfiguredCell(x,y)) continue;
      const child = match[4];
      if (child) result.add(isoCellKey(x,y) + ":" + parent + "-" + child);
      else ISO_QUADRANT_CHILDREN[parent].forEach(sector => result.add(isoCellKey(x,y) + ":" + sector));
    }
    return [...result];
  };
  const baseWalkableCells = cleanCells(source.walkableCells, grid);
  const rawWalkableCells=Array.isArray(source.walkableCells)?source.walkableCells.map(String):[];
  const allowedWalkableExtras=customGridCells.filter(key=>rawWalkableCells.includes(key));
  const walkableCells=[...new Set([...baseWalkableCells,...allowedWalkableExtras])];
  const walkableSet = new Set(walkableCells);
  const cleanGroupCells=(value:unknown)=>[...new Set([...cleanCells(value,grid),...(Array.isArray(value)?customGridCells.filter(key=>(value as unknown[]).map(String).includes(key)):[])])];
  const usedGroupCells = new Set<string>();
  const walkableCellGroups: IsoWalkableCellGroup[] = Array.isArray(source.walkableCellGroups)
    ? source.walkableCellGroups.flatMap((item,index)=>{
      if(!item||typeof item!=="object")return [];
      const group=item as Record<string,unknown>;
      const cells=cleanGroupCells(group.cells).filter(cell=>walkableSet.has(cell)&&!usedGroupCells.has(cell));
      if(cells.length<2||!isoWalkableCellsConnected(cells))return [];
      cells.forEach(cell=>usedGroupCells.add(cell));
      return [{id:String(group.id||"merged-cell-"+index).replace(/[^a-zA-Z0-9_-]/g,"").slice(0,64)||"merged-cell-"+index,cells}];
    })
    : [];
  const notes: NonNullable<IsoMapEditorData["notes"]> = {};
  const rawNotes = source.notes && typeof source.notes === "object"
    ? source.notes as Record<string, unknown>
    : null;
  if (rawNotes) {
    if (Array.isArray(rawNotes.cellSectorOrder)) notes.cellSectorOrder = rawNotes.cellSectorOrder.filter(item => typeof item === "string").slice(0, 8) as string[];
    if (typeof rawNotes.quadrantKeys === "string") notes.quadrantKeys = rawNotes.quadrantKeys.slice(0, 800);
    if (typeof rawNotes.transitionColors === "string") notes.transitionColors = rawNotes.transitionColors.slice(0, 800);
    if (typeof rawNotes.walkableCellGroups === "string") notes.walkableCellGroups = rawNotes.walkableCellGroups.slice(0, 800);
    if (typeof rawNotes.customGridCells === "string") notes.customGridCells = rawNotes.customGridCells.slice(0, 800);
    if (typeof rawNotes.cellPlacement === "string") notes.cellPlacement = rawNotes.cellPlacement.slice(0, 800);
    if (typeof rawNotes.canvasExpansion === "string") notes.canvasExpansion = rawNotes.canvasExpansion.slice(0, 800);
  }
  return {
    format: "merzkava-isometric-map-editor",
    version: 1,
    mapId,
    grid,
    ...(source.cameraCenter && typeof source.cameraCenter === "object" &&
      Number.isFinite(Number((source.cameraCenter as Record<string, unknown>).x)) &&
      Number.isFinite(Number((source.cameraCenter as Record<string, unknown>).y)) ? {
        cameraCenter: {
          x: clamp((source.cameraCenter as Record<string, unknown>).x, 0, 20000, 0),
          y: clamp((source.cameraCenter as Record<string, unknown>).y, 0, 20000, 0),
        }
      } : {}),
    foregroundCells: cleanCells(source.foregroundCells, grid),
    blockedCells: cleanCells(source.blockedCells, grid),
    opacityCells: cleanCells(source.opacityCells, grid),
    walkableCells,
    customGridCells,
    walkableCellGroups,
    walkableAreaEnabled: source.walkableAreaEnabled === true,
    foregroundQuadrants: cleanQuadrants(source.foregroundQuadrants),
    blockedQuadrants: cleanQuadrants(source.blockedQuadrants),
    opacityQuadrants: cleanQuadrants(source.opacityQuadrants),
    confirmed: source.confirmed === true,
    confirmedAt: source.confirmed === true ? String(source.confirmedAt || "").slice(0, 48) : "",
    transitions,
    ...(source.purpose === "AI_UPDATE_REFERENCE" ? { purpose: "AI_UPDATE_REFERENCE" as const } : {}),
    ...(typeof source.mapTitle === "string" ? { mapTitle: source.mapTitle.slice(0, 120) } : {}),
    ...(source.mapBase && typeof source.mapBase === "object" ? {
      mapBase: {
        src: String((source.mapBase as Record<string, unknown>).src || "").slice(0, 240),
        width: Math.round(clamp((source.mapBase as Record<string, unknown>).width, 1, 20000, 1)),
        height: Math.round(clamp((source.mapBase as Record<string, unknown>).height, 1, 20000, 1)),
      }
    } : {}),
    ...(Object.keys(notes).length ? { notes } : {}),
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

function isoWalkableCellsConnected(cells: string[]): boolean {
  if(cells.length<2)return false;
  const remaining=new Set(cells);
  const first=remaining.values().next().value as string|undefined;
  if(!first)return false;
  const queue=[first];remaining.delete(first);
  for(let index=0;index<queue.length;index++){
    const [x,y]=queue[index].split(",").map(Number);
    for(const neighbor of [isoCellKey(x+1,y),isoCellKey(x-1,y),isoCellKey(x,y+1),isoCellKey(x,y-1)]){
      if(remaining.has(neighbor)){remaining.delete(neighbor);queue.push(neighbor);}
    }
  }
  return remaining.size===0;
}

/** Add selected adjacent walkable diamonds as one flexible merged logical cell. */
export function mergeIsoWalkableCells(
  data: IsoMapEditorData,
  selectedCells: string[],
  id = "merged-cell",
): IsoWalkableCellGroup | null {
  const selected=new Set([...new Set(selectedCells)].filter(key=>data.walkableCells.includes(key)));
  if(selected.size<2)return null;
  // Selecting any member of an existing group absorbs that whole group, so
  // existing merged zones can be joined without rigid unmerge/rebuild steps.
  let expanded=true;
  while(expanded){
    expanded=false;
    for(const group of data.walkableCellGroups){
      if(group.cells.some(key=>selected.has(key))){
        for(const key of group.cells)if(!selected.has(key)){selected.add(key);expanded=true;}
      }
    }
  }
  const cells=[...selected];
  if(cells.length<2||!isoWalkableCellsConnected(cells))return null;
  const absorbed=new Set(cells);
  const group={id:id.replace(/[^a-zA-Z0-9_-]/g,"").slice(0,64)||"merged-cell",cells};
  data.walkableCellGroups=[...data.walkableCellGroups.filter(item=>!item.cells.some(key=>absorbed.has(key))),group];
  return group;
}

/** Split the merged logical cell containing the specified map cell. */
export function unmergeIsoWalkableCell(
  data: IsoMapEditorData,
  x: number,
  y: number,
): IsoWalkableCellGroup | null {
  const key=isoCellKey(x,y);
  const group=data.walkableCellGroups.find(item=>item.cells.includes(key));
  if(!group)return null;
  data.walkableCellGroups=data.walkableCellGroups.filter(item=>item.id!==group.id);
  return group;
}

/** Remove a walkable cell from its whitelist and any merged group. */
export function removeIsoWalkableCell(data: IsoMapEditorData,x:number,y:number):boolean {
  const key=isoCellKey(x,y);
  if(!data.walkableCells.includes(key))return false;
  data.walkableCells=data.walkableCells.filter(item=>item!==key);
  data.walkableCellGroups=data.walkableCellGroups.flatMap(group=>{
    const cells=group.cells.filter(item=>item!==key);
    return cells.length>=2&&isoWalkableCellsConnected(cells)?[{...group,cells}]:[];
  });
  return true;
}

export function isoQuadrantKey(x: number, y: number, quadrant: IsoQuadrant): string {
  return isoCellKey(x, y) + ":" + quadrant;
}

export function toggleIsoQuadrantLayer(
  data: IsoMapEditorData,
  layer: IsoQuadrantLayer,
  x: number,
  y: number,
  quadrant: IsoQuadrant,
): boolean {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !((x>=0&&y>=0&&x<data.grid.cols&&y<data.grid.rows)||data.customGridCells.includes(isoCellKey(x,y)))) return false;
  const key = isoQuadrantKey(x, y, quadrant);
  const cells = new Set(data[layer]);
  const enabled = !cells.has(key);
  if (enabled) cells.add(key); else cells.delete(key);
  data[layer] = [...cells];
  return enabled;
}

export function isoQuadrantHasLayer(
  data: IsoMapEditorData,
  layer: IsoQuadrantLayer,
  x: number,
  y: number,
  quadrant: IsoQuadrant,
): boolean {
  return data[layer].includes(isoQuadrantKey(x, y, quadrant));
}

/** Treat either child sector as occupying its former parent zone for tile-edge collision. */
export function isoQuadrantHasParentLayer(
  data: IsoMapEditorData,
  layer: IsoQuadrantLayer,
  x: number,
  y: number,
  parent: IsoQuadrantParent,
): boolean {
  return ISO_QUADRANT_CHILDREN[parent].some(sector => isoQuadrantHasLayer(data, layer, x, y, sector));
}

/** Resolve a point inside a diamond to one of eight triangular sub-sectors. */
export function isoQuadrantAtPoint(
  point: IsoMapPoint,
  cellX: number,
  cellY: number,
  grid: IsoMapGridConfig,
): IsoQuadrant {
  const center = isoCellCenter(cellX, cellY, grid);
  const dx = point.x - center.x, dy = point.y - center.y;
  const xRatio = Math.abs(dx) / Math.max(1, grid.tileW / 2);
  const yRatio = Math.abs(dy) / Math.max(1, grid.tileH / 2);
  if (dx <= 0 && dy <= 0) return xRatio <= yRatio ? "tl-a" : "tl-b";
  if (dx > 0 && dy <= 0) return xRatio <= yRatio ? "tr-a" : "tr-b";
  if (dx <= 0 && dy > 0) return xRatio >= yRatio ? "bl-a" : "bl-b";
  return xRatio >= yRatio ? "br-a" : "br-b";
}

/** Distinguish a deliberate cell tap from a map-pan gesture. */
export function isoPointerGesture(
  start: IsoMapPoint,
  end: IsoMapPoint,
  threshold = 8,
): "tap" | "drag" {
  return Math.hypot(end.x - start.x, end.y - start.y) < threshold ? "tap" : "drag";
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

/** Convert screen coordinates directly through the rendered Map Base image bounds. */
export function isoClientToImagePoint(
  clientX: number,
  clientY: number,
  image: { left: number; top: number; width: number; height: number; naturalWidth: number; naturalHeight: number },
): IsoMapPoint | null {
  if (image.width <= 0 || image.height <= 0 || image.naturalWidth <= 0 || image.naturalHeight <= 0) return null;
  return {
    x: (clientX - image.left) * image.naturalWidth / image.width,
    y: (clientY - image.top) * image.naturalHeight / image.height,
  };
}

/** Resolve a pointer position to the isometric diamond cell under it. */
export function isoCellAtPoint(
  point: IsoMapPoint,
  grid: IsoMapGridConfig,
  allowOutsideGrid = false,
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

  if (distance > 1.000001 || (!allowOutsideGrid && (x < 0 || y < 0 || x >= grid.cols || y >= grid.rows))) return null;
  return { x, y };
}
