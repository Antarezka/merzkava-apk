# Project Directives

> **Mandatory restriction register:** Read [Forbidden Technologies & Regression Safeguards](./docs/FORBIDDEN_TECHNOLOGIES.md) before adding dependencies, renderers, animation systems, or input/event layers. A listed technology must not be reintroduced without the owner's explicit approval after a verified solution is found.

## Master product roadmap

- `docs/PRODUCT_ROADMAP.md` is the primary planning reference for product scope, workstreams, feature inventory, status tracking, and release gates.
- Every existing feature, defect, and proposed feature must be inventoried or tracked there; do not assume a visible control is functional without verification.
- **Godot is the approved full client runtime.** The final installed Android client must use Godot for app shell, menus, Eternal Path, World Archive and Convo UI. Do not design a second parallel game runtime.
- The existing Vite/TypeScript/Capacitor client is migration source only until feature parity, data import and physical-device checks pass. Do not delete legacy code or reset user data early.
- Follow `docs/GODOT_MIGRATION_PLAN.md` for engine pin, offline guarantees, art direction, cloud builds and migration gates.
- **Convo / AI GM** is the connected conversation experience in the APK. It obtains active gameplay canon directly from the official `Antarezka/merzkava-universe` repository through the pinned source and routing pipeline.
- **World Archive** is the reviewed local content/reference layer in the same APK. Users can browse it offline, and its approved, versioned content package is the source consumed by **Offline Game**.
- **Merzkava: Eternal Path** (current working title) is the second playable experience inside the same APK. It uses approved World Archive content for canon-backed world references plus a separately versioned game-content pack for labelled adaptations and game-only additions, and runs locally without AI/network dependency; it is not a fallback version of Convo.
- Offline Game is a Life Simulation Text RPG. Its world foundation comes from Merzkava Universe through the reviewed World Archive package; game-only additions are allowed only with explicit `IN_GAME_ORIGINAL` provenance and must never be represented as Universe canon. Follow `docs/offline-game/CONTENT_PROVENANCE.md` for the required `CANON`, `CANON_ADAPTATION`, and `IN_GAME_ORIGINAL` labels and player-facing display rules. World Archive content must never be silently appended to connected Convo/AI GM context. Convo and Offline Game must keep separate session/save state and source-version records; no implicit state or context crossover.
- Daily login or reward systems must follow official Universe rules where applicable and use deterministic engine validation and auditable transactions. Do not invent canon rewards.

## Role and objective
Act as technical lead, software architect, and primary developer of Merzkava APK: an Android-first Godot roleplaying game connected to the canonical Merzkava Universe repository. The owner is a beginner working primarily from an Android phone. Prefer GitHub and cloud build workflows, and explain manual actions in small, clear steps.

## Source-of-truth hierarchy
1. **Game engine and database** — authoritative for mechanics, validation, player state, and transactions.
2. **Merzkava Universe repository** — authoritative for world lore, canon rules, geography, history, and official content.
3. **AI Game Master** — responsible for narration, dialogue, NPC behavior, interpretation, and proposed actions.
4. **Player input** — requests and attempted actions, not proof that an action succeeded.

AI output must never directly mutate the database. The engine validates every proposed action and calculates authoritative values.

## Engineering requirements
- Use a local-first architecture and preserve player saves.
- Build the final Android client entirely in Godot/GDScript; use Godot scenes, nodes, resources, native touch input and UI controls instead of a WebView/DOM runtime.
- Implement every animation in the final APK with Godot-native animation systems (AnimatedSprite2D, AnimationPlayer, Tween, and only when justified AnimationTree/GPUParticles2D). Do not ship Anime.js, CSS/DOM animation, JavaScript animation loops, or a second animation runtime. Keep legacy web animation only as a temporary migration reference until parity is verified.
- Optimize animation for the TECNO Spark Go 1 KL4: pause hidden/off-screen animations, limit particles and heavy shaders, reuse atlases, avoid per-frame script work, and profile real-device frame pacing, memory and battery before accepting effects.
- Keep core single-player gameplay, packaged World Archive, assets, settings and saves usable in airplane mode.
- Keep connected Convo and optional backup/update services behind explicit network adapters; never make them prerequisites for Eternal Path.
- Pin the Godot stable version and matching Android export templates in cloud CI. The owner must not need a PC, Android Studio or Termux for ordinary project builds.
- Keep external game titles used as private visual inspiration out of public repository files, commit messages, issues, pull requests, release notes, manifests, and build artifacts. Record only original Merzkava art requirements; never copy third-party assets or proprietary designs.
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


## Repository organization

- Keep one master roadmap at `docs/PRODUCT_ROADMAP.md`; all system-specific plans and notes link to it.
- During migration, preserve legacy Convo, World Archive, and Offline Game sources in `src/` as references. The target native client and gameplay implementation lives under `godot/`; do not treat legacy web code as the final runtime.
- Put genuinely cross-mode infrastructure in `src/shared/`; keep app composition in `src/app/`.
- Mirror those boundaries in `tests/` and `docs/`. Do not create parallel product roadmaps for individual modes.
- Preserve the source boundary: Convo loads Universe canon directly; Offline Game consumes only approved World Archive packages; neither mode silently imports the other's runtime state or context.

## Mandatory World Archive node policy

- Every Offline Game narrative node/situation must be designed around one or more reviewed, player-safe World Archive dossiers. World Archive is the mandatory world-context anchor for every node; do not author detached, free-floating nodes.
- Every node remains non-canonical gameplay content. A node may reference canon-backed people, places, institutions, rules, or events through Archive dossiers, but its scene, dialogue, choices, and outcomes must never establish new Merzkava Universe canon.
- Preserve the existing provenance labels and rules (CANON, CANON_ADAPTATION, and IN_GAME_ORIGINAL). World Archive anchoring is a separate context requirement, not a replacement provenance label and not a claim that original gameplay material is canon.
- Every content update that adds or expands nodes must add at least **two distinct nodes**. One-node updates are not acceptable. The existing nine-node starter slice is the established initial baseline; future increments must meet the two-node minimum while preserving existing coverage and quality gates.
- Keep the existing planned node labels/categories and presentation taxonomy unless the product owner explicitly changes them. Validate node count, Archive anchors, non-canon status, and provenance labels before accepting each update.

## Mandatory Eternal Path content scale and direction

- Build narrative nodes outward from the player goals and gameplay loops already defined in the project. Existing goals such as collecting are examples, not permission to invent a new goal taxonomy. Patch 1 targets at least 1,000 genuinely distinct, meaningfully branching nodes that support progression toward those existing goals.
- Every node is non-canonical, anchored to reviewed player-safe World Archive dossier(s), and keeps the planned labels/categories and provenance. Every node-content update adds at least two distinct nodes. The nine-node bootstrap does not count toward Patch 1's 1,000-node target.
- Long-term item catalog target: 25,000 distinct items total, with at least 10,000 genuinely functional items. Every item must be compatible with the official Merzkava Universe world constraints and use reviewed World Archive context. Preserve CANON / CANON_ADAPTATION / IN_GAME_ORIGINAL provenance; game-only additions never become Universe canon.
- Shop implementation is deferred until the owner explicitly signals readiness. Do not implement purchasing, vendor stock, or shop UI before that approval; catalog preparation and item-function work can proceed independently when their dependencies are ready.
