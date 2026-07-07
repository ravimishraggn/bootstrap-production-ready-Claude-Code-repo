---
name: evaluate-agent
description: Run or extend an agent's evaluation suite - build eval cases, run them against the eval harness, and interpret score deltas before a prompt/tool/model change merges. Use for any change to agent behavior, and required before merging changes to prompts, tools, schemas, or models.
---

# Evaluate Agent

No prompt, tool, schema, or model change to an agent merges without running
through this skill. This is what makes "the model changed its mind" a
measured regression instead of a surprise in production.

## When to use

- Before merging any change to `apps/*/agent/src/prompt.ts`, `tools.ts`,
  `schema.ts`, or the model/version pinned for an agent.
- When investigating a production incident traced to an agent (pair with
  `debug-production`).
- Periodically, to catch silent drift (e.g. an upstream model update).

## Steps

1. Locate the eval suite: `apps/<agent>/eval/cases.jsonl` and
   `apps/<agent>/eval/run-eval.ts`. If none exists, this is blocking — build
   at least 15-20 representative cases (include edge cases and at least a
   few adversarial/prompt-injection-style inputs) before proceeding.
2. Run the baseline (pre-change) and candidate (post-change) side by side:
   ```
   pnpm --filter <agent> eval -- --baseline main --candidate HEAD
   ```
3. Score against the metrics defined in `.claude/rules/evaluation.md`:
   task-specific accuracy, schema-validity rate, groundedness/citation
   correctness (for RAG-backed agents), refusal rate, latency, cost per run.
4. Any regression on a metric requires either a fix or an explicit,
   documented tradeoff decision recorded in the PR — never a silent merge.
5. Add new eval cases for any bug just fixed, so it can't regress silently
   later — a fixed bug without a new eval case isn't actually fixed for the
   long term.
6. Attach the eval report (scores, diffs, sample transcripts for
   failures) to the PR description via `generate-pr`.

## Output

An eval report with baseline vs. candidate metrics and an explicit go/no-go
recommendation, suitable for pasting into the PR.
