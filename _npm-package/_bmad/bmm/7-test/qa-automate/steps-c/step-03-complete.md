---
name: "step-03-complete"
description: "Finalize and register tests"
nextStepFile: "none"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "bd update {id} --status=ready --notes='Automation complete'"
qualityGate: "hard"
---

# Step 3 of 3 — Finalization

## STEP GOAL

Perform a final sync of the generated tests and close the automation session.

## MANDATORY SEQUENCE

1. Run a final audit on the generated file.
2. Confirm the Beads status update.
3. Offer final synchronization commands.

## SESSION CLOSE

1. `bd sync`
2. `git add {outputFile}`
3. `git commit -m "feat(qa): Automated tests for {id}"`
4. `bd sync`
5. `git push`

## MENU OPTIONS

[F] Finish — End workflow
