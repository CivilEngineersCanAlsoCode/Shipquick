---
name: "step-05-report"
description: "Generate final compliance report with PASS/FAIL"
---

# Step 5: Compliance Report

## STEP GOAL:

Generate the final compliance report with an overall PASS/FAIL verdict.

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

Report saved to: `{report_path}`

### Next Steps

For requirements-to-tests traceability, run the TEA workflow:

- `/testarch-trace` — Generates a traceability matrix mapping SAFe items to test coverage
- Maps Stories → QA Test Cases → actual test files
- Produces a PASS/CONCERNS/FAIL quality gate decision"
