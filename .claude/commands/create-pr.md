---
description: Prepare and open a pull request following the platform PR workflow
argument-hint: []
---

Use the `generate-pr` skill.

Before opening the PR: confirm `pnpm typecheck && pnpm lint && pnpm test`
pass, and that `evaluate-agent` was run with no unexplained regression if
this change touches agent behavior. Review the diff for scope creep. Commit
with a why-focused message per `.claude/rules/git.md`. Open the PR via
`gh pr create` with the standard template: Summary, linked
requirement (Jira/GitHub issue), test plan, eval evidence, risk/rollback.
Never mark ready if CI is red.
