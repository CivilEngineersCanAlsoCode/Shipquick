---
name: "step-04-wsjf-check"
description: "Verify WSJF propagation consistency"
nextStepFile: "./step-05-report.md"
beadsCommand: "bd show {epic_bead_id}"
qualityGate: hard
---

# Step 4: WSJF Consistency Check

## STEP GOAL:

Verify WSJF scores are calculated and properly propagated from parent to children.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] AC validation completed from step-03

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

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

[C] Continue — Generate compliance report
"

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- WSJF propagation issues found
- Inconsistency in WSJF scoring across levels

If yes, append entry to: `portfolio-sidecar/wsjf-calibration.md`

## BEADS INTEGRATION

- Check all Epics have WSJF scores: `bd show {epic_id}` for each
- Verify WSJF inheritance down the hierarchy
- Flag inconsistencies (child WSJF > parent WSJF)

- IF C: Read fully and follow `{nextStepFile}`
