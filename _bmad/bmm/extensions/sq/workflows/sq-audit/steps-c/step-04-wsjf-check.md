---
name: "step-04-wsjf-check"
description: "Verify WSJF propagation consistency"
nextStepFile: "./step-05-report.md"
---

# Step 4: WSJF Consistency Check

## STEP GOAL:

Verify WSJF scores are calculated and properly propagated from parent to children.

## MANDATORY SEQUENCE

### 1. Check Rules

- Every Epic MUST have a WSJF score
- Children inherit parent WSJF unless explicitly overridden
- No item at Capability/Feature level should have null WSJF

### 2. Report

"**WSJF Consistency**

{if gaps_found}
⚠️ **{gap_count} WSJF gap(s):**
{list items with missing or inconsistent WSJF}
{else}
✅ **WSJF properly propagated across all levels.**
{/if}

[C] Continue — Generate compliance report"

- IF C: Read fully and follow `{nextStepFile}`
