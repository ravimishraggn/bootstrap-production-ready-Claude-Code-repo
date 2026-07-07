# Naming Rules

## General

- Names describe what something *is* or *does*, not implementation history
  ("scoreLead", not "newScoreLeadV2" or "scoreLeadFixed").
- No abbreviations that aren't domain-standard (RFP, ROI, CRM are fine; ad
  hoc shortenings are not).
- Booleans read as predicates: `isEligible`, `hasGroundedAnswer`, not
  `eligible`, `groundedFlag`.

## Files and directories

- Business agents: `apps/<business-name>-agent/` (e.g. `lead-scoring-agent`,
  `pipeline-automation-agent`, `roi-calculator-agent`, `rfp-response-agent`).
- Shared packages: `packages/<capability>` (e.g. `agent-core`, `mcp-clients`,
  `eval-harness`, `ui-kit`, `workflows`, `rag`).
- Test files sit beside the code they cover: `foo.ts` → `foo.test.ts`;
  integration tests: `foo.integration.test.ts`; E2E specs live in
  `apps/*/e2e/*.spec.ts`.

## Agent and tool naming

- Agent names are nouns describing the business capability (`lead-scoring`),
  matching the `name:` field in its `.claude/agents/*.md` counterpart where
  a platform subagent exists for it.
- MCP tool names are `verb_noun` and unambiguous about read/write:
  `get_lead_by_id` (read), `create_pipeline_record` (write) — never a bare
  noun like `lead` or an overloaded verb like `process_lead`.

## Prompts and eval files

- Prompt versions: `v1.ts`, `v2.ts`, ... under
  `packages/agent-core/prompts/<agent>/` — never `prompt-final.ts` or
  `prompt-new.ts`.
- Eval case files: `cases.jsonl` (agent-level), `retrieval-cases.jsonl`
  (RAG-specific), `scenarios.jsonl` (workflow-level).

## Branches and commits

Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/` — see `git.md` for full
convention.
