---
name: 'step-02-compare'
description: 'Compare selected nodes side-by-side'
nextStepFile: './step-03-details.md'
---

# Step 2: Compare

## STEP GOAL:
Compare top node candidates side-by-side.

## SEQUENCE

### 1. Fetch Details for Top 3
For each candidate:
```
get_node({nodeType: "{type}", detail: "summary"})
```

### 2. Build Comparison Table
"**📊 Node Comparison**

| Aspect | {node_1} | {node_2} | {node_3} |
|--------|----------|----------|----------|
| **Type** | {type} | {type} | {type} |
| **Source** | Official | Community | Official |
| **Auth** | OAuth2 | API Key | None |
| **Complexity** | Easy | Medium | Easy |
| **Operations** | 5 | 12 | 3 |
| **Last Updated** | 2026-01 | 2025-08 | 2026-02 |"

### 3. Highlight Differences
"**Key Differences:**

- **{node_1}**: {main_advantage}
- **{node_2}**: {main_advantage}  
- **{node_3}**: {main_advantage}

**Recommendation:** {best_choice} because {reasoning}"

### 4. Ask for Selection
"**Which node do you want to use?**

[1] {node_1}
[2] {node_2}
[3] {node_3}
[B] Back to search"

### 5. Handle Response
- IF 1-3: Store selection, load `{nextStepFile}`
- IF B: Load step-01-search.md

---

## SUCCESS METRICS
✅ Side-by-side comparison shown
✅ Key differences highlighted
✅ Clear recommendation given
