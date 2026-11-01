# merzkava-apk

Android-first hybrid roleplaying game for **Merzkava Universe**.

## Project direction

**The master product roadmap is [docs/PRODUCT_ROADMAP.md](./docs/PRODUCT_ROADMAP.md).** It is the primary planning reference for the app's workstreams, existing-feature audit, priorities, progress checklist, and release gates.

The canonical world rules, lore, and setting remain in [merzkava-universe](https://github.com/Antarezka/merzkava-universe). The app's connected AI Game Master reads gameplay canon from that official repository. The **World Archive is a separate offline reading library** and must not be used as connected AI GM context or gameplay authority.

## Core architecture

- **Local game engine:** validates stats, inventory, currency, combat, time, and transactions.
- **Local database:** SQLite is the planned source of truth for player saves.
- **AI Game Master:** generates narration, dialogue, and proposed actions through replaceable provider adapters.
- **Canon loader:** retrieves relevant official world files from the canon repository.
- **World Archive:** local offline reference library, isolated from connected gameplay context.
- **Android shell:** web-based UI packaged as an Android application.

> The AI is not the authority for game mechanics or saved data. The game engine validates every proposed state change before it can be stored.

## Development principles

1. Local-first saves; cloud backup can be added later.
2. Never put provider API secrets in the app source or APK.
3. Treat AI output as untrusted input and validate it.
4. Keep official canon, offline Archive content, and application code separate.
5. Track every existing and planned feature in the [master roadmap](./docs/PRODUCT_ROADMAP.md).
6. Add features incrementally with tests and documented migrations.

See [PROJECT_DIRECTIVES.md](./PROJECT_DIRECTIVES.md) for the working contract, [docs/PRODUCT_ROADMAP.md](./docs/PRODUCT_ROADMAP.md) for the primary product plan, and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the system design.
