---
name: 'step-01-init'
description: 'Execute agent handoff'
---

# Step 1: Handoff

## SEQUENCE

### 1. Validate Handoff Data
Ensure required data present:
- Source agent output
- Target agent requirements
- Context/state

### 2. Transform Data
Map source output to target input format.

### 3. Log Handoff
Record in output document:
```
Handoff: {source} → {target}
Time: {timestamp}
Data: {summary}
```

### 4. Route to Target
Load appropriate agent step file.

### 5. Confirm
"**🤝 Handoff Complete**

**{source}** → **{target}**

Continuing automation..."
