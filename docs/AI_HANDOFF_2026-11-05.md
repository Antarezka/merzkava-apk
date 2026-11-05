# AI Handoff — Merzkava APK Field, Combat and Access Work

**Handoff audit date:** 2026-11-05  
**Source baseline audited:** ed5ef007cead9ecf8e6e70662c29ec5cce9527b0  
**Branch:** feature/global-isometric-canvas-margins-2026-11-05  
**Repository:** Antarezka/merzkava-apk

This is the continuation point for the next AI/developer. It records current implementation, actual tests and remaining proof. Read it before touching map movement, NPC/chat, scanner/combat, Developer Mode, World Atlas login or Android Back.

## 1. Mandatory read order

1. README.md and docs/PRODUCT_ROADMAP.md — repository architecture, status rules and product boundaries.
2. This file — current state, immediate tasks and verification checkpoint.
3. docs/offline-game/ISOMETRIC_FIELD_SYSTEM.md — field runtime/editor, movement, NPC dialogue, scanner events and combat boundary.
4. docs/APP_ACCESS_AND_NAVIGATION.md — Developer Mode, Atlas account identity, password handling and Back stack.
5. docs/offline-game/ISOMETRIC_MAP_EDITOR.md — shared map JSON schema, eight-sector markings, calibration and Academy reference.
6. docs/offline-game/ANIMATION_SYSTEM.md — Anime.js 4.x ownership and cleanup lifecycle.
7. Source and tests named in those docs.
8. Before combat or chase work, refresh the active official Universe modules at one verified ACTIVE_SHA; never use mixed revisions.

Always fetch the live branch HEAD first. Do not assume this handoff source SHA is still the latest commit after documentation-only updates or future owner changes.

## 2. Owner requirements that remain in scope

### Isometric field/editor
- A small floating scrollable field-tool panel, not a full-screen sheet.
- Existing launcher remains draggable; window remains draggable/resizable.
- Minimize hides only the panel; edit mode remains active and world/actors stay paused. The launcher restores it.
- X (and pull lever) exits editor mode and resumes the world.
- Preserve camera zoom/scroll when open/minimize/restore/close.
- Normal map grid must remain much thinner/lighter than editor calibration lines.
- All isometric areas use the shared editor/runtime, not separate Academy-only behavior.

### Actors, light waves and sonar
- Per-tile movement uses Anime.js easing and a soft colored wave on the tile reached.
- Status colors are explicit metadata: blue friendly/non-hostile, red hostile, black Spirit Realm expert, white mortal/unknown.
- Each Player/NPC shows a two-ring sonar pulse about 2–3 tiles from the actor.
- Sensor overlap is an event contract only today. Intended later direction is overlap → chase and one-tile contact → battle, but actual rules are not approved.

### NPC, dialogue and chat
- Keep the scripted NPC greeting/choice/reply data and lower-screen dialogue presentation.
- Chat pauses NPC wandering and actor scanners while open; closing resumes local wandering.
- Do not invent a maximum interaction radius: current runtime blocks same-cell interaction only; no maximum range is enforced.
- Future AI NPC behavior must use official NPC profile knowledge/agenda boundaries and must not leak developer-only Convo UI.

### Combat, ambush and stealth
- Combat formula helpers exist and are tested, but are not connected to map encounters or a complete battle loop.
- Read official gameplay/COMBAT_SYSTEM.md, gameplay/TRAVEL_ENCOUNTER_AMBUSH_RESCUE.md, core/SPIRIT_RING_RULES.md, core/HP_SYSTEM.md, core/INJURY_SYSTEM.md, gameplay/TIME_AND_ACTION_RULES.md, and core/HUNGER_AND_METABOLISM.md from one consistent verified commit.
- Do not activate chase, battle, stealth, hiding, ambush, escape, damage, HP/Qi loss, injury, time cost or quest consequences from scanner overlap until the owner supplies the specific combatant/chase rules.

### Accounts and navigation
- Ordinary players must not see/use Developer Floating Control, editor, Convo, Supabase auth, canon/registry modules or other sensitive controls. Keep the app-shell gate and independent map editor gate.
- Developer local verifier is client-side, not server-grade security.
- External TV World Atlas entry always shows the player login gate, matching verified players.md identity plus local Eternal Path save. Internal in-world Atlas entry bypasses that gate.
- Atlas password is local, salted and hashed; never use players.md as a password store.
- Android Back/gesture unwinds overlays and screen history. Home Back shows a localized confirmation on every press; only Yes exits.

## 3. Source map

### Isometric board and editor
- src/offline-game/world-map-hierarchy.ts
- src/offline-game/world-map-hierarchy.css
- src/offline-game/isometric-map-editor.ts
- src/offline-game/tianhai-academy-map-reference.ts
- src/offline-game/isometric-svg-board.ts
- tests/offline-game/isometric-npc-chat.test.ts
- tests/offline-game/isometric-map-editor.test.ts
- tests/offline-game/isometric-render-test.test.ts

### Player registry, local account and Developer Mode
- src/main.ts
- src/convo/canon/canon-loader.ts
- src/offline-game/expedition-game.ts
- src/security/developer-access.ts
- src/app/developer-access-panel.ts
- src/offline-game/world-atlas-account.ts
- src/offline-game/world-atlas-login.ts
- src/app/exit-confirm-panel.ts
- tests/offline-game/world-atlas-account.test.ts
- tests/offline-game/world-atlas-login.test.ts
- tests/app/exit-confirm-panel.test.ts

### Native Android
- src/native/floating-window.ts
- native/android/FloatingWindowPlugin.java
- scripts/patch-android.mjs
- Generated MainActivity is patched during build. The patch script is the source of truth.

### Combat and animation
- src/offline-game/mechanics/combat.ts
- tests/offline-game/combat.test.ts
- src/offline-game/expedition-animations.ts
- docs/offline-game/ANIMATION_SYSTEM.md

## 4. Current implementation state at audited source baseline

| Feature | Status | Actual boundary |
|---|---|---|
| Tianhai Academy map seed | Implemented | One-time seed; owner reference stays confirmed:false; local edits not overwritten |
| Shared eight-sector grid | Implemented | Legacy quadrant keys expand to child sectors; editor/runtime shared |
| Walkable whitelist/BFS | Implemented | Cardinal BFS; unmarked cells blocked when whitelist enabled; blocked-sector edges respected |
| NPC wandering | Implemented | 2,400 ms timer; 0.48 move probability per tick; valid cardinal cells only; no actor overlap |
| NPC chat | Implemented | Static greeting/choices/replies in npcData; bottom box; pauses wander/scanners |
| NPC interaction maximum range | Incomplete | Runtime blocks same-cell interaction; no maximum reach is enforced |
| Developer UI/editor gate | Implemented as local gate | Main app and map editor independently default locked; server-grade security is not claimed |
| Floating field-tool window | Implemented in source | Compact scroll panel, drag/resize, Anime.js slide, minimize keeps editor active, launcher restores, X/lever closes |
| Normal/editor grid contrast | Implemented in CSS | Normal play lines lighter/thinner; editing grid stronger |
| Colored tile trail | Implemented in source | Anime.js 760 ms wave after actor movement; explicit status tone only |
| Actor sonar pulse | Implemented in source | Two staggered rings, ~2.5-cell visual radius, 2,450 ms pulse interval |
| Scanner overlap event | Implemented as sensor | field-scanner-overlap and field-scanner-clear; no state mutation |
| Chase/ambush/escape | Not implemented | Owner rules pending; do not infer from scan |
| Combat formulas | Implemented/tested standalone | No complete combat loop, encounter state, turn UI or map integration |
| World Atlas external login | Implemented in source | Verified player registry ∩ local save; local password signup/login; modal gate every external TV open |
| Internal Atlas route bypass | Implemented in source | In-world map open action does not invoke external login gate |
| Developer Remember Me | Implemented in source | Native SecureStorage stores authorization marker; typed password not persisted |
| World Atlas Remember Me | Implemented in source | Stores player selection; it does not skip the login gate |
| Android Back route stack | Implemented in source | Native patch dispatches WebView Back to JS history; Home shows confirmation repeatedly |
| Android package/emulator | Pending at source audit | Check current workflow; do not treat source code as target-device QA |

## 5. Critical implementation details to preserve

### Map/editor
- Academy Map Base: 2816×1536, grid 24×20, tile 128×69.5.
- Player start (12,31). Gateways (11,31) and (12,31). Dialogue (9,3). Intro event (14,-5).
- NPC start cells (7,4), (10,9), (6,15), (22,10).
- Only the four Academy student/staff tokens have explicit friendly scan metadata; all other tokens default unknown/white.
- Field tool minimize must not remove editor pause; do not simplify it to editor close.
- Both X and lever are bound via querySelectorAll for data-wmh-overlay-close.

### Movement/chat
- Player path walkToTile() is BFS in cardinal order; preserve deterministic order and whitelist/sector checks.
- NPC wandering avoids occupied actor cells and uses the same map path constraints.
- NPC tap currently rejects only same cell; do not claim adjacent-only.
- Chat is local, scripted and not persisted as a full dialogue transcript. It pauses NPC wandering/scanners.

### Scanner / future combat
- Tone map: friendly blue, hostile red, spirit-expert black, unknown white. Never infer tone from name.
- Visual scanner pair overlap uses Euclidean grid distance <= 5 (two ~2.5-cell scanner reaches overlap).
- Event names: merzkava:field-scanner-overlap and merzkava:field-scanner-clear.
- These are sensor presentation events only. A future chase/battle resolver must consume explicit actor/status records and official encounter/combat procedures; it must not use Anime.js completion callbacks.

### Login/navigation
- players.md is identity registry only; no passwords.
- External TV gate shown every time, even if Remember Me preselects the character.
- Signup only creates a local password for an existing verified character with a matching Eternal Path local save; it does not create a new Universe account.
- Developer verifier is static client-side PBKDF2. Do not embed raw credentials or claim offline extraction is impossible.
- Native Android patch must include both android.webkit.WebView and androidx.activity.OnBackPressedCallback imports. Recheck generated MainActivity.java compile after changes to scripts/patch-android.mjs.

## 6. Immediate continuation order

1. **Check the actual Android workflow first.** Source baseline ed5ef007... has a successful Web App Validation run. Android Build #1224 was at Android 14 emulator-install when last checked. Confirm package/signing/artifact/emulator results. If failed, fix the exact log failure and rerun.
2. **Perform on-device UI QA** on Android/TECNO: floating panel scroll, drag, resize, minimize/restore/X, camera stability, tap-vs-pan, trail/scanner color/performance, NPC chat, Atlas external/internal entry, Remember Me, Back button and edge gesture.
3. **Confirm NPC interaction range with owner/Universe rules.** Current same-cell-only guard is not adequate proof of an adjacency rule; don't guess.
4. **Wait for owner-approved combatant/chase specification** before wiring overlap→chase or one-cell→battle. Use official Universe modules and deterministic tests.
5. **Expand explicit tone metadata** only where the NPC/player profile or owner-approved status says friendly/hostile/Spirit Realm expert. Unknown remains white.
6. **Keep documentation synchronized** after each meaningful system change: field runtime, access/navigation, handoff, roadmap.

## 7. Verification checkpoint

At the audited source SHA ed5ef007cead9ecf8e6e70662c29ec5cce9527b0:

- Web App Validation #2269: **passed**.
- Gameplay suite: **31 test files / 222 tests passed**.
- TypeScript checks, gateway type-check and Vite production build: **passed**.
- Android Build #1224: **not yet certified at this source audit**; last observed state was Android 14 emulator-install. Recheck live workflow status and artifacts before saying Android verification is complete.
- Physical installation/interaction on the owner's TECNO target is not certified by CI.

Workflow links:
- [Web App Validation #2269](https://github.com/Antarezka/merzkava-apk/actions/runs/42023817319)
- [Android Build #1224](https://github.com/Antarezka/merzkava-apk/actions/runs/42023817359)

## 8. Non-negotiable regression guards

- Do not alter camera behavior, expansion margins or Academy artwork unless specifically requested.
- Do not overwrite the one-time Academy map seed or change its unconfirmed state.
- Do not allow movement into unmarked cells when whitelist is on.
- Do not make Player/NPC tokens overlap.
- Do not infer actor hostility/Spirit Realm status.
- Do not trigger chase/battle/damage/quest/time consequences from visual sensor overlap.
- Do not expose developer/editor/Convo/Supabase/canon controls to non-developers.
- Do not treat players.md as password authority.
- Do not make Remember Me skip the external TV login screen.
- Do not let Android Back exit from a non-Home app screen; only explicit Yes on Home may exit.
- Preserve the existing lower NPC dialogue panel and chat choice behavior.
- Keep Anime.js scoped to its owning board/screen and clean up timers/listeners when it is hidden or replaced.
