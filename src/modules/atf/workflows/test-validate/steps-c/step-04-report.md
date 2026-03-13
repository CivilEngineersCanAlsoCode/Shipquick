---
name: 'step-04-report'
description: 'Test execution and final report'
---

# Step 4: Report

## STEP GOAL:
Test workflow execution (if possible) and present final report.

## SEQUENCE

### 1. Check Trigger Type
Determine if test execution is possible:
- Webhook → Can test with mock data
- Schedule/Event → Cannot test automatically

### 2. Test Execution (If Applicable)
**IF webhook trigger:**
```
n8n_test_workflow({
  workflow_id: "{id}",
  testData: {mock_data_based_on_schema}
})
```

Wait for execution, then check:
```
n8n_executions({workflow_id: "{id}", limit: 1})
```

**IF other trigger:**
"**Note:** This workflow uses a {trigger_type} trigger.
Automatic test execution not available.
Please test manually after activation."

### 3. Compile Final Report
"**📋 Final Report: {workflow_name}**

---

**Workflow:**
- ID: `{id}`
- Nodes: {count}
- Status: {active/inactive}

**Validation:**
- Structure: {pass/fail}
- Issues found: {count}
- Auto-fixed: {count}
- Remaining: {count}

**Execution Test:**
- Attempted: {yes/no}
- Result: {passed/skipped/failed}

**Ready for Activation:** {yes/no/with-caveats}

---

**Recommendations:**
{list_of_suggestions}"

### 4. Offer Next Steps
"**What's next?**

- [A]ctivate — Turn on this workflow
- [F]ix — Address remaining issues
- [T]est again — Re-run validation
- [D]one — All set!"

---

## SUCCESS METRICS
✅ Test execution attempted (if possible)
✅ Comprehensive report generated
✅ Clear activation readiness status
✅ Actionable recommendations provided
