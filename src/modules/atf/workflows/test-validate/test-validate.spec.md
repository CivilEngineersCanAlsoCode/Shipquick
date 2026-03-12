# Workflow Specification: Test & Validate

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** QA execution loop — execute built workflow, validate each node's data flow, retry 3x or pivot to alternatives.

**Description:** Inspector runs the built workflow JSON against mock data, validates each node's input/output, identifies broken connections or data mismatches, retries up to 3 times with different approaches, then escalates or suggests alternatives.

**Workflow Type:** Core (Essential)

---

## Workflow Structure

### Entry Point

```yaml
---
name: test-validate
description: QA validation loop for built n8n workflows
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/test-validate'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load Workflow | Load built JSON and mock data |
| 2 | Node Validation | Validate each node's configuration and connections |
| 3 | Data Flow Test | Test data flow through the entire pipeline |
| 4 | Retry Loop | On failure: retry up to 3x with different approaches |
| 5 | Report | Generate test report with pass/fail per node |

---

## Workflow Inputs

### Required Inputs

- Built n8n workflow JSON
- Mock data from Blueprint
- I/O specification

### Optional Inputs

- Previous test results (for retry context)

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Test report (pass/fail per node, data flow validation results)

---

## Agent Integration

### Primary Agent

Inspector

### Other Agents

Can trigger alternative-suggest workflow on persistent failure

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
