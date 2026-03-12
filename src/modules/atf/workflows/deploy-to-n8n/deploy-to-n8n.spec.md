# Workflow Specification: Deploy to n8n

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Push validated workflow JSON to the user's n8n instance via API.

**Description:** Takes the validated workflow JSON, connects to the n8n API, creates or updates the workflow, and configures credential placeholders. Provides human-in-the-loop instructions for manual credential setup.

**Workflow Type:** Core (Essential)

---

## Workflow Structure

### Entry Point

```yaml
---
name: deploy-to-n8n
description: Deploy validated workflow to n8n instance
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/deploy-to-n8n'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Pre-Deploy Check | Verify workflow passed validation |
| 2 | Connect to n8n | Establish API connection to n8n instance |
| 3 | Create/Update Workflow | Push JSON to n8n via API |
| 4 | Credential Instructions | Generate human-in-the-loop credential setup steps |
| 5 | Verify Deployment | Confirm workflow exists and is accessible in n8n |

---

## Workflow Inputs

### Required Inputs

- Validated n8n workflow JSON
- n8n instance URL (from module config)

### Optional Inputs

- Existing workflow ID (for updates)
- Credential mappings

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- Live workflow in n8n instance
- Credential setup instructions for user

---

## Agent Integration

### Primary Agent

Welder

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
