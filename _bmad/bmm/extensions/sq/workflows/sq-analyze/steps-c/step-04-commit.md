---
name: "step-04-commit"
description: "Commit analysis results and update Epic status"
---

# Step 4: Commit Analysis

## STEP GOAL:

Finalize the Lean Business Case, update the Epic status from FUNNEL to ANALYZING, and persist in Beads.

## MANDATORY SEQUENCE

### 1. Status Transition

Update Epic status: `FUNNEL` → `ANALYZING`

### 2. Beads Update

- `bd update` Epic with Lean Business Case, MVP, and finalized WSJF
- Verify parent Theme link intact

### 3. Summary Report

"**✅ Epic Analysis Complete!**

**Epic:** {epic_name}
**Status:** FUNNEL → ANALYZING
**WSJF:** {wsjf_score}
**MVP:** {mvp_summary}

**Lean Business Case:** ✓ Problem, Hypothesis, Indicators, NFRs

**Next Steps:**

- Get LPM approval to move to READY
- Run `/sq solve` to decompose into Capabilities"
