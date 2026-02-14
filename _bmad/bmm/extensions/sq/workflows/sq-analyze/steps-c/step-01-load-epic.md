---
name: "step-01-load-epic"
description: "Load and validate the target Portfolio Epic"
nextStepFile: "./step-02-business-case.md"
---

# Step 1: Load Epic

## STEP GOAL:

Load the target Portfolio Epic from Beads or file system and validate it has the required fields.

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

[C] Continue — Begin Lean Business Case"

- IF C: Read fully and follow `{nextStepFile}`
