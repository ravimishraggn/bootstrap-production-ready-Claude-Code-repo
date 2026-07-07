---
description: Run code and security review on the current diff or a named PR
argument-hint: [PR number, optional]
---

Review the current working diff (or PR `$ARGUMENTS` if a number is given,
via `gh pr diff`).

1. Invoke the `code-reviewer` agent for correctness, standards compliance,
   test coverage, and scope discipline.
2. If the diff touches authentication, secrets, MCP tool definitions,
   `.mcp.json`, `.claude/settings.json`, or PII/customer-data handling, also
   invoke the `security-reviewer` agent.
3. If the diff touches an agent's prompt, tools, or schema, confirm
   `evaluate-agent` was run and ask for the eval evidence if missing.

Report findings ranked by severity, clearly separating blocking issues from
suggestions. Do not apply fixes unless explicitly asked.
