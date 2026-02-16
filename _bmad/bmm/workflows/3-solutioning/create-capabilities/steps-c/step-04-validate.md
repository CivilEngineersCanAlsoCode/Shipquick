---
name: "step-04-validate"
description: "Validate no orphans and all ACs present"
---

# Step 4: Validate Decomposition

## STEP GOAL:

Run quick validation checks to ensure clean decomposition.

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

**Next Steps:**

- Run `/sq plan` to decompose Capabilities into Features
- Run `/sq audit` to validate full hierarchy"
