---
name: "step-03-link"
description: "Register parent-child links and propagate WSJF"
nextStepFile: "./step-04-validate.md"
---

# Step 3: Link & Propagate

## STEP GOAL:

Register all Capabilities in Beads with parent-child links and propagate WSJF/Risk from Epic.

## MANDATORY SEQUENCE

### 1. Beads Registration

Execute the following Beads operations:

- **Copy the ID** of the parent Portfolio Epic (e.g., `...-grp`).
- Run: `bd create "Capability: {capability_name}" --type epic --parent <EPIC_ID>`

- Inherit WSJF and Risk labels from parent

### 2. Update Epic Children

Append each Capability link to the parent Epic's Children section.

### 3. Propagation Report

"**✓ {N} Capabilities linked to Epic {epic_name}**

- WSJF propagated: {wsjf}
- All parent-child links registered in Beads

[C] Continue — Validate no orphans"

- IF C: Read fully and follow `{nextStepFile}`
