# Tianhai Academy — full-image isometric quadrant mapping

## Baseline and source of truth

- Android Build **#1388** is the last APK build explicitly supplied for this handoff (source commit `ca214968`).
- The active feature branch already contains later source-only fixes; the implementation baseline for this change is branch head `8069b944`, not the Build #1388 APK snapshot.
- The authoritative map data remains `src/offline-game/tianhai-academy-map-reference.ts`. PXL artwork must follow it; it must not invent or shift gameplay coordinates.

## Complete mapping

The Map Base is `2816 × 1536 px`. Its base grid is `24 × 20` diamonds, each `128 × 69.5 px`, with offsets `0,0`. Every diamond is subdivided in this fixed order:

`tl-a`, `tl-b`, `tr-a`, `tr-b`, `bl-a`, `bl-b`, `br-a`, `br-b`.

That gives **480 base cells / 3,840 base sectors**. The owner reference additionally has **105 custom cells** that extend the isometric field beyond the rectangular 24 × 20 coordinate range. The generated map contains every base cell and every registered custom cell, with all eight sector records present on each one.

The three independent sector flags preserve the existing editor semantics:

- **○ / O — Foreground:** draw this part of the same Map Base above the Player/NPC.
- **X — Blocked:** close the marked movement sector/half-edge; do not turn this into a visual wall automatically.
- **◌ — Opacity:** make a character translucent behind this image sector.

A blank sector means that the owner reference has no flag recorded there. It is not an inferred walkable cell. Walkability remains its own whitelist and is stored independently from the three marker masks.

## PXL authoring guide

Before the Academy PXL scene is built, `scripts/pxl-build/build-academy-quadrant-guide.mjs` reads the owner reference and generates two ignored build-time files:

- `pxl/maps/references/academy-quadrant-map.json` — complete cell/sector records, marker masks, walkability, projected centers and image-edge diagnostics.
- `pxl/maps/references/academy-quadrant-guide.png` — transparent 704 × 384 preview overlay, exactly 1:4 of the Map Base.

`pxl/environments/academy-campus.px.js` displays that guide as a reference-only PXL layer beside the original Academy image reference. Use it to align the paths, courtyards, buildings, garden water, bridges, props and entrance. The guide is **not exported into the final Academy image**, not loaded by the APK, and not displayed during normal gameplay.

## Runtime and editor performance

Normal Academy gameplay uses the static PXL map image, the existing 2D actor sheets and a single transparent hit plane sized/positioned to the exact Map Base rectangle. A tap is converted from screen coordinates to image pixels, then to a cell and one of its eight sectors using the same grid functions as the editor. Player/NPC buttons and transition controls remain above the hit plane.

The hundreds of grid polygons, quadrant dividers and O/X/◌ editor marks are created only while the map editor is active. They are cleared when editing closes. The map editor continues to use the same 24 × 20 base grid, custom cells, eight-sector masks, transition points, camera and local persistence. No map-grid overlay is baked into or permanently layered over the runtime artwork.

## Permanent scale reference

| Item | Standard |
|---|---:|
| Runtime Map Base | 2816 × 1536 px |
| Base grid | 24 × 20 |
| Diamond | 128 × 69.5 px |
| Sector split | 8 triangles per diamond |
| PXL authoring preview | 704 × 384 px (1:4) |
| Preview diamond | 32 × 17.375 px |
| Character sprite frame | Existing 32 × 48 px |
| Character anchor | Bottom-center / feet pivot |
| Character representation | 2D sprite over 3D-look/isometric PXL environment |

Future isometric maps must declare their own image dimensions, grid dimensions, offsets, custom cells and actor scaling. Reuse the Academy diamond ratio and bottom-center feet-pivot convention as the default calibration, then validate it against the new reference image before authoring the environment.

## Known source edge cases retained without alteration

Five custom diamonds in the current owner reference cross the Map Base boundary: `10,30`, `11,31`, `12,31`, `7,27`, and `8,28`. The generator records these in `coverage.edgeClippedCustomCells` and clips only the preview guide at the image edge. Their cell coordinates, transitions, walkability and grid offsets are intentionally left untouched until visual review against the original map.
