# Step C.1 — Fetch Scheduled Posts (Previewed)

**Agent:** Content Strategist (Echo)
**Trigger:** User says something like "Review karo", "Posts check karo", "Content review", or starts the review workflow. Also triggered by handoff from F-ContentFormatting after preview is complete.

---

## What You Do

You fetch all posts that have completed formatting and are waiting for human review. These posts have status `Previewed` — meaning they've been through B-ContentDrafting and F-ContentFormatting and are now ready for the final quality gate before auto-publication.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Previewed"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "_id": "...",
      "topic": "...",
      "content_pillar": "...",
      "draft_content": "...",
      "formatted_content": "...",
      "scheduled_date": "2026-03-15T10:00:00Z",
      "channel": "linkedin",
      "status": "Previewed",
      "frameworks_used": {
        "content_format": "...",
        "hook": "...",
        "narrative": "...",
        "cta": "...",
        "tone": "..."
      },
      "brief_topic": "...",
      "experience_ids": ["..."],
      "hashtags": ["..."],
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

## After the Call

**If posts.length > 0:**

Sort posts by `scheduled_date` ascending (soonest first — most urgent reviews get priority).

Store all fetched posts in working memory as `posts_to_review[]`.

Initialize tracking counters:
- `approved_count` → 0
- `edited_count` → 0
- `rescheduled_count` → 0
- `dropped_count` → 0

Display summary to the user:

> "Review ke liye {N} posts hain! Soonest first dikha raha hoon:"
>
> | # | Topic | Pillar | Scheduled Date | Channel |
> |---|-------|--------|----------------|---------|
> | 1 | {topic_1} | {pillar_1} | {date_1} | LinkedIn |
> | 2 | {topic_2} | {pillar_2} | {date_2} | LinkedIn |
> | ... | ... | ... | ... | ... |
>
> "Ek ek karke review karein? (haan / nahi / specific number choose karo)"

- If user says "haan" or equivalent → proceed to **C.2** with the first post.
- If user picks a specific number → proceed to **C.2** with that post first.
- If user says "nahi" → exit workflow gracefully.

**If posts.length === 0:**

Do NOT proceed. Tell the user:

> "Koi previewed post nahi hai abhi. Pehle F-ContentFormatting run karo taaki posts review-ready ho sakein!"

Offer alternatives:
- "Draft new content?" → B-ContentDrafting
- "Run ideation?" → A-ContentIdeation
- "Format existing drafts?" → F-ContentFormatting

Do not proceed further until posts are available.

---

## Error Handling

**If the webhook call fails (network error / non-200 response):**

> "Ek second — MongoDB se posts lene mein dikkat aa rahi hai. Retry karta hoon."

Retry once after 5 seconds. If it fails again:

> "Posts fetch nahi ho rahe. Satvik, n8n workflow active hai? (`SMA/Data/Read/FetchPost` check karo)"

Do NOT proceed to C.2 if this call fails. The entire review workflow depends on having posts to review.

**If response format is unexpected (missing fields, malformed JSON):**

> "Response format expected se alag aa raha hai. Satvik, webhook output check karo — `formatted_content` field missing ho sakta hai."

Do NOT attempt to review posts with missing `formatted_content` — the whole point of review is seeing the formatted preview.

---

## What NOT to Do

- Do NOT invent or fabricate posts if the webhook returns empty
- Do NOT proceed to C.2 without at least 1 post
- Do NOT fetch posts with any status other than `Previewed` — other statuses belong to other workflows
- Do NOT show raw JSON to the user — always parse and present as a clean summary table
- Do NOT re-order posts unless user explicitly asks — default is chronological (soonest first)
- Do NOT auto-approve any posts — every post MUST get explicit user decision (this is the last human checkpoint)

---

## Output for Next Step

Pass to **C.2**:
```
posts_to_review[]     — full array of post objects, sorted by scheduled_date ascending
current_post_index    — 0 (start with the first/soonest post)
approved_count        — 0
edited_count          — 0
rescheduled_count     — 0
dropped_count         — 0
```
