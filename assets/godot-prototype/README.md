# Godot visual prototype assets

The active art prototype is now the native Godot project at `godot-art-workshop/`.

## Current working art

- Open `godot-art-workshop/project.godot` in Godot 4.
- The reusable character scene is `godot-art-workshop/scenes/character_sprite.tscn`.
- Its art is drawn directly in GDScript in `godot-art-workshop/scripts/character_sprite.gd`, using a 48 × 64 logical pixel canvas.
- The preview scene compares the player against a house so ordinary buildings remain visibly larger than the character.

## Historical proportion test

`characters/player_base_4dir.svg` is the earlier vector block-in that established the accepted character-to-world proportion. It is retained only as a historical reference and is **not loaded by the Godot project**.

## Scope

The Godot project is isolated on the `prototype/godot-art-assets` branch. It does not modify or replace the APK runtime. The current sprite is a four-direction static art pass; walk/idle animation, NPC variants, production buildings and map tiles remain future art tasks.
