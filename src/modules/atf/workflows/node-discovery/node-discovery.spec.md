# Workflow Specification: Node Discovery

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Find and rank available n8n nodes for a given requirement.

**Description:** Queries the n8n node registry, community nodes, and API integrations to find the best nodes for the user's requirements. Compares alternatives on cost, reliability, and complexity. Respects user's preferred cost tier.

**Workflow Type:** Feature (Specialized)

---

## Workflow Structure

### Entry Point

```yaml
---
name: node-discovery
description: Discover and compare n8n nodes for user requirements
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/node-discovery'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Parse Requirement | Extract what the user needs (platform, action, data type) |
| 2 | Registry Search | Query n8n MCP for official nodes |
| 3 | Community Search | Check community node registries |
| 4 | Compare & Rank | Compare alternatives on cost, reliability, complexity |
| 5 | Recommend | Present ranked options with rationale |

---

## Workflow Inputs

### Required Inputs

- User requirement description
- Preferred cost tier

### Optional Inputs

- Specific platform requirements
- Known node preferences

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Ranked node options with comparison rationale

---

## Agent Integration

### Primary Agent

Forge Master

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
