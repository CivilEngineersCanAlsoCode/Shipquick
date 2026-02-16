---
name: "step-v-03-content"
description: "Validate test content quality"
nextStepFile: "./step-v-04-links.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
beadsCommand: "none"
qualityGate: "soft"
---

# Validate Step 3 of 5 — Content Quality

## STEP GOAL

Verify that the test scenarios are high quality and cover the ACs.

## MANDATORY SEQUENCE

1. Compare generated scenarios against original ACs.
2. Check for Gherkin standard compliance (GK-01 to GK-07).
3. Ensure at least one edge case/negative case is included.

## DATA INTEGRATION

Load `_bmad/bmm/data/gherkin-quality-rules.csv` for checks.

## QUALITY GATE

- **PASS:** Scenarios are clear, measurable, and cover all ACs.
- **FAIL:** Vague scenarios or missing coverage.

## MENU OPTIONS

[C] Continue — Validate links
