---
name: "step-04-qa"
description: "Generate Gherkin QA Test Cases and register all items"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 4: QA Test Cases & Registration

## STEP GOAL:

Generate Gherkin test cases from Story ACs, register all items in Beads.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Stories and tasks created in steps 02-03
3. [ ] HG-08: Gherkin ACs present -> Each story has min 2 Gherkin scenarios

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

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

## QUALITY GATE

- **PASS:** All Hard Gates (HG-01, HG-08) pass, QA cases generated in Gherkin, all items registered in Beads with parent links.
- **FAIL:** QA cases missing, hierarchy broken, or Beads sync error.

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `test-architect-sidecar/test-strategy-evolution.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "feat: decomposed Feature into stories for {feat_name}"`
4. `bd sync`
5. `git push`

**Next Steps:**
