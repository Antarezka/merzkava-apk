# Shared Isometric Map Editor

The isometric map editor is a reusable editor/runtime contract. It is not Academy-specific. Any isometric map board can use the same editor by supplying a stable data-map-id, its base artwork (when it has a complete JPG/PNG Map Base), grid dimensions, and the standard editor controls. For the full runtime handoff covering NPC movement, interactions/chat, combat integration, sonar design and current unfinished controls, see [ISOMETRIC_FIELD_SYSTEM.md](./ISOMETRIC_FIELD_SYSTEM.md).

## Artwork and render order

- Use one complete map image as the Map Base. Do not require separate foreground fragments or modify the source JPG/PNG.
- The complete Map Base renders beneath Player and NPC.
- A cell with foreground priority (`○`) is clipped as a diamond from the same Map Base image and redrawn in a transparent foreground canvas above Player/NPC.
- The foreground canvas redraws only marked cells. Unmarked neighboring cells remain below characters.
- The canvas mask is regenerated when the grid or foreground-cell metadata changes.

## Independent cell metadata

Each cell may independently carry any combination of these flags. The editor can add and delete walkable cells one tap at a time. ADD CELL is not limited to the original cols×rows rectangle: tap an ungridded point on the Map Base artwork to place one additional diamond at the nearest isometric coordinate. The full diamond must fit within the image bounds; canvas expansion margins and blank canvas are never eligible. These sparse extra coordinates are stored in customGridCells and do not resize the image or canvas. Several adjacent cells may be selected and merged into one flexible logical cell group, including bent or uneven shapes; existing groups can be extended by merging again or split with UNMERGE. A transparent pointer-capture plane covers the complete Map Base-sized overlay, so ADD CELL can respond anywhere on the ungridded artwork instead of only on existing grid diamonds. New cells are accepted when the tap and cell center lie on the artwork; cells near image edges may extend partly beyond the image, but blank canvas margins are never eligible. A drag pans the map and is never treated as a tap. When walkableAreaEnabled is turned on, Player and NPC movement is restricted to the selected blue base and custom cells. Keep the limit off while painting, then enable it after the route is complete.

| Flag | Editor mode | Runtime behavior |
|---|---|---|
| Walkable region | `▧ Walkable area brush` | Added blue cells form the movement whitelist; connected cells can be stored together as a merged logical area |
| Foreground | `○ Foreground` | Redraw the selected image sector above characters |
| Blocked | `X Blocked quadrants` | Prevent movement across the corresponding isometric edge |
| Opacity | `◌ Character opacity quadrants` | Characters become translucent while occupying a cell with an opacity sector |

Each main isometric diamond is divided into eight triangular sub-sectors: two inside each of the four former parent sectors (top-left, top-right, bottom-left, bottom-right). Foreground, blocked, and opacity markers can be applied independently to any one of the eight sub-sectors, with keys such as 4,7:tl-a and 4,7:tl-b. Older saved keys such as 4,7:tl are automatically expanded to both child sub-sectors so existing markings remain intact. For a cardinal grid step, either blocked child sub-sector within the relevant exit zone of the source cell or matching entry zone of the destination cell continues to block movement.

## Grid calibration

Each map stores its own grid configuration: columns, rows, cell width/height, X/Y offsets, and Player/NPC scale. Cells are diamond-shaped in isometric projection. The grid is editor metadata and does not alter the Map Base artwork.

## Area transitions

Each map stores transition markers independently. An unnamed marker is red; after a destination label is applied, it becomes blue. Labels are limited to 80 characters. Markers can be selected, renamed, deleted, exported, and imported.

## Persistence and reuse

Editor data is saved in local storage under `merzkava.isometric-map-editor.v2:<encoded map ID>`. Exported JSON uses format `merzkava-isometric-map-editor`, version 1, and contains the map ID, grid, walkable cells and activation flag, merged walkable cell groups (each with its own ID and component coordinates), customGridCells for individually placed diamonds outside the original grid rectangle, three whole-cell arrays, three quadrant arrays, and transitions. Custom cells remain valid movement nodes and can also carry quadrant flags and transition markers. An AI can preserve or extend a merged group by using its group ID and component cell coordinates. Grid calibration affects only the transparent image overlay; it does not resize the source artwork or the separately configured canvas expansion margins.

Use unique stable map IDs for each exterior, interior, or other isometric scene. Do not reuse one ID for different map artwork. A map board that has no base image can still use grid, collision, opacity, and transition data; foreground rendering becomes active when a base image is supplied.

## Current map rollout

- **Tianhai Academy exterior:** source artwork is `public/maps/academy/full-map/1_academy.jpg`. It remains the sole visual Map Base; the old procedural pond, path, garden, and building-footprint decorations are removed from this image-backed board. Transparent diamond cells remain interaction/editor geometry only. The floating editor grid covers the artwork bounds, while image and canvas expansion gaps remain unchanged. Camera zoom, centering, and the complete editor workbench live inside one right-side retractable field drawer with a pull lever. The editor retains ADD CELL, DELETE CELL, SELECT & MERGE, UNMERGE, eight-sub-sector X/blocked/opacity tools, grid calibration, and clickable red/blue transition markers. Player/NPC movement uses the same coordinate grid, walkable whitelist, blocked-edge pathfinding, wandering constraints, and existing choice-based NPC conversation flow, now shown in a lower dialogue box.
- The source artwork is **2816×1536 px**. The Academy grid remains **24×20 cells of 128×69.5 px**. `src/offline-game/tianhai-academy-map-reference.ts` contains the owner-supplied `AI_UPDATE_REFERENCE` for this map: selected walkable/custom cells, all three eight-sector marker layers, transition coordinates/labels, image metadata, and notes. The app seeds this reference into Academy map storage once; future local edits are preserved and the reference is not silently reapplied. Its `confirmed:false` state remains intact until explicitly confirmed. The Player begins at the named Golden Dragon Empire gateway cell `(12,31)`. The two gateway markers are at `(11,31)` and `(12,31)`; the dialogue and event markers remain at `(9,3)` and `(14,-5)`.
- The shared glass HUD reports day, 12-hour time, cycle, weather, and current grid X/Y on every isometric area. The compact minimap is reserved for outdoor wilderness and transit/field-route maps; Academy and other campus, town, city, market, harbor, arena, and interior screens keep the HUD without a minimap. Where shown, the minimap mirrors the corresponding map geometry, walkable areas, marker layers, transition colors, and live actor positions. Character opacity and depth order remain controlled through CSS variables so editor flags are not overridden by the global token style.
- **Golden Dragon Empire, Tianhai Yunzhou, and Beiming Gu:** all local areas use the same isometric board/editor, each with a separate map ID and no Map Base image for now. They show a restrained isometric placeholder grid until artwork is supplied; regional panorama artwork is not substituted for a playable map.
- Legacy cell-layout and editor-window local-storage keys are cleared once during the refresh. Academy then receives its owner-supplied one-time map seed; other map IDs retain independent persistence and begin with their own default grid/editor data until a map reference is supplied.
- Academy NPCs are positioned at the owner-marked cells (7,4), (10,9), (6,15), and (22,10). Wandering remains inside the selected walkable whitelist and respects blocked-sector edges; NPCs do not walk into the Player or another NPC. Area-specific greetings, choices and replies remain in world-map-hierarchy.ts. The current code blocks interaction only when Player and NPC occupy the same cell; a maximum interaction radius still needs confirmation against the approved NPC/chat rules. See ISOMETRIC_FIELD_SYSTEM.md.

Academy interior and all non-Academy interiors remain empty Map Base placeholders until their own map artwork is supplied.


## Fractional actor position inside a cell

The Player keeps integer data-x/y coordinates for whitelist checks, actor occupancy, NPC interaction and BFS. Separate data-pos-x/y visual coordinates may be fractional inside the selected walkable diamond. A tap is mapped through the isometric overlay SVG viewBox and inset into the diamond so the actor is not forced to stop at its center. This remains a visual sub-cell endpoint; it does not authorize movement through blocked cells or closed half-edges.

For a cardinal transition, each half-edge is checked independently by the sector graph: one blocked child sector leaves the matching open half traversable; blocking both closes the full edge. NPC interaction reachability uses the same full-edge condition.
