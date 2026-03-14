# Step B.1 — Pick Post (Auto)

**Agent:** Content Strategist
**Trigger:** User says "Let's draft", "Post likhna hai", "Draft karo", or continues after A.8.

---

## What You Do

You fetch the earliest undrafted scheduled post (status: `Scheduled_NoDraft`) from MongoDB via the `sma-fetch-post` webhook. There is no list — the system auto-picks the earliest one. You display it to the user for confirmation before proceeding to drafting.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Scheduled_NoDraft",
  "channel": "linkedin",
  "limit": 1
}
```

The webhook sorts by `scheduled_date` ascending, so you always get the earliest undrafted post.

**Expected Response:**
```json
{
  "posts": [
    {
      "_id": "ObjectId string",
      "title": "Why I turned down PWC to bet on myself",
      "content": null,
      "channel": "linkedin",
      "content_pillar": "career",
      "scheduled_date": "2026-03-17",
      "scheduled_time": "09:00",
      "status": "Scheduled_NoDraft",
      "scores": {
        "freshness": 9,
        "personal_experience": 10,
        "research_quality": 7,
        "total": 143
      },
      "source_brief_id": "1773448434682",
      "linked_experiences": ["exp_id_1"],
      "additional_context": "User shared extra story about the PWC decision"
    }
  ]
}
```

---

## After the Call

**If posts.length === 1 (happy path):**

Store the post object in working memory. Present it to the user:

> "Next undrafted post:
>
> '[title]'
> Scheduled: [scheduled_date], [scheduled_time] IST
> Pillar: [content_pillar] | Score: [scores.total]/160
>
> Draft shuru karein?"

Wait for user confirmation.

**User confirms ("haan", "yes", "chalo", "let's go"):**
→ Proceed to **B.2**

**User says "skip this, next one" or "ye nahi, next":**
Fetch the next earliest by calling the same webhook with `limit: 2`, then pick the second result:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`
```json
{
  "status": "Scheduled_NoDraft",
  "channel": "linkedin",
  "limit": 2
}
```

If 2 posts returned → show the second one, re-ask for confirmation.
If only 1 post returned → that was the only one, tell user:
> "Bas yahi ek undrafted post hai. Isko draft karein ya exit?"

**If posts.length === 0 (no undrafted posts):**
> "Koi undrafted post nahi hai abhi. Pehle Content Ideation run karo naye posts schedule karne ke liye!"

Do NOT proceed. Offer to start A-ContentIdeation workflow.

---

## Edge Cases

| Scenario | Response |
|----------|----------|
| No posts with `Scheduled_NoDraft` | Tell user, suggest running Content Ideation |
| Post's `scheduled_date` is today | Warn: "Ye post aaj ke liye hai — jaldi draft karna hoga!" Still proceed normally |
| Post's `scheduled_date` is in the past | Warn: "Ye post ka date nikal chuka hai ([date]). Draft karein ya reschedule?" |
| User says "koi bhi specific post" + gives title | Fetch all undrafted: `{ "status": "Scheduled_NoDraft", "channel": "linkedin", "limit": 10 }`, find by title match, present that one |

---

## Error Handling

**If the webhook call fails (network error / non-200 response):**
> "MongoDB se data lene mein dikkat aa rahi hai. Retry karta hoon..."

Retry once after 5 seconds. If it fails again:
> "sma-fetch-post webhook respond nahi kar raha. Satvik, n8n workflow active hai? (`SMA/Data/Read/FetchPostById` check karo)"

Do NOT proceed to B.2 if this call fails. The entire drafting workflow depends on having a post selected.

---

## What NOT to Do

- Do NOT show a list of posts and ask user to choose — auto-pick earliest, show one
- Do NOT proceed without user confirmation on the selected post
- Do NOT invent or hallucinate post data if the webhook returns empty
- Do NOT show raw JSON to the user — parse and format cleanly
- Do NOT allow drafting a post that already has status `Scheduled_Drafted` or later
- Do NOT modify the post status at this step — status change happens only in B.4

---

## Output for Next Step

Pass to **B.2**:
```
selected_post — full post object from webhook response:
  { _id, title, content, channel, content_pillar, scheduled_date, scheduled_time,
    status, scores, source_brief_id, linked_experiences, additional_context }
```
