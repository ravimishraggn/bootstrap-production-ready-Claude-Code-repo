# Repository Structure — Business Agents

This is the concrete layout for implementing the four initial business
agents, following `.claude/rules/folder-structure.md` and
`.claude/rules/naming.md`. No application code exists yet — this is the
target shape `create-agent` scaffolds into.

```
ai-platform/
├── CLAUDE.md
├── .claude/                             # framework (already scaffolded)
├── .mcp.json
├── apps/
│   ├── lead-scoring-agent/
│   │   ├── src/
│   │   │   ├── schema.ts                # LeadInput, LeadScoreOutput (Zod)
│   │   │   ├── prompt.ts                # -> prompts/lead-scoring/v1.ts
│   │   │   ├── tools.ts                 # CRM read, firmographic-enrichment read
│   │   │   ├── agent.ts                 # score() orchestration
│   │   │   └── index.ts
│   │   ├── eval/
│   │   │   ├── cases.jsonl
│   │   │   └── run-eval.ts
│   │   └── README.md                    # inputs/outputs/tools/HITL: read-only
│   │
│   ├── pipeline-automation-agent/
│   │   ├── src/
│   │   │   ├── schema.ts                # PipelineSnapshot, RiskFlag, NextAction
│   │   │   ├── prompt.ts
│   │   │   ├── tools.ts                 # CRM read, CRM write (reversible: stage note)
│   │   │   ├── state-machine.ts         # deterministic stage-transition logic
│   │   │   ├── agent.ts
│   │   │   └── index.ts
│   │   ├── eval/
│   │   └── README.md                    # HITL: reversible (internal notes) /
│   │                                     #       irreversible (stage advance) mixed
│   │
│   ├── roi-calculator-agent/
│   │   ├── src/
│   │   │   ├── schema.ts                # DiscoveryCallInput, ROIModelOutput
│   │   │   ├── prompt.ts
│   │   │   ├── tools.ts                 # pricing-data read, browser (public benchmarks)
│   │   │   ├── calculators/             # deterministic financial math, not LLM-generated
│   │   │   ├── agent.ts
│   │   │   └── index.ts
│   │   ├── eval/
│   │   └── README.md                    # HITL: reversible (draft), irreversible (send to prospect)
│   │
│   ├── rfp-response-agent/
│   │   ├── src/
│   │   │   ├── schema.ts                # RfpQuestion, DraftAnswer (with citations)
│   │   │   ├── prompt.ts
│   │   │   ├── tools.ts                 # knowledge-base retrieval, CRM read
│   │   │   ├── agent.ts
│   │   │   └── index.ts
│   │   ├── eval/
│   │   │   ├── cases.jsonl              # generation quality
│   │   │   └── retrieval-cases.jsonl    # retrieval recall/precision
│   │   └── README.md                    # HITL: irreversible (submission gated, always)
│   │
│   └── console/                         # internal web app (frontend-engineer)
│       ├── src/
│       │   ├── pages/                   # lead review, pipeline dashboard,
│       │   │                            # ROI draft review, RFP approval queue
│       │   └── components/
│       └── e2e/
│
├── packages/
│   ├── agent-core/                      # tracing, retry, schema validation,
│   │   │                                # LLM client wrapper, agent registry
│   │   └── prompts/
│   │       ├── lead-scoring/v1.ts
│   │       ├── pipeline-automation/v1.ts
│   │       ├── roi-calculator/v1.ts
│   │       └── rfp-response/v1.ts
│   ├── mcp-clients/                     # typed wrappers around each MCP server
│   ├── eval-harness/                    # shared eval runner, metrics, reporting
│   ├── rag/
│   │   └── rfp-knowledge-base/          # ingest/chunk/embed/retrieve for RFP agent
│   ├── workflows/
│   │   └── lead-to-pipeline/            # composes lead-scoring + pipeline-automation
│   └── ui-kit/                          # shared React primitives for console
│
├── infra/
│   ├── terraform/
│   └── observability/                   # dashboard-as-code, alert rules
│
└── docs/
    ├── ai-native-sdlc.md
    ├── repository-structure.md          # this file
    ├── collaboration-model.md
    ├── architecture/                    # ADRs, one per significant decision
    ├── openapi/                         # per-service API specs
    └── runbooks/                        # incident/on-call playbooks
```

## Why this shape

- **One `apps/*-agent` per business capability** enforces the platform's
  agent-boundary rule (`.claude/rules/architecture.md`) — each is
  independently deployable and independently evaluable.
- **`calculators/` inside `roi-calculator-agent`** is deliberate: the actual
  financial math (payback period, NPV, discount rate application) is
  deterministic code, not LLM-generated — the agent's job is extracting
  discovery-call inputs and narrating the output, not doing arithmetic.
  This is a concrete instance of "don't use an LLM for what determinism
  does better."
- **`state-machine.ts` inside `pipeline-automation-agent`** reflects the
  `ai-agent-engineer` design pattern: deterministic control flow around the
  LLM call for multi-step workflows, rather than an unbounded agentic loop.
- **`packages/workflows/lead-to-pipeline`** is the composition layer: it
  calls the Lead Scoring Agent, then conditionally the Pipeline Automation
  Agent, without either agent depending on the other directly.
- **Mixed HITL classification within one agent** (Pipeline Automation, ROI
  Calculator) is expected and correct — classification is per-action, not
  per-agent (`.claude/rules/human-in-the-loop.md`).
