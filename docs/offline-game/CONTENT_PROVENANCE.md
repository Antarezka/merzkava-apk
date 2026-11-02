# Merzkava: Eternal Path — Content Provenance & Game Data Contract

> **Status:** Product/design contract for the Offline Game. The title **Merzkava: Eternal Path** is the current working title, not a trademark or release-name clearance.
> **Parent plan:** [Master Product Roadmap](../PRODUCT_ROADMAP.md).
> **World authority:** `Antarezka/merzkava-universe`.
> **Runtime content source:** the approved, versioned World Archive package shipped with the APK.

## 1. Purpose

Merzkava: Eternal Path is a **Life Simulation Text RPG** set in the world documented by Merzkava Universe. The Offline Game may need additional game-facing entries—such as loot, equipment, Spirit Beast encounters, Arcanistry techniques, materials, quests, and event variants—that are not individually documented as canon entities in the Universe repository.

This contract allows that content to be authored for gameplay while preserving a visible, auditable boundary between official world facts and game-only additions.

**World canon and gameplay content are related, but they are not the same thing.** The Universe repository remains the authority for canon. The approved World Archive package is the authority for canon-backed world references. A separate, versioned Offline Game content pack holds game-facing adaptations and original additions. The shipped Offline Game release package combines approved Archive references with reviewed game content; it never fetches raw Universe files. The game must not fetch raw Universe files or silently promote its original content into canon.

## 2. Required provenance labels

Every player-visible content record must have exactly one primary provenance value. The UI renders the values as the following labels:

| Stored value | Player-facing label | Meaning |
|---|---|---|
| `CANON` | **CANON** | The represented fact/entity is directly supported by an approved Merzkava Universe source and its reviewed World Archive record. |
| `CANON_ADAPTATION` | **CANON ADAPTATION** | A canon fact or concept has been translated into a game-facing representation. Gameplay fields may be added, but the adaptation must not create or alter world facts or official rules. |
| `IN_GAME_ORIGINAL` | **IN-GAME ORIGINAL** | The record was created specifically for Merzkava: Eternal Path gameplay and is not an official Merzkava Universe fact. |

Do not use a fourth ambiguous value such as “semi-canon”. If one displayed object combines independently sourced canon and original components, split it into separately attributable records or mark the composite as `IN_GAME_ORIGINAL` and explain its game-only composition.

## 3. Classification rules

### 3.1 CANON

Use `CANON` only when the actual claim represented by the record is explicitly supported by an approved Archive dossier and traceable to an exact Universe source path and commit.

- Preserve official names, classifications, relationships, history, and stated limitations.
- Do not infer missing details from a similar creature, item, region, or character.
- A record may summarize a source, but must not expand its meaning.
- Required provenance: Archive dossier ID, Universe repository, source path, and pinned Universe commit.

### 3.2 CANON ADAPTATION

Use `CANON_ADAPTATION` when the underlying world concept is canon but its representation is shaped for the deterministic game engine.

Examples:
- Turning a canon Spirit Beast into a combat encounter record with game-specific encounter parameters.
- Representing a canon Arcanistry concept as a selectable in-game technique with engine fields.
- Creating a loot or equipment record that implements a canon artifact or material in the inventory system.

The adaptation may add UI text, internal IDs, balance-independent engine metadata, encounter configuration, or other implementation fields needed to play. It must not silently change the official creature category, age, abilities, Arcanistry principles, cultivation rules, or other canon facts. Any value that is not directly established by canon must be identified as game implementation data, not quoted as a world fact.

Required provenance: one or more approved Archive dossier IDs and exact Universe source references, plus a concise adaptation note describing what was translated for gameplay.

### 3.3 IN-GAME ORIGINAL

Use `IN_GAME_ORIGINAL` for newly authored game-only content, including items, equipment, materials, loot tables, quest rewards, event-only encounters, newly designed Spirit Beast variants/species, Arcanistry techniques, and other additions required for a complete playable loop.

- The entry must be internally consistent with the approved world and must not contradict known canon.
- It must not be described as officially recorded, historically established, or universally recognized in Merzkava Universe unless a source supports that claim.
- Its detail page and tooltip must state that it is an Eternal Path game-only creation.
- It must not be exported into the Universe repository or World Archive as canon automatically.
- If the new content requires a world fact, official rule, geography, history, faction, or established entity that is absent or unclear, block that dependency and request a canon/Archive review instead of inventing it.

An original Spirit Beast or Arcanistry entry can exist as a game-only design. Its existence in Eternal Path does not establish that it exists in the official Universe.

## 4. Content record contract

Each packaged content record must carry the following logical fields. The implementation may use TypeScript interfaces, JSON, SQLite columns, or a normalized combination, but the meaning must remain stable. `packageVersion` refers to the Offline Game content-pack version; the release manifest separately pins the World Archive package version/SHA.

| Field | Required | Description |
|---|---|---|
| `contentId` | Yes | Stable, unique game-facing ID. Never use display name as the primary key. |
| `displayName` | Yes | Player-facing name. |
| `contentType` | Yes | Item, equipment, material, spirit-beast, arcanistry, quest, event, dialogue, location-reference, etc. |
| `provenance` | Yes | Exactly one of `CANON`, `CANON_ADAPTATION`, `IN_GAME_ORIGINAL`. |
| `summary` | Yes | Player-safe description. |
| `sourceRefs` | Conditional | Required for `CANON` and `CANON_ADAPTATION`; empty for `IN_GAME_ORIGINAL` unless it cites inspiration/constraints without claiming source authority. |
| `adaptationNote` | Conditional | Required for `CANON_ADAPTATION`; explains game-specific translation. |
| `originalityNote` | Conditional | Required for `IN_GAME_ORIGINAL`; explicitly says it is created for Eternal Path and is not official Universe canon. |
| `reviewStatus` | Yes | Publication gate such as `DRAFT`, `REVIEW_REQUIRED`, `APPROVED`, or `BLOCKED`. Only approved records enter a release package. |
| `packageVersion` | Yes | Version of the approved Offline Game content package containing the record. |
| `gameplayData` | As needed | Deterministic engine fields; never treat these as canon facts merely because they are stored beside lore text. |

Each `sourceRefs` entry for canon-backed records must preserve:
- `archiveDossierId`
- `universeRepository` (fixed to `Antarezka/merzkava-universe`)
- `universeCommit` (exact reviewed commit SHA)
- `sourcePath` (exact path within the Universe repository)

Do not put GM-only, private-player, hidden-agenda, or unreviewed material into the player package even if a source reference exists.


### Dialogue and event content

Dialogue nodes, choice labels, response text, and their gameplay effects are content records too. They must carry the same provenance, review status, and package version as other player-facing content. A story scene written specifically for Eternal Path is `IN_GAME_ORIGINAL`; it must not be represented as a quotation, event, or historical fact from the Universe repository. If a dialogue depends on a named canon NPC, settlement, institution, historical event, or official rule, it must cite the approved Archive dossier and exact Universe source path/commit before it can enter a release pack.

## 5. Example records

Illustrative schema only; names and values below are placeholders, not new Merzkava canon.

```json
{
  "contentId": "example-canon-beast-001",
  "displayName": "Example Canon Beast",
  "contentType": "spirit-beast",
  "provenance": "CANON",
  "summary": "A player-safe summary taken from its approved Archive dossier.",
  "sourceRefs": [
    {
      "archiveDossierId": "example-dossier",
      "universeRepository": "Antarezka/merzkava-universe",
      "universeCommit": "<reviewed-commit-sha>",
      "sourcePath": "bestiary/EXAMPLE_SOURCE.md"
    }
  ],
  "reviewStatus": "APPROVED",
  "packageVersion": "0.1.0"
}
```

```json
{
  "contentId": "example-adapted-arcanistry-001",
  "displayName": "Example Technique",
  "contentType": "arcanistry",
  "provenance": "CANON_ADAPTATION",
  "summary": "A game-facing implementation of an approved Arcanistry concept.",
  "sourceRefs": [
    {
      "archiveDossierId": "example-arcanistry-dossier",
      "universeRepository": "Antarezka/merzkava-universe",
      "universeCommit": "<reviewed-commit-sha>",
      "sourcePath": "core/ARCANISTRY_AND_FORMULATION.md"
    }
  ],
  "adaptationNote": "The technique's selectable action and numeric runtime fields are game implementation details; they do not amend the source rules.",
  "reviewStatus": "APPROVED",
  "packageVersion": "0.1.0",
  "gameplayData": {}
}
```

```json
{
  "contentId": "example-original-material-001",
  "displayName": "Example Expedition Shard",
  "contentType": "material",
  "provenance": "IN_GAME_ORIGINAL",
  "summary": "A material created for an Eternal Path expedition reward.",
  "sourceRefs": [],
  "originalityNote": "Created specifically for Merzkava: Eternal Path. This item is not an official Merzkava Universe canon entry.",
  "reviewStatus": "APPROVED",
  "packageVersion": "0.1.0",
  "gameplayData": {}
}
```

## 6. Player-facing label and tooltip requirements

The provenance label is not developer-only metadata. It must be visible wherever the player encounters or inspects the content.

- **Tooltip / item detail:** show the provenance badge adjacent to the content name or classification.
- **Spirit Beast detail:** show the badge beside the displayed creature name; clearly distinguish a canon species from a game-only species or encounter variant.
- **Arcanistry detail:** show whether the technique is canon, an adaptation, or game-only.
- **Encyclopedia / Codex:** provide a provenance filter and a short explanation for each label.
- **Search results and loot/event notifications:** preserve the label or provide an immediately visible provenance indicator when the result opens.
- **Accessibility:** labels must include readable text, not color alone; maintain contrast and screen-reader descriptions.

Required tooltip explanations:
- `CANON`: “Official Merzkava Universe source.”
- `CANON ADAPTATION`: “Canon concept adapted for Eternal Path gameplay.”
- `IN-GAME ORIGINAL`: “Created for Eternal Path; not official Universe canon.”

## 7. Package, authority, and runtime rules

1. The Universe repository is the ultimate authority for world canon.
2. World Archive reviews and curates player-safe world material; it is not allowed to invent canon.
3. The approved, versioned World Archive package is the source of canon-backed world references consumed by Offline Game.
4. The versioned Offline Game content pack may contain approved adaptations and game-only records. Those records retain their provenance and must not be written back as Universe canon. The final offline release package bundles/references both the approved Archive package and this game content pack.
5. Keep the Universe source commit, World Archive package version/SHA, and Offline Game save/schema version as separate identifiers.
6. Never use the development-only `CANON_FORMULA_SNAPSHOT.md` as a player-facing content package or runtime database.
7. Never generate missing canon, mechanics, creature facts, item history, or Arcanistry rules at runtime with AI or inference.
8. If a required rule or world fact is missing, contradictory, restricted, or unreviewed, block the affected content/feature and route it through the appropriate Universe and Archive review process.
9. Deterministic engine values must be traceable to their rule source or explicitly classified as game-only implementation parameters.
10. A game-only content record can be revised within the Offline Game content pack without changing the Universe repository or canon Archive. Such a revision must update the game content-pack version and release notes.

## 8. Release validation checklist

- [ ] Every player-visible content record has exactly one valid provenance value.
- [ ] Every `CANON` record has an approved Archive dossier and exact Universe source path + commit.
- [ ] Every `CANON_ADAPTATION` record has the same source traceability and an adaptation note.
- [ ] Every `IN_GAME_ORIGINAL` record has an originality note and no false canon claims.
- [ ] No GM-only, private, hidden, or unreviewed source material enters the player package.
- [ ] Tooltip, detail, Encyclopedia, search, and notification surfaces expose provenance.
- [ ] Provenance survives serialization, database persistence, package updates, and save migrations.
- [ ] Offline Game reads only the approved local package and never fetches raw Universe files.
- [ ] Automated tests reject missing/unknown labels, missing source refs, invalid package status, and accidental canon promotion.
- [ ] Package source revisions are recorded separately from Convo's active canon SHA.

## 9. Naming and product identity

**Current working title:** **Merzkava: Eternal Path**.

**Game category:** Life Simulation Text RPG.

**Concept:** A choice-driven simulation of a character's life in Merzkava, combined with text-RPG exploration, progression, encounters, quests, and cultivation. BitLife is a high-level life-simulation reference; Solo Leveling is a high-level progression/presentation reference. Neither contributes proprietary content or world canon.

The title remains a working title until the owner explicitly locks it and availability/brand checks are completed.

## Mandatory narrative-node anchor and batch contract

The following additional rules apply to every narrative situation/node, including dialogue branches and event variants:

- **Required World Archive anchor:** every node must identify at least one approved, player-safe World Archive dossier that supplies its world context, setting constraints, relevant entities, or lore boundaries. A node with no Archive anchor must not be packaged.
- **Non-canonical by design:** every authored node is a gameplay scenario, not an official Universe record. Its narrative framing, dialogue, choices, and consequences must not be presented as new canon, even when it references canon entities or facts.
- **Keep provenance labels unchanged:** continue to use exactly CANON, CANON_ADAPTATION, or IN_GAME_ORIGINAL according to the existing definitions above. Archive anchoring is a separate relationship and must not be used as a substitute provenance value. For IN_GAME_ORIGINAL, an Archive anchor records contextual inspiration/constraints only; it does not claim that the original node itself is supported by canon.
- **At least two nodes per update:** every update that adds or expands narrative nodes must introduce at least two distinct nodes. A one-node increment is below the required minimum. The previous nine-node starter slice is the initial baseline, not an exception to this rule.
- **Existing labels/categories remain:** preserve the already planned node labels and categories. Do not rename or remove them when adding Archive anchors.

Recommended node metadata should therefore keep the provenance field and Archive relationship separate, for example archiveAnchors: [{ archiveDossierId: "...", role: "setting-context" }]. The exact dossier ID must resolve to the approved local World Archive package. For IN_GAME_ORIGINAL, do not populate canon sourceRefs merely to satisfy this anchor requirement; use archiveAnchors for contextual linkage and retain the required originalityNote.
