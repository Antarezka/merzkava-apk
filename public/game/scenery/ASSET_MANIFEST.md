# Offline Game Scenery & Scene FX Manifest

Status: runtime registry with uploaded image FX mounted and Anime.js motion profiles
Branch: `feature/archive-experience`

## Rendering and compositing contract

- Master scenery stays free of baked-in weather, time-of-day lighting, text, UI, and characters.
- **Preferred no-alpha overlay method:** export an effect as a PNG with a pure black (`#000000`) background, then composite it with CSS `mix-blend-mode: screen`. Black disappears against the scene while luminous/fog detail remains visible.
- This is the same verified-in-code compositing method used by FX-02 Atmospheric Fog. Use it when an image generator (including Gemini) cannot produce reliable RGBA transparency; do not waste time trying to force a transparent export.
- True RGBA PNG remains acceptable when it is genuinely available, but it is not required for this Screen workflow.
- Every overlay must be mounted inside `.expedition-environment` (the Scene Window), clipped by its overflow boundary. Never attach scenery FX to the app shell, Home, World Archive, or Convo.
- Anime.js owns all motion. CSS supplies blending, gradients, masks, and particle appearance; animation must remain active except when the user has enabled reduced motion.
- Weather/time effects are presentation only. They must not mutate game time, weather state, RNG, or save data.

## Scenery inventory — all 26 assets present and registered

All paths below are the existing PNG files in `public/game/scenery`. They are visual content marked `IN_GAME_ORIGINAL`; a scene image is not proof of a canon settlement name.

| ID | Existing runtime asset | Registry |
|---|---|---|
| GDE-01 | `golden-dragon-empire/establishing-views/gde-01-imperial-city-panorama.png` | Registered |
| GDE-02 | `golden-dragon-empire/gde-02-traditional-city-street.png` | Registered |
| GDE-03 | `golden-dragon-empire/gde-03-imperial-city-gate.png` | Registered |
| GDE-04 | `golden-dragon-empire/gde-04-marketplace-street.png` | Registered |
| GDE-05 | `golden-dragon-empire/gde-05-cultivation-academy-courtyard.png` | Registered |
| GDE-06 | `golden-dragon-empire/gde-06-rural-village-landscape.png` | Registered |
| GDE-07 | `golden-dragon-empire/gde-07-mountain-wilderness-panorama.png` | Registered |
| TY-01 | `tianhai-yunzhou/ty-01-floating-island-city-panorama.png` | Registered |
| TY-02 | `tianhai-yunzhou/ty-02-skyport-airship-approach.png` | Registered |
| TY-03 | `tianhai-yunzhou/ty-03-elevated-city-street.png` | Registered |
| TY-04 | `tianhai-yunzhou/ty-04-market-district-environment.png` | Registered |
| TY-05 | `tianhai-yunzhou/ty-05-academy-environment.png` | Registered |
| TY-06 | `tianhai-yunzhou/ty-06-island-edge-cloud-sea.png` | Registered |
| TY-07 | `tianhai-yunzhou/ty-07-residential-terrace.png` | Registered |
| BG-01 | `beiming-gu/bg-01-northern-territory-panorama.png` | Registered |
| BG-02 | `beiming-gu/bg-02-snowbound-settlement.png` | Registered |
| BG-03 | `beiming-gu/bg-03-blue-flame-silver-tiger-habitat.png` | Registered |
| BG-04 | `beiming-gu/bg-04-rare-metal-mining-landscape.png` | Registered |
| BG-05 | `beiming-gu/bg-05-northern-mountain-pass.png` | Registered |
| BG-06 | `beiming-gu/bg-06-beiming-gu-grand-hall.png` | Registered |
| BG-07 | `beiming-gu/bg-07-frozen-lake-river.png` | Registered |
| LT-01 | `lawless-territories/lt-01-lawless-territory-wilderness.png` | Registered · broad visual category |
| LT-02 | `lawless-territories/lt-02-southern-port-isles.png` | Registered · broad visual category |
| AZ-01 | `special-locations/az-01-azerion-illusion-fog-boundary.png` | Registered · Archive provenance review pending |
| AZ-02 | `special-locations/az-02-azerion-great-lake.png` | Registered · Archive provenance review pending |
| RA-01 | `special-locations/ra-01-ruined-archiver-outpost.png` | Registered · Archive provenance review pending |

Lawless Territories and Special Locations remain separate scene groups, not additional playable starting regions. Their image records are deliberately labelled original/visual-only until exact Archive dossier and source-path provenance is verified. Do not infer a specific settlement, ownership, route, or canon detail from the artwork.

## Shared FX inventory and runtime state

| ID | Effect | Current implementation |
|---|---|---|
| FX-01 | Soft cloud layer | Existing PNG mounted as its own Screen-blended layer; Anime.js cloud drift |
| FX-02 | Atmospheric fog | Existing black-background PNG; Screen blend inside Scene Window; Anime.js drift and opacity |
| FX-03 | Sun glow | fx-03-sun-glow.png Screen-blended image plate; slow Anime.js breathing/drift in Dawn–Dusk |
| FX-04 | Moon glow | fx-04-moon-glow.png Screen-blended image plate; slower Anime.js breathing at Night |
| FX-05 | Volumetric light rays | fx-05-volumetric-light-rays.png Screen-blended image plate; slow Anime.js lateral/vertical drift during daylight |
| FX-06 | Rain streaks | fx-06-rain-streaks.png Screen-blended texture with Anime.js downward/wind movement; procedural rain particles remain layered in front |
| FX-07A | Floating snow | fx-07a-floating-snow.png Screen-blended snowfall plate plus Anime.js particles during Snow weather |
| FX-07A | Window frost | fx-07a-window-frost.png Foreground edge-masked frost glass; subtle Anime.js opacity/scale breathing during Snow weather |
| FX-07B | Floating petals | fx-07b-floating-petals.png Screen-blended seasonal plate with slow Anime.js drift/rotation at Dawn |
| FX-07C | Floating autumn leaves | fx-07c-floating-autumn-leaves.png Screen-blended seasonal plate with slow Anime.js drift/rotation at Dusk |
| FX-08 | Lightning flash | Three uploaded plates A/B/C, cycled per flash with brief Anime.js opacity keyframes during Rain weather; procedural fallback retained in CSS |

## Validation boundary

Registry coverage is 26/26 scenery PNGs. All uploaded shared FX plates FX-03 through FX-08 (including the three lightning variants and window frost) are mounted inside the Scene Window with effect-specific Anime.js motion. Browser rendering, image visual quality, frame-time performance, reduced-motion behavior, and Android-device appearance still require a fresh build and on-device QA. Do not mark visual/device validation complete based only on source inspection.
