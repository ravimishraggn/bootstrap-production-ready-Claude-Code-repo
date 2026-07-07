---
description: Refactor code without changing behavior, with test coverage as a safety net
argument-hint: <file or area>
---

Refactor `$ARGUMENTS`.

1. Confirm test coverage exists for the current behavior before changing
   anything; if coverage is thin, use `write-tests` to establish a safety net
   first — a refactor without characterization tests is a rewrite in disguise.
2. Make the change behavior-preserving: run the full test suite before and
   after, and diff outputs where feasible.
3. Do not expand scope beyond the refactor — no drive-by feature additions.
4. If the refactor touches a shared package (`packages/agent-core`,
   `packages/mcp-clients`, `packages/ui-kit`), check impact across all
   consumers, not just the one that prompted the change.
5. If agent prompt/tool/schema code is touched even incidentally, run
   `/evaluate` to confirm no behavior drift.
