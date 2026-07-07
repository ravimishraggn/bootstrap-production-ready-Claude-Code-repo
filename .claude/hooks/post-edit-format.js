#!/usr/bin/env node
/**
 * PostToolUse hook for Edit/Write.
 * Auto-formats the touched file so style-only diffs never show up in review,
 * and PR diffs stay focused on substance. Best-effort: never blocks the
 * session on a formatter failure (formatting is a convenience, not a gate —
 * lint/CI is the real gate).
 */
const { execSync } = require("child_process");
const path = require("path");

const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
const filePath = input?.tool_input?.file_path;

if (!filePath) process.exit(0);

const ext = path.extname(filePath);
const FORMATTABLE = [".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css"];

if (FORMATTABLE.includes(ext)) {
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: "ignore" });
  } catch {
    // Non-fatal: prettier may not be installed yet in a fresh clone.
  }
}

process.exit(0);
