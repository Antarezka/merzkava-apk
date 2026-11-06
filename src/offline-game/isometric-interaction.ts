import { isoCellCenter, type IsoMapEditorData, type IsoMapGridConfig, type IsoMapPoint } from "./isometric-map-editor";

export type IsoActorCell = { x: number; y: number };

type IsoQuadrantEdge = "tl" | "tr" | "bl" | "br";

/** A narrow X sector blocks only half an edge; the whole edge is closed only when both halves are marked. */
export function isIsoQuadrantEdgeFullyBlocked(data: IsoMapEditorData, x: number, y: number, edge: IsoQuadrantEdge): boolean {
  const prefix = x + "," + y + ":" + edge + "-";
  return data.blockedQuadrants.includes(prefix + "a") && data.blockedQuadrants.includes(prefix + "b");
}

const EDGE_QUADRANTS: Record<string, readonly [IsoQuadrantEdge, IsoQuadrantEdge]> = {
  "1,0": ["br", "tl"],
  "-1,0": ["tl", "br"],
  "0,1": ["bl", "tr"],
  "0,-1": ["tr", "bl"],
};

/**
 * NPC interaction is available only from a directly adjacent, open grid cell.
 * Uses the same walkable whitelist, blocked cells, and blocked quadrant edges
 * as the isometric movement system.
 */
export function isNpcInteractionCellReachable(
  data: IsoMapEditorData,
  player: IsoActorCell,
  npc: IsoActorCell,
): boolean {
  if (![player.x, player.y, npc.x, npc.y].every(Number.isInteger)) return false;

  const dx = npc.x - player.x;
  const dy = npc.y - player.y;
  const edge = EDGE_QUADRANTS[dx + "," + dy];
  if (!edge) return false;

  const configuredCell = (x: number, y: number): boolean =>
    (x >= 0 && y >= 0 && x < data.grid.cols && y < data.grid.rows) ||
    data.customGridCells.includes(x + "," + y);

  const walkableCell = (x: number, y: number): boolean => {
    const key = x + "," + y;
    return configuredCell(x, y) &&
      (!data.walkableAreaEnabled || data.walkableCells.includes(key)) &&
      !data.blockedCells.includes(key);
  };

  if (!walkableCell(player.x, player.y) || !walkableCell(npc.x, npc.y)) return false;

  return !isIsoQuadrantEdgeFullyBlocked(data, player.x, player.y, edge[0]) &&
    !isIsoQuadrantEdgeFullyBlocked(data, npc.x, npc.y, edge[1]);
}

/** Resolve an image-space tap to a safe fractional point inside one diamond. */
export function isoSubcellPositionAtPoint(
  point: IsoMapPoint,
  cellX: number,
  cellY: number,
  grid: IsoMapGridConfig,
): { x: number; y: number } | null {
  if (![point.x, point.y, cellX, cellY, grid.tileW, grid.tileH].every(Number.isFinite) ||
      grid.tileW <= 0 || grid.tileH <= 0) return null;
  const center = isoCellCenter(cellX, cellY, grid);
  const dx = (point.x - center.x) / (grid.tileW / 2);
  const dy = (point.y - center.y) / (grid.tileH / 2);
  const offsetX = (dx + dy) / 2;
  const offsetY = (dy - dx) / 2;
  const distance = Math.abs(offsetX) + Math.abs(offsetY);
  if (distance > 1.000001) return null;
  const inset = distance > 0.86 ? 0.86 / distance : 1;
  return { x: cellX + offsetX * inset, y: cellY + offsetY * inset };
}
