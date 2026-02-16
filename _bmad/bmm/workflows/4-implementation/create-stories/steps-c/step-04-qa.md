---
name: "step-04-qa"
description: "Generate Gherkin QA Test Cases and register all items"
---

# Step 4: QA Test Cases & Registration

## STEP GOAL:

Generate Gherkin test cases from Story ACs, register all items in Beads.

## MANDATORY SEQUENCE

### 1. QA Test Case Generation

For each Story's Acceptance Criteria, generate a matching test case:

```gherkin
Feature: {story_title}

  Scenario: {ac_description}
    Given {precondition}
    When {action}
    Then {expected_outcome}
```

### 2. Beads Registration

- Run: `bd create "Story: {story_name}" --type task --parent <FEATURE_ID>`
- Run: `bd create "Task: {task_name}" --type task --parent <STORY_ID>`
- Run: `bd create "QA: {qa_name}" --type task --parent <STORY_ID>`
- Propagate Feature context to all children

### 3. Final Summary

"**✅ Feature → Team Decomposition Complete!**

**Feature:** {feat_name}
**Stories:** {story_count} ({total_points} points)
**Dev Tasks:** {task_count}
**QA Cases:** {qa_count}

```
{feat_name} (FEAT-{id})
  ├── {story_1} (STORY-001) [{points}pts]
  │   ├── Task: {task_name}
  │   └── QA: {test_name}
  └── {story_N} (STORY-00N) [{points}pts]
      ├── Task: {task_name}
      └── QA: {test_name}
```

**All items registered in Beads.**

**Next Steps:**

- Run `/sq audit` for full hierarchy compliance check
- Run `/sq export` to generate Jira/Rally CSV"
