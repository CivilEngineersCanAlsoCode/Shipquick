# Step D.1 — Fetch Ready Posts

**Agent:** Content Publisher
**Trigger:** Session context loaded (Step 01), no in-progress session found.

---

## What You Do

Fetch all posts that are ready for publishing — those with status `Ready_ToPublish`. These posts have been through Ideation (A), Drafting (B), Formatting (F), and Review (C).

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Ready_ToPublish"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "post_id": "...",
      "title": "...",
      "content": "...",
      "hashtags": ["...", "..."],
      "scheduled_date": "...",
      "linkedin_post_urn": null,
      "status": "Ready_ToPublish",
      "created_at": "...",
      "reviewed_at": "..."
    }
  ]
}
```

---

## After the Call

**If posts are found (posts.length > 0):**

Present the posts to the user in a clean summary:

> **Ready to Publish:**
>
> | # | Title | Scheduled Date | Hashtags |
> |---|-------|---------------|----------|
> | 1 | [title] | [date] | [count] hashtags |
> | 2 | ... | ... | ... |
>
> "Which post should we publish? (Pick one — max 1/day)"

Wait for user to confirm their selection. Do NOT auto-select.

Store the selected post in working memory and proceed to **D.2**.

**If no posts found (posts.length === 0):**

Tell the user:
> "No posts with Ready_ToPublish status right now. Make sure posts have been through the Review (C) workflow first."

Do NOT proceed further. Exit the workflow gracefully.

---

## Error Handling

**If the webhook call fails (network error / non-200 response):**
> "Having trouble fetching posts from the database. Let me retry once..."

Retry once after 5 seconds. If it fails again:
> "Still can't reach the fetch webhook. Can you check if the n8n workflow `SMA/Data/Read/FetchPost` is active?"

Do NOT proceed to the next step if this call fails.

---

## What NOT to Do

- Do NOT proceed without user confirmation on which post to publish
- Do NOT select multiple posts — max 1 post per publish run
- Do NOT invent or fabricate post data if the webhook returns empty
- Do NOT show raw JSON to the user — present a clean summary
- Do NOT filter posts here beyond the `Ready_ToPublish` status (that's the webhook's job)

---

## Output for Next Step

Pass to **D.2**:
```
selected_post — the full post object chosen by the user
```
