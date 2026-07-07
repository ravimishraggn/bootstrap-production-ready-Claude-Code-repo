#!/usr/bin/env node
/**
 * PreToolUse hook for Edit/Write.
 * Prevents secrets from ever landing in the working tree, catching what
 * .gitignore only prevents from being *committed*. Runs before the write so
 * the content never touches disk.
 */
const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
const content =
  input?.tool_input?.content ?? input?.tool_input?.new_string ?? "";

const SECRET_PATTERNS = [
  { name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Slack token", pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: "Anthropic API key", pattern: /sk-ant-[A-Za-z0-9-_]{20,}/ },
  { name: "generic private key", pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { name: "JWT-looking secret assigned inline", pattern: /(secret|token|api_key|password)\s*[:=]\s*["'][A-Za-z0-9-_]{20,}["']/i },
];

for (const { name, pattern } of SECRET_PATTERNS) {
  if (pattern.test(content)) {
    console.error(
      `[pre-edit-secrets-scan] Blocked write: content matches a ${name} pattern.\n` +
        `Move this value to an environment variable and reference it via process.env, ` +
        `or add it to .env (already gitignored) instead of the source file.`
    );
    process.exit(2);
  }
}

process.exit(0);
