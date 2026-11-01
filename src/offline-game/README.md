# Offline Game

Standalone local game mode inside the same Merzkava APK. Owns deterministic mechanics and, as implemented, future event orchestration, progression, world simulation, and local save state. Runtime content must come from an approved, versioned World Archive package; no AI or network dependency is allowed for core play. Keep Offline Game state isolated from Convo.


## Eternal Path first playable slice (content pack 0.1.0)

- `src/offline-game/expedition-game.ts` owns a separate local save namespace and a deterministic opening loop. It never imports Convo character records.
- The approved first-pass content pack is described by `content-pack/manifest.json` and contains 240 unique dialogue node IDs. Each node has two choices, deterministic stat effects, and a local action duration. All story dialogue is `IN_GAME_ORIGINAL`; it is not official Universe canon.
- Eight scene compositions use existing repository artwork for the three powers. The art is treated as game-only visual composition and does not establish new settlement names or facts.
- The framed Scene Window reads the persisted world location, local clock, regional weather, and region identity from the game state. Its location is independent of dialogue node metadata; the temporary Scene Test Bench has been removed. Activities can advance the clock through `advanceEternalWorldTime`, and the travel system will update the saved area through `setEternalLocation`.
- This is a playable prologue slice, not the completed life simulation. Full quest chains, travel, validated combat/rewards, complete world package pinning, and target-device QA remain open.


## Eternal Path expansion — current implementation checkpoint

- The approved full-game specification and EP-0 to EP-6 delivery phases are documented in [ETERNAL_PATH_BLUEPRINT.md](../../docs/offline-game/ETERNAL_PATH_BLUEPRINT.md); the single master plan remains [PRODUCT_ROADMAP.md](../../docs/PRODUCT_ROADMAP.md).
- The Eternal Path home is being converted to a compact profile and narrative-first layout. Choices now render in a separate modal with hidden outcomes, input locking, focus handling and Back/Escape dismissal. The app navigation rail has a centered, narrower ornamental treatment with Android side safe margins.
- A save-local hidden multi-axis disposition baseline is persisted in schema v2; legacy schema-v1 journeys are migrated without discarding their current game state. Public profile shows only the derived label.
- This is an initial UI/data foundation, not a completed life simulator. Save slots/export-import, activity simulation, NPC relationships/Social Links, ordinary-life careers, ownership/territory, organizations, family/naming, and integrated progression remain pending. Automated CI and physical Android QA are not yet confirmed for this checkpoint.


## EP-1 checkpoint — Journey Manager and Anime.js

- Multiple isolated journey slots are available in the current local-storage implementation: load, leave, rename, delete one, export JSON and import a validated backup. Legacy single-save data migrates to schema v3.
- Journey Manager UI is wired into Eternal Path. The official World Archive remains read-only.
- Anime.js drives scene camera drift, fog/light/weather, panel and narrative reveals, choice-sheet transitions, manager reveal, route transitions, toolbar and button interactions. Reduced-motion support is included.
- Storage is an interim local-storage bridge. SQLite-backed transactions, archive/content manifest pins, crash recovery and large-world scaling are still pending. CI and physical Android QA are not yet confirmed.
