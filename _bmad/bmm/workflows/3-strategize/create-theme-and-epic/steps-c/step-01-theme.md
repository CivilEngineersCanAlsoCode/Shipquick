---
name: "step-01-theme"
description: "Define the root Strategic Theme"

nextStepFile: "./step-02-epic.md"
outputFile: "{sq_output_folder}/theme-{theme_id}.md"
safeRules: "{project-root}/Instructions to Use/SAFE AGILE.md"
beadsCommand: 'bd create --type=epic --title="Theme: {name}"'
qualityGate: hard
---

# Step 1: Define Strategic Theme

**Progress: Step 1 of 4** — Next: Create Portfolio Epic

## STEP GOAL:

Define the root Strategic Theme that connects enterprise strategy to the portfolio. This is the top of the SAFe hierarchy.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `ls {project-root}/.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

### Soft Gates (SHOULD pass — warn if fail)

1. [ ] SG-01: PRD recommended -> Check if `{planning_artifacts}/prd.md` exists
   - If missing: "PRD exists? Theme/Epic will be stronger with a PRD. Continue anyway? [Y/N]"

## MANDATORY EXECUTION RULES:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Welcome)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md`
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md`

## MANDATORY SEQUENCE

### 1. Welcome & Context

"**Welcome {user_name}! Let's build your SAFe hierarchy.**

A **Strategic Theme** is a specific business objective that connects enterprise strategy to the portfolio. It's the 'North Star' for all downstream work.

**Example:** 'Accelerate digital transformation of customer-facing services'

**Tell me: What is the strategic business objective you want to address?**"

### 2. Capture Theme Details

Gather from user:

- **Theme Name**: Short, descriptive business objective
- **Theme Description**: 1-2 sentences of business context
- **Business Driver**: What's driving this (market, regulatory, competitive, internal)
- **Time Horizon**: Short-term (1 PI), Medium (2-3 PIs), Long-term (4+ PIs)

### 3. Create Theme Document

Create `{outputFile}` with:

```markdown
---
stepsCompleted: ["step-01-theme"]
type: strategic-theme
id: THEME-001
created: { date }
status: ACTIVE
---

# Strategic Theme: {theme_name}

## Description

{theme_description}

## Business Driver

{business_driver}

## Time Horizon

{time_horizon}

## Children

- _(Portfolio Epics will be linked here)_
```

## BEADS INTEGRATION

After creating the theme document, register in Beads:

- Run: `bd create --type=epic --title="Strategic Theme: {theme_name}"`
- Store the returned bead ID in the theme document frontmatter as `beadId`
- This ID will be used as parent when creating the Epic in step-02

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected
- User provided feedback that changes how we work

If yes, append entry to: `portfolio-sidecar/common-mistakes.md`

### 4. Present MENU OPTIONS

"**✓ Strategic Theme created:** {theme_name}

[C] Continue — Create Portfolio Epic linked to this Theme"

- IF C: Update frontmatter, read fully and follow `{nextStepFile}`
- IF user has questions: Answer, redisplay menu
