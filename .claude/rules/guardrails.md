# Guardrail Rules

## Input guardrails

- Any agent accepting free-text or untrusted input validates/sanitizes it
  at the boundary and explicitly delimits it in the prompt as untrusted data
  (`prompt-engineering.md`), so injected instructions in that content can't
  redirect the agent's tool use or behavior.
- Reject or flag input that is malformed, excessively large, or outside the
  agent's declared scope rather than attempting a best-effort answer.

## Output guardrails

- Structured-output validation (`structured-outputs.md`) is itself a
  guardrail: malformed output never reaches a downstream system.
- Any output that will be rendered as HTML, sent as an email, or posted to
  Slack is escaped/sanitized appropriately before rendering.
- Content-level guardrails (no fabricated pricing in ROI calculations, no
  RFP commitments not grounded in the retrieved knowledge base) are
  enforced by requiring citations/grounding, not by hoping the model
  self-restrains.

## Action guardrails

- Every tool available to an agent is scoped to least privilege
  (`mcp.md`) — the guardrail against an agent taking an unintended action is
  primarily "it doesn't have the tool to do that," not a prompt instruction
  asking it not to.
- Irreversible actions require a human-in-the-loop gate regardless of the
  model's confidence (`human-in-the-loop.md`) — confidence is not a
  substitute for a gate on irreversible effects.

## Allow-lists over deny-lists

Prefer explicitly allow-listing what an agent's tools/outputs can do over
trying to deny-list every bad behavior — deny-lists are inherently
incomplete against a general-purpose model.

## Testing guardrails

Guardrails are tested with adversarial eval cases (prompt injection
attempts, malformed input, out-of-scope requests) as part of the standard
eval suite (`evaluation.md`), not treated as a separate one-off audit.
