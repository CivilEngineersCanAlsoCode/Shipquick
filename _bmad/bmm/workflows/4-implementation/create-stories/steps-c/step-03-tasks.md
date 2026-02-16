---
name: "step-03-tasks"
description: "Create Dev Tasks (descriptions only, no ACs)"
nextStepFile: "./step-04-qa.md"
beadsCommand: 'bd update {story_bead_id} --notes="Tasks defined"'
qualityGate: soft
---

# Step 3: Dev Tasks

## STEP GOAL:

Create Dev Tasks for each Story. **CRITICAL: Dev Tasks have descriptions, NOT acceptance criteria.**

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Stories created in step-02

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Task Generation

For each Story, identify implementation tasks:

- Backend tasks
- Frontend tasks
- Database/migration tasks
- Integration tasks

### 2. For Each Task

Create task entry (appended to Story doc):

```markdown
### Task: {task_name}

- **Type:** Dev Task
- **Description:** {what_to_implement}
- **Estimated Hours:** {hours}
```

**RULE: NO Gherkin ACs on Dev Tasks. Descriptions only.**

### 3. Summary

"**Created {N} Dev Tasks across {story_count} Stories.**

## QUALITY GATE

- **PASS:** Every story has 1+ dev tasks with descriptions and estimates.
- **FAIL:** Stories missing tasks or tasks containing Gherkin ACs (RULE-01 violation).

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- Implementation pattern identified
- Estimation accuracy learning

If yes, append entry to: `dev-squad-sidecar/implementation-patterns.md`

[C] Continue — Generate QA Test Cases
"

## BEADS INTEGRATION

- Update each story bead with task summary: `bd update {story_bead_id} --notes="Tasks: {task_count} defined"`

- IF C: Read fully and follow `{nextStepFile}`
