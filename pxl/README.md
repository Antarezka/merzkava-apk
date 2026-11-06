# Augusto PXL source library

Editable PXL source for the separate pink World Atlas. The green/legacy Atlas remains untouched.

- Upstream: https://github.com/augusto-scarvalho/claude-pxl
- Pinned revision: `13a797ee15b05186a49eb8520a4fcfed73d555ae`
- Toolchain: Node.js 22.18.0; FFmpeg normalizes the repository's mislabelled JPEG references to PNG for PXL import.
- Android runtime: bundled assets only; PXL CLI/viewer are never shipped or run in gameplay.

## Production sources

| Source | Scope |
| --- | --- |
| `maps/world-atlas.px.js` | PXL treatment for the world atlas and 35 regional crops; minimap and local Tianhai image |
| `environments/academy-campus.px.js` | Original PXL 3D-look isometric Tianhai Academy scene, textured architecture, courts, water, bridges, trees, lighting and camera |
| `characters/academy-cast.px.js` | Player and seeded Academy NPC sprite sheets, eight directions, idle/walk frames |
| `ui/merzkava-ui.px.js` | Satchel, skill/item/currency icons, HUD frames, minimap and map markers |
| `effects/merzkava-effects.px.js` | Spirit Ring, Martial Soul, Arcanistry, Spirit Beast, water, foliage, clouds and weather sheets |
| `objects/academy-props.px.js` | Gate, roofs, stairs, bridge, trees, pond, training yard and lanterns |
| `cinematics/arrival-scenes.px.js` | Academy arrival, Spirit Awakening and transition plate artwork |

## Visual/runtime boundary

PXL owns image authoring and export. The app remains responsible for gameplay rules, map IDs, grid and walkability, camera, actors, NPC decisions, collision, hit targets, HUD data, accessibility and persistence. Character sprites use a fixed bottom-center ground pivot; sprite-sheet animation metadata is in `asset-map.json`.

The approved Academy illustration remains a faint, non-exported visual guide for the PXL authoring preview. The runtime Academy image is authored as a separate PXL perspective/mesh scene and exported at exactly **2816 × 1536 px**. Keep the source map's major spatial organization (rear study halls, central courtyard, garden water, side wings, training terrace and south entrance) while leaving the app's 24 × 20 grid, 128 × 69.5 tile calibration, walkable-cell whitelist, actor coordinates, collision and minimap as the only gameplay authorities. Final visual alignment still requires side-by-side review before replacing any coordinate authority.

The 35 regional panels remain PXL-treated crops from the approved world map; they do not define new geography.

## CI and offline package

`npm run pxl:build` converts the existing JPEG references to PNGs in the ignored `pxl/maps/references/` folder, checks/builds every `.px.js`, copies PNG exports into `public/assets/augusto-pxl/exports/`, validates the PNG signature, image dimensions, sprite-sheet grid and every animation frame, and refuses to pass if any manifest ID is unmapped. The upstream MIT license is copied into the runtime package.
