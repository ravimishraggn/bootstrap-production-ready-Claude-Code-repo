# Structured Output Rules

## Schema-first

- Every agent output that is consumed by another system (UI, CRM write-back,
  Slack message, downstream workflow step, PR body) is defined by an
  explicit schema (Zod) in `schema.ts` before any prompt is written.
- The prompt's output-format instructions are generated from or kept in
  lockstep with the schema — never let prose instructions and the actual
  validator drift apart. Prefer generating the schema description shown to
  the model directly from the Zod schema.

## Validation, not trust

- Raw model output is never passed downstream unvalidated. Validate against
  the schema immediately after generation; on validation failure, retry once
  with the validation error fed back to the model, then fail explicitly
  (per `error-handling.md`) — never silently pass through malformed data.
- For RAG-backed agents, structured output includes source citations
  (document ID/section) as first-class schema fields, not embedded in free
  text, so downstream consumers can render/verify them programmatically.

## Confidence and rationale

Any output that will be human-reviewed (lead score, risk flag, RFP draft)
includes, as schema fields: a confidence/score value, a short rationale, and
the key inputs that drove the decision. This is what makes the
human-in-the-loop review meaningful rather than a rubber stamp.

## Versioning

Schema changes are versioned and backward-compatible where possible
(additive fields preferred over renames/removals). A breaking schema change
requires coordinated updates to every consumer and is called out explicitly
in the PR per `git.md`.

## Anti-patterns

- Parsing free-text model output with regex to extract structured fields —
  use native structured output / tool-calling support instead.
- A schema field typed as `string` that's actually a JSON blob the caller
  re-parses — model the nested structure explicitly.
