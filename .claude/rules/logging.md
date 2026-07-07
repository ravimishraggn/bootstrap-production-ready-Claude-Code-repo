# Logging Rules

## Structure

- All logs are structured (JSON), never bare `console.log` strings, so they
  can be queried and correlated by trace ID, agent name, and severity.
- Every log line includes: timestamp, severity, correlation/trace ID, the
  emitting service/agent, and a machine-parseable event name in addition to
  a human-readable message.

## PII and customer data

- Never log raw PII or customer data in plaintext: email addresses, phone
  numbers, full names in free-text fields, deal values tied to an
  identifiable customer, or RFP document contents.
- Redact at the logging boundary (a shared redaction helper in
  `packages/agent-core`), not ad hoc at each call site — this is what keeps
  redaction consistent as new log call sites are added.
- Log references (record IDs) instead of the data itself wherever the
  reader only needs to look the record up, not see its contents in the log.

## Levels

- `error`: something failed and needs attention (tool call error, validation
  failure after retry, unhandled exception).
- `warn`: degraded but recovered (retry succeeded, fallback path taken,
  eval score trending down but still above floor).
- `info`: normal operational events (agent run started/completed, workflow
  step transitions, HITL approval/rejection recorded).
- `debug`: verbose detail for local development only; not enabled in
  production by default given cost and PII-surface-area concerns.

## Retention

Logs containing any customer-linked data follow the platform's data
retention policy (see `infra/` config) — don't introduce a new log sink that
bypasses the existing retention/redaction pipeline.
