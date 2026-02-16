---
name: "step-02-business-case"
description: "Create Lean Business Case for the Epic"
nextStepFile: "./step-03-mvp.md"
beadsCommand: "bd update {epic_bead_id} --status=in_progress"
qualityGate: hard
---

# Step 2: Lean Business Case

## STEP GOAL:

Facilitate the creation of a structured Lean Business Case following SAFe 6.0 format.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Epic loaded from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Guide Through Sections

Facilitate each section collaboratively:

**Problem Statement:**
"What problem does this Epic solve? Who is affected and how?"

**Solution Hypothesis:**
"If we [proposed solution], then [expected outcome], as measured by [key metric]."

**Leading Indicators:**
"What early signals will tell us we're on the right track?"

**Non-Functional Requirements:**
"Any compliance, performance, security, or scalability requirements?"

### 2. Compile Business Case

Add to Epic document:

```markdown
## Lean Business Case

### Problem Statement

{problem}

### Solution Hypothesis

{hypothesis}

### Leading Indicators

{indicators}

### Non-Functional Requirements

{nfrs}
```

## QUALITY GATE

- **PASS:** Problem statement, solution hypothesis, and business value clearly defined.
- **FAIL:** Missing problem statement or ambiguous hypothesis.

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New PRD pattern identified
- Difficulty in defining solution hypothesis

If yes, append entry to: `product-manager-sidecar/prd-patterns.md`

### 3. Present MENU OPTIONS

## BEADS INTEGRATION

- Run: `bd update {epic_bead_id} --status=in_progress --notes="LBC in progress"`

- IF C: Read fully and follow `{nextStepFile}`
