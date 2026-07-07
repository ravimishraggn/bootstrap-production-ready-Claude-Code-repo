---
description: Review a proposed design or audit existing architecture against platform rules
argument-hint: [area or proposal description]
---

Invoke the `enterprise-architect` agent (or the lighter-weight
`architecture-review` skill for an existing-code audit) on `$ARGUMENTS`.

Check service/agent boundaries, dependency direction, and shared-package
reuse against `.claude/rules/architecture.md` and
`.claude/rules/folder-structure.md`. Identify cross-cutting concerns
(observability, evaluation, human-in-the-loop, security) and route them
explicitly. Produce a Mermaid diagram and an explicit list of alternatives
considered. If multiple valid architectures exist with materially different
tradeoffs, stop and ask the user rather than deciding silently.
