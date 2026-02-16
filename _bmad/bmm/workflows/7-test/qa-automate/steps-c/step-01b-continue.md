---
name: "step-01b-continue"
description: "Resume 070-qa-automate workflow"
---

# 🔗 Continuation — Resume Test Automation

## GOAL

Resume the test automation process by detecting the last completed step in the target artifact.

## MANDATORY SEQUENCE

1. Load the target test summary: `{implementation_artifacts}/tests/test-summary-{id}.md`.
2. Read `stepsCompleted[]` from frontmatter.
3. Find the highest completed step and route to:
   - If 0 steps: `./step-01-discovery.md`
   - If 1 step: `./step-02-test-gen.md`
   - If 2+ steps: Offer Edit/Validate or Finish.

## BEADS INTEGRATION

Run `bd show {id}` to refresh context.
