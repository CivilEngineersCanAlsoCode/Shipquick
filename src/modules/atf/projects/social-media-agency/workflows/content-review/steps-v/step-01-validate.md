# Step V-01: Validate (content-review)

## EXECUTION PROTOCOLS

1. [READ] Load all workflow artifacts:
   - `posts_to_review[]` — original list of posts fetched
   - `decisions{}` — map of post_id → decision (approve/edit/reschedule/drop)
   - Counts: approved, edited, rescheduled, dropped

2. [VERIFY] Run checklist against output:

   ### Completeness
   - [ ] Every fetched post has a recorded decision
   - [ ] No post left in `Previewed` status (all transitioned)
   - [ ] Summary counts match: approved + edited + rescheduled + dropped = total

   ### Decision Integrity
   - [ ] Approved posts: MongoDB status is `Ready_ToPublish`
   - [ ] Edited posts: `draft_content` updated in MongoDB, user confirmed edit
   - [ ] Rescheduled posts: new `scheduled_date` saved, no date conflicts
   - [ ] Dropped posts: MongoDB status is `Cancelled`

   ### Safety
   - [ ] User saw full content preview before approving each post
   - [ ] No post auto-approved without user interaction
   - [ ] Date conflicts checked for rescheduled posts (max 1 post per day)

   ### Webhook Success
   - [ ] All `sma-update-post` calls returned success
   - [ ] Failed updates flagged and retried or reported to user

3. [REPORT] Generate validation summary:
   ```
   VALIDATION: content-review
   Posts Reviewed: {total}
   Approved: {approved_count}
   Edited: {edited_count}
   Rescheduled: {rescheduled_count}
   Dropped: {dropped_count}
   Completeness: PASS/FAIL
   Decision Integrity: PASS/FAIL
   Safety: PASS/FAIL
   Webhook Success: PASS/FAIL
   Overall: PASS/FAIL
   ```
