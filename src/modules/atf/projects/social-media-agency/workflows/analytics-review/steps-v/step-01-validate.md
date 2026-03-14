# Step V.01: Validate Analytics Review

## Purpose
Verify that the analytics review workflow produced complete and correct outputs.

## What to Do

### 1. READ All Workflow Artifacts
- Load the generated analytics report
- Load captured user insights
- Load strategy adjustments
- Load engagement scores for all reviewed posts

### 2. VERIFY Each Quality Gate

#### Metrics Collection
- [ ] All published posts in the review period have engagement data
- [ ] Engagement data sourced from Chrome Extension (not hallucinated)
- [ ] Likes, comments, and shares present for each post

#### Score Calculation
- [ ] Engagement scores calculated using `likes×1 + comments×3 + shares×2`
- [ ] Scores are mathematically correct (spot-check at least 2 posts)
- [ ] Top and bottom performers correctly ranked by score

#### Insights Captured
- [ ] User insights recorded (not empty)
- [ ] AI observations documented (format trends, timing patterns, topic analysis)
- [ ] Insights reflect actual data (no fabricated observations)

#### Strategy Adjustments
- [ ] At least one strategy adjustment documented
- [ ] Adjustments are actionable (specific enough for A-Ideation to use)
- [ ] Adjustments tied to evidence from the review data

#### Report Completeness
- [ ] Analytics report generated using the template
- [ ] All template fields populated (no unfilled placeholders)
- [ ] Period label and date range correct

### 3. REPORT Validation Summary

```
VALIDATION SUMMARY — E (Analytics Review)
==========================================
Period: {period_label}
Posts Reviewed: {count}

Metrics Collection:    [PASS/FAIL] — {detail}
Score Calculation:     [PASS/FAIL] — {detail}
Insights Captured:     [PASS/FAIL] — {detail}
Strategy Adjustments:  [PASS/FAIL] — {detail}
Report Completeness:   [PASS/FAIL] — {detail}

Overall: [PASS/FAIL]
```

## Output
- Validation summary with PASS/FAIL per category
- If any FAIL: list specific issues for the user to address

## Next Step
- If PASS: Analytics review complete. Offer to start A-Ideation with new insights.
- If FAIL: Return to the relevant step to address issues.
