# Shared environmental assets

Reusable visual layers shared by all regions. Use true RGBA PNGs when an effect needs genuine alpha transparency. Black-background effect plates are also supported when rendered with CSS `mix-blend-mode: screen`.

## Current test asset

- `fx-02-atmospheric-fog.png` — uploaded fog plate with a black background; the game temporarily displays it using Screen blending.
- The temporary default is controlled by `SCENERY_FOG_TEST_ENABLED` in `src/main.ts`.

## Planned asset groups

- `atmosphere/`
- `lighting/`
- `weather/`

Do not assume every planned effect is transparent. Each asset's compositing method must be recorded in `ASSET_MANIFEST.md`.
