# Augusto PXL source library

Editable PXL source for the separate pink World Atlas. The green/legacy Atlas remains untouched.

- Upstream: https://github.com/augusto-scarvalho/claude-pxl
- Pinned revision: `13a797ee15b05186a49eb8520a4fcfed73d555ae`
- Toolchain: Node.js 22.18.0; FFmpeg is used only to normalize the repository's mislabelled JPEG references to PNG for PXL import.
- Android runtime: bundled assets only; PXL CLI/viewer are never shipped or run in gameplay.

## Production sources

| Source | Scope |
| --- | --- |
| `maps/world-atlas.px.js` | Existing Merzkava world-map image, 35 regional crops, approved Academy map, minimap and local Tianhai environment image |
| `characters/academy-cast.px.js` | Player plus four seeded Academy NPC sprite sheets, eight directions, idle/walk frames |
| `ui/merzkava-ui.px.js` | Satchel, skill/item/currency icons, HUD frames, minimap and map markers |
| `effects/merzkava-effects.px.js` | Spirit Ring, Martial Soul, Arcanistry, Spirit Beast, water, foliage, clouds and weather sheets |
| `objects/academy-props.px.js` | Gate, roofs, stairs, bridge, trees, pond, training yard and lanterns |
| `cinematics/arrival-scenes.px.js` | Academy arrival, Spirit Awakening and transition plate artwork |

## Visual/runtime boundary

PXL owns image authoring and export. The app remains responsible for gameplay rules, map IDs, grid and walkability, camera, actors, NPC decisions, collision, hit targets, HUD data, accessibility and persistence. Character sprites use a fixed bottom-center ground pivot; sprite-sheet animation metadata is in `asset-map.json`.

The Academy base is sourced from the already-approved `assets/maps/academy/full-map/1_academy.jpg`; its final PXL export is validated at exactly **2816 × 1536 px**. The crop regions are presentation art taken from the existing world map and do not define new geography.

## CI and offline package

`npm run pxl:build` converts three existing JPEG references to proper PNGs in the ignored `pxl/maps/references/` folder, checks/builds every `.px.js`, copies PNG exports into `public/assets/augusto-pxl/exports/`, validates the PNG signature, image dimensions, sprite-sheet layout and every referenced animation frame, and refuses to pass if any manifest asset ID is unmapped. The upstream MIT license is copied into the runtime package.
