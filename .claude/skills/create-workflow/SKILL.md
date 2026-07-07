---
name: create-workflow
description: Scaffold a multi-step business workflow that orchestrates one or more existing agents plus deterministic steps (e.g. "score lead, then if high-value notify Slack and create a pipeline record"). Use when composing existing agent capabilities into an end-to-end process, rather than building a new single agent.
---

# Create Workflow

Scaffolds a workflow — a deterministic orchestration layer that composes one
or more agents and plain service calls into an end-to-end business process,
as distinct from a single agent's internal control flow.

## When to use

- The requirement spans more than one agent (e.g. lead scoring feeds pipeline
  automation) or mixes agent calls with plain deterministic steps
  (CRM update, Slack notification).
- Not for building a new standalone agent (`create-agent`) or a single
  agent's internal tool-use loop (that's the agent's own orchestration,
  owned by `ai-agent-engineer`).

## Steps

1. Map the workflow as an explicit step sequence with branch conditions —
   write this out before coding, e.g.:
   ```
   1. Lead Scoring Agent scores inbound lead
   2. if score >= threshold: create pipeline record (deterministic)
   3. Pipeline Automation Agent flags initial stage risk
   4. if risk == high: notify Slack channel (HITL: informational, no gate)
   5. if score < threshold: no further action, log and stop
   ```
2. Scaffold under `packages/workflows/<workflow-name>/`:
   ```
   workflow.ts       # step sequence, branch logic, error/retry per step
   schema.ts         # workflow input + per-step context types
   eval/
     scenarios.jsonl # end-to-end scenarios covering each branch
   ```
3. Each step is either an agent invocation (schema-validated in/out) or a
   deterministic service call — never inline ad-hoc LLM calls inside the
   workflow itself; that logic belongs in an agent.
4. Classify the workflow's overall HITL posture: even if individual agent
   steps are auto-approved, an irreversible terminal action (e.g. RFP
   submission) still requires its own gate per
   `.claude/rules/human-in-the-loop.md`.
5. Trace the whole workflow under one correlation ID spanning all steps/agents
   so an incident can be debugged end-to-end (`debug-production`).
6. Write scenario-level eval/tests covering each branch, not just the
   individual agents in isolation.

## Output

A working, traced, tested workflow composing existing agents — registered in
`docs/repository-structure.md`.
