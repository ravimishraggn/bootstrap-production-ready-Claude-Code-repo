# AI-Native SDLC

This document walks through the lifecycle every change follows in this
repository, and which Claude Code framework component owns each stage. It is
the detailed companion to the summary in `CLAUDE.md`.

```
Requirement → Architecture → Implementation → Testing → Evaluation
→ PR Creation → Deployment → Monitoring → Continuous Improvement
        ↑______________________________________________________|
```

The loop closes: production monitoring feeds new requirements (bug fixes,
eval-gap closures, drift corrections), not just new features.

## 1. Requirement

A requirement enters as a GitHub issue or Jira ticket. Claude Code reads it
via the `github`/`jira` MCP servers rather than having it re-typed into
chat. Every downstream artifact (ADR, PR, eval report) links back to it.

**Owns this stage**: the requester (PM/Sales/RevOps stakeholder) + whichever
engineer picks up the ticket.

## 2. Architecture

For anything touching more than one service, or introducing a new data flow,
external integration, or agent boundary decision: `/architecture` invokes
`enterprise-architect`, which produces an ADR in `docs/architecture/` before
any code is written. Trivial, single-file changes skip this stage.

**Owns this stage**: `enterprise-architect` agent, `architecture-review` skill.

## 3. Implementation

Work is routed to the specialized agent matching the change:
`backend-engineer`, `frontend-engineer`, `ai-agent-engineer`, `rag-engineer`,
or `mcp-integration-engineer`. New agents/APIs/RAG pipelines/tools are
scaffolded via `create-agent`, `create-api`, `create-rag`, `create-mcp-tool`
so every new capability starts with the platform's conventions (tracing,
schema validation, least-privilege tools) rather than reinventing them.

**Owns this stage**: the relevant specialized engineering agent.

## 4. Testing

Conventional test coverage (unit/integration/E2E) is added via `write-tests`
/ `/test`, per `.claude/rules/testing.md`. This stage is distinct from
evaluation — it verifies the code does what it's supposed to mechanically,
not whether the agent's judgment is good.

**Owns this stage**: `test-engineer` agent, `write-tests` skill.

## 5. Evaluation

Any change to an agent's prompt, tools, schema, or model version runs
through `/evaluate` (`evaluate-agent` skill): baseline vs. candidate scored
on task accuracy, schema validity, groundedness, refusal rate, latency, and
cost. This is the gate that makes "the model changed its mind" a measured,
attributable regression instead of a silent surprise in production.

**Owns this stage**: `ai-agent-engineer` / `prompt-engineer`, backed by
`packages/eval-harness`.

## 6. PR Creation

`/create-pr` (`generate-pr` skill) verifies CI is green and eval evidence is
attached, then opens a PR with the standard template: summary, linked
requirement, test plan, eval evidence, risk/rollback. `/review` runs
`code-reviewer` and, where triggered, `security-reviewer`.

**Owns this stage**: the authoring engineer + `code-reviewer` /
`security-reviewer`.

## 7. Deployment

`/deploy` (`devops-engineer`) runs the gated pipeline: lint/typecheck → unit
→ integration → eval gate → security scan → build → staging → smoke test →
manual production promotion. No auto-promotion to production.

**Owns this stage**: `devops-engineer` agent.

## 8. Monitoring

Every agent and service ships with tracing, structured logs, and dashboards
(latency, error rate, eval score trend, HITL approval/rejection rate) per
`.claude/rules/observability.md` — wired before go-live, not after an
incident.

**Owns this stage**: `devops-engineer`, with dashboards defined jointly with
the owning engineering agent.

## 9. Continuous Improvement

Production incidents route through `debug-production`, which finds root
cause and, critically, adds a regression eval/test case so the same failure
mode can't silently reappear. Eval score trends that drift downward without
an incident still trigger a `prompt-engineer` investigation via
`optimize-prompts`. This is what closes the loop back to "Requirement" —
every incident or drift is itself a new, well-scoped requirement.

**Owns this stage**: whoever is on call, handing off root-cause fixes to the
owning engineering agent.
