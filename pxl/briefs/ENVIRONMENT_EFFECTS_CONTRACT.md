# HD-2D environment and effect contract

## World and Academy environment

The pink World Atlas should use PXL-authored world overview, regional environment art, local isometric scenes and interiors. Tianhai Academy is the first production environment.

- Academy final base export: exactly **2816 × 1536 px**.
- Preserve the existing map coordinate space and map ID: `golden-dragon-empire:tianhai-academy:exterior`.
- Preserve the current 24 × 20 grid, 128 × 69.5 tile geometry, spawn/actor grid coordinates, eight sub-cell sectors, walkability whitelist, half-edge connectivity, camera margins and minimap projection.
- Build the visual world with a stable isometric/orthographic camera, 3D-looking roofs, courtyards, stairways, bridges, trees, water, gates, training areas, study buildings, terrain edges and readable paths.
- Keep a clear ground plane/pivot area where 2D Player/NPC tokens can be layered without being visually buried by buildings and foreground objects.
- Use lighting and perspective to create depth without changing walkable cells or actor occlusion authority.

## Independent animation/effect assets

Author separately composited assets for:
- foliage idle/wind, pond water shimmer, drifting leaves/petals and cloud movement;
- rain, snow, mist/fog, day/dusk/night lighting, light rays and small ambient particles;
- Martial Soul manifestations, Spirit Ring appearance/activation, Spirit Beast appearance/movement and Arcanistry casting/artifact effects;
- location transitions, academy arrival and cinematic scenes.

Prefer small transparent sprite sheets or short loops that can be paused. Do not embed expensive continuous effects into a giant full-screen animation. Include reduced-motion-safe still frames.

## Acceptance

- Visual-only asset changes do not change map IDs, grid data, walkability, camera math, collision/interaction or save data.
- Final Academy art passes side-by-side coordinate/landmark review before replacing any placeholder.
- Separate effects can be disabled/paused independently.
- Asset weight, decode time and memory are measured on the target Android device.
