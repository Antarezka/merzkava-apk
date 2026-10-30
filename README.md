# merzkava-apk

Android-first hybrid roleplaying game for **Merzkava Universe**.

## Project status

**Milestone 0 — Project foundation**

This repository contains the Android application. The canonical world rules, lore, and setting remain in [merzkava-universe](https://github.com/Antarezka/merzkava-universe).

## Core architecture

- **Local game engine:** validates stats, inventory, currency, combat, time, and transactions.
- **Local database:** SQLite is the planned source of truth for player saves.
- **AI Game Master:** generates narration, dialogue, and proposed actions through replaceable provider adapters.
- **Canon loader:** retrieves relevant official world files from the canon repository.
- **Android shell:** web-based UI packaged as an Android application.

> The AI is not the authority for game mechanics or saved data. The game engine validates every proposed state change before it can be stored.

## Development principles

1. Local-first saves; cloud backup can be added later.
2. Never put provider API secrets in the app source or APK.
3. Treat AI output as untrusted input and validate it.
4. Keep canon separate from application code.
5. Add features incrementally with tests and documented migrations.

See [PROJECT_DIRECTIVES.md](./PROJECT_DIRECTIVES.md) for the working contract and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the initial design.
