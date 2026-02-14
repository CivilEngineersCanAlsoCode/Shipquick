---
name: "step-02-business-case"
description: "Create Lean Business Case for the Epic"
nextStepFile: "./step-03-mvp.md"
---

# Step 2: Lean Business Case

## STEP GOAL:

Facilitate the creation of a structured Lean Business Case following SAFe 6.0 format.

## MANDATORY SEQUENCE

### 1. Guide Through Sections

Facilitate each section collaboratively:

**Problem Statement:**
"What problem does this Epic solve? Who is affected and how?"

**Solution Hypothesis:**
"If we [proposed solution], then [expected outcome], as measured by [key metric]."

**Leading Indicators:**
"What early signals will tell us we're on the right track?"

**Non-Functional Requirements:**
"Any compliance, performance, security, or scalability requirements?"

### 2. Compile Business Case

Add to Epic document:

```markdown
## Lean Business Case

### Problem Statement

{problem}

### Solution Hypothesis

{hypothesis}

### Leading Indicators

{indicators}

### Non-Functional Requirements

{nfrs}
```

### 3. Present MENU OPTIONS

"**✓ Lean Business Case drafted.**

[C] Continue — Define the MVP"

- IF C: Read fully and follow `{nextStepFile}`
