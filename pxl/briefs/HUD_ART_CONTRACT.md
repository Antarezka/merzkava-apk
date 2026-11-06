# RPG HUD and inventory visual contract

PXL supplies the visual asset layer for the pink World Atlas only. The green TV continues to use the original HUD artwork.

## Artwork coverage

- Player identity/status frame and world-condition/time strip.
- Spirit Ring frames and ring-tier visual accents.
- Tactical skill icons and their tier frames.
- Traveler Satchel / bag icon, inventory panel ornament and window frame.
- Item icon set and tier borders.
- Currency symbols: Xuan Copper (xc), Xuan Silver (xs), Xuan Gold (xg), Zun Jade (zj), Ancient Zun (az).
- Minimap toggle, minimap frame and map marker/category symbols.
- Feedback, selection, tooltip and modal decoration where a PXL asset materially improves the visual presentation.

## Interaction boundary

All controls, buttons, text, counts, meters, accessibility labels, keyboard/Android Back behavior, inventory actions, Satiety calculations and wallet data remain live HTML/TypeScript. PXL assets are decoration/illustration only; they must never replace a real button or its hit target.

## Asset requirements

- Use transparent PNGs for icons and ornaments; use a carefully measured 9-slice or full-panel background for frames.
- Avoid baking variable text, numbers, health bars or currency balances into artwork.
- Keep frame margins and safe areas so text/counts remain readable at 320 CSS pixels and phone display scaling.
- Define stable IDs in `public/assets/augusto-pxl/manifest.json` and explicit source/output metadata in `pxl/asset-map.json`.
- Keep asset dimensions economical; do not ship one large atlas for the entire HUD.
