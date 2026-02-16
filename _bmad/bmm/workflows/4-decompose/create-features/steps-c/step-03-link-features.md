---
name: "step-03-link-features"
description: "Register Features in Beads and show PI readiness"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 3: Link Features & PI Readiness

## STEP GOAL:

Register all Features in Beads with parent-child links, propagate WSJF, and show ART readiness progress.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Features created in step-02
3. [ ] HG-08: Gherkin ACs present -> Each feature has min 2 Gherkin scenarios

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Beads Registration

For each Feature:

- Run: `bd create "Feature: {feature_name}" --type feature --parent <CAPABILITY_ID>`

### 2. Update Capability Children

Append Feature links to parent Capability document.

### 3. PI Readiness Progress

"**✅ Capability → Feature Decomposition Complete!**

**Capability:** {cap_name}
**Features Created:** {N}

```
{cap_name} (CAP-{id})
  ├── {feat_1} (FEAT-001)
  ├── {feat_2} (FEAT-002)
  └── {feat_N} (FEAT-00N)
```

**PI Readiness:** {progress_bar} {percentage}%

## BEADS INTEGRATION

- Verify all features registered with parent links: `bd list --status=open`
- Update parent capability notes: `bd update {cap_bead_id} --notes="Features: {feat_list}"`
- Run: `bd sync` to persist all changes

## QUALITY GATE

- **PASS:** All Hard Gates (HG-01, HG-08) pass, features registered in Beads with parent link.
- **FAIL:** Features missing scenarios < 2 or Beads sync error.

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `product-manager-sidecar/common-mistakes.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "feat: decomposed Capability into {N} Features"`
4. `bd sync`
5. `git push`

**Next Steps:**

- Run `/sq exec` to decompose Features into Stories
- Run `/sq audit` to validate full hierarchy"
