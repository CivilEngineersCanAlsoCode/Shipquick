---
name: 'step-01-init'
description: 'Capture learning to ChromaDB'
---

# Step 1: Capture Learning

## SEQUENCE

### 1. Extract Pattern
From automation context:
- Trigger type
- Nodes used
- Problem solved
- Issues encountered
- Solutions applied

### 2. Format Q&A
```yaml
question: "How to {task}?"
answer: |
  Use {node} with {configuration}.
  Key settings: {settings}
  Watch out for: {gotchas}
```

### 3. Store to ChromaDB
Insert into `{chromadbCollection}`:
- Embed question for similarity search
- Store metadata (nodes, complexity)

### 4. Confirm
"**📚 Learning Captured!**

**Pattern:** {summary}
**Stored to:** ChromaDB ({collection})

This will help future automations."
