---
name: "step-01b-continue"
description: "Resume an interrupted Hierarchy Audit workflow from the last completed step"

# File References
outputFile: "{sq_output_folder}/audit-{date}.md"
---

# Step 1B: Workflow Continuation

## STEP GOAL:

Resume the Hierarchy Audit workflow from where it was left off, ensuring smooth continuation with full context restoration.

## MANDATORY EXECUTION RULES:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

## EXECUTION PROTOCOLS:

1. **Analyze Current State**: Review the frontmatter of the existing artifact to find the `stepsCompleted` array.
2. **Determine Next Step**:
   - Get the last filename from `stepsCompleted`.
   - Load that step file (from `./steps-c/`).
   - Extract the `nextStepFile` from its frontmatter.
3. **Restore Context**: Load any other relevant context mentioned in frontmatter.


## MEMORY CAPTURE

- **Mistake Tracking**: Append any user-corrected assumptions or agent errors to governance-sidecar/common-mistakes.md.
- **Learning**: Document new patterns or decisions to governance-sidecar/decomposition-patterns.md.

## MENU OPTIONS:

"Welcome back {user_name}! I've analyzed your progress on the Hierarchy Audit.

**Current Progress:**

- Last completed: {last step filename}
- Next up: {nextStepFile}

Ready to continue from where we left off?"

[C] Continue — Proceed to {nextStepFile}
[A] Start Over — Warning: This will overwrite existing work.

- IF C: Read fully and follow the determined `nextStepFile`.
- IF A: Route back to `step-01-scan.md`.
