# Merzkava APK — Full Godot Engine Migration

**Decision date:** 2026-11-07  
**Target engine:** Godot 4.7.2 stable  
**Target platform:** Android APK, with cloud-only development/build as the supported owner workflow  
**Status:** Migration foundation in progress — this document is a target architecture, not a claim that the legacy app has already been ported.

## 1. Owner decision

Merzkava APK is moving to a **full Godot client runtime**.

Godot is to own the complete installed client experience: launch/splash, home and navigation, menus, Eternal Path gameplay, World Archive, Convo client UI, settings, character presentation, maps, interactions, local storage and Android app lifecycle.

The previous Vite/TypeScript/Capacitor client is a migration source and compatibility reference only. It is not the intended final game engine or UI runtime. Do not run two competing game engines in the final APK. Do not delete legacy systems until their behavior and data have been migrated and verified.

Remote services may remain as optional backend services:
- Cloudflare Worker / AI provider gateway for connected Convo requests.
- Optional future backup or content-update endpoints.
- Authentication only where an online feature genuinely requires it.

A remote service must never become a hidden dependency for offline gameplay.

## 2. Non-negotiable: offline-first, single-player core

After installation, the following must function with airplane mode enabled and no account/login:
- App launch, navigation, settings and local profile selection.
- Eternal Path world exploration, movement, NPCs, dialogue, local encounters and progression.
- Character profile, Martial Soul, Spirit Ring, Spirit Realm, Arcanistry and all implemented deterministic requirements.
- Inventory, equipment, wallet, Xuan currency ledger, item use and local crafting/construction systems.
- Quests, journal, map, location changes, world clock, weather and locally simulated activities.
- World Archive browsing, search and source/provenance display from the packaged approved archive.
- Save, load, backup recovery and schema migration.

Convo's live AI response is the explicitly online feature. It may show a clear offline/unavailable state, but it must not block the app, erase a session, or prevent Eternal Path and World Archive from opening.

Offline mode must not require:
- Server login, telemetry, remote config, API keys, a remote database, CDN assets or a WebView.
- Server-authoritative progression, daily reset, encounter spawn or currency validation.
- A live internet connection to load maps, sprites, fonts, sound, dialogue packs or Archive entries.

All game outcomes and save changes are calculated and validated locally by deterministic GDScript. AI may narrate or propose connected Convo actions, but it is not the authority for Offline Game state.

## 3. Game and visual direction

The requested references are used as **visual/design references only**. Merzkava must have original maps, sprites, animation, UI, names and world content; do not copy protected game assets, maps, character designs, logos or proprietary layouts.

### Cổ Tiên Lộ

The identified Cổ Tiên Lộ is a browser-based 2D online RPG. It is useful as a reference for a dense cultivation-world activity loop, regional exploration, creatures, factions and a world that feels inhabited. Its online-only/server features are not the technical model for Merzkava.

Reference pages:
- https://www.cotienlo.com/
- https://cotienlo.com/choi

### Elemental 2D MMORPG — Daeri Soft

Use as a reference for readable 2D MMORPG pixel-art language:
- Compact, recognizable character silhouettes.
- Clear ground tiles, paths, trees, rocks, buildings and environmental landmarks.
- Readable character-to-world scale and directional movement.
- Distinct idle/walk/combat animations and effects that remain legible on a phone.
- A compact mobile HUD that does not cover the playable field.

Reference material:
- https://elemental-daeri-soft-inc.en.aptoide.com/app
- https://w.atwiki.jp/elemental2dmmorpg/

### Hidden Dragon / Wuxia RPG

The exact title meant by "Hidden Dragon Wuxia RPG" is not yet verified. Search results distinguish at least a 2016 mobile MMORPG called Hidden Dragon and the PC/PS4 action game Hidden Dragon: Legend. Do not silently assume they are the same game or lock a style decision to the wrong title. Keep this reference provisional until its exact store link, video or screenshot is supplied.

### Merzkava synthesis

Create an original 2D fantasy/cultivation world with:
- Rich, layered regional maps, settlements, academy grounds, forests, coasts, ruins, floating islands and interiors.
- Pixel-art readability for field navigation and characters, with optional more detailed/painterly 2D scenery where performance allows.
- Elegant wuxia/xianxia architecture, natural terrain, atmospheric lighting and restrained magical effects.
- Distinct NPC silhouettes, clothes, occupations, species and animations.
- A coherent Merzkava interface identity; map art and UI must remain separate layers.

### Global art-style selector

Provide selectable, complete art-style profiles. A selected profile must apply consistently to the Player, all NPCs, creatures, map tiles/props and related UI illustrations wherever an asset exists. Do not mix incompatible sprite proportions within one active region.

Initial style candidates:
1. **2D Pixel MMORPG** — small readable sprites and tile-based world presentation, using Elemental as a broad visual reference.
2. **Painterly Xianxia** — richer illustrated environments with clean, separately animated character sprites.
3. **Soft Anime RPG** — standard-proportion anime characters and detailed fantasy environments.
4. **Chibi Fantasy** — intentionally short, cute proportions with matching environment scale.

The selector is an art-pack choice, not a gameplay-stat modifier. Missing assets must fall back to a clearly identified compatible set rather than stretching an unrelated sprite.

### Scale and composition rules

- Characters must never be visually larger than ordinary houses simply because of a sprite import/scale error.
- Define one map-world unit/tile calibration per map family and a documented character-height ratio for each style.
- Keep a stable bottom-center foot/ground pivot across idle, walk and action frames.
- Buildings, trees, walls, bridges and foreground layers must use consistent world units and depth/occlusion rules.
- Foreground occlusion may cover a character only when the map layer says it should.
- Test screenshots at the actual TECNO Spark Go 1 KL4 resolution and UI scale before accepting an art pack.

## 4. Engine and runtime architecture

- **Engine:** Godot 4.7.2 stable, GDScript-first. Avoid adding a C#/.NET toolchain unless a concrete requirement justifies it.
- **Rendering:** 2D scene system with the Compatibility renderer as the initial Android target. Profile performance on the target phone before enabling heavier effects.
- **Game world:** Godot TileMapLayer / Sprite2D / AnimatedSprite2D and dedicated scene nodes for maps, actors, UI and effects. Gameplay logic must not be embedded in animation timelines.
- **Movement:** deterministic map coordinates, walkability masks, collision/blocked sectors, NPC occupancy and route resolution. The art layer is never the authority for collision.
- **Presentation:** Godot Control nodes, Containers, Themes, AnimationPlayer/Tween and native touch input. Do not retain WebView/DOM as the final UI layer.
- **Local data:** versioned local save files under Godot's `user://` sandbox, with atomic writes, backups and explicit migrations. Choose a SQLite GDExtension only after Android arm64 build compatibility and offline behavior are verified; do not assume a browser SQLite adapter can be reused.
- **Assets:** import approved image/audio/font assets into the Godot project. PXL may remain a development-time artwork authoring/export tool; its CLI/viewer must never ship inside the APK or become the runtime.
- **Backend:** thin HTTPS adapter for connected Convo and optional backup/update operations. No backend dependency in deterministic offline loops.

## 5. Data, canon and save boundaries

Preserve existing product boundaries:
- Convo fetches active official gameplay canon through its pinned canon loader when online.
- World Archive is a reviewed, versioned, packaged local library.
- Eternal Path consumes the approved Archive package plus its separately versioned game-content pack.
- Convo session/history, World Archive package metadata and Eternal Path saves remain separate namespaces.
- The active Universe commit SHA, Archive package SHA and game-content pack version are recorded independently.

The local game engine is authoritative for mechanics and transactions. Keep the existing provenance labels: `CANON`, `CANON_ADAPTATION`, and `IN_GAME_ORIGINAL`.

Before migrating storage, inventory existing profile, journey, map-editor, character, inventory, wallet, quest, Atlas and settings data. Write explicit import/migration code. Never silently delete or reset a player's save.

## 6. Cloud-only development and APK delivery

The owner works primarily from an Android phone and must not need a PC:
1. The owner gives instructions in ChatGPT.
2. AI edits project files on a dedicated GitHub migration branch.
3. GitHub Actions downloads the pinned official Godot version and runs headless validation.
4. GitHub Actions exports an Android APK using matching Godot export templates and Android build tools.
5. The APK and build notes are uploaded as workflow artifacts.
6. The owner downloads and installs the APK on Android for real-device QA.

No instruction may require Termux, Android Studio or Godot Editor on the owner's phone. Local editor use is optional, never mandatory.

A cloud workflow is not considered complete until a real APK artifact is produced and its package ID, ABI, version, signature and file integrity are checked. Passing a headless project parse is not an APK build and is not device verification.

## 7. Migration phases and acceptance gates

### G0 — Godot project foundation
- [x] Create a dedicated migration branch without modifying the default branch.
- [x] Pin the initial engine target to a published stable Godot release.
- [x] Add a minimal Godot project scaffold, main scene and GDScript migration placeholder.
- [x] Add GitHub Actions workflow definitions for headless validation and Android APK export.
- [x] Headless validation passed on Godot Runtime Validation #2; project import, script parsing and main-scene headless launch succeeded. [Run #2](https://github.com/Antarezka/merzkava-apk/actions/runs/42360136902).
- [ ] Produce and verify a real debug APK artifact from GitHub Actions.
- [ ] Verify the APK installs and launches on the target TECNO device.

### G1 — Native Godot app shell
- [ ] Port splash, Home, navigation, main menu, settings and Android Back handling.
- [ ] Port Kitty mascot presentation and existing app access/navigation rules.
- [ ] Add responsive portrait/landscape layouts and touch-safe hit areas.
- [ ] Verify every menu and floating control performs its actual action.

### G2 — Offline storage and content foundation
- [ ] Implement versioned local profile/save storage and recovery.
- [ ] Migrate existing player data and local settings without resets.
- [ ] Package World Archive and Offline Game content packs for offline use.
- [ ] Prove cold launch, browse, save, close, reopen and load while airplane mode is enabled.

### G3 — Eternal Path world runtime
- [ ] Port world map, area transitions, map editor data, walkability, collision, camera and minimap.
- [ ] Port Player/NPC actors, direction, idle/walk animation, occupancy and interaction.
- [ ] Port dialogue, Journal/Quests, inventory, wallet, item functions and world time.
- [ ] Preserve all official Spirit Realm, Martial Soul, Spirit Ring, Spirit Beast, Arcanistry and economy requirements.
- [ ] Add deterministic tests for every authoritative transaction and progression gate.

### G4 — Art and animation production
- [ ] Establish complete global art-style packs and a style preview/selection screen.
- [ ] Produce one representative region plus Player, NPC, creature and prop pack per chosen style.
- [ ] Validate map scale, building-to-character scale, pivots, occlusion and mobile readability.
- [ ] Add environment effects, seasons and cutscene assets with low-memory fallbacks.

### G5 — World Archive and Convo
- [ ] Port the Archive reader, category navigation, search, filters, backlinks and provenance display.
- [ ] Port Convo UI and the existing pinned-canon/API adapter.
- [ ] Keep Convo explicitly online while proving every other core mode remains usable offline.

### G6 — Full migration and release
- [ ] Complete parity audit against the legacy app and all current roadmap/handoff requirements.
- [ ] Complete Android lifecycle, low-memory, offline, reconnect and save migration tests.
- [ ] Complete physical-device touch/performance tests on TECNO Spark Go 1 KL4.
- [ ] Only after parity and recovery are proven, retire the legacy Vite/Capacitor client runtime and obsolete workflows/dependencies.

## 8. Release-blocking offline test

Every candidate APK must pass a fresh-install airplane-mode test:
1. Install and launch without internet.
2. Enter Eternal Path and create/select a local profile.
3. Open a map and move the Player; interact with a local NPC.
4. Open Character, Inventory, Wallet, Journal/Quests and World Archive.
5. Perform at least one valid local state transaction and save.
6. Force-close the app, relaunch without internet and confirm state is intact.
7. Trigger a deliberately invalid requirement/transaction and confirm the deterministic engine rejects it.
8. Open Convo and confirm only Convo reports that network access is required.
9. Reconnect and verify no offline outcome is silently uploaded as official Universe canon.

Passing this gate is required before calling Merzkava offline-ready.

## 9. Current known limitations

- The production APK is still the legacy Capacitor app at the beginning of this migration.
- The Godot files introduced in G0 are a migration scaffold, not a playable port of Eternal Path.
- No Godot Android export preset or successful cloud APK build is claimed until the workflow produces and verifies an artifact.
- The exact "Hidden Dragon Wuxia RPG" visual reference remains unresolved.
- The target phone's memory and rendering performance must be measured with real Godot builds; Compatibility renderer is the conservative starting point, not a guarantee of performance.
