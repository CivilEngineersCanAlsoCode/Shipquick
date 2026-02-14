---
name: "step-03-tasks"
description: "Create Dev Tasks (descriptions only, no ACs)"
nextStepFile: "./step-04-qa.md"
---

# Step 3: Dev Tasks

## STEP GOAL:

Create Dev Tasks for each Story. **CRITICAL: Dev Tasks have descriptions, NOT acceptance criteria.**

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

[C] Continue — Generate QA Test Cases"

- IF C: Read fully and follow `{nextStepFile}`
