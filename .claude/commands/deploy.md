---
description: Deploy a service or agent through the platform's gated pipeline
argument-hint: <app-name> <environment: staging|production>
---

Deploy `$ARGUMENTS` via the `devops-engineer` agent.

Confirm the pipeline stages have passed in order: lint/typecheck → unit
tests → integration tests → eval gate (for agent changes, per
`.claude/rules/evaluation.md`) → security scan → build → staging deploy →
smoke test. Production promotion requires explicit human confirmation — never
auto-promote to production from this command. If deploying an agent for the
first time, confirm dashboards (latency, error rate, eval score trend, HITL
approval/rejection rate) are wired per `.claude/rules/observability.md`
before go-live.
