# Eternal Path — Game Design & Implementation Blueprint

**Status:** User-approved product direction; implementation begins in dependency-safe vertical slices.
**Product:** Merzkava: Eternal Path — offline-first Life Simulation Text RPG.
**Authority:** Official Merzkava Universe → reviewed World Archive package → versioned Offline Game content pack → isolated player save.

## 1. Player promise

Eternal Path is an open-ended life simulation, not a linear cultivation ladder. A player may live an ordinary life, pursue Spirit Realm mastery, become an exceptional Arcanist, combine paths, collect rare objects, own/manage property, build organizations, influence territories, establish a household, raise a family and leave a legacy. Paths are optional, may overlap, and may change over time. No path is inherently superior.

### Supported ambition domains

- Ordinary life: rest, meals, farming, gathering, cooking, work, trade, craft, study, travel, friendship, partnership, household, family and community.
- Spirit Realm: awakening, cultivation, training, Spirit Beast research/encounters, Spirit Ring absorption, techniques, teaching and institutional roles.
- Arcanistry: education, focus, research, formulation, production, artifact appraisal/repair, workshops, teaching and institutions.
- Hybrid life: any combination of ordinary life, Spirit Realm and Arcanistry.
- Collections: artifacts, books, materials, equipment, heirlooms and other approved/game-labelled objects; track identity, authenticity, provenance, condition, ownership and valuation.
- Property and territory: land, buildings, estates, shops, workshops, routes and supported holdings. Distinguish legal ownership, lease, claim, administrative authority, political influence, military occupation and practical control.
- Organizations: player-local clans, sects, circles, parties, guilds, trade associations, companies, academies, workshops and other supported groups. Track membership, roles, assets, obligations, governance, succession, reputation and internal conflict.
- Family and legacy: partnership, marriage where supported by lifecycle/world rules, household, children, family ties, inheritance and succession. Keep content age-appropriate and non-explicit.

NPC factions, canon governments and official institutions retain independent agency. Player influence is save-local and does not rewrite official history.

## 2. Canon, adaptation and noncanon save data

Three layers must never be conflated:

1. Read-only World Archive package: official geography, history, factions, institutions, established people/places, species, economy and mechanics.
2. Versioned Offline Game content pack: reviewed CANON, CANON_ADAPTATION and IN_GAME_ORIGINAL content. Every canon-backed record points to an Archive dossier, exact Universe source path and source commit. Original content must not masquerade as canon.
3. Mutable Eternal Path save: player character/progression, disposition, relationships, events/choices, collections, acquired assets/territories, player-created organizations and names, family/children, local reputation and all journey-specific outcomes.

Each save pins Archive package version/SHA, game content-pack version/SHA, schema version, deterministic seed and creation metadata. Canon updates must not silently rewrite an existing journey. Define explicit compatibility/migration/rebase behavior. Deleting/resetting a save must never modify the Archive or another save.

## 3. Player-created naming

Whenever a player action creates an entity requiring a name, pause and open a naming dialog. The player supplies the name; never auto-name it.

Applies to player-created clans, sects, circles, parties, guilds, trade associations, companies, workshops, academies, shops, properties/settlements/ships where naming is permitted, family/dynasty names when chosen, children, and named companions/contracted creatures where rules permit.

The dialog shows entity type and context, validates non-empty name/length/characters/duplicates in the relevant save namespace, and requires confirmation. Offer Name Later only when the event can safely remain pending. Rename is allowed only when ownership and entity rules permit. These names/entities are NON_CANON and exist only in that save. A new journey uses the same canon package but does not inherit them unless the player explicitly imports a compatible save.

## 4. Profile and disposition

Keep the home profile compact; full canonical details remain accessible in a dedicated profile view. Preserve the exact canonical profile field meanings and do not fabricate unknown values. Mortal is the base state before Spirit Realm 1; never invent Mortal/0. Do not fabricate Martial Soul awakening, Spirit Ring, Sync, Arcanist Grade or Arcanist Focus. Do not modify the official Universe character template.

Disposition is private Eternal Path save metadata, not a new canon profile field. Render only its derived public label immediately above the narrative panel. Possible labels include Neutral, Lawful Good, Lawful Evil, Chaotic Good, Chaotic Neutral, Chaotic Evil and True Neutral. Never reveal internal axis values, numeric changes, or predicted consequences.

Internal disposition is multi-axis: Order (lawful/chaotic), Moral intent (benevolent/cruel), Motive (selfless/self-serving), Method (honest/deceptive), Loyalty (loyal/opportunistic), Empathy (compassionate/detached) and Ambition (content/driven). Each axis requires documented bounded updates, evidence weights, recency/decay, thresholds and hysteresis. Lawfulness bands such as Low, Normal, High and Dedicated remain internal classification detail; numeric thresholds are tunable design values, not canon. Intent, action and outcome are evaluated separately. One action must not instantly change a character's label.

Personal NPC relationships, regional reputation and faction/legal standing are separate systems. A region only reacts to what its people/institutions could know.

## 5. Relationships and NPCs

Use an original Social Link-inspired relationship presentation; do not copy Persona 4 assets, layout or text. The home screen may show one contextually relevant active NPC link; a dedicated Relationships screen lists all links. Track separate dimensions such as trust, affinity, respect, fear, resentment, familiarity and shared history. Do not collapse all NPCs into a global Bonds counter.

NPC reactions depend on individual traits, goals, knowledge, schedules, relationship history, availability, regional culture/faction, player disposition and relevant world state. Link ranks unlock through authored milestones and may be damaged or blocked when justified.

## 6. Narrative and choice engine

A substantial event is composed from reusable data:
1. Environment: visuals, light, sound, scent, temperature, weather and ambient activity.
2. Scene action: what changes and what the player/NPC does.
3. NPC behavior: gesture, hesitation, observable intent and context.
4. Dialogue and player response.
5. Hidden deterministic resolution and atomic consequence transaction.
6. Follow-up event, journal record and time advancement.

Choices show only the action or spoken response. Never show alignment labels, consequence previews, success odds, trust deltas or numeric effects. Outcomes may be positive, negative, mixed, delayed or absent. Validate preconditions and commit all related changes exactly once. Record event ID, selected choice, deterministic inputs, state references and transaction IDs for audit/replay prevention.

Eligibility may depend on region/location/time, lifecycle, HP, Satiety, injury, inventory/equipment/wallet, skills, Martial Soul, Spirit Realm, Spirit Ring, Arcanist Grade/Focus, NPC schedule/knowledge/relationship, disposition, culture/faction, goals and prior event flags. Events declare only the requirements they actually need.

## 7. UI specification

- Compact single-line Eternal Path title, approximately the existing standalone-label size.
- Move the existing Scene World upward without shrinking the current scene image area. Fog/FX stays clipped inside its glass window, never over the app shell or unrelated game areas.
- Replace the tall Your Adventurer block with a compact profile less than half its current height where practical; full details remain reachable.
- Put the derived Disposition line directly above the narrative panel.
- Narrative is the dominant screen area, with clear environment/action/NPC/dialogue hierarchy.
- Choices open in a modal above narrative. While open, lock all other Eternal Path controls/navigation. Android Back closes safely; no dead-end. Commit once, unlock afterward. Support accessibility and reduced motion.
- Remove World Location, Daily Life, Progression and Chronicle cards from Eternal Path Home. Existing toolbar is the navigation surface.
- Center toolbar in a stable, untransformed parent, with generous left/right safe margins for Android edge gestures. Preserve one-column layout and stable position across route transitions. Use original restrained Reverse: 1999-inspired ornamentation, not copied assets.
- Every toolbar item must lead to a functional destination. No dead controls or misleading feature labels.
- Handle narrow screens, safe-area insets, dynamic text scaling and keyboard opening.

## 8. Save manager and lifecycle

Required: autosave, manual save, multiple slots, load, rename save, delete one save, new journey, reset one journey, export and import. Destructive actions require layered confirmation.

Each save ID owns player/world state, relationships, organizations, territories, assets, collections, family, progression, event history, deterministic RNG state and snapshots. Audit current app storage wiring before choosing implementation; Capacitor SQLite is installed and is a candidate, not proof of an initialized database. Use atomic transactions, schema migrations, crash recovery and validated import archives. Deleting one save affects only that save; Reset Journey affects only the selected journey; Reset Game Data is separate. None may alter the Archive or other saves. Core save operations require no cloud account.

## 9. Implementation phases

### EP-0 — Audit and UI foundation
- Inventory Eternal Path DOM/components, CSS, navigation rail, Scene FX, profile, narrative and current save shape.
- Fix toolbar anchoring/clipping and stable parent across routes; add narrow-screen/safe-area regression tests.
- Implement title/scene/profile/narrative/disposition layout and remove obsolete home cards.
- Implement choice modal focus/lock, Android Back/close, keyboard and accessibility behavior.
- Verify Scene Window placement and fog clipping.

### EP-1 — Data and persistence
- Version player/save/world-state schemas, provenance references, manifest and deterministic RNG state.
- Implement isolated save slots, atomic mutation API, autosave/manual save, load, delete, reset, export/import and migrations.
- Test crash/restart, cross-save isolation, corrupted import, rollback and canon read-only boundary.

### EP-2 — Deterministic simulation kernel
- One authoritative world clock/calendar and activity transaction pipeline.
- Integrate existing verified HP, Satiety, Injury, Time, Combat, Spirit Ring, Martial Soul, Economy and Arcanistry modules without duplicating formulas.
- Add lifecycle, needs, sleep/rest, food, work/study/craft/training and interruption rules from approved canon/game-only specifications.
- Add seeded RNG, replay logs, cooldowns, unique-event flags and idempotent resolution.

### EP-3 — Narrative and social simulation
- Composable event nodes and indexed requirements.
- Hidden multi-axis disposition, derived labels, hysteresis and Lawfulness bands.
- NPC identities/schedules/knowledge, relationship dimensions and Social Link ranks.
- Region/faction reactions separate from personal relationships and disposition.
- Narrative rendering and hidden consequence resolution with atomic state updates.

### EP-4 — Open life, ambition and ownership
- Playable ordinary-life activity loops without mandatory cultivation.
- Collection, item identity, appraisal/provenance and cataloguing.
- Assets/property; distinguish ownership, lease, claim, administration, influence and occupation.
- Player-created organizations, membership, governance, treasury, obligations, succession and loss.
- Family/partnership/children/legacy and player-entered naming.
- Optional Spirit Realm, Spirit Ring and Arcanistry paths and hybrid combinations.

### EP-5 — World content and progression breadth
- Archive-backed locations, travel, schedules, festivals, weather and regional events.
- Quests, discovery, encounters, combat, education, occupations, institutions and long-term progression.
- Block missing/private/unreviewed canon dependencies.

### EP-6 — Performance, accessibility and release
- Profile complete game on target Android hardware; optimize measured rendering, animation, storage, image and event-selection costs.
- Test long saves, large inventories/collections, many NPC links, event history and multiple save slots.
- Complete offline cold-start, route switching, save recovery, accessibility, visual QA and APK install/launch checks.

## 10. Performance rules

Index event lookup by region/location/time/tags. Simulate only active/nearby NPCs and advance off-screen schedules in deterministic time intervals; never run full-world simulation per frame. Separate UI rendering from simulation; UI reads compact view models and never recalculates authoritative formulas. Use append-only event/transaction records with periodic snapshots and bounded caches. Load only the active scene and visible panels; lazy-load deep profile/codex/save screens. Reuse assets and CSS layers; keep Anime.js scoped to scene FX. Establish performance budgets only after measuring the target device.

## 11. Reading accessibility, audio and deferred Braille

The shared product requirements for audio and inclusive reading are defined in [the master roadmap](../PRODUCT_ROADMAP.md#3d-audio-reading-controls-and-inclusive-access) and are implemented across the app rather than as Eternal Path-only decoration.

- Eternal Path narrative has its own text preferences, independent from connected Convo: optional dyslexia-friendly fonts, font size/weight, line height, letter spacing, paragraph spacing and text width.
- Vision support includes high contrast, color-vision profiles, and redundant non-color cues. Choices, statuses, warnings and rarity must remain understandable without color perception.
- TalkBack and Android accessibility semantics, focus order, touch targets, dynamic text scaling and reduced motion are acceptance requirements.
- Tap Sound, BGM and Ambient / Sound FX are independent audio categories with separate persistent controls. BGM playback remains dormant until user-provided music assets are ready.
- Braille is a deferred post-core milestone. Its exact scope (refreshable Braille display / Android BrailleBack integration, in-app Braille presentation, or both) must be confirmed before design or implementation. Do not claim Braille support until tested with compatible assistive technology.

## 12. Master acceptance gate

Eternal Path is not complete until a player can start/manage isolated journeys, live an ordinary life or pursue optional/hybrid ambitions, experience meaningful NPC/social/event consequences, create/manage player-local names and entities, acquire/control supported assets and organizations, save/load/export/delete safely, and play offline without changing World Archive canon. A mockup, empty screen or isolated formula module does not satisfy this gate.


### 13L. EP-1 save manager + Anime.js motion foundation (2026-11-02)

**Implemented on `feature/archive-experience`:**
- Eternal Path save schema advanced to v3 with unique journey IDs, player-editable journey titles, creation/update timestamps and migration from the previous v1/v2 single-save record.
- Added multiple isolated local journeys: list, load, leave/unload without deletion, rename, delete one journey, export JSON backup and validate/import JSON backup. Deleting one slot leaves all other journeys intact.
- Added Journey Manager UI with save cards, inline rename, load/delete/export actions, new-journey form and backup import. Existing single-save data is migrated into the library on first access.
- Added Anime.js scene composition: slow camera drift on the scene art, atmospheric fog drift, light/weather breathing, staggered profile and narrative reveals, choice-sheet open/close, manager-panel reveal, app-screen transitions, toolbar icon/hover movement and button micro-interactions.
- Animation scopes are cleaned up when Eternal Path rerenders; reduced-motion preference disables the scene/choice motion.
- Corrected the previous CI test assertion to match the actual compact profile class list and added save-isolation/backup tests.

**Storage boundary:** the current save-slot implementation uses versioned local WebView/browser storage to preserve offline operation and provide a fast first save-manager slice. It is not yet the final SQLite-backed large-world store. EP-1 still includes migration of the slot repository into the existing Capacitor SQLite database, atomic transactions, recovery/rollback tests and explicit archive/content-pack version pins in each manifest. Do not describe those parts as complete.

**Validation:** earlier CI exposed a failing UI assertion, then a storage-environment failure in the test runner. The latest code has corresponding fixes and new tests, but the newest full validation run is still pending/has not yet been observed. No TypeScript/build pass or physical Android QA is claimed.

**Next vertical slice:** SQLite-backed save repository + versioned manifest, then a minimal ordinary-life activity loop using the existing authoritative world clock and HP/Satiety modules. Continue to keep Anime.js presentation-only: it must never own game time, deterministic RNG, state mutation or NPC simulation.


### 13M. EP-3 context-aware narrative bootstrap (2026-11-02)

**Implemented on `feature/archive-experience`:**
- Added `src/offline-game/narrative-engine.ts` with a typed situation schema, eligibility evaluation, deterministic context-seeded selection, hidden choice outcomes, deterministic transaction IDs and replay guards.
- Added a separately versioned `eternal-path-bootstrap` patch manifest and nine original starter situations: three each for Golden Dragon Empire, Tianhai Yunzhou and Beiming Gu. These are a small playable engine-validation slice, not Patch 1 and do not count toward the Patch-1 minimum of 1,000 materially distinct situations.
- Replaced the locked narrative placeholder with Setting/Atmosphere, six-line Scene Action, observable Character Behavior, Dialogue, contextual perspective question and a response sheet. Outcome text appears only after the choice resolves.
- Added save schema v4 with journey-local active node, event history and last outcome. Legacy v1–v3 journeys migrate forward without discarding their prior state. Choice effects, event record and world-clock advance are serialized in one save update.
- Added deterministic selection, region eligibility, no-repeat, choice validation, save migration and UI contract tests. The retired 240-entry dialogue sequence remains unused.

**Boundaries still open:** this bootstrap resolver currently uses the available save fields (character, region/location, age, time/day-cycle, weather, disposition and event history). Relationship, inventory/resource and current-activity contracts are not yet present; do not imply that full EP-2/EP-3 integration is complete. Save storage remains the existing local WebView/browser bridge, not final SQLite transaction storage.

**Validation:** Web App Validation and the Eternal Path quality gate passed for code commit `51f8b748` (TypeScript, production web build, 22 test files / 171 tests). The Android APK build for the same code commit is still queued/pending; no APK artifact or emulator result is claimed yet. Physical Android interaction/visual QA remains open.

**Next:** verify the latest web validation and Eternal Path quality gate; then test the bootstrap interaction on Android. Keep Patch 1 authoring on hold until UI repair and EP-2 state contracts are verified. Patch 1 retains its 1,000-situation minimum.
