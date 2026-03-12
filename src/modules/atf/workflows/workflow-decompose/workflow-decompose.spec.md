# Workflow Specification: Workflow Decompose

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Break a complex automation into modular sub-workflows with an orchestrator pattern.

**Description:** Takes a workflow design and decomposes it into 10-20 node chunks, defines the orchestrator that coordinates sub-workflows, designs connections between components, and adds sticky note documentation to every node.

**Workflow Type:** Feature (Specialized)

---

## Workflow Structure

### Entry Point

```yaml
---
name: workflow-decompose
description: Decompose complex workflows into modular sub-workflows
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/workflow-decompose'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Analyze Complexity | Assess total nodes, connections, platform count |
| 2 | Identify Boundaries | Find natural sub-workflow boundaries (per platform, per stage) |
| 3 | Design Orchestrator | Create orchestrator that calls sub-workflows |
| 4 | Define Connections | Map data flow between orchestrator and sub-workflows |
| 5 | Document Architecture | Add sticky notes and architecture diagram |

---

## Workflow Inputs

### Required Inputs

- Workflow design from architecture phase
- Node selections from Forge Master

### Optional Inputs

- Max nodes per sub-workflow (default: 15)

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Modular architecture specification (orchestrator + sub-workflow definitions)

---

## Agent Integration

### Primary Agent

Assembler

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
