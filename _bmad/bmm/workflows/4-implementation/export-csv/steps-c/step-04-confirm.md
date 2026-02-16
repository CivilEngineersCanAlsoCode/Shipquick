---
name: "step-04-confirm"
description: "Final confirmation and export summary"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 4: Export Confirmation

## STEP GOAL:

Present the final export summary and provide import instructions.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] CSV generated from step-03
3. [ ] All rows have required fields populated

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Summary

"**✅ SAFe Hierarchy Export Complete!**

**Format:** {Jira|Rally|Both}
**Items Exported:** {count}
**File(s):**

- `{file_path}`

## QUALITY GATE

- **PASS:** CSV generated and validated, export bead closed (Hard Gate HG-01, HG-010).
- **FAIL:** Required fields missing in CSV or Beads sync error.

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `governance-sidecar/export-field-mappings.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "export: completed CSV export for {count} items"`
4. `bd sync`
5. `git push`
