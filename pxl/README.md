# Augusto PXL source library

This directory is the editable source workspace for the Augusto PXL visual pipeline.

- PXL upstream: https://github.com/augusto-scarvalho/claude-pxl
- Pinned upstream revision: `13a797ee15b05186a49eb8520a4fcfed73d555ae`
- Required authoring runtime: Node.js 22.18.0
- Pipeline contract: PXL source is authored here; exports are copied into `public/assets/augusto-pxl/exports/` and referenced from the manifest.
- Android runtime: packaged files only. The APK does not execute PXL CLI, load the PXL browser viewer, or require a network connection for visuals/gameplay.

## Full art scope

World/region maps, the 3D-look HD-2D isometric Academy environment, isometric local scenes and interiors, 2D Player/NPC/Spirit Beast character sprites, directional idle/walk animations, environment objects, weather/particles, Martial Soul/Spirit Ring/Arcanistry effects, HUD/bag/skill/item/currency artwork, and cinematics.

## Layout

```text
pxl/
  briefs/
  characters/
  environments/
  maps/
  tilesets/
  objects/
  effects/
  ui/
  cinematics/
  validation/
```

Never replace game rules or input handling with PXL. PXL owns visual source and generated output only; current Merzkava movement, eight-sector walkability, NPC decisions, camera logic, map-editor state, inventory actions and DOM touch targets stay authoritative.
