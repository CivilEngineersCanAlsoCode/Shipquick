---
name: "step-03-link-features"
description: "Register Features in Beads and show PI readiness"
---

# Step 3: Link Features & PI Readiness

## STEP GOAL:

Register all Features in Beads with parent-child links, propagate WSJF, and show ART readiness progress.

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

**Next Steps:**

- Run `/sq exec` to decompose Features into Stories
- Run `/sq audit` to validate full hierarchy"
