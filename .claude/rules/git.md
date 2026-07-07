# Git & Branching Rules

## Branching

- `main` is always deployable. Work happens on short-lived feature branches:
  `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
- No direct commits to `main` — every change lands via PR, including changes
  to `.claude/` itself.

## Commits

- Commit messages explain *why*, not just *what* (the diff already shows
  what). One logical change per commit where reasonable; avoid bundling an
  unrelated refactor into a feature commit.
- Never amend or force-push a commit already reviewed/pushed to a shared
  branch without flagging it to reviewers — it invalidates prior review
  context.
- Never use `--no-verify` to skip hooks; if a hook fails, fix the underlying
  issue.

## PRs

- Every PR links its source requirement (GitHub issue or Jira ticket via the
  relevant MCP server).
- Every PR includes a test plan and, for agent-behavior changes, eval
  evidence (baseline vs. candidate scores) — see `generate-pr` skill and
  `evaluation.md`.
- PRs are scoped to one coherent change. A PR mixing an unrelated refactor
  with a feature is sent back for splitting.
- CI (lint, typecheck, tests, eval gate, security scan) must be green before
  merge; no merging on red CI with a "fix in follow-up" promise.

## Review

- `code-reviewer` (or a human) reviews every PR for correctness and
  standards compliance.
- `security-reviewer` reviews any PR touching auth, secrets, MCP tool
  definitions, `.claude/settings.json`, or PII/customer-data handling.
- Reviewers block on: failing tests, missing eval evidence for agent
  changes, unaddressed security findings, or unexplained scope creep.

## Merging

- Squash or rebase-merge to keep `main` history readable; avoid merge
  commits that bundle many small WIP commits.
- Delete the branch after merge.
