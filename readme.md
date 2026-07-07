# Internal AI Agent Platform

An AI-first Claude Code engineering framework for a SaaS company's internal
Sales, RevOps, and Marketing automation platform.

This repository currently contains the **Claude Code development framework**
— the standards, agents, skills, commands, and conventions a team uses to
build the platform — ahead of the application code itself.

Start here:

- [CLAUDE.md](CLAUDE.md) — project constitution: what this platform is, the
  AI-native SDLC, and how Claude Code should behave in this repo.
- [.claude/rules/README.md](.claude/rules/README.md) — index of binding
  engineering standards (architecture, security, prompt engineering, RAG,
  MCP, observability, evaluation, guardrails, human-in-the-loop, testing, and more).
- [docs/ai-native-sdlc.md](docs/ai-native-sdlc.md) — how a requirement flows
  from idea to production and back into continuous improvement.
- [docs/repository-structure.md](docs/repository-structure.md) — the target
  layout for the four initial business agents (Lead Scoring, Pipeline
  Automation, ROI Calculator, RFP Response).
- [docs/collaboration-model.md](docs/collaboration-model.md) — how engineers
  and Claude Code collaborate day to day, and how this scales into an AI
  Center of Excellence.

## Framework layout

```
.claude/
  settings.json     # permissions, hooks, model routing
  agents/            # 12 specialized subagents
  skills/            # 12 reusable multi-step capabilities
  commands/          # 10 slash commands
  rules/             # 17 binding engineering standards
  hooks/             # lifecycle scripts (secrets scan, formatting, audit log)
  output-styles/     # response style presets
.mcp.json            # MCP servers: GitHub, Jira, Postgres, Playwright,
                      # Filesystem, Context7, Slack, OpenAPI, Browser
```
