# Isometric Field System — Runtime Contract and Continuation Guide

**Last source audit:** 2026-11-05  
**Audited source commit:** ed5ef007cead9ecf8e6e70662c29ec5cce9527b0  
**Working branch:** feature/global-isometric-canvas-margins-2026-11-05

This is the implementation contract for isometric maps, the field-tool editor, actor movement, NPC interactions/chat, animation, scanner events, and the combat boundary. It separates working runtime behavior from planned mechanics. A UI element or event name is not proof that a gameplay rule has been implemented.

## 1. Source map and ownership

| Concern | Source of truth |
|---|---|
| Map hierarchy, board markup, transitions, actors, NPC chat, Player movement, wandering, field effects, editor wiring | **src/offline-game/world-map-hierarchy.ts** |
| Board, normal/editor grid contrast, camera/editor window, HUD, chat, tile trail and scanner styles | **src/offline-game/world-map-hierarchy.css** |
| Map data schema, grid coordinates, 8-sector flags, normalization, walkability and blocked-edge rules | **src/offline-game/isometric-map-editor.ts** |
| Owner-supplied Tianhai Academy exterior JSON reference | **src/offline-game/tianhai-academy-map-reference.ts** |
| Academy base artwork | **public/maps/academy/full-map/1_academy.jpg** |
| Isometric SVG test-yard renderer | **src/offline-game/isometric-svg-board.ts** |
| NPC greetings, choices and replies | npcData in **world-map-hierarchy.ts** |
| Player registry and canonical profiles | **src/convo/canon/canon-loader.ts**, consumed by **src/main.ts** |
| Eternal Path local saves, clock and world state | **src/offline-game/expedition-game.ts** |
| Standalone combat formulas | **src/offline-game/mechanics/combat.ts** |
| Anime.js for Eternal Path scenes | **src/offline-game/expedition-animations.ts** and **docs/offline-game/ANIMATION_SYSTEM.md** |

Do not make an Academy-only grid implementation. The editor/runtime contract is shared by each isometric board and every exterior/interior map must retain its own stable map ID.

## 2. Tianhai Academy reference and spawn

The owner-supplied reference is **golden-dragon-empire:tianhai-academy:exterior** with:

- Map Base: /maps/academy/full-map/1_academy.jpg, 2816 × 1536 px.
- Base grid: 24 × 20; tile size 128 × 69.5; offsets 0/0; Player/NPC scale 1.
- Walkability whitelist enabled. Unmarked cells are not valid movement destinations.
- Separate customGridCells preserve individually placed diamonds outside the base 24 × 20 rectangle. Never fill the gaps between custom cells automatically.
- Foreground, blocked and opacity flags use 8-sector keys, e.g. 14,-2:tr-a. Legacy parent keys expand to both child sectors.
- The Player spawn is (12,31). Golden Dragon Empire gateway markers are (11,31) and (12,31); the dialogue marker is (9,3); the introductory event marker is (14,-5).
- The reference has confirmed:false. Do not change this automatically.

The app seeds the owner reference once into local editor storage. Subsequent launches must preserve a user's local editor changes rather than replacing them with the bundled JSON. The Academy NPC seed cells are (7,4), (10,9), (6,15), and (22,10).

## 3. Developer-only field editor and window

The runtime authorization flag is worldMapDeveloperMode, initially false. setWorldMapDeveloperMode(enabled) controls the map editor independently of the main app-shell gate.

Protected code paths include mapEditorMarkup/bindWorldMapEditor, academyCanvasEditorMarkup/bindAcademyCanvasEditor, isometricEditorMarkup/bindIsoAreaEditor, editor-open and test-isometric actions, and direct click targets for editor canvas/markers/controls.

When Developer Mode is false, editor markup is not rendered, binders do not activate, and direct editor actions are rejected. On sign-out, mounted editor controls are removed and editor pause classes are cleared. Do not weaken this to CSS-only hiding.

### Field-tool window behavior

The workbench is a small floating window anchored near the right edge of the map, not a full-height sheet. It is independently scrollable and has a drag handle and a resize grip. Camera zoom/center controls are in the workbench. The smaller floating launcher can itself be moved within the map area.

- **Open:** tap the launcher; Anime.js slides the workbench into view.
- **Drag:** use the workbench header. Buttons and resize grip are excluded from the drag start.
- **Resize:** use the upper-left resize grip; panel size/position are retained in per-map editor UI preferences.
- **Minimize (—):** hides only the workbench. editorModeActive, wmh-overlay-editing and wmh-editor-paused remain active; Player/NPC movement remains paused. The small launcher remains visible.
- **Restore:** tap the launcher again. The workbench is shown without leaving edit mode.
- **X / pull lever:** both are bound to exit editor mode. Actor animation/chat visibility/wandering and any pending Player destination are restored as appropriate.
- **Camera:** editor open/minimize/restore/close preserve the camera scroll anchor; do not reset zoom or position as a side effect.

The normal-play grid is deliberately much thinner/lighter than the editor calibration grid. Do not make editor cell borders and 8-sector guides visually dominant during ordinary movement.

### Editing tools retained

ADD CELL, DELETE CELL, SELECT & MERGE, UNMERGE, walkable whitelist, foreground, blocked sector, opacity sector, area transition markers, grid calibration, undo, clear, save draft, confirm/save, JSON export/copy and JSON import. The map image and canvas expansion are not modified by grid calibration.

## 4. Walkability, Player pathfinding and NPC wandering

When walkableAreaEnabled is true, walkableCells and valid customGridCells define the allowed movement graph. A missing/unmarked cell is not walkable. blockedCells and blockedQuadrants block cells/sector edges. Use shared checks instead of bypassing the map data:

- isoGridCellExists(...)
- isoCanWalkTile(...)
- isoCanStep(...)

Player movement is resolved by walkToTile(dialog, targetX, targetY, surface):

1. Validate integer target coordinates and that the destination exists on the map.
2. Reject a destination that fails walkability checks.
3. Resolve a deterministic breadth-first path in the fixed cardinal order north, east, south, west.
4. Exclude occupied NPC cells.
5. Update the Player one tile at a time, update depth/occlusion, emit the movement animation/trail and schedule the next step.
6. Preserve the pending destination if movement is paused by entering editor mode; resume it only when editor mode exits and chat is not open.

NPC wandering is deliberately simple presentation behavior, not an AI combatant brain:

- Timer interval: 2,400 ms.
- Each NPC skips a tick when Math.random() > 0.48.
- Candidate steps are cardinal neighbors only.
- Candidate cells must exist, satisfy the same blocked-edge/walkability checks, and must not be occupied by the Player or another NPC.
- stopNpcWander() clears the timer and stops actor scanners. Call it when leaving the area, opening NPC chat, or entering editor mode.

Do not loosen the whitelist or blocked-sector rules to make an actor move. Unmarked space is intentionally inert.

## 5. NPC interaction and dialogue/chat contract

NPC runtime data is split between map placement/appearance records used by isometricNpcTokensMarkup() (id, x, y, gender and optional explicit scan tone) and npcData entries in world-map-hierarchy.ts (display name, gender, greeting, choices, reply strings).

The current NPC chat is scripted, choice-based local UI. It is not yet a free-text AI conversation and is not persisted as a transcript.

Interaction sequence:

1. Player taps an NPC token.
2. The map handler obtains the Player and NPC coordinates and calculates Manhattan distance: abs(playerX - npcX) + abs(playerY - npcY).
3. The current code rejects only distance < 1 (the Player and NPC occupy the same cell). There is no maximum adjacency/range check in the current handler. Do not describe this as “one cell away” or assume a maximum reach. Confirm the intended rule from owner/official rules before adding a maximum range.
4. renderChat(dialog, npcId) stops NPC wandering/scanner intervals, cancels a pending Player movement timeout, shows the lower dialogue panel, renders the NPC greeting and authored choices.
5. Tapping a choice appends the Player's selected line and the corresponding authored NPC reply, then leaves the choice buttons available.
6. Closing the panel hides it and resumes NPC wandering for the local map.

Chat presentation is a lower-screen dialogue box, not a full-screen centered modal. Keep the NPC bust/name, readable text, choices, close action, and bottom anchoring. The chat panel pauses movement/wandering while open. Do not invent new NPC knowledge, motives, hostility, or a conversation history that has not been recorded.

The map currently uses local scripted greetings/choices/replies. A future AI dialogue integration must use the appropriate NPC profile/knowledge boundaries and owner-approved prompt/data contract. It must not silently turn ordinary NPC taps into Convo login or expose developer-only Convo panels.

## 6. Actor status colors, tile trail and submarine scanner

Actor tone is explicit metadata: data-scan-tone. actorScanTone() returns unknown if the value is absent or invalid. Never infer threat/cultivation status from NPC name, gender, clothing, role, or visual appearance.

| Explicit tone | Color | Meaning |
|---|---|---|
| friendly | Blue | Known non-hostile |
| hostile | Red | Explicit hostile status, e.g. a confirmed bandit/assassin/aggressive Spirit Beast/quest enemy |
| spirit-expert | Black | Explicitly established Spirit Realm expert |
| unknown | White | Mortal/default/unknown status |

The four Academy students/staff have explicit friendly metadata. Other NPCs/Player tokens default to unknown (white) until a valid source assigns a tone. Do not classify an NPC as hostile merely because the owner listed bandits/assassins/monsters as examples; an actual actor must be explicitly typed.

### Current Anime.js effects

- animateGridMove() uses Anime.js to ease actor translation after a tile coordinate changes (225 ms, outCubic).
- emitTileTrailWave() places one short-lived colored wave on the tile reached after movement (760 ms, outQuad). It is presentation only.
- Each Player/NPC token receives two expanding sonar rings. Pulse interval: 2,450 ms; each ring duration: 1,800 ms with staggered delay.
- CSS scanner bounds are approximately five tile widths/heights across (about 2.5 tiles radius from the actor).
- Reduced-motion users get a static scanner treatment and no animated tile trail.
- Scanners start with the local actor/NPC field and stop when the field is hidden/paused, NPC wander lifecycle stops, chat opens, or editor mode begins.

### Scanner event contract

updateScannerContacts(board) compares actor cell centers using Euclidean grid distance:

distance = hypot(actorX - targetX, actorY - targetY)

When distance <= 5 cells (two approximately 2.5-cell scanner fields overlap), the first transition into overlap dispatches:

merzkava:field-scanner-overlap

Detail contains actor ID, target ID, both explicit tones, distance and both cell coordinates. When an existing pair leaves the overlap radius, it dispatches:

merzkava:field-scanner-clear

The event is a sensor observation only. It does not change saved state, NPC intent, Player state, HP, Qi, injury, time, inventory or quest outcomes.

## 7. Combat, chase, ambush, stealth and escape boundary

A deterministic combat formula helper exists separately:

- src/offline-game/mechanics/combat.ts
- tests/offline-game/combat.test.ts (10 tests)
- Official source: Antarezka/merzkava-universe/gameplay/COMBAT_SYSTEM.md
- Related official modules to consult: core/SPIRIT_RING_RULES.md, core/HP_SYSTEM.md, core/INJURY_SYSTEM.md, gameplay/TIME_AND_ACTION_RULES.md, core/HUNGER_AND_METABOLISM.md, gameplay/TRAVEL_ENCOUNTER_AMBUSH_RESCUE.md.

The helper covers Combat Rating, combat ratio, hit chance, d100 hit resolution, damage/defense, HP-loss cap and default combo-follow-up validation. It is not a complete combat turn loop. No map encounter/battle UI or state transaction is connected.

Official combat baseline details already encoded in the helper:

- Combat Rating = PowerScale × Readiness Factor × relevant Artifact Factor.
- Readiness Factor allowed values: 0.8, 0.9, 1.0, 1.1, 1.2.
- Hit chance = clamp(10%, 90%, 50% + 25% × (combat ratio − 1)); resolve using d100.
- Base damage classes: 5%, 8%, 12%, 18%; high-output 18% requires explicit confirmation.
- Power adjustment uses clamp(0.5, 1.5, sqrt(combat ratio)); apply supported defense reduction, round damage upward, and cap actual HP loss to current HP.
- Default combo follow-up uses half the original base percentage, only after a successful opening hit and when combo/technique/opening are supported.

Do not implement chase, automatic battle, ambush, stealth detection, hiding, escape or attack triggers yet. The owner explicitly said the chase/combatant integration rules are still being designed. Intended future direction is scanner overlap → chase, one-tile approach/contact → battle, but these are not current rules. Do not make animation frame count, ring overlap or a UI event determine combat. Do not invent line of sight, hearing, suspicion, aggro/decay, target choice, facing cone, escape radius, chase speed, surprise bonuses, turn rules, HP/Qi costs or battle consequences.

When the owner supplies the approved system, integrate the scanner as a detector feeding a separate deterministic encounter resolver. Read the verified official combat/HP/injury/time/Satiety/travel-ambush sources at one consistent Universe commit. Preserve unknown stats as unknown and add deterministic tests before persisting combat results.

## 8. Anime.js ownership and cleanup

Anime.js ^4.5.0 is already installed. Isometric code imports animate (and shared helpers where required) directly in world-map-hierarchy.ts. Eternal Path scene FX and transitions are owned by src/offline-game/expedition-animations.ts, which mounts a scoped Anime.js lifecycle and reverts it before Eternal Path DOM replacement.

Rules:

- Animation is presentation, never the authority for game state.
- Do not use animation frames/duration to decide cell movement, hit resolution, contact, damage or time.
- Keep isometric timers per board, not global across hidden maps.
- Clean up intervals, animations and listeners when board is hidden/detached or editor/chat pauses live play.
- Respect prefers-reduced-motion; keep a static visual fallback.
- Prefer opacity/transform and avoid heavy layout animation on low-end Android.
- Do not use PixiJS for this project.

Read docs/offline-game/ANIMATION_SYSTEM.md for the existing Eternal Path scene animation and lifecycle contract.

## 9. Required follow-up / device QA

Automated tests must continue covering: editor hidden/blocked without Developer Mode; minimize → restore → X; camera preservation; normal-vs-editor grid contrast; walkability whitelist and blocked sectors; occupied NPC cells; movement trail tone; unknown-white default; scanner overlap/clear as sensor-only events; NPC chat pause/reply/close; map-seed and Academy spawn preservation.

Web/CI tests do not certify touch UX. Verify on Android, preferably the owner's low-end TECNO target:

- scroll inside the compact field panel, drag, resize, minimize, restore, X and pull lever;
- editor does not steal/pan/zoom when tapping a cell and does not reset camera;
- grid contrast in normal play vs editor mode;
- movement waves and sonar colors/radius/performance;
- NPC interaction reach, dialogue, reply, close and wandering pause/resume;
- external TV login, local signup/login, remember toggle, X/back;
- internal Atlas route bypasses login;
- Android back/gesture across modals, screens, repeated Home prompt, reduced motion and memory cleanup.

Do not mark an item device-verified based only on a passing web build or emulator launch.


## 10. In-world Player HUD and fractional actor position

The shared in-world HUD contains a marked preview profile, HP/Satiety meters, affiliation placeholder, Quest Board and Social Links drawers, four realm-tier ring-framed skill slots, and a bottom test inventory. The preview profile and relationship/quest content are not canon state. Test-ration portions use the official SMALL/STANDARD/LARGE Satiety values; the one-hour LIGHT test uses the official Mortal formula and does not advance the world clock or simulate meal windows/sleep. Ring colors and beast-sigil patterns are presentation-only placeholders, not canon assignments.

The Player retains integer cell coordinates for collision, whitelist, edge tests, NPC occupancy and BFS; separate fractional visual coordinates determine placement within a walkable diamond. A pointer tap is converted through the overlay SVG viewBox and clamped to a safe interior point. This does not open blocked cells or bypass a closed half-edge.
