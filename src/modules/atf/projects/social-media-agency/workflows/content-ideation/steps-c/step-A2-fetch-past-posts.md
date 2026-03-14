# Step A.2 — Fetch Past Posts

**Agent:** Content Strategist  
**Runs After:** A.1 (briefs fetched successfully)

---

## What You Do

Fetch the last 14 days of LinkedIn posts from MongoDB. You'll use this data to:
1. Calculate **Freshness scores** in A.6 (has this topic been covered recently?)
2. Identify **pillar gaps** (what content types are missing?)
3. Spot **top performers** (what worked well?)
4. Avoid **repeat topics** in the final selection

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-past-posts`

```json
{
  "days": 14,
  "channel": "linkedin"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "title": "...",
      "content_pillar": "career",
      "scheduled_date": "2026-03-10",
      "published_at": "2026-03-10T09:00:00Z",
      "metrics": {
        "likes": 42,
        "comments": 7,
        "shares": 3,
        "impressions": 1200
      },
      "status": "Published"
    }
  ]
}
```

---

## After the Call

Store the full `posts[]` array in working memory — you'll use it in A.6 for freshness scoring.

**Quick analysis (do this mentally, don't narrate all of it):**
- Which content pillars appeared in the last 14 days?
- Which topics were covered (for freshness comparison)?
- What are the top performers by impressions or likes?
- Are there any content pillars with zero posts? (gap opportunity)

**If posts.length > 0:**
> "14 din ke [N] posts mile. [X] career, [Y] startup, [Z] howto — chalo experiences bhi dekh lete hain!"

Then proceed to **A.3**.

**If posts.length === 0 (new account / clean slate):**
> "Koi past posts nahi mile — fresh start hai! Sab briefs ke freshness score 10 honge. Chalo next step!"

Note: All briefs will get freshness score 10 in this case. Proceed to A.3 normally.

---

## Error Handling

**If the webhook call fails:**
> "Past posts fetch karne mein issue aa raha hai."

Retry once after 5 seconds. If it fails again:
> "FetchPastPosts webhook respond nahi kar raha. `SMA/Data/Read/FetchPastPosts` n8n mein check karo."

Do NOT block the workflow if this fails — you can still proceed with empty past_posts and assume freshness = 10 for all briefs. But warn the user:
> "Past posts data nahi mila — freshness scores assume karenge ki sab topics fresh hain."

---

## What NOT to Do

- ❌ Do NOT score anything here — scoring happens in A.6
- ❌ Do NOT show a full table of past posts to the user unless they ask
- ❌ Do NOT filter out briefs based on past posts here — just collect data
- ❌ Do NOT request more than 14 days by default — the scoring config uses 14 days lookback

---

## Output for Next Step

Pass to **A.3**:
```
briefs[]     — from A.1 (unchanged)
past_posts[] — full array from this webhook response
```
