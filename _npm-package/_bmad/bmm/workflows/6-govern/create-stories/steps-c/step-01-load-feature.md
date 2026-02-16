---
name: "step-01-load-feature"
description: "Load target Feature for Story decomposition"
nextStepFile: "./step-02-stories.md"
beadsCommand: "bd show {feat_bead_id}"
qualityGate: hard
---

# Step 1: Load Feature

## STEP GOAL:

Load the target Feature and prepare for Story/Task/QA decomposition.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."
2. [ ] HG-06: Features exist -> At least 1 Feature bead exists under Capability
   - If FAIL: "GATE FAILED [HG-06]: No features found. Run `/041-create-features` first."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Identify Feature)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md`
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md`

## MANDATORY SEQUENCE

### 1. Identify Feature

"**Which Feature are you decomposing?**
Provide the Feature ID (e.g., FEAT-001) or name."

### 2. Validate & Present

"**Feature:** {feat_name} [WSJF: {wsjf}]
**Parent Capability:** {cap_name}
**Benefit Hypothesis:** {hypothesis}
**ACs:** {gherkin_count} acceptance criteria

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `product-manager-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- Run: `bd show {feat_bead_id}` to load and verify feature tracking
- List available features: `bd list --status=open` filtered to feature items
- Confirm parent capability link is intact

- IF C: Read fully and follow `{nextStepFile}`
