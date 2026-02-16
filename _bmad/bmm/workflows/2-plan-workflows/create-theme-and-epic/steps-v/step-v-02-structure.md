---
name: "step-v-02-structure"
description: "Validate document structure and frontmatter"
nextStepFile: "./step-v-03-content.md"
---

# Step V2: Structure Validation

## STEP GOAL:

Check for required frontmatter fields and section headers.

## MANDATORY SEQUENCE:

1. **Check Frontmatter**:
   - MUST have: `id`, `type`, `status`, `stepsCompleted`
   - SHOULD have: `beadId`, `created`
2. **Check Headers**: Verify presence of `# Strategic Theme` or `# Portfolio Epic` and core sections.

## MENU OPTIONS:

[C] Continue — Proceed to content quality validation
[F] Report Findings — If catastrophic structural issues found
