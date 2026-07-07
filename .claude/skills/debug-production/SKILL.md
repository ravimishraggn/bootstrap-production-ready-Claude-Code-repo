---
name: debug-production
description: Investigate a production incident or anomaly in an agent or service using traces, logs, and eval history to find root cause, distinguishing model/prompt regressions from code bugs from data/infra issues. Use when something is misbehaving in a deployed environment.
---

# Debug Production

A structured incident-investigation procedure for a platform where failures
can originate in code, infra, or model/prompt behavior.

## Steps

1. **Reproduce the symptom** from the report: get the correlation/trace ID
   from the user or monitoring dashboard (`.claude/rules/observability.md`).
2. **Pull the trace**: inputs, tool calls made, tool results, final model
   output, and how long each step took. This tells you which layer failed.
3. **Bucket the failure**:
   - *Infra/code bug*: tool call errored, timed out, or threw — look at
     `packages/mcp-clients` and the relevant service logs.
   - *Data issue*: tool call succeeded but returned unexpected/malformed
     data — check the upstream system (CRM, DB) directly.
   - *Model/prompt regression*: tool calls look correct but the final
     output/decision is wrong — check eval history for a recent prompt,
     schema, or model-version change around the incident time.
   - *Retrieval issue* (RAG-backed agents): check whether the right chunks
     were retrieved at all before blaming generation — hand to `rag-engineer`.
4. **Check recent changes**: `git log` on the relevant `apps/*` and
   `packages/*` paths since the last known-good state; check for upstream
   model/library version bumps too.
5. **Add a regression eval case** reproducing the failure before fixing, so
   the fix is provably effective and the bug can't silently reappear.
6. **Fix at the right layer** — don't patch a prompt to work around a code
   bug, and don't patch code to work around a bad prompt.
7. Write up root cause and fix in the incident's tracking ticket; feed any
   systemic gap (e.g. "we had no eval case for this input shape") back into
   `.claude/rules/evaluation.md` practice.

## Output

Root cause identification, a fix at the correct layer, and a new regression
eval/test case preventing recurrence.
