---
name: create-api
description: Scaffold a new backend API endpoint or service with routing, validation, error handling, OpenAPI spec entry, and tests, following this platform's backend conventions. Use for plain CRUD/service endpoints, not agent-invoking endpoints (use create-agent for those).
---

# Create API

Scaffolds a new API endpoint consistently: input validation, structured
errors, tests, and an OpenAPI entry so other agents can ground themselves in
the real contract via the `openapi` MCP server.

## Steps

1. Confirm the service boundary this endpoint belongs to per
   `.claude/rules/architecture.md` — don't add a new route to a service that
   doesn't own that data.
2. Define the request/response schema first (Zod), including error variants,
   per `.claude/rules/structured-outputs.md` and `.claude/rules/error-handling.md`.
3. Implement the handler:
   - Validate input at the boundary; reject early with a typed 4xx error.
   - Emit a structured log line and a trace span per `.claude/rules/observability.md`.
   - No business logic inline in the route handler — delegate to a
     service/module function that can be unit tested without an HTTP layer.
4. Add the OpenAPI entry under `docs/openapi/<service>.yaml`.
5. Write tests: unit test for the service function, integration test for the
   full request/response cycle (real test DB, not mocked, per
   `.claude/rules/testing.md`).
6. Run `pnpm typecheck && pnpm lint && pnpm test` before declaring done.

## Output

A new endpoint with schema validation, tests, and an up-to-date OpenAPI spec
entry — ready for `code-reviewer` and, if it touches auth/data-access scope,
`security-reviewer`.
