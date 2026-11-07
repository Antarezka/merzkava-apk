# Tianhai Academy — Augusto PXL production brief

## Canon and location

Create the exterior environment for **Tianhai Academy in Tianhai Yunzhou**. This is an academy campus on Tianhai Yunzhou's floating island, not a site inside Golden Dragon Empire.

Read the following canon sources before changing the environment:

- `world/REGION_TIANHAI_YUNZHOU.md`
- `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md`

Tianhai Yunzhou has four distinct Cultivator Academies and a separate Tianhai Arcanist Institute. This sample map depicts Tianhai Academy only. Academy-level Arcanist classrooms and supervised workshops may be included as campus facilities, but do not depict the separate Tianhai Arcanist Institute as an Academy building, faculty or campus annex. Do not create institutional relationships or geography that the canon does not establish.

## Visual target

Create a full regional exploration environment with a clear visual lineage to:

- Persona 4 regional navigation and explorable area presentation.
- Shin Megami Tensei's atmospheric area environments.
- Raidou Kuzunoha's compact, legible district and city exploration.

This is the art direction for the **area map**, not the macro World Map. The World Map is not part of this conversion and remains unchanged.

The visual result should feel like an expansive real place that can be explored. The campus is geographically broad, with small-scale architecture, landscaped open ground, winding pedestrian paths, multiple gardens and irregular ponds. Avoid turning the site into a row of oversized buildings or a dense, rigid tile board. Preserve open sightlines and organic landforms. Use coherent isometric perspective, layered architectural silhouettes, restrained environmental detail, readable ground planes, lighting, shadows and depth.

The left-side RPG HUD/Spirit Ring and the approved HUD revision are separate interface layers. Do not use HUD frames, colors, buttons, card shapes or decoration as visual references for the map artwork.

## Authoritative source package

The artwork must be composed from the committed, full spatial structure. Do not infer or move objects from a screenshot, a previous placeholder or a former Academy image.

- Spatial labels and lasso contours: `src/offline-game/tianhai-academy-map-labels.ts`
- Complete AI/PXL structure: `pxl/maps/tianhai-academy-map-structure.json`
- Runtime/editor cell reference: `src/offline-game/tianhai-academy-map-reference.ts`
- Generated quadrant and lasso guides:
  - `pxl/maps/references/academy-quadrant-guide.png`
  - `pxl/maps/references/academy-label-guide.png`
  - `pxl/maps/references/academy-quadrant-map.json`

The generated guides are reference-only PXL layers. They express the full spatial layout and gameplay meaning; never bake them into the export.

## Required spatial hierarchy

The full campus map must preserve separately labelled footprints for:

1. Main gate and organic entry approach.
2. Outer Student Zone, including modest dormitories, study pavilions, gardens and open courts.
3. Inner Student Zone, with smaller teaching halls and a connected courtyard.
4. Core Student Zone, including the central academy hall and senior learning spaces.
5. Martial dojo grounds and separate practice yards.
6. Advanced Spirit Realm training grounds with a supervised practice ring.
7. Academy-level Arcanist learning halls, small workshops and artifact-practice yard.
8. Teacher and instructor quarters, pavilions and quiet garden space.
9. Multiple irregular ponds, landscaped gardens, bridges, tree canopies, walls, footpaths and path junctions.

Use the lasso polygons as exact spatial constraints. Buildings, water, gardens, yards and paths must remain within their mapped footprints. Paths are organic, curved and branching; do not replace them with straight grid roads. Ponds follow their irregular contours. Buildings remain small in relation to the overall campus. The main gate is modest, approximately two isometric diamonds wide.

## Fixed Map Base and camera calibration

The exported image must be exactly **2816 × 1536 px**.

| Calibration | Value |
|---|---:|
| Map Base | 2816 × 1536 px |
| Base grid | 24 × 20 = 480 cells |
| Preserved custom extension | 105 cells |
| Total registered cells | 585 |
| Sector count | 8 per cell |
| Total sectors | 4,680 |
| Isometric diamond | 128 × 69.5 px |
| Preview canvas | 704 × 384 px, exact 1:4 scale |
| Grid offset | 0, 0 |

The registered 105 extension cells must be preserved exactly. Five cells cross the Map Base edge and remain at their recorded coordinates: `10,30`, `11,31`, `12,31`, `7,27` and `8,28`.

The existing Canvas Editor owns the four outside margins and the original automatic gap calculation. Its saved expansion—including the bottom blank gap—must remain in the AI handoff and runtime camera surface. Do not crop the Map Base, shrink the bottom gap, normalize it away or change the camera surface to fit only the artwork.

## Marker and depth contract

Every base and registered custom cell has eight independently represented sectors in this order:

`tl-a`, `tl-b`, `tr-a`, `tr-b`, `bl-a`, `bl-b`, `br-a`, `br-b`.

The three flags retain the existing Isometric Cell Editor semantics:

- **O — Foreground:** the corresponding portion of the Map Base is redrawn above Player/NPC sprites.
- **X — Blocked:** the corresponding movement sector is blocked.
- **Opacity — Character fade:** Player/NPC sprites become translucent behind the marked scenery.

These flags are separate, not mutually exclusive. Walkability is its own whitelist. A sector or cell without a marker is not automatically walkable. O/X/opacity guides and lasso boundaries are editor metadata only.

## Actors and screen scale

Player and Academy NPCs remain independent 2D directional sprite sheets over the PXL environment. Preserve the existing actor identities, dialogue, behavior, bottom-center ground pivot, eight-direction animation data and map coordinates.

At standard gameplay camera scale, actor artwork is approximately **4–8 pixels high on the screen**. The character must scale with world zoom; it must not remain a large screen-space token or HUD icon. Keep the visual sprite tiny while retaining separate practical hit/interact/collision targets. Avoid large actor shadows, rings or proximity halos that visually outweigh the sprite.

## Scene construction

Use the PXL perspective camera and depth-aware mesh renderer to produce:

- Compact timber, plaster and stone buildings with readable roofs, eaves and foundations.
- Smaller lecture halls, dormitories, pavilions, dojo structures and instructor residences.
- Open courtyards, outdoor practice grounds and natural terrain breaks.
- Irregular garden ponds with banks and bridges following the lasso footprints.
- Varied trees, shrubs, lanterns, low walls, stairs, garden details and subtle environmental effects.
- Readable foreground and background depth that matches the O/opacity sector data.

Keep geometry and textures legible on a phone screen. Use detail selectively; do not fill every pixel with noise. The environment should communicate scale through landscape and distance, not by making every building large.

## Strict output rules

- Produce `academy-exterior.png` at exactly 2816 × 1536.
- Use the scene `academy-exterior-render` in `pxl/environments/academy-campus.px.js`.
- The final PNG must contain **no** grid, diamond edges, sector markers, O/X/opacity symbols, lasso lines, label names, editor handles or reference layers.
- Do not create walkability, collision, occlusion, actor placement or camera offsets by reading the final pixels. Those remain driven by the committed map structure.
- Keep Player/NPC sprites, HUD, Spirit Ring, world status and minimap as separate assets/runtime layers.
- Register the output only through `pxl/asset-map.json`; the manifest becomes `ready` only after the image exists and passes 2816 × 1536 dimension checks.

## Production gate

The build order is:

1. Canon research and prompt.
2. Complete freeform lasso labels.
3. Complete all 585 cells / 4,680 sectors and actor walkable routes.
4. Canvas Editor margin and bottom-gap confirmation.
5. Full structure validation and AI package export.
6. Generated quadrant/lasso authoring guides.
7. Augusto PXL scene check and asset generation.
8. Dimension/manifest verification.
9. Runtime integration and gameplay validation.

A successful PXL export proves that the asset can be generated; it does not prove that the runtime is correct. Before this environment becomes the reusable template for other regional maps, verify movement, collision, interactions, depth/foreground, character opacity, NPC behavior, effects, camera pan/zoom and the separate RPG HUD/Spirit Ring. Do not roll the system out to other world regions before this Academy sandbox is approved.
