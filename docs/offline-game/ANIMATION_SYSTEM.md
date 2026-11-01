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

## 2. Current implementation

| Surface | Motion | State |
|---|---|---|
| Expedition heading and panels | Staggered opacity/vertical entrance | Implemented |
| FX-02 atmospheric fog | Slow horizontal drift, subtle scale and opacity breathing, alternate loop | Implemented |
| Character/status values | Data-driven number transitions | Pending gameplay data integration |
| Tabs, journal, inventory, quest panels | Screen/component transitions | Pending functional UI |
| Weather, day/night and scene transitions | Environment state transitions | Pending world/time runtime |

FX-02 is a dedicated layer inside `.expedition-environment`. Its asset remains static when JavaScript is unavailable or reduced motion is requested; no global fog overlay is used.

## 3. Accessibility and performance

- Respect `prefers-reduced-motion: reduce` through Anime.js scope media-query matching; skip entrance and looping animations when enabled.
- Prefer transform and opacity for routine UI motion.
- Keep the fog movement slow and low-amplitude; avoid rapid flashes, aggressive parallax, or motion that implies gameplay outcomes.
- Keep a readable static environment when motion is disabled.
- Every mount must have a matching `scope.revert()` during screen replacement to prevent duplicate loops and detached-node work.
- Validate on the target low-end Android device for frame pacing, memory, battery, and visual blending before calling the effect device-verified.

## 4. Testing and release gate

Automated tests cover scoped targeting, animation cleanup, reduced-motion behavior, and the presence of the dedicated fog layer.

Still required:
- Confirm the PNG transparency, scale, blending, and placement on a physical Android device.
- Confirm no animation runs after navigating away from Eternal Path.
- Check repeated navigation does not multiply fog loops.
- Check reduced-motion behavior on Android accessibility settings.
- Record the exact APK build and device QA evidence in the master roadmap.

A passing unit test or web build does not prove the fog looks correct on device.
