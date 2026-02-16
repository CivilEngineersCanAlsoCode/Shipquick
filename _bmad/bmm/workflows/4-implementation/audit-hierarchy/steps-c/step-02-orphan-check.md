---
name: "step-02-orphan-check"
description: "Find items without valid parent links"
nextStepFile: "./step-03-ac-validation.md"
---

# Step 2: Orphan Check

## STEP GOAL:

Find items that have no valid parent link (orphans that break hierarchy integrity).

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

[C] Continue — Validate Acceptance Criteria"

- IF C: Read fully and follow `{nextStepFile}`
