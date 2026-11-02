# Eternal Path UI Repair Checklist

**Status:** Open — latest user testing still reproduces toolbar drift.
**Master tracking:** [Product Roadmap §15](../PRODUCT_ROADMAP.md#15-active-ui-repair--eternal-path-scene-and-navigation-2026-11-02)
**GitHub issue:** [#2 — Eternal Path toolbar drift and scene/narrative layout refinement](https://github.com/Antarezka/merzkava-apk/issues/2)
**Scope:** Shared app navigation plus Eternal Path Scene Window, Save Manager and narrative presentation.
**Rule:** Keep this as a checklist and evidence log. Do not mark an item complete from CSS intent or a passing unit test alone; Android device verification is required.

## UI-EP-002 — Toolbar position drift

**Observed:** The toolbar/navigation rail still moves from its expected position in the latest user-tested build. A previous fix was recorded in the roadmap, but the regression persists.

### Investigation checklist
- [ ] Reproduce on the latest branch-head APK and record screen, route, device width, orientation and exact interaction sequence.
- [ ] Inspect the actual rendered DOM: identify the toolbar's containing block and every ancestor with transform, filter, perspective, contain, will-change, animation or overflow clipping.
- [ ] Verify route-transition animation does not transform the app-shell ancestor that owns the fixed toolbar.
- [ ] Verify screen changes do not recreate the toolbar at a different scroll offset or invoke automatic scrollIntoView/focus scrolling.
- [ ] Verify toolbar remains viewport-anchored when switching Home → Convo → Eternal Path → Archive → Settings and when returning.
- [ ] Verify manual horizontal swipe still works and route selection does not change the rail's scroll position.
- [ ] Verify safe-area insets and Android gesture margins on narrow screens.
- [ ] Add regression tests for transformed ancestors, route switching, stable scroll position and viewport anchoring.
- [ ] Install APK on target Android device and confirm the toolbar no longer moves during repeated route changes.
- [ ] Attach test evidence (screen recording or screenshots + build SHA) before closing.

**Acceptance:** toolbar remains in one stable viewport position through route transitions and rerenders; users can manually scroll the rail; no route selection auto-shifts it; no clipping or gesture-area collision.

## UI-EP-003 — Save Manager hidden menu

- [ ] Remove the full-width/always-visible Save Manager section from the active Eternal Path content flow.
- [ ] Show only a small, restrained ornamental Save Manager icon/button while a journey is active.
- [ ] Open the existing manager content only after the trigger is clicked; use a floating overlay/popover/sheet that does not push the scene or narrative.
- [ ] Include an explicit close control and support Android Back/Escape.
- [ ] Keep all current actions: load, rename, export, delete, create another journey, import backup and delete-all confirmation.
- [ ] Keep the no-active-journey creation/restore path discoverable; do not hide the only way to start or restore a journey.
- [ ] Add tests for hidden-by-default, open/close, save operations and focus/keyboard behavior.

**Acceptance:** with an active journey, the Save Manager occupies no permanent content row; only the small trigger is visible until tapped. Opening it does not reflow the Scene Window or narrative.

## UI-EP-004 — Narrative meets the weather window

- [ ] Rework active-journey ordering so the narrative block sits directly below the weather Scene Window, with the disposition strip immediately above the narrative if retained.
- [ ] Remove the unnecessary vertical gap between the Scene Window/disposition and narrative surface.
- [ ] Preserve Scene Window clipping: rain, snow, frost, fog and lightning layers must not bleed into narrative or app shell.
- [ ] Keep profile details compact and secondary; do not let profile/manager panels split the scene from its narrative.
- [ ] Verify at 320–360 px widths and larger screens.

**Acceptance:** the scene and its narrative read as one continuous framed experience; no atmospheric FX escape the glass window.

## UI-EP-005 — Compact ink-brush clock

- [ ] Put the in-world day/time in a compact black brush-stroke backing.
- [ ] Use translucent black opacity so the scene remains subtly visible through it.
- [ ] Add an uneven/fading tail to the right edge, like a single ink stroke dragged across the glass.
- [ ] Size the backing to the clock text plus minimal padding only; do not create a full-width banner.
- [ ] Preserve legibility in all weather and day-cycle combinations.

**Acceptance:** the backing is only as wide as the clock label needs, with a soft translucent body and a visible tapered tail.

## UI-EP-006 — Narrative structure refinement

The current narrative card has the right broad categories but the hierarchy reads like separate metadata blocks rather than one unfolding moment. Refine it into this sequence:

1. **SETTING / ATMOSPHERE** — concise sensory details observable in the current location and weather; avoid generic repeated filler.
2. **SCENE ACTION** — the concrete event happening now, expressed as a short scene heading and focused paragraph.
3. **CHARACTER BEHAVIOR** — visible gesture, posture, hesitation or action by the speaker/NPC; do not state hidden thoughts or motives as facts unless known.
4. **DIALOGUE** — speaker identity and spoken words, visually distinct and easy to scan.
5. **PLAYER RESPONSE** — one restrained action button that opens the existing choice sheet. Choice labels describe only what the player says/does; never expose outcome, odds, disposition changes or relationship deltas.

### Refinement checklist
- [ ] Remove duplicated scene description between Scene Window copy and narrative setting.
- [ ] Make the narrative title the primary reading anchor; keep section labels small and quiet.
- [ ] Use consistent spacing and typography to make the five steps feel like one continuous passage.
- [ ] Distinguish dialogue with a subtle left rule/ink panel, not a large card nested inside another large card.
- [ ] Keep the player-response trigger visually attached to the narrative passage.
- [ ] Ensure long dialogue wraps naturally without horizontal overflow or clipping.
- [ ] Add representative tests for missing speaker detail, long dialogue, narrow screens and no-active-journey state.

**Acceptance:** the player can read one coherent scene from atmosphere → action → visible behavior → dialogue → response, without duplicated prose or revealing hidden resolution.

## Shared verification / release gate

- [ ] TypeScript and production web build pass.
- [ ] Relevant unit/integration tests pass.
- [ ] Web App Validation passes on the final branch head.
- [ ] Android APK workflow completes successfully for the same commit.
- [ ] Install and manually inspect on the target Android device.
- [ ] Capture evidence for toolbar stability, manager hidden/open states, scene-to-narrative continuity, clock treatment and narrative hierarchy.
- [ ] Update the master roadmap with final status and evidence links.