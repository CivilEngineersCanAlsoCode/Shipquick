---
name: "step-03-ac-validation"
description: "Verify Gherkin AC presence at required levels"
nextStepFile: "./step-04-wsjf-check.md"
beadsCommand: "bd show {item_id}"
qualityGate: hard
---

# Step 3: Acceptance Criteria Validation

## STEP GOAL:

Verify Gherkin-format ACs exist at all required levels (Epic, Capability, Feature, Story). Dev Tasks and Defects are exempt.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Orphan check completed from step-02

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. AC Rules

**[DATA LOADED]** Loading `gherkin-quality-rules.csv` and `safe-hierarchy-rules.csv` for audit...

- **Epics:** MUST have Gherkin ACs
  "
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

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- Gherkin quality rules need adjustment
- Common AC mistakes identified

If yes, append entry to: `product-manager-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- For each item: `bd show {item_id}` to verify tracking
- Flag items missing Gherkin ACs at Capability, Feature, and Story levels

- IF C: Read fully and follow `{nextStepFile}`
