# Academy Map Assets

Dedicated source folder for the academy isometric map.

## Structure

- `reference/` — cropped tile samples and visual references supplied for inspection.
- `ground/` — approved ground tiles, atlases, and material variants.
- `objects/` — separate building, foliage, prop, and environment assets.
- `exports/` — optimized assets prepared for the APK.

## Tile sizing

Provisional reference sample: `reference/academy-ground-tile-sample.svg`. It currently illustrates a 64×32 diamond top with a 7 px thin slab (64×39 total). This is a visual measuring aid, not a locked final tile specification; the owner will confirm the final size by inspecting the coordinate-labelled in-game grid.

Keep ground, buildings, props, and character sprites as separate layers. The renderer must depth-sort objects using their world-space foot/base position, not their image top edge.
