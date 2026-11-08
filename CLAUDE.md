# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Merzkava APK — Project-Specific Safeguards

These rules supplement the repository's existing project directives, roadmap, architecture, and system specifications. They do not replace or outrank them.

- Read PROJECT_DIRECTIVES.md, docs/PRODUCT_ROADMAP.md, docs/ARCHITECTURE.md, and the relevant system handoff before changing a subsystem.
- Preserve the two distinct experiences: connected Convo / AI GM and the standalone offline Merzkava: Eternal Path. Do not mix their state, context, content provenance, or network requirements.
- Keep Offline Game mechanics, saves, and developer access fully local and deterministic. Do not add network requirements to offline flows.
- Treat official canon, World Archive packages, Convo context, Offline Game content, and application code as separate sources with explicit boundaries. Never silently inject archive content into Convo.
- The game engine validates proposed state changes. Do not let AI output become authoritative game state or saved data.
- Preserve existing login, remember-me, player, and developer access behavior unless the task explicitly targets it. Developer access must remain usable offline as specified.
- Never expose provider API keys or other secrets in source code, logs, APKs, or committed configuration.
- Do not move, replace, upload, or reuse signing keystores across repositories. Keep Merzkava APK and Merzkava Pocket signing assets and workflows separate.
- Follow the master roadmap and release gates. Do not claim a feature or build is complete without verifying it.
- Verify Android packaging, installation, and the affected user flow on the supported target where possible; report any check that could not be performed.
