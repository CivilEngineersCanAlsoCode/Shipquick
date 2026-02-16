---
name: "step-v-01-discovery"
description: "Load artifact and dependencies for validation"
nextStepFile: "./step-v-02-structure.md"
---

# Step V1: Discovery

## STEP GOAL:

Identify and load the Theme/Epic artifact. Load parent/child context if available.

## MANDATORY SEQUENCE:

1. **Select Artifact**: Ask the user to provide the path or ID of the Theme/Epic to validate.
2. **Load Artifact**: Read the complete document.
3. **Load Context**: Attempt to load the parent (e.g., Theme for an Epic) or children (e.g., Epics for a Theme).


## MEMORY CAPTURE

- **Mistake Tracking**: Append any user-corrected assumptions or agent errors to portfolio-sidecar/common-mistakes.md.
- **Learning**: Document new patterns or decisions to portfolio-sidecar/decomposition-patterns.md.

## MENU OPTIONS:

[C] Continue — Proceed to structure validation
[B] Back — Return to main menu
