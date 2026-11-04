# Academy Map Assets

Dedicated source folder for the academy isometric map.

## Structure

- `full-map/` — the complete assembled academy exterior map, with all buildings and environment features integrated into one continuous scene.
- `reference/` — cropped tile samples and visual references supplied for inspection.
- `ground/` — approved ground tiles, atlases, and material variants.
- `objects/` — separate building, foliage, prop, and environment assets.
- `exports/` — optimized assets prepared for the APK.

## Tile sizing

The sample `reference/academy-ground-tile-sample.svg` illustrates a 64×32 diamond with a 7 px thin slab for generic/placeholder areas. The current full Academy Map Base is 2816×1536 and uses a separately calibrated 24×20 grid of 128×69.5 px diamonds. That larger calibration is specific to the Academy image and does not resize the source artwork.

Keep ground, buildings, props, and character sprites as separate layers in reusable source assets. The complete composition belongs in `full-map/`. The renderer must depth-sort objects using their world-space foot/base position, not their image top edge.
