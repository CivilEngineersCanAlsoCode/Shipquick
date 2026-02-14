---
name: "step-02-stories"
description: "Generate User Stories with Gherkin ACs"
nextStepFile: "./step-03-tasks.md"
---

# Step 2: User Stories

## STEP GOAL:

Break the Feature into iteration-sized User Stories with Gherkin ACs.

## MANDATORY SEQUENCE

### 1. Story Guidance

"**User Stories should be small enough to complete within a single iteration.**

Format: As a [role], I want [capability], so that [benefit].

Based on Feature '{feat_name}', what user-facing behaviors do we need?"

### 2. For Each Story

Gather:

- **Story Title**: As a [role], I want [capability]
- **So That**: Business justification
- **Acceptance Criteria** (Gherkin):
  ```gherkin
  Given [precondition]
  When [action]
  Then [expected outcome]
  ```
- **Story Points**: Relative estimate (1, 2, 3, 5, 8, 13)

Create story document:

```markdown
---
type: user-story
id: STORY-{N}
parentId: { feat_id }
points: { points }
status: DEFINED
---

# Story: {title}

## So That

{business_justification}

## Acceptance Criteria

{gherkin_acs}

## Parent Feature

[{feat_name}]({feat_path})
```

### 3. Review Stories

"**Created {N} Stories** totaling {total_points} story points.

[C] Continue — Generate Dev Tasks"

- IF C: Read fully and follow `{nextStepFile}`
