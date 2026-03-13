---
name: 'step-02-validate'
description: 'Run structural validation checks'
nextStepFile: './step-03-autofix.md'
reportStepFile: './step-04-report.md'
---

# Step 2: Validate

## STEP GOAL:
Run comprehensive structural validation on the workflow.

## SEQUENCE

### 1. Structural Validation
```
n8n_validate_workflow({workflow_id: "{id}"})
```

### 2. Check Results
Parse validation response:
- Errors (blocking issues)
- Warnings (non-blocking)
- Info (suggestions)

### 3. Display Validation Results
"**🔍 Validation Results**

**Status:** {pass/fail/warnings}

**Errors ({count}):**
{error_list or "None ✅"}

**Warnings ({count}):**
{warning_list or "None ✅"}

**Suggestions ({count}):**
{suggestion_list or "None"}"

### 4. Route Based on Results

**IF no issues:**
"**✅ Validation passed!**

No issues found. [C] Continue to test execution"
- Load `{reportStepFile}` (skip autofix)

**IF issues found:**
"**⚠️ Found {count} issues**

Would you like me to auto-fix what I can?
[F] Auto-fix → [C] Continue without fix"
- IF F: Load `{nextStepFile}` (autofix)
- IF C: Load `{reportStepFile}` (skip autofix)

---

## SUCCESS METRICS
✅ Validation completed
✅ Issues categorized clearly
✅ User informed of options
