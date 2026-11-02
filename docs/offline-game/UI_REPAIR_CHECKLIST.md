# Eternal Path UI Repair Checklist

**Status:** Open — latest user testing still reproduces toolbar drift.
**Master tracking:** [Product Roadmap §15](../PRODUCT_ROADMAP.md#15-active-ui-repair--eternal-path-scene-and-navigation-2026-11-02)
**GitHub issue:** [#2 — Eternal Path toolbar drift and scene/narrative layout refinement](https://github.com/Antarezka/merzkava-apk/issues/2)
**Scope:** Shared app navigation plus Eternal Path Scene Window, Save Manager and narrative presentation.
**Rule:** Keep this as a checklist and evidence log. Do not mark an item complete from CSS intent or a passing unit test alone; Android device verification is required.

## UI-EP-002 — Retractable Victorian clockwork navigation (preserve Anime.js + roulette)

**Observed:** The previous rail still looked like a plain plaque and did not yet express the approved retractable-compartment/rotary-control concept. The latest implementation now adds a shaped central drawer crown, function-specific flat emblems, independent rotary rings, cable/pulley response, and scroll/rotation persistence. **Do not remove Anime.js or roulette navigation.** Physical-device confirmation is still required.

### Investigation checklist
- [ ] Reproduce on the latest branch-head APK and record screen, route, device width, orientation and exact interaction sequence.
- [ ] Inspect the actual rendered DOM: identify the toolbar's containing block and every ancestor with transform, filter, perspective, contain, will-change, animation or overflow clipping.
- [ ] Keep `.bottom-nav` fixed and apply Anime.js entrance motion to each `.nav-item-motion` inner wrapper (opacity + translateY + stagger), never to the rail's own centering/positioning transform.
- [ ] Preserve roulette-style horizontal navigation, user-driven scroll/snap and the Anime.js active-item/hover feedback.
- [ ] Ensure active-item animation and user scrolling do not modify the toolbar's fixed `left`/`bottom` anchor or reset `scrollLeft`.
- [ ] Verify screen changes do not recreate the toolbar at a different scroll offset or invoke automatic scrollIntoView/focus scrolling.
- [ ] Verify toolbar remains viewport-anchored when switching Home → Convo → Eternal Path → Archive → Settings and when returning.
- [ ] Verify manual horizontal swipe still works and route selection does not change the rail's scroll position.
- [x] Keep a minimum 32 CSS-pixel breathing margin on both left and right edges (plus any reported safe-area inset), roughly a pinky-width at phone scale; do not let the rail approach Android back-swipe zones. At 320px viewport width, the rail should be about 256px wide before safe-area deductions.
- [x] Shape the dock as a Retractable Secret Compartment: raised central crown, curved/recessed shoulders, dark verdigris enamel, antique brass edging, and fine Victorian/arcane engraving. Keep the side ropes and pulley details inside the dock so gesture margins stay empty.
- [x] Use flat editorial emblems with recognizable silhouettes: Home = travel suitcase; Eternal Path = open book; Archive = document/record; Profile = cameo portrait. Keep Convo, Inventory, Journal, and Settings accessible by manual roulette swipe.
- [x] Give each item its own rotary ring. Dragging the ring turns only that ring; the central flat emblem tilts slightly. The item coordinate, width, order, and label remain fixed. Side cables/pulleys respond to dial movement and use the existing sound toggle for mechanical ratchet ticks.
- [x] Preserve manual scroll offset and each dial angle across route rerenders; keep Anime.js entrance/stagger on inner wrappers only.
- [ ] Add regression tests for fixed-rail vs inner-wrapper transform isolation, route switching, stable scroll position and viewport anchoring.
- [ ] Install APK on target Android device and confirm the toolbar no longer moves during repeated route changes.
- [ ] Attach test evidence (screen recording or screenshots + build SHA) before closing.

**Acceptance:** toolbar remains in one stable viewport position through route transitions and rerenders; users can manually scroll the rail; no route selection auto-shifts it; at least 32px of clear horizontal breathing room remains on each side (in addition to safe-area insets); the first four primary destinations are immediately recognizable; each rotary ring turns locally without moving or clipping its menu item; cable/pulley response and mechanical ticks remain subtle; the eight-route roulette rail remains reachable with four visible items at a time.

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

## UI-EP-006 — Narrative viewport and future Patch-1 composition

The former 240-entry generated story sequence has been retired and removed from runtime. The narrative surface now has an independent scroll viewport and a temporary Patch-1 planning state. Do not author replacement nodes in this UI repair pass. The future Patch-1 content and node-engine work is tracked in [Product Roadmap §5E](../PRODUCT_ROADMAP.md#5e-context-aware-narrative-patch-engine--todo). When that system is built, use this sequence:

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
- [x] Give the narrative column an independent vertical scroll area with contained overscroll and a visible, restrained scrollbar.
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