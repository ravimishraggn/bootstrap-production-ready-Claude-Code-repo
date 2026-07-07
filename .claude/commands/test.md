---
description: Write or run tests for the current change
argument-hint: [file or area, optional]
---

If `$ARGUMENTS` names a file/area, focus there; otherwise infer scope from
the current diff (`git diff`).

Use the `write-tests` skill to add missing coverage per
`.claude/rules/testing.md` (unit for logic, integration for boundaries, E2E
for golden paths). Then run the relevant suite (`pnpm test`, or
`pnpm --filter <package> test`) and report pass/fail with a summary of new
coverage added. If this touches agent prompt/tool/schema behavior, remind the
user that `/evaluate` is also required before merge — this command covers
conventional test coverage only, not agent-quality evaluation.
