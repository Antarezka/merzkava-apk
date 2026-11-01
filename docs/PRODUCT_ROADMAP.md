# Merzkava APK — Product Roadmap

> **Status:** Master product roadmap / living reference  
> **Scope:** Product direction, feature inventory, implementation tracking, and release gates for Merzkava APK.  
> **Rule:** Every planned, existing, changed, or newly proposed feature must be recorded here before implementation is considered part of the product plan.

This document is the primary roadmap for the APK. If an older milestone note, README summary, task note, or informal conversation conflicts with this roadmap, use this document as the planning reference and update the other document. The official `Antarezka/merzkava-universe` repository remains the authority for world canon and gameplay rules; this roadmap does not create or override canon.

## Repository layout contract

The repository is organized by system ownership: `src/convo/` contains connected AI GM code; `src/world-archive/` contains the local archive; `src/offline-game/` contains the standalone local game; `src/shared/` contains infrastructure used by multiple modes; and `src/app/` composes the application shell. Tests follow the same boundaries under `tests/convo/`, `tests/world-archive/`, and `tests/offline-game/`.

There is **one master roadmap only**: this file, `docs/PRODUCT_ROADMAP.md`. System-specific docs live under `docs/convo/`, `docs/world-archive/`, and `docs/offline-game/`, but they must link back here and must not maintain competing product roadmaps. See [Application Architecture](./ARCHITECTURE.md) for dependency and ownership rules.

---

## 1. Product identity and non-negotiable boundaries

Merzkava APK is **one Android application containing two playable experiences and one shared content/reference layer**:

1. **Convo / AI GM:** connected conversation roleplay. Its active gameplay canon is read directly from the official `Antarezka/merzkava-universe` repository through the pinned commit, `INDEX.md`, canon loader/router, and context assembler.
2. **Offline Game (working name):** a standalone local game mode. Its world content, lore, places, people, events, choices, and approved game-facing reference data are sourced from the versioned, approved **World Archive package**. It must not depend on AI or a network connection to play.
3. **World Archive:** the in-app reviewed content library that users can browse offline and that supplies the approved content package consumed by Offline Game. It is not appended to Convo's AI GM prompt or used as Convo's canon loader.

Both modes live in the same APK and may share app shell, navigation, visual components, and infrastructure. They must retain separate mode identity, save/session state, and source-version records; switching modes must not silently merge state or context.

### Architecture guardrails

- [x] Official Universe repository is the canonical source for world lore and rules.
- [x] The app's deterministic engine/database, not the AI, validates mechanics and authoritative state changes.
- [x] World Archive is defined as the reviewed offline content/reference layer and the approved content source for Offline Game.
- [ ] Add automated or inspectable tests proving Archive content is never appended to connected Convo / AI GM context.
- [ ] Keep Convo and Offline Game session/save state isolated, with explicit mode switching and no implicit state import.
- [x] Show source path, source commit, review date, source classification, and local dossier ID in the Archive; a dedicated offline reader now opens the reviewed public-safe extract.
- [ ] Keep separate revision records for the active gameplay canon SHA and the Archive content source SHA. Never imply they are the same snapshot.
- [ ] Verify offline and reconnect behavior without mixing stale or unapproved canon snapshots.
- [ ] Document this separation in the app's architecture and release checks.

**Hard boundaries:** Convo reads its active gameplay canon directly from the official Universe repository; World Archive is not a hidden Convo context source. Offline Game consumes only the approved, versioned World Archive package; it does not fetch raw Universe files or invent missing canon at runtime. World Archive remains browseable in-app. The Archive package is a curated content distribution layer, not a replacement for the official Universe repository as the ultimate canon authority.

---

## 2. Roadmap status legend

| Status | Meaning |
|---|---|
| `[x] DONE` | Implemented and verified with evidence |
| `[~] IN PROGRESS` | Partially implemented; remaining work is listed |
| `[ ] TODO` | Planned, not yet verified as implemented |
| `[?] AUDIT` | Existing implementation is not yet fully inventoried or tested |
| `[!] BLOCKED` | Cannot proceed until a dependency or decision is resolved |

A feature is not DONE merely because a screen, button, placeholder, or design mock-up exists. Completion requires working behavior, appropriate error/empty/offline states, accessibility checks, and a test or reproducible verification note.

---

## 3. Workstream 1 — World Archive, typography, and reference experience

**Progress now:** `[~] PLAYER-FACING SOURCE COVERAGE MAPPED`. The app has **87 curated dossiers / 71 unique player-facing source paths**, plus **3 explicit `ON_PLAN` placeholders**. All **71/71 (100%)** source paths in the approved player-facing scope now resolve to a curated dossier or an intentional non-revealing placeholder. This represents **51.4% of the entire 140-file Universe Markdown inventory** when the linked legacy Beiming redirect is included. The other 69 paths are deliberately handled outside player-facing lore as repository controls, mechanics references, private player data, GM-only material, internal templates, or legacy compatibility sources—not missing public articles. The 16 canonical `MECHANICS_REFERENCE` modules are preserved verbatim, plus the complete supplemental imperial strategic-awakening allocation source and four supporting economic/social/service/learning source modules, in `docs/offline-game/CANON_FORMULA_SNAPSHOT.md`. The 24 NPC additions expose only reviewed public-profile facts; private whereabouts, secret ties, internal agendas, and hidden identities remain excluded. The Archive content-path target is now met, but this does **not** mean every relationship edge, claim, UI flow, build, or device behavior is verified. Automated tests, relationship/link QA, source freshness checks, offline/isolation proof, accessibility, and on-device verification remain release gates.

**Goal:** Make the offline Archive complete, trustworthy, easy to navigate, and visually polished. Typography improvements belong to this workstream.

### 1A. Content integrity and coverage

- [ ] Audit every current Archive catalogue entry against the exact official Universe source file.
- [ ] Review every entry's visibility: player-public, GM-only, mechanics reference, private player data, review-required, or legacy.
- [ ] Exclude GM-only secrets, private player data, unrevealed identities, hidden agendas, and restricted outcomes from player-facing Archive.
- [ ] Mark each article as approved, needs revision, blocked, or excluded; do not treat catalogue presence as publication approval.
- [~] Expand coverage only from verified Universe sources; 87 dossiers now cover all 71 approved player-facing source paths, including governance, institutions, education, social structure, routes, economic models, 24 claim-reviewed NPC public profiles, and explicit non-revealing placeholders for intentionally open or concealed subjects. The 69 remaining repository paths are handled under non-public dispositions.
- [x] Preserve the complete 16-module canonical mechanics source set verbatim, plus the supplemental Golden Dragon strategic-awakening allocation formula, in `docs/offline-game/CANON_FORMULA_SNAPSHOT.md` against the pinned Universe commit.
- [ ] Verify all local links, aliases, cross-references, backlinks, source-reader navigation, and search results resolve to the correct local document in CI and on-device.
- [~] Keep deliberately under-specified names clickable through an explicit placeholder registry. `ON_PLAN` preserves GM narrative room without inventing canon; `NON_CANON` labels non-official material. These statuses are distinct from source-review classes such as `PUBLIC_CANDIDATE`; CI and on-device behavior still need verification.
- [x] Track source path, source commit, review date, source visibility class, and local document ID for every public article.
- [ ] Add a repeatable audit for stale source paths and changed Universe files.

### 1B. Typography and reading comfort

- [x] Audit current fonts, font weights, sizes, line heights, letter spacing, and fallback behavior; local font files and system fallbacks are now explicit.
- [x] Improve readability on small Android screens and long-form lore pages; mobile type sizes, body leading, and metadata hierarchy have been raised.
- [x] Establish a consistent type scale for Archive page title, section title, body, metadata, captions, and navigation labels.
- [ ] Check mixed Latin/CJK/fantasy terms, punctuation, symbols, and special characters for missing glyphs.
- [ ] Check contrast, text wrapping, clipping, overflow, and dynamic font scaling.
- [x] Preserve the established Merzkava visual identity; the dark archive, aged brass, and parchment palette remain intact.
- [ ] Verify the reading experience in light/dark themes if both are supported.

### 1C. Archive navigation and interaction

- [ ] Audit Archive landing page, categories, article pages, search, filters, bookmarks, and back navigation.
- [ ] Improve search relevance, aliases, and ambiguous-name handling.
- [x] Make approved public entity mentions open the correct local dossier; automatic public mention links and inbound backlinks are rendered from the public dossier graph. Seven Golden Dragon regional dossiers now resolve separately; misleading aliases that previously routed Longyuan/Huanglongcheng to the Empire dossier were removed.
- [x] Add an offline source reader for reviewed public-safe extracts, with exact source path, source commit, review date, and source classification. Raw source Markdown is deliberately not bundled; mixed-scope files and claim-level details require further review.
- [~] CI regression coverage for entity links, public-only targets, backlinks, placeholder resolution, search, and navigation has run successfully in Web App Validation #653 (15 test files / 133 tests, with TypeScript, gateway type-check, and Vite build). Physical-device link/backlink/source-reader navigation QA remains open.
- [ ] Add useful empty, loading, unavailable, and no-result states.
- [ ] Verify the Archive remains fully readable with network disabled.
- [ ] Ensure Archive browsing cannot modify player inventory, wallet, character state, quests, or gameplay history.

**Exit gate:** Archive content has an explicit review disposition; navigation/search works locally; typography is readable; and an isolation check confirms Archive is not used as connected AI GM context.

---

## 4. Workstream 2 — Audit and repair existing features

**Progress now:** `[?] AUDIT NOT STARTED`. The register below is only a list of known product areas; no full screen/control inventory or end-to-end verification has been recorded yet.

**Goal:** Identify what already exists, what is incomplete, what is broken, and what is only visual scaffolding. No feature should remain invisible simply because it was never listed.

### 2A. Full feature inventory

- [ ] Build a screen-by-screen inventory from the actual source tree and runtime UI.
- [ ] Record every screen, tab, card, button, menu, dialog, form, and navigation destination.
- [ ] Classify each item as functional, partial, visual-only, broken, unreachable, or not implemented.
- [ ] Record expected behavior, actual behavior, dependencies, and verification evidence.
- [ ] Add the inventory to this roadmap or a linked feature register, with this roadmap remaining the master index.
- [ ] Check every visible button and clickable-looking element for a real action.
- [ ] Check navigation destinations, Android back behavior, deep links if present, and state restoration.
- [ ] Audit loading, empty, error, permission-denied, offline, and retry states.
- [ ] Audit persistence: app restart, process recreation, and database migration safety.
- [ ] Audit accessibility: touch target size, labels, contrast, screen scaling, and keyboard/input behavior.

### 2B. Repair queue

- [ ] Create one tracked repair item per confirmed defect, linked to its screen/component.
- [ ] Prioritize crashes, data loss, incorrect gameplay state, dead-end navigation, and broken core interactions.
- [ ] Then prioritize visual inconsistencies, responsiveness, animation, and polish.
- [ ] Add regression checks for every repaired critical behavior.
- [ ] Re-audit after each major feature batch so new regressions are not hidden.

**Exit gate:** Every existing screen and interactive element has an inventory status; critical defects are fixed or explicitly blocked; no visible control falsely implies functionality.

---

## 5. Workstream 3 — New UI features and interactive visual design

**Progress now:** `[~] FIRST PASS IMPLEMENTED / VISUAL QA OPEN`. The Home screen now has three full-area clickable faction dossier cards that open their matching published World Archive entries. Each power has its own CSS emblem and color atmosphere, with responsive layouts and keyboard/touch feedback. Bespoke faction artwork, final glass-surface refinement, and on-device visual QA remain open; do not mark this workstream complete yet.

**Goal:** Make the app feel like a cohesive, atmospheric fantasy application rather than a collection of static screens.

### 3A. Three powers / faction entry points

- [x] Create clear, clickable entry points for the three major powers:
  - Golden Dragon Empire
  - Tianhai Yunzhou
  - Beiming Gu
- [~] Establish a distinct CSS emblem and background identity for each power; bespoke faction artwork remains open.
- [ ] Use a refined glass-like surface treatment where suitable: translucent background, controlled blur, subtle border/highlight, and readable text.
- [ ] Keep artwork, text, and overlays balanced so labels remain legible.
- [x] Make the entire intended hit area clickable, not only the text.
- [x] Open the matching published World Archive dossier when tapped.
- [x] Provide pressed and keyboard-focus feedback; selected/disabled states remain dependent on later interaction states.
- [ ] Provide graceful image fallback if artwork is missing or cannot load.
- [ ] Optimize image dimensions and formats for Android memory and performance.

### 3B. Shared interaction and visual system

- [ ] Define reusable styles for glass panels, image cards, icon buttons, chips, dividers, and navigation controls.
- [ ] Define consistent interaction feedback: tap, press, selection, loading, success, and failure.
- [ ] Keep animations purposeful and lightweight; respect reduced-motion/accessibility settings where supported.
- [ ] Ensure visual controls have semantic labels and adequate touch targets.
- [ ] Add a visual QA pass across all major screens after shared components change.

**Exit gate:** New visual controls navigate to the right destinations, have meaningful feedback and fallback behavior, and remain readable/performance-safe on target Android devices.

---

## 6. Workstream 4 — App services, daily login, and canon-approved rewards

**Progress now:** `[ ] TODO`. No daily check-in or reward implementation is recorded as complete. First dependency is a canon review of whether the proposed reward types and schedule are allowed.

**Goal:** Add useful app-level systems without inventing or contradicting official Merzkava rules.

### 4A. Daily check-in / login

- [ ] Define whether check-in is based on local calendar day, server time, or an official in-world time rule; document the chosen authority.
- [ ] Prevent duplicate claims for the same eligible day.
- [ ] Handle timezone changes, clock manipulation, offline use, reconnect, and missed days.
- [ ] Persist claim history safely and make it recoverable.
- [ ] Provide a clear calendar/streak/history interface if the feature design calls for it.

### 4B. Rewards and eligibility

- [ ] Propose reward types and amounts only after checking the official Universe repository for permitted economy/reward rules.
- [ ] Confirm the proposed reward mechanism is legal and accepted by the canon repository before implementation.
- [ ] If canon does not define or permit a reward, do not silently add it; request a canon decision/update first.
- [ ] Route every reward through deterministic engine validation and the official wallet/inventory ledger.
- [ ] Prevent duplicate grants, replay abuse, negative balances, invalid items, and partial transactions.
- [ ] Record reward source, timestamp/day, amount/item, eligibility result, and transaction ID.
- [ ] Add tests for first claim, duplicate claim, missed day, offline/reconnect, migration, and failed transaction.
- [ ] Clearly distinguish app attendance rewards from in-world earnings, quest rewards, or NPC transactions.

### 4C. Other app services

- [ ] Maintain a tracked backlog for notifications, reminders, settings, backup/export, and quality-of-life services.
- [ ] Add each service only with a defined purpose, privacy impact, offline behavior, and test plan.

**Exit gate:** Every reward is canon-approved, engine-validated, transaction-safe, and auditable. No reward is granted by AI narration alone.

---

## 7. Workstream 5 — Standalone offline life/adventure game mode

<badge>DESIGN DEFINITION IN PROGRESS — IMPLEMENTATION NOT STARTED</badge>

**Goal:** Build the Offline Game as the second playable experience inside this same APK. Its world, lore, events, available choices, progression content, terminology, factions, places, creatures, items, and outcomes must be sourced from the approved, versioned World Archive package. The mode must feel like living inside Merzkava, not like a generic life simulator wearing Merzkava names.

**Canon/content rule — 100% Merzkava:** BitLife and Solo Leveling are presentation/design references only. They contribute no world facts, lore, terminology, characters, factions, items, abilities, progression rules, or story content. All such content must first be reviewed against the official `Antarezka/merzkava-universe` canon, approved for the Offline Game, and included in its versioned World Archive package before the mode can use it. At runtime, Offline Game consumes that Archive package rather than independently fetching the Universe repository. If the package does not contain a needed fact or rule, mark that feature BLOCKED and send the gap through the Universe → Archive review/update process; never let AI invent a substitute.

**Current progress:** The separate-mode boundary and the 100% Merzkava content requirement are defined. The full text of all 16 source files classified `MECHANICS_REFERENCE` at the pinned Universe commit has now been preserved verbatim in `docs/offline-game/CANON_FORMULA_SNAPSHOT.md`, alongside the supplemental formula-bearing `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md`. Formula-source preservation is **100% (17/17 source documents)** for this audited set. This is a development reference only. The deterministic HP, Satiety, Injury recovery, Time/Day-left, Combat, Spirit Ring, and Martial Soul Awakening and Economy formula modules are now implemented and CI-verified; other formula domains, player-safe content approval, the event engine, and playable offline mode remain open. Do not assign an overall engine percentage until the complete module inventory and dependencies are baselined. BitLife is only a high-level life-simulation reference; Solo Leveling is only a UI/progression-presentation reference.

**This is the second playable mode in the same APK, not an offline fallback or replacement for connected Convo.** Confirmed reference: [BitLife — Life Simulator (Candywriter)](https://play.google.com/store/apps/details?id=com.candywriter.bitlife). Use it as a high-level design reference for choice-driven life simulation, not as a source to copy proprietary text, art, branding, or exact content.

### 5A. Reference and mode boundary

**Purpose:** Prevent reference games from leaking their own content into Merzkava, define World Archive as Offline Game's content source, and keep Offline Game isolated from connected Convo.

- [x] Reference confirmed: [BitLife — Life Simulator](https://play.google.com/store/apps/details?id=com.candywriter.bitlife), design-pattern reference only.
- [ ] Study the reference at the level of general design patterns; create original Merzkava systems, writing, art, names, and interface rather than copying proprietary expression.
- [x] Define Offline Game as a standalone mode inside the same APK, separate from connected Convo and its context/save pipeline.
- [~] World Archive has 87 curated dossiers / 71 approved player-facing source paths and 3 `ON_PLAN` placeholders; approve and package the specific content needed for Offline Game (coverage completion alone is not game-content approval).
- [x] Preserve the complete pinned text of all 16 `MECHANICS_REFERENCE` source modules, plus the supplemental GDE governance allocation formula source, in `docs/offline-game/CANON_FORMULA_SNAPSHOT.md`; keep this development snapshot separate from player-facing Archive packaging.
- [~] Begin porting applicable formulas into deterministic offline engine modules without changing equations, thresholds, dependencies, or explicitly unresolved values. The HP maximum/state-consistency, Satiety interval/intake, Injury recovery, Time/Day-left, Combat, Spirit Ring, Martial Soul Awakening, Economy, and Arcanistry modules are implemented and CI-verified; remaining domains are not yet ported.
- [ ] Create a content-to-source traceability map: every offline entry/event/choice/rule must point to an approved Archive document and its official Universe source path + source commit.
- [ ] Define and version a curated Offline Game content package derived only from approved World Archive material, including the game-facing data/formula payloads needed by the mode.
- [ ] Define a blocking rule: missing, contradictory, GM-only, private, or unreviewed Archive material cannot be used; send the gap back to Archive/canon review.
- [ ] Keep the Offline Game's World Archive package version/SHA separate from the connected Convo gameplay canon SHA.
- [x] Do not use Archive text as hidden context for connected AI GM conversations.
- [ ] Keep Offline Game saves, progression, and events separate from Convo characters/sessions unless an explicit, reviewed import/export contract is later approved.
- [ ] Do not promise live NPC behavior, remote events, or online conversation while offline.
- [ ] Define what happens when the user returns online; mode switching must not overwrite or merge incompatible states.

### 5B. Offline gameplay concept

**Purpose:** Translate approved Merzkava material into a deterministic, replayable local life/adventure loop without changing canon.

- [ ] Choice-driven life simulation: character life stages, background, daily decisions, relationships, education/training, occupations/roles, resources, reputation, and long-term consequences, adapted to Merzkava canon.
- [ ] Year/season/day progression with events and meaningful decisions; define the time scale so it works with Merzkava's world rules.
- [ ] Build an event and choice system with varied outcomes and replayability; outcomes must be deterministic/seeded and locally persisted where appropriate.
- [ ] Design a self-contained life/adventure loop: character status, daily life, exploration, encounters, progression, and consequences.
- [ ] Add a System layer inspired by Solo Leveling's presentation: status window, quests/objectives, attributes, titles/achievements, notifications, and progression feedback, using original Merzkava naming, art, lore, and mechanics.
- [ ] Connect life-simulation choices to the System layer without turning every action into combat or a generic level grind.
- [ ] Use deterministic local rules for rewards, combat, progression, time, inventory, and character state.
- [ ] Use only content approved for offline player access.
- [ ] Provide meaningful choices and consequences without requiring AI or network access.
- [ ] Define offline quests/events, encounter pools, and replayability.
- [ ] Define save slots/state boundaries and safe persistence.
- [ ] Add clear mode identity so users know whether they are in connected AI gameplay or standalone offline gameplay.

### 5C. Offline reliability and QA

**Purpose:** Prove Offline Game is genuinely standalone inside the shared APK and cannot contaminate connected Convo context, sessions, or saves.

- [ ] Test cold launch with airplane mode enabled.
- [ ] Test full gameplay loop without network or login.
- [ ] Test app restart and save recovery while offline.
- [ ] Test switching between Offline Game and connected Convo without merging their state/context.
- [ ] Test missing/outdated World Archive package behavior and version pinning.
- [ ] Test that Offline Game rewards/state cannot be misrepresented as connected Convo canon events unless an explicit, approved import/export rule exists.
- [ ] Measure storage, memory, battery, and performance on target Android hardware.

**Exit gate:** Offline Game can be played end-to-end without internet/login, consumes only its approved versioned World Archive package, saves safely, and remains isolated from connected Convo context and state. Both modes remain discoverable and usable within the same APK.

---

## 8. Workstream 6 — Future expansion backlog

**Progress now:** `[x] PLACEHOLDER ESTABLISHED`. No specific feature is approved yet; future ideas must be scoped before being promoted into implementation.

This section is intentionally an open slot for ideas not yet specified. New proposals go here first, then receive scope, dependencies, priority, and acceptance criteria before implementation.

- [ ] **XXXX / Future feature placeholder** — awaiting product direction.
- [ ] Add future feature proposals with: user problem, expected behavior, affected screens, canon dependency, online/offline behavior, data impact, priority, and verification plan.
- [ ] Promote an item into Workstreams 1–5 only after its scope and dependencies are understood.

---

## 9. Existing feature register

The actual feature inventory has not yet been completed. Until the audit is done, the following are **known product areas from the current project scope**, not claims that every feature is already implemented.

| Product area | Initial audit status | Required audit |
|---|---|---|
| Home / dashboard | [?] AUDIT | Layout, navigation, live data, shortcuts |
| Connected Gameplay / AI GM | [?] AUDIT | Canon source, prompt isolation, provider, actions, errors |
| Character / profile | [?] AUDIT | Read/edit behavior, persistence, validation |
| Inventory / equipment | [?] AUDIT | Item operations, capacity, persistence |
| Wallet / ledger | [?] AUDIT | Canon currency, transaction integrity, history |
| World Map | [?] AUDIT | Map content, links, navigation, offline behavior |
| Journal / quests | [?] AUDIT | Quest state, updates, persistence |
| World Archive | [?] AUDIT | Coverage, visibility, search, typography, offline |
| Codex / reference | [?] AUDIT | Relationship to Archive and duplicate content |
| Settings | [?] AUDIT | Preferences, provider configuration, accessibility |
| Android shell / app lifecycle | [?] AUDIT | Startup, back navigation, process recovery |
| Build / release pipeline | [?] AUDIT | Build, signing, artifact, install and launch checks |

When the audit discovers additional screens or components, add them to this register. Do not remove a feature from the register merely because it is unfinished.

---

## 10. Suggested implementation order and release gates

The workstreams describe product scope; this sequence describes safe delivery order. Priorities may be adjusted when the audit finds a critical defect.

1. **Roadmap and architecture lock:** document the one-app / two-mode / shared-Archive architecture, link it from project entry points, and verify all source, context, and save boundaries.
2. **Existing-feature audit:** inventory screens and controls before adding more surface area.
3. **World Archive:** content review, offline navigation/search, then typography and visual refinement.
4. **UI feature expansion:** faction cards/buttons and shared glass/art interaction system.
5. **App services:** canon review first, then daily check-in and validated reward transactions.
6. **Offline Game design:** confirm the “Life” reference, approve/version the World Archive content package, then implement the second playable mode inside the same APK.
7. **Future expansion:** prioritize new proposals through Workstream 6.

### Release checklist

- [ ] Roadmap is linked from README and project directives.
- [ ] Gameplay canon source and active SHA are visible and verified.
- [ ] World Archive is locally browseable, supplies the approved Offline Game package, and is excluded from connected Convo context.
- [ ] Existing feature register has been populated from source/runtime audit.
- [ ] No critical visible control is dead or misleading.
- [ ] Canon-sensitive rewards have written approval and deterministic tests.
- [ ] Offline Game passes no-network end-to-end testing and mode/save isolation checks before being advertised as playable.
- [ ] Save data survives upgrades and migrations.
- [ ] Build, install, launch, and regression checks have recorded evidence.

---

## 11. How to read this roadmap and follow implementation

This section is the operating manual for a new AI conversation, developer, or reviewer joining the project mid-stream.

### 10A. Read order — mandatory

1. Read this file, `docs/PRODUCT_ROADMAP.md`, first. It defines scope, priorities, progress, dependencies, and acceptance gates.
2. Read `README.md` for the current product summary and repository entry points.
3. Read `PROJECT_DIRECTIVES.md` for the engineering contract, source-of-truth hierarchy, and GitHub working protocol.
4. Read `docs/ARCHITECTURE.md` before changing data flow, AI context, canon loading, persistence, or mode boundaries.
5. Read `docs/world-archive/CONTENT_MANIFEST.md` before changing Archive content, visibility, provenance, or offline content packaging.
6. Inspect the current branch head, latest commits, source tree, relevant files, and GitHub Actions before deciding what is actually implemented.
7. Read the relevant source files and tests. A roadmap checkbox is a plan/status signal, not proof that the current code still behaves that way.
8. Only then plan or change code. Update this roadmap with evidence after the work.

If two documents conflict, follow the source-of-truth hierarchy in PROJECT_DIRECTIVES for technical/canon authority, and use this roadmap as the primary product-planning record. Do not treat an old conversation as stronger evidence than current repository files and verified build results.

### 10B. What each repository reference is for

| Reference | Purpose | What it does not mean |
|---|---|---|
| `Antarezka/merzkava-universe` | Official source of world canon, rules, lore, places, factions, entities, and approved game content | It is not the APK source-code repository |
| APK `docs/PRODUCT_ROADMAP.md` | Master product plan, stage sequence, current progress, dependencies, and acceptance gates | It does not create or override Merzkava canon |
| APK `docs/ARCHITECTURE.md` | Technical data flow, app components, and system boundaries | It is not the complete feature inventory |
| APK `docs/world-archive/CONTENT_MANIFEST.md` | Archive article catalogue, provenance, visibility, review and publication tracking | A listed article is not automatically approved |
| APK `PROJECT_DIRECTIVES.md` | Required engineering behavior and source-of-truth hierarchy | It does not replace detailed task acceptance criteria |
| APK `README.md` | Short project entry point and links to authoritative project documents | It is not the full implementation plan |
| GitHub Actions runs/artifacts | Evidence of validation, build, packaging, install, launch, and test outcomes | A successful web validation is not proof that an APK build or emulator test passed |
| ChatGPT conversations | Decision history, user intent, clarifications, and task-specific discussion | Conversation memory is not a substitute for reading the current repo or canon |

### 10C. How progress statuses must be assigned

- Mark `[x] DONE` only when the relevant code/content exists on the current branch and a reproducible test, build, or direct verification supports it.
- Mark `[~] IN PROGRESS` only when implementation has started and the remaining work is stated.
- Keep `[?] AUDIT` when the feature may exist but has not been inspected and tested end-to-end.
- Use `[ ] TODO` when work has not started.
- Use `[!] BLOCKED` when a named dependency, missing canon decision, missing Archive approval, or technical issue prevents safe progress.
- Every completed item must cite a commit, test, workflow run, artifact, or verification note. A screenshot or mock-up alone does not prove interaction works.
- If new evidence contradicts an old status, correct the roadmap immediately. Never preserve a green checkbox just to make progress look better.

### 10D. Required progress note for every workstream

For each workstream, maintain: **purpose**, **current status**, **completed with evidence**, **in progress**, **not started**, **blocked/dependencies**, **next concrete action**, and **exit gate**. Update the progress log when a meaningful stage changes. If no implementation has been inspected, say so plainly rather than guessing.

### 10E. Build tracking and latest-build rules

Always distinguish these identifiers:
- **Branch head SHA:** newest commit on the working branch; may contain documentation-only changes.
- **Latest app-code SHA:** newest commit that actually changes app source/assets/build configuration.
- **Build run:** the GitHub Actions run tied to a specific SHA.
- **Validation run:** lint/typecheck/unit or web validation; not automatically an APK build.
- **Artifact:** the actual APK or diagnostic output produced by a run.
- **Installed/runtime verification:** evidence that the artifact installs, launches, and behaves correctly on a device/emulator.

Before any build-related claim, inspect current branch head and the latest relevant workflow runs. Link the exact run and artifact where available. If a later documentation commit has no APK artifact, do not label it as the latest APK. Never call a build successful solely because a separate validation workflow passed.

### 10F. AI conversation handoff protocol

At the start of a new conversation about this project, the assistant must:
1. Confirm repository `Antarezka/merzkava-apk` and active branch from GitHub, not from an old message.
2. Fetch this roadmap, README, PROJECT_DIRECTIVES, and any relevant architecture/Archive documents from that branch.
3. Check the latest branch SHA, latest app-code SHA, recent commits, and latest validation/build workflow results.
4. Identify which workstream and exact checklist item the user is discussing.
5. Read the current implementation and tests for that item before recommending or editing.
6. State the verified current status, evidence, and next action in plain language.
7. Preserve all user decisions recorded here; ask only when a real unresolved product decision blocks progress.

Do not assume the newest ChatGPT conversation is the latest repository state. Do not continue from a stale build, stale branch, or remembered commit without checking GitHub again.

### 10G. Conversation decision references

Use the current project conversation as decision context for these points:
- Master roadmap request and six workstreams.
- Confirmation that BitLife is the life-simulation design reference.
- Confirmation that one APK contains connected Convo and a standalone Offline Game, with World Archive as the Offline Game's approved local content source.
- Clarification that Convo reads the official Universe repository directly and must not receive hidden World Archive context.
- Clarification that Offline Game is a second playable mode in the same app, not an offline fallback for Convo.

The repository is the durable handoff. When a future conversation adds a new decision, record the decision here (or in the relevant technical document) with its date and commit. Do not invent ChatGPT conversation URLs; add a link only when the actual share/conversation URL is supplied and verified.

---

## 12. Verified project baseline — 2026-11-01

This is a dated snapshot, not a permanent claim. Recheck GitHub before every later task.

| Item | Verified state | Evidence / interpretation |
|---|---|---|
| Working repository | `Antarezka/merzkava-apk` | GitHub repository |
| Working branch | `feature/archive-experience` | Branch head inspected |
| Current branch head | `3361252440fd1f9d15045a2f465482c080a536d7` | Latest roadmap documentation commit at time of this update; documentation-only change |
| Latest app-code baseline found | `02e114270ec4a0ebe35314434b0dd07951f56ef4` | Latest identified app-code commit before roadmap-only commits; splash wordmark positioning |
| Latest APK build run found | Build #292, run `41286968526` | Run on app-code SHA `02e1142`; overall run conclusion was failure because emulator verification stage failed; APK build/sign/verification/upload steps had succeeded according to run diagnostics. Do not call the full run successful. |
| Latest web validation | #495, run `41289709639` | Passed on branch head `232bdec`; documentation/web validation only, not an APK build |
| Feature audit | Not completed | Existing feature register below remains `[?] AUDIT` |
| World Archive | Content audit/review still pending | Existing manifest/catalogue is a starting inventory, not approval of all entries |
| Faction cards and new service features | Not implemented/verified in this roadmap | Remain planned until source and runtime evidence says otherwise |
| Standalone offline game | Design boundary defined; implementation not started | Requires approved Archive package first |

**Recent app-code work visible in commit history:** Kitty splash idle motion and occasional head movement, warm light/wordmark reveal, launcher icon resource cleanup, splash shadow handling, and CI foreground-capture adjustments. The latest identified app-code commit is the centered wordmark change at `02e1142`. Later roadmap commits are documentation-only. This summary does not certify that every splash detail is visually perfect; inspect the current asset and runtime screenshot when working on splash again.

**Build interpretation:** Build #292 is not a clean pass. The APK packaging/signing/verification/upload portion succeeded, but the emulator/device verification stage failed. The separate Web App Validation #495 passed. These results must remain separate in future status reports.

---

## 13. Progress log

Add a dated entry for each meaningful roadmap change. Keep entries concise and link commits or tests when available.

| Date | Change | Evidence / commit |
|---|---|---|
| 2026-11-01 | Established master roadmap and six workstreams; current feature inventory remains pending audit. | `feb0391` |
| 2026-11-01 | Confirmed BitLife as a design-pattern reference only; added Merzkava-only content boundary, AI handoff/read-order guide, status rules, and verified build baseline. | `232bdec` (baseline evidence recorded above) |

## 14. Change-control rule

Before implementing a new feature or changing an existing one:

1. Find or create its roadmap item.
2. Record dependencies and whether it requires official Universe canon approval.
3. Define expected behavior and acceptance checks.
4. Update the item status as work progresses.
5. Record the commit/build/test evidence when complete.

**Do not mark an item DONE without verification. Do not change the connected-gameplay / offline-Archive boundary without an explicit product decision.**


### Typography implementation pass — 2026-11-01

- Removed the Google Fonts runtime import from the app stylesheet. Cinzel and Cormorant Garamond are now bundled as local WOFF2 assets (weights 400, 500, 600, and 700), with `font-display: swap`; Archive typography no longer depends on a live font request.
- Added the corresponding SIL Open Font License notices under `src/assets/fonts/licenses/`.
- Raised small-screen Archive copy, summaries, category controls, source metadata, paragraph markers, and footnotes. The dark charcoal archive surfaces, warm brass accents, and parchment-like text palette are retained.
- Added automated checks for local font asset presence, remote font-import removal, and the minimum Archive text scale.
- **Still open:** on-device visual verification at narrow widths, Android system font scaling, and offline/reconnect smoke testing. This pass does not close the full Workstream 1 exit gate or certify article-by-article canon review.


---

## Workstream 1 — Phase 1 handoff checkpoint (2026-11-01)

**Phase 1 objective:** establish a complete source-coverage baseline and a safe continuation point for a new AI/developer. This is documentation/audit groundwork, not a claim that the Archive content is complete or that a new APK has been built.

- [x] Create `docs/world-archive/COVERAGE_MATRIX.md`: classify all 140 Markdown paths in Universe snapshot `2f76a864150528afb0e3d26cb16f9396ce610ff6`, map current published dossier IDs/source paths, and record exclusions and next candidates.
- [x] Reconcile the current catalogue count: **39 dossiers / 35 unique source paths**. Older 26/23 figures in the manifest are stale and superseded.
- [x] Specify the entity-link contract: stable local IDs, canonical names and aliases, clickable mentions, related records/backlinks, ambiguity-safe resolution, public-only graph, and no links to GM-only/private entities.
- [x] Record the AI handoff sequence, branch baseline, Universe source snapshot, current implementation gaps, and last known Android build reference in the matrix.
- [~] Implement public entity mention links and inbound backlinks; regression tests are committed but still need CI execution and on-device navigation QA.
- [ ] Verify the complete public entity graph across aliases, search, related records, backlinks and ambiguity handling.
- [ ] Implement the local offline source reader; the current dossier source card displays the source path as plain text.
- [ ] Expand public coverage from `PUBLIC_CANDIDATE` / `PARTIAL_PUBLIC` rows only after claim-level review.
- [ ] Verify the matrix against the current recursive Universe tree before content expansion.
- [ ] Build and test the resulting APK; record exact versionName, versionCode, source SHA, workflow run, artifact, signature and device smoke-test outcome.

**Current branch baseline:** `feature/archive-experience`; pre-Phase-1-docs HEAD `67c5186ffac266fde41ddf82fd2fd3042d412486`. The Phase 1 documentation commits advance this branch; always fetch the actual HEAD before continuing.

**Last known APK reference:** Android Build workflow #300 used source SHA `956a0b1fa3b4f04ccca01f7fa7b1942b83bde770`, `versionCode=300`, `versionName=v.1.01.300-956`, package `com.antarezka.merzkava`, and artifact [merzkava-debug-apk](https://github.com/Antarezka/merzkava-apk/actions/runs/41298609571/artifacts/13080676292). APK compilation, package/version verification, alignment, signature verification and artifact upload passed; emulator smoke was interrupted by a system dialog taking focus. The user separately confirmed light-theme text readability on the physical device. This is a baseline only, **not** a build of the Phase 1 documentation commits.

**Mandatory start order for a new AI:** read this roadmap → read `docs/world-archive/COVERAGE_MATRIX.md` → read `docs/world-archive/CONTENT_MANIFEST.md` → inspect actual branch HEAD and working tree → verify the Universe source pin → inspect `src/world-archive/lore-library.ts` and tests → continue the next unchecked Phase 1 item. Do not redo completed light-theme typography work. Do not modify `merzkava-universe` unless explicitly requested.

**Phase 1 status:** `[x] INVENTORY + HANDOFF BASELINE`; overall Workstream 1 remains `[~] IN PROGRESS` until graph QA, local source reader, content expansion, isolation proof and release gates are complete.


### Implementation update — public entity graph (2026-11-01)

- `src/world-archive/lore-library.ts` already generated public cross-reference IDs from dossier summaries and paragraphs, and rendered matching title/alias mentions as clickable `data-lore-open` buttons. The resolver filters to `PUBLISHED` entries, so GM-only/private entries cannot become link targets.
- This implementation pass added exported `getLoreBacklinks(id)` and a **MENTIONED IN** section on dossier pages. Inbound links only include other published dossiers whose text mentions the target through the approved public title/alias graph.
- Regression coverage was added in `tests/lore-library.test.ts` for public-only targets, clickable outgoing mentions, backlinks, and invalid target IDs.
- Implementation commit: `3dd0b21f32bdd383737da48d52248b96c623535a`.
- Test commit: `4ce04c872d39611b6fa782b8e2199f4157aa3b0f`.
- **Verification state:** test code is committed but has not yet been executed by CI or on an Android device. Do not call graph QA passed until that evidence exists.
- **Still missing:** a bundled, offline local source-document reader. Source path remains visible as provenance text only.



### Offline-game implementation checkpoint — HP foundation (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/core/HP_SYSTEM.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `efef616efa7ad9c44c81470da6dc52bddc813204`.
- **Implementation:** `src/offline-game/mechanics/hp.ts` adds the exact realm/stage maximum-HP table, Mortal/0 handling, new-session versus continuing-session initialization, explicit death versus unresolved missing data, and maximum-HP reconciliation without automatic healing.
- **Safety:** the module does not invent damage or healing. Invalid realm/stage values and HP conflicts return explicit errors; a lower new maximum never silently clamps current HP.
- **Tests:** `tests/offline-game-hp.test.ts` covers the official table, invalid inputs, bootstrap rules, death state, no-auto-heal, and conflicts.
- **CI evidence:** Web App Validation run [#565](https://github.com/Antarezka/merzkava-apk/actions/runs/41305346595), source commit `cfb2666d119843a6f7b479f4c430f91173a4bf50`, completed successfully. The test step and TypeScript/Vite build step both passed.
- **Scope limit:** this is one foundational mechanic module, not a playable game or a complete engine. Do not report a whole-engine percentage until the required module inventory and dependency graph are defined. No Android APK was built by this validation workflow.


### Offline-game implementation checkpoint — Satiety/metabolism (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/core/HUNGER_AND_METABOLISM.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `66bdc7d4fe4d5270cf3c40193909aca582ac1dde`.
- **Implementation:** `src/offline-game/mechanics/satiety.ts` implements the official awake-time base rates, exclusive activity multipliers, missed-meal multipliers, body-condition multipliers, optional verified biological factor, combined ×8 cap, unrounded internal state, display-only one-decimal rounding, and verified food intake/portion values.
- **Boundary:** this module resolves one awake-time segment. Protected sleep must be excluded from supplied awake hours. Calendar-window transitions, missed-meal opportunity tracking, sleep state transitions, and cross-system consequences remain separate work.
- **Tests:** `tests/offline-game-satiety.test.ts` adds nine regression tests, including the official Mortal example, multiplier cap, zero-awake-time behavior, precision, intake cap, invalid values, and source-warning behavior.
- **CI evidence:** Web App Validation [#572](https://github.com/Antarezka/merzkava-apk/actions/runs/41305824767), source commit `deb8d403dfa93a5996668480b4e68d9de2e6c4b7`, passed: **7 test files / 52 tests**, TypeScript, gateway type-check, and Vite production build.
- **Canon discrepancy retained:** the source's Spirit Primordial 24-hour Light example says approximately 0.014 Satiety, while its stated 365-day base and formula calculate approximately 0.342466. The engine follows the explicit table/formula and returns a warning. Do not silently change the Universe source; resolve the example at the canon repository before treating this case as fully reconciled.
- **Dependency note:** this validation install reported four moderate development-tool advisories and zero production-only advisories. Details are recorded in the current CI log; no blind dependency downgrade was applied.
- **Scope limit:** HP and Satiety are two verified foundational modules, not a complete offline engine. Do not assign a whole-engine percentage before the complete module inventory and dependencies are baselined. Android Build #319 is separate and remains pending at this checkpoint.


### Offline-game implementation checkpoint — Injury recovery (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/core/INJURY_SYSTEM.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `a90d3d1c58afd3da171d66bc632b23e2a30cbbfd`.
- **Implementation:** `src/offline-game/mechanics/injury.ts` applies the published Class I–IV baseline progression rates proportionally to elapsed in-game hours, caps progress at 100%, and checks full-rest, appropriate-treatment, structural-treatment, stabilization, and continuing-treatment prerequisites.
- **Safety boundaries:** unclassified injuries do not progress; HP loss alone is never used to infer an injury class; no numerical activity penalty, treatment bonus, complication, diagnosis, or residual effect is invented. Class III requires completed structural treatment; Class IV requires stabilization and ongoing treatment.
- **Tests:** `tests/offline-game-injury.test.ts` (5 tests).
- **CI evidence:** Web App Validation [#577](https://github.com/Antarezka/merzkava-apk/actions/runs/41306410019), source commit `07bc36b05572b2f27abb41792ce4d243017ee1a2`, passed: **8 test files / 57 tests**, TypeScript, gateway type-check, and Vite production build.
- **Foundation status:** 3 deterministic modules (HP, Satiety, Injury) are implemented and CI-verified. This is not a complete engine; no whole-engine percentage is assigned before the full module inventory and dependency graph are baselined.
- **Android build:** Build #320 is a separate run on the earlier HP/Satiety-only commit `6310974`; it is not the latest Injury-inclusive source and has not completed emulator validation at this checkpoint.


### Offline-game implementation checkpoint — Time and cooldown (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/gameplay/TIME_AND_ACTION_RULES.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `f4ad8b2e1afc0bc9ef25f8f9d97eb541ab7ea29f`.
- **Implementation:** `src/offline-game/mechanics/time.ts` implements the fallback 12×30 calendar arithmetic, weekday rollover from a supplied session anchor, season lookup, ordinary-action 180-minute cap, protected sleep exception, pure-cultivation maximum of 30 days with all required preconditions, and Spirit Ring cooldown accumulation that excludes cultivation duration.
- **Cultivation gate:** pure-cultivation time skip requires pure activity, safe stationary location, sufficient logistics, progress checkpoints, interruptions accounted for, and Satiety accounting verified. The maximum duration is independently enforced.
- **Cooldown:** `Day left` uses the official ceiling of remaining eligible elapsed time in 24-hour days; normal life and sleep count, cultivation does not. Not-started cooldown remains distinct from the ninth-ring infinite state.
- **Tests:** `tests/offline-game-time.test.ts` (9 tests).
- **CI evidence:** Web App Validation [#584](https://github.com/Antarezka/merzkava-apk/actions/runs/41306800435), source commit `409d420feac225d7427e627769e77eb12a4ff1b6`, passed: **9 test files / 66 tests**, TypeScript, gateway type-check, and Vite production build.
- **Foundation status:** 4 deterministic modules (HP, Satiety, Injury, Time/Day-left) are implemented and CI-verified. This is not a complete engine; no whole-engine percentage is assigned before the full module inventory and dependency graph are baselined.
- **Android:** Build #322 targets the Time module source commit `3e7d97a`; the following test-only correction `409d420` added the Satiety precondition to the test fixture. Build #322 remains a separate APK/emulator workflow and is not yet final.


### Offline-game implementation checkpoint — Combat formulas (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/gameplay/COMBAT_SYSTEM.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `bc7d85a0e3521c30716b1859f5fdf070417d684c`.
- **Implementation:** `src/offline-game/mechanics/combat.ts` implements Combat Rating, combat ratio, 10–90% hit-chance clamp, d100 resolution, square-root power adjustment, official base-damage classes, defense reductions, upward rounding, current-HP loss cap, and default combo follow-up gating/damage.
- **Input boundaries:** PowerScale is supplied from the Spirit Ring subsystem; readiness is one of the five official values; artifact factor defaults to 1 unless a relevant documented effect is supplied. The calculator does not invent move availability, tactics, artifacts, defenses, injuries, or missing stats.
- **High-output gate:** the 18% class and its 9% combo follow-up require explicit confirmation of the documented high-output technique and sufficient resources.
- **Tests:** `tests/offline-game-combat.test.ts` (10 tests).
- **CI evidence:** Web App Validation [#592](https://github.com/Antarezka/merzkava-apk/actions/runs/41307268016), source commit `44640bad2006e02f739f81b4763b87dac3fe583d`, passed: **10 test files / 76 tests**, TypeScript, gateway type-check, and Vite production build.
- **Formula observation:** for a strictly positive combat ratio, the stated hit-chance expression approaches 25% as the ratio approaches zero; the written 10% lower clamp is therefore unreachable under valid positive inputs. The implementation retains the exact clamp without changing canon.
- **Foundation status:** 5 deterministic modules (HP, Satiety, Injury, Time/Day-left, Combat) are implemented and CI-verified. The full game engine remains incomplete; no overall percentage is assigned.
- **Android Build #324:** separate APK/emulator workflow on the Combat code commit; still pending at this checkpoint.


### Offline-game implementation checkpoint — Spirit Ring formulas (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/core/SPIRIT_RING_RULES.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `72666ef29bd5df41364f4727596747606fe581cf`.
- **Implementation:** `src/offline-game/mechanics/spirit-ring-compatibility.ts` and `src/offline-game/mechanics/spirit-ring-progression.ts`.
- **Compatibility module:** actual Beast-age pressure `B(Y)`, realm tolerance, EAG/`E_eff`, Sync cap including EAG-2 hard cap, eligible-only success/defect formulas, and AWR gate/ceiling.
- **Progression module:** geometric `C_total`, `AgeTotal`, PowerScale, Qi for 1–9 rings, awakening/first-ring versus later-ring hard gates, deviation HP loss, forced-attempt multipliers, actual HP-loss cap, and risk classification.
- **Tests:** `tests/offline-game-spirit-ring-compatibility.test.ts` (7 tests) and `tests/offline-game-spirit-ring-progression.test.ts` (8 tests).
- **CI evidence:** Web App Validation [#600](https://github.com/Antarezka/merzkava-apk/actions/runs/41307806131), source commit `9799378bddcd7bafb775ec37ed49b550ec014bf5`, passed: **12 test files / 91 tests**, TypeScript, gateway type-check, and Vite production build.
- **Hard boundaries:** no success chance or defect probability is calculated when eligibility gates fail; AWR is separate from absorption success and only checks when conversion starts above 7,000,000 years. First-ring absorption does not require a breakthrough item or cooldown; later rings require the official gates.
- **Foundation status:** 7 deterministic modules are implemented and CI-verified: HP, Satiety, Injury, Time/Day-left, Combat, Spirit Ring compatibility, and Spirit Ring progression. This is not a complete offline game; do not assign a whole-engine percentage until all required modules/dependencies are inventoried.
- **Android Build #327:** targets the Spirit Ring code commit `8f5b862`; still requires APK package verification and emulator smoke testing.


### Offline-game implementation checkpoint — Martial Soul Awakening (2026-11-01)

- **Source of truth:** `Antarezka/merzkava-universe/core/MARTIAL_SOUL_AWAKENING.md`, pinned at `2f76a864150528afb0e3d26cb16f9396ce610ff6`; upstream blob `fe56339b8c8fb2d70597c8a03891b7cf947a9cf8`.
- **Implementation:** `src/offline-game/mechanics/martial-soul-awakening.ts`.
- **Rarity:** one explicit 1–100 draw maps to Common 1–30, Uncommon 31–57, Rare 58–77, Epic 78–89, Legendary 90–97, Myth 98–100.
- **Mutation:** player decision is explicit; STOP performs no mutation draw; CONTINUE requires exactly one supplied 1–100 roll, with 1–10 = mutation (10%). No reroll.
- **Inherent assessment:** nine dimensions, each 0–15; only evidence-backed applicable scores count, unknown/N/A is excluded, minimum three dimensions required; mean ×9, nearest-integer rounding, cap 134, six provisional classification bands. This does not overwrite the rarity draw.
- **Tests:** `tests/offline-game-martial-soul-awakening.test.ts` (22 tests).
- **CI evidence:** Web App Validation [#610](https://github.com/Antarezka/merzkava-apk/actions/runs/41308698836), source commit `caeac68d3295c6338c5c333a5372152b0a06140d`, passed: **13 test files / 114 tests**, TypeScript, gateway type-check, and Vite production build.
- **RNG boundary:** this resolver consumes explicit rolls and does not generate randomness. The offline game's auditable seeded RNG and save/replay policy remain separate implementation work.
- **Foundation status:** 8 deterministic modules are implemented and CI-verified: HP, Satiety, Injury, Time/Day-left, Combat, Spirit Ring compatibility, Spirit Ring progression, and Martial Soul Awakening. This is not whole-game completion.
- **Android Build #330:** targets the Awakening module code commit; APK packaging, verification, and Android 14 emulator smoke test remain in progress.


### Offline-game implementation checkpoint — Economy formulas (2026-11-01)

- Source: `core/10_ECONOMY_SYSTEM.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6` (blob `0cc74b40d07ad8b2fe9fd2e4c37cdad1c0269456`).
- Runtime: `economy-wallet.ts` and `economy-pricing.ts`; regression tests: 9.
- Implements the five-currency conversion/normalization and unified item price formula, including tier, condition, effective scarcity, demand, distribution and local-market adjustments.
- Extreme/custom scarcity and exceptional demand require evidence; disaster multiplier bands are validated separately and are not blindly stacked with seasonal scarcity.
- Web App Validation #634 passed: 14 test files / 126 tests, TypeScript, gateway type-check, Vite build.
- Nine deterministic modules are CI-verified. This is not whole-game completion; event/RNG orchestration, persistence, content traceability and other formula domains remain open.


### Offline-game implementation checkpoint — Arcanistry (2026-11-01)

- Source: `core/ARCANISTRY_AND_FORMULATION.md` at Universe pin `2f76a864150528afb0e3d26cb16f9396ce610ff6`; blob `ef674a1fba92facd5e521f0fc7f08c7e730c7d2f`.
- Runtime: `src/offline-game/mechanics/arcanistry.ts`; regression tests: 5.
- Implements the full Grade 1–10 × Tier 1–10 baseline production-chance matrix, six-stage guided-training schedule, Tier 1–10 production-time/Mortal-Satiety tables, focus-stage/Grade 1 gates, production-experience points, and Artificial Artifact condition score/thresholds.
- Production success remains a baseline only: canon has not approved a random-resolution procedure or numeric situational modifiers. The module does not simulate either.
- Web App Validation #653 passed: 15 test files / 133 tests, TypeScript, gateway type-check, and Vite production build.
- Foundation now has 10 deterministic modules CI-verified. Full offline game remains incomplete; RNG orchestration, event/state engine, persistence, high-grade artifact gates, content traceability, and remaining formula domains remain open.
- Android Build #340 compiled and verified APK package/version/alignment/signature and uploaded an artifact; Android 14 emulator step was cancelled, so installation/smoke-test success is not claimed.
