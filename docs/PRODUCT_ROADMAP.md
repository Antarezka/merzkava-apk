# Merzkava APK — Product Roadmap

> **Status:** Master product roadmap / living reference  
> **Scope:** Product direction, feature inventory, implementation tracking, and release gates for Merzkava APK.  
> **Rule:** Every planned, existing, changed, or newly proposed feature must be recorded here before implementation is considered part of the product plan.

This document is the primary roadmap for the APK. If an older milestone note, README summary, task note, or informal conversation conflicts with this roadmap, use this document as the planning reference and update the other document. The official `Antarezka/merzkava-universe` repository remains the authority for world canon and gameplay rules; this roadmap does not create or override canon.

---

## 1. Product identity and non-negotiable boundaries

Merzkava APK is an Android-first application with two deliberately separate experiences:

1. **Connected conversation gameplay:** the AI Game Master obtains its world context from the official Merzkava Universe repository through the active pinned commit, `INDEX.md`, canon loader/router, and context assembler.
2. **World Archive:** a locally stored, offline reading/reference library inside the app. It is not connected to the AI GM prompt, gameplay context, or save-state authority.

### Architecture guardrails

- [x] Official Universe repository is the canonical source for world lore and rules.
- [x] The app's deterministic engine/database, not the AI, validates mechanics and authoritative state changes.
- [x] World Archive is defined as an offline reference layer, separate from gameplay authority.
- [ ] Add automated or inspectable tests proving Archive content is never appended to AI GM context.
- [x] Show source path, source commit, review date, source classification, and local dossier ID in the Archive; a dedicated offline reader now opens the reviewed public-safe extract.
- [ ] Keep separate revision records for the active gameplay canon SHA and the Archive content source SHA. Never imply they are the same snapshot.
- [ ] Verify offline and reconnect behavior without mixing stale or unapproved canon snapshots.
- [ ] Document this separation in the app's architecture and release checks.

**Hard boundary:** World Archive may inform a future standalone offline game mode only after its content has been reviewed and approved for that mode. It must never silently become the source for connected AI GM conversations.

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

**Progress now:** `[~] PHASE 1 INVENTORY + HANDOFF BASELINE ESTABLISHED`. The app has 32 curated dossiers / 28 unique source paths. A 140-path source coverage matrix and AI continuation instructions are recorded in `docs/WORLD_ARCHIVE_COVERAGE_MATRIX.md`. Entity-graph expansion, the local source reader, additional public content review, offline/isolation proof and final QA remain open. Do not describe the Archive as complete or all articles as approved.

**Goal:** Make the offline Archive complete, trustworthy, easy to navigate, and visually polished. Typography improvements belong to this workstream.

### 1A. Content integrity and coverage

- [ ] Audit every current Archive catalogue entry against the exact official Universe source file.
- [ ] Review every entry's visibility: player-public, GM-only, mechanics reference, private player data, review-required, or legacy.
- [ ] Exclude GM-only secrets, private player data, unrevealed identities, hidden agendas, and restricted outcomes from player-facing Archive.
- [ ] Mark each article as approved, needs revision, blocked, or excluded; do not treat catalogue presence as publication approval.
- [ ] Expand coverage only from verified Universe sources; preserve unknown/conflicting facts instead of inventing missing details.
- [ ] Verify all local links, aliases, cross-references, backlinks, source-reader navigation, and search results resolve to the correct local document in CI and on-device.
- [ ] Track source path, source commit, review date, visibility class, and local document ID for every article.
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
- [x] Make approved public entity mentions open the correct local dossier; automatic public mention links and inbound backlinks are rendered from the public dossier graph.
- [x] Add an offline source reader for reviewed public-safe extracts, with exact source path, source commit, review date, and source classification. Raw source Markdown is deliberately not bundled; mixed-scope files and claim-level details require further review.
- [ ] Verify entity links, backlinks, and source-reader navigation in CI and on-device; regression tests are committed but have not yet been executed.
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

**Goal:** Build a separate offline life/adventure game whose world, lore, events, available choices, progression rules, terminology, factions, places, creatures, items, and outcomes are derived exclusively from approved Merzkava Universe material published through the World Archive. The mode must feel like living inside Merzkava, not like a generic life simulator wearing Merzkava names.

**Canon/content rule — 100% Merzkava:** BitLife and Solo Leveling are presentation/design references only. They contribute no world facts, lore, terminology, characters, factions, items, abilities, progression rules, or story content. All such content must come from the official `Antarezka/merzkava-universe` repository, be reviewed for player visibility, and be included in the approved World Archive package before the offline mode can use it. If the Archive does not contain a needed fact or rule, mark that feature BLOCKED and send the gap through the Universe/Archive review process; never let AI invent a substitute.

**Current progress:** The separate-mode boundary and the 100% Merzkava content requirement are now defined. BitLife is confirmed only as a high-level life-simulation reference; Solo Leveling is only a UI/progression-presentation reference. No offline game loop, event engine, or playable offline mode has been implemented or verified.

**This is a separate mode, not an offline replacement for AI GM conversation.** Confirmed reference: [BitLife — Life Simulator (Candywriter)](https://play.google.com/store/apps/details?id=com.candywriter.bitlife). Use it as a high-level design reference for choice-driven life simulation, not as a source to copy proprietary text, art, branding, or exact content.

### 5A. Reference and mode boundary

**Purpose:** Prevent reference games from leaking their own content into Merzkava, and prevent offline mode from being confused with connected AI GM play.

- [x] Reference confirmed: [BitLife — Life Simulator](https://play.google.com/store/apps/details?id=com.candywriter.bitlife), design-pattern reference only.
- [ ] Study the reference at the level of general design patterns; create original Merzkava systems, writing, art, names, and interface rather than copying proprietary expression.
- [ ] Define the offline mode as a standalone experience, separate from connected AI GM conversation and its save/context pipeline.
- [ ] Finish and review the World Archive content required by the offline mode.
- [ ] Create a content-to-source traceability map: every offline entry/event/choice/rule must point to an approved Archive document and its official Universe source path + source commit.
- [ ] Define a curated, approved offline content package derived only from approved Archive material.
- [ ] Define a blocking rule: missing, contradictory, GM-only, private, or unreviewed Archive material cannot be used; send the gap back to Archive/canon review.
- [ ] Keep the offline mode's content snapshot/version separate from the connected gameplay canon SHA.
- [ ] Do not use Archive text as hidden context for connected AI GM conversations.
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

**Purpose:** Prove the mode is genuinely standalone and cannot contaminate connected gameplay or saves.

- [ ] Test cold launch with airplane mode enabled.
- [ ] Test full gameplay loop without network or login.
- [ ] Test app restart and save recovery while offline.
- [ ] Test switching between offline mode and connected conversation.
- [ ] Test missing/outdated content package behavior.
- [ ] Test that offline rewards/state cannot be misrepresented as connected canon events unless an explicit, approved import rule exists.
- [ ] Measure storage, memory, battery, and performance on target Android hardware.

**Exit gate:** The mode can be played end-to-end without internet/login, uses approved local content, saves safely, and remains isolated from connected AI GM context and state.

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

1. **Roadmap and architecture lock:** publish this roadmap, link it from project entry points, and verify the Archive/gameplay boundary.
2. **Existing-feature audit:** inventory screens and controls before adding more surface area.
3. **World Archive:** content review, offline navigation/search, then typography and visual refinement.
4. **UI feature expansion:** faction cards/buttons and shared glass/art interaction system.
5. **App services:** canon review first, then daily check-in and validated reward transactions.
6. **Offline game design:** confirm the “Life” reference, finish Archive prerequisites, then design and implement a separate playable mode.
7. **Future expansion:** prioritize new proposals through Workstream 6.

### Release checklist

- [ ] Roadmap is linked from README and project directives.
- [ ] Gameplay canon source and active SHA are visible and verified.
- [ ] Archive is offline-only and excluded from connected AI GM context.
- [ ] Existing feature register has been populated from source/runtime audit.
- [ ] No critical visible control is dead or misleading.
- [ ] Canon-sensitive rewards have written approval and deterministic tests.
- [ ] Offline game mode passes no-network end-to-end testing before being advertised as playable.
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
5. Read `docs/WORLD_ARCHIVE_CONTENT_MANIFEST.md` before changing Archive content, visibility, provenance, or offline content packaging.
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
| APK `docs/WORLD_ARCHIVE_CONTENT_MANIFEST.md` | Archive article catalogue, provenance, visibility, review and publication tracking | A listed article is not automatically approved |
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
- Confirmation that the offline game must be 100% based on Merzkava Universe content through World Archive.
- Clarification that World Archive is a local offline reference library and must not be inserted into connected AI GM context.
- Clarification that offline game is a separate standalone mode, not an offline fallback for connected AI GM conversation.

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

- [x] Create `docs/WORLD_ARCHIVE_COVERAGE_MATRIX.md`: classify all 140 Markdown paths in Universe snapshot `2f76a864150528afb0e3d26cb16f9396ce610ff6`, map current published dossier IDs/source paths, and record exclusions and next candidates.
- [x] Reconcile the current catalogue count: **32 dossiers / 28 unique source paths**. Older 26/23 figures in the manifest are stale and superseded.
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

**Mandatory start order for a new AI:** read this roadmap → read `docs/WORLD_ARCHIVE_COVERAGE_MATRIX.md` → read `docs/WORLD_ARCHIVE_CONTENT_MANIFEST.md` → inspect actual branch HEAD and working tree → verify the Universe source pin → inspect `src/lore/lore-library.ts` and tests → continue the next unchecked Phase 1 item. Do not redo completed light-theme typography work. Do not modify `merzkava-universe` unless explicitly requested.

**Phase 1 status:** `[x] INVENTORY + HANDOFF BASELINE`; overall Workstream 1 remains `[~] IN PROGRESS` until graph QA, local source reader, content expansion, isolation proof and release gates are complete.


### Implementation update — public entity graph (2026-11-01)

- `src/lore/lore-library.ts` already generated public cross-reference IDs from dossier summaries and paragraphs, and rendered matching title/alias mentions as clickable `data-lore-open` buttons. The resolver filters to `PUBLISHED` entries, so GM-only/private entries cannot become link targets.
- This implementation pass added exported `getLoreBacklinks(id)` and a **MENTIONED IN** section on dossier pages. Inbound links only include other published dossiers whose text mentions the target through the approved public title/alias graph.
- Regression coverage was added in `tests/lore-library.test.ts` for public-only targets, clickable outgoing mentions, backlinks, and invalid target IDs.
- Implementation commit: `3dd0b21f32bdd383737da48d52248b96c623535a`.
- Test commit: `4ce04c872d39611b6fa782b8e2199f4157aa3b0f`.
- **Verification state:** test code is committed but has not yet been executed by CI or on an Android device. Do not call graph QA passed until that evidence exists.
- **Still missing:** a bundled, offline local source-document reader. Source path remains visible as provenance text only.

