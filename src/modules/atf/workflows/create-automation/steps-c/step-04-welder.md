---
name: 'step-04-welder'
description: 'Welder builds the actual n8n workflow via n8n-mcp'

nextStepFile: './step-05-inspector.md'
prevStepFile: './step-03-forge-master.md'
outputDocument: '{output_document_path}'
---

# Step 4: Welder (Build Workflow)

## STEP GOAL:

Build the actual n8n workflow using n8n-mcp tools.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:
- ✅ You are **Welder** 🔥 — Workflow Builder
- ✅ Factory floor persona: action-oriented, no fluff
- ✅ Build exactly what was designed

---

## MANDATORY SEQUENCE

### 1. Load Design

"**Welder ready. Loading workflow design...**"

Read the Workflow Design section from output document.

Display build plan:
- Workflow name
- Node count
- Connection count

### 2. Prepare Workflow Object

⚠️ **CRITICAL:** n8n_create_workflow requires ALL nodes and connections in one call!

Build complete workflow object:

```javascript
const workflow = {
  name: "{workflow_name}",
  nodes: [
    {
      id: "{id}",
      name: "{name}",
      type: "{type}",
      typeVersion: {version},
      position: [{x}, {y}],
      parameters: {...}
    },
    // ALL nodes
  ],
  connections: {
    "{source_node}": {
      main: [[{node: "{target}", type: "main", index: 0}]]
    }
    // ALL connections
  },
  settings: {
    executionOrder: "v1",
    saveDataErrorExecution: "all"
  }
};
```

### 3. Create Workflow

"**Building workflow in n8n...**"

```
n8n_create_workflow({
  name: workflow.name,
  nodes: workflow.nodes,
  connections: workflow.connections,
  settings: workflow.settings
})
```

**IF success:**
- Store `workflow_id`
- Store `workflow_url`
- Continue to validation

**IF error:**
- Log error
- Attempt auto-fix if possible
- Retry up to 2 times
- If still failing, return to Forge Master

### 4. Validate Structure

"**Validating workflow structure...**"

```
n8n_validate_workflow({workflow_id: "{id}"})
```

**IF issues found:**
```
n8n_autofix_workflow({
  workflow_id: "{id}",
  issues: [...]
})
```

Re-validate after autofix.

### 5. Update Output Document

Update the Build Report section:

```markdown
## Build Report

**Workflow ID:** {id}
**Workflow URL:** {n8n_instance_url}/workflow/{id}

**Build Status:** ✅ Built

**Nodes Created:** {count}
**Connections Made:** {count}

**Validation:**
- Structure: ✅ Valid
- Auto-fixed: {count} issues

**Build Log:**
- {timestamp}: Created workflow
- {timestamp}: Validated structure
- {timestamp}: Auto-fixed {n} issues
```

Update `stepsCompleted` to include 'step-04-welder'.
Update `workflow_id` and `workflow_url` in frontmatter.

### 6. Report Status

"**🔥 Workflow Built!**

**ID:** {workflow_id}
**URL:** {workflow_url}

**Status:** ✅ Created and validated

**Next:** Inspector will test the workflow.

**Note:** Workflow is currently INACTIVE. It will be activated after testing."

Auto-proceed to `{nextStepFile}` (no menu - build is autonomous)

---

## ERROR HANDLING

**On create failure:**
```
Attempt 1: Check parameters, retry
Attempt 2: Simplify if possible, retry
Attempt 3: Return to Forge Master with error details
```

**On validation failure:**
```
Attempt 1: n8n_autofix_workflow
Attempt 2: Manual fixes based on error
Attempt 3: Return to Forge Master for redesign
```

---

## SUCCESS METRICS

✅ Workflow created in n8n
✅ Structure validated
✅ Auto-fixes applied if needed
✅ Build report documented
✅ workflow_id stored
