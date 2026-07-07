# Architecture Rules

## Service and agent boundaries

- One agent owns one bounded business capability. Lead Scoring, Pipeline
  Automation, ROI Calculator, and RFP Response are separate deployable
  units — never merge two workflows into one agent for convenience.
- One service owns one data domain. Don't let two services write to the
  same table; the owning service exposes an API for others.
- Agents do not call each other's internals directly. Cross-agent
  composition happens through a workflow (`packages/workflows/`) or an
  explicit event, never a direct in-process import of another agent's code.

## Dependency direction

- `apps/*` may depend on `packages/*`. `packages/*` must never depend on
  `apps/*`.
- Shared, reusable logic (tracing, retry, schema validation, MCP client
  wrappers, UI primitives) lives in `packages/`, not duplicated per-app.
- `packages/eval-harness` may depend on `packages/agent-core` but not the
  reverse.

## When to add a new package vs. extend an existing one

Add a new package when the capability is genuinely reusable across ≥2 apps
and has a coherent single responsibility. Don't create a package for
one-off logic used by a single agent — that belongs in the app itself until
a second consumer appears.

## Cross-cutting concerns checklist

Every new service or agent must address, explicitly:
1. Observability (`observability.md`) — structured logs + traces from day one.
2. Evaluation (`evaluation.md`) — if it's an agent, an eval suite before merge.
3. Human-in-the-loop classification (`human-in-the-loop.md`) for every action.
4. Security review trigger conditions (`security.md`).

## Decision records

Any decision with a non-obvious tradeoff (build vs. buy, new dependency,
new data flow, agent boundary choice) gets an ADR in
`docs/architecture/adr-NNNN-<slug>.md` before implementation, produced by
the `enterprise-architect` agent. Silent architecture decisions are not
acceptable for anything crossing service boundaries.

## Anti-patterns to reject in review

- A "god agent" that owns multiple unrelated business workflows.
- Business logic embedded directly in an API route handler or React
  component instead of a testable module.
- A new bespoke tool-calling protocol instead of using MCP.
- Direct production database access from agent code instead of going
  through a service API or a read-only MCP connection.
