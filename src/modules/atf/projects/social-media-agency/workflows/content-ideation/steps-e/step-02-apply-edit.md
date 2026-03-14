# Step E-02: Apply Edit (content-ideation)

## PURPOSE
Execute the assessed edit from E-01. Update MongoDB, Notion, and Google Sheet as needed.

## EXECUTION PROTOCOLS

1. [LOAD] Retrieve assessment from E-01:
   - Edit type, affected posts, required re-execution steps

2. [EXECUTE] Apply the edit based on type:

   ### Schedule Change
   - Update `scheduled_date` and `scheduled_time` for affected post
   - POST `sma-update-post` with new date fields
   - Update Notion entry with new `go_live_date`

   ### Topic Swap
   - Re-run scoring for replacement brief (A.6 logic)
   - If passes gate checks: replace in `selected_briefs[]`
   - Re-run scheduling (A.7 logic) if date assignment changes
   - Save new post to MongoDB, archive old post
   - Update Notion and Sheet accordingly

   ### Score Override
   - Update scoring config via `sma-save-config`
   - Re-score ALL briefs with new weights/thresholds
   - Re-present qualifying briefs to user
   - Re-run selection flow (A.6 PART 3–5)

   ### Add Post
   - Verify `top_n` not exceeded
   - Run A.6 for remaining qualifying briefs
   - User selects additional post
   - Run A.7 for new schedule slot
   - Save via A.8

   ### Remove Post
   - Mark post as cancelled in MongoDB via `sma-update-post` (status: `Cancelled`)
   - Archive Notion entry
   - Revert Sheet status from "Used" to "Discarded" if applicable

   ### Experience Update
   - Update `linked_experiences` array for the post
   - POST `sma-update-post` with updated experience references

3. [VERIFY] Confirm changes applied:
   - MongoDB record reflects edit
   - Notion entry updated
   - Sheet status consistent

4. [REPORT] Confirm to user:
   > "Edit applied: [description]. Updated: MongoDB ✅, Notion ✅, Sheet ✅"
