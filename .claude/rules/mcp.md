# MCP Rules

## Tool design

- One tool = one clear capability with a narrow, explicit input schema.
  Reject "kitchen sink" tools that accept a free-text command or generic
  query string — they're impossible to scope or gate correctly.
- Every tool description states, in the first sentence, whether it is
  **read** or **write**, and what system it touches. This classification
  drives default human-in-the-loop gating (`human-in-the-loop.md`).
- Write-capable tools must be idempotent (accept an idempotency key) or
  support a dry-run mode, so a retry or bug can't double-submit an action
  (double-write a CRM record, double-send an email, double-submit an RFP).

## Credentials

- Every MCP server's credentials are scoped to the minimum needed: a
  read-only DB role for read-only servers, a narrowly-scoped API token for
  write-capable servers. Never reuse an admin/full-access credential across
  multiple tools.
- Credentials are read from environment variables (`${VAR}` expansion in
  `.mcp.json`), never hardcoded — enforced by the `pre-edit-secrets-scan`
  hook.

## Registration and documentation

- Every server in `.mcp.json` carries a `_use` comment naming which agent(s)
  consume it and why — this file is the map for understanding what the
  platform can touch, so it must stay accurate.
- New tools are tested against a sandbox/staging instance of the target
  system before any agent is pointed at them in development, and certainly
  before production.

## Privilege review

Any agent holding both a broad-read tool (customer/PII data) and an
external-write tool (Slack, email, arbitrary HTTP fetch) in the same context
is a tool-chaining risk and requires explicit `security-reviewer` sign-off
— see `security.md`.

## Error handling

Tool failures return structured errors the calling agent can reason about
(error code + message), never a raw stack trace or provider-specific error
shape leaked directly into agent context.
