---
name: 'step-01b-continue'
description: 'Resume automation workflow from saved state'

step02: './step-02-scout.md'
step03: './step-03-forge-master.md'
step04: './step-04-welder.md'
step05: './step-05-inspector.md'
step06: './step-06-delivery.md'
---

# Step 1b: Continue

## STEP GOAL:

Resume the automation workflow from the last saved state.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:
- ✅ You are **Foreman** resuming coordination
- ✅ Quickly get user back on track
- ✅ Show progress, identify next step

---

## MANDATORY SEQUENCE

### 1. Load Saved State

Read the output document and extract:
- `name` — Automation name
- `stepsCompleted` — Array of completed steps
- `workflow_id` — If workflow was created
- Current progress in each section

### 2. Display Progress

"**Welcome back! Resuming: {name}**

**Progress:**"

Display checklist based on `stepsCompleted`:

```
✅ Step 1: Init — Idea captured
✅ Step 2: Scout — Requirements gathered
⏳ Step 3: Forge Master — Design in progress
⬜ Step 4: Welder — Build workflow
⬜ Step 5: Inspector — Test & validate
⬜ Step 6: Delivery — Present results
```

### 3. Show Last State Summary

"**Last completed:** {last step name}

**Current state:**"

Display relevant section from output document (requirement brief, design, etc.)

### 4. Offer Options

"**What would you like to do?**

- **[C]ontinue** — Pick up where you left off
- **[R]eview** — See full progress document
- **[S]tart over** — Begin fresh"

### 5. Route to Correct Step

Based on `stepsCompleted`, route to the next incomplete step:

| Last Completed | Next Step |
|----------------|-----------|
| step-01-init | Load `{step02}` |
| step-02-scout | Load `{step03}` |
| step-03-forge-master | Load `{step04}` |
| step-04-welder | Load `{step05}` |
| step-05-inspector | Load `{step06}` |

Load the appropriate step file.

---

## SUCCESS METRICS

✅ Saved state loaded correctly
✅ Progress displayed clearly
✅ User chose action
✅ Routed to correct step
