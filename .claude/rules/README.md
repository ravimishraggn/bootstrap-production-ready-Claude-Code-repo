# Rules Index

These files are binding engineering standards for this repository — not
suggestions. Claude Code and human contributors are expected to read the
relevant file(s) before implementing in that area, and reviewers check
compliance against them explicitly. See `CLAUDE.md` for how these fit into
the overall AI-native SDLC.

| File | Covers |
|---|---|
| [architecture.md](architecture.md) | Service/agent boundaries, dependency direction, ADRs |
| [security.md](security.md) | AppSec baseline + AI-specific threats (injection, tool privilege, exfiltration) |
| [prompt-engineering.md](prompt-engineering.md) | Prompt structure, versioning, few-shot conventions |
| [llm-calls.md](llm-calls.md) | Model selection, reliability, token/cost budgets, concurrency |
| [structured-outputs.md](structured-outputs.md) | Schema-first outputs, validation, confidence/rationale fields |
| [rag.md](rag.md) | Chunking, retrieval tuning, citations, freshness |
| [mcp.md](mcp.md) | Tool design, credential scoping, idempotency, privilege review |
| [observability.md](observability.md) | Tracing, dashboards, alerting |
| [logging.md](logging.md) | Structured logs, PII redaction, log levels |
| [evaluation.md](evaluation.md) | The eval gate, suite construction, metrics |
| [guardrails.md](guardrails.md) | Input/output/action guardrails, allow-listing |
| [human-in-the-loop.md](human-in-the-loop.md) | Action classification, approval mechanics, escalation |
| [git.md](git.md) | Branching, commits, PR and review requirements |
| [naming.md](naming.md) | File, agent, tool, and branch naming conventions |
| [folder-structure.md](folder-structure.md) | Repository layout, where new code belongs |
| [testing.md](testing.md) | Test pyramid, coverage expectations, what must never happen |
| [error-handling.md](error-handling.md) | Typed errors, no silent failure, user-facing messages |

## How these are used

- Specialized agents in `.claude/agents/` reference the specific rule files
  relevant to their role.
- Skills in `.claude/skills/` follow these rules as procedure.
- `code-reviewer` and `security-reviewer` check diffs against these files
  explicitly rather than reviewing from generic taste.
- When a rule and existing code disagree, that's drift — flag it, don't
  silently follow the stale code.
