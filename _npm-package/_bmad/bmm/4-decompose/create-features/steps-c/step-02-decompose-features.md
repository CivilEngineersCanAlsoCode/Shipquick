---
name: "step-02-decompose-features"
description: "Decompose Capability into Features"
nextStepFile: "./step-03-link-features.md"
beadsCommand: 'bd create --type=task --title="Feat: {name}" --parent={cap_bead_id}'
qualityGate: hard
---

# Step 2: Feature Decomposition

## STEP GOAL:

Break the Capability into N Features, each with benefit hypothesis and Gherkin ACs.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Capability loaded successfully from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Feature Guidance

"**A Feature is a service or function that fulfills a stakeholder need, sized to fit within a PI.**

**[DATA LOADED]** Loading `decomposition-patterns.csv` for ART-level sizing...

Based on the Capability '{cap_name}', what distinct features are needed?
"

### 2. For Each Feature

Gather:

- **Feature Name**: User-centric behavior description
- **Benefit Hypothesis**: We believe [feature] will [result in outcome]
- **Acceptance Criteria** (Gherkin format)

Create feature document:

```markdown
---
type: feature
id: FEAT-{N}
parentId: { cap_id }
wsjf: { inherited_wsjf }
status: IDENTIFIED
---

# Feature: {name}

## Parent Capability

[{cap_name}]({cap_path})

## Benefit Hypothesis

{hypothesis}

## Acceptance Criteria

{gherkin_acs}

## Children

- _(Stories will be linked here)_
```

### 3. Review & Confirm

List all Features. Allow modifications.

"## QUALITY GATE

- **PASS:** Features have benefit hypotheses and Gherkin ACs, sized for 1 PI.
- **FAIL:** Missing hypothesis or non-Gherkin ACs.

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New decomposition pattern identified
- Difficulty in sizing features for PI

If yes, append entry to: `portfolio-sidecar/decomposition-patterns.md`

[C] Continue — Link and propagate
"

## BEADS INTEGRATION

For each feature created:

- Run: `bd create --type=task --title="Feat: {feature_name}" --parent={cap_bead_id}`
- Store returned bead ID in feature document frontmatter as `beadId`
- These IDs will be used as parents when creating Stories

- IF C: Read fully and follow `{nextStepFile}`
