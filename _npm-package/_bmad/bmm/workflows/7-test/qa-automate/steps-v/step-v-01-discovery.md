---
name: "step-v-01-discovery"
description: "Load test summary for validation"
nextStepFile: "./step-v-02-structure.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "none"
qualityGate: "hard"
---

# Validate Step 1 of 5 — Discovery

## STEP GOAL

Identify and load the test summary that requires formal validation.

## MANDATORY SEQUENCE

1. Ask the user for the Bead ID or file path.
2. Load the file and its parent Bead context.

## MENU OPTIONS

[C] Continue — Validate structure
