---
name: review-security
description: Run a structured security review of a diff or subsystem covering both standard AppSec and AI-specific risks (prompt injection, tool over-privilege, data exfiltration via tool chaining, missing human-in-the-loop gates). Use before merging security-sensitive changes, or invoke the security-reviewer agent directly for a full review.
---

# Review Security

A repeatable checklist-driven security pass, usable standalone or as the
procedure the `security-reviewer` agent follows.

## Steps

1. **Scope the review**: read the diff or subsystem; identify what data it
   touches (PII? customer data? credentials?) and what actions it can take
   (read-only? writes to external systems?).
2. **Standard AppSec pass**: injection (SQL/command/template), authZ bypass,
   SSRF (especially via the `browser`/`openapi` MCP servers), insecure
   deserialization, dependency CVEs (`pnpm audit`), secrets in code.
3. **Prompt injection pass**: for any agent ingesting untrusted text, confirm
   the prompt explicitly delimits and distrusts that content, and that the
   model cannot be steered into calling tools outside its intended scope via
   injected instructions.
4. **Tool privilege pass**: for every MCP tool available to the agent under
   review, confirm least privilege — cross-check against
   `.claude/rules/mcp.md`. Flag any agent holding both broad read and
   external-write tools simultaneously.
5. **HITL gate pass**: confirm every irreversible action (CRM write, email
   send, RFP submission) has an approval checkpoint per
   `.claude/rules/human-in-the-loop.md` — no agent should be able to take an
   irreversible action purely autonomously without an explicit, reviewed
   exception.
6. **Data handling pass**: PII redaction in logs (`.claude/rules/logging.md`),
   correct data residency/retention if applicable.
7. Report findings ranked Critical/High/Medium/Low with concrete exploit
   scenarios, not theoretical concerns.

## Output

A findings report suitable for blocking or approving a merge, handed to the
user for the final call — this skill informs, it does not itself gate CI.
