---
name: 'step-01-load'
description: 'Load and display workflow details'
nextStepFile: './step-02-validate.md'
---

# Step 1: Load Workflow

## STEP GOAL:
Fetch and display workflow details before validation.

## SEQUENCE

### 1. Parse Input
Extract workflow ID from user input:
- Direct ID: `FE0Ovwp0qVqX1dep`
- URL: `https://n8n.example.com/workflow/FE0Ovwp0qVqX1dep`

### 2. Fetch Workflow
```
n8n_get_workflow({workflow_id: "{id}"})
```

### 3. Display Summary
"**📋 Workflow Loaded**

**Name:** {name}
**ID:** `{id}`
**Status:** {active/inactive}
**Nodes:** {count}
**Connections:** {count}

**Node List:**
| # | Type | Name |
|---|------|------|
{node_table}

**Ready to validate?** [C] Continue"

### 4. Handle Response
- IF C: Load `{nextStepFile}`
- IF user asks questions: Answer, redisplay menu

---

## SUCCESS METRICS
✅ Workflow ID parsed correctly
✅ Workflow fetched successfully
✅ Summary displayed clearly
