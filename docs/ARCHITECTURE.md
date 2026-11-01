# Merzkava APK — Application Architecture

## Product shape

Merzkava APK is **one Android application with two playable experiences and one shared content/reference layer**:

1. **Convo / AI GM** — connected roleplay. Its active gameplay canon is loaded directly from the official `Antarezka/merzkava-universe` repository using a pinned commit and the repository's `INDEX.md`/authority hierarchy.
2. **Merzkava: Eternal Path** (current working title; Life Simulation Text RPG) — a standalone local game mode. Its canon-backed world references come from a versioned local **World Archive package**; its adaptations and game-only additions live in a separate versioned Offline Game content pack. It must be playable without AI or network access.
3. **World Archive** — the reviewed local content library inside the app. Users can browse it offline; its approved package supplies canon-backed world references to Offline Game. It is not a hidden context source for Convo.

The app shell, navigation, visual components, assets, and selected infrastructure may be shared. The modes themselves must remain clearly identified and isolated where state or authority differs.

## Source and authority flow

```text
Official merzkava-universe repository
          |                         |
          | pinned canon loader     | review, curate, approve
          v                         v
   Convo / AI GM             World Archive package
   connected context                |
                                    | local, versioned content
                                    v
                              + Offline Game content pack
                              (reviewed adaptations/originals)
                                      |
                                      v
                              Offline Game
                              deterministic runtime
```

- Convo reads its active gameplay canon directly from the official Universe repository. It must not silently consume World Archive articles or package data as prompt context.
- World Archive content is curated from the official Universe repository. It is a distribution/reference layer, not a competing canon repository.
- Offline Game consumes a shipped, versioned release package that pins the approved World Archive package plus its reviewed Offline Game content pack. The Archive supplies canon-backed world references; the game pack supplies game-facing adaptations and labelled original content. It must not fetch raw Universe files or rely on live AI to fill missing content.
- If required content is absent, contradictory, private, GM-only, or unreviewed, block that feature and route the gap through Universe review → Archive curation → package release.
- Deterministic formula implementations must retain traceability to the approved game-facing Archive data and the exact official source revision from which it was reviewed.

## Runtime layers

1. **Shared Android/UI shell:** app lifecycle, navigation, accessibility, common visual components, and mode selection.
2. **Convo services:** canon loader/router, pinned-revision tracking, context assembly, AI provider adapters, structured response parsing, and conversation/session handling.
3. **World Archive service:** local dossier catalogue, search, entity graph/backlinks, reviewed source reader, visibility policy, and package/version metadata.
4. **Offline Game runtime:** deterministic mechanics, event/choice orchestration, progression, local world simulation, and validation. No AI/network dependency for core play.
5. **Persistence:** local database (SQLite is planned) with distinct Convo and Offline Game save/session namespaces and versioned migrations.
6. **Shared platform services:** settings, asset delivery, diagnostics, and Android packaging. Shared infrastructure must not erase mode-specific authority boundaries.

## State and mode isolation

- Convo and Offline Game are two modes in the same APK, not two separate applications.
- Keep their save slots, progression, event history, and session/context state separate by default.
- Switching modes must not silently merge characters, inventory, currency, quests, outcomes, or conversation context.
- Any future import/export between modes requires an explicit, reviewed schema and user-visible action.
- Offline Game must remain playable with network disabled; reconnecting must not silently convert offline outcomes into connected canon events.
- Track the active Convo Universe commit SHA separately from the Offline Game World Archive package version/SHA.

## Authority boundary

- The official Universe repository is the ultimate authority for world canon and rules.
- The approved World Archive package is the runtime source for canon-backed world references. A separate, versioned Offline Game content pack may add gameplay adaptations and `IN_GAME_ORIGINAL` records, but cannot claim those records as Universe canon or contradict reviewed Universe sources.
- The deterministic engine validates Offline Game mechanics and all authoritative local state changes. AI output in Convo is narration/proposal only and cannot directly write authoritative state.
- The AI may suggest a purchase; it may not decide the authoritative price, grant the item, subtract currency, or write a save. The relevant engine validates the transaction before it is committed.

## Offline Game content provenance

The Offline Game is based on the world documented by Merzkava Universe, but not every gameplay object must already exist as a canon entry. Its packaged content uses the mandatory provenance contract in [Content Provenance & Game Data Contract](./offline-game/CONTENT_PROVENANCE.md):

- `CANON`: directly supported by an approved World Archive dossier and exact Universe source revision.
- `CANON_ADAPTATION` (displayed as **CANON ADAPTATION**): a canon concept translated into game-facing data; adaptation notes separate engine implementation fields from world facts.
- `IN_GAME_ORIGINAL` (displayed as **IN-GAME ORIGINAL**): newly authored for Eternal Path gameplay; explicitly not official Universe canon.

Every player-visible record has exactly one primary provenance label. The label remains visible in tooltips, details, Spirit Beast and Arcanistry views, Encyclopedia/Codex, search, and relevant notifications. Original content may expand gameplay but may not silently establish new Universe facts or contradict known canon. Canon-backed records retain Archive dossier IDs, exact Universe source paths, and source commit SHAs. The release manifest pins the Archive package version/SHA and Offline Game content-pack version/SHA separately from the Universe commit and Convo's active canon SHA.

The game's current working title is **Merzkava: Eternal Path** and its category is **Life Simulation Text RPG**. BitLife and Solo Leveling are high-level design references only, not sources of world facts or proprietary content.

## Planned local data areas

Separate namespaces for Convo sessions/history and Offline Game saves/progression; characters and attributes; martial souls and spirit rings; inventory and equipment; wallet and financial ledger; quests and world events; NPC and relationship state; Archive package/index metadata; active Convo canon revision; AI provider settings (never plaintext secrets).

## Delivery sequence

1. Shared app foundation and mode navigation
2. Convo canon loader, context isolation, and provider integration
3. World Archive curation, local browsing, search, and versioned package contract
4. Offline Game deterministic mechanics and content runtime
5. Separate persistence namespaces, migrations, and mode-switch safety
6. Android packaging, offline end-to-end testing, and repeatable cloud builds


## Repository layout contract

The source tree follows system ownership rather than a flat collection of feature folders:

```text
src/
  app/                 shared application shell and screen composition
  shared/              cross-mode platform services and infrastructure
  convo/               connected Convo / AI GM implementation
    auth/
    canon/
    characters/
    engine/
  world-archive/       local archive catalogue, search, links, and reader
  offline-game/        standalone local game runtime and mechanics
  assets/              shared app assets
  audio/ native/ ui/   shared presentation/platform services (keep mode-specific logic out)

tests/
  convo/
  world-archive/
  offline-game/

docs/
  PRODUCT_ROADMAP.md   single master roadmap for the whole APK
  ARCHITECTURE.md      shared system architecture and boundaries
  convo/               Convo-specific technical references
  world-archive/       Archive inventory and coverage references
  offline-game/        Offline Game formula/content references
```

- Keep exactly one product roadmap: `docs/PRODUCT_ROADMAP.md`. System folders may have local README/technical notes, but must link back to the master roadmap and must not create competing roadmap checklists.
- Each implementation file and test belongs to the system that owns its behavior. Shared code belongs in `src/shared/` only when more than one mode genuinely consumes it.
- `src/app/` is the composition/presentation boundary. It may call into each system but should not become the home for system rules or persistence logic.
- Cross-system imports should be deliberate and one-directional: the app shell composes modes; World Archive provides approved content packages to Offline Game; Convo loads canon directly from Universe. Offline Game must not import Convo engines/auth/context, and Convo must not import Archive content as hidden prompt context.
- Keep tests beside the same ownership boundary under `tests/`. Build/test discovery must include all nested test folders.
- When a module is moved, update every import and test path in the same commit; do not leave compatibility shims or duplicate source copies unless a documented migration requires them.
