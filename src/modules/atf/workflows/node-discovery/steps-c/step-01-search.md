---
name: 'step-01-search'
description: 'Search for nodes matching capability'
nextStepFile: './step-02-compare.md'
---

# Step 1: Search

## STEP GOAL:
Search for n8n nodes that match the user's capability need.

## SEQUENCE

### 1. Parse User Need
Extract keywords from user's description:
- Service names (Gmail, Slack, etc.)
- Actions (send, read, create, etc.)
- Data types (email, spreadsheet, API, etc.)

### 2. Search Nodes
```
search_nodes({
  query: "{capability}",
  source: "all"  // official + community
})
```

### 3. Filter Results
Apply filters:
- Relevance score > 0.5
- Prefer official over community
- Consider maintenance status

### 4. Display Results
"**🔍 Found {count} nodes for '{capability}'**

**Top Matches:**

🥇 **{node_1_name}** (`{type}`)
   {description}
   Source: {official/community}

🥈 **{node_2_name}** (`{type}`)
   {description}
   Source: {official/community}

🥉 **{node_3_name}** (`{type}`)
   {description}
   Source: {official/community}

{more if available}

**Select:** [1-3] Compare details | [S] Search again | [C] Continue with top match"

### 5. Handle Response
- IF 1-3: Note selection, load `{nextStepFile}`
- IF S: Ask for new search terms, repeat step 2
- IF C: Select top match, load `{nextStepFile}`

---

## SUCCESS METRICS
✅ Relevant nodes found
✅ Results clearly ranked
✅ User can choose or search again
