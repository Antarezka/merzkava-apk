# Shared environmental assets

Reusable visual layers shared by all regions. Use true RGBA PNGs when an effect needs genuine alpha transparency. Black-background effect plates are also supported when rendered with CSS `mix-blend-mode: screen`.

## Current test asset

- `fx-02-atmospheric-fog.png` — uploaded fog plate with a black background, intended for Screen blending inside the Offline Game environment viewport.
- Pending integration: the dedicated Offline Game / Expedition Interface screen is not implemented yet. Do not show this effect on Home, World Archive, or Convo.

## Planned asset groups

- `atmosphere/`
- `lighting/`
- `weather/`

Do not assume every planned effect is transparent. Each asset's compositing method must be recorded in `ASSET_MANIFEST.md`.
