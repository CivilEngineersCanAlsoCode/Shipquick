---
name: "step-01-theme"
description: "Define the root Strategic Theme"

nextStepFile: "./step-02-epic.md"
outputFile: "{sq_output_folder}/theme-{theme_id}.md"
safeRules: "{project-root}/Instructions to Use/SAFE AGILE.md"
---

# Step 1: Define Strategic Theme

**Progress: Step 1 of 4** — Next: Create Portfolio Epic

## STEP GOAL:

Define the root Strategic Theme that connects enterprise strategy to the portfolio. This is the top of the SAFe hierarchy.

## MANDATORY EXECUTION RULES:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

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

### 4. Present MENU OPTIONS

"**✓ Strategic Theme created:** {theme_name}

[C] Continue — Create Portfolio Epic linked to this Theme"

- IF C: Update frontmatter, read fully and follow `{nextStepFile}`
- IF user has questions: Answer, redisplay menu
