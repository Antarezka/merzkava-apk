# Merzkava: Eternal Path — Offline Game documentation

This folder contains the Life Simulation Text RPG's canon-derived formula references and game-content contracts. The current working title is **Merzkava: Eternal Path**. Read [Content Provenance & Game Data Contract](./CONTENT_PROVENANCE.md) before adding player-visible content. The single product roadmap remains at [../PRODUCT_ROADMAP.md](../PRODUCT_ROADMAP.md). The game release package pins approved World Archive references plus a separate reviewed Offline Game content pack; runtime never loads the Universe repository directly.

For isometric map movement, NPC interactions, chat, combat handoff, Anime.js motion and remaining field-tool tasks, read [Isometric Field System](./ISOMETRIC_FIELD_SYSTEM.md). The app-level developer/Atlas login and Android Back handoff is in [Developer Access, World Atlas Accounts and Back Navigation](../APP_ACCESS_AND_NAVIGATION.md).


## Eternal Path implementation note

The current development slice has a separately persisted offline character, an action-driven local clock, deterministic atmosphere state, and a versioned `0.1.0` dialogue pack with 240 branching nodes. Story content is `IN_GAME_ORIGINAL` and must not be treated as Universe canon. See the [master roadmap](../PRODUCT_ROADMAP.md) for remaining release gates.
