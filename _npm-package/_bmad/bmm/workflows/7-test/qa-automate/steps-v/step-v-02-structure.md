---
name: "step-v-02-structure"
description: "Validate document structure"
nextStepFile: "./step-v-03-content.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "none"
qualityGate: "hard"
---

# Validate Step 2 of 5 — Structure

## STEP GOAL

Verify that the test summary document contains all mandatory frontmatter and sections.

## MANDATORY SEQUENCE

1. Check for `stepsCompleted`, `id`, `type`, and `status` in frontmatter.
2. Verify presence of "Target Bead", "Acceptance Criteria", and "Automated Test Scenarios".

## QUALITY GATE

- **PASS:** All mandatory sections present.
- **FAIL:** Missing required fields.

## MENU OPTIONS

[C] Continue — Validate content
