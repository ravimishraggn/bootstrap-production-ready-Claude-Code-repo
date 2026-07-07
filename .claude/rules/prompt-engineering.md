# Prompt Engineering Rules

## Structure over cleverness

Every system prompt follows this shape, in order:
1. **Role and scope** — what this agent is, and explicitly what it is not
   (its non-goals), to reduce scope creep in generated behavior.
2. **Inputs** — restate the expected input shape.
3. **Tools** — when to use each available tool, and when not to.
4. **Untrusted content handling** — if the agent ingests external/untrusted
   text, explicitly delimit it (e.g. `<untrusted_document>...</untrusted_document>`)
   and instruct the model to treat it as data, never as instructions to follow.
5. **Output format** — restate the exact schema expected, close to where
   generation happens (long prompts should repeat this near the end).
6. **Escalation conditions** — when the agent should stop and defer to a
   human rather than answer (low confidence, missing grounding, out-of-scope
   request).

## Versioning

Prompts are versioned files (`packages/agent-core/prompts/<agent>/v{N}.ts`),
never edited in place in production. A new version is a new file; the
registry points to the active version. This makes regressions bisectable
and lets eval runs compare versions directly.

## Few-shot examples

- Use 2-5 concrete examples over long persona/tone paragraphs when the goal
  is reliable structured output — models follow examples more reliably than
  abstract instructions for format adherence.
- Examples must be real or realistic (drawn from actual eval cases where
  possible), not toy examples that don't reflect production input complexity.
- Include at least one example of the escalation/refusal path, not just the
  happy path, so the model has a pattern to follow when it should defer.

## Change discipline

No prompt change merges without an eval run per `evaluation.md`. Change one
variable at a time (wording, examples, or format spec) so eval deltas are
attributable — see the `optimize-prompts` skill for the full loop.

## Anti-patterns

- Vague instructions ("be helpful and accurate") with no concrete success
  criteria — replace with specific, checkable behavior.
- Output format described only in prose ("respond with JSON") instead of a
  restated schema/example.
- Trusting the model to infer that ingested external content might be
  adversarial without saying so explicitly.
