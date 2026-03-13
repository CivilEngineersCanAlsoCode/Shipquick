---
name: 'step-01-init'
description: 'Check automation status'
---

# Step 1: Status Check

## SEQUENCE

### 1. Load State
Read output document for the automation.

### 2. Parse Progress
- stepsCompleted array
- Current phase
- Any blockers

### 3. Display Status
"**📊 Automation Status**

**Name:** {name}
**Progress:** {percent}%

✅ Scout — Requirements gathered
✅ Forge Master — Design complete
⏳ Welder — Building...
⬜ Inspector — Pending
⬜ Delivery — Pending

**Current:** {current_step}
**ETA:** {estimate}"

### 4. Offer Actions
"[C]ontinue | [P]ause | [V]iew details"
