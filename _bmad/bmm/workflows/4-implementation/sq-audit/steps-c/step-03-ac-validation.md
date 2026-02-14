---
name: "step-03-ac-validation"
description: "Verify Gherkin AC presence at required levels"
nextStepFile: "./step-04-wsjf-check.md"
---

# Step 3: Acceptance Criteria Validation

## STEP GOAL:

Verify Gherkin-format ACs exist at all required levels (Epic, Capability, Feature, Story). Dev Tasks and Defects are exempt.

## MANDATORY SEQUENCE

### 1. AC Rules

- **Epics:** MUST have Gherkin ACs
- **Capabilities:** MUST have Gherkin ACs
- **Features:** MUST have Gherkin ACs
- **Stories:** MUST have Gherkin ACs
- **Dev Tasks:** NO ACs (descriptions only) — skip
- **QA Cases:** MUST be in Gherkin format

### 2. Scan & Validate

For each item at required levels, check:

- Has `Given/When/Then` blocks
- At least one AC exists
- Format is valid Gherkin

### 3. Report

"**AC Validation**

| Level | Items | With ACs | Missing |
| ----- | ----- | -------- | ------- |

{table_rows}

{if missing_count > 0}
⚠️ **{missing_count} item(s) missing ACs**
{list with IDs}
{else}
✅ **All required items have Gherkin ACs.**
{/if}

[C] Continue — WSJF consistency check"

- IF C: Read fully and follow `{nextStepFile}`
