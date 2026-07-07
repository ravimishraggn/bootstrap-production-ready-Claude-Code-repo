# Error Handling Rules

## Typed errors

- Model expected failure modes as a typed union/result type, not generic
  thrown `Error` — callers should be able to switch/match on error variants
  (e.g. `CrmLookupTimeout | CrmRecordNotFound | CrmUnauthorized`).
- Reserve thrown exceptions for truly exceptional, unexpected conditions
  (programmer error, invariant violation) — expected failure paths (not
  found, timeout, validation failure, low-confidence result) are values, not
  exceptions.

## No silent failure

- Never catch an error and swallow it silently (empty catch block). At
  minimum, log it with context (correlation ID, what was attempted); usually
  also surface it to the caller as a typed failure.
- Never let an agent silently substitute a default/guessed value when a
  dependency fails — return an explicit failure so the caller (workflow or
  UI) can decide how to handle it, per `human-in-the-loop.md` escalation
  rules.

## LLM- and tool-specific errors

- A tool call failure returns a structured error the agent can reason about
  (see `mcp.md`) — the agent's control flow should have an explicit branch
  for "the tool failed," not just assume success.
- A schema-validation failure on model output triggers one retry with the
  validation error fed back to the model; if it fails again, surface a typed
  "generation failed validation" error rather than passing through
  unvalidated data (`structured-outputs.md`).

## User/operator-facing errors

- Error messages shown in the UI or to an operator are actionable ("CRM
  lookup timed out — retry, or check CRM status page") not generic ("An
  error occurred").
- Never leak internal stack traces, raw provider error payloads, or
  infrastructure details to end users; log those internally and show a
  sanitized message.

## Testing

Every typed error variant has at least one test exercising it end-to-end
through the calling code's handling logic, per `testing.md`.
