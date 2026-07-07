#!/usr/bin/env node
/**
 * Stop hook.
 * Appends a one-line audit entry every time a Claude Code session ends in
 * this repo. This is the cheapest possible audit trail for "what did an AI
 * agent touch and when" — useful for compliance review and for reconstructing
 * context in standups without reading full transcripts.
 */
const fs = require("fs");
const path = require("path");

const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
const logDir = path.join(".claude", "logs");
const logFile = path.join(logDir, "session-audit.log");

fs.mkdirSync(logDir, { recursive: true });

const entry = {
  timestamp: new Date().toISOString(),
  sessionId: input?.session_id ?? "unknown",
  cwd: input?.cwd ?? process.cwd(),
};

fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
process.exit(0);
