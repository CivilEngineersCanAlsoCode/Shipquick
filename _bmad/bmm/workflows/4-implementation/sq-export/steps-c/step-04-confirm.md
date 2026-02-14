---
name: "step-04-confirm"
description: "Final confirmation and export summary"
---

# Step 4: Export Confirmation

## STEP GOAL:

Present the final export summary and provide import instructions.

## MANDATORY SEQUENCE

### 1. Summary

"**✅ SAFe Hierarchy Export Complete!**

**Format:** {Jira|Rally|Both}
**Items Exported:** {count}
**File(s):**

- `{file_path}`

## Import Instructions

### Jira:

1. Go to **Projects** → your project
2. Click **Import Issues** → **CSV**
3. Upload the file and map columns
4. Preview and confirm import

### Rally:

1. Go to **Plan** → **Portfolio Items**
2. Click **Import** → **CSV Import**
3. Upload the file and map columns
4. Validate parent-child relationships

**Tip:** Run `/sq audit` after import to verify nothing was lost."
