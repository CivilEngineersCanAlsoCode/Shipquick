---
name: "step-01-load-epic"
description: "Load approved Epic for decomposition"
nextStepFile: "./step-02-decompose.md"
beadsCommand: "bd show {epic_bead_id}"
qualityGate: hard
---

# Step 1: Load Epic

## STEP GOAL:

Load the target approved Epic and prepare for Capability decomposition.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."
2. [ ] HG-04: Parent Epic exists -> Epic bead exists with status >= ANALYZING
   - If FAIL: "GATE FAILED [HG-04]: No analyzed Epic found. Run `/031-create-business-case` first."
3. [ ] HG-09: Business Case complete -> Epic status is ANALYZING (not FUNNEL)
   - If FAIL: "GATE FAILED [HG-09]: Epic still in FUNNEL. Complete business case first."
4. [ ] HG-07: WSJF calculated -> Epic frontmatter contains `wsjf` score > 0
   - If FAIL: "GATE FAILED [HG-07]: No WSJF score on Epic. Run WSJF calculation first."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Identify Epic)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md`
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md`

### Soft Gates (SHOULD pass — warn if fail)

1. [ ] SG-04: Architecture recommended -> Check if architecture doc exists
   - If missing: "No architecture doc found. Capabilities benefit from tech runway. Continue anyway? [Y/N]"

## MANDATORY SEQUENCE

### 1. Identify Epic

"**Which Epic are you decomposing into Capabilities?**
Provide the Epic ID or name."

### 2. Validate Readiness

Check: Epic has Lean Business Case, WSJF calculated, status ≥ ANALYZING.
If not ready, warn and suggest running `/sq analyze` first.

### 3. Present Context

"**Epic:** {epic_name} [WSJF: {wsjf}]
**Business Case:** {hypothesis_summary}
**MVP:** {mvp_summary}

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `portfolio-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- Run: `bd show {epic_bead_id}` to load and verify epic tracking
- Confirm epic status is ANALYZING and WSJF score is present

- IF C: Read fully and follow `{nextStepFile}`
