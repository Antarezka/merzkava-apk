import type { IsoMapEditorData } from "./isometric-map-editor";

export type IsoActorCell = { x: number; y: number };

const EDGE_QUADRANTS: Record<string, readonly [string, string]> = {
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

  const blockedEdge = (x: number, y: number, side: string): boolean =>
    data.blockedQuadrants.some(key => key.startsWith(x + "," + y + ":" + side + "-"));

  return !blockedEdge(player.x, player.y, edge[0]) &&
    !blockedEdge(npc.x, npc.y, edge[1]);
}
