# Shared environmental assets

Reusable visual layers shared by Eternal Path. The actual effects are composed only inside the clipped Scene Window.

## Compositing rule — keep this

When RGBA transparency cannot be produced reliably (for example, by Gemini), use the same method as the working fog layer:

1. Keep the visual effect on a pure black `#000000` background.
2. Place the PNG as an isolated overlay layer.
3. Apply CSS `mix-blend-mode: screen`.
4. Keep the overlay inside `.expedition-environment` so the Scene Window clips it.
5. Animate it with Anime.js; do not move the effect into the global app shell.

Black becomes visually transparent under Screen blending while the bright fog/cloud/light details remain. True RGBA is optional, not a blocker.

## FX image-generation prompts

See [FX_GENERATION_PROMPTS.md](./FX_GENERATION_PROMPTS.md) for the next asset prompts (sun glow, moon glow, light rays, rain streaks, snow, petals, autumn leaves, and lightning). Every prompt follows the proven pure-black `#000000` background + CSS `mix-blend-mode: screen` workflow. Generated files remain optional enhancements; keep the procedural CSS/Anime.js implementation until each image is reviewed and integrated.

## Existing assets

- `fx-01-soft-cloud-layer.png` — cloud overlay, mounted in its own Screen-blended layer and moved with Anime.js.
- `fx-02-atmospheric-fog.png` — black-background fog plate, mounted in the Scene Window with Screen blending and Anime.js drift.

## Procedural effects

Sun glow, moon glow, light rays, rain streak/particles, snow/petal/leaf particles, and lightning are currently rendered with CSS layers and Anime.js rather than additional painted PNG files. Do not list these procedural effects as uploaded image assets.

## Scope and safety

- FX must remain inside the Offline Game / Eternal Path Scene Window.
- Never show these effects on Home, World Archive, Convo, or the shared app shell.
- Anime.js controls presentation motion only; it does not control game state or world time.
- Respect `prefers-reduced-motion` and remove all scene effects when the Eternal Path view unmounts.
