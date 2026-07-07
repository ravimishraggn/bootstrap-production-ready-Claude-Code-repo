# CLAUDE.md — Internal AI Agent Platform

This file is the entry point Claude Code reads on every session in this repository.
It exists so that any engineer — or any Claude Code session — starts with the same
shared understanding of what this platform is, how it is built, and how work is
expected to flow through it. Treat it as the constitution of the repo: specific
standards live in `.claude/rules/`, this file is the index and the philosophy.

## What this repository is

The **Internal AI Agent Platform** automates high-value Sales, RevOps, and
Marketing workflows for the company. It is not a single app — it is a platform
of composable agents, shared infrastructure, and evaluation tooling that lets us
ship new automated workflows in days, not quarters.

Initial business agents (see `docs/repository-structure.md` for their layout):

1. **Lead Scoring Agent** — scores inbound leads using CRM + firmographic signals.
2. **Sales Pipeline Automation Agent** — monitors pipeline stages, flags risk, drafts next-step actions.
3. **ROI Calculator Agent** — generates prospect-specific ROI models from discovery call data.
4. **RFP Response Generation Agent** — drafts RFP/RFI responses from a governed knowledge base.

## AI-native SDLC

Every feature in this repo — human-authored or Claude-authored — moves through the
same lifecycle. This is not bureaucracy; it is what makes AI-assisted development
auditable at enterprise scale:

```
Requirement → Architecture → Implementation → Testing → Evaluation
→ PR Creation → Deployment → Monitoring → Continuous Improvement
```

- **Requirement**: captured as a GitHub issue or Jira ticket, linked in the PR.
- **Architecture**: use `/architecture` or the `enterprise-architect` agent before
  writing code for anything touching more than one service.
- **Implementation**: scoped to the relevant specialized subagent (backend, frontend,
  AI agent, RAG, MCP — see `.claude/agents/`).
- **Testing**: unit + integration tests are mandatory; use `/test` or `write-tests`.
- **Evaluation**: any change to agent prompts, tools, or retrieval must run through
  `/evaluate` (see `.claude/skills/evaluate-agent/`) before merge.
- **PR Creation**: use `/create-pr`, which enforces the PR template and checklist.
- **Deployment**: via `/deploy`, gated by CI, evaluations, and security review.
- **Monitoring**: every agent emits structured traces (see `.claude/rules/observability.md`).
- **Continuous Improvement**: eval regressions and production incidents feed back
  into prompts, tests, and this framework itself.

## How Claude Code should behave in this repo

1. **Read before you plan.** Before implementing, check `.claude/rules/` for the
   relevant standard (architecture, security, prompt-engineering, testing, etc.)
   and `docs/architecture/` (once populated) for existing decisions. Do not
   re-derive standards that are already written down — follow them.
2. **Prefer the specialized agent.** If a task matches an agent in `.claude/agents/`,
   delegate to it rather than solving generically. A RAG task goes to
   `rag-engineer`, not `backend-engineer`.
3. **Every LLM-facing change gets evaluated.** No prompt, tool schema, or model
   change merges without a corresponding eval run (`.claude/rules/evaluation.md`).
4. **No silent scope creep.** Implement what was asked. Flag related issues via
   `spawn_task`/follow-up notes rather than expanding the current change.
5. **Security and guardrails are not optional.** All agents that take actions
   (not just answer questions) must respect `.claude/rules/guardrails.md` and
   `.claude/rules/human-in-the-loop.md`.
6. **Structured output over prose.** Any agent output consumed by another system
   (CRM write-back, Slack message, PR body) must conform to
   `.claude/rules/structured-outputs.md`.

## Repository map

```
CLAUDE.md                  # this file
.claude/
  settings.json             # permissions, hooks, model routing
  agents/                   # specialized subagents
  skills/                   # reusable multi-step capabilities
  commands/                 # slash-command entry points
  rules/                    # binding engineering standards
  hooks/                    # lifecycle scripts (lint, secrets, format)
  output-styles/            # response style presets
.mcp.json                   # MCP server configuration
docs/
  ai-native-sdlc.md          # detailed SDLC walkthrough
  repository-structure.md    # layout for the 4 business agents
  collaboration-model.md     # how engineers + Claude Code work together
apps/                       # business agents (see repository-structure.md)
packages/                   # shared libraries (agent-core, mcp-clients, eval-harness, ui-kit)
infra/                      # IaC, deployment, observability config
```

## Tech stack conventions

- **Language**: TypeScript (Node 20+) for agent orchestration and APIs; Python 3.11+
  permitted only for ML/eval tooling that needs the scientific stack.
- **Agent framework**: Claude Agent SDK for orchestration; MCP for all tool/data
  integrations (never hand-roll a bespoke tool-calling protocol).
- **Package manager**: pnpm workspaces (monorepo).
- **Testing**: Vitest (unit/integration), Playwright (E2E), a custom eval harness
  (`packages/eval-harness`) for agent-quality regression testing.
- **Infra**: Terraform + containers; deploy via `/deploy` (see `.claude/rules/`).

## Non-negotiables

- Never commit secrets, API keys, or customer data to the repo. Use the
  `pre-commit-secrets` hook and `.env.example` pattern.
- Never disable a failing test or eval to unblock a merge — fix root cause or
  get explicit sign-off recorded in the PR.
- Never let an agent take an irreversible action (CRM write, email send, RFP
  submission) without the human-in-the-loop gate defined per-agent.
- Never bypass `/review` for changes to `.claude/` itself — this framework is
  production infrastructure and changes to it are reviewed like code.

## Where to go next

- Building a new agent? Start with `/new-agent` or `.claude/skills/create-agent/`.
- Adding an API endpoint? `/new-agent` is for agents; use `create-api` skill for
  plain services.
- Wiring a new data source? `.claude/skills/create-mcp-tool/`.
- Reviewing someone else's PR? `/review`.
- Full standards index: `.claude/rules/README.md`.
- Consuming this framework from another repo, or publishing it to GitHub?
  `docs/multi-repo-guide.md` and `docs/plugin-versioning.md`.
