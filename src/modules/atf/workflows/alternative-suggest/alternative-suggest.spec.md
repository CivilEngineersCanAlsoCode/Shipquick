# Workflow Specification: Alternative Suggest

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Propose different approaches when a test/build fails after retries.

**Description:** When Inspector's retries are exhausted, this workflow analyzes the failure, checks Scout's captured user preferences, and proposes alternative nodes or approaches that might work. The NEVER GIVES UP philosophy in action.

**Workflow Type:** Feature (Specialized)

---

## Workflow Structure

### Entry Point

```yaml
---
name: alternative-suggest
description: Propose alternative approaches when tests fail
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/alternative-suggest'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Analyze Failure | Understand what failed and why |
| 2 | Check Preferences | Review user's preferences from Scout (cost tier, platforms) |
| 3 | Find Alternatives | Search for alternative nodes/approaches |
| 4 | Propose Solutions | Present ranked alternatives with trade-offs |

---

## Workflow Inputs

### Required Inputs

- Failed test results from Inspector
- Original node selections
- User preferences from Scout

### Optional Inputs

- Previous alternative attempts

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Alternative proposal with ranked options and trade-offs

---

## Agent Integration

### Primary Agent

Inspector

### Other Agents

May consult Forge Master for node alternatives

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
