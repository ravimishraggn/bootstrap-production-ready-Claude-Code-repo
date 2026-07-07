---
name: create-mcp-tool
description: Scaffold a new MCP tool or server integration - schema, least-privilege credential scoping, read/write classification, idempotency handling, and registration in .mcp.json. Use when an agent needs a new external capability (CRM write, new SaaS API, internal service call).
---

# Create MCP Tool

Scaffolds a new MCP tool consistently so every tool the platform's agents can
call is scoped, typed, and classified for human-in-the-loop gating.

## Steps

1. Define exactly one capability per tool (e.g. `get_lead_by_id`, not
   `crm_query` with a free-text query param). Narrow tools are easier to
   scope, test, and gate.
2. Write the input/output schema explicitly; document it in the tool
   description so calling agents (and reviewers) know the contract without
   reading the implementation.
3. Classify the tool as **read** or **write** in its description — this
   drives default HITL gating per `.claude/rules/human-in-the-loop.md`.
   Write tools default to requiring approval unless explicitly reviewed and
   marked auto-approved for a specific low-risk case.
4. If the tool writes to an external system, make it idempotent (accept an
   idempotency key, or support a dry-run flag) so agent retries can't
   double-submit.
5. Scope credentials to the minimum needed — a read-only DB user for
   read tools, a scoped API token for write tools. Never reuse a
   full-admin credential across tools.
6. Register the server in `.mcp.json` with a `_use` comment naming which
   agent(s) consume it and why.
7. Test against a sandbox/staging instance of the target system before
   pointing any agent at it in development.
8. Route the finished tool through `security-reviewer` before it's given to
   any agent with both this tool and broad read access elsewhere (tool
   chaining risk).

## Output

A registered MCP tool with a narrow schema, correct read/write
classification, and sandbox-tested behavior.
