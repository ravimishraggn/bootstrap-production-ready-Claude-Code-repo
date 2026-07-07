---
name: architecture-review
description: Review a proposed or existing design against this platform's architecture rules - service boundaries, agent scoping, dependency direction, cross-cutting concern coverage. Use before implementing a multi-service change, or to audit existing architecture for drift.
---

# Architecture Review

The procedure `enterprise-architect` follows, also usable standalone via
`/architecture` for a lighter-weight check.

## Steps

1. Read the proposal (or existing code) and identify: services/agents
   touched, new dependencies, new data flows, new external integrations.
2. Check against `.claude/rules/architecture.md`:
   - Does each service/agent own a single, clear responsibility?
   - Is the dependency direction correct (apps depend on packages, packages
     don't depend on apps; agents don't directly depend on each other's
     internals — they communicate via defined interfaces/events)?
   - Does a new capability belong in a shared package
     (`packages/agent-core`, `packages/mcp-clients`) rather than being
     duplicated per-agent?
3. Check cross-cutting concern coverage: observability, evaluation hooks
   (for agent changes), human-in-the-loop classification, security review
   trigger conditions.
4. Check blast radius: if this touches a shared package, verify it against
   all four business agents' usage, not just the one prompting the change.
5. Produce a verdict: approve, approve-with-changes (list them), or
   escalate-for-discussion (when multiple valid architectures exist with
   materially different tradeoffs — don't pick silently).

## Output

A short architecture verdict plus, for approved designs, a component/data-flow
diagram (Mermaid) and explicit handoff to the implementing agent(s).
