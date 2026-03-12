# Workflow Specification: Escalate to User

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Human-in-the-loop gate — present decisions to the user and wait for input.

**Description:** Any agent can trigger this when a decision requires human judgment. Presents options clearly with context, waits for user input, then returns the decision to the requesting agent. Shared across all agents via the [ES] command.

**Workflow Type:** Utility (Support)

---

## Workflow Structure

### Entry Point

```yaml
---
name: escalate-to-user
description: Human-in-the-loop decision gate
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/escalate-to-user'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Frame Decision | Present what needs deciding and why |
| 2 | Show Options | Display options with trade-offs |
| 3 | Wait for Input | Halt and wait for user response |
| 4 | Return Decision | Pass user's choice back to requesting agent |

---

## Workflow Inputs

### Required Inputs

- Decision context (what and why)
- Options with trade-offs

### Optional Inputs

- Recommended option
- Urgency level

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- User's decision (returned to calling agent)

---

## Agent Integration

### Primary Agent

Any (shared command)

### Other Agents

All agents can trigger this at any point

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
