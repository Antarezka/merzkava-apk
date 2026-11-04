# Academy Map Assets

Dedicated source folder for the academy isometric map.

## Structure

- `reference/` — cropped tile samples and visual references supplied for inspection.
- `ground/` — approved ground tiles, atlases, and material variants.
- `objects/` — separate building, foliage, prop, and environment assets.
- `exports/` — optimized assets prepared for the APK.

## Tile sizing

Do not resize or normalize source images on import. The final tile dimensions, diamond proportions, anchor point, and atlas slicing rules will be measured from the supplied sample and confirmed before implementation.

Keep ground, buildings, props, and character sprites as separate layers. The renderer must depth-sort objects using their world-space foot/base position, not their image top edge.
