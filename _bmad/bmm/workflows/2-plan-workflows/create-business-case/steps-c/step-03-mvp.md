---
name: "step-03-mvp"
description: "Define MVP and finalize WSJF"
nextStepFile: "./step-04-commit.md"
beadsCommand: 'bd update {epic_bead_id} --notes="MVP defined"'
qualityGate: soft
---

# Step 3: MVP Definition & WSJF Finalization

## STEP GOAL:

Define the Minimum Viable Product and recalculate/confirm WSJF with business case context.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Business case sections from step-02 complete

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. MVP Definition

"**What is the smallest deliverable that validates the hypothesis?**
Think: What's the least we can build to test if this Epic is worth the full investment?"

Capture: MVP scope, success criteria, estimated duration.

### 2. WSJF Review

"Now that we have the full business case, let's review the WSJF score.
Current: {wsjf_score}. Does this still feel right given what we've discussed?"

If user wants to adjust, recalculate.

### 3. Update Epic

Add MVP section and update WSJF in document and Beads.

## QUALITY GATE

- **PASS:** MVP defined with success criteria, WSJF reviewed/confirmed.
- **FAIL:** MVP scope missing or success criteria undefined.

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- MVP sizing learning
- WSJF recalibration required

If yes, append entry to: `product-manager-sidecar/feature-sizing.md`

### 4. Present MENU OPTIONS

## BEADS INTEGRATION

- Run: `bd update {epic_bead_id} --notes="MVP defined, leading indicators set"`

- IF C: Read fully and follow `{nextStepFile}`
