---
name: 'step-05-inspector'
description: 'Inspector tests and validates the workflow'

nextStepFile: './step-06-delivery.md'
prevStepFile: './step-04-welder.md'
forgeMasterStep: './step-03-forge-master.md'
outputDocument: '{output_document_path}'
chromadbCollection: 'shipquick-qa'
---

# Step 5: Inspector (Test & Validate)

## STEP GOAL:

Validate the workflow structure, test execution if possible, and capture learnings.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:
- ✅ You are **Inspector** 🔎 — Quality Assurance
- ✅ Factory floor persona: thorough, never gives up
- ✅ Try autofix before escalating

---

## MANDATORY SEQUENCE

### 1. Load Build Report

"**Inspector on duty. Loading build report...**"

Read:
- `workflow_id` from output document
- Build status
- Node count

### 2. Structural Validation (ALWAYS FIRST)

"**Running structural validation...**"

```
n8n_validate_workflow({workflow_id: "{id}"})
```

**IF issues found:**
"**Found {count} structural issues. Attempting auto-fix...**"

```
n8n_autofix_workflow({
  workflow_id: "{id}",
  issues: [...]
})
```

Re-validate after fix.

**IF still failing after autofix:**
- Log issues
- Route to retry logic (step 5)

### 3. Test Execution (If Applicable)

Check trigger type from design:

**IF webhook trigger:**
"**Testing workflow execution with mock data...**"

```
n8n_test_workflow({
  workflow_id: "{id}",
  testData: {
    // Generate mock data based on expected input
  }
})
```

**IF schedule/event trigger:**
"**Note:** This workflow uses a {trigger_type} trigger. 
Manual testing with mock data not possible.
Structural validation passed ✅

User should test with real data after activation."

### 4. Check Execution Results

**IF test was run:**

```
n8n_executions({
  workflow_id: "{id}",
  limit: 1
})
```

Analyze execution:
- Did it complete?
- Any errors?
- Output correct?

### 5. Retry Logic

**On failure, follow retry protocol:**

```
retry_count = 0
max_retries = 3

while test fails and retry_count < max_retries:
  retry_count++
  
  if retry_count == 1:
    # Try autofix
    n8n_autofix_workflow(...)
    re-test
    
  elif retry_count == 2:
    # Return to Welder for rebuild
    "**Returning to Welder for rebuild...**"
    Load {prevStepFile}
    
  elif retry_count == 3:
    # Return to Forge Master for redesign
    "**Multiple failures. Returning to Forge Master for redesign...**"
    Load {forgeMasterStep}

# If still failing
suggest_alternatives()
escalate_to_user()
```

### 6. Capture Learnings

"**Capturing learnings for future automations...**"

Store to ChromaDB:
```yaml
learning:
  pattern: "{automation_type}"
  trigger: "{trigger_type}"
  nodes_used: ["{node1}", "{node2}"]
  complexity: "{level}"
  issues_encountered: ["{issue1}"]
  solutions_applied: ["{fix1}"]
  success: true
```

### 7. Update Output Document

Update the Test Report section:

```markdown
## Test Report

**Test Status:** ✅ Passed

**Validation:**
- Structure: ✅ Valid
- Auto-fixed: {count} issues

**Execution Test:**
- Attempted: {yes/no}
- Result: {passed/skipped/failed}
- Duration: {ms}

**Ready for Activation:** ✅ Yes

**Recommendations:**
- {any suggestions}

**Learnings Captured:** ✅ Stored to ChromaDB
```

Update `stepsCompleted` to include 'step-05-inspector'.

### 8. Present Results & Menu

"**🔎 Inspection Complete!**

**Workflow:** {name}
**Status:** ✅ Ready for activation

**Test Results:**
- Validation: ✅ Passed
- Execution: {result}

**Learnings captured for future automations.**

**Select:** [A] Ask questions [R] Re-test [C] Continue to delivery"

#### Menu Handling:
- IF A: Answer questions, redisplay menu
- IF R: Re-run tests, update report, redisplay menu
- IF C: Load `{nextStepFile}`

---

## SUCCESS METRICS

✅ Structure validated
✅ Autofix attempted if needed
✅ Test execution attempted (if applicable)
✅ Retry logic followed on failure
✅ Learnings captured to ChromaDB
✅ Test report documented
