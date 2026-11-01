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
- [ ] Add a clear source/provenance display for Archive articles: source path, source commit, review date, visibility, and local document ID.
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

**Goal:** Make the offline Archive complete, trustworthy, easy to navigate, and visually polished. Typography improvements belong to this workstream.

### 1A. Content integrity and coverage

- [ ] Audit every current Archive catalogue entry against the exact official Universe source file.
- [ ] Review every entry's visibility: player-public, GM-only, mechanics reference, private player data, review-required, or legacy.
- [ ] Exclude GM-only secrets, private player data, unrevealed identities, hidden agendas, and restricted outcomes from player-facing Archive.
- [ ] Mark each article as approved, needs revision, blocked, or excluded; do not treat catalogue presence as publication approval.
- [ ] Expand coverage only from verified Universe sources; preserve unknown/conflicting facts instead of inventing missing details.
- [ ] Verify all local links, aliases, cross-references, and search results resolve to the correct local document.
- [ ] Track source path, source commit, review date, visibility class, and local document ID for every article.
- [ ] Add a repeatable audit for stale source paths and changed Universe files.

### 1B. Typography and reading comfort

- [ ] Audit current fonts, font weights, sizes, line heights, letter spacing, and fallback behavior.
- [ ] Improve readability on small Android screens and long-form lore pages.
- [ ] Establish a consistent type scale for page title, section title, body, metadata, captions, and navigation labels.
- [ ] Check mixed Latin/CJK/fantasy terms, punctuation, symbols, and special characters for missing glyphs.
- [ ] Check contrast, text wrapping, clipping, overflow, and dynamic font scaling.
- [ ] Preserve the established Merzkava visual identity; typography changes must not flatten the existing atmosphere.
- [ ] Verify the reading experience in light/dark themes if both are supported.

### 1C. Archive navigation and interaction

- [ ] Audit Archive landing page, categories, article pages, search, filters, bookmarks, and back navigation.
- [ ] Improve search relevance, aliases, and ambiguous-name handling.
- [ ] Make internal entity links open the correct local article.
- [ ] Add useful empty, loading, unavailable, and no-result states.
- [ ] Verify the Archive remains fully readable with network disabled.
- [ ] Ensure Archive browsing cannot modify player inventory, wallet, character state, quests, or gameplay history.

**Exit gate:** Archive content has an explicit review disposition; navigation/search works locally; typography is readable; and an isolation check confirms Archive is not used as connected AI GM context.

---

## 4. Workstream 2 — Audit and repair existing features

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

**Goal:** Make the app feel like a cohesive, atmospheric fantasy application rather than a collection of static screens.

### 3A. Three powers / faction entry points

- [ ] Create clear, clickable entry points for the three major powers:
  - Golden Dragon Empire
  - Tianhai Yunzhou
  - Beiming Gu
- [ ] Give each entry point its own appropriate artwork/background identity based on that power.
- [ ] Use a refined glass-like surface treatment where suitable: translucent background, controlled blur, subtle border/highlight, and readable text.
- [ ] Keep artwork, text, and overlays balanced so labels remain legible.
- [ ] Make the entire intended hit area clickable, not only the text.
- [ ] Open the correct Archive destination or approved app destination when tapped.
- [ ] Provide pressed, focused, selected, and disabled states where relevant.
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

**Goal:** When connected AI conversation is unavailable, offer a separate offline game experience with a life-simulation and progression-system atmosphere inspired by the user's stated Play Store reference and Solo Leveling-style system fantasy.

**This is a separate mode, not an offline replacement for AI GM conversation.** The exact Play Store title/reference called “Life” still needs confirmation before detailed feature matching.

### 5A. Mode boundary and prerequisites

- [ ] Confirm the exact reference game titled “Life” with the user before copying or closely matching specific mechanics/UI.
- [ ] Finish and review the World Archive content required by the offline mode.
- [ ] Define a curated, approved offline content package derived from Archive material.
- [ ] Keep the offline mode's content snapshot/version separate from the connected gameplay canon SHA.
- [ ] Do not use Archive text as hidden context for connected AI GM conversations.
- [ ] Do not promise live NPC behavior, remote events, or online conversation while offline.
- [ ] Define what happens when the user returns online; mode switching must not overwrite or merge incompatible states.

### 5B. Offline gameplay concept

- [ ] Design a self-contained life/adventure loop: character status, daily life, exploration, encounters, progression, and consequences.
- [ ] Design a system-style interface and progression presentation with a Solo Leveling-like atmosphere, while keeping original Merzkava naming, art, lore, and mechanics.
- [ ] Use deterministic local rules for rewards, combat, progression, time, inventory, and character state.
- [ ] Use only content approved for offline player access.
- [ ] Provide meaningful choices and consequences without requiring AI or network access.
- [ ] Define offline quests/events, encounter pools, and replayability.
- [ ] Define save slots/state boundaries and safe persistence.
- [ ] Add clear mode identity so users know whether they are in connected AI gameplay or standalone offline gameplay.

### 5C. Offline reliability and QA

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

## 11. Progress log

Add a dated entry for each meaningful roadmap change. Keep entries concise and link commits or tests when available.

| Date | Change | Evidence / commit |
|---|---|---|
| 2026-11-01 | Established master roadmap and six workstreams; current feature inventory remains pending audit. | Initial roadmap commit |

## 12. Change-control rule

Before implementing a new feature or changing an existing one:

1. Find or create its roadmap item.
2. Record dependencies and whether it requires official Universe canon approval.
3. Define expected behavior and acceptance checks.
4. Update the item status as work progresses.
5. Record the commit/build/test evidence when complete.

**Do not mark an item DONE without verification. Do not change the connected-gameplay / offline-Archive boundary without an explicit product decision.**
