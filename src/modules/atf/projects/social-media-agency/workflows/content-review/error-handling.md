# C-ContentReview — Error Handling Guide

## Overview

This document covers failure modes, race conditions, and recovery strategies for the Content Review workflow (C.1–C.4). The review workflow is the **last human checkpoint** before auto-publication — errors here can result in unintended publishes or lost editorial decisions.

---

## 1. Webhook Failures Mid-Review

### 1.1 `sma-fetch-post` Fails at C.1

**Scenario:** Network error or non-200 response when fetching Previewed posts.

**Impact:** Workflow cannot start — no posts to review.

**Handling:**
1. Retry once after 5 seconds (built into step-C1).
2. If retry fails, surface the n8n workflow name for manual check: `SMA/Data/Read/FetchPost`.
3. Do NOT proceed to C.2 — the workflow is entirely blocked without post data.
4. Do NOT fabricate or cache stale post data.

**Recovery:** User or admin restarts after confirming n8n is healthy.

---

### 1.2 `sma-update-post` Fails During C.2 Decision

**Scenario:** User approves/drops/reschedules a post, but the save webhook fails.

**Impact:** Decision made but not persisted — post remains `Previewed` in MongoDB.

**Handling:**
1. Retry once after 3 seconds.
2. If retry fails:
   - Add post to `skipped_posts[]` with the intended decision payload.
   - Inform user: specific post failed, offer to skip and continue.
   - Do NOT discard the user's decision — keep it in session state.
3. At C.4, retry all skipped posts before presenting the summary.

**Critical rule:** Never silently swallow a failed update. The user must know which posts did not save.

---

### 1.3 `sma-update-post` Fails After Edit Approval (C.3)

**Scenario:** User edited content, approved the edit, but the save fails.

**Impact:** Edited content exists only in agent memory — will be lost if session ends.

**Handling:**
1. Retry once.
2. If retry fails:
   - Keep edited content in working memory (do NOT discard).
   - Suggest user copy the edited content to clipboard as a safety net.
   - Add to `skipped_posts[]` for C.4 retry.
3. Do NOT revert to original content — the user's edits are the source of truth.

---

### 1.4 Webhook Timeout (Slow Response)

**Scenario:** n8n responds but takes >30 seconds.

**Impact:** Agent may re-send the request, causing duplicate updates.

**Handling:**
1. Wait up to 60 seconds before treating as failure.
2. If timeout occurs, check post status before retrying (fetch the post first to see if the update actually applied).
3. If status already changed → update succeeded despite timeout. Do NOT re-send.

---

## 2. Conflicting Edits

### 2.1 Two Sessions Reviewing the Same Post

**Scenario:** User opens two review sessions (e.g., two browser tabs or two agent conversations). Both fetch the same `Previewed` post.

**Impact:** Second session's decision overwrites the first. No locking mechanism exists.

**Handling:**
- **Prevention:** The workflow is designed as a single-user interactive session. There is no multi-user concurrency in v1.
- **Detection:** If a post's status has changed between fetch (C.1) and decision (C.2), the `sma-update-post` call should check the current status. If status is no longer `Previewed`, warn the user:
  > "Post '{topic}' ka status change ho chuka hai (ab {current_status} hai). Kisi aur ne already review kar liya. Skip karna padega."
- **Recovery:** Skip the post. Do NOT overwrite a decision made by another session.

### 2.2 External Status Change During Review

**Scenario:** An n8n automation or manual DB edit changes a post's status while the user is reviewing it.

**Impact:** Agent's local state is stale. Decision may be applied to a post that's already been published or cancelled.

**Handling:**
1. Before applying any decision in C.2, optionally re-fetch the post's current status (paranoia check for long sessions).
2. If status has changed from `Previewed`:
   - `Published` → Too late. Inform user. Cannot undo.
   - `Cancelled` → Someone else dropped it. Inform user. Skip.
   - `Ready_ToPublish` → Already approved elsewhere. Inform user. Skip or allow re-decision.
   - `Drafting` / `Scheduled_NoDraft` → Sent back. Inform user. Skip.
3. Long sessions (>10 minutes between first fetch and last decision) should trigger a staleness warning.

---

## 3. Status Race Conditions

### 3.1 Approve → Auto-Publish Race

**Scenario:** User approves a post (`Ready_ToPublish`). n8n's D-ContentPublishing picks it up and publishes it before the review session ends.

**Impact:** If user later wants to undo the approval (at C.4), the post is already `Published`.

**Handling:**
1. At C.4, if user requests undo:
   - Re-fetch the post's current status.
   - If `Published` → inform user: "Post already publish ho chuka hai. Undo nahi ho sakta."
   - If `Ready_ToPublish` → safe to revert to `Previewed`.
2. The review summary should note that approved posts **will auto-publish** — this is communicated at each approval in C.2.

### 3.2 Reschedule → Date Conflict Race

**Scenario:** User reschedules post to March 20. Between the conflict check (fetch) and the update (save), another post gets scheduled for March 20.

**Impact:** Two posts on the same date, violating the 1 post/day constraint.

**Handling:**
- This is a TOCTOU (time-of-check-time-of-use) race. In practice, the window is very small (seconds).
- **Mitigation:** The D-ContentPublishing workflow should also enforce 1 post/day at publish time (defense in depth).
- **Detection:** If a duplicate is detected downstream, D-ContentPublishing should hold the second post and alert the user.
- **Recovery:** User manually resolves by rescheduling one of the conflicting posts.

### 3.3 Drop → Re-Ideate Race

**Scenario:** User drops a post (`Cancelled`). Meanwhile, A-ContentIdeation generates a new post for the same slot/date.

**Impact:** No conflict — the slot is legitimately free. The Cancelled post stays archived, and the new post fills the slot. This is expected behavior, not an error.

### 3.4 Send-Back → Re-Fetch Race

**Scenario:** User sends a post back to B-ContentDrafting (status → `Scheduled_NoDraft`). The post quickly gets re-drafted (status → `Drafting` → `Drafted`) and re-formatted (→ `Previewed`) before the current review session ends.

**Impact:** The re-formatted post could appear if the user re-fetches in the same session.

**Handling:**
- This is extremely unlikely within a single session but theoretically possible.
- If it happens, the re-fetched post is a new version and should be treated as a fresh review item. The user should be informed that this post was sent back and has been re-drafted.

---

## 4. Empty Queue Handling

### 4.1 Zero Posts at C.1

**Scenario:** No posts have status `Previewed`.

**Handling:**
1. Do NOT proceed to C.2.
2. Display message in Hinglish explaining no posts are available.
3. Offer alternatives: B-ContentDrafting, A-ContentIdeation, F-ContentFormatting.
4. Exit workflow gracefully — do NOT loop or poll waiting for posts.

### 4.2 Queue Empties Mid-Review

**Scenario:** User starts reviewing 3 posts. During review, an external process changes the remaining posts' statuses.

**Impact:** Agent's local `posts_to_review[]` still has them, but their MongoDB status has changed.

**Handling:**
- The agent works from its local array, not live queries. So review continues normally.
- At decision time (C.2), if the webhook rejects an update because status is wrong, handle per section 2.2 above.
- This is a variant of the stale-data problem — acceptable in v1 since the window is small.

### 4.3 All Posts Skipped Due to Failures

**Scenario:** Every post's `sma-update-post` call fails. User skips all of them.

**Impact:** Review session produced zero persisted decisions.

**Handling:**
1. At C.4, retry ALL skipped posts.
2. If all retries fail:
   - Present summary showing all posts as "Failed (needs manual fix)".
   - Provide all `post_id` values for manual intervention.
   - Suggest checking n8n health before re-running the review workflow.
3. Do NOT claim the review is "complete" — clearly state that no decisions were saved.

---

## 5. Undo After Auto-Publish Started

### 5.1 Undo Request During C.4 Summary

**Scenario:** User sees the summary and says "Wait, undo that approval for post X."

**Handling:**
1. Re-fetch the post by `_id` to check current status.
2. Decision matrix:

| Current Status | Can Undo? | Action |
|---------------|-----------|--------|
| `Ready_ToPublish` | Yes | Set status back to `Previewed` via `sma-update-post` |
| `Published` | No | Inform user: already live on LinkedIn, cannot retract |
| `Cancelled` | Yes | Set status back to `Previewed` (un-drop) |
| `Scheduled_NoDraft` | Partially | Was sent back — can set back to `Previewed` if content still exists |

3. Update session counters to reflect the undo.
4. Re-display the updated summary.

### 5.2 Undo Request After Session Ends

**Scenario:** User returns later wanting to undo a review decision.

**Handling:**
- If post is `Ready_ToPublish` → start a new C-ContentReview session. The post won't appear (it's not `Previewed`), but user can request a manual status revert.
- If post is `Published` → cannot undo. LinkedIn does not support un-publishing via API. User must manually delete the LinkedIn post.
- If post is `Cancelled` → can restore by manually updating status to `Previewed` via `sma-update-post`, then running a new review session.

### 5.3 Partial Publish (n8n Picks Up Mid-Batch)

**Scenario:** User approved 3 posts. n8n publishes 1 of them while the user is still in C.4 reviewing the summary. User wants to undo all 3 approvals.

**Impact:** 1 post is already `Published`, 2 are still `Ready_ToPublish`.

**Handling:**
1. Re-fetch all 3 posts.
2. Revert the 2 that are still `Ready_ToPublish` → back to `Previewed`.
3. Inform user that 1 post is already published and cannot be reverted.
4. Log the partial undo in the session summary.

---

## 6. Data Integrity Safeguards

### 6.1 Missing `formatted_content`

**Scenario:** Post has status `Previewed` but `formatted_content` is empty or missing.

**Handling:**
- Do NOT present this post for review — the preview is the whole point.
- Inform user: "Post '{topic}' mein formatted content nahi hai. F-ContentFormatting dobara run karo."
- Skip this post (do not add to review queue).

### 6.2 Stale `scheduled_date` (Past Date)

**Scenario:** A `Previewed` post has a `scheduled_date` in the past.

**Handling:**
- Flag it at C.1 with a warning: "Post '{topic}' ki date beet chuki hai ({past_date}). Reschedule ya drop karo."
- Present it first (most urgent) in the review queue.
- Do NOT auto-approve a past-date post — it needs user attention.

### 6.3 Counter Mismatch at C.4

**Scenario:** `approved + edited + rescheduled + dropped + sent_back + skipped != total_posts`.

**Handling:**
- This indicates a bug in state tracking. Log a warning.
- Present whatever data is available — do not block finalization.
- Flag the mismatch in the summary for debugging.

---

## 7. Session-Level Failures

### 7.1 Agent Context Lost (Conversation Interrupted)

**Scenario:** The agent conversation is interrupted mid-review (browser close, timeout, crash).

**Handling:**
- Use **step-01b-resume-if-interrupted.md** to recover.
- Re-fetch `Previewed` posts — already-decided posts will have changed status and won't appear.
- Resume from the first remaining `Previewed` post.
- Previously applied decisions are safe (they were persisted to MongoDB via webhooks).
- Unsaved decisions (in `skipped_posts[]`) are lost — user will need to re-decide those posts.

### 7.2 Very Long Session (Context Window Pressure)

**Scenario:** Reviewing many posts causes the agent's context window to fill up.

**Impact:** Earlier post details and decisions may be compressed/lost from context.

**Handling:**
- Decisions are persisted to MongoDB as they happen — they're not lost.
- Session counters should be maintained as compact state.
- At C.4, if counter data seems incomplete, re-fetch all posts and reconstruct the summary from their current statuses.
