---
name: create-rag
description: Scaffold a retrieval-augmented generation pipeline - ingestion, chunking, embedding, indexing, retrieval, and citation wiring - for a document-grounded agent capability such as the RFP Response Agent's knowledge base. Use when adding a new document source to ground an agent's answers.
---

# Create RAG

Scaffolds a retrieval pipeline so agent answers are grounded in real
documents with citations, rather than parametric model memory.

## Steps

1. Identify the document source and its update cadence (static corpus vs.
   live-synced from Confluence/SharePoint/Google Drive via an MCP connector).
2. Define the chunking strategy per `.claude/rules/rag.md` — semantic
   (section/clause) chunking for legal/compliance content, not fixed-size.
3. Scaffold under `packages/rag/<source-name>/`:
   ```
   ingest.ts       # pulls source docs, normalizes to markdown/text
   chunk.ts        # semantic chunking with metadata (doc id, section, date)
   embed.ts        # embedding + index upsert
   retrieve.ts     # top-k + re-rank
   eval/
     retrieval-cases.jsonl   # query -> expected relevant chunk IDs
   ```
4. Attach source metadata to every chunk (document ID, section, last-updated)
   so generated answers can cite sources and staleness can be flagged.
5. Build a retrieval eval set (recall@k, precision@k) separate from any
   downstream generation eval — see `evaluate-agent` skill.
6. Wire a "no grounded answer" path: if retrieval returns nothing above the
   relevance threshold, the agent must say so and escalate rather than let
   the model answer from parametric knowledge (`human-in-the-loop.md`).
7. Hand off to `rag-engineer` for tuning and `ai-agent-engineer` for wiring
   retrieval into the consuming agent's control flow.

## Output

A retrieval pipeline with a passing retrieval-quality eval and documented
re-index cadence, ready to be consumed by an agent via `packages/agent-core`.
