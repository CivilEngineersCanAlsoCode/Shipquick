# Step D.1 — Fetch Ready Posts

**Agent:** Content Publisher (Relay)
**Trigger:** User says something like "Publish karo", "Post daal do", "LinkedIn pe daal do", or starts the publishing workflow.

---

## What You Do

Fetch all posts with status `Ready_ToPublish` from the database. These posts have completed the full pipeline: Ideation (A) → Drafting (B) → Formatting (F) → Review (C). Present them to the user and let them confirm which one to publish.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Ready_ToPublish"
}
```

**Expected Response (HTTP 200):**
```json
{
  "posts": [
    {
      "post_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Why Most DevTools Fail at Developer Experience",
      "content": "Full post content here...",
      "hashtags": ["#DevTools", "#DX", "#SaaS"],
      "topic": "developer-experience",
      "scheduled_date": "2026-03-14",
      "linkedin_post_urn": null,
      "linkedin_post_url": null,
      "status": "Ready_ToPublish",
      "created_at": "2026-03-10T08:00:00Z",
      "reviewed_at": "2026-03-13T14:30:00Z",
      "published_at": null
    }
  ]
}
```

---

## After the Call

**If posts are found (posts.length > 0):**

Present the posts to the user in a clean summary table:

> **Ready to Publish:**
>
> | # | Title | Scheduled Date | Topic | Hashtags |
> |---|-------|---------------|-------|----------|
> | 1 | [title] | [scheduled_date] | [topic] | [count] tags |
> | 2 | ... | ... | ... | ... |
>
> "Kaunsa post publish karna hai? (Ek choose karo — max 1 post/day)"

Wait for user to confirm their selection. Do NOT auto-select.

**Pre-publish safety check — Already Published Today?**

After the user selects a post, check if any post in the response has `status: "Published"` and a `published_at` date of today. Also ask the user to confirm:

> "Aaj ka date [today's date] hai. Confirm karo ki aaj koi aur post publish nahi hua?"

If a post was already published today, tell the user:

> "Aaj already ek post publish ho chuka hai. Max 1 post/day rule hai (v1). Kal try karo ya override karna ho toh bolo."

If the user explicitly overrides, proceed. Otherwise, exit gracefully.

Store the selected post object in working memory and proceed to **D.2**.

**If no posts found (posts.length === 0):**

Tell the user:
> "Abhi koi Ready_ToPublish post nahi hai. Pehle Review (C) workflow se posts approve karwao."

Do NOT proceed further. Exit the workflow gracefully.

---

## Error Handling

**If the webhook call fails (network error / non-200 response):**
> "Posts fetch karne mein dikkat aa rahi hai. Ek baar retry karta hoon..."

Retry once after 5 seconds. If it fails again:
> "Webhook abhi respond nahi kar raha. Satvik, n8n workflow `SMA/Data/Read/FetchPost` active hai? Check karo."

Do NOT proceed to the next step if this call fails. The entire workflow depends on having posts to publish.

---

## What NOT to Do

- Do NOT proceed without user confirmation on which post to publish
- Do NOT select multiple posts — max 1 post per publish run
- Do NOT invent or fabricate post data if the webhook returns empty
- Do NOT show raw JSON to the user — present a clean summary table
- Do NOT filter posts beyond the `Ready_ToPublish` status (the webhook handles filtering)
- Do NOT auto-select even if there's only 1 post — always confirm with user
- Do NOT skip the "already published today" check

---

## Output for Next Step

Pass to **D.2**:
```
selected_post — the full post object chosen by the user, including:
  - post_id
  - title
  - content
  - hashtags[]
  - topic
  - scheduled_date
  - linkedin_post_urn (should be null)
  - status (should be "Ready_ToPublish")
```
