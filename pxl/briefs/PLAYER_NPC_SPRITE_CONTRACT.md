# Player and NPC 2D sprite contract

This contract defines the visual assets for the pink Augusto PXL World Atlas. The existing map runtime remains the authority for actor positions, pathfinding, occupancy, NPC behavior, dialogue and save state.

## Sprite identity and framing

- Each Player/NPC has a stable asset ID matching the map actor identity in the app.
- Use transparent backgrounds, a fixed frame canvas and a consistent ground-contact pivot. Keep feet aligned to the bottom-center anchor so the current isometric depth/occlusion logic remains valid.
- The Player and NPC bodies are authored as 2D characters. They are composited over the HD-2D / 3D-look isometric environment; do not bake the character into the Academy base image.
- Keep enough empty transparent padding for hair, sleeves, robes, tails, weapons and carried objects without moving the foot anchor between frames.
- Use a phone-readable silhouette and avoid excessive tiny line detail.

## Direction and motion set

Every active field character should provide eight directions:

`south`, `south-east`, `east`, `north-east`, `north`, `north-west`, `west`, `south-west`.

Every direction should provide:
- `idle`: seamless loop or stable hold.
- `walk`: readable stepping cycle with consistent foot placement.
- Optional `turn`, `talk`, `gesture`, `work`, `hurt` and other states only when the character/gameplay needs them.

The runtime currently selects animation metadata as `directions[direction][motion]` with `animations[motion]` as a fallback. Keep frame indexes zero-based and provide the real frame count, frame width, frame height, column count and FPS in `pxl/asset-map.json`.

## Acceptance

- All eight directions exist for the Player and each seeded Academy NPC.
- Idle/walk animation loops have no frame jump or change in character scale.
- Transparent sprite art never intercepts touch. Click targets remain existing HTML token buttons.
- Test movement in all eight isometric directions, NPC wandering, depth sort, minimap dots and chat. No AI, routes or NPC coordinates may be changed to make an animation fit.
