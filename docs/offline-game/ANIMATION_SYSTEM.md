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

FX-02 remains a dedicated layer inside `.expedition-environment`, presented as a framed scene window with an inset double-line border and independent scene labels. Scene artwork is rendered as a separate background image; fog is a separate translucent layer. Anime.js targets only the inner fog texture, so it cannot overwrite the parent opacity controlled by live world state. No global fog overlay is used.

## 3. Current implementation

| Surface | Motion / behavior | State |
|---|---|---|
| Expedition heading and panels | Staggered opacity/vertical entrance | Implemented |
| FX-02 atmospheric fog | Slow, low-amplitude texture movement inside the live opacity layer | Implemented |
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
- Confirm all eight scene PNG paths, crop, live fog alpha, blend, and text contrast on a physical Android device.
- Confirm a future travel action changes the persisted location and scene together.
- Confirm time advancement from non-dialogue activities changes the day-cycle without changing dialogue progress.
- Confirm weather changes on world-day transitions, not after a fixed number of dialogue choices.
- Confirm no animation runs after navigating away from Eternal Path.
- Check repeated navigation does not multiply fog loops.
- Check reduced-motion behavior on Android accessibility settings.
- Record the exact APK build and device QA evidence in the master roadmap.

A passing unit test or web build does not prove the fog looks correct on device.
