# Human-in-the-Loop Rules

## Classify every action

Every action an agent or workflow can take is classified as exactly one of:

| Class | Definition | Default gating |
|---|---|---|
| **Read-only** | No side effects (query CRM, read a document) | No gate; log for audit |
| **Reversible** | Side effect that can be undone cheaply (draft saved, internal flag set, Slack DM to an internal channel) | Log-and-proceed; visible in dashboard, no blocking approval |
| **Irreversible** | Side effect that's costly or impossible to undo (CRM record affecting a live deal, email sent to a prospect, RFP submitted, pipeline stage advanced) | Blocking approval required before execution |

This classification is decided at design time (`enterprise-architect` /
`create-agent` skill), documented in the agent's README, and enforced in
code — not left to the model's judgment at runtime.

## Approval mechanics

- Irreversible actions produce a proposed action (with the agent's
  rationale and confidence) and stop, surfaced to a human via the internal
  console or the `slack` MCP server, per agent.
- The human sees: what the agent wants to do, why (rationale), the
  confidence/score, and the key inputs — never just an opaque "Approve?"
  button (`frontend-engineer` owns this UI).
- Rejections are logged with the reason where the human provides one, and
  feed back into the eval suite as a case to address.

## Escalation

An agent must escalate to a human (rather than guess) when: retrieval found
no grounded answer (RAG-backed agents), confidence is below the documented
threshold, or the input is genuinely out of the agent's declared scope.
Escalating is a success case for the agent, not a failure — never tune a
prompt to reduce escalation rate without also confirming quality didn't
just get worse instead.

## Auditability

Every approval/rejection decision is retained and queryable by correlation
ID (`observability.md`) — this is what makes the platform's automated
actions defensible in a compliance review.

## Changing an action's classification

Moving an action from "requires approval" to "auto-proceed" is itself an
architecture-level decision requiring `enterprise-architect` and
`security-reviewer` sign-off, backed by a sustained low rejection rate and
strong eval scores — never done unilaterally to reduce approval friction.
