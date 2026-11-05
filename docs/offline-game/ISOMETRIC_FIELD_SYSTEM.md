# Isometric Field System — Runtime Contract and Next Steps

**Last audited:** 2026-11-05  
**Code baseline audited:** fae1ec3f1ef13eca0d20bf1453935b2b47a2c031

This document records what is actually implemented and what remains a design task. Do not infer that a visual control or a planned interaction is functional merely because its markup or data field exists.

## 1. Main source files

- **src/offline-game/world-map-hierarchy.ts** — map hierarchy, board markup, grid rendering, map persistence, transitions, actors, movement, NPC wandering, chat, editor binding and Developer Mode gate.
- **src/offline-game/world-map-hierarchy.css** — board, actor positioning, HUD, field-tool window, chat panel, transition overlays and grid appearance.
- **src/offline-game/isometric-map-editor.ts** — map data schema, coordinate conversion, cell/quadrant operations, walkability and normalization.
- **src/offline-game/tianhai-academy-map-reference.ts** — owner-supplied Tianhai Academy exterior reference.
- **src/offline-game/isometric-svg-board.ts** — SVG isometric test/render board.
- **tests/offline-game/isometric-map-editor.test.ts** — editor data, grid math, quadrants, canvas margins, walkability and pointer gestures.
- **tests/offline-game/isometric-npc-chat.test.ts** — NPC chat markup, bottom dialogue, shared HUD/editor markup and Academy actor placement.
- **tests/offline-game/isometric-render-test.test.ts** and **tests/offline-game/isometric-svg-board.test.ts** — SVG test-yard contracts.

Read this file together with ISOMETRIC_MAP_EDITOR.md. The editor data contract is shared across maps; do not create an Academy-only grid implementation.

## 2. Existing map/editor contract

Each map has a stable map ID. Exterior and interior maps must not share IDs. The Academy exterior is golden-dragon-empire:tianhai-academy:exterior and uses public/maps/academy/full-map/1_academy.jpg as its sole visual Map Base.

Academy calibration remains 2816 × 1536 px with a 24 × 20 base grid and 128 × 69.5 px tiles. The AI_UPDATE_REFERENCE in tianhai-academy-map-reference.ts includes selected walkable base/custom cells, sparse custom diamonds, eight-sector foreground/blocked/opacity flags, transition markers and image/calibration metadata.

The app seeds that reference once. It must not reapply it every launch because that would overwrite later local editor changes. It remains confirmed:false until the owner explicitly confirms it.

The Academy Player spawn is (12,31). The two Golden Dragon Empire gateway markers are (11,31) and (12,31); the dialogue marker is (9,3), and the introductory event marker is (14,-5). Academy NPCs are initially placed at (7,4), (10,9), (6,15), and (22,10).

## 3. Editor visibility and field-tool window

Developer mode is held by worldMapDeveloperMode in world-map-hierarchy.ts. Production starts with it disabled. setWorldMapDeveloperMode(false) removes mounted editor dock/canvas controls and clears editor pause classes. The following markup/binders are guarded: mapEditorMarkup / bindWorldMapEditor, academyCanvasEditorMarkup / bindAcademyCanvasEditor, isometricEditorMarkup / bindIsoAreaEditor, and the world-map editor-open/test-isometric actions.

The main app also hides developer-only menus and rejects sensitive actions when its developer session is not authenticated. Keep both the main-shell gate and the world-map gate. Never rely only on CSS or hidden attributes for authorization.

### Current field-tool window behavior

Implemented:
- floating field-tool launcher can be dragged within the map area;
- workbench can be dragged by its header;
- upper-left grip resizes the workbench;
- panel and launcher positions/sizes are saved per map in local editor UI preferences;
- Anime.js is used for workbench open/close translate/opacity motion;
- entering editor mode pauses NPC wandering and Player movement, hides chat, applies wmh-overlay-editing / wmh-editor-paused, and preserves the camera scroll anchor;
- leaving editor mode clears pause classes, restores actor animations/chat visibility, restarts NPC wandering when appropriate, and resumes a pending Player destination if one was interrupted.

Not complete / needs a focused repair:
1. data-wmh-overlay-minimize exists in the field-tool markup but bindIsoAreaEditor has no minimize click handler. It is currently only a visual button.
2. The markup has multiple data-wmh-overlay-close elements (drawer lever and X). The current binder uses querySelector for one close element rather than binding every close control. Audit both targets and ensure the lever and X work independently.
3. Minimize must hide only the workbench window. It must NOT call setActive(false), remove wmh-overlay-editing, resume NPC wandering, or resume Player movement. Editor mode remains active while minimized. The floating launcher should restore the workbench.
4. X is the explicit editor-mode exit. It should close the window, clear editing mode, resume live play, and preserve map camera position, grid data and local editor changes.
5. Verify independent vertical scrolling inside the compact floating window, drag header, resize grip, safe-area boundaries and touch scrolling on a narrow Android screen.
6. Do not claim X or minimize is verified until their listeners are bound and tested.

When a control changes camera or editor state, preserve the existing camera anchor. Never reset zoom or scroll merely because the panel opened, minimized, restored or closed.

## 4. Runtime grid, movement and pathfinding

The editor grid is the precise editing/calibration grid. Normal play should use the lighter, thinner visual treatment already defined in the normal-board CSS rules; do not make the full editor sector grid visually dominant outside editor mode.

The active movement contract is data-driven:
- walkableAreaEnabled and walkableCells/customGridCells define allowed movement cells when the walkable whitelist is enabled;
- blockedCells and blockedQuadrants prevent movement through blocked cells/edge sectors;
- isoGridCellExists, isoCanWalkTile and isoCanStep are shared checks;
- walkToTile builds a deterministic breadth-first path in cardinal order: north, east, south, west;
- occupied NPC cells are excluded from the Player path;
- each path step updates token coordinates, depth/occlusion, footstep surface sound and the next movement timer;
- NPC wandering checks the same grid existence and blocked-edge rules and avoids the Player and other NPCs.

NPC wandering currently runs on a 2,400 ms interval. Each NPC skips a tick when Math.random() is greater than 0.48, then chooses among valid cardinal neighbors. Keep this presentation behavior inside the board lifecycle and stop the timer when leaving the map, opening a chat that pauses wandering, or entering editor mode.

Do not weaken the walkability whitelist to make a path appear to work. An unmarked area is not a valid movement destination when walkableAreaEnabled is true. Do not interpolate across blocked-sector edges or allow NPCs to share an occupied cell.

## 5. NPC data, interaction and chat

NPC definitions currently live in npcData in world-map-hierarchy.ts. Each record contains name, gender, greeting, choices and replies. isometricNpcTokensMarkup places NPC tokens by map ID; Academy positions are explicit owner-supplied cells.

Current interaction flow:
1. handleWorldMapHierarchyClick receives a tap on data-wmh-npc.
2. It finds Player and NPC cell coordinates and calculates Manhattan distance.
3. renderChat opens the lower dialogue panel, stops NPC wandering, clears a pending Player movement timeout, inserts the NPC greeting and renders choice buttons.
4. A data-wmh-reply click appends the selected Player line and static NPC reply, then refreshes the choice buttons.
5. data-wmh-action chat-close hides the panel and restarts NPC wandering on a local map.

Important accuracy note: current code checks distance < 1 and blocks only when Player and NPC occupy the same cell. It does not enforce a maximum one-cell/adjacent interaction range. The older editor document's phrase “one-cell interaction-distance rule” must not be treated as proof that a maximum range is implemented. Confirm intended range from owner/Universe rules before changing it.

The current board conversation is a local scripted choice panel. It is not connected to the Convo / AI GM pipeline and should not silently send game-world NPC dialogue to Supabase or Convo. Preserve the existing chat panel and lower-screen presentation.

When extending NPC dialogue:
- preserve NPC-specific names, greetings, choice labels and replies;
- keep actor movement/wandering paused while conversation is open;
- prevent outside-map taps from submitting chat choices;
- keep focus and close behavior usable on touch devices;
- read current player-facing NPC conversation/style rules from the official Universe source at the verified active canon SHA before changing style or range;
- do not infer private NPC agendas, hostility, Spirit Realm status or hidden identity from an NPC name.

## 6. Movement effects, scan waves and future combat detection

### Implemented today

- Player movement uses walkToTile and per-cell state updates.
- NPC movement uses startNpcWander and the same grid-step checks.
- animateGridMove currently uses the browser Web Animations API through token.animate(...). It does NOT yet use Anime.js.
- Anime.js is imported in world-map-hierarchy.ts and is already used for field-tool panel motion and other UI transitions.
- There is no implemented colored tile-trail wave, no actor sonar/scanner ring, no overlap/chase resolver and no map-triggered battle entry.

### Owner's requested visual language

The intended status colors are:
- blue: verified non-hostile;
- red: verified hostile — examples supplied by the owner: bandit, monster, aggressive Spirit Beast, quest-specific hostile NPC and assassin;
- black: verified Spirit Realm expert;
- white: Mortal or status not known.

Classification must come from explicit verified actor/profile metadata or an approved map/NPC record. If actor status is missing or ambiguous, use white. Do not decide an NPC is hostile merely because its ID/name contains a keyword. Spirit Realm expert must be a known status, not an assumption based on appearance.

After each completed tile movement, the owner wants a soft, short-lived light-wave impression on the tile just crossed. The wave should inherit the mover's status color and must not alter position, collision or game state.

Each Player/NPC should eventually have a submarine-sonar-style expanding scan pulse with approximately a 2–3 tile reach. Keep it subtle and respect prefers-reduced-motion. The scanner is a future gameplay sensor, not just decoration: intended later rule is scan-wave contact initiates a chase and a one-tile approach/contact can lead to battle.

### Do not implement chase or battle triggers yet

The owner explicitly said combatant/chase integration rules are still being designed. Until those rules are supplied and approved:
- do not start an NPC chase when two visual rings touch;
- do not auto-enter combat at one tile;
- do not add line-of-sight, stealth, detection probability, suspicion decay, attack priority, aggro reset, escape radius, facing cone or faction rules by inference;
- do not apply damage, HP loss, injury, time cost, rewards or quest effects from a scan;
- do not make cosmetic scan overlap mutate saved game state.

When the owner provides the detection/chase design, integrate it with the authoritative combatant system and exact actor position/status records. Keep the detector separate from the renderer so animation frames never decide combat.

## 7. Combat engine boundary

Combat formulas already exist separately from the isometric map:
- src/offline-game/mechanics/combat.ts;
- tests/offline-game/combat.test.ts (10 formula/validation tests);
- official rule source: Antarezka/merzkava-universe/gameplay/COMBAT_SYSTEM.md.

The utility exports calculateCombatRating, calculateCombatRatio, calculateHitChance, resolveD100Hit, calculateCombatDamage, getComboFollowupBaseDamagePercent and canResolveDefaultComboFollowup. It covers combat rating, ratio, hit chance, deterministic d100 result resolution, damage, defense reduction and default combo-follow-up validation.

The formula implementation is not a complete fight loop and is not connected to map encounters or battle UI. The map has no encounter state, combat turn UI, chase state, battle state, initiative scheduler, actor resource transaction or battle outcome persistence.

Before connecting a future battle:
1. Read active official COMBAT_SYSTEM.md plus core/SPIRIT_RING_RULES.md, core/HP_SYSTEM.md, core/INJURY_SYSTEM.md, gameplay/TIME_AND_ACTION_RULES.md and core/HUNGER_AND_METABOLISM.md at the same verified canon revision.
2. Use only values supported by Player/NPC state. Missing PowerScale, HP, Qi, defense, artifact or injury data must stay unknown; never fill it with plausible-looking numbers.
3. Apply the official initiative/action/readiness/hit/damage/defense/combo/consequence sequence. One action is not automatically one hit; the default combo follow-up only occurs under documented conditions.
4. Keep scan/chase/ambush/escape rules as a separate approved layer. Do not add them to the combat formula utility until the owner provides the corresponding rules.
5. Record position, HP/Qi/stamina, injury, equipment, inventory, time and other consequences only when the approved action resolver actually changes them.
6. Add deterministic tests for the resolver and its integration with map actor IDs and cells.

## 8. Anime.js implementation direction

Anime.js 4.x is already installed as animejs ^4.5.0. Eternal Path owns a scoped animation module in src/offline-game/expedition-animations.ts:
- imports animate, createScope and stagger;
- uses createScope rooted at the current expedition screen;
- disposes listeners and pauses active animations when the screen is replaced;
- respects prefers-reduced-motion;
- keeps animation presentation-only.

Use the same Anime.js 4.x API for future isometric move easing, tile-wave and sonar visuals. Keep CSS responsible for color, blend mode, clipping and static fallback. Do not use PixiJS. Do not make game state depend on animation callbacks or frame counts.

For the map system, add a board-scoped lifecycle:
- start effects only while the corresponding board is live;
- keep one timer/scope per board, not one global scanner for every map;
- stop/pause effects when the map is hidden, editor mode starts or app screen changes;
- restore without duplicating intervals or event listeners;
- skip/simplify motion for prefers-reduced-motion;
- clean up detached DOM references and Anime.js instances when the map closes.

## 9. Required tests before marking the field system complete

Add/maintain tests for:
- editor absent and direct editor actions rejected when Developer Mode is false;
- editor launcher opens, minimize hides workbench but keeps editor pause active, restore opens it again, and X exits/resumes play;
- every close control is wired independently;
- editor changes do not reset camera zoom/scroll;
- normal-play grid is visibly lighter than editor grid by CSS contract;
- Player BFS remains in walkable whitelist and respects blocked sectors and occupied NPCs;
- NPC wandering remains in allowed cells and cannot overlap Player/other NPCs;
- Player/NPC movement emits presentation-only tile trail with correct explicit tone;
- scan radius limited to owner-approved 2–3 cells, unknown status defaults to white and reduced-motion mode has a static fallback;
- scanner overlap is only a sensor result until owner approves chase/battle logic;
- scripted NPC dialogue opens, pauses wandering, responds to each choice and closes cleanly;
- approved interaction range is enforced after it is sourced;
- no Anime.js loop/listener remains after leaving the map;
- Academy spawn, owner-marked NPC positions, seeded map JSON and transition labels remain unchanged.

A passing unit test or web build does not prove touch behavior on Android. Device QA must verify floating panel, scroll, drag/resize, minimize/restore, X, tile tap-versus-pan, camera stability and chat interaction.
