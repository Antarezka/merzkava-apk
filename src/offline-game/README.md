# Offline Game

Standalone local game mode inside the same Merzkava APK. Owns deterministic mechanics and, as implemented, future event orchestration, progression, world simulation, and local save state. Runtime content must come from an approved, versioned World Archive package; no AI or network dependency is allowed for core play. Keep Offline Game state isolated from Convo.


## Eternal Path first playable slice (content pack 0.1.0)

- `src/offline-game/expedition-game.ts` owns a separate local save namespace and a deterministic opening loop. It never imports Convo character records.
- The approved first-pass content pack contains 240 unique dialogue node IDs. Each node has two choices, deterministic stat effects, and a local action duration. All story dialogue is `IN_GAME_ORIGINAL`; it is not official Universe canon.
- Eight scene compositions use existing repository artwork for the three powers. The art is treated as game-only visual composition and does not establish new settlement names or facts.
- Scene test controls are in-memory only. They can switch scene, time-of-day tint, weather overlay, and fog opacity without writing to the game save.
- This is a playable prologue slice, not the completed life simulation. Full quest chains, travel, validated combat/rewards, complete world package pinning, and target-device QA remain open.
