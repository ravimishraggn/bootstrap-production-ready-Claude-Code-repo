# Folder Structure Rules

## Top level

```
apps/           # deployable business agents + internal console
packages/       # shared libraries, consumed by apps/, never depend on apps/
infra/          # Terraform, deployment config, observability config
docs/           # ADRs, OpenAPI specs, runbooks, SDLC/collaboration docs
.claude/        # this framework: agents, skills, commands, rules, hooks
```

## Inside an agent app (`apps/<name>-agent/`)

```
src/
  schema.ts       # typed input/output (Zod) — written before the prompt
  prompt.ts       # re-exports the active prompt version
  tools.ts        # MCP tool bindings scoped to this agent
  agent.ts        # orchestration entry point
  index.ts        # public entry point for workflows/console to call
eval/
  cases.jsonl
  run-eval.ts
README.md         # inputs, outputs, tools, HITL gates, health metrics
```

## Inside a shared package (`packages/<capability>/`)

```
src/
  index.ts        # public API surface — internal modules not re-exported
  ...
test/ or *.test.ts beside source
README.md
```

## RAG-specific (`packages/rag/<source-name>/`)

```
ingest.ts
chunk.ts
embed.ts
retrieve.ts
eval/retrieval-cases.jsonl
```

## Workflow-specific (`packages/workflows/<name>/`)

```
workflow.ts
schema.ts
eval/scenarios.jsonl
```

## Rule of thumb

If you're unsure where something goes, ask: "is this reusable across ≥2
apps?" If yes → `packages/`. "Is this a deployable business capability?" If
yes → `apps/`. "Is this infrastructure/deployment mechanics?" → `infra/`.
"Is this documentation of a decision or contract?" → `docs/`. Never invent a
new top-level directory without an ADR.
