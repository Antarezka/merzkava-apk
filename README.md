# merzkava-apk

Android-first hybrid roleplaying game for **Merzkava Universe**.

## Project direction

**The master product roadmap is [docs/PRODUCT_ROADMAP.md](./docs/PRODUCT_ROADMAP.md).** It is the primary planning reference for the app's workstreams, existing-feature audit, priorities, progress checklist, and release gates.

The app contains **two playable experiences in one APK**: (1) **Convo / AI GM**, which reads its active gameplay canon directly from the official [merzkava-universe](https://github.com/Antarezka/merzkava-universe) repository; and (2) **Merzkava: Eternal Path** (current working title; a Life Simulation Text RPG), which uses canon-backed world references from the approved local **World Archive** package plus a separately versioned game-content pack for labelled adaptations and original gameplay additions. It runs without AI or network access. World Archive is also browsable as an offline reference library. Archive content must never be silently injected into connected Convo context.

## Core architecture

- **Convo / AI GM:** connected conversation experience; reads current pinned canon directly from `merzkava-universe` through the canon loader.
- **World Archive:** reviewed, versioned local content library; browsable offline and the approved content source for Offline Game.
- **Merzkava: Eternal Path:** standalone Life Simulation Text RPG (current working title); consumes a release package that pins the approved World Archive package and a reviewed game-content pack, and uses deterministic local mechanics without AI/network dependency.
- **Shared app foundation:** Android shell, navigation, UI components, assets, and app services shared by both experiences where appropriate.
- **Separate mode state:** Convo and Offline Game keep distinct session/save state and source-version records; no implicit state or context crossover.
- **Deterministic engine and local database:** validate mechanics and persist authoritative local state; SQLite remains the planned save store.

> The AI is not the authority for game mechanics or saved data. The game engine validates every proposed state change before it can be stored.

## Development principles

1. Local-first saves; cloud backup can be added later.
2. Never put provider API secrets in the app source or APK.
3. Treat AI output as untrusted input and validate it.
4. Keep official canon, the reviewed World Archive package, Convo context, Offline Game state, and application code separated by explicit boundaries.
5. Track every existing and planned feature in the [master roadmap](./docs/PRODUCT_ROADMAP.md).
6. Add features incrementally with tests and documented migrations.

See [PROJECT_DIRECTIVES.md](./PROJECT_DIRECTIVES.md) for the working contract, [docs/PRODUCT_ROADMAP.md](./docs/PRODUCT_ROADMAP.md) for the single master roadmap, and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the system design.

## System documentation

- **Convo / AI GM:** `src/convo/` — connected canon, character, auth, and GM runtime.
- **World Archive:** [content manifest](./docs/world-archive/CONTENT_MANIFEST.md) and [coverage matrix](./docs/world-archive/COVERAGE_MATRIX.md).
- **Merzkava: Eternal Path:** [content provenance contract](./docs/offline-game/CONTENT_PROVENANCE.md), [canonical formula snapshot](./docs/offline-game/CANON_FORMULA_SNAPSHOT.md), and [isometric field-system handoff](./docs/offline-game/ISOMETRIC_FIELD_SYSTEM.md); implementation lives in `src/offline-game/`.
- **AI continuation:** [2026-11-05 handoff](./docs/AI_HANDOFF_2026-11-05.md) and [developer access / World Atlas / Back navigation](./docs/APP_ACCESS_AND_NAVIGATION.md).
- **Shared infrastructure:** `src/shared/`; app composition: `src/app/`.
- **Tests:** grouped by system under `tests/`.

Every system-specific note is subordinate to the single [master roadmap](./docs/PRODUCT_ROADMAP.md).
