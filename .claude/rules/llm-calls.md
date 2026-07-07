# LLM Call Rules

## Model selection

- Default to the platform-standard model tier per task complexity: use the
  fastest/cheapest model that reliably meets the eval bar for a given agent;
  reserve the highest-capability tier for tasks requiring complex judgment
  (RFP drafting, ROI modeling) over high-volume simple classification (lead
  scoring signal extraction).
- Pin the exact model version used by each agent in
  `packages/agent-core/registry.ts`; never float to "latest" silently in
  production — a model version bump is a change that needs an eval run like
  any other, per `evaluation.md`.

## Reliability

- Every LLM call goes through `packages/agent-core`'s shared client wrapper,
  which provides: timeout, retry with backoff (idempotent calls only),
  structured error surfacing, and tracing — never call the model API
  directly from agent code.
- Set explicit timeouts appropriate to the task; a hung call must not hang
  the calling workflow indefinitely.
- Retries apply to transport/rate-limit failures only, never to "the model
  gave an answer I didn't like" — that's a prompt or validation problem, not
  a retry problem.

## Token and cost budgets

- Each agent declares an expected token budget (input + output) in its
  README; unexpectedly large inputs (e.g. a huge RFP document) should be
  chunked or summarized deliberately, not truncated silently.
- Use prompt caching for the stable parts of a prompt (system instructions,
  few-shot examples, tool schemas) when the underlying platform supports it,
  to reduce cost on repeated calls with a shared prefix.
- Track cost per run as an eval/observability metric (`evaluation.md`,
  `observability.md`) so cost regressions are visible, not just quality ones.

## Concurrency

- Batch/parallelize independent LLM calls (e.g. scoring multiple leads)
  rather than serializing them, but respect provider rate limits via the
  shared client wrapper's concurrency control.

## Determinism expectations

- Where output must be consistent for the same input (e.g. compliance-facing
  classification), set temperature low and rely on structured output
  validation rather than expecting bit-for-bit determinism from the model.
