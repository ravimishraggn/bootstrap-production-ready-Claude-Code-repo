# Evaluation Rules

## The gate

No change to an agent's prompt, tool set, output schema, or pinned model
version merges without a passing eval run comparing baseline (main) to
candidate (the branch). This is enforced by CI (`devops-engineer`'s
pipeline) and is the mechanical reason prompt drift can't silently reach
production on this platform.

## Building an eval suite

- Every agent ships with an eval suite from the moment it's scaffolded
  (`create-agent` skill) — minimum 10 seed cases at scaffold time, growing
  to 15-20+ representative cases (including edge cases and at least a few
  adversarial/prompt-injection-style inputs) before first production use.
- Eval cases are drawn from real or realistic examples, not toy inputs —
  toy inputs pass evals that then fail in production.
- Every production bug fix adds a regression eval case reproducing the bug,
  so it can't silently reappear.

## Metrics

Score agents on the metrics relevant to their task, always including:
- **Task accuracy** — task-specific correctness (e.g. lead score correlation
  with actual conversion, RFP answer factual correctness).
- **Schema-validity rate** — how often output validates against schema
  without needing a retry.
- **Groundedness/citation correctness** — for RAG-backed agents, whether
  cited sources actually support the claim.
- **Refusal/escalation rate** — is the agent escalating appropriately, not
  too often (annoying) or too rarely (risky)?
- **Latency and cost per run.**

## Process

1. Run baseline vs. candidate side by side on the full suite.
2. Any regression on any metric requires either a fix or an explicit,
   documented tradeoff decision in the PR — never a silent merge.
3. Attach the eval report to the PR (`generate-pr` skill).
4. Periodically re-run evals against live production samples to catch
   silent drift from upstream model updates or data distribution shift —
   evaluation is continuous, not just a merge-time gate.

## Ownership

`ai-agent-engineer` and `prompt-engineer` own building and maintaining eval
suites for their agents; `devops-engineer` owns wiring the eval gate into CI.
