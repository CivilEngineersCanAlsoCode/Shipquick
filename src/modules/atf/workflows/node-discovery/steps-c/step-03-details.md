---
name: 'step-03-details'
description: 'Show full node details and operations'
nextStepFile: './step-04-configure.md'
---

# Step 3: Details

## STEP GOAL:
Display comprehensive details for the selected node.

## SEQUENCE

### 1. Fetch Full Details
```
get_node({nodeType: "{selected_type}", detail: "full"})
```

### 2. Display Node Info
"**📦 Node Details: {node_name}**

**Type:** `{type}`
**Version:** {version}
**Category:** {category}

---

**Description:**
{full_description}

---

**Operations:**
{list_of_operations_with_descriptions}

---

**Authentication:**
- Type: {auth_type}
- Credentials needed: {credential_type}
- Setup: {setup_notes}

---

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
{parameter_table}

---

**Example Input:**
```json
{example_input}
```

**Example Output:**
```json
{example_output}
```"

### 3. Offer Options
"**What would you like to do?**

[C] Configure this node — Get help setting it up
[E] See examples — Real-world usage examples
[B] Back to comparison
[D] Done — I have what I need"

### 4. Handle Response
- IF C: Load `{nextStepFile}`
- IF E: Show additional examples, redisplay menu
- IF B: Load step-02-compare.md
- IF D: End workflow with summary

---

## SUCCESS METRICS
✅ Full details displayed
✅ Operations listed clearly
✅ Parameters documented
✅ Examples provided
