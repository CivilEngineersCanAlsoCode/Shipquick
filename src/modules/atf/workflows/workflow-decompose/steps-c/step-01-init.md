---
name: 'step-01-init'
description: 'Analyze and decompose workflow'
---

# Step 1: Decompose

## SEQUENCE

### 1. Analyze Workflow
Load workflow, count nodes, identify logical groups.

### 2. Identify Split Points
- Group by function (data fetch, transform, output)
- Target 10-15 nodes per sub-workflow
- Identify shared data points

### 3. Design Architecture
```
Orchestrator (main)
├── Sub-workflow 1: Data Collection
├── Sub-workflow 2: Transform
└── Sub-workflow 3: Output/Notify
```

### 4. Present Recommendation
"**📊 Decomposition Plan**

**Current:** {node_count} nodes
**Recommended:** {sub_workflow_count} sub-workflows

{architecture diagram}"

### 5. Execute If Approved
Create sub-workflows and orchestrator.
