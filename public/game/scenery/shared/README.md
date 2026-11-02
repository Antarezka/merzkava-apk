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

See [FX_GENERATION_PROMPTS.md](./FX_GENERATION_PROMPTS.md) for the source prompts. The generated FX-03 through FX-08 plates are now mounted in the Eternal Path Scene Window and animated individually with Anime.js. The original procedural CSS/particle treatments remain as fallbacks and complementary layers.

## Existing assets

- `fx-01-soft-cloud-layer.png` — cloud overlay, mounted in its own Screen-blended layer and moved with Anime.js.
- `fx-02-atmospheric-fog.png` — black-background fog plate, mounted in the Scene Window with Screen blending and Anime.js drift.
- `fx-03-sun-glow.png`, `fx-04-moon-glow.png`, `fx-05-volumetric-light-rays.png` — uploaded light plates with slow, cycle-aware Anime.js motion.
- `fx-06-rain-streaks.png` — uploaded rain texture with downward/wind motion; procedural particles add depth.
- `fx-07a-floating-snow.png`, `fx-07a-window-frost.png` — snowfall plate and edge-masked foreground frost.
- `fx-07b-floating-petals.png`, `fx-07c-floating-autumn-leaves.png` — seasonal plates with gentle drift/rotation.
- `fx-08-lightning-flash-a.png`, `fx-08-lightning-flash-b.png`, `fx-08-lightning-flash-c.png` — alternate distant lightning plates cycled during Rain-weather flashes.

## Procedural companions and fallbacks

CSS gradients and generated Anime.js particles remain as complementary rain/snow/petal/leaf detail and fallback rendering. Uploaded image plates do not replace the live world-state selectors.

## Scope and safety

- FX must remain inside the Offline Game / Eternal Path Scene Window.
- Never show these effects on Home, World Archive, Convo, or the shared app shell.
- Anime.js controls presentation motion only; it does not control game state or world time.
- Respect `prefers-reduced-motion` and remove all scene effects when the Eternal Path view unmounts.
