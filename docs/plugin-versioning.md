# Publishing to GitHub & Versioning the Shared Framework

This document covers two things every consuming repo (e.g.
`roi-calculator-agent`) needs from this framework repo once it stops being
a local sibling folder and becomes a real GitHub repo: (1) what makes it
**installable**, and (2) how **versions/upgrades** are handled so four (or
forty) consuming repos don't break the moment someone edits a shared rule.

---

## 1. What makes this repo installable as a plugin

Two files, already added in this repo, are what turn a plain folder of
`.claude/` content into something `claude plugin install` understands:

- **`.claude-plugin/marketplace.json`** — the catalog. Says "this repo
  offers a plugin named `ai-platform`, and here's where to find it." A
  marketplace can list multiple plugins; here it lists exactly one because
  this whole repo *is* the plugin.
- **`.claude-plugin/plugin.json`** — the plugin's own manifest: its name,
  and critically, its **version** (semver: `1.0.0`).

Nothing else changes about the repo — `CLAUDE.md`, `.claude/agents/`,
`.claude/skills/`, etc. all stay exactly where they are. These two files
just describe what's already there.

## 2. Moving from a local path to GitHub

Right now (local sibling-folder setup), a consuming repo points at this
framework with a filesystem path:

```json
"extraKnownMarketplaces": {
  "ai-platform": { "source": "../bootstrap-production-ready-Claude-Code-repo" }
}
```

Once this repo is pushed to GitHub (e.g. `github.com/your-org/ai-platform-framework`),
every consuming repo changes exactly one line — the `source` — to a GitHub
reference instead of a path:

```json
"extraKnownMarketplaces": {
  "ai-platform": {
    "source": {
      "type": "github",
      "repo": "your-org/ai-platform-framework"
    }
  }
}
```

Nothing else about the consuming repo's `.claude/` needs to change — same
plugin name (`ai-platform`), same install command
(`claude plugin install ai-platform@ai-platform`), same override mechanism.

### If the GitHub repo is private

The engineer's machine (or the CI runner) needs `git`/GitHub auth already
configured the normal way (SSH key, or `gh auth login` / a `GITHUB_TOKEN`
with repo read access) — Claude Code doesn't invent a separate auth system,
it shells out to the same git credentials already on the machine. This is a
one-time, per-machine (or per-CI-runner) setup step, same category as the
MCP token setup described in `docs/multi-repo-guide.md` Section 6.

## 3. Versioning — the part that actually prevents breakage

The risk being managed: the platform team improves a shared rule or agent
(good), but a consuming repo silently gets different behavior on its next
session (bad, if unreviewed). Versioning is what turns "silently different"
into "an explicit, reviewable upgrade."

### How this repo is versioned

- `.claude-plugin/plugin.json`'s `"version"` field is the single source of
  truth, following semver:
  - **Patch** (`1.0.1`) — wording fixes, typo corrections, a clarified
    example, no behavior change an engineer would notice.
  - **Minor** (`1.1.0`) — a new agent/skill/command added, or an existing
    rule extended in a backward-compatible way (nothing that was allowed
    before becomes blocked).
  - **Major** (`2.0.0`) — a rule tightens in a way that could block
    previously-passing work (e.g. a new mandatory eval metric), a
    file/agent/skill is renamed or removed, or default permissions become
    stricter in a way that changes what "ask" vs "allow" means.
- Every change is recorded in `CHANGELOG.md` at the repo root, in the same
  PR that makes the change — `documentation-engineer` checks this on any PR
  touching `.claude/`.
- Releases are tagged in git (`v1.0.0`, `v1.1.0`, ...) so a specific version
  can be referenced exactly, not just "whatever is on `main` right now."

### How a consuming repo pins a version

By default, `claude plugin install ai-platform@ai-platform` takes whatever
the marketplace currently points at. For anything beyond a quick local
experiment, **pin an explicit version** in the consuming repo's
`.claude/settings.json`:

```json
"extraKnownMarketplaces": {
  "ai-platform": {
    "source": {
      "type": "github",
      "repo": "your-org/ai-platform-framework",
      "ref": "v1.0.0"
    }
  }
}
```

`ref` can be a tag (`v1.0.0`), a branch, or a commit SHA. **Pinning to a
tag is the recommended default** — it's exactly analogous to pinning an npm
package version instead of installing `latest` in `package.json`, for
exactly the same reason: reproducible builds and no surprise behavior
change between one session and the next.

### How a consuming repo upgrades deliberately

1. Read `CHANGELOG.md` in the framework repo for everything between the
   current pinned version and the target version.
2. Bump the `ref` in `.claude/settings.json` on a branch, not directly on `main`.
3. Run `claude plugin update ai-platform`, then re-run this repo's own eval
   suite (`/evaluate`) and test suite (`/test`) — a rule/agent change
   shouldn't normally change agent *behavior*, but a version bump is treated
   with the same discipline as any other dependency bump precisely because
   it's not guaranteed not to.
4. Open a normal PR for the version bump itself, reviewed like any other
   change — this makes "which framework version is this repo on" visible in
   git history instead of hidden in a background auto-update.
5. For a **major** version bump specifically, check
   `docs/OVERRIDES.md` in the consuming repo — a major bump is exactly the
   kind of change likely to affect whether an existing local override is
   still needed, redundant, or now conflicting with a tightened shared rule.

### What CI enforces

The consuming repo's CI pipeline (`devops-engineer`'s domain) fails the
build if the installed plugin version drifts from the version pinned in
`.claude/settings.json` — this catches the case where someone manually ran
`claude plugin update` locally and forgot to commit the settings change,
the same class of bug `package-lock.json` drift catches for npm.

### Rollback

Because versions are git tags, rolling back is just re-pinning `ref` to the
previous tag and re-running the same PR process — there is deliberately no
"fast/silent rollback" path, because a rollback changing shared behavior
across a repo deserves the same review a forward upgrade does.
