---
name: "step-01-load-capability"
description: "Load target Capability for Feature decomposition"
nextStepFile: "./step-02-decompose-features.md"
beadsCommand: "bd show {cap_bead_id}"
qualityGate: hard
---

# Step 1: Load Capability

## STEP GOAL:

Load the target Capability and prepare for Feature decomposition.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."
2. [ ] HG-05: Capabilities exist -> At least 1 Capability bead exists under Epic
   - If FAIL: "GATE FAILED [HG-05]: No capabilities found. Run `/040-create-capabilities` first."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Identify Capability)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-discovery.md`
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md`

## MANDATORY SEQUENCE

### 1. Identify Capability

"**Which Capability are you decomposing into Features?**
Provide the Capability ID (e.g., CAP-001) or name."

### 2. Validate & Present

Load Capability, verify parent Epic link, show context:
"**Capability:** {cap_name} [WSJF: {wsjf}]
**Parent Epic:** {epic_name}
**ACs:** {gherkin_summary}

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `product-manager-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- Run: `bd show {cap_bead_id}` to load and verify capability tracking
- List available capabilities: `bd list --status=open` filtered to capability items
- Confirm parent epic link is intact

- IF C: Read fully and follow `{nextStepFile}`
