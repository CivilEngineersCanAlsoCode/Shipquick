---
name: "step-02-format"
description: "Apply Jira or Rally CSV format"
nextStepFile: "./step-03-generate.md"
---

# Step 2: Apply Format

## STEP GOAL:

Apply the correct CSV column mapping for the target enterprise tool.

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

"[C] Continue — Generate CSV file(s)"

- IF C: Read fully and follow `{nextStepFile}`
