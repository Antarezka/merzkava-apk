# Offline Game

Standalone local game mode inside the same Merzkava APK. Owns deterministic mechanics and, as implemented, future event orchestration, progression, world simulation, and local save state. Runtime content must come from an approved, versioned World Archive package; no AI or network dependency is allowed for core play. Keep Offline Game state isolated from Convo.


## Eternal Path current foundation

- `src/offline-game/expedition-game.ts` owns the isolated local save namespace, deterministic world clock, region, weather, location, and journey manager.
- The former 240-entry generated dialogue sequence in content pack 0.1.0 has been **retired and removed from active runtime** because its repeated template combinations did not meet the required narrative quality. It must not be reused.
- Existing character journeys, scene location, local time, weather, and save slots remain available. Story choices are temporarily unavailable until the new context-aware Patch-1 narrative system is designed and reviewed.
- Eight scene compositions continue to use existing repository artwork for the three powers. The art remains game-only visual composition and does not establish new canon settlements or facts.
- The framed Scene Window reads persisted world location, local clock, regional weather, and region identity from game state. Activities and future travel use `advanceEternalWorldTime` and `setEternalLocation`.

## Eternal Path expansion — current implementation checkpoint

- The approved full-game specification and EP-0 to EP-6 delivery phases are documented in [ETERNAL_PATH_BLUEPRINT.md](../../docs/offline-game/ETERNAL_PATH_BLUEPRINT.md); the single master plan remains [PRODUCT_ROADMAP.md](../../docs/PRODUCT_ROADMAP.md).
- The Eternal Path home is being converted to a compact profile and narrative-first layout. The former 240-node choice sequence and its choice modal are retired pending Patch 1; the current journey screen explains that the new story system is planned. The shared app navigation is being rebuilt as a fixed retractable clockwork compartment with function-specific flat emblems, local rotary rings, and Android side gesture clearance.
- A save-local hidden multi-axis disposition baseline is persisted in schema v2; legacy schema-v1 journeys are migrated without discarding their current game state. Public profile shows only the derived label.
- This is an initial UI/data foundation, not a completed life simulator. Save slots/export-import, activity simulation, NPC relationships/Social Links, ordinary-life careers, ownership/territory, organizations, family/naming, and integrated progression remain pending. Automated CI and physical Android QA are not yet confirmed for this checkpoint.


## EP-1 checkpoint — Journey Manager and Anime.js

- Multiple isolated journey slots are available in the current local-storage implementation: load, leave, rename, delete one, export JSON and import a validated backup. Legacy single-save data migrates to schema v3.
- Journey Manager UI is wired into Eternal Path. The official World Archive remains read-only.
- Anime.js drives scene camera drift, fog/light/weather, panel and narrative reveals, choice-sheet transitions, manager reveal, route transitions, toolbar and button interactions. Reduced-motion support is included.
- Storage is an interim local-storage bridge. SQLite-backed transactions, archive/content manifest pins, crash recovery and large-world scaling are still pending. CI and physical Android QA are not yet confirmed.
