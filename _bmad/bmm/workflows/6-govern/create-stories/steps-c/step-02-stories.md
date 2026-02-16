---
name: "step-02-stories"
description: "Generate User Stories with Gherkin ACs"
nextStepFile: "./step-03-tasks.md"
beadsCommand: 'bd create --type=task --title="Story: {name}" --parent={feat_bead_id}'
qualityGate: hard
---

# Step 2: User Stories

## STEP GOAL:

Break the Feature into iteration-sized User Stories with Gherkin ACs.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Feature loaded successfully from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

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

## QUALITY GATE

- **PASS:** Stories follow "As a... I want... So that..." format, Gherkin ACs (min 2 scenarios) present, points estimated.
- **FAIL:** Missing scenarios, points, or non-Gherkin ACs.

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New story decomposition pattern identified
- Difficulty in estimating story points

If yes, append entry to: `product-manager-sidecar/feature-sizing.md`

[C] Continue — Generate Dev Tasks
"

## BEADS INTEGRATION

For each user story created:

- Run: `bd create --type=task --title="Story: {story_name}" --parent={feat_bead_id}`
- Store returned bead ID in story document frontmatter as `beadId`

- IF C: Read fully and follow `{nextStepFile}`
