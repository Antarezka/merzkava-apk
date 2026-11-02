# Scene Window FX — Image Generation Prompt Pack

These prompts continue the established FX-02 Atmospheric Fog prompt. They are written for image generators that cannot reliably export transparent PNGs.

## Non-negotiable compositing method

For **every** prompt in this file:

- Canvas: 1024 × 512 pixels, wide horizontal composition.
- Format: PNG.
- Entire background: perfectly pure solid black `#000000`, RGB 0, 0, 0.
- Do not request transparency or alpha. Do not use checkerboards.
- The effect itself must be brighter than black and have soft, natural edges.
- The game composites each image as an isolated overlay with CSS `mix-blend-mode: screen`.
- Pure black must remain black. No grey/blue gradient wash over the canvas.
- Place the effect only inside the clipped Eternal Path Scene Window.
- Anime.js animates the layer in-game. The generated PNG is a texture/shape source, not an animation.

This is the same black-plate + Screen blend method as the working FX-02 fog. If the generator cannot make RGBA transparency, **do not try to force it**.

---

## FX-03 — Warm Sun Glow

```text
Create a high-quality atmospheric sun-glow overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create one elegant, warm sunlight glow source with a soft luminous ivory-gold core, pale amber halo, and delicate feathered light bloom. The glow should feel like natural sunlight diffusing through a high fantasy atmosphere, not a solid sun disk.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Place the main glow source in the upper-right quadrant, slightly inset from the top and right edges.
- A gentle, irregular halo may extend outward from the source.
- Keep most of the canvas completely pure black.
- Use subtle layered luminosity with a bright center and smooth falloff.
- The glow must not become a full-canvas haze.

VISUAL STYLE:

Elegant painterly Eastern Fantasy environmental effect. Warm pearl-white, pale ivory, muted gold, and soft amber highlights. Refined and restrained, suitable for Dawn, Morning, Day, and Dusk lighting.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. The glow must be brighter than black so it appears naturally over game scenery. The effect will be animated separately with Anime.js.

Do not generate transparency, checkerboards, a landscape, a visible sun sphere, clouds, lens flares, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-04 — Cool Moon Glow

```text
Create a high-quality atmospheric moonlight-glow overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create one delicate cool moonlight glow source with a soft pearl-white core, pale silver-blue halo, and subtle diffused bloom. The glow should suggest moonlight illuminating the night air without depicting a moon disk.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Place the main glow source in the upper-right quadrant, slightly inset from the top and right edges.
- Build a restrained, feathered halo with natural irregularity.
- Keep large areas of pure black visible around the glow.
- Avoid a full-canvas blue or grey haze.
- No hard circular boundary or visible celestial body.

VISUAL STYLE:

Elegant painterly Eastern Fantasy night atmosphere. Pearl white, pale silver, very soft blue-grey highlights. Quiet, ethereal, refined, and low contrast outside the glow core.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Only the luminous moonlight effect should be visible after Screen compositing. Anime.js will animate the layer separately.

Do not generate transparency, checkerboards, stars, constellations, a moon disk, landscapes, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-05 — Volumetric Light Rays

```text
Create a high-quality volumetric light-ray overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create several long, soft, atmospheric shafts of sunlight descending diagonally through unseen openings. Each ray should have a luminous pale-gold or pearl-white center, very soft feathered edges, and subtle variation in brightness. The beams should feel like light passing through mist, not hard graphic stripes.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Light rays originate mostly beyond the upper-right edge and travel diagonally toward the lower-left and center.
- Use a small number of broad, separated beams with delicate secondary wisps.
- Keep clear gaps of pure black between all beams.
- Rays must fade smoothly and irregularly rather than ending in hard lines.
- Do not cover the full canvas with haze.

VISUAL STYLE:

Elegant painterly Eastern Fantasy atmosphere. Pale ivory, pearl-white, faint warm gold. Subtle and cinematic, suitable for Dawn, Morning, and Day.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. The bright rays must be distinct from black and suitable for Screen compositing. Anime.js will add slow movement and opacity variation.

Do not generate transparency, checkerboards, a sun disk, lens flare circles, scenery, clouds covering the rays, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-06 — Rain Streak Texture

```text
Create a high-quality rain-streak overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create many fine, semi-luminous rain streaks falling diagonally. Each streak should be narrow, elongated, softly feathered, and subtly varied in length and brightness. The rain should feel like atmospheric rainfall seen in front of a distant scene, not a dense opaque curtain.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Distribute rain streaks unevenly across the canvas.
- Mix short faint streaks with occasional longer, brighter streaks.
- Keep visible pure-black gaps between streaks.
- Use a consistent gentle diagonal direction, with slight natural variation.
- Avoid large droplets, splashes, puddles, or a grey veil.

VISUAL STYLE:

Refined painterly environmental effect for an Eastern Fantasy RPG. Cool pearl-white and very pale blue-grey highlights, restrained brightness, delicate motion-ready shapes.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Rain streaks must be brighter than black and remain individually readable after Screen compositing. Anime.js will provide downward movement and wind drift.

Do not generate transparency, checkerboards, a rainy landscape, clouds, water surfaces, splashes, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-07A — Floating Snow Particles

```text
Create a high-quality floating-snow particle overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create scattered individual snowflakes and tiny soft snow particles suspended in cold air. Use delicate luminous points and a few small, softly detailed crystalline flakes. Each particle must be visually separate.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Distribute particles unevenly, with varied sizes and brightness.
- Include a mixture of tiny distant specks and a few larger foreground flakes.
- Preserve large areas of pure black between particles.
- Avoid a continuous white snowfall curtain or fog bank.
- No ground accumulation and no horizon.

VISUAL STYLE:

Quiet, elegant Eastern Fantasy winter atmosphere. Pearl-white, icy silver, and extremely pale blue highlights. Delicate rather than glittery.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Every snow particle must be brighter than black and separated from neighboring particles. Anime.js will animate particle drift and falling motion.

Do not generate transparency, checkerboards, scenery, snow-covered objects, mountains, buildings, characters, text, borders, or watermarks.
```

## FX-07B — Floating Blossom Petals

```text
Create a high-quality floating-blossom-petal overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create individual delicate flower petals drifting through the air. Petals should have natural curved silhouettes, subtle folds, soft luminous edges, and gentle variation in size. Use a restrained pale blossom palette.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Distribute individual petals unevenly across the canvas.
- Mix a few larger foreground petals with smaller distant petals.
- Vary orientation and curvature; do not arrange petals in rows or a spiral.
- Leave large areas of pure black visible between petals.
- No branches, flowers, trees, or scenery.

VISUAL STYLE:

Elegant painterly Eastern Fantasy spring atmosphere. Pale blush, muted sakura pink, warm ivory, and very soft pearl highlights. Avoid saturated neon pink.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Each petal must be brighter than black and cleanly separated from the background. Anime.js will animate drifting, rotation, and falling motion.

Do not generate transparency, checkerboards, full flowers, branches, trees, scenery, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-07C — Floating Autumn Leaves

```text
Create a high-quality floating-autumn-leaf overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create individual small autumn leaves drifting through the air. Each leaf should have a natural elegant silhouette, subtle veins, gently curled edges, and a soft painterly finish. Leaves must remain separate, readable shapes.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Distribute leaves unevenly with varied size, orientation, and brightness.
- Include a few larger foreground leaves and several smaller distant leaves.
- Preserve large areas of pure black between leaves.
- Avoid dense clusters or a full-canvas shower.
- No branches, trees, ground, or scenery.

VISUAL STYLE:

Elegant Eastern Fantasy autumn atmosphere. Muted amber, antique gold, warm ochre, and restrained copper highlights. No neon orange or oversaturated red.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Leaves must be brighter than black and separated cleanly for Screen compositing. Anime.js will animate slow drifting, rotation, and falling motion.

Do not generate transparency, checkerboards, branches, trees, landscapes, buildings, mountains, characters, text, borders, or watermarks.
```

## FX-08 — Distant Lightning Flash

```text
Create a high-quality distant-lightning overlay asset for a 2D Eastern Fantasy RPG game.

BACKGROUND REQUIREMENT:

The entire canvas must be filled with perfectly pure solid black (#000000), RGB 0, 0, 0.

SUBJECT:

Create one restrained branching lightning flash with thin, irregular, naturally forked luminous channels. The lightning should resemble a distant atmospheric flash behind clouds, not a thick fantasy energy weapon.

COMPOSITION:

- Wide horizontal 1024 × 512 composition.
- Place the main branching flash in the upper half, slightly right of center.
- Use a few delicate secondary branches.
- Keep the lower half mostly pure black.
- Lightning must have soft luminous bloom close to the branches, with no broad white screen wash.
- Preserve large areas of pure black around the flash.

VISUAL STYLE:

Cinematic Eastern Fantasy storm atmosphere. Cool pearl-white with faint icy blue highlights. Thin, elegant, irregular branches; controlled brightness.

TECHNICAL:

1024 × 512 pixels. PNG format. Pure black background for CSS SCREEN BLEND MODE.

IMPORTANT:

Pure black must remain completely black. Lightning must be brighter than black and visible only during a brief Anime.js opacity flash. The asset itself must not contain a full-screen white flash.

Do not generate transparency, checkerboards, storm clouds filling the canvas, rain, landscapes, buildings, mountains, characters, text, borders, or watermarks.
```

---

## Asset naming and integration

Save generated files using these names:

| FX | Filename | Current runtime role |
|---|---|---|
| FX-03 | `fx-03-sun-glow.png` | Optional image replacement/enhancement for procedural sun glow |
| FX-04 | `fx-04-moon-glow.png` | Optional image replacement/enhancement for procedural moon glow |
| FX-05 | `fx-05-volumetric-light-rays.png` | Optional image replacement/enhancement for procedural rays |
| FX-06 | `fx-06-rain-streaks.png` | Texture layer beneath Anime.js rain particles |
| FX-07A | `fx-07a-floating-snow.png` | Optional snow particle texture |
| FX-07B | `fx-07b-floating-petals.png` | Optional blossom-petal texture |
| FX-07C | `fx-07c-floating-autumn-leaves.png` | Optional autumn-leaf texture |
| FX-07A | `fx-07a-window-frost.png` | Edge-masked foreground frost glass during Snow weather |
| FX-08 | `fx-08-lightning-flash-a.png`, `fx-08-lightning-flash-b.png`, `fx-08-lightning-flash-c.png` | Brief lightning texture flash; cycle variants per flash |

FX-01 Soft Cloud and FX-02 Atmospheric Fog are existing assets; do not regenerate them unless their visual quality is specifically being revised.

**Important:** these are image-generation prompts, not proof that the resulting files exist. The current procedural CSS/Anime.js effects remain the runtime fallback until each generated PNG is reviewed, added to the repository, and explicitly mounted in the Scene Window. Never replace a working effect with an unreviewed generated image.
