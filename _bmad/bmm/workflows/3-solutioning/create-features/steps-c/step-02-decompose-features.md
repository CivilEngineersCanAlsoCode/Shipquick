---
name: "step-02-decompose-features"
description: "Decompose Capability into Features"
nextStepFile: "./step-03-link-features.md"
---

# Step 2: Feature Decomposition

## STEP GOAL:

Break the Capability into N Features, each with benefit hypothesis and Gherkin ACs.

## MANDATORY SEQUENCE

### 1. Feature Guidance

"**A Feature is a service or function that fulfills a stakeholder need, sized to fit within a PI.**

Based on the Capability '{cap_name}', what distinct features are needed?

Think about:

- What user-facing or system-level behaviors does this Capability require?
- Can each be delivered by a single ART within one PI?
- What's the benefit hypothesis for each?"

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

"[C] Continue — Link and propagate"

- IF C: Read fully and follow `{nextStepFile}`
