# Step V-01: Validate (content-ideation)

## EXECUTION PROTOCOLS

1. [READ] Load all workflow artifacts:
   - `scheduled_posts[]` — final list of posts saved
   - `scoring_config` — weights and thresholds used
   - `discarded_briefs[]` — briefs that failed gate checks

2. [VERIFY] Run checklist against output:

   ### Scoring Integrity
   - [ ] Each post has scores: freshness, personal_experience, research_quality, total
   - [ ] Formula matches: `Total = F×weight_F + P×weight_P + R×weight_R`
   - [ ] All posts pass gate checks: F≥5, P≥3, R≥2, Total≥80
   - [ ] Discarded briefs have documented reasons

   ### Data Consistency
   - [ ] Each post has a valid MongoDB `_id`
   - [ ] Each post has status `Scheduled_NoDraft` in MongoDB
   - [ ] Notion entries exist with status `Scheduled - No Draft`
   - [ ] Google Sheet briefs marked as `Used` (for saved) or `Discarded` (for failed)
   - [ ] No duplicate topics within the 14-day lookback window

   ### Schedule Validity
   - [ ] Each post assigned to a unique date (no double-booking)
   - [ ] Dates are within the configured posting schedule (weekdays by default)
   - [ ] Total posts ≤ `top_n` (default 3)

   ### User Confirmation
   - [ ] User explicitly confirmed the final schedule before saves
   - [ ] User was presented qualifying briefs with scores before selection

3. [REPORT] Generate validation summary:
   ```
   VALIDATION: content-ideation
   Posts Scheduled: {count}
   Scoring: PASS/FAIL
   Data Saves: PASS/FAIL (MongoDB: ✅/❌, Notion: ✅/❌, Sheet: ✅/❌)
   Schedule: PASS/FAIL
   User Confirmation: PASS/FAIL
   Overall: PASS/FAIL
   ```
