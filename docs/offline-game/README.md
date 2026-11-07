# Merzkava: Eternal Path — Offline Game documentation

This folder contains Eternal Path's local simulation/formula references and game-content contracts. The current working title is **Merzkava: Eternal Path**. Read [Content Provenance & Game Data Contract](./CONTENT_PROVENANCE.md) before adding player-visible content. The product roadmap remains at [../PRODUCT_ROADMAP.md](../PRODUCT_ROADMAP.md).

## Continue work on the isometric world

For new regional maps, read [PXL Isometric Map Production Workflow](./PXL_MAP_PRODUCTION_WORKFLOW.md) first. It defines the canon → lasso/cell mapping → canvas validation → Augusto PXL → runtime sequence. The Academy sandbox calibration is in [Tianhai Academy PXL spatial and quadrant map](./ACADEMY_PXL_QUADRANT_MAPPING.md).


Recommended AI/developer read order:

1. [AI Handoff — Isometric Field, Combat and Access](../AI_HANDOFF_2026-11-05.md)
2. [Isometric Field System — runtime and next steps](./ISOMETRIC_FIELD_SYSTEM.md)
3. [Shared Isometric Map Editor — JSON/grid contract](./ISOMETRIC_MAP_EDITOR.md)
4. [Developer Access, World Atlas Accounts and Android Back](../APP_ACCESS_AND_NAVIGATION.md)
5. [Anime.js Animation System](./ANIMATION_SYSTEM.md)

The field system guide records current Player pathfinding, NPC wander/chat behavior, actual interaction-range limitation, field-tool window, colored tile trails, sonar sensor events, combat formula boundary and Android QA requirements. Scanner overlap is not a battle trigger; chase/ambush/stealth rules remain owner-design pending.

## Eternal Path implementation note

Eternal Path has separately persisted local journeys, an action-driven local clock and deterministic atmosphere. Story content is IN_GAME_ORIGINAL and must not be treated as Universe canon. The Atlas account gate uses a verified players.md character plus a matching local save; it does not create a new Universe character.
