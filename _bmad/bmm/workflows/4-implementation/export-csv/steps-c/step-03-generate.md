---
name: "step-03-generate"
description: "Generate and validate CSV files"
nextStepFile: "./step-04-confirm.md"
---

# Step 3: Generate CSV

## STEP GOAL:

Write the CSV file(s) to the output folder.

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

[C] Continue — Final confirmation"

- IF C: Read fully and follow `{nextStepFile}`
