# PXL Isometric Map Production Workflow

This document is the production sequence for authoring, generating and integrating regional isometric maps in Merzkava Universe. It is both the developer handoff and the AI execution order. **Do not skip ahead to Augusto PXL artwork before the spatial map is complete.**

## 1. Canon and reference research

Before creating a map, identify the exact place and its parent region in the Merzkava Universe World Archive/repository.

Read the location-specific canon documents first. Record:

- Correct parent region, location name and geographic context.
- Purpose and ownership of the site: academy, dojo, clan compound, imperial palace, settlement, harbour, institute, etc.
- Required facilities, district hierarchy, access routes, training and learning functions, landscape and environmental character.
- Any explicit limits: separate institutions must remain separate; independent dojos are not silently turned into academy buildings.

For Tianhai Academy, the correct location is **Tianhai Yunzhou**, not Golden Dragon Empire. Academy-level Arcanist learning/workshops may appear in its campus, but the separate Tianhai Arcanist Institute is not represented as an Academy building or department.

Canon source references for this sample:

- `world/REGION_TIANHAI_YUNZHOU.md`
- `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md`

## 2. Write the visual prompt and spatial brief

Write a place-specific prompt from the canon research, not from the RPG HUD, a previous placeholder map or an unrelated location image.

For regional/area exploration maps, the visual direction is:

- Persona 4 regional navigation and explorable area presentation.
- Shin Megami Tensei area/environment composition.
- Raidou Kuzunoha's compact, atmospheric city and district exploration.

The world map is excluded from this style conversion. It remains the existing macro-geographic map based on World Archive and the Merzkava Universe repository.

The area prompt should describe the place's geographic footprint, district hierarchy, architecture, material palette, landscape, water, natural paths, bridges, lighting, object scale and visual depth. For expansive grounds, make the geography large while keeping individual architecture modest and small in scale. Do not turn the map into a giant building showcase.

The HUD is a separate UI layer. Keep the approved RPG HUD/Spirit Ring layout and behavior independent from the artwork brief; do not use HUD styling as the map's visual reference.

## 3. Open the dedicated PXL Map Studio

The PXL Cell Editor is a separate authoring tool. The existing Isometric Cell Editor opened by the old TV control remains unchanged.

For this Academy sample, open the developer-only **PXL MAP STUDIO** entry from the Golden Dragon Empire regional console. That entry is a developer portal only; it does not place Tianhai Academy in Golden Dragon Empire. The test screen uses this independent map ID:

`pxl-studio:tianhai-academy:exterior`

The new editor's retractable vertical rail is on the **right**. The left remains available for the RPG HUD/Spirit Ring. Its small floating window is draggable by the header, scrollable and minimizable. The existing Canvas Editor remains a separate tool and keeps its original purpose: controlling the canvas area/margins.

## 4. Build the complete spatial-label map with freeform lasso

Use freeform lasso polygons for the actual footprint of each object or zone. Do not force ponds, winding paths, gardens, walls or irregular building wings into rectangular bounds.

Every label carries:

- Stable ID, display name and category.
- Polygon vertices in Map Base image coordinates.
- Description/reference notes.
- Spatial behavior flags where applicable.
- Visual/depth ordering metadata.

Label the entire map, not just notable buildings. Include the full extent from one edge to the opposite edge.

Typical labels include:

- Main entrance, outer/inner/core student zones.
- Dojo and practice yards.
- Advanced Spirit Realm training grounds.
- Academy-level Arcanist classrooms and supervised workshops.
- Teacher/instructor quarters.
- Every hall, dormitory, pavilion, gate, wall, bridge, pond, garden and major canopy.
- Organic paths, junctions, courtyards and walkable open ground.

Labels define **what an object is and where its real footprint lies**. They are authoring metadata, not words to be baked into the image.

## 5. Complete all isometric cells and all eight sectors

Keep the Academy baseline unchanged:

| Calibration | Required value |
|---|---:|
| Map Base | 2816 × 1536 px |
| Base grid | 24 × 20 = 480 diamonds |
| Existing custom extension | 105 diamonds |
| Total mapped cells | 585 |
| Sector split | 8 per diamond |
| Total sectors | 4,680 |
| Diamond size | 128 × 69.5 px |
| PXL planning image | 704 × 384 px (exact 1:4 preview) |

Preserve all 105 registered extension cells, including the five cells that cross the Map Base boundary. Do not fill blank areas by inventing intervening grid coordinates.

The new editor uses the same three marker meanings as the old editor:

- **O — Foreground:** redraw the matching source-image area above the player/NPC.
- **X — Blocked:** mark the movement/collision sector.
- **Opacity — Character fade:** dim the player/NPC when behind that marked geometry.

These are three independent flags. Walkability is separate data. Blank marker sectors are not automatically walkable.

Apply flags sector by sector when a building, wall, tree canopy, roof, water boundary or other object only partially covers a cell. Use O for geometry that should render in front of actors; use opacity where an actor should fade behind that object; use X only where movement must be blocked.

Keep actor spawn cells on the connected walkable network. The sample map validates the player plus all four Academy NPC starts.

## 6. Preserve Canvas Editor dimensions and the camera margins

Use the existing Canvas Editor to control the Map Base canvas margins. Do not replace its functionality with the PXL Cell Editor.

The original Academy cover-fit/automatic gap calculation and separately adjustable margins must remain. In particular, the **bottom blank canvas gap must be retained**, because the camera pan range depends on the expanded canvas surface. Do not crop, compress or normalize it away when calibrating the cell grid.

The Canvas Editor's saved margin settings are exported separately and included in the PXL Map Studio's full AI package. Cell calibration must never resize the underlying Map Base or silently change the canvas margins.

## 7. Validate and save the spatial package

Before art generation, run the Studio validation. The map is not ready while any of these checks fail:

- All 480 base cells and 105 custom cells are present.
- All 4,680 cell sectors are represented by the grid structure.
- Lasso labels have valid names, categories and at least three vertices.
- O, X and opacity masks contain their independently marked sectors.
- Walkable cells form one connected route network from the entrance.
- Player and all four NPC start cells are walkable.
- The saved canvas dimensions/margins are present.
- The map ID and canon location are correct.

Use **SAVE DRAFT** while authoring. Use **CONFIRM MAPPING** only after the full map passes validation. Use **COPY DATA FOR AI** to copy the complete package, including the Map Base, Canvas Editor margins, every cell and sector, walkability, all lasso polygons, spawn points, canon references, validation summary and PXL visual brief.

The copied package is the handoff to the next AI/build update. Apply it to the committed source files before running the PXL pipeline; the runtime does not infer new geometry from a screenshot or from localStorage.

## 8. Generate the guide, then the Augusto PXL artwork

The PXL build first runs `scripts/pxl-build/build-academy-quadrant-guide.mjs`. It reads the committed spatial structure and generates:

- `pxl/maps/references/academy-quadrant-guide.png`
- `pxl/maps/references/academy-label-guide.png`
- `pxl/maps/references/academy-quadrant-map.json`

These are reference-only, build-time authoring guides. They are fed into `pxl/environments/academy-campus.px.js` as non-exported PXL reference layers.

Augusto PXL now works from the full prompt and the completed lasso/cell structure. It composes the 3D-look HD-2D environment around those mapped positions. It must not move, resize or reinterpret the labels and grid. If artwork does not fit the spatial map, revise the spatial data or prompt deliberately and regenerate—do not hide the mismatch with runtime offsets.

The final 2816 × 1536 PNG must contain **no** cell grid, lasso borders, label text, O/X/opacity symbols, editor handles or authoring guides. Those remain in JSON/metadata for the editor and runtime only.

## 9. Integrate the artwork and gameplay layers

After the generated asset is validated and registered in `pxl/asset-map.json` and `public/assets/augusto-pxl/manifest.json`, integrate it into the sandbox runtime.

Keep the map image, camera and game coordinates on the same Map Base:

- One spatial coordinate system for labels, cells, actor positions, image taps and foreground/opacity rendering.
- Transparent hit plane and actor layer positioned to the exact image rectangle.
- Foreground canvas draws O-marked image sectors above actors.
- Opacity behavior fades actors behind marked areas.
- X-marked sectors block movement.
- Player/NPC use 2D directional sprite sheets over the PXL environment. Their visual height is approximately **4–8 pixels on screen at the standard camera scale**; keep their touch/interact/collision hit area separate.
- The camera must keep pan, pinch zoom, zoom controls and center/focal-point behavior stable across the artwork and expanded canvas margins.
- The approved RPG HUD, including the Spirit Ring on the left, remains a separate overlay. The PXL editor controls stay on the right.

## 10. Test the complete map before expanding the system

Validate, in this order:

1. PXL source checks and generated asset dimensions.
2. TypeScript and production bundle.
3. Regression tests for map IDs, lasso/sector exports, HUD separation, hit testing, walkability and camera alignment.
4. Runtime map review for player/NPC visibility, movement, collision, interactions, depth/foreground, opacity, visual effects, NPC motion, camera pan/zoom and HUD behavior.

Do not roll this system out across other regions until the Academy sandbox is correct. Once approved, reuse the editor/runtime architecture and the same production sequence for each regional map, but research and map each location from its own World Archive references. Each map declares its own Map Base, grid and custom cells after calibration.

The world map remains unchanged throughout this rollout.

## Source-of-truth files

- `src/offline-game/pxl-map-studio.ts` — dedicated editor controls and authoring interactions.
- `src/offline-game/pxl-map-studio.css` — compact right-side control dock/window.
- `src/offline-game/tianhai-academy-map-labels.ts` — full spatial label definitions.
- `src/offline-game/tianhai-academy-map-reference.ts` — runtime/editor cell, quadrant and walkability reference.
- `pxl/maps/tianhai-academy-map-structure.json` — complete AI/PXL spatial structure.
- `scripts/pxl-build/build-academy-quadrant-guide.mjs` — generated full-map guides and checks.
- `pxl/environments/academy-campus.px.js` — Augusto PXL environment source.
- `src/offline-game/world-map-hierarchy.ts` — isolated World Atlas developer portal and sandbox runtime integration.

