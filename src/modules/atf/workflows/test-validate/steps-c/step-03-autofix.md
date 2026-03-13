---
name: 'step-03-autofix'
description: 'Attempt automatic fixes for detected issues'
nextStepFile: './step-04-report.md'
---

# Step 3: Auto-Fix

## STEP GOAL:
Automatically fix detected issues and re-validate.

## SEQUENCE

### 1. Attempt Auto-Fix
```
n8n_autofix_workflow({
  workflow_id: "{id}",
  issues: [{issue_list}]
})
```

### 2. Display Fix Results
"**🔧 Auto-Fix Results**

**Fixed ({count}):**
{fixed_list}

**Could not fix ({count}):**
{unfixed_list}"

### 3. Re-Validate
```
n8n_validate_workflow({workflow_id: "{id}"})
```

### 4. Compare Results
"**📊 After Auto-Fix:**

| Check | Before | After |
|-------|--------|-------|
| Errors | {before} | {after} |
| Warnings | {before} | {after} |

**Remaining issues:** {count}"

### 5. Handle Remaining Issues
**IF all fixed:**
"**✅ All issues resolved!**

[C] Continue to final report"

**IF some remain:**
"**⚠️ {count} issues remain**

These need manual attention:
{remaining_issues}

[C] Continue to report | [R] Retry fix"

- IF C: Load `{nextStepFile}`
- IF R: Re-run autofix

---

## SUCCESS METRICS
✅ Auto-fix attempted
✅ Results clearly reported
✅ Before/after comparison shown
