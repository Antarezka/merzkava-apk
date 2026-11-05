# Shared Isometric Map Editor

The isometric map editor is a reusable editor/runtime contract. It is not Academy-specific. Any isometric map board can use the same editor by supplying a stable `data-map-id`, its base artwork (when it has a complete JPG/PNG Map Base), grid dimensions, and the standard editor controls.

## Artwork and render order

- Use one complete map image as the Map Base. Do not require separate foreground fragments or modify the source JPG/PNG.
- The complete Map Base renders beneath Player and NPC.
- A cell with foreground priority (`○`) is clipped as a diamond from the same Map Base image and redrawn in a transparent foreground canvas above Player/NPC.
- The foreground canvas redraws only marked cells. Unmarked neighboring cells remain below characters.
- The canvas mask is regenerated when the grid or foreground-cell metadata changes.

## Independent cell metadata

Each cell may independently carry any combination of these flags. The editor can add and delete walkable cells one tap at a time. ADD CELL is not limited to the original cols×rows rectangle: tap an ungridded point on the Map Base artwork to place one additional diamond at the nearest isometric coordinate. The full diamond must fit within the image bounds; canvas expansion margins and blank canvas are never eligible. These sparse extra coordinates are stored in customGridCells and do not resize the image or canvas. Several adjacent cells may be selected and merged into one flexible logical cell group, including bent or uneven shapes; existing groups can be extended by merging again or split with UNMERGE. A drag pans the map and is never treated as a tap. When walkableAreaEnabled is turned on, Player and NPC movement is restricted to the selected blue base cells. Keep the limit off while painting, then enable it after the route is complete.

| Flag | Editor mode | Runtime behavior |
|---|---|---|
| Walkable region | `▧ Walkable area brush` | Added blue cells form the movement whitelist; connected cells can be stored together as a merged logical area |
| Foreground | `○ Foreground` | Redraw the selected image sector above characters |
| Blocked | `X Blocked quadrants` | Prevent movement across the corresponding isometric edge |
| Opacity | `◌ Character opacity quadrants` | Characters become translucent while occupying a cell with an opacity sector |

Each main isometric diamond is divided into four triangular sectors: top-left (tl), top-right (tr), bottom-left (bl), and bottom-right (br). Foreground, blocked, and opacity markers can be applied to any one of these sectors, with independent arrays and keys such as 4,7:tl. Legacy whole-cell arrays remain supported for imported data. For a cardinal grid step, the blocked sector on the exit side of the source cell and the matching entry sector of the destination cell are checked before a Player or NPC can move.

## Grid calibration

Each map stores its own grid configuration: columns, rows, cell width/height, X/Y offsets, and Player/NPC scale. Cells are diamond-shaped in isometric projection. The grid is editor metadata and does not alter the Map Base artwork.

## Area transitions

Each map stores transition markers independently. An unnamed marker is red; after a destination label is applied, it becomes blue. Labels are limited to 80 characters. Markers can be selected, renamed, deleted, exported, and imported.

## Persistence and reuse

Editor data is saved in local storage under `merzkava.isometric-map-editor.v2:<encoded map ID>`. Exported JSON uses format `merzkava-isometric-map-editor`, version 1, and contains the map ID, grid, walkable cells and activation flag, merged walkable cell groups (each with its own ID and component coordinates), customGridCells for individually placed diamonds outside the original grid rectangle, three whole-cell arrays, three quadrant arrays, and transitions. Custom cells remain valid movement nodes and can also carry quadrant flags and transition markers. An AI can preserve or extend a merged group by using its group ID and component cell coordinates. Grid calibration affects only the transparent image overlay; it does not resize the source artwork or the separately configured canvas expansion margins.

Use unique stable map IDs for each exterior, interior, or other isometric scene. Do not reuse one ID for different map artwork. A map board that has no base image can still use grid, collision, opacity, and transition data; foreground rendering becomes active when a base image is supplied.

## Current map rollout

- **Tianhai Academy exterior:** source artwork is `public/maps/academy/full-map/1_academy.jpg`. It is the sole visual Map Base; the old procedural pond, path, garden, and building-footprint decorations are removed from this image-backed board. Transparent diamond cells remain only as interaction and editor geometry. The same source JPG feeds the foreground-cell canvas and minimap. The floating editor grid is positioned over the artwork bounds only, while the image and canvas expansion gaps remain unchanged. It includes a draggable workbench icon, ADD CELL, DELETE CELL, SELECT & MERGE, and UNMERGE tools, four-sector X/O/opacity tools, grid size/offset calibration, and red/blue transition markers. Player and NPC tokens use the same grid coordinates, tap-to-walk pathfinding, wandering limits, and existing NPC conversation panel.
- The source artwork is **2816×1536 px**. The Academy grid remains calibrated at **24×20 cells of 128×69.5 px**. A one-time Academy-only reset clears its previous saved cell layers, transitions, and editor-window placement; other map IDs retain their own data. The map starts with empty foreground, blocked, opacity, and transition arrays, plus the existing Player and four Academy NPCs. The Academy uses the same map-ID persistence and editor export format as other isometric areas.
- The minimap draws the same isometric cell geometry, selected walkable regions, whole-cell and quadrant flags, transition colors, and live actor coordinates. The HUD also reports the Player's current grid X/Y. Character opacity and depth order are controlled through CSS variables so editor flags are not overridden by the global token style.
- **Golden Dragon Empire, Tianhai Yunzhou, and Beiming Gu:** all local areas use the same isometric board/editor, each with a separate map ID and no Map Base image for now. They show a restrained isometric placeholder grid until artwork is supplied; regional panorama artwork is not substituted for a playable map.
- The previous cell-layout and editor-window local-storage keys are cleared once during the refresh. New map areas start with clean calibration, transitions, blocked cells, and foreground cells.
- Test NPCs are placed across Academy, Public Arena, other Golden Dragon Empire districts, Tianhai Yunzhou, and Beiming Gu. They keep the existing conversation panel style and have distinct area-specific greetings, choices, and replies.

Academy interior and all non-Academy interiors remain empty Map Base placeholders until their own map artwork is supplied.
