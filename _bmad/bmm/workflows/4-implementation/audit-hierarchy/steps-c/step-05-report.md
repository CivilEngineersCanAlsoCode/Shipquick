---
name: "step-05-report"
description: "Generate final compliance report with PASS/FAIL"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 5: Compliance Report

## STEP GOAL:

Generate the final compliance report with an overall PASS/FAIL verdict.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] All audit checks (steps 01-04) completed

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Aggregate Results

Compile findings from steps 1-4:

- Orphan check results
- AC validation results
- WSJF consistency results
- Total items audited

### 2. Calculate Verdict

- **PASS:** Zero orphans AND zero missing ACs AND zero WSJF gaps
- **CONCERNS:** Minor issues found (1-3 items)
- **FAIL:** Major gaps found (4+ items or structural breaks)

### 3. Generate Report

Create `{sq_output_folder}/audit-report-{date}.md`:

```markdown
---
type: audit-report
date: { date }
verdict: { PASS|CONCERNS|FAIL }
---

# SAFe Compliance Audit Report

## Overall Verdict: {PASS|CONCERNS|FAIL}

## Summary

| Check            | Result  | Issues  |
| ---------------- | ------- | ------- |
| Orphan Check     | {✅/⚠️} | {count} |
| AC Validation    | {✅/⚠️} | {count} |
| WSJF Consistency | {✅/⚠️} | {count} |

## Total Items Audited: {total}

## Findings

{detailed_findings}

## Recommendations

{recommendations}
```

### 4. Present Report

"**🛡️ SAFe Compliance Audit Complete**

**Verdict: {PASS|CONCERNS|FAIL}**

| Check   | Result   |
| ------- | -------- |
| Orphans | {result} |
| ACs     | {result} |
| WSJF    | {result} |

## QUALITY GATE

- **PASS:** Compliance report generated with PASS/CONCERNS verdict.
- **FAIL:** Audit check failures not addressed or verdict is FAIL.

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `governance-sidecar/audit-history.md` with final report summary.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "audit: completed hierarchy audit {verdict}"`
4. `bd sync`
5. `git push`

**Next Steps:**
