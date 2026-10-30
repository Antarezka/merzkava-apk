# Initial Architecture

## Product boundary
This repository is the application. Official world setting and rules live in `Antarezka/merzkava-universe`. The app reads canon; it does not silently fork or redefine it.

## Runtime layers
1. **User interface:** mobile-first screens for Home, Gameplay, Character, Inventory, World Map, Journal, Codex, and Settings.
2. **Application services:** coordinate user commands, AI requests, save operations, and navigation. UI components do not contain authoritative game rules.
3. **Deterministic game engine:** owns validation and calculations for progression, economy, inventory, combat, quests, and world time.
4. **Persistence:** SQLite stores local player data. Schema changes use versioned migrations.
5. **AI integration:** a provider-neutral interface supports multiple model services. AI returns narration and proposed actions; the engine validates each action independently.
6. **Canon integration:** a loader reads the pinned source and relevant files from the official canon repository, recording the commit SHA used.

## Authority boundary
The AI may suggest a purchase. It may not decide the authoritative price, grant the item, subtract currency, or write a save. The engine checks shop data and wallet state, then commits a valid transaction.

## Planned local data areas
Players and characters; attributes and progression; martial souls and spirit rings; inventory and equipment; wallet and financial ledger; quests and world events; NPC and relationship state; gameplay history and conversations; AI provider settings (never plaintext secrets); canon cache and pinned revision.

## Delivery sequence
1. Project foundation and mobile app shell
2. Navigation and screen layout
3. Typed domain models and deterministic engine
4. SQLite schema and migrations
5. Canon loader
6. AI provider interface and structured response parser
7. Gameplay loop with engine-validated actions
8. Android packaging and repeatable cloud builds
