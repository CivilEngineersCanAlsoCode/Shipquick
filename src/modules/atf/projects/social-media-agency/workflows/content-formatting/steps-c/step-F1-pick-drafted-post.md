# Step F.1 — Pick Drafted Post

**Agent:** Content Strategist
**Trigger:** Session context loaded (Step 01), no interrupted sessions found (or user chose to pick a new post).

---

## What You Do

Fetch all posts in `Drafted` status and let the user pick one to format. This is the entry point into the actual formatting pipeline.

---

## Action: Fetch Drafted Posts

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Drafted"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "post_id": "...",
      "title": "...",
      "topic": "...",
      "brief_summary": "...",
      "scheduled_date": "...",
      "raw_content": "...",
      "created_at": "...",
      "status": "Drafted"
    }
  ]
}
```

---

## After the Call

**If posts.length > 0:**

Present a numbered list to the user:

> "Yeh drafted posts hain jo format hone ke liye ready hain:"
>
> 1. **{title}** — {brief_summary} (scheduled: {scheduled_date})
> 2. **{title}** — {brief_summary} (scheduled: {scheduled_date})
> ...
>
> "Kaun sa post format karna hai? Number bolo."

Wait for user selection.

**On user selection:**

1. Store the selected post in working memory (full post object including raw_content)
2. Update status to `Formatting`:

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{selected_post_id}",
  "status": "Formatting"
}
```

3. Confirm to user:
> "Chaliye! '{title}' ko format karte hain. 🎯"

4. Proceed to **F.2** (Apply Formatting).

**If posts.length === 0:**

> "Abhi koi drafted post nahi hai format karne ke liye. Pehle B-Drafting workflow se ek post draft karo, phir wapas aao!"

Do NOT proceed further. Exit the workflow.

---

## Error Handling

**If the fetch webhook fails:**
> "Drafted posts fetch karne mein dikkat aa rahi hai. Thodi der mein retry karta hoon."

Retry once after 5 seconds. If it fails again:
> "Webhook respond nahi kar raha. Satvik, `SMA/Data/Read/FetchPost` check karo n8n mein."

Do NOT proceed if the fetch fails.

**If the status update webhook fails:**
> "Status update mein dikkat aayi. Post format toh karunga, but status `Formatting` set nahi hua — manually check karna padega."

Proceed to F.2 anyway (formatting can still happen, status update is a safety lock not a hard blocker).

---

## What NOT to Do
- Do NOT invent or hallucinate posts if the webhook returns empty
- Do NOT auto-select a post without user input
- Do NOT show raw JSON to the user — always present formatted, readable output
- Do NOT proceed to F.2 without a valid post selected
- Do NOT skip the status update to `Formatting`

---

## Output for Next Step

Pass to **F.2**:
```
selected_post — full post object (post_id, title, topic, raw_content, scheduled_date, etc.)
```
