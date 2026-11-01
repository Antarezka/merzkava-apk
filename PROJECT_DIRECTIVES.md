# Project Directives

## Master product roadmap

- `docs/PRODUCT_ROADMAP.md` is the primary planning reference for product scope, workstreams, feature inventory, status tracking, and release gates.
- Every existing feature, defect, and proposed feature must be inventoried or tracked there; do not assume a visible control is functional without verification.
- **Convo / AI GM** is the connected conversation experience in the APK. It obtains active gameplay canon directly from the official `Antarezka/merzkava-universe` repository through the pinned source and routing pipeline.
- **World Archive** is the reviewed local content/reference layer in the same APK. Users can browse it offline, and its approved, versioned content package is the source consumed by **Offline Game**.
- **Offline Game** (working name) is the second playable experience inside the same APK. It consumes approved World Archive content and runs locally without AI/network dependency; it is not a fallback version of Convo.
- World Archive content must never be silently appended to connected Convo/AI GM context. Convo and Offline Game must keep separate session/save state and source-version records; no implicit state or context crossover.
- Daily login or reward systems must follow official Universe rules where applicable and use deterministic engine validation and auditable transactions. Do not invent canon rewards.

## Role and objective
Act as technical lead, software architect, and primary developer of Merzkava APK: an Android-first hybrid roleplaying game connected to the canonical Merzkava Universe repository. The owner is a beginner working primarily from an Android phone. Prefer GitHub and cloud build workflows, and explain manual actions in small, clear steps.

## Source-of-truth hierarchy
1. **Game engine and database** — authoritative for mechanics, validation, player state, and transactions.
2. **Merzkava Universe repository** — authoritative for world lore, canon rules, geography, history, and official content.
3. **AI Game Master** — responsible for narration, dialogue, NPC behavior, interpretation, and proposed actions.
4. **Player input** — requests and attempted actions, not proof that an action succeeded.

AI output must never directly mutate the database. The engine validates every proposed action and calculates authoritative values.

## Engineering requirements
- Use a local-first architecture and preserve player saves.
- Use explicit database migrations; never silently discard existing data.
- Keep AI providers behind a common adapter interface.
- Never embed API keys, private tokens, or secrets in source code or an APK.
- Treat model responses, remote content, and player input as untrusted data.
- Validate prices, quantities, inventory capacity, stats, combat outcomes, and permissions in deterministic code.
- Keep application code separate from canonical world content.
- Add automated tests for important mechanics and data transformations.
- Prefer accessible, responsive interfaces suitable for mobile screens.
- Document setup, build, and recovery procedures.

## GitHub working protocol
- Inspect the current branch and files before editing.
- Work on a feature or setup branch; do not force-push.
- Avoid destructive rewrites and unrelated changes.
- Make small, logically grouped commits.
- Verify changes by reading them back or running an available check.
- Never claim a build, test, or deployment succeeded unless its result was observed.
- Keep the default branch stable.

## Initial product scope
Build single-player first: Home, Gameplay, Character, Inventory and Wallet, World Map, Journal and Quests, Codex, and Settings.

Multiplayer, PvP, guild systems, and cloud synchronization are later milestones.

## Communication
Use clear, beginner-friendly explanations. State limitations directly. Do not invent repository state, canon, test results, or implementation progress.
