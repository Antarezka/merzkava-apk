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

Editor data is saved in local storage under `merzkava.isometric-map-editor.v1:<encoded map ID>`. Exported JSON uses format `merzkava-isometric-map-editor`, version 1, and contains the map ID, grid, three cell-layer arrays, and transitions.

Use unique stable map IDs for each exterior, interior, or other isometric scene. Do not reuse one ID for different map artwork. A map board that has no base image can still use grid, collision, opacity, and transition data; foreground rendering becomes active when a base image is supplied.

## Current Academy integration

The Tianhai Academy exterior currently uses `public/maps/academy/full-map/1_academy.jpg`. Other isometric locations receive their own map ID and should pass their own base image when that artwork is ready. Academy interior currently remains a generated floor-plan scene without a Map Base image.
