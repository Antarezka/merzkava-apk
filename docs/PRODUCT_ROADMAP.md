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
2. **Merzkava: Eternal Path** (current working title; **Life Simulation Text RPG**): a standalone local game mode. Its canon-backed world facts and references are sourced from the versioned, approved **World Archive package**; game-facing adaptations and original gameplay additions are managed in a separate, versioned Offline Game content pack. It must not depend on AI or a network connection to play.
3. **World Archive:** the in-app reviewed content library that users can browse offline and that supplies canon-backed world references to Offline Game. It is not appended to Convo's AI GM prompt or used as Convo's canon loader.

Both modes live in the same APK and may share app shell, navigation, visual components, and infrastructure. They must retain separate mode identity, save/session state, and source-version records; switching modes must not silently merge state or context.

### Visual identity and reference language

The shared app experience is an original synthesis of four user-selected references:
- **Arknights:** information hierarchy, tactical-feeling panels and purposeful navigation structure.
- **Reverse: 1999:** editorial typography, restrained ornament, atmospheric composition and distinctive transitions.
- **Girls' Frontline:** modular system presentation, character-facing information density and functional interface grouping.
- **Harry Potter:** archival/magical atmosphere through books, old letters, seals, catalogues and tactile paper details.

These are design references, not assets or templates to reproduce. Merzkava retains its own dark, warm-brass, parchment and arcane identity. Each screen must remain readable, responsive, accessible and function-first; atmosphere must never obscure controls or content.

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

**Hard boundaries:** Convo reads its active gameplay canon directly from the official Universe repository; World Archive is not a hidden Convo context source. Offline Game consumes a versioned release package that pins the approved World Archive package and the separate reviewed Offline Game content pack; it does not fetch raw Universe files or invent missing canon at runtime. World Archive remains browseable in-app. The Archive package is a curated content distribution layer, not a replacement for the official Universe repository as the ultimate canon authority.

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

## 2A. Master project progress index

**Current documented index: 18.8%** (calculated from the active roadmap checklist at this revision).

Calculation rule: each active checklist item is scored as DONE = 1, IN PROGRESS = 0.5, and TODO / BLOCKED / AUDIT = 0. The index is:

`(DONE + 0.5 × IN PROGRESS) ÷ all active checklist items × 100`

This is a transparent checklist-completion index, **not** a prediction of remaining time, a measure of code volume, or a release-readiness score. Large and small tasks currently count equally. Historical implementation notes and retired work are excluded; the index must be recalculated when active checklist items or their statuses change. A feature is not complete until its own acceptance gate and verification evidence pass.

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

**Current owner-requested repair batch (2026-11-06):** Use Android Build #1234 / source baseline `2676daffff0610013793cc5b17312fe8b320abf9` as the historical starting point; verify against the live feature branch and current Android workflow before claiming release completion. Keep Developer Floating Control / Lock and Player Sign out inside Settings → Account & Access, preserving the Kitty Bubble action and Settings position. World Atlas passwords require 8–128 characters with uppercase, lowercase, number, and punctuation/symbol (whitespace does not count). A player who knows the old password can change it immediately without an app-update gate. Forgotten passwords cannot be disclosed or recovered. **Master Reset is Developer-initiated only:** the Developer verifies ownership through an official channel, selects the account, and generates a non-authorizing AI request code. The AI creates a unique account-bound confirmation code, commits only its SHA-256 hash to `src/offline-game/atlas-reset-grants.generated.ts`, and prepares the next APK update. The player enters that code in the matching updated app; only then does the new-password and confirmation form open. There is no shared permanent master password, no player-generated reset authorization, and no fixed build number; the qualifying version is the next successfully built APK containing the grant. Keep the existing World Atlas login access sequence, localized recovery/safety notices, account-specific validation, and password policy. Show the shared Anime.js access-buffer only after an explicit confirmation starts a real account operation: Player/Developer sign-in or sign-out, World Atlas Login/Sign-up, current-password or Master Reset code verification, saving a replacement password, Developer reset-request generation, and confirmed clipboard copy. Do not show the fake loading overlay merely because World Atlas opens, its live registry loads, a player name is selected, a password form is revealed, or a reset form is opened; those use ordinary inline loading/status feedback. Keep each diagnostic profile technically accurate to the operation actually underway, and reserve PBKDF2 terms for real credential derivation/verification. The loading surface uses the Merzkava Victorian clockwork-instrument language: dark verdigris enamel, warm aged brass, engraved dial/ring, restrained gold illumination, editorial Cinzel/monospace typography, and matched parchment/sage styling in Light Theme. Show one active diagnostic line only; fade/slide it out, replace it, then step its trailing punctuation through `.`, `..`, `...` as individual frames before moving to the next message. The brass progress rail advances once through randomized, monotonic checkpoints with deliberately uneven short runs and pauses; it waits near completion while the real operation is pending, reaches 100% only after successful settlement, and never loops back. A failed/cancelled operation closes the overlay without a false 100% completion. Preserve reduced-motion behavior and keep the routine presentation-only. Player sign-in and World Atlas account/password operations require an active internet connection and a fresh check against the active pinned Universe source; Player identity must be resolved from the live registry/profile. Developer sign-in remains offline-capable and uses local-only PBKDF2-SHA-256, constant-time ID comparison, and SecureStorage diagnostics. Developer reset-request generation has its own local sequence (account binding, random Request-ID, cryptographic challenge, Player-Key SHA-256, request serialization); copying has a separate clipboard-capability/read/encoding/write/confirmation sequence. Neither claims network activity. Player and Developer sign-out remain possible offline and each describes its own local session/authorization-marker cleanup. The loader is presentation only and never substitutes for validation. The grant is consumed per account credential record on that installation; do not claim cross-device global one-time enforcement. Shared route transitions remain an overlapping shell cross-fade with restrained Anime.js motion and reduced-motion support. Preserve both app themes, Developer access boundaries, official registry identity matching, internal Atlas bypass, and existing Floating Control/Kitty behavior. Emulator installation and owner-device QA remain separate release gates.

- [ ] Create one tracked repair item per confirmed defect, linked to its screen/component.
- [ ] Prioritize crashes, data loss, incorrect gameplay state, dead-end navigation, and broken core interactions.
- [ ] Then prioritize visual inconsistencies, responsiveness, animation, and polish.
- [ ] Add regression checks for every repaired critical behavior.
- [ ] Re-audit after each major feature batch so new regressions are not hidden.

### 2C. Regression baseline and repair safety

- [ ] When a repair risks damaging a working screen or interaction, compare against the latest verified Android build and its source commit before changing behavior.
- [ ] Preserve working toolbar/menu behavior as the regression baseline: stable positioning, current navigation destinations, horizontal roulette/scroll, rotary controls, touch/drag distinction and existing animation behavior.
- [ ] Do not rework or reposition the toolbar merely for visual preference when the current build already behaves correctly; only change the specific confirmed defect.
- [ ] For every repair, record the baseline build/commit, changed behavior, regression test and Android verification result.
- [ ] If a change breaks a previously working function, stop feature expansion and restore/fix that behavior before continuing.

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

- [~] Replace the plain bottom rail with the **Retractable Victorian Clockwork Compartment**: a sculpted central drawer crown, recessed shoulders, dark verdigris enamel, aged brass trim, and restrained mechanical cable/pulley details. Keep the rail fixed and untransformed; preserve its manual horizontal roulette and scroll offset across route rerenders.
- [~] The four primary destinations lead the rail in this order: Home (recognizable flat suitcase illustration), Eternal Path (open book), Archive (document/record), and Profile (cameo portrait). Convo, Inventory, Journal, and Settings remain available through manual horizontal scrolling; four destinations remain visible at a time on narrow phones.
- [~] Each destination has its own function-specific flat editorial emblem in a Reverse: 1999-inspired visual language. Dragging the emblem rotary ring turns only that local mechanism; the central pictogram tilts slightly, while the fixed button coordinate, width, order, and label do not change. Side cables/pulleys respond subtly and ratchet ticks use the existing sound setting.
- [ ] Verify the 32 CSS-pixel left/right breathing margins plus safe-area insets, stable scroll offset and button coordinates across Home, Convo, Eternal Path, Archive, Profile, theme changes, and rerenders. Physical-device gesture and visual QA remains required. Track under [UI-EP-002](./offline-game/UI_REPAIR_CHECKLIST.md#ui-ep-002-toolbar-position-drift) and [Issue #2](https://github.com/Antarezka/merzkava-apk/issues/2).

- [ ] Define reusable styles for glass panels, image cards, icon buttons, chips, dividers, and navigation controls.
- [ ] Define consistent interaction feedback: tap, press, selection, loading, success, and failure.
- [ ] Keep animations purposeful and lightweight; respect reduced-motion/accessibility settings where supported.
- [ ] Ensure visual controls have semantic labels and adequate touch targets.
- [ ] Add a visual QA pass across all major screens after shared components change.

### 3C. Retractable Victorian Clockwork Navigation

**Design decision:** The bottom navigation is a shared mechanical compartment, not a flat bar and not a separate toolbar per mode.

- [~] Give the compartment a raised central crown and curved/recessed shoulders, with a dark green lacquer/verdigris surface, antique brass edging, fine engraving, and a restrained Victorian/arcane silhouette.
- [~] Keep at least 32 CSS px of clear space on both screen edges, plus Android safe-area insets. Cable and pulley details stay inside the compartment boundary and never occupy the edge-gesture zones.
- [~] Use flat editorial illustrations rather than emoji or generic system glyphs. The first four primary destinations are Home / recognizable travel suitcase, Eternal Path / open book, Archive / document record, and Profile / cameo portrait. Secondary destinations remain reachable by manual roulette swipe.
- [~] Give each menu item an independent rotary ring. Dragging its ring rotates only that mechanism in place; the central emblem tilts slightly. No item may translate, swap order, resize, or clip during rotation.
- [~] Couple the side cable/pulley ornament to the active dial movement and use the existing sound preference for restrained mechanical ratchet ticks.
- [~] Preserve Anime.js entrance/stagger and active-item feedback on inner wrappers only. Keep the fixed rail viewport anchor transform isolated from item animation.
- [~] Preserve manual horizontal scroll position and each dial rotation angle across route rerenders.
- [ ] Verify all eight destinations, four-visible-item layout, drag-vs-tap behavior, scroll behavior, theme/mode changes, Android edge gestures, reduced motion, and visual stability on the target device.

**Exit gate:** Four primary menu functions are immediately recognizable, all existing destinations remain reachable, rotation is local and never changes menu geometry, and the dock remains gesture-safe and stable on-device.

### 3D. Audio, reading controls and inclusive access

**Audio architecture**
- [ ] Keep independent user controls for **Tap Sound**, **BGM**, and **Ambient / Sound FX**; changing or muting one category must not silently change the others.
- [ ] Persist each category's enabled state and volume independently across app restarts.
- [ ] Route existing navigation ratchet/tap feedback through Tap Sound; avoid duplicate playback when a control is tapped or dragged.
- [ ] Prepare the BGM setting and playback boundary now, but keep music playback inactive/empty until the user supplies the BGM assets.
- [ ] Keep environmental sounds (rain, wind, thunder and scene ambience) under Ambient / Sound FX, not Tap Sound or BGM.
- [ ] Respect Android audio focus, interruptions, silent/mute state and reduced-motion/reduced-sensory preferences where applicable.

**Independent text presentation**
- [ ] Add separate typography preferences for connected Convo messages and Eternal Path narrative; neither mode may unexpectedly overwrite the other's settings.
- [ ] Offer optional dyslexia-friendly font choices plus independent font size, weight, line height, letter spacing, paragraph spacing and text-width controls.
- [ ] Keep font choices optional and preserve bundled/local font fallback so reading does not depend on a network font request.
- [ ] Ensure user text settings apply to long-form narrative, dialogue, choices and system messages without clipping controls or hiding critical status information.

**Vision and color accessibility**
- [ ] Provide color-vision support profiles (including common red/green and blue/yellow deficiencies) and a high-contrast option.
- [ ] Never communicate state, rarity, success, danger or availability by color alone; pair color with text, icon, shape, pattern or position.
- [ ] Check text/background contrast, focus visibility, dynamic text scaling, zoom/reflow, touch targets and screen-reader labels across Convo and Eternal Path.
- [ ] Respect Android accessibility services and TalkBack semantics; avoid animation or decorative layers that intercept reading/focus order.
- [ ] Test all reading and color modes on narrow Android screens and with reduced motion enabled.

**Deferred Braille milestone**
- [ ] Plan Braille support only after the core app, audio controls, independent reading controls, accessibility baseline and Eternal Path content/engine milestones are complete.
- [ ] Before implementation, confirm the intended scope with the user: compatible refreshable Braille display / Android BrailleBack integration, in-app Braille presentation, or both.
- [ ] Design Braille output around semantic text and navigation structure, not screenshots or visual-only UI; test supported hardware/services before declaring support.

**Exit gate:** Audio categories are independent and persistent; Convo and Eternal Path have independent readable-text preferences; vision accessibility does not rely on color alone; Android assistive technologies can navigate core flows. Braille remains a later milestone and is not falsely represented as implemented.


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

## 7. Workstream 5 — Merzkava: Eternal Path (Life Simulation Text RPG)

<badge color="warning">PLAYABLE PROLOGUE SLICE 0.1.0 — FULL GAMEPLAY IN PROGRESS</badge>

**Current game identity:** **Merzkava: Eternal Path** (working title). Category: **Life Simulation Text RPG**. It combines choice-driven character-life simulation with text-RPG exploration, quests, encounters, cultivation, and long-term progression.

**Goal:** Build the Offline Game as the second playable experience inside this same APK. Its canon world facts—lore, history, geography, factions, places, established entities, and official rules—must be sourced from the approved, versioned World Archive package. Game-facing adaptations and new gameplay-only items, creatures, Arcanistry entries, events, loot, and other additions may be authored in a separate versioned Offline Game content pack with explicit provenance labels. The mode must feel like living inside Merzkava, not like a generic life simulator wearing Merzkava names.

**World/content authority rule:** Merzkava Universe remains the canon foundation. BitLife and Solo Leveling are high-level design references only; they contribute no world facts, lore, terminology, characters, factions, items, abilities, progression rules, or proprietary story content. Canon-backed content must be reviewed against the official `Antarezka/merzkava-universe` repository and included in the approved, versioned World Archive package. However, the game may create additional items, equipment, materials, Spirit Beast variants, Arcanistry entries, quests, encounters, loot, and other gameplay content when needed. Such additions must carry the `IN-GAME ORIGINAL` label, remain consistent with known canon, and must never be presented or exported as official Universe facts. Canon concepts translated into game-specific records use `CANON ADAPTATION`. At runtime, Offline Game consumes only the approved local package, never raw Universe files. If a missing dependency requires an authoritative world fact or rule, mark that feature BLOCKED and route it through Universe → Archive review; never let AI invent a substitute.

**Current progress (2026-11-02):** The shared Hybrid Tactical Academy shell has received a mobile-first composition pass: the Command Hall home identity is explicit, eight destinations share one bottom retractable clockwork compartment, the four primary destinations lead the rail, and the remaining routes stay available through manual horizontal roulette. The Convo world-time glass panel remains readable above the chronicle, and the existing Floating Control is excluded from the shell styling. This is a visual implementation pass, not a completed full-screen audit or physical-device sign-off. The separate-mode boundary and the Merzkava-world foundation are defined. The dedicated Expedition Interface now composes eight existing regional scene artworks with a separate low-opacity FX-02 fog texture, time-of-day tint, and deterministic weather overlay. A temporary in-memory scene test bench can switch scene, cycle, weather, and fog transparency without changing the game save. Anime.js animates the inner fog texture inside the Eternal Path-only scope. The first playable slice now creates its own local character/save (separate from Convo), advances its local clock through choices, and ships a versioned 0.1.0 content pack containing 240 branching `IN_GAME_ORIGINAL` dialogue nodes with deterministic effects. This is a playable prologue foundation, not completion of the life simulation: full Archive package pinning, quest/travel systems, validated combat/rewards, complete progression, save migration QA, and physical-device visual/performance QA remain open. Canon-backed world references must come from World Archive; a separate game content pack may hold labelled adaptations and original gameplay additions. The full text of all 16 source files classified `MECHANICS_REFERENCE` at the pinned Universe commit has now been preserved verbatim in `docs/offline-game/CANON_FORMULA_SNAPSHOT.md`, alongside the supplemental formula-bearing `world/GOLDEN_DRAGON_EMPIRE_GOVERNANCE.md`. Formula-source preservation is **100% (17/17 source documents)** for this audited set. This is a development reference only. The deterministic HP, Satiety, Injury recovery, Time/Day-left, Combat, Spirit Ring, and Martial Soul Awakening and Economy formula modules are now implemented and CI-verified; other formula domains, player-safe content approval, the event engine, and playable offline mode remain open. Do not assign an overall engine percentage until the complete module inventory and dependencies are baselined. BitLife is only a high-level life-simulation reference; Solo Leveling is only a UI/progression-presentation reference.

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
- [ ] Define and version the Offline Game release package, pinning the approved World Archive package for canon-backed references plus a separate reviewed game content pack for adaptations and game-only additions.
- [x] Define three explicit content provenance classes in `docs/offline-game/CONTENT_PROVENANCE.md`: `CANON`, `CANON_ADAPTATION`, and `IN_GAME_ORIGINAL`; specify traceability and player-facing explanations.
- [ ] Implement provenance fields and validation in the Offline Game content-pack schema, including rejection of unknown or missing classifications.
- [ ] Display provenance labels in tooltips, item details, Spirit Beast and Arcanistry details, Encyclopedia/Codex, search results, and relevant notifications; labels must be readable text, not color alone.
- [ ] Add package and persistence tests proving provenance survives serialization, updates, and save migrations, and that game-only records cannot be promoted to canon automatically.
- [ ] Define a blocking rule: missing, contradictory, GM-only, private, or unreviewed Archive material cannot be used; send the gap back to Archive/canon review.
- [ ] Keep the Offline Game's World Archive package version/SHA separate from the connected Convo gameplay canon SHA.
- [x] Do not use Archive text as hidden context for connected AI GM conversations.
- [ ] Keep Offline Game saves, progression, and events separate from Convo characters/sessions unless an explicit, reviewed import/export contract is later approved.
- [ ] Do not promise live NPC behavior, remote events, or online conversation while offline.
- [x] Define the Offline Game as a Life Simulation Text RPG under the current working title `Merzkava: Eternal Path`; keep BitLife/Solo Leveling as design references only.
- [ ] Define what happens when the user returns online; mode switching must not overwrite or merge incompatible states.

### 5B. Eternal Path — dedicated game design blueprint

**Purpose:** Design the actual game as a coherent life simulation before expanding dialogue volume or adding disconnected screens. This is a required design stage, not permission to start implementing every listed system immediately.

- [ ] Write a complete Game Design Document (GDD) for **Merzkava: Eternal Path — Life Simulation Text RPG**, including player fantasy, target experience, design pillars, scope boundaries, and explicit non-goals.
- [ ] Define the core gameplay loop from waking/day planning through activities, time/resource costs, encounters/events, consequences, rest, and long-term advancement.
- [ ] Define the life-simulation layer: character origin/background, age and life stages, personality/aptitudes, needs, health, fatigue, satiety, injury, daily routine, and meaningful non-combat choices.
- [ ] Define the activity catalogue and rules: rest/sleep, meals, training, study, work/service, crafting, social visits, travel, exploration, and recovery. Each activity needs prerequisites, duration, costs, risks, outcomes, and interruption rules.
- [ ] Define the world clock and calendar: date/year/season/day-cycle, time advancement, regional schedules, festivals, weather, travel duration, and how missed opportunities or deadlines resolve.
- [ ] Define NPC simulation: individual identities, schedules, needs/goals, relationship dimensions, trust/affinity/conflict, memory of player actions, availability, and deterministic offline behavior. Do not reduce every relationship to one global Bonds counter.
- [ ] Define education, vocation, social standing, reputation, household/clan/sect affiliations, and how these evolve without inventing canon institutions or rules.
- [ ] Define character status and progression: attributes, HP, energy, satiety, injury, cultivation, Martial Soul awakening, Spirit Rings, Thinker/Arcanistry progression, titles, achievements, and age-related transitions. Every mechanic must map to an approved source formula or a clearly labelled game-only rule.
- [ ] Define inventory, equipment, materials, structures/assets, wallet, prices, scarcity, trade, rewards, and an auditable transaction ledger. Canon currency and economy rules must be preserved.
- [ ] Define the world map and location model: settlements, districts, routes, travel modes, access requirements, regional hazards, points of interest, and encounter pools. Canon place data must be supplied by the approved Archive package.
- [ ] Define quests, errands, personal goals, timed opportunities, discoveries, and long-running story arcs with explicit states, prerequisites, failure/expiry behavior, and rewards.
- [ ] Define the event/choice engine: authored event schemas, conditional triggers, weighted/seeded selection, branching outcomes, consequence persistence, replay prevention, and deterministic save/replay behavior.
- [ ] Define encounters and combat as one part of life—not the entire game—including danger signalling, escape, injury/death rules, enemy intent, combat resolution, loot, and post-encounter recovery.
- [ ] Define the System/Chronicle UI as an original Merzkava interface: status, calendar, activity planner, relationships, quests, map, inventory, notifications, codex, and history. Each screen must read authoritative engine state rather than placeholder text.
- [ ] Define save architecture and migrations: versioned schema, save slots, atomic transactions, recovery after process death, deterministic seeds, event history, and isolation from Convo.
- [ ] Create a system dependency map and data ownership matrix before implementation; identify which system owns each field and which systems may request validated changes.
- [ ] Create a content matrix mapping every canon-backed record to an approved Archive dossier and pinned Universe source SHA; keep `CANON`, `CANON_ADAPTATION`, and `IN_GAME_ORIGINAL` distinct.
- [ ] Define progression pacing, economy balance, activity costs, age/time scale, difficulty, accessibility, and anti-softlock rules. Use test simulations rather than arbitrary hand-tuning.
- [ ] Break the GDD into implementable vertical slices with acceptance criteria, test coverage, UI states, offline behavior, and explicit dependencies.
- [ ] Approve the GDD and architecture baseline before large-scale content authoring or implementation. The former generated 240-node prologue is retired and removed from active runtime; it is not a prototype, sample, seed, or structural template for future narrative content. All replacement narrative work belongs to the context-aware Narrative Patch Engine in §5E and must follow its acceptance rules.

**Design-stage exit gate:** A reviewed GDD, gameplay loop, system/data dependency map, content provenance plan, save model, and vertical-slice backlog exist. No major system is considered designed merely because a screen or formula module exists.

### 5C. Offline gameplay concept

**Purpose:** Translate approved Merzkava material into a deterministic, replayable local life/adventure loop without changing canon.

- [ ] Choice-driven life simulation: character life stages, background, daily decisions, relationships, education/training, occupations/roles, resources, reputation, and long-term consequences, adapted to Merzkava canon.
- [ ] Year/season/day progression with events and meaningful decisions; define the time scale so it works with Merzkava's world rules.
- [ ] Provide the offline gameplay loop with event opportunities and player choices. The shared event/node schema, context-aware selection, narrative composition, hidden resolution, replay prevention, and patch packaging are specified and tracked only in §5E (Issue #3); do not create a parallel event engine or author replacement story nodes under this section.
- [~] Integrate the framed Scene Window with authoritative Eternal Path world state: persisted `locationId` selects the scene independently from dialogue metadata; the local world clock drives Dawn/Morning/Day/Dusk/Night lighting; deterministic regional weather changes by world day. The registry includes all 26 existing scenery PNGs across the three powers, Lawless Territories, and Special Locations. No legacy dialogue nodes remain active; the new Patch-1 narrative system is planned separately below. FX-01 cloud and FX-02 fog use isolated Screen-blended image layers; procedural sun/moon glow, light rays, rain/snow/seasonal particles, and lightning are mounted inside the clipped Scene Window and animated by Anime.js. Black-background `#000000` + `mix-blend-mode: screen` is the documented fallback when RGBA transparency cannot be generated. `advanceEternalWorldTime(minutes)` and `setEternalLocation(sceneId)` remain the state boundaries. Automated regression coverage has been expanded for the 26-scene registry and FX layer mounting; fresh CI and physical Android visual/performance verification remain pending. Character/status cards and full travel/activity systems remain open. See [Animation System](./offline-game/ANIMATION_SYSTEM.md) and [Scene FX Manifest](../public/game/scenery/ASSET_MANIFEST.md).
- [ ] Design a self-contained life/adventure loop: character status, daily life, exploration, encounters, progression, and consequences.
- [ ] Add a System layer inspired by Solo Leveling's presentation: status window, quests/objectives, attributes, titles/achievements, notifications, and progression feedback, using original Merzkava naming, art, lore, and mechanics.
- [ ] Connect life-simulation choices to the System layer without turning every action into combat or a generic level grind.
- [ ] Use deterministic local rules for rewards, combat, progression, time, inventory, and character state.
- [ ] Use only content approved for offline player access.
- [ ] Provide meaningful choices and consequences without requiring AI or network access.
- [ ] Define offline quests/events, encounter pools, and replayability.
- [ ] Define save slots/state boundaries and safe persistence.
- [~] Add clear mode identity so users know whether they are in connected AI gameplay or standalone offline gameplay; the first-pass Eternal Path route and screen label now exist, while the full mode-switch and save-boundary experience remains open.


### 5C-1. Offline Idle World — isometric world, simulation, and NPC behavior design

**Status:** Design recorded; detailed formulas, content tables, and implementation remain pending. This section records the current direction only. It does not authorize implementation or establish new Merzkava canon.

**Offline and simulation boundary**
- The Idle World is fully playable offline. It must not require an online service, server, AI agent, LLM, external API, or network connection for simulation, NPC decisions, timers, battles, economy, or save progression.
- Use the device's system clock to calculate elapsed time for local timers and offline progress. On return to the app, resolve elapsed construction, production, worker, and other scheduled jobs from persisted timestamps. Anti-cheat/time-tampering protection is explicitly out of scope for this design.
- NPC behavior is rule-based and locally computed. “Behavior engine” means deterministic game logic, not generative AI or an external intelligence service.

**World map and activity model**
- The world is an isometric 2D map built from structured, individually addressable world objects—not one flattened background image. Terrain, roads, buildings, facilities, resource nodes, and placed objects must be independently represented so they can be placed, moved, upgraded, damaged, removed, or animated where the rules allow.
- The map is the world overview and activity hub, not a free-roaming character-control game. The player pans/zooms and taps a location, building, facility, or resource node to open its dedicated activity screen. Tapping eligible empty land may open the construction flow.
**Arcanistry route-engine interaction checkpoint (2026-11-03):** The World Navigation scaffold now uses one unified rotary whose apertures are the destinations; there is no separate destination-index box. Each aperture is directly draggable around the dial toward a fixed activation mark. The rotor follows the pointer in either direction; surrounding apertures retract progressively while counter-rotating gears and fine red thread lines respond to the same drag progress. Releasing inside the alignment tolerance activates a mapped route: surrounding apertures close into the mechanism, the rotor returns to rest, then the scene transition begins. Releasing before alignment or cancelling the pointer returns the rotary and reopens the apertures without travel. This is a UI interaction implementation, not completion of the Idle World travel system. At this checkpoint only the Golden Dragon Empire Imperial Capital and Academy have destination scene bindings; all other route bindings and explicit exterior/interior arrival resolution remain pending. Android device gesture QA and build verification are still required.


- Connected Zones form the expansion model. Unlocking a Zone requires its defined conditions; unlocking it does not automatically construct or populate its facilities.
- Buildings and locations must have functional purposes and open the relevant activity layer. They are not decorative map props only. Activities may include gathering, processing, crafting, construction, production, training, study, trade, social activities, and encounters as each system is designed.
**Arcanistry route-engine interaction checkpoint (2026-11-03):** The World Navigation scaffold now uses one unified rotary whose apertures are the destinations; there is no separate destination-index box. Each aperture is directly draggable around the dial toward a fixed activation mark. The rotor follows the pointer in either direction; surrounding apertures retract progressively while counter-rotating gears and fine red thread lines respond to the same drag progress. Releasing inside the alignment tolerance activates a mapped route: surrounding apertures close into the mechanism, the rotor returns to rest, then the scene transition begins. Releasing before alignment or cancelling the pointer returns the rotary and reopens the apertures without travel. This is a UI interaction implementation, not completion of the Idle World travel system. At this checkpoint only the Golden Dragon Empire Imperial Capital and Academy have destination scene bindings; all other route bindings and explicit exterior/interior arrival resolution remain pending. Android device gesture QA and build verification are still required.

- Construction uses a defined blueprint, site/footprint and placement checks, prerequisites, required resources/tools/currency, duration, and completion state. Construction and production may progress while the app is closed, using the offline time model above.
- Keep the renderer and asset pipeline lightweight and compatible with the APK's size and target-device performance constraints. Do not introduce a heavyweight game engine or graphics dependency without a measured technical need.

**Shared Eternal Path economy and ownership**
- Idle World uses the existing Eternal Path character, inventory, item identities, quantities, wallet, and progression as one integrated state. It must not create a parallel wallet, duplicate item catalog, or separate copy of character progression.
- Item ownership, reservation, assignment, durability, and active use must be represented clearly. A tool or item cannot be simultaneously committed to incompatible jobs or activities.
- Resource costs, rewards, production outputs, and trade must pass through the shared transaction/state layer so quantities cannot be duplicated or silently desynchronized between the map and other Eternal Path activities.

**NPC and worker behavior framework**
- NPCs/workers are locally simulated entities with defined profession or role, skills, workplace/assignment, schedule, capacity, needs/upkeep where applicable, and current task/state. Examples such as woodcutter, miner, farmer, builder, blacksmith, and merchant are illustrative roles, not a finalized profession list.
- NPC behavior rules must be formulated from the NPC's **Spirit Realm** and, where applicable, **Arcanist Grade**, alongside relevant attributes, skills, Martial Soul/abilities, equipment, current HP/Energy/status, profession/specialization, activity type, and available resources.
- Spirit Realm and Arcanist Grade are independent progression dimensions, not one combined rank. Spirit Realm informs the NPC's cultivation/combat capability and the complexity of relevant martial or combat decisions. Arcanist Grade informs Arcanistry knowledge, technical capability, and decisions in activities that actually use Arcanistry. A high value in one dimension must not automatically imply a high value in the other.
- Arcanist Grade is applicable only where the NPC has an Arcanistry grade under the approved progression model. Do not fabricate a grade for an NPC who is not an Arcanist. Likewise, do not assume every NPC has awakened or entered a Spirit Realm; use the official progression state recorded for that character.
- Higher progression may unlock more capable rule sets—such as evaluating more conditions, prioritizing targets, choosing among valid skills, responding to status effects, managing Energy/resources, coordinating with allies, or selecting more advanced technical procedures—but must not grant hidden information, invalid actions, free resources, or outcomes outside the NPC's actual capabilities.
- Behavior is evaluated through explicit conditions, priorities, eligibility checks, and deterministic tie-break rules. The same saved state and inputs should produce the same NPC decision unless a separately approved game mechanic explicitly defines controlled randomness.
- The exact behavior matrix must be authored against the official Merzkava Spirit Realm and Arcanist Grade values after their source data and gameplay formulas are verified. Do not invent realm/grade names, thresholds, multipliers, or canon abilities in this planning section.

**Battle and activity layers**
- One configurable battle engine supports both Solo and Party encounters. The activity/location defines which format is allowed; Solo and Party must not become separate incompatible combat systems.
- Combat uses individual character Action Gauges and individual turns. Party members retain their own HP, Energy, attributes, skills, status effects, and gauge; turns are not grouped into one party-wide action.
- Player-controlled turns pause and wait for the player's selected action. No automatic action or turn resolution may occur while waiting for player input. If the app closes during this pause, restore the pending turn and its valid choices on return.
- NPC combatants use the same eligibility, gauge, cost, target, and resolution rules as the player. Their action selection is supplied by the rule-based NPC behavior framework above, informed by their Spirit Realm and applicable Arcanist Grade.
- Party size, reserve/bench rules, gauge formula, detailed damage/status formulas, turn tie-breaks, and activity-specific Solo/Party permissions remain undecided until separately specified. Earlier examples are proposals, not approved values.

**Design constraints and open decisions**
- Keep map rendering, activity screens, simulation, battle logic, inventory transactions, and save persistence in clear modules with explicit ownership boundaries.
- The map is a structured data model rendered in 2D; do not encode world state only in pixels or scenery assets.
- Detailed Zone roster, map scale/grid/footprints, construction catalog and durations, worker capacity/upkeep, exact NPC behavior matrix, battle formulas, party limits, and reserve rules remain open design work.
- Do not begin full Idle World implementation or mark this design complete until the shared-state contracts, official progression references, behavior matrix, map/object schema, offline-time rules, and activity/battle acceptance criteria have been reviewed.

**Isometric local-area presentation checkpoint (2026-11-05)**

This is a narrowly scoped presentation/navigation layer for the existing isometric area maps. It does **not** authorize the full Idle World simulation, define new canon, or replace the structured-world/object model above.

- [~] Every isometric area uses one shared upper-left archival glass HUD: 12-hour world time, day count, cycle symbol/label, and weather symbol/label. The save/world clock is authoritative; Anime.js only animates presentation.
- [~] On local-area entry, the destination view is mounted first, the existing world clock advances by three hours, and Anime.js animates the clock/cycle/weather transition. Opening the tool drawer or returning to a previous map does not advance time.
- [~] The compact minimap is restricted to outdoor wilderness and transit/field-route map IDs. Campus, town, city, market, harbor, arena, and interior maps retain the shared HUD without the minimap.
- [~] Tianhai Academy exterior consumes the owner-provided `AI_UPDATE_REFERENCE` as a one-time local seed: exact Map Base dimensions, 24×20 base grid, sparse custom cells, walkable whitelist, eight-sector flags, and four transition markers. The seed is not reapplied over subsequent local editor changes; `confirmed:false` remains unchanged until explicitly confirmed.
- [~] Academy entry places the Player at the named Golden Dragon Empire gateway (`12,31`). The four Academy NPCs begin on owner-marked walkable cells; Player pathfinding and NPC wandering use the same walkable whitelist and blocked-sector rules, and actors cannot occupy another actor's cell.
- [~] NPC conversations and `Dialog box:` map markers use a clickable lower-screen dialogue surface. `Event scene:` markers use a separate dimmed, clickable event notice.
- [~] Map zoom, centering, and editor tools share one right-edge field drawer. The drawer and arrival motions use Anime.js; editor controls remain separate from the future Player Profile, Inventory, Quest Board, and other player-facing world panels.
- [~] Map camera calibration now supports a tap-to-pick focal point with a separate confirmation step. The confirmed point is stored as Map Base coordinates in the editor JSON and reused by `CENTER MAP` after zoom/resize; automatic midpoint remains the fallback.
- [~] Walkable sector edges use half-edge semantics: one blocked child sector leaves the opposite half traversable, while both blocked halves close that crossing. Player/NPC sensing and movement highlights are actor-attached so camera movement cannot detach their visual origin; gameplay grid strokes remain thin and muted gold without changing tile geometry.
- [ ] Add reviewed map references and deliberate minimap classifications for the remaining isometric areas as their walkable routes and actor placements are supplied.
- [ ] Complete visual/gesture and time-transition verification on the target Android device. CI checks do not replace device QA.


### 5C-2. Illustrated item tiles, category frames, and permanent character emblems

**Scope clarification:** This item system belongs to the standalone Idle RPG / Offline Game only. The separate Convo experience does not impose its own content or catalog limits on Idle RPG. The expandable master checklist is maintained in [Idle RPG Master Item Candidate Checklist](./offline-game/IDLE_RPG_ITEM_CATALOG.md); it is intended to grow to thousands of individually reviewed entries with explicit provenance.

**Status:** Visual/content-system direction recorded; asset inventory, item catalog, frame artwork, and implementation remain TODO. This section defines the intended presentation, not a claim that all item records or illustrations already exist.

**Core presentation rule**
- Every carried, collectible, stackable, usable, equipable, craftable, tradable, reward, or loot item must have an illustrated item tile. The tile displays the item's actual image/artwork inside its frame; a text-only row, generic emoji, or unillustrated placeholder is not the intended final presentation.
- Standard item tiles use a compact, near-square silhouette inspired by the face buttons on a PlayStation controller. Keep a consistent tile footprint and image area so categories form a readable inventory grid.
- Each item family receives its own recognizable frame treatment. Category identity may use distinct border geometry, engraved motifs, corner details, material texture, and restrained color accents; do not rely on color alone.
- Permanent character-bound attachments/progression emblems use an octagonal frame at the same approximate outer dimensions as a standard square tile. Spirit Rings are the primary example: show each absorbed ring in its own octagonal slot/emblem in the character status/profile presentation. The octagon communicates a different state from ordinary carried inventory; it is not a second inventory copy.
- The octagonal treatment is for things that are genuinely bound to, absorbed by, or permanently represented as part of the character's status under the approved rules. Do not put ordinary equipment, temporary buffs, Arcanist tools, or merely owned artifacts into permanent slots. Martial Soul/status representation may use this visual family only where it represents an established permanent character state, not as a tradable item.
- Arcanist Grade, Arcanist Focus, Spirit Realm, and other numeric/progression values remain status data, not collectible item cards. Their associated physical tools, materials, books, patterns, formulations, and artifacts are ordinary illustrated item records unless an official rule makes a specific object permanently character-bound.

**Item-frame families to design**
- **Natural resources and gathered goods:** fish, meat, herbs, plants, wood, stone, ores, minerals, hides, fibers, shells, and other source-verified natural materials.
- **Processed and crafting materials:** refined metals, cut stone, boards, ingots, textiles, components, energy-bearing materials, and other documented or approved game-only processing outputs.
- **Food, ingredients, and cooking results:** raw ingredients, prepared meals, preserved food, drinks, and cooking outputs. Keep raw ingredients visually distinct from ready-to-consume food where useful.
- **Medicine and recovery supplies:** herbs and ingredients, medicines, treatment supplies, antidotes, and other supported consumables. Do not imply an item has a medical effect unless its source or approved game rule establishes it.
- **Tools and utility equipment:** gathering tools, mining/woodcutting tools, repair tools, containers, field equipment, and specialist implements.
- **Weapons:** each weapon type and meaningful variant has its own illustration and category frame; equipment state is represented through the shared inventory/equipment data.
- **Armor, clothing, and wearable equipment:** armor pieces, robes, everyday clothing, footwear, gloves, headwear, accessories, and other wearable items. Clothing and protective armor may share a broad equipment family but must remain distinguishable.
- **Books, documents, and learning objects:** books, manuals, records, maps, scrolls, study materials, and approved Arcanistry learning resources.
- **Arcanistry tools and workshop objects:** Engraver's Apprentice, Formation Engraver, forger tools, apparatus, measuring instruments, workbench components, and other source-supported specialist equipment. Exact names, ownership gates, functions, and grade requirements must follow the official Arcanistry source.
- **Arcanistry materials, patterns, and formulations:** suitable metals, stone and special materials, base materials, formation patterns, formulation records, and processed outputs. Separate physical objects from knowledge/blueprint records; a learned formula is not automatically a consumable inventory item.
- **Artifacts and relics:** keep Relic, Ancient Artifact, and Artificial Artifact origin families visually distinguishable, with individual item identity, provenance, condition, ownership, and known function. Unknown or undiscovered properties remain unknown; never invent a gallery of canon artifacts.
- **Spirit Beast drops and encounter loot:** verified hides, parts, materials, and other actual drops. A drop is not guaranteed merely because a creature exists; record the real source and event. Never treat people or lineages as collectible loot.
- **Quest, key, and special-purpose objects:** keys, tokens, mission objects, evidence, sealed packages, and other supported unique items. Their frame should communicate special purpose without falsely implying rarity or power.
- **Currency:** keep the official wallet and denomination presentation authoritative. Coins may have their own small visual denomination symbols in the wallet; do not duplicate currency as ordinary crafting inventory or misclassify Zun Jade/Ancient Zun as crafting materials or artifacts.
- **Spirit Rings:** use the permanent octagonal character-status frame after successful absorption. A ring that is merely available, carried/stored in a valid stasis state, or awaiting absorption remains a distinct unabsorbed item/state and must not be displayed as permanently attached.
- **Other permanent character-bound records:** reserve octagonal slots for additional categories only when official rules confirm they become part of the character's permanent status. Do not pre-allocate invented slot types.

**World objects excluded from item tiles**
- Buildings, houses, workshops, facilities, roads, bridges, wells, farms, mines, resource nodes, terrain pieces, map decorations, large trees, and other placeable/world-scale objects are rendered as separate map objects with their own isometric sprites, footprints, interaction zones, construction/ownership state, and upgrade/damage state where supported.
- A building's blueprint, construction material, tool requirement, or building component may still appear as an ordinary item tile when it is a carried/consumed/owned inventory record. The completed building itself remains a world Asset/map object, not an inventory icon.
- Distinguish a harvestable resource node on the map from the gathered item produced by it: the node is a map object; harvested fish, wood, stone, ore, or other output is an illustrated inventory item.

**Image and catalog requirements**
- Build an item master catalog from the official Universe source material, the approved World Archive content, and explicitly labelled Eternal Path-only records. The World Archive is a lore/reference layer, not the authority for gameplay formulas or hidden/restricted facts.
- For every record, track stable item ID, display name, category/subcategory, source/provenance (CANON, CANON_ADAPTATION, or IN_GAME_ORIGINAL), source dossier/path and source commit where applicable, visibility/discovery state, image asset, stackability, ownership/location, condition/durability if relevant, and supported gameplay uses.
- Canon items must not be fabricated from generic genre expectations. The current canon artifact catalogue is intentionally sparse; only individually established artifacts may be represented as canon entries. Unknown objects retain the prescribed Unknown label and unknown properties until properly identified/appraised.
- Create original 2D item artwork for every released catalog entry, designed to read clearly at small mobile sizes. Use category-consistent lighting, perspective, silhouette, scale, and transparent/clean backgrounds as appropriate. Do not reuse World Archive scenery images as item icons and do not copy protected game assets.
- Use lightweight, reusable frame components and sprite assets. The item image is the main focus; the frame supports category recognition and rarity/condition metadata without obscuring the object.
- Inventory, storage, loot/reward screens, crafting inputs/outputs, equipment slots, trade, and item detail views must all reference the same item ID and image asset. No duplicate visual-only item records or parallel inventories.
- Include states for unknown/unidentified, undiscovered, locked, unavailable, equipped, reserved for a job, damaged, consumed, and permanently attached where relevant. A frame must not reveal hidden identity/function before the character legitimately discovers it.

**Acceptance gate**
- Approve the category taxonomy and square/octagon frame grammar.
- Complete the source-backed item candidate register and visibility/provenance review before bulk illustration.
- Verify that every released item record resolves to a unique, legible illustration and the correct category frame at target Android sizes.
- Verify that absorbed Spirit Rings appear only in the permanent octagonal status slots and are not duplicated as carried inventory; unabsorbed rings remain in their actual current state.
- Verify map buildings/world objects remain separate from carried inventory while construction materials and portable tools remain item tiles.
- Verify all screens share one item identity, image, ownership, quantity, and condition state; no UI layer invents or duplicates item records.
- Preserve APK size, memory, touch responsiveness, and scroll performance; do not add a heavyweight asset/rendering dependency without measured justification.

### 5D. Offline reliability and QA

**Purpose:** Prove Offline Game is genuinely standalone inside the shared APK and cannot contaminate connected Convo context, sessions, or saves.

- [ ] Test cold launch with airplane mode enabled.
- [ ] Test full gameplay loop without network or login.
- [ ] Test app restart and save recovery while offline.
- [ ] Test switching between Offline Game and connected Convo without merging their state/context.
- [ ] Test missing/outdated World Archive package behavior and version pinning.
- [ ] Test that Offline Game rewards/state cannot be misrepresented as connected Convo canon events unless an explicit, approved import/export rule exists.
- [ ] Measure storage, memory, battery, and performance on target Android hardware.

**Exit gate:** Offline Game can be played end-to-end without internet/login, consumes only its approved versioned World Archive package, saves safely, and remains isolated from connected Convo context and state. Both modes remain discoverable and usable within the same APK.

### 5E. Context-aware Narrative Patch Engine — IN PROGRESS

**Status:** `[~] ENGINE BOOTSTRAP VERTICAL SLICE IMPLEMENTED; PATCH 1 AUTHORING TODO.`

**Single source of truth:** This section owns the replacement narrative engine and all versioned story patches. §5B supplies the overall game-design constraints; §5C consumes the resulting event opportunities in the offline gameplay loop; EP-2 supplies authoritative simulation state and validated state-change boundaries; EP-3 owns narrative/social engine implementation. Do not create a competing node system, duplicate event schema, or parallel story backlog elsewhere.

**Execution order:** (1) finish and verify the shared toolbar/menu and active UI repair; (2) establish the required EP-2 simulation-state contracts; (3) implement and test the EP-3 narrative/social engine and its schema/resolver; (4) only then author and validate Patch 1 content. A separate nine-situation bootstrap slice now validates the schema/resolver and gives each starting region three playable situations. It is not Patch 1, does not count toward the 1,000-situation target, and must not be expanded into bulk content until the UI repair and EP-2 contracts are verified. **Tracking:** [Issue #3](https://github.com/Antarezka/merzkava-apk/issues/3).

**Retirement rule:** The generated 240-entry 0.1.0 sequence is deleted from the active content pack/runtime and is not part of the current source tree. Keep only the small compatibility/rejection boundary needed to prevent old numeric choices from mutating saves, plus a regression test proving the retired sequence cannot load. Do not restore, recycle, lightly rewrite, or use it as the structural template for Patch 1.

**Patch-1 minimum content target:** At least **1,000 genuinely distinct narrative situations/states** in the first patch. The count must represent meaningful differences in context, actors, stakes, triggers, available knowledge, and possible consequences—not combinatorial permutations that merely swap names, scene labels, or generic sentences.

- [~] Versioned node schema and bootstrap patch manifest exist with stable IDs, provenance, eligibility fields, deterministic selection and schema-v4 save migration; full source-reference and patch rollback compatibility remain open.
- [~] Resolver currently reads save-local character, starting region/current location, age, local clock/day-cycle, weather, disposition and event history. Relationship, inventory/resource and current-activity contracts remain blocked on broader EP-2 state work. Convo remains isolated.
- [~] Bootstrap taxonomy currently covers ordinary-life, social and discovery situations across all three starting powers; travel, work/study, investigation, conflict, emergencies and faction/community categories remain to be authored.
- [~] The nine starter situations define participants, actor knowledge, observable behavior, uncertainty, stakes, constraints and choice branches; full content coverage and review remain open.
- [x] Runtime composition renders Setting/Atmosphere → Scene Action → observable Character Behavior → Dialogue → contextual perspective question.
- [x] Starter Scene Action uses six readable lines per situation; future authored scenes must remain event-proportional rather than padded.
- [x] Starter closing questions are situation-specific and invite reasoning from the character’s perspective.
- [x] Player choices hide outcome text and mechanical deltas until after validated resolution.
- [x] Narrative remains in the independent reading column below the Scene Window.
- [ ] Validate at least 1,000 materially distinct Patch-1 situations with coverage, duplicate/near-duplicate and human quality review. The nine bootstrap situations do not count. The retired 240-entry sequence is not retained as active content and must not be restored.
- [~] Deterministic selection, no-repeat history, transaction IDs, single-save resolution and starter tests are implemented; full save/reload, patch migration and SQLite transaction QA remain open.
- [~] Bootstrap patch has its own manifest and provenance; release QA, rollback compatibility and final patch packaging remain open.

**Exit gate:** Patch 1 is not approved until it contains at least 1,000 materially distinct situations, passes context/duplication review, integrates with Eternal Path state without touching Convo, and produces situation-aware narrative and reflective closing questions.

---

## 8. Workstream 7 — App performance, responsiveness, and resource efficiency

**Progress now:** `[?] BASELINE NOT MEASURED`. Performance optimization is an app-wide workstream. No speed or memory improvement may be claimed without a before/after measurement on a named build and device profile.

**Goal:** Keep the app responsive on supported Android hardware, including lower-memory devices, while preserving the approved visual design, Eternal Path scene-window quality, Floating Control behavior, and offline reliability.

### 7A. Performance baseline and profiling

- [ ] Record baseline cold-start, warm-start, route-transition, input-response, and long-screen scroll timings.
- [ ] Measure JavaScript heap, WebView memory, image memory, SQLite query latency, CPU use, battery impact, and APK/download size where tooling permits.
- [ ] Profile on a representative low-memory Android device and a modern Android emulator; record OS, device class, build SHA, and test conditions.
- [ ] Identify the largest contributors before optimizing: bundle chunks, synchronous work, repeated DOM rendering, expensive selectors/layout, image decode, animation, and database access.
- [ ] Establish budgets and regression thresholds for startup, route changes, memory, image assets, and interaction latency.

### 7B. Rendering, navigation, and animation

- [ ] Audit full-root `innerHTML` rerenders and avoid rebuilding unaffected UI where practical; preserve user input, focus, scroll, and navigation state.
- [ ] Ensure fixed controls (bottom navigation, Floating Control, overlays) are not transformed or clipped by animated ancestors.
- [ ] Keep animations scoped to the component that owns them; clean up Anime.js timelines/listeners on route exit and honor reduced motion.
- [ ] Prefer transform/opacity animation over layout-triggering properties; avoid simultaneous heavy effects on low-end devices.
- [ ] Use route-appropriate lazy mounting for expensive Archive, Convo, and Eternal Path modules without delaying essential first interaction.

### 7C. Assets, storage, and data work

- [ ] Audit scene art, fog textures, mascot layers, fonts, and Archive imagery for dimensions, formats, compression, duplicate downloads, and decode cost.
- [ ] Add responsive image sizing and safe fallbacks; avoid decoding large assets before their screen is needed.
- [ ] Audit SQLite/local storage access for repeated reads, unbounded histories, large JSON payloads, and non-atomic writes.
- [ ] Add bounded caches and invalidation rules only where measurements show benefit; do not cache stale canon or authoritative game state unsafely.
- [ ] Keep offline startup and gameplay functional when network requests fail or are unavailable.

### 7D. Verification and release gate

- [ ] Add repeatable performance smoke tests for startup, route switching, horizontal navigation, Eternal Path scene rendering, and long Archive pages.
- [ ] Run regression tests after optimizations to confirm navigation, Convo, Archive, Eternal Path, scene-window FX-02, and Floating Control still work.
- [ ] Record before/after metrics and the exact build SHA; reject optimizations that improve one screen by materially degrading another.
- [ ] Verify no memory leaks from repeated route changes, animation mounts, event listeners, or image-heavy screens.
- [ ] Complete physical-device profiling before describing the app as optimized.

**Exit gate:** Performance budgets are defined, representative device measurements meet them, route/animation cleanup is verified, and no existing core feature regresses.

---

## 9. Workstream 6 — Future expansion backlog

**Progress now:** `[x] PLACEHOLDER ESTABLISHED`. No specific feature is approved yet; future ideas must be scoped before being promoted into implementation.

This section is intentionally an open slot for ideas not yet specified. New proposals go here first, then receive scope, dependencies, priority, and acceptance criteria before implementation.

- [ ] **XXXX / Future feature placeholder** — awaiting product direction.
- [ ] Add future feature proposals with: user problem, expected behavior, affected screens, canon dependency, online/offline behavior, data impact, priority, and verification plan.
- [ ] Promote an item into Workstreams 1–5 only after its scope and dependencies are understood.

---

## 10. Existing feature register

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

## 11. Suggested implementation order and release gates

The workstreams describe product scope; this sequence describes safe delivery order. Priorities may be adjusted when the audit finds a critical defect.

1. **Roadmap and architecture lock:** document the one-app / two-mode / shared-Archive architecture, link it from project entry points, and verify all source, context, and save boundaries.
2. **Existing-feature audit:** inventory screens and controls; fix route/navigation defects before adding more surface area.
3. **World Archive:** content review, offline navigation/search, then typography and visual refinement.
4. **UI feature expansion:** faction cards/buttons and shared glass/art interaction system.
5. **App services:** canon review first, then daily check-in and validated reward transactions.
6. **Eternal Path design:** complete and review the dedicated GDD, gameplay loop, system/data dependency map, content package plan, and vertical-slice backlog before major gameplay implementation.
7. **Eternal Path implementation:** integrate mechanics into the life-simulation loop, then add events, relationships, RPG/cultivation, exploration, quests, and progression in tested slices.
8. **Performance and reliability:** profile the app on representative Android hardware, optimize measured bottlenecks, and run regression/offline/device QA.
9. **Future expansion:** prioritize new proposals through Workstream 6.

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

## 12. How to read this roadmap and follow implementation

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

## 13. Verified project baseline — 2026-11-01

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


---

## 13. Approved Eternal Path expansion — implementation directive (2026-11-02)

The complete user-approved design and phase backlog now live in [ETERNAL_PATH_BLUEPRINT.md](./offline-game/ETERNAL_PATH_BLUEPRINT.md). This is part of the single master roadmap, not a competing roadmap. The earlier 5B design-only restriction is superseded: implementation is authorized to begin immediately in dependency-safe vertical slices while the blueprint remains the acceptance reference.

**Scope:** open-ended ordinary life; optional Spirit Realm, Spirit Ring and Arcanistry paths; hybrid progression; collections and appraisal; property and territory (ownership/lease/claim/administration/influence/occupation kept distinct); player-created clans, sects, circles, parties, guilds and trade organizations; family/children/legacy; save-local naming dialogs; isolated save slots and export/import; hidden multi-axis disposition; NPC relationships/Social Links; composable sensory narrative and hidden deterministic consequences; canon provenance and read-only World Archive.

**UI commitment:** compact one-line title; scene moved upward without reducing its image area; compact profile; derived disposition above the dominant narrative panel; modal choices that lock other game controls; remove obsolete Home feature cards; centered ornamental toolbar with Android safe margins and stable positioning across routes. Scene fog remains inside the existing glass window.

**Phase order:** EP-0 audit/UI foundation → EP-1 save/data foundation → EP-2 deterministic simulation kernel → EP-3 narrative/social simulation → EP-4 life/ambition/ownership → EP-5 world content/progression breadth → EP-6 performance/accessibility/release. Each phase requires tests and evidence; mockups and schema-only placeholders are not completion.

**Non-negotiable boundaries:** player-created names/entities and all journey outcomes are NON-CANON and save-local; World Archive and official Universe data are read-only. Preserve canonical character-profile fields and do not add Disposition to the Universe template. Choices never reveal predicted consequences or internal alignment values. Ordinary life must be a complete viable path, not a waiting room for cultivation.

**Optimization:** indexed event selection; bounded active-NPC simulation; one world clock; deterministic off-screen advancement; transactional deltas plus snapshots; lazy-loaded deep screens; UI/view-model separation; no per-frame world simulation. Do not claim optimized until target-device profiling exists.


### 13K. Implementation checkpoint — EP-0 UI foundation and disposition baseline (2026-11-02)

**Implemented on feature/archive-experience:**
- Added this approved blueprint and linked it from the single master roadmap.
- Reworked Eternal Path screen hierarchy: compact one-line title; existing scene window remains the same image size and appears immediately below the title; compact character panel; canonical status placeholders for Spirit Realm, Martial Soul, Spirit Ring, Sync progress, Arcanist Grade/Focus, HP and Satiety; narrative-first scene/action/NPC structure.
- Removed the four former Home feature cards from the Eternal Path renderer.
- Moved choices into a separate modal. Choices show only their action labels; response/outcome text is not exposed as a preview. While open, delegated app clicks outside the modal are blocked, keyboard focus is trapped, Escape closes it, and browser history is used so Android system Back can dismiss it.
- Added a hidden multi-axis disposition foundation with bounded internal axes, derived public alignment labels, Lawfulness bands and a three-evidence hysteresis gate. Added save schema v2 migration so existing v1 journeys receive a neutral baseline without losing their existing state.
- Refined the shared bottom navigation rail to be narrower, centered, ornamental and inset from Android gesture edges. Adjusted screen entrance motion so the Eternal Path modal remains viewport-fixed instead of being trapped by a transformed screen parent.
- Added disposition unit tests. Existing Eternal Path scene tests remain relevant; the test suite and production build still need execution against the resulting branch head.

**Key implementation files:** `src/offline-game/expedition-interface.ts`, `src/offline-game/expedition-interface.css`, `src/offline-game/disposition.ts`, `src/offline-game/expedition-game.ts`, `src/main.ts`, `src/style.css`, `src/ui/app-shell-motion.ts`, `tests/offline-game-disposition.test.ts`.

**Verification:** GitHub writes completed on the feature branch. This environment could not run npm locally because the GitHub host was unreachable from the container; the available commit-status query returned no status records, so no CI pass is claimed. Physical Android visual QA, safe-area/edge-gesture QA, modal touch/scroll QA, and APK rebuild remain pending.

**Not yet implemented:** multi-slot save manager and export/import; activity/world simulation; NPC schedules and relationship graph; Social Link progression; choice consequence tagging and atomic transactions; full sensory content authoring; ordinary-life activity catalogue; property/territory ownership/control; organizations; family/children/naming dialogs; complete Spirit Realm/Arcanistry path integration. These remain EP-1 through EP-6 work, not completed features.



### 13M. Eternal Path implementation update — EP-1 save library and Anime.js (2026-11-02)

- Save schema v3 now supports multiple isolated local journeys, legacy migration, load/unload, rename, single-slot delete, JSON export and validated import. Journey Manager UI is wired to these operations.
- Anime.js now drives Eternal Path scene drift, fog/light/weather atmosphere, profile and narrative reveals, choice modal transitions, manager panels, app-screen entrances, toolbar movement and button micro-interactions. Reduced-motion is respected and scene animation scope is disposed on rerender.
- Current save-slot storage is a versioned local-storage bridge, not final SQLite. SQLite transactions/manifests, complete state migration, ordinary-life simulation, NPC/social systems, ownership/family and integrated progression remain upcoming.
- CI and physical Android QA must pass before this slice is called verified. No new APK is claimed.

---

## 14. Execution log — 2026-11-02

- **EP-0 implementation slice:** compact single-line Eternal Path heading, scene-first layout, compact character summary, save-local disposition line, narrative hierarchy, choice modal, focus trap, Escape/Android Back close handling, click/navigation lock, and centered ornamental toolbar are present in the active branch. The toolbar's final CSS correction restores horizontal scrolling so every destination remains reachable while preserving gesture-safe margins.
- **EP-1 groundwork:** schema-v3 journey records include a per-save ID, canon/content package manifest, deterministic seed, disposition state, location, world clock, and separate save slots. Journey create/load/rename/delete/export/import controls are present. This is still a localStorage bridge, not the final transactional SQLite store; atomic crash recovery and robust storage quota handling remain open.
- **Disposition foundation:** seven hidden axes, public derived label, internal Lawfulness bands and evidence-window transition logic exist. The initial Lawfulness band mismatch was corrected. Choice outcomes are not yet wired to evidence-based disposition updates; do not imply that the alignment system is already gameplay-complete.
- **Force-close regression:** added tests/offline-game-force-close.test.ts, which simulates a process restart by discarding/re-importing the game module while retaining persistent localStorage, then checks recovery of the active save, latest choice and multiple save slots. This is a regression test, not a physical-device force-stop result.
- **Validation state:** the current PR head has no reported combined commit statuses at the time of this update. The new force-close test and latest UI changes still require a fresh CI run. No local Android force-stop, emulator pass, APK build, or physical-device QA is claimed.
- **Next:** run fresh CI; resolve every failure; inspect the built UI at narrow Android dimensions; then move to EP-1 transactional storage and EP-2 simulation integration. Keep SQLite migration behind a storage-adapter contract so UI/game systems do not depend directly on the database vendor.


### 13K. Implementation journal — Android force-close investigation (2026-11-02)

- **Found and fixed a high-risk lifecycle leak:** `mountExpeditionAnimations()` was called whenever Eternal Path rendered, but its returned cleanup function was not invoked before the previous screen DOM was replaced. Scene loops and pointer listeners could therefore remain attached to detached elements across route changes and repeated interactions, increasing WebView CPU/memory pressure and potentially contributing to force-closes on lower-memory Android devices.
- **Fix:** `src/main.ts` now invokes and clears `cleanupExpeditionAnimations` at the beginning of every render, before replacing the old DOM. The cleanup reverts the Anime.js scope and removes the registered pointer listeners. This is a plausible contributing cause, **not yet a confirmed diagnosis of the user's device crash**.
- **Quality gate:** added `.github/workflows/eternal-path-quality.yml` for TypeScript, unit tests and production web build on the active branch/PR. The GitHub status query has not yet returned a completed run; do not claim CI passed.
- **Still required:** install/run the resulting APK on the target Android device, reproduce the exact force-close path, and inspect Android/Capacitor native logs if the crash persists. A native process crash cannot be diagnosed conclusively from the web source alone.
### 13N. Scene registry and Anime.js FX completion pass (2026-11-02)

- Registered all 26 existing scenery PNGs in `ETERNAL_SCENES`, including the three major powers, Lawless Territories, and Special Locations. Lawless/special records remain broad visual groups with explicit unverified Archive provenance; they are not promoted to new starting regions or treated as confirmed settlement canon.
- Kept authored dialogue intentionally scoped to the original eight compositions (240 nodes). New scenery availability does not silently generate unsupported canon/location dialogue.
- Mounted FX-01 clouds and retained FX-02 fog as isolated Screen-blended layers inside the Scene Window. Added procedural sun/moon glow, light rays, rain/snow particles, Dawn petals, Dusk leaves, and rain lightning. Anime.js remains the motion engine; CSS supplies compositing and visual surfaces.
- Recorded the black-background PNG workflow: pure `#000000` plate + `mix-blend-mode: screen` inside `.expedition-environment`. This is the preferred fallback when Gemini cannot produce reliable alpha transparency.
- Source-level regression assertions cover the 26-item scenery registry and the Scene Window FX mount points. CI, rendered visual inspection, performance profiling, reduced-motion QA, and physical Android verification remain open; no APK/device pass is claimed.

## 15. Active UI repair — Eternal Path scene and navigation (2026-11-02)

**Tracking document:** [UI Repair Checklist](./offline-game/UI_REPAIR_CHECKLIST.md).  
**Tracked issue:** [#2 — Eternal Path toolbar drift and scene/narrative layout refinement](https://github.com/Antarezka/merzkava-apk/issues/2).

**Implementation checkpoint (2026-11-02):** The code-level clockwork dock, four-item manual roulette viewport, nominal 32px safe margins, per-item rotary controls, Anime.js inner-wrapper motion, active-journey scene/narrative ordering, independent narrative scroll viewport, compact ink-brush clock, and hidden Save Manager overlay are present. Save Manager now has an accessible dialog label, dismissible backdrop, Escape/Android Back handling, and keyboard focus containment. These are implementation facts, **not physical-device verification**. The toolbar drift report remains open until reproduced/cleared on the target Android device.

- [x] **UI-EP-002 implementation:** Retractable Victorian clockwork dock with raised crown, curved shoulders, verdigris enamel, brass detailing, side cables/pulleys, function-specific emblems, independent rotary rings, and retained Anime.js + manual roulette behavior. CSS reserves 32px nominal breathing room per side plus safe-area insets; verify actual gesture zones on device.
- [x] **UI-EP-003 implementation:** Active journeys show only a small Save Manager trigger. The manager opens as a floating overlay with close control, backdrop dismissal, preserved save operations, Escape/Android Back handling, and keyboard focus containment. No-active-journey create/restore remains discoverable.
- [x] **UI-EP-004/005 implementation:** Narrative sits directly beneath the weather Scene Window/disposition line with its own vertical scroll viewport; scene FX remain clipped to the glass. The world clock uses a compact translucent ink-brush backing with a tapered tail.
- [~] **UI-EP-006 implementation:** The legacy 240-node sequence remains retired; the narrative surface stays in Patch-1 planning state. Layout hierarchy and scroll containment are in place; replacement narrative authoring remains prohibited until §5E gates are met.
- [~] **Regression verification:** Render-contract tests cover the Save Manager's hidden state and accessible dialog/backdrop markup. Broader interaction, route-switch, narrow-screen, reduced-motion, and focus tests remain.
- [ ] **Release verification:** TypeScript, full test suite, production build, Web App Validation, and Android APK workflow must pass on the same final commit. Install and inspect on target Android hardware; attach evidence for fixed toolbar anchoring, four visible items, manual roulette, drag-vs-tap, Android edge gestures, Save Manager, scene/narrative layout, clock, and weather clipping before closing Issue #2.

**Gate:** Do not mark this workstream fully complete or begin Patch-1 story-node authoring until code verification and target-device UI/gesture QA are complete.



## 5F. Goal-directed narrative network and long-term item catalog

**Status:** `[ ] TODO — TARGETS APPROVED; IMPLEMENTATION DEFERRED TO EXISTING DEPENDENCY ORDER.`

This section extends §5E without replacing its engine, schema, sequencing, or release gates. It does not authorize premature bulk authoring or Shop implementation.

### 5F-1. Goal-directed 1,000-node network

- [ ] Use the player goals and gameplay loops already defined in the approved Eternal Path plan as the organizing spine for narrative content. Collection is one explicit example; expand toward the other existing goals rather than inventing a separate goal taxonomy.
- [ ] Build Patch 1 as a connected network of at least **1,000 genuinely distinct nodes/situations**. Nodes must branch into meaningful routes, prerequisites, setbacks, opportunities, discoveries, and follow-up situations that help the player pursue or experience those existing goals.
- [ ] Do not count isolated filler scenes, text permutations, swapped names/locations, cosmetic reward changes, or duplicate outcomes as distinct nodes.
- [ ] Every node is non-canonical and anchored to at least one reviewed, player-safe World Archive dossier. The Archive supplies context and lore boundaries; it does not canonize the authored scenario.
- [ ] Preserve existing node labels/categories and provenance rules. Every node-content update adds at least **two distinct nodes**. The nine-node bootstrap remains a schema/resolver validation sample and does not count toward Patch 1's 1,000-node target.
- [ ] Keep Patch-1 authoring blocked until the §5E execution prerequisites are verified: UI/repair gate, EP-2 simulation-state contracts, and EP-3 narrative/social engine/schema/resolver.

### 5F-2. Item catalog: 25,000 total / 10,000 functional minimum

- [ ] Establish a long-term target of **25,000 distinct item records** in the final catalog.
- [ ] Ensure at least **10,000 items have genuine, testable gameplay functionality**. Each must have a defined purpose/effect or valid use in an implemented gameplay loop. Flavor-only entries, duplicate variants, and inert placeholders do not count toward this minimum.
- [ ] Ensure every item is compatible with the world constraints and plausibly eligible to exist in Merzkava Universe. Use reviewed, player-safe World Archive dossiers as contextual anchors; do not contradict canon or fabricate official facts.
- [ ] Preserve item provenance: canon-backed items require exact reviewed source references; game-only items use `IN_GAME_ORIGINAL` and remain explicitly Eternal Path-only. Archive anchoring is not proof of canon status.
- [ ] Track distinct IDs, functional status, gameplay behavior/tests, provenance, Archive anchors, and duplicate/near-duplicate review. Never claim progress from generated names or unreviewed placeholders.

### 5F-3. Shop — explicitly deferred

- [ ] Shop is a future feature and must not be implemented until the owner explicitly signals readiness. Do not add Shop UI, vendor stock, purchase transactions, or shop-specific economy balancing before that authorization.
- [ ] Item catalog design and deterministic item functionality may be prepared independently when their dependencies are ready. Do not expose purchase/spending flows as a Shop prematurely.

**Acceptance gate:** the node network demonstrably branches toward existing player goals; all nodes are non-canonical and Archive-anchored; every node batch adds at least two; the 1,000-node count passes distinctness and quality review; and the final item catalog reaches 25,000 distinct entries with at least 10,000 verified functional items. Shop remains unimplemented until separately authorized.

## Mandatory node expansion policy — World Archive anchored, non-canonical

This policy is a hard acceptance gate for all Eternal Path narrative-node work:

1. **World Archive is the required anchor for every node.** Each node must be built around at least one reviewed, player-safe Archive dossier and use it as the setting/context/lore boundary. A node without an Archive anchor is invalid.
2. **All nodes are non-canonical gameplay scenarios.** Nodes may use canon-backed references, but their authored scene, dialogue, choices, and consequences do not create, amend, or imply new official Universe facts.
3. **Keep the existing labels and categories** already defined by the content plan and provenance contract. Do not collapse or rename them to represent Archive anchoring; anchoring and provenance are separate dimensions.
4. **Minimum batch size: two new distinct nodes per node-content update.** A change that adds only one node fails acceptance. The previous nine-node starter slice remains the baseline and is not a substitute for the two-node minimum on subsequent updates.
5. Before accepting an update, verify the node count delta, distinctness, Archive dossier anchors, non-canonical framing, provenance labels, and that no game-only text has been promoted into World Archive or Universe canon.

The nine-node starter slice spans Golden Dragon Empire, Tianhai Yunzhou, and Beiming Gu (three each). Future updates retain the planned labels/categories and should continue to use the Archive as the organizing spine rather than treating the three powers as disconnected lore sources.


## 15. Isometric field, actor interaction and access-gate handoff — 2026-11-05

Current source baseline for this workstream: ed5ef007cead9ecf8e6e70662c29ec5cce9527b0. This is a shared system used by all isometric maps, not an Academy-only implementation. Detailed contracts are in [ISOMETRIC_FIELD_SYSTEM.md](./offline-game/ISOMETRIC_FIELD_SYSTEM.md), [APP_ACCESS_AND_NAVIGATION.md](./APP_ACCESS_AND_NAVIGATION.md), and [AI_HANDOFF_2026-11-05.md](./AI_HANDOFF_2026-11-05.md).

- [x] Record shared map JSON, eight-sector markings, Academy reference/seed, walkability whitelist and movement rules.
- [x] Gate developer-only Floating Control, Convo/Supabase/canon surfaces and map editors behind explicit local Developer Mode; document client-side verifier limitation.
- [x] Add compact scrollable floating field-tool window with drag/resize, Anime.js open/close, minimize-with-editor-active, restore and X/lever exit wiring. Device touch QA remains required.
- [x] Add a lighter normal-play grid distinct from the stronger editor grid.
- [x] Add Anime.js post-step tile waves and two-ring actor sonar. Status tone is explicit metadata: friendly blue, hostile red, Spirit Realm expert black, unknown white. Current Academy student/staff seeds are friendly; other actors remain unknown until classified.
- [x] Add board sensor events merzkava:field-scanner-overlap and merzkava:field-scanner-clear. They do not start chase/battle or mutate game state.
- [x] Preserve Player BFS, walkable whitelist, blocked-sector edges, NPC wandering/occupancy checks, and the bottom scripted NPC chat panel.
- [x] Add external TV World Atlas login gate: verified player registry ∩ local save; local salted password signup/login, Remember Me, eight-language copy and inert/blurred modal. Internal in-world Atlas open bypass remains separate.
- [x] Add localized Home exit confirmation, JS screen history, Android Back event bridge and native exit action. Android/physical gesture proof remains a build/device gate.
- [x] Add current runtime and AI continuation docs, including the exact NPC range limitation and standalone combat formula boundary.
- [~] Complete Android 14 emulator/build verification for this exact baseline and perform owner-device touch QA.
- [ ] Confirm intended maximum NPC interaction range against owner/Universe rules; current handler blocks same-cell interaction only.
- [ ] Wait for owner-approved combatant/chase/ambush/stealth/escape rules before connecting sensor events to real encounters.

**Verification snapshot at the source audit:** Web App Validation #2269 passed for ed5ef007cead9ecf8e6e70662c29ec5cce9527b0: 31 test files and 222 tests passed; TypeScript/gateway checks and Vite production build passed. Android Build #1224 was at the Android 14 emulator-install stage when this section was prepared; check the workflow/artifact before calling Android verified. No physical installation on the target TECNO device is certified by this record.

- [Web App Validation #2269](https://github.com/Antarezka/merzkava-apk/actions/runs/42023817319)
- [Android Build #1224](https://github.com/Antarezka/merzkava-apk/actions/runs/42023817359)


### 13L. In-world HUD and sub-cell field movement preview (2026-11-06)

**Added on feat/player-hud-subcell-runtime-2026-11-06:**
- Shared in-world Player HUD preview with name binding where a local save exists, Mortal/affiliation placeholders, HP/Satiety bars, Quest Board and Social Links drawers.
- Four realm-marked Anime.js ring-framed skill placeholders; combat/time-order execution remains disconnected.
- Three non-canon test-ration stacks at ×999. Portion Satiety changes use the official SMALL/STANDARD/LARGE 10/34/50 rules and cap at 100. The one-hour LIGHT test uses the official Satiety calculator without advancing world time.
- Eight-sector BFS with fractional visual Player coordinates inside each cell. Integer grid coordinates remain authoritative for cell whitelist, occupancy, and NPC interaction; individual blocked sectors and matching half-edges govern the movement route.

**Still open:** connect canonical player profile/affiliation, persistent HP/inventory, actual activity and sleep-aware Satiety ledger, quest/objective resolver, Social Link state, and approved combat/time-turn rules. The HUD is a presentation/test layer, not completion of EP-2/EP-3 simulation contracts. Ring palettes and beast-sigil patterns are UI placeholders, not canon.


### 13M. Build #1340 field map, HUD layout, and access polish (2026-11-06)

**Owner test baseline:** Android Build #1340 on `feat/player-hud-subcell-runtime-2026-11-06` compiled, signed, and installed its APK; the emulator smoke-test launch stage failed after ADB initially reported the emulator offline. Treat this as an emulator/runtime smoke-test blocker, not a compilation failure. Preserve the working build's game flow, screen layout, sub-cell movement, walkable-cell whitelist, half-edge routing, existing map editor, and confirmed camera focal point.

- [ ] Stop camera recentering on ordinary ResizeObserver changes; preserve the map-space focal position while the viewport changes size.
- [ ] Keep gameplay grid diamonds thin and muted gold, hide the editor's center-pick marker outside edit mode, and remove the persistent tap-center marker from normal movement.
- [ ] Make NPC actor taps reliable despite page gesture suppression; route the Player to a safe reachable adjacent cell before opening the compact centered conversation over a blurred map.
- [ ] Reduce per-frame/per-NPC DOM, SVG, minimap, status, and proximity work; batch actor-layer refreshes without changing movement or sensing rules.
- [ ] Smooth the existing confirmation-only Anime.js access diagnostic and progress rail. Preserve its technical sequence, real-operation wait, monotonic progress, success-only 100%, and reduced-motion behavior.
- [ ] Implement native-only Remember Me password restore via SecureStorage; never persist a reversible password in browser localStorage. Unchecking Remember Me or signing out clears its remembered password.
- [ ] Replace filled RPG HUD panels with transparent instrument frames; separate Player identity/status, skill/inventory dock, and world-time ticket into independently movable layers.
- [ ] Add per-map HUD layout editor controls for drag, corner resize, two-finger pinch, save, and reset. Persist coordinates and scale separately from map walkability and grid data.
- [ ] Verify NPC dialogue, movement, editor save/undo/import, camera gestures, HUD layout restore, World Atlas password flow, and emulator startup on a fresh Android build. Physical device QA remains separate.


### 13O. Dual World Atlas gateways — CSS Coastal Receiver and Pixi CRT console (2026-11-06)

**Owner-approved prototype branch:** `03-floating-pixi-world-atlas-tv-console-2026-11-06`. This adds a second floating entry point to Eternal Path without replacing the original Coastal Receiver.

- [x] Keep the existing Coastal Receiver icon, original drag-position key, login gate, and DOM/SVG World Atlas route intact.
- [x] Add a separate CSS-drawn vintage CRT + console box + joystick icon, visible only inside Eternal Path. It has its own drag position and does not overwrite the old receiver's position.
- [x] Route both icons into the same World Atlas markup, account gate, map hierarchy, local save/gameplay functions, movement/pathfinding, sub-cell coordinates, NPC interactions, and dialogue system.
- [x] Add a very small, low-opacity brush-ink `Pixi Architecture` annotation to the shared Atlas header only while the Pixi entry is active.
- [x] Add a separate lazy-loaded PixiJS v8 visual renderer for the isometric game board. The shared DOM/gameplay engine remains authoritative; Pixi does not resolve input, movement, walkability, NPC intent, combat, saves, or dialogue.
- [x] Remove Pixi EventSystem and AccessibilitySystem before renderer initialization; keep every tap, drag, pinch, button and editor action on existing DOM controls.
- [x] Keep the high-resolution Academy Map Base and foreground redraw in the native DOM layers beneath Pixi; avoid a second full-size GPU texture upload, and wait for image readiness before switching other maps away from their DOM source.
- [x] GitHub Actions Web App Validation #42193606553 passed on `0c99f3154df7a6a0413cc971b6d19cd2915cbda9`: 40 test files / 298 tests passed; TypeScript, gateway type-check and Vite production build passed; npm audit reported 0 vulnerabilities. The Pixi renderer is emitted as a separate lazy-loaded chunk (294.21 kB minified / 89.68 kB gzip).
- [ ] Build an Android APK for this branch, then verify repeated open/close, route changes, editor handoff, DOM fallback and all protected touch controls on the TECNO Spark Go 1 KL4 (Android 14). The current successful workflow is Web App Validation only; it produced no APK artifact and no physical-device QA is claimed.

**Renderer contract:** the original receiver remains the default DOM/SVG path. The Pixi CRT console activates the isolated Pixi visual renderer in the same Atlas. A Pixi initialization failure returns to the existing DOM visuals; it must never leave a blank map or disable DOM controls. The Eternal Path cinematic Scene Window remains owned by its existing Anime.js scope and is not migrated by this workstream.
