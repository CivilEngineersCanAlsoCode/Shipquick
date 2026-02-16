---
name: "step-04-validate"
description: "Validate no orphans and all ACs present"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 4: Validate Decomposition

## STEP GOAL:

Run quick validation checks to ensure clean decomposition.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] All capabilities created and linked from steps 02-03
3. [ ] HG-08: Gherkin ACs present -> Each capability has min 2 Gherkin scenarios

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Orphan Check

Verify every Capability has a valid parent Epic link.

### 2. AC Validation

Verify every Capability has at least one Gherkin AC.

### 3. Coverage Check

Verify the Capabilities logically cover the Epic's scope.

### 4. Summary

"**✅ Epic → Capability Decomposition Complete!**

**Epic:** {epic_name}
**Capabilities Created:** {N}

```
{epic_name} (EPIC-{id}) [WSJF: {wsjf}]
  ├── {cap_1} (CAP-001)
  ├── {cap_2} (CAP-002)
  └── {cap_N} (CAP-00N)
```

**Validation:** ✓ No orphans | ✓ All ACs present | ✓ Full coverage

## BEADS INTEGRATION

- Verify all capabilities registered: `bd list --status=open`
- Run: `bd sync` to persist all changes

## QUALITY GATE

- **PASS:** All Hard Gates (HG-01, HG-08) pass, hierarchy verified, zero orphans.
- **FAIL:** Capabilities missing parent link or scenarios < 2 (Hard Gate HG-08).

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `portfolio-sidecar/common-mistakes.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "feat: decomposed Epic into {N} Capabilities"`
4. `bd sync`
5. `git push`

**Next Steps:**

- Run `/sq plan` to decompose Capabilities into Features
- Run `/sq audit` to validate full hierarchy"
