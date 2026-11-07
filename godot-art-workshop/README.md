# Merzkava Godot Art Workshop

This is an isolated Godot 4 art prototype. It is not embedded into, or wired into, the current APK runtime.

## Open

Open this folder as a Godot project by selecting `project.godot`. Run the main scene to view the sprite and its scale beside a small house.

## Preview

- [Open the character and house scale preview](previews/art_preview.png). This PNG is rendered from the same pixel coordinates and palette as the GDScript drawing, for quick review on mobile. It is **not** a screenshot captured from the Godot editor/runtime.

## What is here

- `scenes/character_sprite.tscn`: reusable Godot-native character scene.
- `scripts/character_sprite.gd`: original 48 × 64 logical pixel sprite drawn directly by Godot with hard-edged pixel clusters.
- `scenes/art_preview.tscn`: visual scale check.
- `scripts/art_preview.gd`: preview background and house reference.

Use the **Facing** property in the Inspector to switch Front, Back, Left and Right. The character sprite is drawn in Godot; the scene does not load the previous SVG.

## Art direction

The character keeps the earlier accepted human-to-world proportion, while the shape language moves toward a readable 2D MMORPG pixel sprite: stepped silhouette, clustered shading, clear hair locks, layered wuxia robe, crossed collar, sash, cuffs, boots and small gold stitching. The palette is warm cream, dark plum-black and muted orange.

The preview house is intentionally taller and wider than the player to check that the player does not dominate ordinary buildings. The preview building is a scale guide, not a finished map building.

## Scope and verification

This is a first Godot-native art pass, not a final production animation set. It contains four static directional poses but no walk cycle, idle animation, NPC variations or tileset yet. The source was written for Godot 4, but this environment does not have the Godot executable, so editor rendering and runtime validation have **not** been performed here. Open the project in Godot to inspect the actual appearance and report any art changes.

The previous SVG in `../assets/godot-prototype/characters/` is retained as the earlier proportion test; it is not used by this project.
