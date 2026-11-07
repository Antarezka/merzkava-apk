# Godot visual prototype assets

This folder is an isolated art-prototype area. It does not replace or modify the existing app runtime.

## Player base sprite

- File: `characters/player_base_4dir.svg`
- Format: SVG vector, transparent background
- Sheet: 384 × 128 px, four 96 × 128 px cells
- Directions: front, back, left, right
- Intended import: Godot 4 as a texture; crop each 96 × 128 cell or convert to PNG during the art pipeline.
- Visual direction: original Merzkava design combining a small readable 2D MMORPG character scale, wuxia travel clothing and a restrained atmospheric fantasy palette. This is an original interpretation, not a trace or copy of any reference game's art or assets.

## Current limitations

This is a first silhouette/style block-in, not a finished production sprite. It has no walk/idle frame animation yet, and the side views are directional placeholders. Next art pass should refine proportions, face readability at gameplay scale, cloth folds, hair silhouette, and consistent side-view anatomy before adding animation frames.

## Scale rule

Character proportions must remain believable beside doors, houses, trees and other world objects. The player must not be scaled larger than ordinary buildings for visual emphasis.
