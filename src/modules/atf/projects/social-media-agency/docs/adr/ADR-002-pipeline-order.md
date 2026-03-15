# ADR-002: A→B→F→C→D→E Pipeline (Not Alphabetical)

- **Status:** Accepted
- **Date:** 2026-03-15

## Context

The 6 SMA workflows are labeled A through F. An alphabetical pipeline (A→B→C→D→E→F) would place Formatting (F) last, after Publishing (D) and Analytics (E). However, content must be formatted before it can be meaningfully reviewed or published.

## Decision

The pipeline order is: **A (Ideation) → B (Drafting) → F (Formatting) → C (Review) → D (Publishing) → E (Analytics)**, with E feeding back into A to close the loop.

```
A → B → F → C → D → E
                      ↓
                 loops back to A
```

Key ordering rationale:
- **F before C:** Reviewers need the formatted preview (staircase layout, emoji placement, character count) to make approval decisions. Reviewing raw draft text misses formatting-dependent issues.
- **E→A feedback loop:** Analytics insights (pillar rebalancing, method effectiveness, timing data) feed back into Ideation scoring weights, creating a self-improving system.

Status flow mirrors the pipeline:
`Scheduled_NoDraft → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published`

## Consequences

**Positive:**
- Reviewers see exactly what will be published — WYSIWYG review
- Formatting issues caught before review, not after
- E→A loop enables data-driven content strategy evolution
- Status flow is intuitive and maps 1:1 to pipeline stages

**Negative:**
- F label doesn't match its position — may confuse new contributors
- Formatting changes after review require looping back (C→F→C)

**Mitigations:**
- CONTEXT.md and pipeline diagrams always show execution order, not alphabetical
- C.2 can send posts back to F status for re-formatting if needed
