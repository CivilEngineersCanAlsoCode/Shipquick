---
name: "step-v-04-links"
description: "Validate hierarchy links and Beads"
nextStepFile: "./step-v-05-report.md"
---

# Step V4: Link Validation

## STEP GOAL:

Verify parent-child IDs match and sync status with Beads.

## MANDATORY SEQUENCE:

1. **Link Check**: Verify `parentId` refers to a valid existing artifact.
2. **Beads Audit**: Run `bd show {beadId}`. Verify status in document matches status in Beads.


## MEMORY CAPTURE

- **Mistake Tracking**: Append any user-corrected assumptions or agent errors to portfolio-sidecar/common-mistakes.md.
- **Learning**: Document new patterns or decisions to portfolio-sidecar/decomposition-patterns.md.

## MENU OPTIONS:

[C] Continue — Generate final validation report
