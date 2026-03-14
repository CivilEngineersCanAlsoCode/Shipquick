# Content Review — Agent Instructions

## Overview
This workflow is the quality gate between formatting and publishing. The agent fetches all posts with status `Previewed`, presents each one to the user for review, and applies the user's decision (approve, edit, reschedule, or drop). Approved posts are updated to `Ready_ToPublish` in MongoDB, making them eligible for auto-publication by D-ContentPublishing.

## Agents Involved
- **Pixel (flex-crafter):** Presents posts for review, applies user decisions, updates MongoDB.

## Execution Flow

### Phase 1: Fetch Posts (Step C.1)
1. **Fetch Scheduled Posts:** POST to `sma-fetch-post` with `{ "status": "Previewed" }` to retrieve all posts that have been formatted and previewed.
   - Sort by `scheduled_date` ascending (soonest first — most urgent reviews first).
   - If no posts found, inform user: "Koi previewed post nahi hai abhi. Pehle F-ContentFormatting run karo."
   - Display summary:
     > "You have {N} posts ready for review:"
     > 1. {topic_1} | {channel} | {scheduled_date_1}
     > 2. {topic_2} | {channel} | {scheduled_date_2}
     > ...
   - Ask: "Ek ek karke review karein? (haan/nahi)"

### Phase 2: Review Each Post (Step C.2)
2. **Preview & Decide:** For each post (in chronological order):
   - Display full content in a code block (as it will appear on LinkedIn)
   - Show metadata: topic, content pillar, scheduled date/time, channel, frameworks used
   - Ask user to decide:
     - **Approve** — Keep as-is, mark `Ready_ToPublish`
     - **Edit** — User provides changes, agent applies them, re-presents for confirmation
     - **Reschedule** — Change the `scheduled_date` (check for conflicts)
     - **Drop** — Archive the post (status: `Cancelled`)

3. **Apply Decision:** For each decision:
   - **Approve:** POST to `sma-update-post` with `{ "status": "Ready_ToPublish" }`
   - **Edit:** Apply changes to `draft_content`, POST to `sma-update-post` with updated content. Re-present for approval. If major edit needed, suggest sending back to B-ContentDrafting.
   - **Reschedule:** POST to `sma-update-post` with new `scheduled_date`. Verify no date conflicts.
   - **Drop:** POST to `sma-update-post` with `{ "status": "Cancelled" }`.

4. **Next Post:** Move to the next post in the queue. Repeat until all posts reviewed.

### Phase 3: Summary (after all posts)
5. **Show Summary:**
   > "{approved_count} approved, {edited_count} edited, {rescheduled_count} rescheduled, {dropped_count} dropped"
6. **Offer Next Actions:**
   - "Draft new content?" → B-ContentDrafting
   - "Run ideation for more ideas?" → A-ContentIdeation
   - "That's all for now" → exit

## Webhook Reference
| Webhook | Method | Steps |
|---------|--------|-------|
| sma-fetch-post | POST | C.1 |
| sma-update-post | POST | C.2 (approve, edit, reschedule, drop) |

## Key Constraints
- This is the LAST human checkpoint before auto-publication — be thorough
- Posts must have status `Previewed` to enter this workflow (already formatted)
- Approved posts will be auto-published by n8n — no retry, one shot only
- MongoDB is source of truth — all updates via `sma-update-post`
- Agent has ZERO direct DB/API access — all via n8n webhooks
- If a post needs major rework, send back to B-ContentDrafting (status: `Scheduled_NoDraft`)
- All user communication in Hinglish

## Success Criteria
- Every previewed post has a user decision (no posts left unreviewed)
- Approved posts have status `Ready_ToPublish` in MongoDB
- Edited posts have updated `draft_content` saved
- Rescheduled posts have new dates with no conflicts
- Dropped posts have status `Cancelled`
- User saw full content preview before each decision
- Summary presented at end of review session
