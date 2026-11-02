# Offline Game

Standalone local game mode inside the same Merzkava APK. Owns deterministic mechanics and, as implemented, future event orchestration, progression, world simulation, and local save state. Runtime content must come from an approved, versioned World Archive package; no AI or network dependency is allowed for core play. Keep Offline Game state isolated from Convo.


## Eternal Path current foundation

- `src/offline-game/expedition-game.ts` owns the isolated local save namespace, deterministic world clock, region, weather, location, and journey manager.
- The former 240-entry generated dialogue sequence in content pack 0.1.0 remains **retired** and is never reused.
- The new context-aware narrative engine is active as a small bootstrap slice: nine original situations (three per starting region), deterministic selection, hidden outcome resolution, no-repeat history and save schema v4. This is a playable starter slice, not the full life simulator.
- Patch 1 remains TODO and must still contain at least **1,000 materially distinct situations**; the nine bootstrap situations do not count toward that target.
- Eight scene compositions continue to use existing repository artwork for the three powers. The art remains game-only visual composition and does not establish new canon settlements or facts.
- The framed Scene Window reads persisted world location, local clock, regional weather, and region identity from game state. Activities and future travel use `advanceEternalWorldTime` and `setEternalLocation`.

## Eternal Path expansion — current implementation checkpoint

- The approved full-game specification and EP-0 to EP-6 delivery phases are documented in [ETERNAL_PATH_BLUEPRINT.md](../../docs/offline-game/ETERNAL_PATH_BLUEPRINT.md); the single master plan remains [PRODUCT_ROADMAP.md](../../docs/PRODUCT_ROADMAP.md).
- The Eternal Path home is being converted to a compact profile and narrative-first layout. The former 240-node sequence remains retired. The new typed situation engine now supplies nine bootstrap situations and a working response sheet; Patch 1 content remains planned. The shared app navigation is being rebuilt as a fixed retractable clockwork compartment with function-specific flat emblems, local rotary rings, and Android side gesture clearance.
- A save-local hidden multi-axis disposition baseline is persisted in schema v2; legacy schema-v1 journeys are migrated without discarding their current game state. Public profile shows only the derived label.
- This is an initial UI/data foundation, not a completed life simulator. Save slots/export-import, activity simulation, NPC relationships/Social Links, ordinary-life careers, ownership/territory, organizations, family/naming, and integrated progression remain pending. Automated Web App Validation and the Eternal Path quality gate passed for code commit `51f8b748` (22 test files / 171 tests); the Android APK build is still pending and physical Android QA remains open.


## EP-1 checkpoint — Journey Manager and Anime.js

- Multiple isolated journey slots are available in the current local-storage implementation: load, leave, rename, delete one, export JSON and import a validated backup. Legacy single-save data migrates to schema v4, including journey-local narrative history.
- Journey Manager UI is wired into Eternal Path. The official World Archive remains read-only.
- Anime.js drives scene camera drift, fog/light/weather, panel and narrative reveals, choice-sheet transitions, manager reveal, route transitions, toolbar and button interactions. Reduced-motion support is included.
- Storage is an interim local-storage bridge. SQLite-backed transactions, archive/content manifest pins, crash recovery and large-world scaling are still pending. CI and physical Android QA are not yet confirmed.


## EP-3 narrative bootstrap

- Engine: `narrative-engine.ts`; patch manifest: `content-pack/patches/eternal-path-bootstrap/manifest.json`.
- Nine starter situations cover the three starting powers. Each has explicit actor knowledge, observable behavior, six scene-action beats, dialogue, a contextual closing question and hidden consequence branches.
- Choices resolve locally and deterministically; event history, energy/insight changes, disposition evidence and world-clock advancement are saved with the journey.
- The bootstrap content is explicitly `IN_GAME_ORIGINAL`, separate from Universe canon and separate from Patch 1. Patch 1 remains on hold until UI repair and EP-2 contracts are verified, and retains the minimum of 1,000 genuinely distinct situations.
- Web App Validation and the Eternal Path quality gate passed for code commit `51f8b748` (22 test files / 171 tests); the Android APK build is pending and physical Android QA remains open.
