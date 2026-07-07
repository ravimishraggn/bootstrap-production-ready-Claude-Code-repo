---
description: Explain a piece of code, an architecture decision, or agent behavior
argument-hint: <file, symbol, or agent name>
---

Explain `$ARGUMENTS`.

Ground the explanation in the actual current code/config, not assumptions —
read it first. If it's an architectural pattern, check whether an ADR exists
under `docs/architecture/` and reference it. If it's agent behavior, check
the prompt, schema, and recent eval history for context on *why* it behaves
that way, not just what the code does. Tailor depth to the question: a
one-line answer for a simple lookup, a structured walkthrough (with a Mermaid
diagram if it's a flow) for something architectural.
