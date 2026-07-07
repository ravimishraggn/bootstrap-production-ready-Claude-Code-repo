# Observability Rules

## Tracing

- Every agent run and every workflow gets one correlation/trace ID spanning
  its full execution — every LLM call, every tool call, and the final
  decision are recorded under that ID via `packages/agent-core`'s tracing
  wrapper.
- Traces record: inputs (redacted per `logging.md`), each tool call and its
  result, the model version/prompt version used, the final structured
  output, latency per step, and token/cost usage.
- Traces must be queryable by correlation ID from a support/incident
  context in under a few seconds — this is what makes `debug-production`
  tractable instead of guesswork.

## Metrics and dashboards

Every agent and workflow ships with dashboards covering:
- Request volume and error rate.
- Latency (p50/p95) per step and end-to-end.
- Eval score trend over time (from the last N production samples or
  scheduled eval re-runs), not just at merge time — models and data drift.
- Human-in-the-loop approval/rejection rate — a rising rejection rate is an
  early warning of quality regression before it shows up elsewhere.
- Cost per run.

These dashboards are a deploy-readiness requirement (`devops-engineer`
gate), not a nice-to-have added after go-live.

## Alerting

Alert on: error rate above threshold, latency p95 above SLA, eval score
trend dropping below the accepted floor, and HITL rejection rate spiking —
each routes to the on-call rotation with a link to the relevant dashboard
and recent traces.

## Ownership

Every agent's README names what "healthy" looks like for its key metrics, so
an on-call engineer unfamiliar with a specific agent can triage without
paging the original author.
