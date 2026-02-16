---
name: "step-v-04-links"
description: "Validate parent-child links"
nextStepFile: "./step-v-05-report.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "none"
qualityGate: "hard"
---

# Validate Step 4 of 5 — Traceability Links

## STEP GOAL

Ensure the test summary is correctly linked to its parent Bead and registered in the database.

## MANDATORY SEQUENCE

1. Verify `id` in frontmatter matches a registered Bead.
2. Run `bd show {id}` to check synchronized state.

## QUALITY GATE

- **PASS:** Bead ID verified in DB.
- **FAIL:** Orphaned or mismatched ID.

## MENU OPTIONS

[C] Continue — Generate report
