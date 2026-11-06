# Forbidden Technologies & Regression Safeguards

> **Status: ACTIVE — scoped Pixi World Atlas exception authorized by the owner on 2026-11-06.**
>
> This is the canonical register for renderer and input safeguards. The historical PixiJS Android incident remains a critical regression warning. The owner has explicitly authorized one isolated PixiJS renderer for the second floating World Atlas gateway, and no broader PixiJS adoption.

## 1. PixiJS — RESTRICTED, ONE WORLD ATLAS EXCEPTION

**Permitted only in the separate Eternal Path Pixi CRT-console gateway, implemented by `src/offline-game/pixi-world-atlas-renderer.ts` on branch `03-floating-pixi-world-atlas-tv-console-2026-11-06`.** The old Coastal Receiver remains on its existing DOM/SVG renderer.

The exception is limited to rendering the isometric World Atlas board: Map Base / scene textures, foreground and overlay visuals, Player/NPC visuals, depth sorting, sonar/proximity, and presentation-only movement effects. Both Atlas entries use the same map markup, game data, movement/pathfinding, sub-cell coordinates, NPC interaction/dialogue, account gate, and save/gameplay functions.

### Mandatory input boundary

- **Remove PixiJS EventSystem and AccessibilitySystem before creating a Pixi renderer.** The v8 EventSystem can install document-level pointer listeners in capture phase; CSS alone is not sufficient.
- Pixi canvas must remain `pointer-events: none`, and all Pixi display objects must remain non-interactive (`eventMode = "none"`).
- All real controls, map taps, NPC taps, drag, pinch, camera gestures, keyboard accessibility, and editor actions remain owned by existing DOM controls and handlers.
- Do not add a document capture listener that blocks, stops, or suppresses ordinary pointer/touch events.
- Pixi is presentation only. It must never become authoritative for cell state, collision, walkability, pathfinding, NPC intent, chat, combat, time, inventory, quest results, or local saves.

### Prohibited PixiJS use

- Pixi input, event hit-testing, federated pointer/mouse/touch/wheel events, AccessibilitySystem, or a second input system.
- Pixi in the shared app shell, Convo, login, settings, Noticeboard, Floating Control, Kitty bubble, pull cord, splash, loading screens, Eternal Path cinematic Scene Window, or other non-Atlas surfaces.
- Pixi-specific global settings/preferences, renderer controls in app Settings, global ticker/renderer instances, or render loops for hidden/unmounted Atlas screens.
- Replacing or renaming the existing Coastal Receiver, or silently switching its default DOM/SVG Atlas into Pixi mode.
- Treating a package rename, wrapper, hidden canvas, dynamic import, or disabled event flag as a way to bypass the input restrictions.

The `pixi.js` dependency is permitted only to support the isolated renderer in this branch/feature. Do not use it elsewhere without another explicit owner decision.

## 2. Why the restriction still matters

The project recorded a critical Android interaction incident in [Incident Record — PixiJS and Android Touch/Input Failure](./INCIDENT_PIXIJS_ANDROID_INPUT_FAILURE.md).

The observed failure was that controls could play their click sound while their actual action or navigation did not complete. The owner confirmed that the application immediately worked fully after PixiJS was removed and the previous Anime.js-based implementation was restored.

The before/after device result attributes the incident to the previous Pixi integration, but the exact internal PixiJS listener or low-level mechanism was not isolated. Do not invent a more specific historical cause.

This second Atlas is deliberately separate. It removes the Pixi event systems before renderer initialization and leaves the ordinary DOM controls in charge. That architecture is a testable mitigation, not proof that Android interaction is already safe.

## 3. Approved animation and rendering ownership

- **Anime.js + DOM/CSS** continues to own Eternal Path cinematic scene FX, weather plates/particles, entrance transitions, and other scoped presentation on the Expedition page.
- **PixiJS** is limited to the second World Atlas's isometric world visuals. It is dynamically loaded only after the user taps the Pixi CRT-console icon.
- **DOM** continues to own both floating icons, HUD, World Atlas login, buttons, forms, dialogue, game state, map input, camera/gesture controls, and Developer editor.
- Renderer mount and cleanup must be tied to the visible Pixi Atlas. A hidden screen must not retain a live ticker, animation loop, or duplicate canvas.
- If Pixi initialization fails, restore the existing DOM/SVG visuals and preserve all interactions.

## 4. Protected interactions

Changes to animation, overlays, scene windows, or rendering must preserve and verify:

1. Header/main-menu navigation and all menu actions — verify the actual destination/action, not just the click sound.
2. Noticeboard open/close, outside-tap dismissal, and internal scrolling.
3. Floating Control, Kitty bubble, and pull-cord actions and dragging.
4. Both Eternal Path TV gateways — independent dragging, independent saved positions, correct World Atlas mode, close/back/Escape behavior.
5. World Atlas map-cell tap, Player movement, sub-cell movement, NPC tap, chat replies, camera pan/pinch/zoom, and editor tools.
6. Player login/signup/Remember Me, World Atlas gate close, internal Atlas bypass, and Android Back/gesture behavior.
7. Panel scrolling and touch gestures must not unexpectedly scroll the app shell or activate another control.

A click sound or visual tap effect is not proof that an action completed.

## 5. Mandatory change and verification procedure

Before changing the renderer, dependency, canvas, overlay, or pointer/touch behavior:

1. Read this register and the linked incident record.
2. Inspect the current branch, dependency manifest, renderer source, lifecycle, and existing interaction flow before editing.
3. Keep the Pixi entry and renderer isolated from the old receiver and shared app chrome.
4. Test that EventSystem/AccessibilitySystem are removed before renderer initialization and that Pixi does not register pointer/touch handlers.
5. Add or update automated tests for projection, renderer lifecycle, cleanup, reduced motion, and affected interaction contracts.
6. Run typecheck, gameplay tests, and production build. Record exactly which checks passed or failed.
7. Verify actual Android actions on the target TECNO device, including both floating icons, buttons, NPC chat, map gestures, editor, Noticeboard, Floating Control, Kitty bubble, and pull cord.
8. Record the exact tested commit/build and observed result. Do not claim physical-device verification from a web build or emulator-only run.

## 6. Promotion rule

The owner has approved the isolated Pixi World Atlas prototype. That approval is **not** approval to replace the old receiver, merge to the production/default branch, remove the DOM renderer, or use Pixi on other app surfaces.

The new renderer must pass automated checks and physical-device Android QA before promotion. If any DOM control fails, close the Pixi renderer, return to the DOM/SVG fallback, and investigate before another device attempt.

## 7. Enforcement and maintenance

- This file remains the canonical technology/input safeguard.
- `PROJECT_DIRECTIVES.md` requires developers to read it before dependency, renderer, animation, canvas, overlay, or input-layer changes.
- `docs/offline-game/ANIMATION_SYSTEM.md` owns Anime.js scene effects; `docs/offline-game/PIXIJ_GAME_MODE_RENDERER_EVALUATION.md` owns the Pixi Atlas visual renderer.
- `KNOWN_ISSUES.md` and the incident record preserve the historical Android failure.
- Any expansion beyond the second Atlas gateway requires another explicit owner decision and a new regression review.
