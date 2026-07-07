# Testing Rules

## Test pyramid

- **Unit** (most tests): pure logic, no network/DB. Mock only true external
  boundaries.
- **Integration**: crosses a real boundary (DB, MCP tool, external API) —
  named `*.integration.test.ts`. Prefer a real test database/service over
  mocking the boundary; mocked integration tests have previously passed
  while the real migration broke in production on this platform.
- **E2E** (fewest tests): Playwright, scoped to golden paths and the
  highest-risk edge cases (empty state, error state, HITL approval flow),
  not exhaustive UI permutation coverage.
- **Eval suites** are a parallel, separate track for agent-*quality* (see
  `evaluation.md`) — they are not a substitute for conventional tests of the
  deterministic scaffolding around an agent (schema validators, retry logic,
  tool wrappers), which still need unit tests.

## What must be tested

- Every new function with a non-trivial branch gets a unit test covering
  each branch, including error paths (see `error-handling.md`).
- Every new API endpoint gets an integration test for the full
  request/response cycle.
- Every bug fix ships with a regression test that fails on the old code and
  passes on the fix.
- Every typed error variant gets at least one test asserting correct
  handling by the caller.

## What must never happen

- Never delete or skip a failing test to unblock a merge — fix the root
  cause or escalate to the user/reviewer.
- Never weaken an assertion (e.g. loosen an equality check to "truthy") just
  to make a test pass.
- Never mock the system under test's own collaborators purely to simplify
  setup — if a unit is hard to test, that's a signal to restructure it, not
  to over-mock.

## Running

`pnpm test` runs the full suite; `pnpm --filter <package> test` scopes to
one package. CI runs the full suite plus the eval gate for agent changes
before merge is allowed (`git.md`).
