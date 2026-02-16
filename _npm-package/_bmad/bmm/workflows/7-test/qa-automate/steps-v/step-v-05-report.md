---
name: "step-v-05-report"
description: "Generate validation report"
nextStepFile: "none"
outputFile: "{implementation_artifacts}/tests/validation-report-{id}.md"
beadsCommand: "bd update {id} --status=closed"
qualityGate: "hard"
---

# Validate Step 5 of 5 — Final Report

## STEP GOAL

Summarize all validation findings and issue a PASS/FAIL verdict.

## VERDICT CRITERIA

- **PASS:** Structure, Content, and Links all verified.
- **FAIL:** Any critical gate failed.

## SESSION CLOSE

1. `bd sync`
2. `git add {outputFile}`
3. `git commit -m "audit(qa): Validation report for {id}"`
4. `git push`

## MENU OPTIONS

[F] Finish — Close validation
