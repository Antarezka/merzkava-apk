# AI Handoff — Isometric Field System, Combat/Detection and Access Gates

**Handoff date:** 2026-11-05  
**Repository:** Antarezka/merzkava-apk  
**Working branch:** feature/global-isometric-canvas-margins-2026-11-05  
**Last audited code commit before this documentation pass:** fae1ec3f1ef13eca0d20bf1453935b2b47a2c031

This is the durable continuation point for the next AI/developer. It is intentionally explicit about incomplete work. Read it before modifying the field system, NPC interaction, combat, Developer Mode, World Atlas authentication or Android Back behavior.

## 1. Mandatory read order

1. Check the live branch head and working tree; do not assume this handoff commit remains HEAD.
2. Check the latest Web App Validation and Build Merzkava Android APK workflow on the exact branch head.
3. Read docs/PRODUCT_ROADMAP.md and docs/ARCHITECTURE.md.
4. Read docs/offline-game/README.md and docs/offline-game/ISOMETRIC_MAP_EDITOR.md.
5. Read docs/offline-game/ISOMETRIC_FIELD_SYSTEM.md.
6. Read docs/APP_ACCESS_AND_NAVIGATION.md.
7. Read docs/offline-game/ANIMATION_SYSTEM.md and the authoritative combat/movement/NPC modules from the official Universe repository at the app's verified active canon SHA.
8. Inspect the actual source and tests listed below before editing.

The official Antarezka/merzkava-universe repository remains the authority for world rules. Use the currently verified active commit SHA; do not substitute main/latest or claim a file was read if the fetch fails. players.md is a character registry, not a password/login store.

## 2. Owner requirements that must remain in scope

### Isometric field/editor experience
- Keep the current cell editor data contract and eight child sectors per diamond. Do not simplify the eight-sector quadrant system or overwrite the Academy AI_UPDATE_REFERENCE.
- The field tool is a compact floating window with internal scroll. Its launcher and workbench are draggable/resizable and use Anime.js for panel motion.
- Minimize must hide the workbench without leaving editor mode or resuming the world. Restore must reopen the workbench. X must exit editor mode and resume live play. The current implementation is incomplete here; see §4.
- Outside editor mode, the normal gameplay grid should remain much thinner and quieter than the calibration/editor grid.
- The live isometric HUD remains shared across maps. Minimap use is limited to outdoor field/wilderness/transit contexts as already specified in ISOMETRIC_MAP_EDITOR.md.
- Do not change camera zoom/scroll when opening, minimizing, restoring or closing field tools.

### Actor status, movement effects and sonar
Requested status palette:
- blue — verified non-hostile;
- red — verified hostile, including bandits, monsters, aggressive Spirit Beasts, quest-specific hostiles and assassins;
- black — verified Spirit Realm expert;
- white — Mortal or unknown status.

Each completed tile traversal should eventually emit a subtle status-colored tile wave. Player and NPC actors should eventually emit a subtle expanding sonar-style pulse with approximately 2–3 tile range. These are not implemented at the audited baseline.

The intended later gameplay behavior is scanner contact → chase; one-tile approach/contact → battle. The owner explicitly said combatant/chase integration rules are still being designed. Do not implement chase, battle, stealth, ambush or escape consequences until those rules are supplied/approved. A visual ring overlap must not mutate authoritative game state.

### NPC interaction and chat
- Keep current NPC actor IDs/coordinates and per-area scripted dialogue data unless the owner gives new placements.
- Keep the existing lower chat panel and choice-based interaction behavior.
- NPC wandering must remain inside the same walkable and blocked-edge map contract and must not overlap the Player or other NPCs.
- Confirm actual approved NPC interaction distance from the Universe source/owner rules before changing it. The current same-cell guard is not proof of a maximum adjacency radius.
- Do not route these static map NPC conversations into Convo/Supabase without an explicit design decision.

### Combat system
A standalone deterministic combat formula module already exists and is tested, but it is not wired into map encounters or a battle UI. The map must not invent its own combat formulas. Use the official combat and supporting mechanic modules listed in ISOMETRIC_FIELD_SYSTEM.md.

### Account/auth/navigation
- Developer-only controls, Convo, Supabase/canon controls, Floating Control and all editor entry points must remain hidden/disabled and handler-blocked for non-developers.
- The external Eternal Path TV opens the World Atlas and must show its local player login panel every time. Candidate accounts must be the intersection of verified players.md registry and local Eternal Path character save data.
- An account with no local password must be offered a localized create-password flow. Store only a salted password verifier locally; never store or log the raw password.
- An internal Atlas/map entry originating inside the live game world must bypass the external TV login modal.
- Android Back/gesture must unwind app screens until Home; Home Back shows an exit confirmation on every press; only explicit Yes may exit. This is not implemented at the audited baseline.

## 3. Source map

### World map, grid and editor
- src/offline-game/world-map-hierarchy.ts
- src/offline-game/world-map-hierarchy.css
- src/offline-game/isometric-map-editor.ts
- src/offline-game/isometric-svg-board.ts
- src/offline-game/tianhai-academy-map-reference.ts
- tests/offline-game/isometric-map-editor.test.ts
- tests/offline-game/isometric-render-test.test.ts
- tests/offline-game/isometric-svg-board.test.ts

### NPC/movement/chat
- npcData and isometricNpcTokensMarkup are in world-map-hierarchy.ts.
- startNpcWander controls the 2.4-second NPC wandering interval.
- walkToTile uses cardinal breadth-first search, walkability checks, blocked-sector checks and occupied-NPC exclusion.
- animateGridMove currently uses Element.animate (Web Animations API), not Anime.js.
- renderChat opens the lower choice dialogue, stops wandering and displays static greetings/choices/replies.
- handleWorldMapHierarchyClick handles map taps, NPC interaction, replies, area transitions and editor entry.
- tests/offline-game/isometric-npc-chat.test.ts covers markup and visible chat contracts.

### Combat
- src/offline-game/mechanics/combat.ts
- tests/offline-game/combat.test.ts
- official source: gameplay/COMBAT_SYSTEM.md
- related source modules: core/SPIRIT_RING_RULES.md, core/HP_SYSTEM.md, core/INJURY_SYSTEM.md, gameplay/TIME_AND_ACTION_RULES.md and core/HUNGER_AND_METABOLISM.md.

### Anime.js
- package.json dependency is animejs ^4.5.0.
- src/offline-game/expedition-animations.ts uses Anime.js 4.x with createScope, animate and stagger; motion is presentation-only, scoped to the mounted Eternal Path view and cleaned up during screen replacement.
- world-map-hierarchy.ts imports Anime.js animate/stagger, used for field-tool motion, but animateGridMove still uses browser-native Element.animate.
- docs/offline-game/ANIMATION_SYSTEM.md documents the existing Eternal Path animation contract. Do not reintroduce PixiJS.

### Access and account
- src/security/developer-access.ts
- src/app/developer-access-panel.ts
- src/main.ts
- src/app/floating-control.ts
- src/native/floating-window.ts
- src/offline-game/world-atlas-account.ts
- src/convo/canon/canon-loader.ts
- src/convo/characters/character-repository.ts
- src/offline-game/expedition-game.ts
- src/offline-game/expedition-interface.ts

## 4. Current implementation state at audited code baseline

| Area | State | What is actually present |
|---|---|---|
| Shared isometric editor schema | Implemented | Per-map persistence, sparse custom cells, walkable groups, three eight-sector marker layers, transitions and calibration |
| Tianhai Academy map reference | Implemented | One-time owner reference seed; 2816×1536 artwork; 24×20 grid; Player entrance (12,31); owner-supplied NPC positions and marker data |
| Developer editor gate | Implemented; tests/build being rechecked | worldMapDeveloperMode default false; markup/binder/action gates; main-shell sensitive-action guards |
| Floating editor workbench | Partial | Drag/resize/Anime.js open-close exist; minimize markup exists but no handler; multiple X/lever close controls are not all bound |
| Normal-play grid | Styled | Separate subdued normal-play treatment exists; regression test and device verification still required |
| Player pathfinding | Implemented | Cardinal BFS, allowed-cell and blocked-edge checks, occupied NPC cell exclusion, footsteps |
| NPC wandering | Implemented | 2.4-second interval, random cardinal step, map constraints and occupied-cell avoidance |
| NPC chat | Basic implementation | Static greeting, fixed choices and scripted replies in the lower chat panel; no Convo/AI routing |
| NPC maximum interaction range | Unverified/incomplete | Current code blocks same-cell interaction (distance < 1) but does not enforce a maximum adjacent range |
| Combat formula helpers | Implemented/tested standalone | Combat rating, ratio, hit chance, d100 result, damage/defense, default combo follow-up; no map encounter loop |
| Tile trail waves | Not implemented | Current movement animation has no colored post-step wave |
| Actor sonar scanner | Not implemented | No 2–3 tile actor scan pulse or contact resolver |
| Chase/ambush/escape | Design pending | Do not implement until owner supplies combatant specification |
| Map-triggered battle UI/state | Not integrated | Combat utility is not connected to Player/NPC tokens or map transitions |
| World Atlas password utility | Implemented as a local module only | Salted PBKDF2 verifier and local remember helpers; no complete TV login UI flow |
| External TV login gate | Not implemented | TV button currently opens the Atlas modal directly |
| Internal Atlas bypass distinction | Existing route is distinct | Keep internal in-world route separate from external TV gate |
| Android Back app navigation stack | Not implemented | Existing popstate closes certain modals; no full app route stack |
| Home exit confirmation / native exit | Not implemented | Must be added with Android hardware/gesture Back integration |

## 5. Immediate continuation order

Do not begin a broad rewrite. Continue in this order:

1. **Get CI green on the exact current branch head.** Review Web App Validation and Android APK logs first. Do not call a build successful if only web bundling or packaging passed.
2. **Repair field-tool controls.** Add a real minimize handler that preserves editor pause/state; bind lever and X independently; add tests for minimize → restore → X, camera preservation and actor/chat pause-resume.
3. **Wire Atlas login.** Use registeredCharacters from the verified players.md snapshot intersected with listEternalSaves() character names. Use world-atlas-account.ts. Show the modal for external TV every time; preserve the internal game-world route without the login prompt. Add all eight language labels.
4. **Implement app-level Back stack and Home exit confirmation.** Review current native Android integration and Capacitor version; add explicit hardware/gesture Back handling rather than relying solely on popstate. Keep modal Back priority.
5. **Implement presentation-only movement trail + sonar using Anime.js.** Use explicit actor status metadata; unknown = white. Respect reduced motion and clean up timers/scopes on map hide/editor pause/screen switch. Keep all overlap events non-authoritative until the owner approves chase/battle rules.
6. **Wait for the owner's combatant/chase specification.** Then connect sensor contact and one-tile proximity to a proper deterministic encounter resolver using official combat/HP/injury/time/Satiety rules.
7. **Device QA on Android 14 / target low-end TECNO device.** Test field-tool scroll/drag/resize/minimize/X, map tap-versus-pan, camera stability, NPC chat, external/internal Atlas entry, all Back paths, reduced motion and memory cleanup.

## 6. Verification checkpoint

At code baseline fae1ec3f1ef13eca0d20bf1453935b2b47a2c031, Web App Validation #2255 (run 42018543970) and Android APK Build #1213 (run 42018543188) were triggered. The previous code commit 50fa56572c1064503fbd46bff177890a6b8b854c failed:
- Web tests: 26 files / 208 tests passed; 2 test files / 7 tests failed because the new test setup called setWorldMapDeveloperMode(false) in Node where document is undefined.
- Android build: npm build stopped on TypeScript noUnusedLocals because listEternalSaves and World Atlas account imports were present but login UI was not yet wired.

Commit fae1ec3 adds an SSR-safe guard to setWorldMapDeveloperMode and removes the unused imports until Atlas UI integration. The newer #2255/#1213 runs must be checked before claiming green. If they fail, inspect exact logs and update this document after the repair.

No APK install or physical-device QA is certified by this handoff. Do not infer device success from a passing web suite.

## 7. Non-negotiable regression guards

- Preserve the eight child-sector quadrant model and old-key normalization.
- Preserve the Academy source image and owner-supplied one-time AI_UPDATE_REFERENCE. Do not reset/reseed local editor changes on every app launch.
- Keep movement restricted to the selected walkable whitelist when enabled.
- Keep blocked-sector edge checks and occupied-cell protections.
- Keep Player start (12,31) and Academy NPC start positions unless the owner provides a new map reference.
- Do not change existing NPC choice-chat style without checking official source/owner instructions.
- Do not route static World NPC chat through Convo without authorization.
- Do not infer hostility, Spirit Realm expertise, visibility, stealth, detection or combat values from actor names.
- Do not let Anime.js timing decide state changes.
- Respect prefers-reduced-motion and dispose every map/app animation/timer listener.
- Do not reintroduce PixiJS.
- Never store or publish raw developer/player passwords or provider secrets.
