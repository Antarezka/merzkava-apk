# Shared Isometric Map Editor

The isometric map editor is a reusable editor/runtime contract. It is not Academy-specific. Any isometric map board can use the same editor by supplying a stable `data-map-id`, its base artwork (when it has a complete JPG/PNG Map Base), grid dimensions, and the standard editor controls.

## Artwork and render order

- Use one complete map image as the Map Base. Do not require separate foreground fragments or modify the source JPG/PNG.
- The complete Map Base renders beneath Player and NPC.
- A cell with foreground priority (`○`) is clipped as a diamond from the same Map Base image and redrawn in a transparent foreground canvas above Player/NPC.
- The foreground canvas redraws only marked cells. Unmarked neighboring cells remain below characters.
- The canvas mask is regenerated when the grid or foreground-cell metadata changes.

## Independent cell metadata

Each cell may independently carry any combination of these flags:

| Flag | Editor mode | Runtime behavior |
|---|---|---|
| Foreground | `○ Foreground cells` | Redraw that cell's Map Base image region above characters |
| Blocked | `X Blocked cells` | Reject Player and NPC movement into the cell |
| Opacity | `Character opacity zones` | Characters become translucent while occupying the cell |

These flags are stored in separate arrays. Setting or clearing one never changes the other two. There is no quarter-cell requirement.

## Grid calibration

Each map stores its own grid configuration: columns, rows, cell width/height, X/Y offsets, and Player/NPC scale. Cells are diamond-shaped in isometric projection. The grid is editor metadata and does not alter the Map Base artwork.

## Area transitions

Each map stores transition markers independently. An unnamed marker is red; after a destination label is applied, it becomes blue. Labels are limited to 80 characters. Markers can be selected, renamed, deleted, exported, and imported.

## Persistence and reuse

Editor data is saved in local storage under `merzkava.isometric-map-editor.v2:<encoded map ID>`. The refreshed rollout uses a clean v2 namespace; the first initialization removes the older v1 cell layouts, legacy overlay data, and editor-window positions once. Exported JSON uses format `merzkava-isometric-map-editor`, version 1, and contains the map ID, grid, three cell-layer arrays, and transitions.

Use unique stable map IDs for each exterior, interior, or other isometric scene. Do not reuse one ID for different map artwork. A map board that has no base image can still use grid, collision, opacity, and transition data; foreground rendering becomes active when a base image is supplied.

## Current map rollout

- **Tianhai Academy exterior:** source artwork is `public/maps/academy/full-map/1_academy.jpg`. It is the sole visual Map Base; the old procedural pond, path, garden, and building-footprint decorations are removed from this image-backed board. Transparent diamond cells remain only as interaction and editor geometry. The same source JPG feeds the foreground-cell canvas and minimap.
- The source artwork is **2816×1536 px**. The Academy grid remains calibrated at **24×20 cells of 128×69.5 px**. A one-time Academy-only reset clears its previous saved cell layers, transitions, and editor-window placement; other map IDs retain their own data. The map starts with empty foreground, blocked, opacity, and transition arrays, plus the existing Player and four Academy NPCs.
- The minimap draws the same isometric cell geometry, saved cell-layer flags, transition colors, and live actor coordinates. The HUD also reports the Player's current grid X/Y. Character opacity and depth order are controlled through CSS variables so editor flags are not overridden by the global token style.
- **Golden Dragon Empire, Tianhai Yunzhou, and Beiming Gu:** all local areas use the same isometric board/editor, each with a separate map ID and no Map Base image for now. They show a restrained isometric placeholder grid until artwork is supplied; regional panorama artwork is not substituted for a playable map.
- The previous cell-layout and editor-window local-storage keys are cleared once during the refresh. New map areas start with clean calibration, transitions, blocked cells, and foreground cells.
- Test NPCs are placed across Academy, Public Arena, other Golden Dragon Empire districts, Tianhai Yunzhou, and Beiming Gu. They keep the existing conversation panel style and have distinct area-specific greetings, choices, and replies.

Academy interior and all non-Academy interiors remain empty Map Base placeholders until their own map artwork is supplied.
