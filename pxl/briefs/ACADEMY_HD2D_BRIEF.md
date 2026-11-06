# Tianhai Academy — Augusto PXL environment brief

Create a production-ready HD-2D / 3D-look isometric environment for the PXL-only World Atlas mode.

## Non-negotiable geometry contract

- The exported Academy base image must be exactly **2816 × 1536 px**.
- Keep the established Merzkava Academy map identity and playable landmarks. Do not invent new map zones or change the official source layout.
- The app's current isometric coordinate model remains authoritative: 24 columns × 20 rows, tile width 128, tile height 69.5, offsets 0/0, Academy artwork coordinate space 2816 × 1536.
- The same walkable-cell whitelist, eight sub-cell sectors, blocked half-edge rules, camera expansion margins, minimap coordinates and map-editor JSON must continue to work.
- Leave reserved transparent/clear ground lanes where Player/NPC tokens traverse; environment depth and occlusion must not cover actors incorrectly.

## Visual direction

- Build a rich, 3D-looking isometric academy campus: layered tiled roofs, courtyards, stairs, bridges, trees, pond, gates, training spaces, study halls and readable walking surfaces.
- Use PXL 3D perspective/mesh techniques and render a stable orthographic/isometric-like camera composition. Export a final raster environment for the current DOM image layer.
- Use restrained warm stone, lacquered timber, muted jade, parchment and brass accents. Avoid excessive micro-detail that will collapse at phone resolution.
- Lighting, foliage sway, water shimmer, drifting leaves and weather are to be separately authored PXL effects/sprite sheets so they can be paused, reduced, or simplified.

## Actors

- Player and NPCs are separate 2D character sprites with transparent backgrounds, consistent scale, a clear ground pivot, and 8-direction idle/walk sets.
- Each NPC uses stable IDs already present in the app. Do not change NPC identities, positions, dialogue, routes, or behavior.
- Player/NPC hit targets remain HTML buttons; exported sprite artwork is the visual child only.

## Deliverables

- `academy-exterior.png` (2816 × 1536)
- `academy-exterior.tiled.json` / `.tmj` only as supplementary art metadata; do not make it the authority for walkability.
- Player/NPC 8-direction sprite sheets plus JSON animation metadata.
- Separate asset exports for buildings, trees, pond, props, UI ornaments and scene effects.
- Update the app-local manifest with stable asset IDs and file paths only after the generated files pass validation.
