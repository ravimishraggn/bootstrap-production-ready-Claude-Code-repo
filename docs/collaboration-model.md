# Collaboration Model

How engineers and Claude Code actually work together day to day in this
repository, and how this scales into an organizational capability.

## 1. A developer's daily loop

A typical day for an engineer on this platform:

1. **Pick up a ticket** — Jira/GitHub issue, read via the relevant MCP
   server so Claude Code has the actual requirement, not a paraphrase.
2. **Scope check** — if the change is architectural (new agent, new
   integration, cross-service data flow), run `/architecture` first and get
   an ADR before writing code. If it's a contained fix, skip straight to
   implementation.
3. **Implement with the right specialist** — the engineer doesn't manually
   context-switch mental models; they invoke the matching agent
   (`backend-engineer`, `ai-agent-engineer`, `rag-engineer`, etc.) or let
   Claude Code route to it, so the standards for that domain
   (`.claude/rules/*.md`) are applied automatically rather than
   re-remembered every time.
4. **Test as you go** — `/test` adds coverage inline with implementation,
   not as an afterthought.
5. **Evaluate before merge** — if agent behavior changed, `/evaluate` runs
   and the engineer reads the actual failing transcripts, not just the
   aggregate score, before deciding the change is ready.
6. **Ship** — `/create-pr` opens a PR with evidence attached; `/review` runs
   automated code + security review before requesting human review.
7. **Watch it land** — after merge, `/deploy` promotes through staging with
   dashboards already wired, so the engineer isn't flying blind post-launch.

The framework's job in this loop is to make the *right* way the *fast* way —
an engineer using `/new-agent` gets tracing, schema validation, and an eval
scaffold for free, faster than hand-rolling it and skipping them.

## 2. How multiple engineers collaborate

- **Shared standards, not shared memory.** `.claude/rules/` means two
  engineers working on different agents in parallel produce consistent
  logging, error handling, and HITL classification without a meeting —
  the standard is written down and both Claude Code sessions read it.
- **Specialization without silos.** A backend engineer picking up a task
  that turns out to be agent-orchestration work hands off cleanly to
  `ai-agent-engineer`'s documented scope rather than guessing at
  agent-specific conventions (prompt versioning, eval gating) they don't
  normally touch.
- **Review is structured, not vibes-based.** `code-reviewer` and
  `security-reviewer` check diffs against the same rule files a human
  reviewer would cite — review comments reference `.claude/rules/mcp.md:§Tool
  design`, for example, rather than restating personal opinion each time.
  This keeps review consistent across reviewers and reduces bikeshedding.
- **ADRs as the coordination point.** When two engineers' work would
  otherwise collide (e.g. both touching `packages/agent-core`'s tracing
  wrapper), the ADR produced by `enterprise-architect` is the artifact that
  surfaces the conflict before implementation, not after a merge conflict.
- **Eval suites as a shared contract.** When engineer A changes a prompt and
  engineer B is relying on that agent's output shape downstream, the eval
  suite (and its schema) is the contract both check against — a regression
  is caught by `/evaluate` before it reaches B's code, not discovered in
  B's integration testing days later.

## 3. How reusable agents and skills reduce development effort

- **Skills encode procedure, not just knowledge.** `create-agent` isn't
  documentation an engineer reads and manually follows — invoking it
  produces the scaffold directly, with tracing, schema validation, and an
  eval stub wired in, in the time it takes to describe the agent's purpose.
  What used to be a day of boilerplate (and inevitably-forgotten setup like
  wiring observability) becomes minutes, done consistently every time.
- **Specialized agents compress ramp-up time.** A new engineer doesn't need
  to internalize every platform convention before being productive — asking
  for `rag-engineer` or `mcp-integration-engineer` brings the relevant
  standards and working method into context automatically.
- **Compounding reuse.** Every new business agent built with `create-agent`
  makes the next one faster, because `packages/agent-core` and
  `packages/eval-harness` accumulate real capability (better retry logic, a
  richer tracing schema, a more mature eval runner) rather than each agent
  reinventing its own version of these.
- **Evaluation as a force multiplier, not overhead.** Because `evaluate-agent`
  makes regressions cheap to catch, engineers can iterate on prompts more
  aggressively (via `optimize-prompts`) without the fear that drives overly
  conservative, slow changes in less-instrumented systems.

## 4. Scaling into an AI Center of Excellence

This repository is deliberately structured to generalize beyond four agents:

- **The framework is the product, not just the app.** `.claude/` here is
  reusable scaffolding independent of the specific business agents — a
  second business unit (e.g. Support, or Finance) can adopt the same
  `.claude/agents/`, `.claude/skills/`, and `.claude/rules/` with different
  `apps/` on top, rather than starting their AI engineering practice from
  zero.
- **Standards become policy, not tribal knowledge.** Because
  `.claude/rules/` is version-controlled and enforced (via review agents and
  CI gates) rather than living in a wiki or a senior engineer's head, it
  survives team turnover and scales to teams that never worked with the
  original authors.
- **A CoE's central team owns the framework; product teams own the agents.**
  The natural org shape this repo implies: a platform/CoE team maintains
  `packages/agent-core`, `packages/eval-harness`, `.claude/rules/`, and the
  MCP server catalog; individual product teams build `apps/*-agent` on top,
  consuming the shared foundation rather than each re-solving observability,
  evaluation, and guardrails independently.
- **Governance scales through the same mechanisms used here.** Adding a
  fifth, tenth, or fiftieth agent doesn't require a new governance process —
  it goes through the same ADR → implementation → eval → security review →
  deploy pipeline, so the CoE's oversight burden grows sub-linearly with the
  number of agents.
- **Maturity model**: this repo represents CoE stage 1 (a shared framework
  and a handful of agents). Stage 2 is a self-service agent catalog where
  business stakeholders can request new agents via `/new-agent` with minimal
  engineering hand-holding. Stage 3 is cross-agent portfolio evaluation —
  tracking aggregate ROI, cost, and risk across every agent in the
  organization from one dashboard, extending `packages/eval-harness` and
  `.claude/rules/observability.md` from per-agent to portfolio-level
  reporting.
