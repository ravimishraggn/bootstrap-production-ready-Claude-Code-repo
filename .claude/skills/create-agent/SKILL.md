---
name: create-agent
description: Scaffold a new business or platform agent end-to-end - directory structure, typed I/O schema, MCP tool wiring, prompt skeleton, eval suite stub, and human-in-the-loop classification. Use when starting a brand-new agent (e.g. a 5th business agent) rather than modifying an existing one.
---

# Create Agent

Scaffolds a new agent consistent with the platform's conventions so every
agent has the same shape: typed schema, tracing, eval hooks, and HITL gating
from day one instead of bolted on later.

## When to use

- A new business agent is being added (mirrors Lead Scoring / Pipeline
  Automation / ROI Calculator / RFP Response).
- A new internal/platform agent (e.g. a triage agent) is needed.

Do not use this for modifying an existing agent's logic — that's
`ai-agent-engineer` working directly in the existing app.

## Steps

1. **Clarify scope with the user** if not already specified via an ADR:
   agent name, primary business outcome, inputs, and whether its actions are
   read-only, reversible, or irreversible (drives HITL gating).
2. **Check for an ADR.** If none exists for this agent, hand off to
   `enterprise-architect` first — do not scaffold an unreviewed design.
3. **Create the directory** at `apps/<agent-name>-agent/` following
   `docs/repository-structure.md`:
   ```
   apps/<agent-name>-agent/
     src/
       schema.ts          # typed input/output (Zod)
       prompt.ts          # v1 system prompt (see prompt-engineering.md)
       tools.ts           # MCP tool bindings, least-privilege scoped
       agent.ts           # orchestration entry point
       index.ts
     eval/
       cases.jsonl        # seed eval cases (start with >=10 real examples)
       run-eval.ts
     README.md
   ```
4. **Wire shared primitives** from `packages/agent-core` (tracing, retry,
   schema validation) — do not reimplement these per-agent.
5. **Classify every action** the agent can take as read-only / reversible /
   irreversible per `.claude/rules/human-in-the-loop.md`, and wire the
   corresponding gate (auto-proceed, log-and-proceed, or approval-required).
6. **Write the README** documenting inputs, outputs, tools, and HITL gates.
7. **Stub the eval suite** with at least 10 realistic cases before writing
   the first line of prompt — this is the definition of done for scaffolding,
   not an optional follow-up.
8. Hand off implementation to `ai-agent-engineer`, prompt tuning to
   `prompt-engineer`, and any new MCP tool needs to `mcp-integration-engineer`.

## Output

A working skeleton that compiles, has a passing (trivial) eval run, and is
registered in `docs/repository-structure.md` and the platform's agent
registry (`packages/agent-core/registry.ts`).
