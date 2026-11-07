# Godot client project

This directory is the new native client foundation for Merzkava APK.

- Engine pin: **Godot 4.7.2 stable**
- Language: GDScript
- Initial renderer: Compatibility
- Target: Android APK
- Main scene: `res://scenes/main.tscn`

This is a migration scaffold only. The legacy Vite/Capacitor app remains the currently implemented client until the Godot ports pass feature-parity and save-migration gates. Do not mistake the launch placeholder for completed gameplay.

## Cloud validation

The repository workflow downloads the pinned official Godot Linux headless editor and validates the project without requiring a local PC or Godot installation.

Android export is a separate release gate and must use export templates matching the exact pinned engine version.
