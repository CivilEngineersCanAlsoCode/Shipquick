---
name: 'step-01-init'
description: 'Search for nodes and recommend options'
---

# Step 1: Node Discovery

## STEP GOAL:
Find and recommend n8n nodes for the user's needs.

## SEQUENCE

### 1. Get User Need
Wait for user to describe what they need.

### 2. Search Nodes
```
search_nodes({query: "{capability}", source: "all"})
```

### 3. Filter and Rank
- Filter by: relevance, popularity, maintenance status
- Prefer official over community (unless community is clearly better)
- Consider cost tier preference

### 4. Get Details for Top 3
For each top result:
```
get_node({nodeType: "{type}", detail: "full"})
```

### 5. Present Recommendations

"**📦 Node Recommendations**

**Best Match:**
🥇 **{node_name}** (`{type}`)
- {description}
- Credentials: {required}
- Complexity: {easy/medium/hard}

**Alternatives:**
🥈 **{node_2}** - {why}
🥉 **{node_3}** - {why}

**Which would you like to use?**"

### 6. Provide Node Details
When user selects:
- Show required parameters
- Show example configuration
- Offer to help configure

---

## SUCCESS METRICS
✅ Relevant nodes found
✅ Clear recommendation with rationale
✅ User can make informed choice
