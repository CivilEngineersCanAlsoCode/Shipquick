---
name: "step-03-wsjf"
description: "Calculate WSJF priority score"

nextStepFile: "./step-04-register.md"
epicFile: "{sq_output_folder}/epic-{epic_id}.md"
---

# Step 3: WSJF Calculation

**Progress: Step 3 of 4** — Next: Register in Beads

## STEP GOAL:

Calculate the Weighted Shortest Job First (WSJF) score for the Epic.

## MANDATORY SEQUENCE

### 1. Explain WSJF

"**WSJF = Cost of Delay ÷ Job Size**

Cost of Delay is the sum of:

- **User-Business Value** (1-21 Fibonacci): How much value does this deliver?
- **Time Criticality** (1-21): How urgent is this? Will value decay if delayed?
- **Risk Reduction / Opportunity Enablement** (1-21): Does this reduce risk or enable new opportunities?

**Job Size** (1-21): How big is this relative to other items?

Let's score your Epic."

### 2. Gather Scores

For each component, ask the user to assign a value (1, 2, 3, 5, 8, 13, 21):

- User-Business Value
- Time Criticality
- Risk Reduction / Opportunity Enablement
- Job Size

### 3. Calculate & Present

```
Cost of Delay = UBV + TC + RROE
WSJF = CoD / Job Size
```

"**WSJF Score: {wsjf_score}**

- CoD: {cod} (UBV:{ubv} + TC:{tc} + RROE:{rroe})
- Job Size: {job_size}
- Priority: {High/Medium/Low based on relative WSJF}"

### 4. Update Epic Document

Add WSJF fields to `{epicFile}` frontmatter:

```yaml
wsjf: { wsjf_score }
wsjf_ubv: { ubv }
wsjf_tc: { tc }
wsjf_rroe: { rroe }
wsjf_job_size: { job_size }
```

### 5. Present MENU OPTIONS

"**✓ WSJF calculated:** {wsjf_score}

[C] Continue — Register in Beads for persistent tracking"

- IF C: Read fully and follow `{nextStepFile}`
