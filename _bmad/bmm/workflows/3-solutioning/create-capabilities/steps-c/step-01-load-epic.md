---
name: "step-01-load-epic"
description: "Load approved Epic for decomposition"
nextStepFile: "./step-02-decompose.md"
---

# Step 1: Load Epic

## STEP GOAL:

Load the target approved Epic and prepare for Capability decomposition.

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

[C] Continue — Begin decomposition into Capabilities"

- IF C: Read fully and follow `{nextStepFile}`
