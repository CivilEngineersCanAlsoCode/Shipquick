---
name: "step-e-02-modify"
description: "Modify test scenarios"
nextStepFile: "./step-e-03-save.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "bd update {id} --notes='Test scenarios modified'"
qualityGate: "soft"
---

# Edit Step 2 of 3 — Modify Scenarios

## STEP GOAL

Apply changes to the test scenarios based on new requirements or feedback.

## MANDATORY SEQUENCE

1. Present the current scenarios to the user.
2. Accept changes or additions (e.g., adding more edge cases).
3. Validate the new Gherkin format.

## QUALITY GATE

- **PASS:** New scenarios follow Gherkin standard.
- **FAIL:** Invalid syntax.

## MENU OPTIONS

[C] Continue — Save changes
