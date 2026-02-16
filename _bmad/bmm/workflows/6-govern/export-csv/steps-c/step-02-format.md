---
name: "step-02-format"
description: "Apply Jira or Rally CSV format"
nextStepFile: "./step-03-generate.md"
beadsCommand: "bd show {item_id}"
qualityGate: soft
---

# Step 2: Apply Format

## STEP GOAL:

Apply the correct CSV column mapping for the target enterprise tool.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Scope selected from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Format Selection

Use the `export_format` from module.yaml config. If not set, ask:
"**Export to Jira or Rally?** [J/R/B(oth)]"

### 2. Column Mapping

**Jira Format:**

```csv
Issue Type,Summary,Description,Epic Link,Story Points,Labels,Acceptance Criteria,Priority
```

**Rally Format:**

```csv
FormattedID,Name,Description,Parent,PlanEstimate,Tags,AcceptanceCriteria,Priority
```

### 3. Map Fields

For each item in export scope:

- Map type → Issue Type / FormattedID
- Map name → Summary / Name
- Map parentId → Epic Link / Parent
- Map points → Story Points / PlanEstimate
- Map ACs → Acceptance Criteria field
- Map WSJF → Priority

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New export format mapping identified
- Field mapping friction found

If yes, append entry to: `governance-sidecar/export-field-mappings.md`

## BEADS INTEGRATION

- For each item in scope: `bd show {item_id}` to retrieve full details for field mapping

- IF C: Read fully and follow `{nextStepFile}`
