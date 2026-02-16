---
name: "step-01-load-feature"
description: "Load target Feature for Story decomposition"
nextStepFile: "./step-02-stories.md"
---

# Step 1: Load Feature

## STEP GOAL:

Load the target Feature and prepare for Story/Task/QA decomposition.

## MANDATORY SEQUENCE

### 1. Identify Feature

"**Which Feature are you decomposing?**
Provide the Feature ID (e.g., FEAT-001) or name."

### 2. Validate & Present

"**Feature:** {feat_name} [WSJF: {wsjf}]
**Parent Capability:** {cap_name}
**Benefit Hypothesis:** {hypothesis}
**ACs:** {gherkin_count} acceptance criteria

[C] Continue — Generate User Stories"

- IF C: Read fully and follow `{nextStepFile}`
