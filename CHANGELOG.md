# Changelog — `ai-platform` shared Claude Code framework

All notable changes to the shared agents, skills, commands, rules, and hooks
are recorded here. This file is what every consuming repo's engineers check
before running `claude plugin update` — see
`docs/plugin-versioning.md` for the full upgrade process.

Versioning follows semver, applied to the framework as a whole (see
`docs/plugin-versioning.md` for what counts as major/minor/patch here).

## [1.0.0] — 2026-07-07

Initial release.

- 12 specialized agents (`enterprise-architect` through `documentation-engineer`).
- 12 skills (`create-agent` through `create-workflow`).
- 10 commands (`/new-agent` through `/architecture`).
- 17 binding rules covering architecture, security, prompt engineering,
  LLM calls, structured outputs, RAG, MCP, observability, logging,
  evaluation, guardrails, human-in-the-loop, git, naming, folder structure,
  testing, error handling.
- 4 lifecycle hooks (secrets scan, destructive-command guard, auto-format,
  session audit log).
- `.mcp.json` with 9 servers: GitHub, Jira, Postgres, Playwright,
  Filesystem, Context7, Slack, OpenAPI, Browser.
