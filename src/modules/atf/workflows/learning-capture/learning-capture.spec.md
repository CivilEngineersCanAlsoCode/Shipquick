# Workflow Specification: Learning Capture

**Module:** atf
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-03-12

---

## Workflow Overview

**Goal:** Log patterns and learnings to the ChromaDB knowledge base.

**Description:** After every completed workflow, Foreman extracts patterns, formats Q&A pairs, and uploads them to ChromaDB. The system gets smarter with every build.

**Workflow Type:** Feature (Specialized)

---

## Workflow Structure

### Entry Point

```yaml
---
name: learning-capture
description: Capture learnings and upload to ChromaDB knowledge base
web_bundle: true
installed_path: '{project-root}/_bmad/atf/workflows/learning-capture'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Extract Patterns | Identify what worked, what failed, what was learned |
| 2 | Format Q&A | Create question-answer pairs for knowledge base |
| 3 | Upload to ChromaDB | Store formatted learnings in vector database |
| 4 | Confirm Capture | Verify successful upload and report |

---

## Workflow Inputs

### Required Inputs

- Completed workflow details (what was built)
- Test results from Inspector
- Any alternative approaches tried

### Optional Inputs

- User feedback on the workflow

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- Knowledge base updated in ChromaDB

---

## Agent Integration

### Primary Agent

Foreman

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-03-12 via BMAD Module workflow_
