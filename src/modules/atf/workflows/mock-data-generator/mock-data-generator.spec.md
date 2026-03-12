# Workflow Specification: Mock Data Generator

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Create realistic test data from I/O specifications.

**Description:** Takes Blueprint's I/O spec and generates realistic mock inputs and expected outputs for testing. Covers happy paths and edge cases to ensure thorough validation.

**Workflow Type:** Feature (Specialized)

---

## Workflow Structure

### Entry Point

```yaml
---
name: mock-data-generator
description: Generate realistic mock data from I/O specifications
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/mock-data-generator'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Parse I/O Spec | Extract input schemas and output expectations |
| 2 | Generate Happy Path | Create mock data for normal operation |
| 3 | Generate Edge Cases | Create data for boundary conditions and errors |
| 4 | Validate Mock Data | Ensure mock data matches schema definitions |

---

## Workflow Inputs

### Required Inputs

- I/O specification from Blueprint

### Optional Inputs

- Specific edge cases to cover
- Sample real data for reference

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Mock data set (inputs + expected outputs)

---

## Agent Integration

### Primary Agent

Blueprint

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
