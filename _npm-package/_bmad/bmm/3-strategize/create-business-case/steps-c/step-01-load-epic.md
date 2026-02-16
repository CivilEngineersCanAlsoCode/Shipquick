---
name: "step-01-load-epic"
description: "Load and validate the target Portfolio Epic"
nextStepFile: "./step-02-business-case.md"
beadsCommand: "bd show {epic_bead_id}"
qualityGate: hard
---

# Step 1: Load Epic

## STEP GOAL:

Load the target Portfolio Epic from Beads or file system and validate it has the required fields.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."
2. [ ] Parent Epic exists -> Epic document exists in `{sq_output_folder}` with `status: FUNNEL`

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Identify Epic)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md`
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md`

## MANDATORY SEQUENCE

### 1. Identify Epic

"**Which Portfolio Epic do you want to analyze?**
Provide the Epic ID (e.g., EPIC-001) or describe it."

### 2. Load & Validate

- Load the Epic document
- Verify: has benefit hypothesis, has parent Theme link
- If missing fields, warn user and help complete them

### 3. Present Status

"**Loaded Epic:** {epic_name}

- Parent Theme: {theme_name}
- Current Status: {status}
- WSJF: {wsjf_score or 'Not calculated'}

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `product-manager-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- Run: `bd show {epic_bead_id}` to verify epic is tracked
- Confirm bead status matches document status

- IF C: Read fully and follow `{nextStepFile}`
