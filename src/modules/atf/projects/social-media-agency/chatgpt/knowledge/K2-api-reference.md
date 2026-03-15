# K2 — API Reference

Base URL: `https://n8n.linkright.in`
All endpoints: `POST` method, JSON body, JSON response.

---

## 1. submitBrief
**URL:** `/webhook/sma-submit-brief`
**Purpose:** Add a new content topic brief to Google Sheet

**Request Body:**
```json
{
  "topic": "string (required)",
  "research_data": "string — stats, data points",
  "why_relevant": "string — relevance to audience",
  "target_audience": "string",
  "reference_links": "string — comma-separated URLs",
  "has_stats": "TRUE|FALSE",
  "has_quotes": "TRUE|FALSE",
  "has_trend": "TRUE|FALSE",
  "has_data": "TRUE|FALSE"
}
```

**Response:** `{"success": true}`

---

## 2. fetchBriefs
**URL:** `/webhook/sma-fetch-briefs`
**Purpose:** Get briefs from Google Sheet filtered by status

**Request Body:**
```json
{
  "status": "New|Planned|Used|Discarded (default: New)"
}
```

**Response:** Array of brief objects with topic, research_data, why_relevant, target_audience, row_id, status

---

## 3. fetchPastPosts
**URL:** `/webhook/sma-fetch-past-posts`
**Purpose:** Get recent LinkedIn posts from MongoDB

**Request Body:**
```json
{
  "days": 14,
  "channel": "linkedin"
}
```

**Response:** Array of post objects with title, content_pillar, published_at, metrics

---

## 4. searchExperiences
**URL:** `/webhook/sma-search-experiences`
**Purpose:** Vector search through life experiences (3072-dim cosine, threshold 0.80)

**Request Body:**
```json
{
  "queries": ["query1", "query2"],
  "limit": 3
}
```

**Response:** Results grouped by query, each with text, similarity_score, date, tags, category

---

## 5. fetchConfig
**URL:** `/webhook/sma-fetch-config`
**Purpose:** Fetch scoring/schedule/analytics configuration

**Request Body:**
```json
{
  "doc_ids": ["scoring_weights", "scoring_scales", "posting_schedule"]
}
```
Empty doc_ids = fetch all config documents.

**Response:** Config documents keyed by _id

**Known doc_ids:** scoring_weights, scoring_scales, posting_schedule, formatting_config, engagement_config, review_config, analytics_config

---

## 6. saveConfig
**URL:** `/webhook/sma-save-config`
**Purpose:** Update config in MongoDB

**Request Body:**
```json
{
  "configs": [
    {
      "_id": "scoring_weights",
      "weights": {"freshness": 8, "personal_experience": 5, "research_quality": 3},
      "top_n": 5,
      "lookback_days": 14,
      "updated_by": "chatgpt"
    }
  ]
}
```

**Response:** `{"success": true, "updated": N}`

---

## 7. updateSheetStatus
**URL:** `/webhook/sma-update-sheet-status`
**Purpose:** Update brief status and scores in Google Sheet

**Request Body:**
```json
{
  "updates": [
    {
      "row_id": "string (required)",
      "status": "New|Planned|Used|Discarded",
      "scores": "F:8 P:7 R:6 T:131",
      "reason": "string"
    }
  ]
}
```

**Response:** `{"success": true, "updated_count": N}`

---

## 8. saveExperience
**URL:** `/webhook/sma-save-experience`
**Purpose:** Save life experience with auto-generated vector embedding

**Request Body:**
```json
{
  "experiences": [
    {
      "text": "string (required) — English for best accuracy",
      "date": "YYYY-MM-DD",
      "tags": "comma-separated",
      "category": "career|academic|mentorship|startup|personal"
    }
  ]
}
```

**Response:** `{"success": true, "inserted_count": N}`

**Note:** Text should be in English. Romanised Hindi reduces vector search accuracy by 15-25%.

---

## 9. savePost
**URL:** `/webhook/sma-save-post`
**Purpose:** Save a new post to MongoDB

**Request Body:**
```json
{
  "post": {
    "title": "string (required)",
    "content": "string (required)",
    "content_pillar": "string",
    "scheduled_date": "YYYY-MM-DD",
    "scheduled_time": "09:00",
    "status": "Draft|Ready|Published (default: Draft)",
    "scores": {"freshness": 8, "personal_experience": 7, "research_quality": 6, "total": 131}
  }
}
```

**Response:** `{"success": true, "post_id": "..."}`

---

## 10. fetchPost
**URL:** `/webhook/sma-fetch-post`
**Purpose:** Fetch posts by ID or filters

**Request Body:**
```json
{
  "post_id": "string — fetch specific post",
  "status": "Draft|Drafted|Formatting|Previewed|Ready_ToPublish|Published",
  "channel": "linkedin",
  "limit": 10,
  "days": 14,
  "scheduled_date": "YYYY-MM-DD"
}
```

**Response:**
- If post_id: single post object
- If filters: `{"posts": [...], "count": N}`

---

## 11. updatePost
**URL:** `/webhook/sma-update-post`
**Purpose:** Update post fields (merge into existing document)

**Request Body:**
```json
{
  "post_id": "string (required)",
  "updates": {
    "status": "Previewed",
    "content": "updated content...",
    "formatted_content": "...",
    "frameworks_used": {"format": "CF01", "hook": "HK03"}
  }
}
```

**Response:** `{"success": true, "post_id": "...", "updated_fields": [...]}`

---

## 12. publishLinkedIn
**URL:** `/webhook/sma-publish-linkedin`
**Purpose:** Publish to LinkedIn. ONE SHOT — NO RETRY.

**Request Body:**
```json
{
  "post_id": "string (required)",
  "content": "string (required) — exact approved content"
}
```

**Response (success):** `{"success": true, "linkedin_post_urn": "...", "linkedin_post_url": "..."}`
**Response (failure):** `{"success": false, "error": "..."}`

**CRITICAL:** Do NOT retry on failure. Do NOT modify content before sending.

---

## 13. notifyTelegram
**URL:** `/webhook/sma-notify-telegram`
**Purpose:** Send notification to SMA Control Group

**Request Body:**
```json
{
  "message": "string (required)"
}
```

**Response:** `{"success": true, "message_id": "..."}`

---

## 14. collectAnalytics
**URL:** `/webhook/sma-analytics-collect`
**Purpose:** Submit metrics for published posts. Appends to metrics_history array.

**Request Body:**
```json
{
  "posts": [
    {
      "post_url": "string (required) — LinkedIn post URL",
      "likes": 42,
      "comments": 5,
      "shares": 3,
      "impressions": 1200,
      "follower_count": 850
    }
  ]
}
```

**Response:** `{"success": true, "processed": N, "skipped": M}`

**Collection schedule:** Day 1, 3, 7, 14, 30 after publishing.
**Sources:** JS DevTools snippet or manual entry via this endpoint.

---

## Error Handling

All endpoints may return:
```json
{"success": false, "error": "error message"}
```

Common errors:
- Missing required fields
- Invalid post_id (not found)
- Duplicate publish attempt (post already Published)
- Google Sheet API rate limit
- LinkedIn API error (on publish)

On error: display the error message to Satvik and suggest next steps. Never silently retry.
