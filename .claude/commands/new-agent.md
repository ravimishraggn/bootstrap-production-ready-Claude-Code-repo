---
description: Scaffold a new business or platform agent end-to-end
argument-hint: <agent-name> [one-line purpose]
---

Use the `create-agent` skill to scaffold a new agent named `$ARGUMENTS`.

Before scaffolding:
1. Check whether an ADR already exists for this agent under `docs/architecture/`.
   If not, invoke the `enterprise-architect` agent first to produce one —
   do not scaffold an unreviewed design.
2. Confirm with the user (if not already clear from context): primary
   business outcome, inputs, and whether the agent's actions are read-only,
   reversible, or irreversible (this drives human-in-the-loop gating).

Then scaffold per `.claude/skills/create-agent/SKILL.md`: directory
structure, typed schema, MCP tool wiring, prompt skeleton, and an eval suite
stub with at least 10 seed cases. Register the new agent in
`docs/repository-structure.md` and `packages/agent-core/registry.ts`.
