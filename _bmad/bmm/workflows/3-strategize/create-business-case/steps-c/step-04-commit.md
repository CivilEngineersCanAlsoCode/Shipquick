---
name: "step-04-commit"
description: "Commit analysis results and update Epic status"
beadsCommand: 'bd update {epic_bead_id} --status=in_progress --notes="LBC complete, WSJF={score}"'
qualityGate: hard
---

# Step 4: Commit Analysis

## STEP GOAL:

Finalize the Lean Business Case, update the Epic status from FUNNEL to ANALYZING, and persist in Beads.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] HG-09: Business Case complete -> All LBC sections filled
3. [ ] HG-07: WSJF calculated -> Epic has `wsjf` score > 0

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Status Transition

Update Epic status: `FUNNEL` → `ANALYZING`

### 2. Beads Update

- `bd update` Epic with Lean Business Case, MVP, and finalized WSJF
- Verify parent Theme link intact

## QUALITY GATE

- **PASS:** All Hard Gates (HG-01, HG-09, HG-07) pass, status updated in Beads and document.
- **FAIL:** Missing required LBC sections or WSJF score < 1.

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `product-manager-sidecar/common-mistakes.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "feat: completed Lean Business Case for {epic_name}"`
4. `bd sync`
5. `git push`

### 3. Summary Report

"**✅ Epic Analysis Complete!**

**Epic:** {epic_name}
**Status:** FUNNEL → ANALYZING
**WSJF:** {wsjf_score}
**MVP:** {mvp_summary}

**Lean Business Case:** ✓ Problem, Hypothesis, Indicators, NFRs

## BEADS INTEGRATION

- Run: `bd update {epic_bead_id} --notes="LBC complete, WSJF={wsjf_score}, status advancing to ANALYZING"`
- Epic status changes from FUNNEL -> ANALYZING
- Run: `bd sync` to persist changes

**Next Steps:**

- Get LPM approval to move to READY
- Run `/sq solve` to decompose into Capabilities"
