# Merzkava APK — Application Architecture

## Product shape

Merzkava APK is **one Android application with two playable experiences and one shared content/reference layer**:

1. **Convo / AI GM** — connected roleplay. Its active gameplay canon is loaded directly from the official `Antarezka/merzkava-universe` repository using a pinned commit and the repository's `INDEX.md`/authority hierarchy.
2. **Offline Game** (working name) — a standalone local game mode. Its world content and approved game-facing data are consumed from a versioned local **World Archive package**. It must be playable without AI or network access.
3. **World Archive** — the reviewed local content library inside the app. Users can browse it offline; its approved package is the content source consumed by Offline Game. It is not a hidden context source for Convo.

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
                              Offline Game
                              deterministic runtime
```

- Convo reads its active gameplay canon directly from the official Universe repository. It must not silently consume World Archive articles or package data as prompt context.
- World Archive content is curated from the official Universe repository. It is a distribution/reference layer, not a competing canon repository.
- Offline Game consumes only the approved, versioned World Archive package at runtime. It must not fetch raw Universe files or rely on live AI to fill missing content.
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
- The approved World Archive package is the runtime content source for Offline Game; it cannot introduce facts that are absent from or conflict with its reviewed Universe sources.
- The deterministic engine validates Offline Game mechanics and all authoritative local state changes. AI output in Convo is narration/proposal only and cannot directly write authoritative state.
- The AI may suggest a purchase; it may not decide the authoritative price, grant the item, subtract currency, or write a save. The relevant engine validates the transaction before it is committed.

## Planned local data areas

Separate namespaces for Convo sessions/history and Offline Game saves/progression; characters and attributes; martial souls and spirit rings; inventory and equipment; wallet and financial ledger; quests and world events; NPC and relationship state; Archive package/index metadata; active Convo canon revision; AI provider settings (never plaintext secrets).

## Delivery sequence

1. Shared app foundation and mode navigation
2. Convo canon loader, context isolation, and provider integration
3. World Archive curation, local browsing, search, and versioned package contract
4. Offline Game deterministic mechanics and content runtime
5. Separate persistence namespaces, migrations, and mode-switch safety
6. Android packaging, offline end-to-end testing, and repeatable cloud builds
