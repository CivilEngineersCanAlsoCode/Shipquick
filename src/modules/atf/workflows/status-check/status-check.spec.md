# Workflow Specification: Status Check

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Get current progress on an AutoFlow project.

**Description:** Any agent can trigger this workflow to query project state, show assembly line progress, and surface blockers. Shared across all agents via the [WS] command.

**Workflow Type:** Utility (Support)

---

## Workflow Structure

### Entry Point

```yaml
---
name: status-check
description: Check current project progress and blockers
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/status-check'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load Project State | Query Beads for current project status |
| 2 | Assembly Line Progress | Show which agents have completed, which are pending |
| 3 | Surface Blockers | Identify and report any blockers |
| 4 | Report | Present status in factory floor format |

---

## Workflow Inputs

### Required Inputs

- Project ID or context

### Optional Inputs

- Specific agent/stage to check

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- Status report (displayed, not saved)

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
