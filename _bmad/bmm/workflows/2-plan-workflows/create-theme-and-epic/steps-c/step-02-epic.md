---
name: "step-02-epic"
description: "Create Portfolio Epic with MVP hypothesis"

nextStepFile: "./step-03-wsjf.md"
outputFile: "{sq_output_folder}/epic-{epic_id}.md"
parentTheme: "{sq_output_folder}/theme-{theme_id}.md"
beadsCommand: 'bd create --type=epic --title="Epic: {name}" --parent={theme_bead_id}'
qualityGate: hard
---

# Step 2: Create Portfolio Epic

**Progress: Step 2 of 4** — Next: WSJF Calculation

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Parent Theme exists -> Theme document at `{parentTheme}` exists with valid content

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## STEP GOAL:

Define a Portfolio Epic with a benefit hypothesis and MVP definition, linked to the parent Strategic Theme.

## MANDATORY SEQUENCE

### 1. Epic Discovery

"**Now let's create a Portfolio Epic under your theme '{theme_name}'.**

A **Portfolio Epic** is a significant initiative that requires a Lean Business Case.

**Tell me:**

- What is the initiative you want to pursue?
- What value will it deliver to the business?
- What is the smallest thing (MVP) you could build to validate this?"

### 2. Capture Epic Details

Gather from user:

- **Epic Name**: Concise initiative description
- **Benefit Hypothesis**: If we [do this], we expect [this outcome], measured by [this metric]
- **MVP Definition**: Smallest deliverable to validate the hypothesis
- **Epic Type**: Business | Enabler
- **Acceptance Criteria** (Gherkin format):
  ```gherkin
  Given [precondition]
  When [action]
  Then [expected outcome]
  ```

### 3. Create Epic Document

Create `{outputFile}` with:

```markdown
---
stepsCompleted: ["step-01-theme", "step-02-epic"]
type: portfolio-epic
id: EPIC-001
parentId: THEME-001
created: { date }
status: FUNNEL
wsjf: null
---

# Portfolio Epic: {epic_name}

## Parent Theme

[{theme_name}]({parentTheme})

## Benefit Hypothesis

{benefit_hypothesis}

## MVP Definition

{mvp_definition}

## Epic Type

{business_or_enabler}

## Acceptance Criteria

{gherkin_acs}

## Children

- _(Capabilities will be linked here)_
```

### 4. Update Parent Theme

Append to the parent theme's Children section:

- `[{epic_name}]({outputFile})`

## BEADS INTEGRATION

After creating the epic document:

- Run: `bd create --type=epic --title="Portfolio Epic: {epic_name}" --parent={theme_bead_id}`
- Store the returned bead ID in the epic document frontmatter as `beadId`
- This ID will be used as parent when creating Capabilities

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected
- User provided feedback that changes how we work

If yes, append entry to: `portfolio-sidecar/common-mistakes.md`

### 5. Present MENU OPTIONS

"**✓ Portfolio Epic created:** {epic_name}
**Linked to Theme:** {theme_name}

[C] Continue — Calculate WSJF priority score"

- IF C: Update frontmatter, read fully and follow `{nextStepFile}`
