# Story Refinement Instructions

<critical>The workflow execution engine is governed by: {project-root}/\_bmad-safe/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/\_bmad-safe/bmm-safe/workflows/4-implementation/story-refinement/workflow.yaml</critical>

## Purpose

Break Features into team-ready Stories with clear Acceptance Criteria.

---

## Refinement Process

### Step 1: Select Feature

- Choose Feature from PI plan
- Review benefit hypothesis

### Step 2: Identify Stories

- What Stories deliver this Feature?
- Consider User Stories and Enabler Stories

### Step 3: Write Stories

Use template: `{project-root}/_bmad-safe/bmm-safe/templates/safe/story-template.md`

**Format:**

```
As a [user type]
I want [capability]
So that [benefit]
```

### Step 4: Define Acceptance Criteria

**Given-When-Then format:**

```
Given [context]
When [action]
Then [expected result]
```

### Step 5: Estimate

- Use Story Points (1, 2, 3, 5, 8, 13)
- If > 8, split the Story

### Step 6: Validate INVEST

- Independent
- Negotiable
- Valuable
- Estimable
- Small
- Testable

---

## Splitting Large Stories

Use: `{project-root}/_bmad-safe/bmm-safe/tasks/split-story.md`

---

## Outputs

1. Ready Stories in backlog
2. Clear Acceptance Criteria
3. Story estimates
