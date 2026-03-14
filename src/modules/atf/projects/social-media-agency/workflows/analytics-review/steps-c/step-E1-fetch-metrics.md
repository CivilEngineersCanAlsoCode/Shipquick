# Step E.1 — Fetch Metrics

**Agent:** Content Strategist (Echo)
**Trigger:** User says something like "Analytics dekho", "Performance check karo", "Review karo", or starts the analytics-review workflow.

---

## What You Do

You kick off the analytics review by fetching engagement metrics for all published posts in the review period. The Chrome Extension has already been sending raw metrics to the `/sma-analytics-collect` webhook in the background — this step retrieves those stored metrics from MongoDB.

---

## Pre-Requisite: Chrome Extension Data Flow

The Chrome Extension (Manifest V3) runs as a background service worker. It passively reads the LinkedIn DOM when the user visits their post analytics page and sends metrics to n8n:

**Chrome Extension → POST** `https://n8n.linkright.in/webhook/sma-analytics-collect`

```json
{
  "post_urn": "urn:li:share:7654321",
  "likes": 42,
  "comments": 8,
  "shares": 3,
  "impressions": 1250,
  "collected_at": "2026-03-14T10:30:00Z"
}
```

**n8n workflow (`SMA/Analytics/Collect`):**
1. Find post in `linkedin_posts` by `linkedin_post_urn`
2. Update `engagement_metrics: { likes, comments, shares, impressions }`
3. Calculate `engagement_score = likes + (comments × 3) + (shares × 2)`
4. Save `metrics_collected_at` timestamp

> This happens automatically — step E.1 reads the already-stored data.

---

## Action 1: Determine Review Period

Ask the user:
> "Analytics review karte hain! Last week dekhein ya last month?"

Calculate date range based on response:
- **Last week:** `period_start = today - 7 days`, `period_end = today`
- **Last month:** `period_start = today - 30 days`, `period_end = today`
- **Custom:** If user specifies dates, use those

Store in session: `period_start`, `period_end`, `period_label`

---

## Action 2: Fetch Published Posts with Metrics

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "filter": "published_with_metrics",
  "period_start": "2026-03-07",
  "period_end": "2026-03-14"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "_id": "...",
      "title": "Why most developers hate meetings",
      "content_pillar": "career",
      "content_method": "Contrarian Take",
      "hook_framework": "Pattern Interrupt",
      "cta_framework": "Soft Ask",
      "tone_framework": "Conversational",
      "format_framework": "Staircase",
      "linkedin_post_urn": "urn:li:share:7654321",
      "published_at": "2026-03-10T09:15:00Z",
      "engagement_metrics": {
        "likes": 42,
        "comments": 8,
        "shares": 3,
        "impressions": 1250
      },
      "engagement_score": 72,
      "metrics_collected_at": "2026-03-11T10:30:00Z"
    }
  ]
}
```

---

## Action 3: Fetch Analytics Config

**POST** `https://n8n.linkright.in/webhook/sma-fetch-config`

```json
{
  "doc_id": "analytics_config"
}
```

**Expected Response:**
```json
{
  "engagement_formula": "likes + (comments * 3) + (shares * 2)",
  "min_data_points": 5,
  "review_cadence": "weekly",
  "last_review_date": "2026-03-07"
}
```

---

## After the Calls

**If posts.length > 0 AND posts have engagement_metrics:**
Store all posts in working memory. Tell the user:
> "Chalo! [N] published posts mile [period_label] ke liye. Sab ke metrics aa gaye hain. Aggregation shuru karta hoon."

Proceed to **E.2**.

**If posts.length > 0 BUT some posts lack engagement_metrics:**
Flag the posts missing metrics. Tell the user:
> "[X] posts ke metrics abhi nahi aaye. Chrome Extension se LinkedIn analytics page visit karo, phir wapas aao. Baaki [Y] posts ke saath proceed karein?"

If user says yes, proceed with available data. If no, halt and wait.

**If posts.length === 0:**
Do NOT proceed. Tell the user:
> "Is period mein koi published post nahi mila. Pehle D-Publishing se posts publish karo, ya review period change karo."

---

## Error Handling

**If `/sma-fetch-post` fails (network error / non-200):**
> "Posts fetch karne mein dikkat aa rahi hai. Thodi der mein retry karta hoon."

Retry once after 5 seconds. If it fails again:
> "n8n respond nahi kar raha. Satvik, `SMA/Data/Read/FetchPost` workflow check karo — active hai?"

**If `/sma-fetch-config` fails:**
Use default config (formula: `likes + comments*3 + shares*2`, min_data_points: 5). Notify user:
> "Config load nahi hua, default formula use kar raha hoon."

Do NOT proceed to E.2 if post fetch fails. Config failure is non-blocking.

---

## What NOT to Do

- ❌ Do NOT invent or hallucinate metrics — always use webhook data
- ❌ Do NOT call the LinkedIn API directly — Chrome Extension handles collection
- ❌ Do NOT proceed without at least 1 post with metrics
- ❌ Do NOT show raw JSON to the user — summarize in Hinglish
- ❌ Do NOT recalculate engagement_score here — it was calculated in the n8n collection workflow
- ❌ Do NOT skip the period selection — always ask the user

---

## Success Criteria

- [ ] User selected review period (week/month/custom)
- [ ] All published posts for the period fetched from MongoDB
- [ ] Posts with missing metrics flagged to user
- [ ] Analytics config loaded (or defaults applied)
- [ ] Posts array stored in working memory for E.2

---

## Output for Next Step

Pass to **E.2**:
```
posts[]            — array of post objects with engagement_metrics
period_start       — review period start date
period_end         — review period end date
period_label       — "last week" / "last month" / custom
analytics_config   — scoring config (from webhook or defaults)
```
