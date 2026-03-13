---
name: 'step-01-init'
description: 'Escalate to user'
---

# Step 1: Escalate

## SEQUENCE

### 1. Summarize Problem
"**🚨 I need your help**

**What happened:**
{error_description}

**What I tried:**
1. {attempt_1}
2. {attempt_2}
3. {attempt_3}

**Why I'm stuck:**
{blocker_reason}"

### 2. Present Options
"**Your options:**

1. **Fix it yourself** — I'll tell you exactly what to do
2. **Give me guidance** — Point me in the right direction
3. **Try alternative** — Let me suggest a different approach
4. **Abort** — Cancel this automation

**What would you like to do?**"

### 3. Handle Response
- Fix: Provide step-by-step instructions
- Guidance: Incorporate and retry
- Alternative: Load alternative-suggest workflow
- Abort: Save state, clean up

### 4. Resume or Close
After user intervention, either:
- Resume automation from last good state
- Close with partial results
