---
name: optimize-prompts
description: Diagnose and improve an underperforming prompt using eval evidence - identify the specific failure mode, form a hypothesis, make one targeted change, and re-measure. Use when an agent's eval score is stagnant or regressed, not for first-draft prompt writing.
---

# Optimize Prompts

A disciplined loop for improving prompt quality with evidence, avoiding the
trap of "vibes-based" prompt tuning that can't be attributed or reproduced.

## Steps

1. **Pull the eval failures**: run `evaluate-agent` and collect the specific
   cases where the agent underperforms — read actual transcripts, not just
   the aggregate score.
2. **Classify the failure mode**: is it (a) wrong reasoning/facts, (b) wrong
   output format/schema violation, (c) wrong tool selection, (d) over- or
   under-triggering a refusal/escalation, (e) retrieval bringing in the wrong
   context (if RAG-backed — hand to `rag-engineer` instead)?
3. **Form one hypothesis** per iteration: e.g. "the model ignores the output
   schema when the input is long because the schema instruction is buried
   before the input" → move schema restatement to right before the response
   is generated.
4. **Change one variable**: wording, example set, or output-format
   instruction — not several at once, so the eval delta is attributable.
5. **Version the prompt** (`v{N}.ts`) rather than overwriting, so a
   regression can be bisected later.
6. **Re-run the eval** and compare candidate vs. baseline on the full suite,
   not just the targeted cases — confirm no regression elsewhere.
7. Repeat until the target failure mode is resolved or the tradeoff is
   accepted and documented.

## Output

A prompt version diff plus before/after eval scores demonstrating the
specific failure mode addressed with no regression elsewhere.
