# Isometric Game-Mode Renderer — PixiJS Evaluation

**Status:** isolated evaluation branch; not approved for production merge.
**Evaluation base:** Build #1341 lineage, with the first performance pass carried forward.
**Primary runtime:** `src/offline-game/world-map-hierarchy.ts`
**Data authority:** `IsoMapEditorData` and the existing deterministic movement / interaction helpers.
**Target device:** TECNO Spark Go 1 KL4, Android 14 / WebView.

This is an architecture investigation, not permission to replace the shared app shell or rewrite gameplay rules. The objective is to move the expensive *world presentation* out of a large DOM/SVG tree while leaving the app's real controls and game rules intact.

## 1. Why the game mode is the target

The current map view combines several rendering mechanisms on one screen:

- A Map Base image, an HTML canvas for foreground marks, and an SVG scene/grid.
- Per-cell interactive SVG polygons / DOM buttons.
- Individual HTML actor buttons for the Player and NPCs.
- Extra DOM children for sonar rings, proximity glows, and movement trails.
- Repeated DOM queries, CSS position transitions, layout reads, and actor-depth updates.

The Academy exterior uses a 2,816 × 1,536 Map Base with a 24 × 20 logical grid; custom cells may extend beyond that rectangle. The current renderer must retain those dimensions and custom-cell semantics.

A different animation library cannot remove the DOM layout, style calculation, and element-management costs caused by the current presentation structure. The evaluation therefore targets the game-world renderer, not the menu or shared application chrome.

## 2. Proposed responsibility split

### PixiJS — visual world renderer only

Render these visual-only layers in a PixiJS stage:

1. Map Base artwork as a texture-backed Sprite.
2. Ground / terrain and isometric grid overlays, grouped into bounded map chunks.
3. Static scenery and building art.
4. Player and NPC visual actors, sorted by isometric depth.
5. Visual-only scanner rings, movement trails, particles, and impact/ambient effects.

PixiJS must not own authoritative game state, pathfinding, collision/walkability, NPC intent, dialogue, combat, inventory, saved coordinates, or quest resolution.

### Existing DOM — all real interaction and application UI

Keep these as ordinary HTML controls:

- Main menu, app navigation, account/login, settings, Noticeboard, Floating Control, Kitty bubble, and pull cord.
- Player HUD, inventory/skill dock, time/status ticket, chat/dialogue card, notifications, and other modals.
- Map gesture/input handling and editor controls.
- All buttons, form controls, keyboard accessibility, and touch targets.

The map receives pointer input through a transparent DOM input surface owned by the existing map viewport. That surface converts screen coordinates into the existing image/grid/sub-cell coordinates, then calls the existing walk, NPC-interaction, and editor APIs. No gameplay action may depend on a Pixi pointer event.

### Developer map editor

The editor remains on the existing DOM/SVG/canvas implementation in the first migration slice. When editor mode opens:

- Pause the Pixi world renderer and release its active render loop.
- Keep existing SVG guides, selection markers, eight-sector editing, walkable whitelist, blocked half-edge rules, undo/import/export, and save format.
- Do not let the Pixi canvas intercept taps, drags, pinch zoom, or editor gestures.
- Resume or recreate the renderer only after exiting the editor and confirming the same map state.

This dual presentation mode is intentional: normal play can use Pixi visuals while authoring tools continue using the tested editor.

## 3. Critical Android input isolation

The previous PixiJS incident was an app-level regression: the owner reported that controls could show click feedback without completing the requested action; removing PixiJS and restoring the prior DOM/Anime.js path immediately restored app operation. The exact low-level trigger was not isolated at the time.

PixiJS v8.22.0 source inspection found that its EventSystem:

- Registers `pointermove` on `document` in the capture phase.
- Registers pointer down / over / leave on its canvas.
- Registers pointer up on the global target.
- Applies `touch-action: none` to its renderer element when pointer events are supported.

That capture-phase document listener explains why setting only `canvas { pointer-events: none }` is not a sufficient isolation guarantee. A Pixi canvas can be visually behind a DOM overlay while its global EventSystem still observes document-level pointer movement.

**Required design:** the Pixi renderer must be initialized without a registered Pixi EventSystem. Explicitly remove / omit the EventSystem extension before renderer initialization, verify that its document/global listeners are never installed, and keep the DOM map input surface as the only input owner.

Additional safeguards:

- Pixi stage and all visual containers are non-interactive (`eventMode = "none"`).
- Canvas CSS uses `pointer-events: none` as a second guard, not the primary guard.
- Do not install a document capture listener that stops or suppresses all pointer events; that would risk breaking DOM drag, pinch, scrolling, and buttons.
- Do not use Pixi's federated pointer, mouse, touch, wheel, accessibility, or hit-testing systems for gameplay.
- Treat a click sound or visual tap effect as insufficient; verify that the expected action actually completes.

The evaluation must include an automated guard that spies on document/global listener registration during renderer initialization and proves no Pixi-owned pointer/touch listeners are installed.

## 4. Render-loop and memory policy

- Initialize with a stopped / manual render loop. Do not run a permanent ticker while the map is static.
- Use one scene scheduler for the active map. Request frames only while movement, weather, or another finite animation is active; render once when static world data changes.
- Pause rendering when the game screen is hidden, an editor is open, the app is backgrounded, or the map is detached.
- Resume without creating duplicate tickers, listeners, textures, or canvas elements.
- Start with `antialias: false`, a capped renderer resolution, and a WebGL-first fallback policy suited to the target device. Measure resolution and frame-rate tiers on real hardware; do not assume higher DPR is better.
- Reuse texture atlases and GraphicsContext objects. Pool short-lived effects instead of repeatedly creating / destroying many nodes.
- Cache static map chunks, not the entire 2,816 × 1,536 map as one giant texture. Large texture caches can exceed device texture limits and consume substantial GPU memory.
- Batch similar sprites / graphics and avoid unnecessary blend-mode changes.
- Use culling only after profiling. PixiJS documentation notes culling can improve GPU-bound scenes but may make CPU-bound scenes slower.
- Avoid per-NPC filters, blur, and permanent `will-change` promotion.
- Sort actor depth only when an actor changes logical cell / sub-cell depth, not on every rendered frame.

## 5. Map data and gameplay contracts that must not change

The renderer reads from the existing data model. It may not become a second authority.

Preserve:

- `IsoMapEditorData`, custom grid cells, walkable whitelist, merged walkable groups, foreground / blocked / opacity cells, and eight-sector flags.
- Existing map IDs, local editor storage keys, and Academy owner reference / spawn.
- Fractional Player positions inside the selected cell.
- The current deterministic quadrant BFS and half-edge crossing rules.
- NPC occupancy, adjacent interaction reach, and the current NPC chat contract.
- Existing camera focal point, pinch / pan / zoom behavior, map transition semantics, and save compatibility.

Do not generate walkable gaps, invent cell coordinates, or use rendering order as a gameplay rule. The game engine remains authoritative.

## 6. Incremental evaluation plan

1. **Input-free renderer proof:** create/destroy a transparent Pixi renderer on an isolated test screen; prove EventSystem listeners are absent and all DOM controls still work.
2. **Static map proof:** draw one test-yard map and one Academy Map Base in Pixi without replacing the live renderer.
3. **Actors proof:** render Player/NPC actors from existing coordinates; preserve fractional movement and depth/occlusion.
4. **Effects proof:** add sonar / proximity / trail visuals in Pixi, retaining current visual meaning and reduced-motion fallback.
5. **Interaction bridge proof:** route DOM pointer input through the current coordinate resolver and existing gameplay APIs.
6. **Editor handoff proof:** enter and exit Developer Mode repeatedly without duplicated canvases, listeners, or loss of camera / editor state.
7. **Device performance comparison:** compare the same map, actors, zoom, and effect count against the DOM baseline on the target Android device.

Do not migrate all maps or delete the DOM/SVG fallback until every gate passes.

## 7. Required performance and regression evidence

Record baseline and candidate results on the same device/build conditions:

- Frame pacing during idle, Player movement, NPC wandering, scanner overlap, and weather effects.
- Frame-time distribution (including p95 / p99), not only average FPS.
- Long tasks and main-thread time during map interaction.
- GPU memory / texture dimensions, canvas count, and repeated screen-entry cleanup.
- Battery / heat observations during a fixed gameplay interval.
- Startup time and APK / JS bundle size.
- Tap success and actual destination/action for header settings, all menu buttons, map cells, NPC tap, chat replies, editor tools, Noticeboard, Floating Control, Kitty bubble, and pull cord.
- Drag, scroll, pinch, and camera gestures while the map and modal overlays are visible.

Automated tests and Web build validation are necessary but do not certify Android touch behavior. The final gate requires physical-device QA on the TECNO target. If any DOM control fails, revert to the DOM renderer immediately.

## 8. Evaluation-only policy

This branch is a controlled investigation. The canonical restriction in `docs/FORBIDDEN_TECHNOLOGIES.md` remains active until the input-isolated renderer passes automated checks and physical-device QA, and the owner explicitly approves promotion. A successful prototype or CI build alone is not production approval.
