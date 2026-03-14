# Step E-02: Apply Edit (content-review)

## PURPOSE
Execute the assessed edit from E-01. Update MongoDB and re-present the post for final approval.

## EXECUTION PROTOCOLS

1. [LOAD] Retrieve assessment from E-01:
   - Edit type, inline or send-back, affected fields

2. [EXECUTE] Apply the edit based on type:

   ### Minor Content Edit (inline)
   - Apply the requested text change to `draft_content`
   - Verify char count still 800–1600
   - Re-present the updated content in code block
   - Ask user to approve the edited version

   ### Formatting Fix — Small (inline)
   - Apply formatting adjustments (line breaks, emoji, caps)
   - Re-present in code block
   - Ask user to approve

   ### Formatting Fix — Major (send back to F)
   - POST to `sma-update-post` with `{ "status": "Drafted" }`
   - Inform user: "Post sent back to F-ContentFormatting. Reformat ke baad wapas review mein aayega."
   - Remove post from current review queue

   ### Major Rewrite (send back to B)
   - POST to `sma-update-post` with `{ "status": "Scheduled_NoDraft" }`
   - Inform user: "Post sent back to B-ContentDrafting for a fresh draft. Redraft ke baad wapas aayega."
   - Remove post from current review queue

   ### Reschedule
   - Verify new date has no conflicts (query existing posts for that date)
   - POST to `sma-update-post` with new `scheduled_date`
   - Confirm: "Post rescheduled to {new_date}."
   - Ask: approve this post now or review later?

   ### Drop
   - POST to `sma-update-post` with `{ "status": "Cancelled" }`
   - Confirm: "Post dropped and archived."
   - Update `dropped_count += 1`

3. [VERIFY] Confirm webhook success:
   - `sma-update-post` returned `{ "success": true }`
   - If failed: retry once, then warn user

4. [CONTINUE] Move to next post in review queue, or show final summary if all reviewed.
