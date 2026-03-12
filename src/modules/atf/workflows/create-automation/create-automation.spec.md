# Workflow Specification: Create Automation

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Main end-to-end flow — take a user's automation idea through the full 7-agent assembly line to produce a working n8n workflow JSON.

**Description:** The orchestrator workflow that coordinates all 7 agents sequentially: Scout gathers requirements, Blueprint defines specs, Forge Master discovers nodes, Assembler designs architecture, Foreman creates backlog, Welder builds JSON, Inspector validates.

**Workflow Type:** Core (Essential)

---

## Workflow Structure

### Entry Point

```yaml
---
name: create-automation
description: Main end-to-end n8n workflow automation pipeline
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/create-automation'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Requirements Gathering | Scout interviews user, captures automation idea and preferences |
| 2 | I/O Specification | Blueprint defines inputs, outputs, data schemas, mock data |
| 3 | Node Discovery | Forge Master finds and compares available n8n nodes |
| 4 | Architecture Design | Assembler decomposes into orchestrator + sub-workflows |
| 5 | Backlog Creation | Foreman creates project backlog with tasks |
| 6 | Build | Welder constructs n8n workflow JSON from specs |
| 7 | Test & Validate | Inspector validates data flow, retries on failure |
| 8 | Learning Capture | Foreman logs learnings to ChromaDB |

---

## Workflow Inputs

### Required Inputs

- User's automation idea/description
- Target platform(s) (e.g., X, Reddit, LinkedIn)

### Optional Inputs

- Preferred cost tier (from module config)
- Existing n8n credentials
- Schedule/timing requirements

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Complete n8n workflow JSON (orchestrator + sub-workflows)
- Test report
- Architecture documentation with sticky notes

---

## Agent Integration

### Primary Agent

Scout (initiates), then all 7 agents in sequence

### Other Agents

Blueprint, Forge Master, Assembler, Foreman, Welder, Inspector

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
