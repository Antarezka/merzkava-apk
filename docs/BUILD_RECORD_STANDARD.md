# Build Record Standard

Every APK build intended for user testing or installation must ship with one matching `BUILD_NOTES.md` inside the same GitHub Actions artifact. The same record is copied into the app's public assets as `/BUILD_NOTES.md`.

## Mandatory identity
- Build number and attempt
- App version
- Exact build date and time in Asia/Jakarta (WIB), plus ISO-8601 offset timestamp
- Branch, full source commit, comparison commit, and workflow URL

## Mandatory change categories
1. New features / additions
2. Updates / improvements / bug fixes
3. Removed features or files
4. Replaced / renamed / migrated features, explicitly stating what replaced what and the source version/commit when known
5. Complete technical file-change list
6. Commit history for the compared range
7. Build, APK verification, and emulator-test status linked to the actual workflow

## Accuracy rules for maintainers and AI
- Commit messages must explain user-visible behavior, not only implementation filenames.
- Explicitly state what was added, updated, fixed, removed, or replaced.
- When replacing something, name the old behavior and its replacement, and identify the prior version/commit when known.
- Separate code changes from verified user-visible behavior.
- Never infer that a feature works merely because code or assets exist.
- Never invent the previous APK version. Use the previous build record or state that only the source commit is known.
- Keep one record per build; do not combine notes from different APKs.
- The build record must be included in the same downloadable artifact as its APK.
