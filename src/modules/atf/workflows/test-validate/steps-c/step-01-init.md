---
name: 'step-01-init'
description: 'Validate and test workflow'
---

# Step 1: Test & Validate

## SEQUENCE

### 1. Get Workflow ID
Parse from user input (ID or URL).

### 2. Fetch Workflow
```
n8n_get_workflow({workflow_id: "{id}"})
```

### 3. Structural Validation
```
n8n_validate_workflow({workflow_id: "{id}"})
```

### 4. Report Issues
"**Validation Results:**
- Structure: {pass/fail}
- Issues: {count}
{list issues}"

### 5. Offer Auto-Fix
If issues found:
```
n8n_autofix_workflow({workflow_id: "{id}", issues: [...]})
```

### 6. Test Execution (If Possible)
For webhook triggers:
```
n8n_test_workflow({workflow_id: "{id}", testData: {...}})
```

### 7. Final Report
"**✅ Workflow Status:**
- Validation: {status}
- Test: {status}
- Ready: {yes/no}"
