# Traceability Matrix (Requirements to Verification)

---

**Project**: {{project_name}}
**Artifact ID**: [TM-XXXX]
**Confidence Score**: [0-100%]

---

## 1. Traceability Tree

| PRD ID   | Feature ID | User Story ID | ADR ID   | Test Case ID | Status     |
| :------- | :--------- | :------------ | :------- | :----------- | :--------- |
| [PRD-01] | [F-1.1]    | [US-1.1.1]    | [ADR-01] | [TC-01]      | ✅ PASS    |
| [PRD-01] | [F-1.1]    | [US-1.1.2]    | [ADR-02] | [TC-02]      | ⚠️ FLAGGED |
| [PRD-02] | [F-2.1]    | [US-2.1.1]    | [ADR-03] | [TC-03]      | ❌ FAIL    |

## 2. Quality Audit Comments

- **[PRD-01]**: Fully covered. No gaps.
- **[PRD-02]**: Test case TC-03 failed due to timeout issues in the dev-story. Requires rework.

## 3. Verification Summary

- **Total Requirements**: [X]
- **Verified**: [Y]
- **Gaps Identified**: [Z]
- **Adversarial Pass**: [YES / NO]
