---
name: "step-01-load-capability"
description: "Load target Capability for Feature decomposition"
nextStepFile: "./step-02-decompose-features.md"
---

# Step 1: Load Capability

## STEP GOAL:

Load the target Capability and prepare for Feature decomposition.

## MANDATORY SEQUENCE

### 1. Identify Capability

"**Which Capability are you decomposing into Features?**
Provide the Capability ID (e.g., CAP-001) or name."

### 2. Validate & Present

Load Capability, verify parent Epic link, show context:
"**Capability:** {cap_name} [WSJF: {wsjf}]
**Parent Epic:** {epic_name}
**ACs:** {gherkin_summary}

[C] Continue — Begin Feature decomposition"

- IF C: Read fully and follow `{nextStepFile}`
