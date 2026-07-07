---
description: Scaffold a multi-step workflow composing existing agents
argument-hint: <workflow-name> [one-line description]
---

Use the `create-workflow` skill to scaffold a workflow named `$ARGUMENTS`.

First, map out the step sequence explicitly (which agents are invoked, which
steps are deterministic, what the branch conditions are) and confirm it with
the user before scaffolding code. Then follow
`.claude/skills/create-workflow/SKILL.md`: scaffold under
`packages/workflows/<workflow-name>/`, classify the overall human-in-the-loop
posture for any irreversible terminal action, and write scenario-level eval
cases covering each branch.
