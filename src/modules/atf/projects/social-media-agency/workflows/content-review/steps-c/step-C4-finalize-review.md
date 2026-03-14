# Step C.4 — Finalize Review Session

**Agent:** Pixel (flex-crafter)
**Trigger:** All posts in `posts_to_review[]` have been processed (every post has a decision).

---

## What You Do

You present a final summary of all review decisions, handle any skipped posts, log the review session, and offer next workflow actions.

---

## Prerequisites

From **C.2** (and **C.3** if edits were made):
- `posts_to_review[]` — all posts with decisions recorded
- `approved_count`, `edited_count`, `rescheduled_count`, `dropped_count`, `sent_back_count`
- `skipped_posts[]` — posts where webhook calls failed (if any)

---

## Execution Flow

### 1. Handle Skipped Posts (If Any)

If `skipped_posts.length > 0`, these are posts where the `sma-update-post` webhook failed during C.2/C.3:

> "Ye {skipped_posts.length} posts save nahi ho paye pehle — ab retry karta hoon:"

For each skipped post, retry the original decision's webhook call:

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    ... (same payload as the original decision)
  }
}
```

**If retry succeeds:** Remove from `skipped_posts[]`, update counters.

**If retry fails again:**
> "Post '{topic}' ka update abhi bhi fail ho raha hai. Manually fix karna padega — post_id: {_id}"

Log this for manual follow-up. Do NOT block the rest of the finalization.

### 2. Display Review Summary

> **Review Session Complete**
>
> | Decision | Count | Posts |
> |----------|-------|-------|
> | Approved | {approved_count} | {list of approved topics} |
> | Edited & Approved | {edited_count} | {list of edited topics} |
> | Rescheduled | {rescheduled_count} | {list of rescheduled topics + new dates} |
> | Dropped | {dropped_count} | {list of dropped topics} |
> | Sent Back | {sent_back_count} | {list of sent-back topics} |
> | Failed (needs manual fix) | {skipped_count} | {list if any} |
>
> **Total reviewed: {total}**

### 3. Upcoming Publication Schedule

Show what's now in the publish queue:

> **Agle din publish hone wale posts:**
>
> | Date | Topic | Status |
> |------|-------|--------|
> | {date_1} | {topic_1} | Ready_ToPublish |
> | {date_2} | {topic_2} | Previewed (rescheduled) |
> | ... | ... | ... |

**Note:** Rescheduled posts stay `Previewed` — they will appear in the next review session for re-approval. Do NOT assume Ready_ToPublish automatically.

This is informational only — no webhook call needed, just summarize from the session data (approved + rescheduled posts).

### 4. Quality Gate Confirmation

If all posts were reviewed (no skips, no failures):
> "Sab posts review ho gaye! n8n scheduled dates pe auto-publish karega. Ab aaram karo."

If some posts had issues:
> "{issue_count} posts mein dikkat thi — upar details dekho. Baaki sab set hai."

### 5. Offer Next Actions

> "Aur kya karna hai?"
>
> 1. **"Aur content draft karo"** → B-ContentDrafting
> 2. **"Ideation run karo"** → A-ContentIdeation
> 3. **"Drafts format karo"** → F-ContentFormatting
> 4. **"Published posts ka analytics dekho"** → E-AnalyticsReview
> 5. **"Bas, done for now"** → Exit workflow

Wait for user input. Route to the chosen workflow or exit gracefully.

---

## Error Handling

**If user asks to undo a decision after summary:**
> "Kaunsa post change karna hai?"

Re-fetch that specific post by `_id` and check its current status:
- If still `Ready_ToPublish` → can undo (change back to `Previewed` via `sma-update-post`)
- If already `Published` → too late, cannot undo
- If `Cancelled` → can restore (change back to `Previewed`)

Apply the undo and update counters accordingly.

**If session was very long and context might be stale:**
> "Session kaafi lamba tha — ek final check karta hoon ki sab saves theek se gaye."

Optionally re-fetch posts to verify their statuses match expected decisions. This is a paranoia check, not required every time.

---

## What NOT to Do

- Do NOT skip the summary — user must see a clear recap of all decisions
- Do NOT auto-route to another workflow — always ask the user what they want to do next
- Do NOT forget about skipped posts — retry them here before finalizing
- Do NOT show the summary before all posts are processed
- Do NOT claim posts are "published" — they are `Ready_ToPublish` and will be auto-published later by D-ContentPublishing

---

## Output

This is the final step of C-ContentReview. No data passed to a next step within this workflow.

**Workflow handoff (if user chooses):**
- → B-ContentDrafting: no data needed (B.1 fetches its own posts)
- → A-ContentIdeation: no data needed (A.1 fetches its own briefs)
- → F-ContentFormatting: no data needed (F.1 fetches its own posts)
- → E-AnalyticsReview: no data needed
- → Exit: end session

**Session artifacts logged:**
```
review_session = {
  timestamp: "{ISO_timestamp}",
  total_reviewed: {total},
  approved: {approved_count},
  edited: {edited_count},
  rescheduled: {rescheduled_count},
  dropped: {dropped_count},
  sent_back: {sent_back_count},
  failed: {skipped_count},
  decisions: [
    { post_id: "...", topic: "...", decision: "approved|edited|rescheduled|dropped|sent_back", details: "..." },
    ...
  ]
}
```
