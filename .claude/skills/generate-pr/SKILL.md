---
name: generate-pr
description: Prepare a pull request following this platform's PR workflow - commit hygiene, PR template, linked requirement, eval/test evidence attached, and reviewer routing. Use when a change is ready to be proposed for merge.
---

# Generate PR

Turns a finished change into a reviewable, well-evidenced PR — this is what
`/create-pr` runs.

## Steps

1. **Verify readiness**: `pnpm typecheck && pnpm lint && pnpm test` pass
   locally; if the change touches an agent, `evaluate-agent` has been run
   and shows no unexplained regression.
2. **Review the diff** yourself (`git diff`) — confirm it matches the linked
   requirement with no unrelated scope creep bundled in.
3. **Commit** with a message describing why, not just what (see
   `.claude/rules/git.md` for message conventions); one logical change per
   commit where reasonable.
4. **Push** and open the PR using `gh pr create`, filling the template:
   - **Summary**: 1-3 bullets, what changed and why.
   - **Linked requirement**: issue/Jira ticket link (via `jira`/`github` MCP).
   - **Test plan**: what was run, what a reviewer should verify manually.
   - **Eval evidence**: baseline vs. candidate scores, if agent behavior changed.
   - **Risk/rollback**: what could go wrong, how to revert.
5. **Route reviewers**: tag `code-reviewer`-equivalent human reviewer always;
   additionally flag for security review if the diff touches auth, secrets,
   MCP tool privileges, or PII handling.
6. Never mark a PR ready if CI is red or an eval regression is unexplained.

## Output

An open PR with a filled template, passing CI, and evidence attached —
ready for human and/or `code-reviewer`/`security-reviewer` review.
