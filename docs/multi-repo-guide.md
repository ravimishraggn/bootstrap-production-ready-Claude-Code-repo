# Multi-Repo Guide (Plain Language)

This document explains, in simple terms, what happens when this platform is
split across **multiple repositories** instead of one big repo: which files
matter, who (or what) uses them, and what you personally need to click/type
inside the Claude Code app to make it all work. No jargon left unexplained.

---

## 1. Why multiple repos at all?

Right now everything lives in **one repo** (this one). That's fine for a
demo. In a real company, you usually split things up so teams don't step on
each other and so you can deploy one agent without redeploying everything:

```
ai-platform-framework/     <- THIS repo: the rulebook + shared building blocks
lead-scoring-agent/        <- its own repo, its own deploy pipeline
pipeline-automation-agent/ <- its own repo
roi-calculator-agent/      <- its own repo
rfp-response-agent/        <- its own repo
agent-core/                <- shared code (tracing, retry, schemas) as an installable package
```

Think of it like a company with one **HR handbook** (the framework repo) and
several **departments** (the agent repos). Each department follows the same
handbook, but each has its own office, its own budget, its own door.

---

## 2. Meet the actors

Before touching files, know who's doing what. There are three kinds of
"actors" in this system:

| Actor | What it is | What it does |
|---|---|---|
| **You (the engineer)** | A human | Writes requirements, approves risky actions, reviews PRs, types `/commands` |
| **Claude Code** | The AI assistant running in your terminal/IDE | Reads the repo's files, follows the rules it finds, writes code, opens PRs |
| **A subagent** (e.g. `backend-engineer`) | A specialized "persona" Claude Code can switch into | Does one kind of job, following the rules relevant to that job |
| **CI/CD (GitHub Actions, etc.)** | An automated robot | Runs tests/evals/security scans automatically when a PR is opened |
| **MCP servers** (GitHub, Jira, Slack, Postgres...) | Little bridges to outside tools | Let Claude Code actually *read* a Jira ticket or *post* to Slack, instead of guessing |

Everything below is really just: **"which file tells which actor what to
do, in which repo."**

---

## 3. The one file every repo must have: `CLAUDE.md`

**What it is:** A plain markdown file at the root of a repo. It's the first
thing Claude Code reads when you open that repo.

**Who uses it:** Claude Code, automatically, every session. No human reads
it every day — it's *for* Claude, written once by a human.

**Simple example:** If you open the `lead-scoring-agent` repo and its
`CLAUDE.md` says:

```markdown
# Lead Scoring Agent
This repo implements ONE agent: scoring inbound leads.
It depends on the shared `agent-core` package (installed via npm).
For platform-wide rules (security, testing, git workflow), see:
https://github.com/your-org/ai-platform-framework/tree/main/.claude/rules
Read that before making changes here.
```

...then when you ask Claude Code "add a new field to the lead score output,"
it will go read those linked rules *before* writing code, instead of
inventing its own conventions. **This is the mechanism that keeps 5
different repos, worked on by 5 different engineers, consistent.**

> Layman summary: `CLAUDE.md` is a sticky note on the office door that says
> "before you do anything here, go read the company handbook, page X."

---

## 4. The framework folder: `.claude/`

This is the actual "handbook + toolbox." In our current single-repo setup,
it lives once at the root. In a multi-repo setup, you have **two honest
options** — pick one, don't mix them without a reason:

### Option A — Copy it into every repo (simplest, what most teams start with)

Each agent repo (`lead-scoring-agent`, etc.) gets its **own** `.claude/`
folder, copy-pasted from the framework repo, trimmed to what that repo
needs (e.g. `lead-scoring-agent` only needs the `backend-engineer` and
`ai-agent-engineer` agent files, not `frontend-engineer`).

- **Pro:** dead simple, works immediately, no extra tooling.
- **Con:** if you fix a rule in the framework repo, you must manually
  re-copy it into every agent repo, or they drift out of sync.

### Option B — Package it as a Claude Code Plugin (recommended once you have 3+ repos)

Claude Code supports **plugins**: a `.claude/` bundle that lives in one
place (a plugin marketplace repo) and gets *installed* into any repo, the
same way you'd `npm install` a shared library. You'd publish
`ai-platform-framework` as a plugin, and every agent repo "installs" it.

- **Pro:** one source of truth; update the plugin once, every repo that has
  it installed gets the update.
- **Con:** slightly more setup the first time (see Section 6, step 4).

**Simple example of the difference:**
- Option A is like photocopying the employee handbook and handing a paper
  copy to every new office — cheap now, annoying to keep in sync later.
- Option B is like everyone reading the handbook from one shared intranet
  page — one edit, everyone sees it immediately.

---

## 5. Which specific files get used, and by whom — walked through one example

Let's say you, a human engineer, open the `lead-scoring-agent` repo and
type into Claude Code:

> "Add a rule that leads from disposable email domains get an automatic
> score of 0."

Here is **exactly** which files get touched, in order:

1. **`CLAUDE.md`** *(read by Claude Code, automatically, first)*
   Tells Claude this repo is the Lead Scoring Agent and to check the shared
   rules before changing anything.

2. **`.claude/rules/prompt-engineering.md`** and **`structured-outputs.md`**
   *(read by Claude Code)*
   Tell Claude how to change the scoring prompt safely (version it as
   `v2.ts`, don't overwrite `v1.ts`) and that the output schema must stay
   valid.

3. **`.claude/agents/ai-agent-engineer.md`** *(Claude Code "becomes" this
   persona for the task)*
   Because this is a change to agent *behavior* (the scoring prompt), Claude
   Code switches into the AI Agent Engineer persona, which knows to also
   update the eval suite, not just the prompt.

4. **`apps/lead-scoring-agent/src/prompt.ts`** and
   **`packages/agent-core/prompts/lead-scoring/v2.ts`** *(written by Claude Code)*
   The actual new prompt version gets created here.

5. **`apps/lead-scoring-agent/eval/cases.jsonl`** *(edited by Claude Code)*
   A new test case is added: "lead with a `mailinator.com` email → expect
   score 0" — per `.claude/rules/evaluation.md`, which says every behavior
   change needs a matching eval case.

6. **`.claude/skills/evaluate-agent/SKILL.md`** *(followed by Claude Code)*
   Claude runs the eval suite comparing the old prompt (`v1`) vs new
   (`v2`) to make sure nothing else broke.

7. **`.claude/skills/generate-pr/SKILL.md`** *(followed by Claude Code)*
   Once tests pass, Claude opens a Pull Request with the standard template
   (what changed, why, eval scores before/after).

8. **You (the human)** review that PR. If it touches anything security- or
   data-sensitive, `.claude/agents/security-reviewer.md` also runs a check
   before you approve.

9. **CI/CD** (a GitHub Actions file, e.g. `.github/workflows/ci.yml`, which
   lives in the *agent* repo, not the framework repo) automatically re-runs
   tests and evals on the PR, as a robot double-check.

**Layman summary of the whole flow:** *You made one sentence request. Claude
looked up the rulebook, put on the right "hat" (persona), made the change in
the right file, wrote its own test, checked its own homework, and handed you
a clean PR to approve. You never had to explain the rules — they were
already written down.*

---

## 6. What YOU personally need to set up (this is the part no file does for you)

These are manual, one-time (or occasional) steps inside the **Claude Code
app/CLI itself** — not something Claude can do for itself, because they
involve secrets, approvals, or your own accounts.

### Step 1 — Open each repo and let Claude Code find `CLAUDE.md`
Nothing to configure — this is automatic. Just make sure every repo has one.

### Step 2 — Set permissions per repo (`.claude/settings.json`)
This file controls what Claude Code is **allowed to do without asking you**,
what it must **ask permission** for, and what's **completely blocked**.

- In each repo, open `.claude/settings.json` (or let Claude Code create a
  default one) and decide:
  - Can Claude run `git push` without asking? (Recommend: **ask**.)
  - Can Claude run `pnpm test` without asking? (Recommend: **allow**, it's safe.)
  - Should `terraform apply` ever run without asking? (Recommend: **never
    allow** — always block.)
- **Layman version:** this is you setting house rules — "you can grab a
  snack from the fridge (run tests) without asking, but you must ask before
  you use the car (deploy to production)."

### Step 3 — Connect MCP servers (secrets live OUTSIDE the repo)
`.mcp.json` in each repo *lists* which outside tools Claude can use (GitHub,
Jira, Slack, Postgres...), but it does **not** contain your actual
passwords/tokens — it just says "read the token from an environment
variable called `GITHUB_TOKEN`."

You must, once per machine (or once per CI environment):
1. Create the actual token/API key in GitHub/Jira/Slack's own settings page.
2. Store it as an environment variable, or in your Claude Code account's
   connector settings (for hosted connectors like Slack/Jira/Notion, this is
   done via the Claude.ai "Connectors" settings page, not by editing a file).
3. For servers that need OAuth (Slack, Jira, Linear, etc.), you run
   `claude mcp` or use `/mcp` inside an interactive Claude Code session to
   click "Authorize" — this cannot be done by Claude typing commands for you,
   because it requires *your* login in a browser popup.

**Layman version:** `.mcp.json` is a phone book with names and "call this
number" — but *you* still have to personally dial in and prove it's really
you (log in) the first time. After that, Claude can use the line freely.

### Step 4 — (Multi-repo specific) Decide how `.claude/` is shared
- If you chose **Option A** (copy-paste) from Section 4: nothing special to
  configure, just remember to manually sync updates.
- If you chose **Option B** (plugin): you'll publish the framework repo as
  a plugin source, then in each agent repo run the plugin install command
  so its `.claude/` extends the shared one. Do this once per repo.

### Step 5 — Set the default model and output style (optional, once)
In `.claude/settings.json` you already have `"model"` and `"outputStyle"`
set for you (`claude-sonnet-5` and `engineering-concise`). You can override
per-repo if, say, the RFP Response repo needs a more careful/expensive model
for legal-sensitive drafting — just change that one repo's setting; it
won't affect the others.

### Step 6 — Approve risky actions when Claude asks
Even with everything configured, Claude Code will still **stop and ask you**
before: pushing code, merging a PR, deploying, or touching anything marked
"ask" or "irreversible" in the rules. This is intentional — settings don't
remove your judgment, they just remove the *repetitive* decisions (like "is
running a unit test OK") so you only get asked about things that actually
matter.

---

## 7. Quick mental model to keep

```
CLAUDE.md            = the sticky note: "read the handbook first"
.claude/rules/        = the handbook itself (what "good" looks like)
.claude/agents/        = the different hats Claude can wear
.claude/skills/        = the step-by-step checklists for common jobs
.claude/commands/       = shortcuts ("/test", "/review") that trigger a skill
.claude/settings.json    = the house rules (what Claude can do without asking)
.mcp.json                 = the phone book to outside tools (you still dial in once)
You (the human)             = the person who approves anything risky
CI/CD                          = the robot that double-checks everything automatically
```

If you only remember one sentence: **every repo gets its own `CLAUDE.md`
pointing at the shared rulebook, every repo gets its own `settings.json`
deciding what Claude can do unsupervised, and you personally only have to
handle logins/secrets and approve the risky stuff — everything else is
written down once and reused everywhere.**
