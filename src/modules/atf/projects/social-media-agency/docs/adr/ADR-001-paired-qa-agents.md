# ADR-001: Use 3 Paired QA Agents Instead of 1

- **Status:** Accepted
- **Date:** 2026-03-15

## Context

BMAD uses a single QA agent to validate all workflow outputs. SMA has 6 workflows (A through F) spanning ideation, drafting, formatting, review, publishing, and analytics. A single QA agent would need to context-switch across all domains, reducing specialization depth and preventing parallel validation.

## Decision

Use 3 development agents paired with 3 dedicated QA agents:

| Dev Agent | QA Agent | Workflows |
|-----------|----------|-----------|
| Scout     | Lens     | A (Ideation), B (Drafting) |
| Pixel     | Grid     | F (Formatting), C (Review) |
| Relay     | Sentinel | D (Publishing), E (Analytics) |

Each QA agent specializes in exactly 2 workflows and validates only the outputs of its paired dev agent.

## Consequences

**Positive:**
- Each QA agent develops deep domain expertise in its 2 workflows
- Parallel validation — all 3 QA agents can run simultaneously
- Clear ownership and accountability per workflow pair
- Dev-QA pairing creates a tight feedback loop within each domain

**Negative:**
- 6 agents to maintain instead of 2 (1 dev + 1 QA)
- Cross-workflow issues may fall between QA agent boundaries
- More agent configuration files and sidecar instructions to keep in sync

**Mitigations:**
- Shared checklists and quality gates standardize cross-cutting concerns
- Pipeline order (A→B→F→C→D→E) ensures each QA agent receives well-defined inputs from upstream
