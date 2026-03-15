# C-ContentReview — Test Plan

## Overview

Test cases for the Content Review workflow (C.1–C.4). Each test specifies the scenario, setup, expected behavior, and pass criteria. Tests are organized by step, then by integration flows.

**Webhook endpoints under test:**
- `sma-fetch-post` (POST) — used in C.1
- `sma-update-post` (POST) — used in C.2, C.3, C.4

**Agent under test:** Pixel (flex-crafter)

---

## C.1 — Fetch Scheduled Posts

### C.1-01: Zero posts available
- **Setup:** No posts with status `Previewed` in MongoDB.
- **Input:** User triggers review workflow.
- **Expected:**
  - Agent calls `sma-fetch-post` with `{ "status": "Previewed" }`.
  - Response returns `{ "posts": [] }`.
  - Agent displays "Koi previewed post nahi hai" message.
  - Agent offers alternatives (B-ContentDrafting, A-ContentIdeation, F-ContentFormatting).
  - Agent does NOT proceed to C.2.
- **Pass:** No attempt to enter C.2. Alternatives offered.

### C.1-02: Single post available
- **Setup:** 1 post with status `Previewed`.
- **Expected:**
  - Summary table shows 1 row.
  - Agent asks "Ek ek karke review karein?"
  - On "haan" → proceeds to C.2 with that post.
- **Pass:** Post displayed in summary. Proceeds to C.2 correctly.

### C.1-03: Multiple posts — sort order
- **Setup:** 3 posts with status `Previewed`, scheduled dates: March 18, March 16, March 20.
- **Expected:**
  - Posts sorted by `scheduled_date` ascending: March 16, March 18, March 20.
  - Summary table shows correct order.
  - Soonest post (March 16) presented first in C.2.
- **Pass:** Sort order is ascending by date. March 16 is first.

### C.1-04: User picks specific post number
- **Setup:** 3 posts available. User responds with "2" instead of "haan".
- **Expected:**
  - Agent proceeds to C.2 with post #2 (by table order).
  - Remaining posts reviewed after (or skipped if user exits early).
- **Pass:** Post #2 presented first in C.2.

### C.1-05: Posts with wrong status excluded
- **Setup:** MongoDB has posts with statuses: `Previewed` (2), `Drafted` (1), `Ready_ToPublish` (1), `Published` (1).
- **Expected:**
  - Only the 2 `Previewed` posts appear in results.
  - Other statuses are not fetched or displayed.
- **Pass:** Exactly 2 posts in queue.

### C.1-06: Post with past scheduled_date
- **Setup:** 1 post with `scheduled_date` = yesterday, status `Previewed`.
- **Expected:**
  - Post appears in queue but is flagged with a warning about past date.
  - Agent recommends reschedule or drop.
- **Pass:** Warning displayed. Post not auto-approved.

### C.1-07: Webhook failure — first attempt
- **Setup:** `sma-fetch-post` returns 500 on first call, 200 on retry.
- **Expected:**
  - Agent shows "retry karta hoon" message.
  - Retries after 5 seconds.
  - On success, displays posts normally.
- **Pass:** Retry succeeds. Normal flow continues.

### C.1-08: Webhook failure — both attempts
- **Setup:** `sma-fetch-post` returns 500 on both calls.
- **Expected:**
  - Agent shows error message referencing `SMA/Data/Read/FetchPost`.
  - Agent does NOT proceed to C.2.
  - Agent does NOT fabricate posts.
- **Pass:** Workflow blocked. Error message with n8n workflow name shown.

### C.1-09: Malformed response
- **Setup:** `sma-fetch-post` returns `{ "data": [...] }` instead of `{ "posts": [...] }`.
- **Expected:**
  - Agent detects unexpected format.
  - Surfaces error about missing fields.
  - Does NOT attempt to parse or proceed.
- **Pass:** Format error reported. Workflow blocked.

### C.1-10: Posts missing `formatted_content`
- **Setup:** 2 `Previewed` posts, one has `formatted_content: ""`.
- **Expected:**
  - Agent excludes the post with empty `formatted_content`.
  - Informs user that post needs F-ContentFormatting.
  - Remaining valid post enters review queue.
- **Pass:** Only valid posts in queue. Missing content flagged.

---

## C.2 — Preview & Decide

### C.2-01: Approve — happy path
- **Setup:** 1 post in queue. User chooses "Approve".
- **Expected:**
  - Full content preview shown in code block.
  - Metadata table displayed (topic, pillar, date, channel, frameworks).
  - Quick stats shown (chars, emojis, hashtags).
  - On "Approve": `sma-update-post` called with `{ "status": "Ready_ToPublish", "review_decision": "approved" }`.
  - Success message shown. `approved_count` incremented.
- **Pass:** Post status → `Ready_ToPublish`. Counter updated.

### C.2-02: Approve — webhook failure
- **Setup:** 1 post. User approves. `sma-update-post` fails twice.
- **Expected:**
  - Retry once after 3 seconds.
  - On second failure: post added to `skipped_posts[]`.
  - User asked: skip or retry manually.
  - If skip: move to next post (or C.4 if last).
- **Pass:** Post in `skipped_posts[]`. User informed. Not silently lost.

### C.2-03: Edit — happy path
- **Setup:** 1 post. User chooses "Edit".
- **Expected:**
  - Agent asks for edit instructions.
  - Proceeds to C.3 with current post and user's instructions.
- **Pass:** Transition to C.3 with correct data.

### C.2-04: Edit — webhook failure after approval
- **Setup:** User edits and approves edited version. `sma-update-post` fails.
- **Expected:**
  - Edited content preserved in memory (not discarded).
  - User advised to copy content to clipboard.
  - Post added to `skipped_posts[]`.
- **Pass:** Edited content not lost. Post in skipped list.

### C.2-05: Reschedule — happy path (no conflict)
- **Setup:** 1 post scheduled March 16. User reschedules to March 20. No other post on March 20.
- **Expected:**
  - Agent asks for new date.
  - Conflict check: `sma-fetch-post` with `{ "status": "Ready_ToPublish", "scheduled_date": "2026-03-20" }`.
  - No conflict found.
  - `sma-update-post` called with new date + `review_decision: "rescheduled"` + `previous_scheduled_date`.
  - `rescheduled_count` incremented.
- **Pass:** Date updated. No conflict. Counter incremented.

### C.2-06: Reschedule — date conflict
- **Setup:** Post scheduled March 16. User reschedules to March 18. Another post already on March 18.
- **Expected:**
  - Conflict check finds existing post on March 18.
  - Agent shows: "Us din already ek post scheduled hai" with conflicting topic.
  - Agent re-asks for different date.
  - Does NOT allow the reschedule.
- **Pass:** Conflict blocked. User re-prompted. 1 post/day enforced.

### C.2-07: Reschedule — webhook failure
- **Setup:** Conflict check passes. `sma-update-post` fails.
- **Expected:**
  - Retry once. On failure: post added to `skipped_posts[]`.
  - Original date preserved in MongoDB (update didn't apply).
- **Pass:** Post in skipped list. Original date intact.

### C.2-08: Drop — happy path
- **Setup:** 1 post. User chooses "Drop".
- **Expected:**
  - Double-confirmation prompt: "Sure ho? '{topic}' cancel ho jayega."
  - User confirms "haan".
  - `sma-update-post` called with `{ "status": "Cancelled", "review_decision": "dropped" }`.
  - `dropped_count` incremented.
  - Freed slot mentioned.
- **Pass:** Post → `Cancelled`. Counter updated. Confirmation was required.

### C.2-09: Drop — user cancels
- **Setup:** 1 post. User chooses "Drop" then says "nahi" at confirmation.
- **Expected:**
  - Agent returns to decision prompt for the same post.
  - No webhook call made.
  - Post remains `Previewed`.
- **Pass:** Post unchanged. User sees decision prompt again.

### C.2-10: Drop — webhook failure
- **Setup:** User confirms drop. `sma-update-post` fails twice.
- **Expected:**
  - Post added to `skipped_posts[]`.
  - Post remains `Previewed` in MongoDB.
- **Pass:** Skipped list updated. Status unchanged.

### C.2-11: Send back — happy path
- **Setup:** 1 post. User chooses "Send Back".
- **Expected:**
  - Agent explains: post goes back to B-ContentDrafting.
  - `sma-update-post` called with `{ "status": "Scheduled_NoDraft", "draft_content": "", "formatted_content": "" }`.
  - `sent_back_count` incremented.
- **Pass:** Post → `Scheduled_NoDraft`. Content cleared. Counter updated.

### C.2-12: Send back — webhook failure
- **Setup:** User sends back. `sma-update-post` fails.
- **Expected:**
  - Retry once. On failure: post in `skipped_posts[]`.
  - Post remains `Previewed` (content not cleared since update didn't apply).
- **Pass:** Post in skipped list. Content preserved.

### C.2-13: Ambiguous user input
- **Setup:** User responds with "theek hai" (ambiguous — could mean approve or just acknowledge).
- **Expected:**
  - Agent disambiguates: "Confirm karo — approve matlab as-is publish, ya kuch edit karna hai?"
  - Does NOT make a webhook call until user gives a clear decision.
- **Pass:** Disambiguation prompt shown. No premature webhook call.

### C.2-14: External status change mid-review
- **Setup:** 2 posts fetched. While user reviews post 1, post 2's status changes to `Ready_ToPublish` externally.
- **Expected:**
  - When agent reaches post 2 and tries to update, status mismatch detected.
  - Agent informs user: post already reviewed by someone else.
  - Post skipped.
- **Pass:** Stale post detected. User informed. No overwrite.

### C.2-15: Content preview displays correctly
- **Setup:** Post with `formatted_content` including staircase formatting, emojis, hashtags.
- **Expected:**
  - Content shown in code block preserving exact line breaks and formatting.
  - Character count, emoji count, hashtag count displayed.
  - `formatted_content` used (NOT `draft_content`).
- **Pass:** Code block matches `formatted_content` exactly. Stats accurate.

---

## C.3 — Apply Minor Edits

### C.3-01: Valid typo fix
- **Setup:** Post has typo "teh" in line 3. User instructs "line 3 mein 'teh' ko 'the' karo."
- **Expected:**
  - Agent applies change to `formatted_content`.
  - Updated preview shown in code block with "EDITED PREVIEW" label.
  - Changes summary displayed.
  - Formatting rules still pass (chars, emojis, etc.).
  - User asked to approve/edit more/revert.
- **Pass:** Typo fixed. Preview shown. Rules pass. User prompted.

### C.3-02: Valid word swap
- **Setup:** User instructs "'amazing' hatao, 'powerful' lagao."
- **Expected:**
  - Word replaced throughout `formatted_content`.
  - Character count recalculated and displayed.
  - Updated preview shown.
- **Pass:** Word swapped. Count updated. Preview shown.

### C.3-03: Edit exceeds character limit
- **Setup:** Post at 1580 chars. User adds a sentence that pushes it to 1650 chars.
- **Expected:**
  - Agent detects char count > 1600.
  - Warns user: "Edit ke baad character count 1650 ho gaya (max 1600). Thoda trim karna padega."
  - Asks where to trim.
  - Does NOT save the over-limit version.
- **Pass:** Over-limit detected. User prompted to trim. No save.

### C.3-04: Edit drops below character minimum
- **Setup:** Post at 850 chars. User removes 100 chars.
- **Expected:**
  - Agent detects char count < 800.
  - Warns user about minimum.
  - Asks for additions or alternative approach.
- **Pass:** Under-limit detected. User prompted.

### C.3-05: Edit exceeds emoji limit
- **Setup:** Post has 3 emojis. User adds another emoji.
- **Expected:**
  - Agent detects emoji count > 3.
  - Warns user: max 3 emojis.
  - Suggests removing one existing emoji.
- **Pass:** Emoji limit enforced. User prompted.

### C.3-06: Edit breaks formatting — bold/italic
- **Setup:** User tries to add `**bold text**` to content.
- **Expected:**
  - Agent flags: no bold/italic/underline allowed (LinkedIn plain text rules).
  - Suggests UPPERCASE as alternative for emphasis.
- **Pass:** Formatting rule enforced. Alternative suggested.

### C.3-07: Multiple edit rounds
- **Setup:** User edits, then says "aur edit" 3 times, each time making a different change.
- **Expected:**
  - Each round: changes applied, preview shown, user prompted.
  - No limit on edit rounds.
  - Final approval triggers save.
- **Pass:** All 3 rounds processed. Final version saved on approval.

### C.3-08: Revert after editing
- **Setup:** User makes edits, then says "revert".
- **Expected:**
  - Original `formatted_content` restored.
  - Original preview shown.
  - User returned to C.2 decision prompt (can choose a different action).
  - No webhook call made for the discarded edit.
- **Pass:** Original content restored. Decision prompt shown. No save.

### C.3-09: Major edit detected
- **Setup:** User requests changing the entire hook or rewriting the narrative structure.
- **Expected:**
  - Agent identifies this as a major edit (not minor).
  - Suggests sending back to B-ContentDrafting.
  - Asks user to confirm send-back or simplify edit request.
- **Pass:** Major edit flagged. Send-back offered.

### C.3-10: Edit approval — webhook success
- **Setup:** User approves edited version. Webhook succeeds.
- **Expected:**
  - `sma-update-post` called with updated `formatted_content`, `status: "Ready_ToPublish"`, `review_decision: "edited_and_approved"`, `edit_summary`.
  - `edited_count` incremented.
  - Proceeds to next post or C.4.
- **Pass:** Content saved. Counter updated. Flow continues.

### C.3-11: Hashtag modification
- **Setup:** User requests "hashtag #AI hatao, #MachineLearning lagao."
- **Expected:**
  - Hashtag swapped in `formatted_content`.
  - Hashtag count verified (3–6 range).
  - Updated preview shows new hashtags at end.
- **Pass:** Hashtag swapped. Count in valid range. Preview correct.

### C.3-12: Unclear edit instruction
- **Setup:** User says "thoda better karo" (vague).
- **Expected:**
  - Agent asks for clarification: "Exactly kya change karna hai? Line number ya specific text batao."
  - Does NOT apply any changes until instructions are clear.
- **Pass:** Clarification requested. No changes applied.

---

## C.4 — Finalize Review

### C.4-01: Summary accuracy — all decisions
- **Setup:** 3 posts reviewed: 1 approved, 1 edited, 1 dropped. No failures.
- **Expected:**
  - Summary table shows correct counts: 1 approved, 1 edited, 0 rescheduled, 1 dropped, 0 sent back, 0 failed.
  - Each section lists the correct post topics.
  - Total = 3.
  - `approved + edited + rescheduled + dropped + sent_back = total`.
- **Pass:** Counts accurate. Topics match. Total correct.

### C.4-02: Summary with skipped posts — retry succeeds
- **Setup:** 1 post was skipped due to webhook failure in C.2. At C.4, retry succeeds.
- **Expected:**
  - Agent retries the skipped post's update.
  - On success: removed from `skipped_posts[]`, counter updated.
  - Summary shows the post under its correct decision category (not "Failed").
- **Pass:** Retry succeeded. Post in correct category. No "Failed" entries.

### C.4-03: Summary with skipped posts — retry fails
- **Setup:** 1 post was skipped. At C.4, retry also fails.
- **Expected:**
  - Summary shows 1 post under "Failed (needs manual fix)".
  - `post_id` provided for manual intervention.
  - Agent suggests checking n8n health.
- **Pass:** Failed post listed with ID. Manual fix suggested.

### C.4-04: Undo approval — post still Ready_ToPublish
- **Setup:** User reviewed 2 posts. At summary, user says "undo post 1 ka approval".
- **Expected:**
  - Agent re-fetches post 1 by `_id`.
  - Status is `Ready_ToPublish` → safe to undo.
  - `sma-update-post` called with `{ "status": "Previewed" }`.
  - Counter updated: `approved_count -= 1`.
  - Updated summary shown.
- **Pass:** Post reverted to `Previewed`. Counter adjusted. Summary updated.

### C.4-05: Undo approval — post already Published
- **Setup:** User requests undo. Post was picked up by D-ContentPublishing and is now `Published`.
- **Expected:**
  - Agent re-fetches post. Status is `Published`.
  - Agent informs user: "Post already publish ho chuka hai. Undo nahi ho sakta."
  - No status change attempted.
- **Pass:** Undo rejected. User informed. No webhook call.

### C.4-06: Undo drop — restore Cancelled post
- **Setup:** User dropped a post. At summary, says "actually wo post wapas lao."
- **Expected:**
  - Agent re-fetches post. Status is `Cancelled`.
  - `sma-update-post` called with `{ "status": "Previewed" }`.
  - `dropped_count -= 1`. Updated summary.
- **Pass:** Post restored to `Previewed`. Counter adjusted.

### C.4-07: Next workflow routing — B-ContentDrafting
- **Setup:** Review complete. User says "Aur content draft karo."
- **Expected:**
  - Agent routes to B-ContentDrafting.
  - No data passed (B.1 fetches its own posts).
- **Pass:** Correct workflow handoff. No data dependency.

### C.4-08: Next workflow routing — exit
- **Setup:** Review complete. User says "Bas, done for now."
- **Expected:**
  - Agent exits gracefully.
  - No further actions or webhook calls.
- **Pass:** Clean exit. No dangling state.

### C.4-09: Upcoming publication schedule display
- **Setup:** 2 posts approved (March 16, March 18). 1 rescheduled to March 20 (still `Previewed`).
- **Expected:**
  - Schedule table shows:
    - March 16 — `Ready_ToPublish`
    - March 18 — `Ready_ToPublish`
    - March 20 — `Previewed` (rescheduled, needs re-approval)
  - Rescheduled post noted as needing review in next session.
- **Pass:** Schedule accurate. Rescheduled post status correct.

### C.4-10: Counter mismatch detection
- **Setup:** Bug causes `approved_count + dropped_count = total - 1` (one post unaccounted for).
- **Expected:**
  - Agent detects mismatch.
  - Logs warning in summary.
  - Still presents available data (does not block finalization).
- **Pass:** Mismatch flagged. Summary still displayed.

### C.4-11: All posts failed — no decisions saved
- **Setup:** 3 posts reviewed. All 3 `sma-update-post` calls failed. All 3 retries at C.4 also fail.
- **Expected:**
  - Summary shows 3 posts under "Failed (needs manual fix)".
  - Agent does NOT claim review is "complete".
  - All `post_id` values listed.
  - Suggests checking n8n before re-running review.
- **Pass:** No false "complete" claim. All failures visible.

---

## Integration Tests

### INT-01: Full happy path — C.1 → C.4
- **Setup:** 2 posts with status `Previewed`. Both have valid `formatted_content`.
- **Flow:**
  1. C.1: Fetch returns 2 posts, sorted by date. Summary shown. User says "haan".
  2. C.2 (post 1): Preview shown. User approves. Webhook succeeds. `approved_count = 1`.
  3. C.2 (post 2): Preview shown. User edits → C.3: edit applied, preview shown, user approves edited version. Webhook succeeds. `edited_count = 1`.
  4. C.4: Summary shows 1 approved, 1 edited. Schedule shown. Next actions offered.
- **Pass:** All steps execute in sequence. All counters correct. Both posts saved to MongoDB.

### INT-02: Mixed decisions — approve, drop, reschedule
- **Setup:** 3 posts.
- **Flow:**
  1. C.1: 3 posts fetched.
  2. Post 1: Approve → `Ready_ToPublish`.
  3. Post 2: Drop → confirmed → `Cancelled`.
  4. Post 3: Reschedule → new date (no conflict) → saved.
  5. C.4: Summary: 1 approved, 1 dropped, 1 rescheduled.
- **Pass:** All 3 decisions correctly applied. Summary accurate.

### INT-03: Edit with revert then approve
- **Setup:** 1 post.
- **Flow:**
  1. C.1: 1 post fetched.
  2. C.2: User chooses "Edit".
  3. C.3: User makes edits. Preview shown. User says "revert".
  4. C.2 (back): Original content shown. User now approves as-is.
  5. C.4: Summary: 1 approved.
- **Pass:** Revert works cleanly. Original content approved. Not counted as "edited".

### INT-04: Interrupted session recovery
- **Setup:** 3 posts. Agent reviews 2, then session is interrupted.
- **Flow:**
  1. C.1: 3 posts fetched.
  2. Post 1: Approved → saved to MongoDB.
  3. Post 2: Dropped → saved to MongoDB.
  4. **Interruption** (session ends).
  5. New session: step-01b-resume-if-interrupted runs.
  6. Re-fetch `Previewed` posts: only post 3 returned (posts 1 & 2 have new statuses).
  7. Post 3: User approves.
  8. C.4: Summary reflects post 3's decision. Notes session was resumed.
- **Pass:** Only unreviewed post appears. Previously saved decisions not lost or duplicated.

### INT-05: All posts sent back
- **Setup:** 2 posts.
- **Flow:**
  1. C.1: 2 posts fetched.
  2. Post 1: Send back → `Scheduled_NoDraft`.
  3. Post 2: Send back → `Scheduled_NoDraft`.
  4. C.4: Summary: 0 approved, 2 sent back. Schedule is empty.
  5. Agent offers next actions — B-ContentDrafting suggested.
- **Pass:** Both posts sent back. Empty publish schedule noted. B-ContentDrafting suggested.

### INT-06: Webhook failure mid-flow with C.4 retry
- **Setup:** 2 posts.
- **Flow:**
  1. Post 1: Approve → webhook fails → added to `skipped_posts[]`.
  2. Post 2: Approve → webhook succeeds.
  3. C.4: Retry post 1 → webhook succeeds.
  4. Summary: 2 approved, 0 failed.
- **Pass:** Skipped post recovered at C.4. Final summary shows no failures.

### INT-07: Undo after partial auto-publish
- **Setup:** 3 posts approved. n8n publishes 1 before user requests undo-all.
- **Flow:**
  1. All 3 approved in C.2.
  2. C.4: Summary shown.
  3. User: "Sab undo karo."
  4. Re-fetch: post 1 is `Published`, posts 2 & 3 are `Ready_ToPublish`.
  5. Posts 2 & 3 reverted to `Previewed`. Post 1: cannot undo.
  6. Updated summary: 1 still published (irreversible), 2 reverted.
- **Pass:** Partial undo applied correctly. Published post flagged as irreversible.

### INT-08: Empty queue after format step handoff
- **Setup:** F-ContentFormatting hands off to C-ContentReview, but no posts have status `Previewed` (formatting failed for all).
- **Flow:**
  1. C.1: Fetch returns 0 posts.
  2. Agent shows empty-queue message.
  3. Suggests F-ContentFormatting (to re-attempt formatting).
- **Pass:** Graceful handling. No crash. Correct alternative suggested.

### INT-09: Single post — full edit cycle
- **Setup:** 1 post.
- **Flow:**
  1. C.1: 1 post fetched.
  2. C.2: User chooses "Edit".
  3. C.3 round 1: User fixes typo → preview → "aur edit".
  4. C.3 round 2: User swaps word → preview → "aur edit".
  5. C.3 round 3: User adjusts hashtag → preview → "approve".
  6. Webhook saves final version.
  7. C.4: Summary: 1 edited.
- **Pass:** All 3 edit rounds processed. Final version saved. Counted as 1 edited (not 3).

### INT-10: Long session — staleness check
- **Setup:** 5 posts. Review takes >10 minutes.
- **Flow:**
  1. C.1: 5 posts fetched.
  2. Posts 1–4 reviewed (various decisions).
  3. Post 5: >10 minutes since fetch.
  4. Agent optionally re-fetches post 5's status before applying decision.
  5. If status changed → inform user. If unchanged → proceed normally.
- **Pass:** Staleness handled gracefully. No silent overwrite of externally changed status.
