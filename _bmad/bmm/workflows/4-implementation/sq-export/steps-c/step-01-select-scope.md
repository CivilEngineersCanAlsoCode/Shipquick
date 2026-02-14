---
name: "step-01-select-scope"
description: "Select which items and levels to export"
nextStepFile: "./step-02-format.md"
---

# Step 1: Select Export Scope

## STEP GOAL:

Let the user choose which hierarchy levels and items to include in the CSV export.

## MANDATORY SEQUENCE

### 1. Scope Options

"**What would you like to export?**

- **[A] All** — Full hierarchy from Theme to Task
- **[E] Epic down** — Specific Epic and all its children
- **[C] Capability down** — Specific Capability and all children
- **[F] Features only** — Just Features (flat list)
- **[S] Stories only** — Just Stories (flat list)"

### 2. Handle Selection

- IF A: Mark all items for export
- IF E/C: Ask for ID, load that subtree
- IF F/S: Load flat list of that level

### 3. Confirm Scope

"**Exporting {count} items across {levels} levels.**

[C] Continue — Select export format"

- IF C: Read fully and follow `{nextStepFile}`
