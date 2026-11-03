# Arcanistry Rotary — Staged Implementation & Verification

**Priority:** Highest active repair  
**Owner-approved direction:** Aperture-driven mechanical rotary; complete one stage and pass its gate before starting the next.  
**Implementation branch:** `feature/arcanistry-rotary-stage1-spec-2026-11-03`  
**Baseline branch:** `repair/restore-touch-clicks-2026-11-03`  
**Status:** Stage 1 specification and audit recorded. No runtime behavior changed in Stage 1.

## Non-negotiable interaction contract

1. Every destination is represented by an aperture on the rotary itself. There is no separate rectangular destination index.
2. The player presses and drags the selected aperture toward the fixed activation mark.
3. Reaching the activation mark is only the **activation threshold**. It must not start travel or scene loading.
4. Successful activation is committed only when the player releases the active touch/pointer while the selected aperture is within the activation tolerance.
5. After a valid release: finish mechanical locking; return the rotary to its home position through the mechanical return animation; only after that completes, show scene loading; then open the mapped destination scene.
6. If release occurs before the threshold, or the gesture is cancelled: return the rotary to its origin, reverse the gear/thread/locking motion, progressively reopen every aperture, and remain on the current map. Do not show loading or change location.
7. A destination without a verified scene mapping may be previewed/selected, but cannot complete travel. It must never be treated as a successful route.
8. During the drag, all visible mechanics are driven by the same normalized drag progress. If the player pauses, the mechanism pauses. No autonomous gear/thread motion may imply progress the player has not made.
9. Motion uses the existing Anime.js 4.x + ordinary DOM/CSS approach. Anime.js is animation-only, never a second pointer/touch input system. No PixiJS, canvas renderer, WebGL/WebGPU, or alternate input framework.
10. Sound effects, chimes, and other audio polish are deferred until the mechanical interaction and Arcanistry behavior are verified as complete.

## Mechanical progress contract

Use one normalized progress value, clamped to `0..1`, derived from the selected aperture's actual position relative to the fixed activation mark. The same value must drive all mechanical presentation:

| Component | Required response to progress |
|---|---|
| Selected aperture / rotary | Tracks the player's drag and reaches the fixed activation mark at threshold |
| Small gears | Begin moving progressively with the drag; stop immediately when input stops |
| Main gear | Follows the driven gear with a consistent, mechanically plausible direction and ratio |
| Red threads | Change path position and tension with the same progress; visibly tighten/relax rather than play a detached loop |
| Axles / shafts | Move in a defined sequence linked to progress |
| Locking parts | Engage progressively as the non-selected apertures are drawn inward |
| Other apertures | Retract inward progressively; never disappear independently of the mechanism |

The implementation may use derived transforms/attributes for individual components, but they must all be calculated from the same authoritative progress value. Returning or cancelling must reverse those derived positions from their current values rather than jump to unrelated endpoints.

## State machine

`idle → dragging → threshold-reached → release-committed → locking → returning-home → loading → destination`

Failure path:

`idle → dragging → (released-before-threshold OR pointer-cancelled) → reversing → apertures-restored → idle`

Rules:
- `threshold-reached` is still an input state, not a travel state.
- Only a valid pointer/touch release may commit success.
- Loading is forbidden before `locking` and `returning-home` have both completed.
- The failed path must never call `setEternalLocation`.
- Guard against duplicate pointerup/cancel events and stale animation callbacks.
- Pointer capture must be released safely. Closing the drawer or replacing the screen during a gesture must cancel and clean up the active gesture/animation.
- Respect `prefers-reduced-motion`; preserve the same state order and outcomes even when transitions are shortened or skipped.

## Stage gates — strict sequence

### Stage 1 — Audit and specification
- [x] Read `docs/FORBIDDEN_TECHNOLOGIES.md`.
- [x] Read `docs/INCIDENT_PIXIJS_ANDROID_INPUT_FAILURE.md`.
- [x] Read `docs/offline-game/ANIMATION_SYSTEM.md`.
- [x] Inspect the current branch's rotary markup, CSS, interaction handler, helper functions, and tests.
- [x] Record the current baseline and known implementation gaps.
- [x] Lock the interaction contract, mechanical progress contract, state machine, and stage gates in this document.
- [x] Owner reviewed and approved the staged specification in chat on 2026-11-03.
- [x] Stage 1 gate passed before Stage 2 implementation began.

**Stage 1 audit findings (baseline branch):**
- The current markup already renders destination apertures directly on the rotary, a fixed activation marker, two SVG thread paths, three gear elements, and a route-loading overlay.
- The current source already has pure geometry helpers in `src/offline-game/arcanistry-rotary.ts` and basic angle/progress tests in `tests/offline-game/arcanistry-rotary.test.ts`.
- The current pointer handler begins from a destination aperture and updates CSS custom properties for rotary angle, three gear rotations, thread dash offset, and other-aperture inset/scale/opacity.
- The current release handler distinguishes alignment and route mapping, but success currently starts timed CSS/class transitions and schedules scene loading using fixed timeouts. The implementation does not yet prove that the locking and rotary-return animations have actually completed before loading begins.
- The failure path also uses fixed delays to restore apertures and threads. It needs explicit reversible animation/state completion and interruption cleanup.
- The current mechanical markup has two SVG thread paths and three gear decorations, but the inspected markup does not yet establish a complete visible axle/shaft/locking sequence.
- Current verified travel mappings in `selectArcanistDestination` are limited to `gde-city` (Imperial Capital) and `gde-academy` (Academy). Other aperture entries currently resolve to preview-only/no scene mapping; Stage 2+ must preserve that guard unless a destination mapping is separately verified.
- The rotary interaction currently calls the existing clockwork sound while dragging. Audio changes/polish are out of scope until the owner-approved mechanical behavior is complete.

### Stage 2 — Input geometry and threshold
- [ ] Derive selected-aperture position and threshold from the actual rotary geometry, not an unrelated pointer angle.
- [ ] Verify pointer/touch drag tracking in both directions and across angle wraparound.
- [ ] Reaching threshold alone does not lock, load, or travel.
- [ ] Releasing inside the threshold commits success exactly once.
- [ ] Releasing outside threshold and pointer cancellation take the failure path.
- [ ] Add automated tests for threshold boundary, release semantics, cancellation, and unsupported destinations.
- [ ] Stage 2 tests and review pass before Stage 3.

### Stage 3 — Input-driven mechanical synchronization
- [ ] Introduce one normalized progress source for the entire mechanism.
- [ ] Tie rotary, small gears, main gear, threads, shafts, locking parts, and aperture retraction to that progress.
- [ ] Pausing input freezes every mechanical component at its current progress.
- [ ] Reversing input reverses all dependent mechanical positions coherently.
- [ ] Add tests for progress mapping, direction/ratio, pause, reverse, and cleanup.
- [ ] Verify reduced-motion fallback and animation lifecycle.
- [ ] Stage 3 tests and review pass before Stage 4.

### Stage 4 — Successful activation sequence
- [ ] Valid release commits the route exactly once.
- [ ] Mechanical locking completes.
- [ ] Rotary returns to its home position through the mechanical animation.
- [ ] Scene loading starts only after the return animation completion callback/state.
- [ ] Destination scene opens only after loading.
- [ ] No fixed timeout may stand in for an unverified animation completion.
- [ ] Test duplicate events, interrupted screen/drawer, reduced motion, and valid/unsupported routes.
- [ ] Stage 4 tests and review pass before Stage 5.

### Stage 5 — Failure and restoration sequence
- [ ] Early release reverses all components from their current positions.
- [ ] Rotary returns to the original area.
- [ ] Gear and thread motion reverses coherently.
- [ ] Other apertures reopen progressively.
- [ ] Failure never shows the loading overlay and never calls `setEternalLocation`.
- [ ] The mechanism returns to a clean, reusable idle state.
- [ ] Test repeated success/failure cycles and cancellation during every gesture phase.
- [ ] Stage 5 tests and review pass before Stage 6.

### Stage 6 — Verification and release
- [ ] Run typecheck.
- [ ] Run the complete automated test suite.
- [ ] Run production build.
- [ ] Review diff for forbidden technologies and unrelated interaction changes.
- [ ] Verify real touch actions on the target Android WebView/device; a sound, unit test, or web build is not device verification.
- [ ] Regression-check header navigation, Noticeboard, Floating Control, Kitty bubble, pull-cord, panel scrolling, and Eternal Path animation cleanup.
- [ ] Record exact commit, CI/build run, APK artifact size, device/build tested, and observed results.
- [ ] Audio/sound polish may be scheduled only after the mechanical and Arcanistry gates are accepted.

## Change log

| Stage | Result | Evidence |
|---|---|---|
| Stage 1 | **PASSED** — specification approved; Stage 2 implementation is isolated on its own branch | This document; baseline branch `repair/restore-touch-clicks-2026-11-03` |
| Stage 2–6 | Not started | Strict stage gate |
