# Workflow Specification: Handoff

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Transfer context between agents on the assembly line.

**Description:** Packages the current agent's work into a context bundle, validates completeness, and hands off to the next agent in the sequence. Shared across all agents via the [HO] command.

**Workflow Type:** Utility (Support)

---

## Workflow Structure

### Entry Point

```yaml
---
name: handoff
description: Transfer context bundle between agents
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/handoff'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Package Context | Bundle current agent's outputs into context |
| 2 | Validate Completeness | Ensure no required outputs are missing |
| 3 | Transfer | Hand context bundle to next agent |
| 4 | Confirm | Verify receiving agent acknowledges |

---

## Workflow Inputs

### Required Inputs

- Current agent's context/outputs
- Target agent identifier

### Optional Inputs

- Priority notes or flags

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- Handoff confirmation

---

## Agent Integration

### Primary Agent

Any (shared command)

### Other Agents

All agents can trigger this

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
