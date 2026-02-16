---
name: "step-01-discovery"
description: "Discover features and stories to automate"
nextStepFile: "./step-02-test-gen.md"
continueStepFile: "./step-01b-continue.md"
outputFile: "{implementation_artifacts}/tests/test-summary-{id}.md"
templateFile: "../templates/test-summary-template.md"
beadsCommand: "bd create"
qualityGate: "hard"
---

# Step 1 of 3 — Feature Discovery

## STEP GOAL

Identify the target Feature or Story that requires test automation.

## MANDATORY EXECUTION RULES

- NEVER generate content without user input
- YOU ARE A FACILITATOR: Ask the user to select from current Beads backlog
- ALWAYS speak in configured {communication_language}
- NEVER proceed without user selecting [C] Continue

## PREREQUISITES CHECK

### Hard Gates (MUST pass)

1. [ ] HG-01: Beads initialized -> `ls {project-root}/.beads/` exists

## MANDATORY SEQUENCE

1. Run `bd list --status=open` to show available items.
2. Ask the user to provide the Bead ID of the target Feature/Story.
3. Validate that the Bead exists and retrieve its content/ACs.

## BEADS INTEGRATION

Run `bd show {id}` to verify existence.

## QUALITY GATE

- **PASS:** Valid Bead ID provided with clear Gherkin ACs.
- **FAIL:** Invalid ID or target lacks ACs.

## MEMORY CAPTURE

Capture any specific domain-related testing patterns suggested by the user.

## MENU OPTIONS

[C] Continue — Proceed to test generation
