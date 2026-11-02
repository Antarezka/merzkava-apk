# Eternal Path — Animation System

> **Parent plan:** [Master Product Roadmap](../PRODUCT_ROADMAP.md).
> **Runtime owner:** `src/offline-game/expedition-animations.ts`.
> **Library:** Anime.js 4.x (`animejs` dependency already present).

## 1. Ownership and isolation

Anime.js is the motion engine for the standalone **Merzkava: Eternal Path** experience. Its animation module is owned by `src/offline-game/`; it must not become a global animation controller for the shared APK shell, Convo, World Archive, Home, or other screens.

- Mount animations only after the Expedition Interface has been rendered.
- Create an Anime.js `Scope` rooted at the current `.expedition-page` element.
- Revert the scope before the app replaces screen markup. This cancels loops and restores animated inline styles.
- Never use global selectors to target Expedition elements.
- Do not animate or mutate authoritative game state. Animation is presentation only.

## 2. Live scene-window contract

The framed Scene Window is a presentation of the **authoritative local world state**, not a visualization of the current dialogue.

| Input from game state | Scene-window response |
|---|---|
| Persisted world location ID | Selects the actual scene composition, image, label, and region |
| Local world clock | Derives Dawn, Morning, Day, Dusk, or Night lighting |
| World-day weather | Selects Clear, Cloudy, Fog, Rain, or Snow treatment |
| Region | Adds the region-specific ambient light and atmosphere |
| Fog/weather intensity | Controls the parent fog layer opacity; Anime.js only moves the inner texture |

The current location is stored in the Eternal Path save as `locationId`. It is independent from `EternalDialogue.sceneId`; dialogue progression cannot move the camera or change the viewed location. The travel/location system will call the validated `setEternalLocation(sceneId)` API when a real world movement is implemented.

The local world clock can be advanced by any activity through `advanceEternalWorldTime(minutes)`; the scene derives its day-cycle from that clock. Daily weather is selected from a deterministic region/day pattern, not from the number of dialogue choices. The current calendar implementation still has a limited persisted date model; full year/month/season integration remains part of the Life Simulation design and engine roadmap.

**The temporary Scene Test Bench has been removed.** The Scene Window always renders live world state. No manual scene, cycle, weather, or fog override is available in normal gameplay.

All scene effects are dedicated layers inside `.expedition-environment`, clipped by the Scene Window. The current registry contains 26 existing scenery PNGs across the three major powers, Lawless Territories, and Special Locations; the authored dialogue pool intentionally remains limited to eight compositions until additional location-specific content is reviewed.

**Transparency fallback — preserve this exact method:** when Gemini or another generator cannot produce dependable RGBA alpha, export the effect as a PNG on a pure black `#000000` field and apply CSS `mix-blend-mode: screen` to its isolated overlay layer. This is the same compositing method used by the atmospheric fog plate. Black visually disappears while the brighter fog/cloud/light detail remains. True RGBA is optional, not a blocker. Never move this layer outside the clipped Scene Window.

The stack mounts FX-01 clouds and FX-02 fog plus the uploaded FX-03 sun glow, FX-04 moon glow, FX-05 volumetric rays, FX-06 rain streaks, FX-07A snow and window frost, FX-07B petals, FX-07C leaves, and FX-08 lightning variants A/B/C. Every plate is an isolated Screen-blended layer inside the clipped Scene Window. Anime.js uses separate motion profiles: slow cloud/fog drift; warm sun and cool moon breathing; very slow ray drift; faster downward rain streaks; slow falling snow; gentle petal/leaf drift and rotation; edge-frost breathing; and brief, infrequent lightning flashes that cycle through A/B/C. Existing procedural rain/snow particles and CSS fallback treatments remain layered in place. CSS owns compositing, masks, gradients, and static fallback appearance. Animation remains presentation-only and is cleaned up with the scoped mount lifecycle. No global fog or scene FX overlay is used.

## 3. Current implementation

| Surface | Motion / behavior | State |
|---|---|---|
| Expedition heading and panels | Staggered opacity/vertical entrance | Implemented |
| FX-01 soft clouds | Screen-blended image layer with slow Anime.js drift | Implemented |
| FX-02 atmospheric fog | Black-background Screen blend; slow texture movement inside the live opacity layer | Implemented |
| FX-03 sun glow | Uploaded Screen-blended image; slow breathing/drift in Dawn–Dusk | Image mounted; Android QA pending |
| FX-04 moon glow | Uploaded Screen-blended image; slower breathing at Night | Image mounted; Android QA pending |
| FX-05 volumetric rays | Uploaded Screen-blended image; slow daylight drift | Image mounted; Android QA pending |
| FX-06 rain streaks | Uploaded Screen-blended streak plate plus procedural particles | Image mounted; Android QA pending |
| FX-07A snow / window frost | Snow plate and edge-masked foreground frost with separate motion | Images mounted; Android QA pending |
| FX-07B petals / FX-07C leaves | Separate seasonal plates with gentle drift and rotation | Images mounted; Android QA pending |
| FX-08 lightning | Three image variants cycled during brief Rain-weather flashes | Images mounted; Android QA pending |
| Scene location | Persisted world location, independent from dialogue metadata | Implemented |
| Day-cycle lighting | Derived from local world clock | Implemented |
| Regional atmosphere | Region-specific light treatment | First slice implemented |
| Weather presentation | Deterministic daily regional weather with clear/cloudy/fog/rain/snow overlays | First slice implemented |
| Character/status values | Data-driven number transitions | Pending gameplay data integration |
| Tabs, journal, inventory, quest panels | Screen/component transitions | Pending functional UI |
| Travel-driven scene transitions | Validated location updates from the travel system | Pending travel system |

## 4. Accessibility and performance

- Respect `prefers-reduced-motion: reduce` through Anime.js scope media-query matching; skip entrance and looping animations when enabled.
- Prefer transform and opacity for routine UI motion.
- Keep fog movement slow and low-amplitude; avoid rapid flashes, aggressive parallax, or motion that implies gameplay outcomes.
- Keep a readable static environment when motion is disabled.
- Every mount must have a matching `scope.revert()` during screen replacement to prevent duplicate loops and detached-node work.
- Do not run animation loops when Eternal Path is not mounted.
- Validate on the target low-end Android device for frame pacing, memory, battery, and visual blending before calling the effect device-verified.

## 5. Testing and release gate

Automated tests cover scoped targeting, animation cleanup, reduced-motion behavior, live location binding, world-clock lighting, and daily weather independence from dialogue count.

Still required:
- Confirm all 26 registered scenery PNG paths, every FX-01–FX-08 image plate, black-background Screen compositing, frost edge mask, live fog visibility, text contrast, and particle density on a physical Android device.
- Confirm a future travel action changes the persisted location and scene together.
- Confirm time advancement from non-dialogue activities changes the day-cycle without changing dialogue progress.
- Confirm weather changes on world-day transitions, not after a fixed number of dialogue choices.
- Confirm no animation runs after navigating away from Eternal Path.
- Check repeated navigation does not multiply fog loops.
- Check reduced-motion behavior on Android accessibility settings.
- Record the exact APK build and device QA evidence in the master roadmap.

A passing unit test or web build does not prove the fog looks correct on device.


## PixiJS atmosphere renderer and performance tiers

Eternal Path uses PixiJS v8 for the moving weather/season particle layer inside `.expedition-environment` only. PixiJS is installed as an npm dependency and bundled by Vite into local application assets; the renderer and scene effects do not require a network connection at runtime. The surrounding scene artwork, window frame, text, lighting plates, and Anime.js presentation transitions remain in their existing DOM/CSS/Anime.js layers.

The Settings > Performance control stores `merzkava-performance-tier` locally and offers four quality levels:

| Level | Pixi resolution multiplier | Particle budget (rain / snow / petals) | Renderer cap |
|---|---:|---:|---:|
| Sangat Rendah | 0.45 | 7 / 6 / 5 | 24 FPS |
| Rendah | 0.65 | 11 / 9 / 8 | 30 FPS |
| Normal | 0.82 | 17 / 14 / 11 | 45 FPS |
| Tinggi | 1.00 | 24 / 19 / 15 | 60 FPS |

Resolution is multiplied by a device-pixel-ratio cap of 2. The setting affects the PixiJS particle canvas resolution, particle count, and ticker cap; it does not downscale the underlying scene background image or other app screens. The renderer pauses while the document is hidden, is destroyed when Eternal Path rerenders or closes, and falls back to the existing Anime.js DOM particles if PixiJS initialization fails or reduced motion is requested.
