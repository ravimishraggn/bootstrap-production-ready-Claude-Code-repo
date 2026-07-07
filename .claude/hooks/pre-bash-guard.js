#!/usr/bin/env node
/**
 * PreToolUse hook for Bash.
 * Belt-and-suspenders check on top of settings.json permissions: catches
 * dangerous command *patterns* (not just prefixes) that the allow/ask/deny
 * lists can't express, e.g. destructive flags buried in a pipeline.
 *
 * Exit code 2 blocks the tool call and returns stderr to Claude as feedback.
 */
const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
const command = input?.tool_input?.command ?? "";

const BLOCKED_PATTERNS = [
  /rm\s+-rf\s+\/(?!\S)/, // rm -rf / (root wipe)
  /:\(\)\{.*\};:/, // fork bomb
  /--force[- ]?with[- ]?lease\b.*origin\/(main|master)/i,
  /DROP\s+(TABLE|DATABASE)/i,
  /terraform\s+(apply|destroy)\s+.*-auto-approve/i,
];

for (const pattern of BLOCKED_PATTERNS) {
  if (pattern.test(command)) {
    console.error(
      `[pre-bash-guard] Blocked command matching a destructive pattern: ${pattern}\n` +
        `If this is intentional, run it manually outside Claude Code, or ask the user to confirm explicitly.`
    );
    process.exit(2);
  }
}

process.exit(0);
