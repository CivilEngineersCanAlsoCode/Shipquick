---
name: 'step-01-init'
description: 'Deploy workflow to n8n'
---

# Step 1: Deploy

## SEQUENCE

### 1. Parse Input
Extract workflow specification from user input.

### 2. Validate Design
Ensure all required fields present:
- name, nodes, connections

### 3. Create Workflow
```
n8n_create_workflow({
  name: "{name}",
  nodes: [...],
  connections: {...},
  settings: {executionOrder: "v1"}
})
```

### 4. Validate Structure
```
n8n_validate_workflow({workflow_id: "{id}"})
```

### 5. Auto-Fix If Needed
```
n8n_autofix_workflow({workflow_id: "{id}", issues: [...]})
```

### 6. Report Success
"**🔥 Deployed!**

**ID:** {workflow_id}
**URL:** {url}
**Status:** ✅ Ready

**Next:** Configure credentials and activate."
