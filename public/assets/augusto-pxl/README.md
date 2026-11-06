# Augusto PXL runtime assets

This folder is the APK-local, offline visual asset package for the pink PXL World Atlas mode.

- Editable source lives under `/pxl/`.
- Generated assets are committed or placed by CI under `exports/`.
- `manifest.json` is the runtime index. Entries stay `pending` until a real PXL output has been generated, validated and packaged.
- All runtime asset URLs must stay under `/assets/augusto-pxl/`. No CDN or online asset host is permitted.
- Legacy green-TV World Atlas assets are not migrated or modified by this package.

Static APK assets are local and available offline but are not meaningfully secret: an APK can be inspected. Mutable/imported cache blobs can be encrypted per installation using Android Keystore-backed SecureStorage plus AES-GCM in the app vault.
