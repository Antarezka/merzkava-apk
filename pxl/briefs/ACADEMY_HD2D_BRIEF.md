# Tianhai Academy — Augusto PXL environment brief

Create a production-ready HD-2D / 3D-look isometric environment for the PXL-only World Atlas mode.

## Non-negotiable geometry contract

- The exported Academy base image must be exactly **2816 × 1536 px**.
- Preserve the established campus organization: rear study-hall cluster, central courtyard, western garden water, side wings, southeastern training terrace, bridges and southern gate.
- Do not redefine the app's authoritative coordinate model: 24 columns × 20 rows, tile width 128, tile height 69.5, offsets 0/0, Academy artwork coordinate space 2816 × 1536.
- The same walkable-cell whitelist, eight sub-cell sectors, blocked half-edge rules, camera expansion margins, minimap coordinates and map-editor JSON must continue to work.
- Leave clear playable lanes through the courtyard and approaches. Environment depth and occlusion must not cover Player/NPC ground pivots incorrectly.
- The former Academy map remains a visual reference only. Never derive new collision or walkability from PXL art.

## Visual direction

- Build a complete 3D-look HD-2D campus using PXL's perspective camera and depth-aware mesh renderer: layered dark tiled roofs, lacquered timber, pale stone foundations, plaster walls, carved brass eaves, open courtyards, stairs, bridges, garden ponds, stone lanterns and training spaces.
- Use a stable high-angle perspective with warm late-afternoon light, cool sky fill, readable contact shadows and restrained emissive lanterns.
- Keep the Academy base scene static and lightweight. Water shimmer, foliage wind, clouds, petals, rain, snow and day/dusk/night overlays remain separate sprites so they can be paused or reduced.
- Use texture scale and detail that remain legible at phone resolution; do not turn every surface into noisy micro-detail.

## Actors

- Player and NPCs remain separate 2D characters with transparent backgrounds, consistent 32 × 48 frame cells, a stable bottom-center ground pivot and eight directional idle/walk sets.
- Keep the active character IDs, NPC identities, positions, dialogue, routes and behavior unchanged.
- Player/NPC hit targets remain the app's existing HTML buttons; exported sprite art is the visible child only.

## Deliverables

- `academy-exterior.png` (2816 × 1536), produced by the PXL scene `academy-exterior`.
- Source PXL textures and geometry in `pxl/environments/academy-campus.px.js`.
- `academy-exterior.tiled.json` / `.tmj` only as supplementary art metadata; it must never become walkability authority.
- Player/NPC directional sprite sheets and animation metadata.
- Separate exports for props, UI ornaments, items, currency, environment effects and cinematic plates.
- The manifest may mark an asset `ready` only after the generated output exists and passes dimension/frame validation.
- Complete visual comparison on the existing Academy screen before removing or changing any legacy image or map data.


## Full-image quadrant reference and authoring scale

The owner-maintained `src/offline-game/tianhai-academy-map-reference.ts` is the single source of truth for the map geometry and all existing cell flags. The PXL build generates `pxl/maps/references/academy-quadrant-map.json` and a transparent `academy-quadrant-guide.png` from that file before authoring the Academy scene. The guide covers every base cell in the complete 24 × 20 field plus every explicitly registered custom cell. All eight sectors are represented for every mapped cell, including neutral sectors with no current mark.

Use the guide in the PXL authoring preview to align ground, paths, architecture, props, and the south gate. The guide is a reference layer only: **never bake its diamonds, sector dividers, or O/X/opacity symbols into the final Academy PNG or the runtime map**. The app keeps the exact same coordinate model and reads a single transparent image-space hit plane; the editor recreates the full sector guide only while its editor mode is open.

The permanent Tianhai scale reference is: 2816 × 1536 Map Base, 24 × 20 base diamonds, 128 × 69.5 px cell geometry, 8 sectors per diamond, and the existing custom-cell extensions. PXL's authoring preview is 704 × 384 (1:4), so each base diamond appears as 32 × 17.375 preview pixels. Character artwork remains separate 2D directional sprite sheets with a bottom-center ground pivot; preserve the existing 32 × 48 px frame contract and the runtime Player/NPC coordinates. New isometric maps must declare their own Map Base dimensions and calibrated grid, but should reuse this diamond ratio and actor-foot-anchor convention unless their source geometry proves otherwise.

Five legacy custom coordinates currently cross the Map Base edge: `10,30`, `11,31`, `12,31`, `7,27`, and `8,28`. The generator records them in the guide metadata and clips the reference drawing at the image boundary; it does not move them or change their walkability. Resolve those five only after a visual owner review against the original map.
