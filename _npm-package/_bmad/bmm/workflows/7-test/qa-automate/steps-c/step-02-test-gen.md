---
name: "step-02-test-gen"
description: "Generate test code and cases"
nextStepFile: "./step-03-complete.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "bd update {id} --notes='Tests generated'"
qualityGate: "soft"
---

# Step 2 of 3 — Test Generation

## STEP GOAL

Generate the actual test code or Gherkin test cases based on the ACs identified in Step 1.

## MANDATORY SEQUENCE

1. Read the ACs from the target Bead (from Step 1).
2. Propose a set of test scenarios (Happy path, Edge cases, Negative cases).
3. Once the user approves, generate the initial test boilerplate or code.
4. Update the `outputFile` with the generated details and Gherkin scenarios.

## QUALITY GATE

- **PASS:** Minimum 3 test scenarios generated, including 1 negative case.
- **FAIL:** Missing scenarios or non-standard format.

## MEMORY CAPTURE

Log any "flaky" patterns or specific NFRs (Security/Performance) addressed.

## MENU OPTIONS

[C] Continue — Finalize automation
