# Security Rules

## Baseline (standard AppSec)

- No hardcoded secrets, ever. Read from environment variables; local dev
  secrets go in `.env` (gitignored), never `.env.example` values used for real.
- Parameterize all database queries; never string-concatenate user input
  into SQL.
- Validate and sanitize all external input at the boundary (API request,
  MCP tool input, webhook payload) before it reaches business logic.
- Keep dependencies patched; `pnpm audit` runs in CI and blocks on high/critical.
- Least-privilege credentials everywhere: a service/tool gets only the
  scope it needs, never a shared admin credential.

## AI-specific threats

- **Prompt injection**: any agent that ingests untrusted text (RFP source
  documents, inbound emails, CRM free-text fields, web content) must
  explicitly delimit that content in the prompt and instruct the model to
  treat it as data, never as instructions. See `prompt-engineering.md`.
- **Tool over-privilege**: an agent's MCP tool set must match its actual
  job. The Lead Scoring Agent gets CRM read, not CRM write. Cross-check tool
  grants in every PR touching `.mcp.json` or an agent's tool bindings.
- **Tool-chaining exfiltration**: flag any agent holding both broad
  read access (customer/PII data) and an external-write tool (Slack, email,
  arbitrary HTTP) in the same context — a confused or compromised agent
  could chain read+write to leak data. Split into separate, narrower tools
  or agents if this combination is unavoidable.
- **Irreversible actions**: any code path capable of an irreversible
  real-world effect (send email, submit RFP, write CRM record affecting a
  live deal) must pass through a human-in-the-loop gate — see
  `human-in-the-loop.md`. This is a security control, not just a UX choice.
- **Data exfiltration via generated output**: outputs rendered as HTML/Slack
  messages/emails must be escaped appropriately; never render raw model
  output as unescaped HTML.

## Review triggers

A change requires `security-reviewer` sign-off if it touches: authentication/
authorization, `.mcp.json` or MCP tool implementations, secrets/credentials
handling, `.claude/settings.json` permissions, or any code path handling PII
or customer data.

## Incident handling

Security incidents are handled via `debug-production`, with root cause
documented and a regression test/eval case added before the incident is
considered closed.
