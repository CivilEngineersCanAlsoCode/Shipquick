---
name: "step-e-03-save"
description: "Save and finalize modifications"
nextStepFile: "none"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "bd sync"
qualityGate: "hard"
---

# Edit Step 3 of 3 — Save & Sync

## STEP GOAL

Finalize the edit session and synchronize state.

## SESSION CLOSE

1. `bd sync`
2. `git add {outputFile}`
3. `git commit -m "docs(qa): Update test summary for {id}"`
4. `git push`

## MENU OPTIONS

[F] Finish — End edit workflow
