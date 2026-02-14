---
name: "step-01-scan"
description: "Traverse and scan the full hierarchy"
nextStepFile: "./step-02-orphan-check.md"
---

# Step 1: Hierarchy Scan

## STEP GOAL:

Traverse all items from Theme to Task and catalog them for audit.

## MANDATORY SEQUENCE

### 1. Scan Sources

Scan both Beads DB and file system for all SAFe items:

- Strategic Themes
- Portfolio Epics
- Capabilities
- Features
- User Stories
- Dev Tasks
- QA Test Cases

### 2. Build Hierarchy Map

Construct a tree showing all items and their parent-child relationships.

### 3. Present Scan Results

"**Hierarchy Scan Complete**

| Level        | Count |
| ------------ | ----- |
| Themes       | {n}   |
| Epics        | {n}   |
| Capabilities | {n}   |
| Features     | {n}   |
| Stories      | {n}   |
| Tasks        | {n}   |
| QA Cases     | {n}   |

**Total Items:** {total}

[C] Continue — Run orphan check"

- IF C: Read fully and follow `{nextStepFile}`
