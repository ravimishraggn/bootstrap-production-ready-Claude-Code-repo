---
name: write-tests
description: Write unit, integration, or E2E tests for existing or new code following this platform's test pyramid and conventions. Use for conventional software test coverage; use evaluate-agent for LLM-behavior quality instead.
---

# Write Tests

Adds test coverage consistent with `.claude/rules/testing.md`.

## Steps

1. Identify the layer: pure logic (unit), boundary-crossing (integration:
   DB, external API, MCP tool), or user-facing flow (E2E).
2. **Unit tests**: no network/DB; mock only true external boundaries (never
   mock the module under test's own collaborators just to simplify setup —
   restructure the code instead if it's hard to test).
3. **Integration tests**: hit a real test database/service where feasible
   (`postgres` MCP server informs correct schema/fixtures) rather than
   mocking the boundary — mocked integration tests have previously passed
   while the real migration broke in production on this platform.
4. **E2E tests**: Playwright, scoped to golden paths and the highest-risk
   edge cases (empty state, error state, HITL approval flow) — not
   exhaustive UI permutation coverage.
5. For every bug fix, add a regression test that fails on the old code and
   passes on the fix, before considering the fix complete.
6. Test failure paths explicitly: each typed error variant in
   `.claude/rules/error-handling.md` gets at least one test asserting the
   correct handling.
7. Run the full suite (`pnpm test`) and confirm no existing test was weakened
   or skipped to make the new one pass.

## Output

New/updated test files with clear failure-scenario names (not `test('works')`
but `test('rejects lead score request when CRM lookup times out')`).
