# RAG Rules

Applies primarily to the RFP Response Agent's knowledge base and any future
document-grounded capability.

## Chunking

- Chunk by semantic unit (section, clause, Q&A pair) for legal/compliance
  content — never fixed character-count chunking for material where
  splitting mid-clause changes meaning.
- Attach metadata to every chunk: source document ID, section/heading,
  last-updated date, and an access-control tag if the source has restricted
  content.

## Retrieval

- Tune retrieval (top-k, re-ranking) against a labeled eval set measuring
  recall@k and precision@k, separately from generation-quality evaluation.
- Prefer adding a cross-encoder re-rank step over simply widening top-k when
  precision is the bottleneck — wider top-k dilutes the context window and
  can degrade generation quality even as recall improves.
- Set an explicit relevance threshold. If nothing retrieved clears it, the
  agent must respond "no grounded answer found" and escalate
  (`human-in-the-loop.md`) rather than let the model answer from parametric
  knowledge.

## Citations

Every generated answer that relies on retrieved context must cite the
specific source document/section it drew from, as a structured field (see
`structured-outputs.md`), not just prose mentions — this is required for
RFP answers to be auditable against the source knowledge base.

## Freshness

- Define and document a re-index cadence per source (e.g. daily sync from
  Confluence). Stale content is a correctness bug, not a cosmetic issue,
  for compliance-sensitive answers.
- When a source document is updated or retracted, its chunks must be
  invalidated/re-indexed, not left stale in the vector store.

## Evaluation

Retrieval quality and generation/answer quality are evaluated as separate
metrics (see `evaluation.md`) — a generation-quality regression might
actually be a retrieval regression, and conflating them hides the true root
cause.
