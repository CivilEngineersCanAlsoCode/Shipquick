# Usability Testing Workflow

## Purpose

Validate design decisions by observing real users interacting with prototypes or live features. Identify usability issues before development investment.

## Pre-Conditions

- A testable artifact exists (prototype, wireframe, or live feature).
- Target personas are defined.
- 5 participants recruited (catches ~85% of usability issues).

## Workflow Steps

### Step 1: Define Test Objectives (10 min)

1. What specific questions do we want answered?
   - Example: "Can users complete checkout in under 3 steps?"
   - Example: "Do users find the search filter intuitive?"
2. Define **success metrics**:
   - Task completion rate (target: >80%)
   - Time on task (target: under X seconds)
   - Error rate (target: <2 errors per task)
   - Satisfaction score (target: >4/5)

### Step 2: Write Test Script (20 min)

```markdown
## Usability Test Script

### Introduction (2 min)

"Hi [name], thanks for helping us today. We're testing the [product], not you.
There are no wrong answers. Think out loud as you go — tell us what you're
thinking, what you expect to happen, and what confuses you."

### Warm-Up Questions (3 min)

1. "Tell me briefly about your role."
2. "How do you currently handle [relevant task]?"

### Task Scenarios (20-30 min)

**Task 1**: [Specific scenario with context]
"Imagine you need to [goal]. Please show me how you would do that."

- Success Criteria: [What constitutes completion]
- Observe: [What to watch for]

**Task 2**: [Next scenario]
...

### Debrief Questions (5 min)

1. "What was the most confusing part?"
2. "What would you change if you could?"
3. "How would you rate the overall ease of use? (1-5)"
```

### Step 3: Set Up Environment (10 min)

1. Prepare the prototype/build at the correct state.
2. Set up screen recording (with permission).
3. Prepare note-taking template:

| Task   | Completed? | Time  | Errors | Observations | Severity |
| ------ | ---------- | ----- | ------ | ------------ | -------- |
| Task 1 | Y/N        | 00:00 | 0      |              | H/M/L    |

### Step 4: Conduct Sessions (40 min per participant)

1. **Moderate**: Guide without leading. Use neutral prompts:
   - "What do you think that does?"
   - "What would you try next?"
   - "Tell me more about why you clicked there."
2. **Observe**: Note where users hesitate, backtrack, or express confusion.
3. **Don't Help**: Resist the urge to explain the UI. Silence is data.

### Step 5: Analyze Findings (30 min)

1. Compile notes from all sessions.
2. Group issues by **severity**:

| Severity        | Definition                                 | Action                   |
| --------------- | ------------------------------------------ | ------------------------ |
| **Critical**    | User cannot complete task                  | Must fix before release  |
| **Major**       | User completes with significant difficulty | Fix in current iteration |
| **Minor**       | User notices but works around it           | Fix when possible        |
| **Enhancement** | User suggests improvement                  | Add to backlog           |

3. Create a **findings report** with screenshots/clips.

### Step 6: Report & Handoff (15 min)

1. Present top 5 findings to PM and Dev Squad.
2. Create User Stories for critical/major issues.
3. Update relevant Feature acceptance criteria.

## Output

- Usability test findings report (Markdown).
- Prioritized issue list with severity ratings.
- User Stories for critical fixes.
