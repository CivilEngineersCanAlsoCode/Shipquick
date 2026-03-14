# Step A.3 — Fetch Life Experiences Preview

**Agent:** Content Strategist  
**Runs After:** A.2 (past posts fetched)

---

## What You Do

For each brief, find the single best-matching personal life experience from the MongoDB `life_experiences` collection using vector/semantic search. This is a **preview fetch** — just the top 1 match per brief.

This serves two purposes:
1. **Scoring input for A.6** — the similarity score becomes the Personal Experience (P) score
2. **Context for presentation** — show a hook from real life to make ideas more compelling

---

## Action: Call n8n Webhook

Build the `queries` array using the `topic` field from each brief.

**POST** `https://n8n.linkright.in/webhook/sma-search-experiences`

```json
{
  "queries": ["topic from brief 1", "topic from brief 2", "topic from brief 3"],
  "limit": 1,
  "min_similarity": 0.3
}
```

> Use all brief topics as queries in a single call — don't call this webhook once per brief.

**Expected Response:**
```json
{
  "results": [
    {
      "query": "topic from brief 1",
      "matches": [
        {
          "_id": "...",
          "date": "2026-02-15",
          "text": "The time I presented to the CTO and froze mid-sentence...",
          "similarity_score": 0.82,
          "tags": ["public speaking", "career"]
        }
      ]
    },
    {
      "query": "topic from brief 2",
      "matches": []
    }
  ]
}
```

Note: `matches` can be empty if no experience scores above `min_similarity: 0.3`. That's fine — that brief will get P score = 0.

---

## After the Call

Map results back to briefs:
- For each brief, find the matching result by `query === brief.topic`
- If `matches.length > 0`: store `matches[0]` as the experience preview for that brief
- If `matches.length === 0`: mark experience as `null` for that brief

Store this enriched data as `briefs_with_experiences[]` in working memory.

Tell the user:
> "Experiences dhundh liye! [M] briefs mein personal stories milein, [K] mein nahi. Chalo scoring config dekh lete hain."

Then proceed to **A.4**.

---

## Error Handling

**If the webhook call fails:**
> "Experience search nahi ho paya."

Retry once after 5 seconds. If it fails again:
> "`SMA/Data/Read/SearchExperiences` webhook check karo — vector search shayad down hai."

Do NOT block the workflow if this fails. Proceed with P scores = 0 for all briefs. Warn the user:
> "Personal experience data nahi mila — P scores 0 maane jayenge sab ke liye. Config mein minimum thresholds dhyan rakho."

---

## What NOT to Do

- ❌ Do NOT call this webhook once per brief — always send all topics in a single `queries` array
- ❌ Do NOT show the full experience text to the user at this stage — just note that matches were found
- ❌ Do NOT discard any brief here based on low similarity — that's A.6's job
- ❌ Do NOT fetch more than 1 match per brief here (limit: 1) — this is a preview, not full enrichment

---

## Output for Next Step

Pass to **A.4**:
```
briefs[]                — original briefs from A.1
past_posts[]            — from A.2
briefs_with_experiences[] — each brief enriched with:
                           { ...brief, experience_preview: { _id, date, text, similarity_score, tags } | null }
```
