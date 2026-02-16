---
name: "step-e-01-load"
description: "Load existing test summary for modification"
nextStepFile: "./step-e-02-modify.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "none"
qualityGate: "hard"
---

# Edit Step 1 of 3 — Load Artifact

## STEP GOAL

Load an existing test summary to modify its scenarios or verification results.

## MANDATORY SEQUENCE

1. Ask the user for the Bead ID or the path to the existing test summary.
2. Load the file and display its current content (Scenarios, results, metadata).
3. Confirm with the user if they want to proceed with modifications.

## QUALITY GATE

- **PASS:** Artifact exists and is valid YAML/Markdown.
- **FAIL:** File not found or corrupt.

## MENU OPTIONS

[C] Continue — Modify scenarios
