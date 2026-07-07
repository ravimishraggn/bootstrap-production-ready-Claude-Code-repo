---
description: Run the eval suite for an agent and report baseline vs candidate scores
argument-hint: <agent-name>
---

Use the `evaluate-agent` skill for `$ARGUMENTS`.

Locate `apps/$ARGUMENTS/eval/cases.jsonl` and `run-eval.ts`. If missing,
treat that as blocking — build at least 15-20 representative cases first.
Run baseline (main) vs. candidate (current branch) and score against
`.claude/rules/evaluation.md` metrics: task accuracy, schema-validity rate,
groundedness/citations (if RAG-backed), refusal rate, latency, cost. Report
an explicit go/no-go recommendation and flag any unexplained regression as
blocking for merge.
