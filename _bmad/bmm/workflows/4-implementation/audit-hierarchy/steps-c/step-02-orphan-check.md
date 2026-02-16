---
name: "step-02-orphan-check"
description: "Find items without valid parent links"
nextStepFile: "./step-03-ac-validation.md"
beadsCommand: "bd list"
qualityGate: hard
---

# Step 2: Orphan Check

## STEP GOAL:

Find items that have no valid parent link (orphans that break hierarchy integrity).

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Scan completed from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Check Every Item

For each item (except Themes which are roots):

- Verify `parentId` exists
- Verify parent item actually exists
- Verify parent-child link is bidirectional

### 2. Report Orphans

"**Orphan Check**

{if orphans_found}
⚠️ **{orphan_count} orphan(s) found:**
{list each orphan with type, ID, and missing parent}

**Action Required:** Fix parent links before this hierarchy is compliant.
{else}
✅ **No orphans found.** All items have valid parent chains.
{/if}

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New orphan patterns identified
- Common reasons for broken links found

If yes, append entry to: `governance-sidecar/audit-history.md`

## BEADS INTEGRATION

- Run: `bd list` to get full inventory
- Check each item has valid parent reference (except root Themes)
- Flag items with broken parent links

- IF C: Read fully and follow `{nextStepFile}`
