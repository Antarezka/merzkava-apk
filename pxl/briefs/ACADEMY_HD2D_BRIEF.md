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
