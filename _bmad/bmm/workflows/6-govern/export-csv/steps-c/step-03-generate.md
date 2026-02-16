---
name: "step-03-generate"
description: "Generate and validate CSV files"
nextStepFile: "./step-04-confirm.md"
beadsCommand: 'bd update {export_bead_id} --notes="CSV generated"'
qualityGate: hard
---

# Step 3: Generate CSV

## STEP GOAL:

Write the CSV file(s) to the output folder.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Format mapping completed from step-02

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Generate File(s)

Write CSV to `{sq_output_folder}/export-{format}-{date}.csv`

If `both` format selected, generate two files:

- `export-jira-{date}.csv`
- `export-rally-{date}.csv`

### 2. Validate

- Check row count matches expected item count
- Verify no empty required fields
- Preview first 5 rows

### 3. Present Preview

"**CSV Generated:**

- File: `{file_path}`
- Rows: {row_count} (header + {data_count} items)

**Preview (first 5 rows):**

```
{csv_preview}
```

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- CSV generation error patterns
- File validation learning

If yes, append entry to: `governance-sidecar/audit-history.md`

## BEADS INTEGRATION

- Run: `bd update {export_bead_id} --notes="CSV generated: {row_count} rows, {file_path}"`

- IF C: Read fully and follow `{nextStepFile}`
