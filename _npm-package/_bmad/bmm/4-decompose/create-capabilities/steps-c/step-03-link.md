---
name: "step-03-link"
description: "Register parent-child links and propagate WSJF"
nextStepFile: "./step-04-validate.md"
beadsCommand: 'bd update {cap_bead_id} --notes="Linked to epic"'
qualityGate: hard
---

# Step 3: Link & Propagate

## STEP GOAL:

Register all Capabilities in Beads with parent-child links and propagate WSJF/Risk from Epic.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Capabilities created in step-02

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

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

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- Logic for WSJF propagation improvement
- Beads sync or linking friction

If yes, append entry to: `portfolio-sidecar/common-mistakes.md`

## BEADS INTEGRATION

- Verify all capability beads have parent link to epic: `bd show {cap_bead_id}`
- Update parent epic's notes with capability list: `bd update {epic_bead_id} --notes="Capabilities: {cap_list}"`

- IF C: Read fully and follow `{nextStepFile}`
