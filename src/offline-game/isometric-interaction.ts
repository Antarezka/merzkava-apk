import { isoCellCenter, type IsoMapEditorData, type IsoMapGridConfig, type IsoMapPoint, type IsoQuadrant } from "./isometric-map-editor";

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


export type IsoQuadrantNode = { x: number; y: number; quadrant: IsoQuadrant };
export type IsoGridPosition = { x: number; y: number };

const ISO_QUADRANT_ORDER: readonly IsoQuadrant[] = [
  "tl-a", "tl-b", "tr-a", "tr-b", "bl-a", "bl-b", "br-a", "br-b",
];

const ISO_QUADRANT_OFFSETS: Record<IsoQuadrant, IsoGridPosition> = {
  "tl-a": { x: -1 / 3, y: -1 / 6 },
  "tl-b": { x: -1 / 3, y: 1 / 6 },
  "tr-a": { x: -1 / 6, y: -1 / 3 },
  "tr-b": { x: 1 / 6, y: -1 / 3 },
  "bl-a": { x: -1 / 6, y: 1 / 3 },
  "bl-b": { x: 1 / 6, y: 1 / 3 },
  "br-a": { x: 1 / 3, y: -1 / 6 },
  "br-b": { x: 1 / 3, y: 1 / 6 },
};

/** Center point of one of the eight triangular sub-sectors, in fractional grid coordinates. */
export function isoQuadrantCenterGridPosition(
  cellX: number,
  cellY: number,
  quadrant: IsoQuadrant,
): IsoGridPosition {
  const offset = ISO_QUADRANT_OFFSETS[quadrant];
  return { x: cellX + offset.x, y: cellY + offset.y };
}

function isoCellIsWalkableForQuadrant(data: IsoMapEditorData, x: number, y: number): boolean {
  const key = x + "," + y;
  const configured = (
    (x >= 0 && y >= 0 && x < data.grid.cols && y < data.grid.rows) ||
    data.customGridCells.includes(key)
  );
  return configured &&
    (!data.walkableAreaEnabled || data.walkableCells.includes(key)) &&
    !data.blockedCells.includes(key);
}

/** A sector is traversable only if its cell is walkable and that exact triangle is not blocked. */
export function isIsoQuadrantWalkable(
  data: IsoMapEditorData,
  x: number,
  y: number,
  quadrant: IsoQuadrant,
): boolean {
  return isoCellIsWalkableForQuadrant(data, x, y) &&
    !data.blockedQuadrants.includes(x + "," + y + ":" + quadrant);
}

/** Choose the nearest open sector when an actor is first placed at a cell center. */
export function nearestWalkableIsoQuadrant(
  data: IsoMapEditorData,
  cellX: number,
  cellY: number,
  position: IsoGridPosition,
): IsoQuadrant | null {
  let best: IsoQuadrant | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const quadrant of ISO_QUADRANT_ORDER) {
    if (!isIsoQuadrantWalkable(data, cellX, cellY, quadrant)) continue;
    const center = isoQuadrantCenterGridPosition(cellX, cellY, quadrant);
    const distance = (center.x - position.x) ** 2 + (center.y - position.y) ** 2;
    if (distance < bestDistance) {
      best = quadrant;
      bestDistance = distance;
    }
  }
  return best;
}

const ISO_INTRA_CELL_NEIGHBORS: Record<IsoQuadrant, readonly IsoQuadrant[]> = {
  "tl-a": ["tl-b", "tr-a"],
  "tl-b": ["tl-a", "bl-a"],
  "tr-a": ["tl-a", "tr-b"],
  "tr-b": ["tr-a", "br-a"],
  "bl-a": ["tl-b", "bl-b"],
  "bl-b": ["bl-a", "br-b"],
  "br-a": ["tr-b", "br-b"],
  "br-b": ["br-a", "bl-b"],
};

const ISO_HALF_EDGE_NEIGHBOR: Partial<Record<IsoQuadrant, { dx: number; dy: number; quadrant: IsoQuadrant }>> = {
  "tl-a": { dx: -1, dy: 0, quadrant: "br-a" },
  "tl-b": { dx: -1, dy: 0, quadrant: "br-b" },
  "tr-a": { dx: 0, dy: -1, quadrant: "bl-a" },
  "tr-b": { dx: 0, dy: -1, quadrant: "bl-b" },
  "bl-a": { dx: 0, dy: 1, quadrant: "tr-a" },
  "bl-b": { dx: 0, dy: 1, quadrant: "tr-b" },
  "br-a": { dx: 1, dy: 0, quadrant: "tl-a" },
  "br-b": { dx: 1, dy: 0, quadrant: "tl-b" },
};

function isoQuadrantNodeKey(node: IsoQuadrantNode): string {
  return node.x + "," + node.y + ":" + node.quadrant;
}

/**
 * Deterministic breadth-first path over the eight triangular sectors in every cell.
 * A shared cell edge has two independent half-edges; only the matching pair of
 * unblocked triangles can cross that half. This lets actors route around blocked
 * quadrants without weakening the editor's walkable-cell whitelist.
 */
export function findIsoQuadrantPath(
  data: IsoMapEditorData,
  start: IsoQuadrantNode,
  destination: IsoQuadrantNode,
  occupiedCells: readonly string[] = [],
): IsoQuadrantNode[] | null {
  if (!isIsoQuadrantWalkable(data, start.x, start.y, start.quadrant) ||
      !isIsoQuadrantWalkable(data, destination.x, destination.y, destination.quadrant)) return null;

  const occupied = new Set(occupiedCells);
  const destinationCell = destination.x + "," + destination.y;
  if (occupied.has(destinationCell) && destinationCell !== start.x + "," + start.y) return null;

  const canVisit = (node: IsoQuadrantNode): boolean => {
    const cell = node.x + "," + node.y;
    return (cell === start.x + "," + start.y || !occupied.has(cell)) &&
      isIsoQuadrantWalkable(data, node.x, node.y, node.quadrant);
  };

  const queue: IsoQuadrantNode[] = [start];
  const startKey = isoQuadrantNodeKey(start);
  const destinationKey = isoQuadrantNodeKey(destination);
  const previous = new Map<string, string | null>([[startKey, null]]);
  const nodes = new Map<string, IsoQuadrantNode>([[startKey, start]]);

  for (let cursor = 0; cursor < queue.length; cursor++) {
    const current = queue[cursor];
    const currentKey = isoQuadrantNodeKey(current);
    if (currentKey === destinationKey) break;

    const nextNodes: IsoQuadrantNode[] = ISO_INTRA_CELL_NEIGHBORS[current.quadrant]
      .map(quadrant => ({ x: current.x, y: current.y, quadrant }));
    const exit = ISO_HALF_EDGE_NEIGHBOR[current.quadrant];
    if (exit) {
      nextNodes.push({
        x: current.x + exit.dx,
        y: current.y + exit.dy,
        quadrant: exit.quadrant,
      });
    }

    for (const next of nextNodes) {
      const key = isoQuadrantNodeKey(next);
      if (previous.has(key) || !canVisit(next)) continue;
      previous.set(key, currentKey);
      nodes.set(key, next);
      queue.push(next);
    }
  }

  if (!previous.has(destinationKey)) return null;
  const path: IsoQuadrantNode[] = [];
  let cursor: string | null = destinationKey;
  while (cursor) {
    const node = nodes.get(cursor);
    if (!node) return null;
    path.unshift(node);
    cursor = previous.get(cursor) ?? null;
  }
  return path;
}
