# Known Issues and Baseline Warnings

## Main Menu click handling — do not use as a reference

- **Known-bad snapshot:** `63ae8a3165a1306cb5d230f08ba4d810f823ea23` (and the immediately preceding repair snapshot `24d5d1b510b8cf91ed07b033415ecc0ef2057c11`).
- **Observed behavior:** Main Menu controls play their click sounds but do not execute navigation/actions. Floating Control was reported to work normally.
- **Handling rule:** Do not use either snapshot as a working baseline, template, or source for restoring Main Menu interaction behavior. Do not assume that a click sound means the action handler succeeded.
- **Safe code reference:** `f98d19ff03a3f613386743d7c38eb8045d81a4a0` is the known safe `src/main.ts` baseline used for restoration.
- **Restoration commit:** `4211229a7d8fe0d4aea7b6b06769b14d6412cda0` restores the full `src/main.ts` from that safe baseline. This restoration still requires on-device verification; it is not yet proof that every button works.
- **Scope protection:** Keep Noticeboard and Floating Control unchanged while validating this repair. PixiJS should remain isolated to the Eternal Path screen; do not remove it as a workaround without evidence.

Update this note only when a new device-tested baseline is confirmed.
