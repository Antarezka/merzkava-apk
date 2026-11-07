# Tianhai Academy — PXL spatial and quadrant map

The complete production order is documented in [PXL Isometric Map Production Workflow](./PXL_MAP_PRODUCTION_WORKFLOW.md). Follow it in order; the PXL artwork step is deliberately last, after full lasso and cell mapping.

## Canon location and sandbox identity

Tianhai Academy belongs to **Tianhai Yunzhou**, not Golden Dragon Empire. Its developer-only test entry in Golden Dragon Empire is a portal to the authoring sandbox, not a geographical map marker or canon location.

- Sandbox map ID: `pxl-studio:tianhai-academy:exterior`
- Canon sources: `world/REGION_TIANHAI_YUNZHOU.md` and `world/TIANHAI_ACADEMIES_AND_ARCANIST_INSTITUTE.md`
- Visual direction for regional/area maps: Persona 4, Shin Megami Tensei and Raidou Kuzunoha exploration environments.
- World Map remains unchanged.

## Fixed Academy calibration

| Calibration | Value |
|---|---:|
| Map Base | 2816 × 1536 px |
| Base grid | 24 × 20 (480 cells) |
| Preserved extension | 105 custom cells |
| Total mapped cells | 585 |
| Sector split | 8 per cell |
| Total sectors | 4,680 |
| Diamond | 128 × 69.5 px |
| PXL authoring preview | 704 × 384 px (1:4) |

The five extension cells crossing the Map Base edge remain in their original positions: `10,30`, `11,31`, `12,31`, `7,27`, and `8,28`. Do not move them or invent intermediate cells. The existing Canvas Editor retains the original automatic gaps and separately saved bottom expansion; the pan camera depends on the expanded canvas.

## Three independent cell markers

- **O — Foreground:** draw the matching Map Base sector above the player/NPC.
- **X — Blocked:** movement/collision is blocked in that sector.
- **Opacity:** fade an actor behind the marked image geometry.

All diamonds have eight sectors in the order `tl-a`, `tl-b`, `tr-a`, `tr-b`, `bl-a`, `bl-b`, `br-a`, `br-b`. Walkability is a separate whitelist; blank flags do not imply walkable ground.

## Full spatial structure

The lasso polygons and their categories/behavior are in `src/offline-game/tianhai-academy-map-labels.ts`. The editor persists them together with full cell-sector data. The AI handoff file `pxl/maps/tianhai-academy-map-structure.json` contains the complete polygon coordinates, cell calibration, actor starts, marker semantics, canon sources and artwork brief.

The generator `scripts/pxl-build/build-academy-quadrant-guide.mjs` creates the transparent 1:4 quadrant and label guides, plus `academy-quadrant-map.json`. These are PXL reference-only guides, not runtime artwork. The final Academy PNG contains no grid, lasso outline, label text or marker symbols.

Player and NPCs remain tiny—about 4–8 pixels high on screen at the standard camera scale—with independent touch/collision targets. The RPG HUD is a separate UI layer on the left; PXL authoring controls are on the right.

