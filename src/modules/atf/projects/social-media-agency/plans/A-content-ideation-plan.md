# A-ContentIdeation — Detailed Implementation Plan

> **Version:** 1.0
> **Created:** 2026-03-13
> **Status:** Planning → Ready for Build
> **Scope:** LinkedIn only (v1)

---

## 1. Overview

Content Ideation is the first BMAD workflow in the SMA module. It takes raw topic briefs (from ChatGPT via Google Sheets), enriches them with personal experiences (MongoDB vector search), scores them using a configurable Fibonacci-weighted system, and produces a 3-day content schedule saved to MongoDB + Notion.

### Architecture Rules
- **Claw (BMAD agent) has ZERO direct DB/API access**
- ALL reads and writes go through n8n webhook-triggered workflows
- n8n workflows built manually by user (Claw provides full node config)
- MongoDB = user's own data | Google Sheets = external/temporary | Notion = view-only display

---

## 2. Data Architecture

### 2.1 MongoDB Collections

#### `linkedin_posts`
```json
{
  "_id": ObjectId,
  "title": "string",
  "content": "string | null",
  "channel": "linkedin",
  "content_pillar": "career | pm | startup | hottake | howto",
  "scheduled_date": "2026-03-17",
  "scheduled_time": "09:00",
  "timezone": "Asia/Kolkata",
  "status": "Scheduled_NoDraft | Scheduled_Drafted | Published | Cancelled",
  "scores": {
    "freshness": 9,
    "personal_experience": 10,
    "research_quality": 7,
    "total": 143,
    "max_possible": 160
  },
  "source_brief_id": "string (Google Sheet row ID)",
  "linked_experiences": ["ObjectId"],
  "additional_context": "string | null",
  "draft_content": "string | null",
  "metrics": {
    "likes": 0,
    "comments": 0,
    "shares": 0,
    "impressions": 0
  },
  "created_at": ISODate,
  "updated_at": ISODate,
  "published_at": "ISODate | null"
}
```

#### `life_experiences`
```json
{
  "_id": ObjectId,
  "date": "2026-03-13",
  "text": "string (full experience text)",
  "embedding": "[float array] (vector for semantic search)",
  "tags": ["string"],
  "category": "string | null",
  "source": "lifeos | user_shared_during_ideation | manual",
  "created_at": ISODate
}
```

#### `sma_config`
Two documents in this collection:

**Document 1: `scoring_weights`**
```json
{
  "_id": "scoring_weights",
  "version": 1,
  "weights": {
    "freshness": 8,
    "personal_experience": 5,
    "research_quality": 3
  },
  "thresholds": {
    "individual_minimum": {
      "freshness": 5,
      "personal_experience": 3,
      "research_quality": 2
    },
    "total_minimum_percent": 50
  },
  "max_score_per_factor": 10,
  "top_n": 3,
  "lookback_days": 14,
  "updated_at": ISODate,
  "updated_by": "system | user",
  "previous_versions": []
}
```

**Document 2: `scoring_scales`**
```json
{
  "_id": "scoring_scales",
  "version": 1,
  "freshness_scale": {
    "rules": [
      { "condition": "no_match_in_lookback", "score": 10 },
      { "condition": "match_older_than_days", "days": 10, "score": 7 },
      { "condition": "match_older_than_days", "days": 5, "score": 4 },
      { "condition": "match_older_than_days", "days": 3, "score": 1 },
      { "condition": "exact_match_recent", "score": 0 }
    ]
  },
  "personal_experience_scale": {
    "rules": [
      { "condition": "similarity_above", "threshold": 0.9, "score": 10 },
      { "condition": "similarity_above", "threshold": 0.7, "score": 7 },
      { "condition": "similarity_above", "threshold": 0.5, "score": 4 },
      { "condition": "similarity_above", "threshold": 0.3, "score": 1 },
      { "condition": "below_all", "score": 0 }
    ]
  },
  "research_quality_scale": {
    "rules": [
      { "condition": "has_all", "fields": ["stats", "quotes", "trend", "data"], "score": 10 },
      { "condition": "has_min", "count": 3, "score": 7 },
      { "condition": "has_min", "count": 2, "score": 4 },
      { "condition": "has_min", "count": 1, "score": 1 },
      { "condition": "empty", "score": 0 }
    ]
  },
  "updated_at": ISODate,
  "previous_versions": []
}
```

**Document 3: `posting_schedule`**
```json
{
  "_id": "posting_schedule",
  "default_posting_time": "09:00",
  "timezone": "Asia/Kolkata",
  "platform_defaults": {
    "linkedin": "09:00"
  },
  "day_preferences": {
    "mon": "story_insight",
    "tue": "story_insight",
    "wed": "story_insight",
    "thu": "howto_framework",
    "fri": "light_hottake"
  },
  "updated_at": ISODate
}
```

### 2.2 Google Sheet Structure

**Sheet Name:** `ChatGPT Briefs`

| Column | Type | Description |
|--------|------|-------------|
| A: row_id | string | Unique ID (auto/manual) |
| B: topic | string | Topic / Title |
| C: research_data | string | Stats, quotes, trends |
| D: why_relevant | string | Why this topic now |
| E: target_audience | string | Who this is for |
| F: reference_links | string | URLs, sources |
| G: has_stats | boolean | Research quality field |
| H: has_quotes | boolean | Research quality field |
| I: has_trend | boolean | Research quality field |
| J: has_data | boolean | Research quality field |
| K: status | string | New / Discarded / Selected / Used |
| L: reason | string | Why discarded (if applicable) |
| M: scores | string | JSON: {F, P, R, total} |
| N: created_at | datetime | When brief was added |
| O: updated_at | datetime | Last status change |

**Statuses:** `New` → `Discarded` | `Selected` → `Used`

### 2.3 Notion Content Calendar

**Database ID:** `cc01482c-cd34-83ac-81a8-013e4d767924`

Properties used (write-only, view layer):
- 📌 Content Title → title
- Main Channel → select: "LinkedIn"
- 📅 Go Live Date → date
- Status → select: "Scheduled - No Draft"
- Content Pillar → select
- ✅ Uploaded to channel → checkbox: false

---

## 3. n8n Webhook Workflows (Content Ideation)

### 3.1 Unique Workflows Needed

| # | n8n Workflow Name | Webhook Path | Type | Used In |
|---|-------------------|--------------|------|---------|
| 1 | SMA/Data/Read/FetchBriefs | /sma-fetch-briefs | READ | A.1.a, A.6.d |
| 2 | SMA/Data/Read/FetchPastPosts | /sma-fetch-past-posts | READ | A.2.a, A.6.e, A.7.a |
| 3 | SMA/Data/Read/SearchExperiences | /sma-search-experiences | READ | A.3.a, A.6.f |
| 4 | SMA/Data/Read/FetchConfig | /sma-fetch-config | READ | A.4.a, A.7.b |
| 5 | SMA/Data/Write/SaveConfig | /sma-save-config | WRITE | A.5.a |
| 6 | SMA/Data/Write/UpdateSheetStatus | /sma-update-sheet-status | WRITE | A.6.a, A.6.c, A.8.c |
| 7 | SMA/Data/Write/SaveExperience | /sma-save-experience | WRITE | A.6.b |
| 8 | SMA/Data/Write/SavePost | /sma-save-post | WRITE | A.8.a |
| 9 | SMA/Data/Write/SaveToNotion | /sma-save-to-notion | WRITE | A.8.b |

**9 unique n8n workflows** for content ideation.

### 3.2 Webhook Payloads

#### 1. FetchBriefs (READ)
```
POST /sma-fetch-briefs
Request: { "status": "New" }
Response: { "briefs": [ { row_id, topic, research_data, why_relevant, target_audience, reference_links, has_stats, has_quotes, has_trend, has_data, created_at } ] }
```

#### 2. FetchPastPosts (READ)
```
POST /sma-fetch-past-posts
Request: { "days": 14, "channel": "linkedin" }
Response: { "posts": [ { title, content_pillar, scheduled_date, published_at, metrics, status } ] }
```

#### 3. SearchExperiences (READ)
```
POST /sma-search-experiences
Request: { "queries": ["topic1", "topic2"], "limit": 1, "min_similarity": 0.3 }
Response: { "results": [ { query, matches: [ { _id, date, text, similarity_score, tags } ] } ] }
```

#### 4. FetchConfig (READ)
```
POST /sma-fetch-config
Request: { "doc_ids": ["scoring_weights", "scoring_scales"] }
Response: { "scoring_weights": {...}, "scoring_scales": {...} }
```

#### 5. SaveConfig (WRITE)
```
POST /sma-save-config
Request: { "doc_id": "scoring_weights", "data": {...}, "updated_by": "user" }
Response: { "success": true, "version": 2 }
```

#### 6. UpdateSheetStatus (WRITE)
```
POST /sma-update-sheet-status
Request: { 
  "action": "update_status",  // or "mark_selected" or "mark_used"
  "rows": [ { "row_id": "x", "status": "Discarded", "reason": "F=4 < 5", "scores": {...} } ]
}
Response: { "success": true, "updated": 2 }
```

#### 7. SaveExperience (WRITE)
```
POST /sma-save-experience
Request: { "date": "2026-03-13", "text": "...", "tags": ["topic"], "source": "user_shared_during_ideation", "generate_embedding": true }
Response: { "success": true, "_id": "ObjectId" }
```

#### 8. SavePost (WRITE)
```
POST /sma-save-post
Request: {
  "title": "...",
  "channel": "linkedin",
  "content_pillar": "career",
  "scheduled_date": "2026-03-17",
  "scheduled_time": "09:00",
  "timezone": "Asia/Kolkata",
  "status": "Scheduled_NoDraft",
  "scores": { "freshness": 9, "personal_experience": 10, "research_quality": 7, "total": 143 },
  "source_brief_id": "row_id",
  "linked_experiences": ["exp_id"],
  "additional_context": "..."
}
Response: { "success": true, "_id": "ObjectId" }
```

#### 9. SaveToNotion (WRITE)
```
POST /sma-save-to-notion
Request: {
  "database_id": "cc01482c-cd34-83ac-81a8-013e4d767924",
  "title": "...",
  "channel": "LinkedIn",
  "go_live_date": "2026-03-17",
  "status": "Scheduled - No Draft",
  "content_pillar": "Career"
}
Response: { "success": true, "page_id": "..." }
```

---

## 4. BMAD Workflow Steps — Complete Execution Flow

### A.1 — Fetch New Briefs
```
Agent: Content Strategist
Trigger: User says "Let's brainstorm" / "Ideas do" / starts ideation
n8n call: A.1.a → SMA/Data/Read/FetchBriefs
Input: { "status": "New" }
Output: List of unprocessed briefs from Google Sheet
Next: A.2
```

### A.2 — Fetch Past Posts
```
Agent: Content Strategist
n8n call: A.2.a → SMA/Data/Read/FetchPastPosts
Input: { "days": 14, "channel": "linkedin" }
Output: Recent posts with titles, pillars, dates, metrics
Analysis: Pillar distribution, gaps, top performers, topics to avoid
Next: A.3
```

### A.3 — Fetch Life Experiences Preview
```
Agent: Content Strategist
n8n call: A.3.a → SMA/Data/Read/SearchExperiences
Input: { "queries": [brief1.topic, brief2.topic, ...], "limit": 1, "min_similarity": 0.3 }
Output: Top 1 experience match per brief (preview only)
Purpose: Enrich briefs with personal experience hooks for better selection
Next: A.4
```

### A.4 — Load Scoring Config
```
Agent: Content Strategist
n8n call: A.4.a → SMA/Data/Read/FetchConfig
Input: { "doc_ids": ["scoring_weights", "scoring_scales"] }
Output: Current weights, thresholds, scales
Present: Summary to user — "Defaults se chalein? (Y/N)"
  Y (default) → A.6
  N → A.5
Next: A.5 or A.6
```

### A.5 — Update Scoring Config (Optional)
```
Agent: Content Strategist
Trigger: Only if user said N in A.4
User selects what to change:
  1. Weights (must be Fibonacci: 1,2,3,5,8,13,21)
  2. Individual minimum thresholds (0-10)
  3. Total minimum percentage (20%-80%)
  4. Scoring scale rules
  5. Top N count
  6. Lookback days
Validation: Fibonacci check, range check, logical consistency
n8n call: A.5.a → SMA/Data/Write/SaveConfig
Input: { "doc_id": "scoring_weights", "data": {...}, "updated_by": "user" }
Output: Config saved with version increment
Next: A.6
```

### A.6 — Score & Select
```
Agent: Content Strategist
Sub-steps:

A.6 SCORING (Claw computes locally using config from A.4):
  For each brief:
    F = Freshness score (compare against A.2 past posts, apply freshness_scale rules)
    P = Personal Experience score (from A.3 similarity, apply experience_scale rules)
    R = Research Quality score (from brief fields, apply research_scale rules)
    
    Gate checks:
      F < individual_minimum.freshness → DISCARD
      P < individual_minimum.personal_experience → DISCARD
      R < individual_minimum.research_quality → DISCARD
      Total = (F × weight_F) + (P × weight_P) + (R × weight_R)
      Total < (max × total_minimum_percent) → DISCARD
  
  Sort qualifying by Total descending
  Take top N

A.6.a — Mark discarded in Google Sheet:
  n8n call: SMA/Data/Write/UpdateSheetStatus
  Input: { "action": "update_status", "rows": [{ row_id, status: "Discarded", reason, scores }] }

A.6.b — Present qualifying ideas (max top_n, no discarded shown):
  Show: rank, title, F/P/R scores with weights, experience preview
  
A.6.c — User additional context:
  If user shares stories → save via n8n:
  n8n call: SMA/Data/Write/SaveExperience
  Input: { date, text, tags, source: "user_shared_during_ideation", generate_embedding: true }

A.6.d — User decision loop:
  Ask: "Proceed karna hai in [X] posts ke saath?"
  
  "Haan, proceed" (X ≥ 1):
    n8n call: SMA/Data/Write/UpdateSheetStatus
    Input: { "action": "mark_selected", "rows": [{ row_id, status: "Selected" }] }
    → A.7
    
  "Ye hata do [specific]":
    Remove from list
    If remaining ≥ 1 → re-ask
    If remaining = 0 → A.6.e
    
  "Aur ideas chahiye" → A.6.e

A.6.e — Fetch more briefs (loop):
  Ask user to add new briefs to Google Sheet
  User confirms "Done"
  
  n8n calls:
    A.6.d → SMA/Data/Read/FetchBriefs (new rows only)
    A.6.e → SMA/Data/Read/FetchPastPosts (re-check)
    A.6.f → SMA/Data/Read/SearchExperiences (new briefs)
  
  Re-score, merge with any confirmed, back to A.6.b
  Max 3 total always

Next: A.7 (when user confirms ≥ 1 post)
```

### A.7 — Prioritize & Schedule
```
Agent: Content Strategist
Sub-steps:

A.7.a — Check open slots:
  n8n call: SMA/Data/Read/FetchPastPosts
  Input: { "days": 3, "channel": "linkedin", "include_scheduled": true }
  Output: Which of next 3 days already have posts

A.7.b — Load posting config:
  n8n call: SMA/Data/Read/FetchConfig
  Input: { "doc_ids": ["posting_schedule"] }
  Output: Default time, day preferences

Assignment logic:
  - Highest scored post → earliest open slot
  - Content pillar balance (don't put same pillar back-to-back)
  - Day-of-week preference matching (career on Mon/Tue, hottake on Fri)
  - Flag conflicts: "Dono career posts back-to-back, swap karein?"

Present: "📅 Suggested Schedule: [Day 1: X, Day 2: Y, Day 3: Z]"
User: Confirm / Shuffle / Remove post / Change time

Next: A.8 (when user confirms schedule)
```

### A.8 — Save
```
Agent: Content Strategist
Sub-steps:

A.8.a — Save to MongoDB (for each confirmed post):
  n8n call: SMA/Data/Write/SavePost
  Input: { title, channel, content_pillar, scheduled_date, scheduled_time, timezone, 
           status: "Scheduled_NoDraft", scores, source_brief_id, linked_experiences, additional_context }

A.8.b — Save to Notion (for each confirmed post):
  n8n call: SMA/Data/Write/SaveToNotion
  Input: { database_id, title, channel: "LinkedIn", go_live_date, status: "Scheduled - No Draft", content_pillar }

A.8.c — Mark briefs as used in Google Sheet:
  n8n call: SMA/Data/Write/UpdateSheetStatus
  Input: { "action": "mark_used", "rows": [{ row_id, status: "Used", used_for, scheduled_date }] }

A.8.d — Final summary & next actions:
  Show: Schedule summary, save confirmations
  Options: "Draft karna hai" → B-ContentDrafting | "Baad mein" → exit | "Aur ideas" → restart A.1
```

---

## 5. Scoring System — Complete Reference

### Formula
```
Total = (F × 8) + (P × 5) + (R × 3)
Max possible = (10 × 8) + (10 × 5) + (10 × 3) = 160
Min required = 160 × 50% = 80
```

### Weights (Fibonacci)
| Factor | Weight | Rationale |
|--------|--------|-----------|
| Freshness | 8 | Repeat content kills reach — most important |
| Personal Experience | 5 | Authenticity drives engagement |
| Research Quality | 3 | Supports but doesn't carry alone |

### Individual Minimums (Fibonacci)
| Factor | Min Score | Rationale |
|--------|-----------|-----------|
| Freshness | 5/10 | Highest weight = strictest gate |
| Personal Experience | 3/10 | Moderate — not every post needs direct story |
| Research Quality | 2/10 | Lenient — strong story can compensate |

### Scoring Scales
All configurable in MongoDB `sma_config.scoring_scales`. See Section 2.1 for full schema.

---

## 6. Execution Flow Diagram

```
User: "Let's brainstorm"
│
├─ A.1 ──[A.1.a]──→ n8n: FetchBriefs ──→ Google Sheet (New rows)
│
├─ A.2 ──[A.2.a]──→ n8n: FetchPastPosts ──→ MongoDB (14 days)
│
├─ A.3 ──[A.3.a]──→ n8n: SearchExperiences ──→ MongoDB (vector, top 1/brief)
│
├─ A.4 ──[A.4.a]──→ n8n: FetchConfig ──→ MongoDB (sma_config)
│   └─ "Change config?" → N: skip │ Y: A.5
│
├─ A.5 ──[A.5.a]──→ n8n: SaveConfig ──→ MongoDB (version++)
│
├─ A.6 ── Score locally (Claw computes using fetched data)
│   ├─[A.6.a]──→ n8n: UpdateSheetStatus (discarded)
│   ├─ Present top N qualifying
│   ├─[A.6.b]──→ n8n: SaveExperience (if user shares)
│   ├─[A.6.c]──→ n8n: UpdateSheetStatus (selected)
│   └─ Loop? ──→ [A.6.d,e,f] re-fetch → re-score → re-present
│
├─ A.7 ──[A.7.a]──→ n8n: FetchPastPosts (3-day slots)
│   └──[A.7.b]──→ n8n: FetchConfig (posting_schedule)
│   └─ User confirms schedule
│
└─ A.8 ──[A.8.a]──→ n8n: SavePost (MongoDB)
    ├──[A.8.b]──→ n8n: SaveToNotion
    ├──[A.8.c]──→ n8n: UpdateSheetStatus (mark used)
    └── Done! → B-ContentDrafting or exit
```

---

## 7. n8n Webhook Calls — Per Run Estimate

| Scenario | n8n Calls | Notes |
|----------|-----------|-------|
| Happy path (3 posts, no loops) | 12 | A.1.a + A.2.a + A.3.a + A.4.a + A.6.a + A.6.c + A.7.a + A.7.b + A.8.a×3 + A.8.b×3 + A.8.c = ~14 |
| With config update | +1 | A.5.a |
| With user experience share | +1 per story | A.6.b |
| With fetch-more loop | +3 per loop | A.6.d + A.6.e + A.6.f |
| Minimum (1 post, no extras) | 10 | Simplest path |

---

## 8. Dependencies & Prerequisites

### Must Exist Before Testing
1. [ ] MongoDB installed & running (Community Edition with vector search)
2. [ ] Collections created: `linkedin_posts`, `life_experiences`, `sma_config`
3. [ ] Initial config documents seeded in `sma_config`
4. [ ] Google Sheet created with correct column structure
5. [ ] ChatGPT Custom GPT → webhook → n8n → Sheet pipeline working
6. [ ] All 9 n8n webhook workflows built & active
7. [ ] Notion Content Calendar database accessible via API
8. [ ] n8n MongoDB credential configured
9. [ ] n8n Google Sheets credential configured
10. [ ] n8n Notion credential configured (existing: `jNM93JOubt5pzUSY`)

### Credentials Needed in n8n
| Credential | For | Status |
|------------|-----|--------|
| MongoDB (self-hosted) | Read/Write collections | ❌ Need to create |
| Google Sheets (klickbae) | Read/Write briefs | ✅ `nooATe2brHQ30q1R` |
| Notion API | Write calendar entries | ✅ `jNM93JOubt5pzUSY` |
| Gemini | Embedding generation | ✅ `vO57Q4qeSYe6Bj4A` |

---

## 9. Testing Plan

### Phase 1: Infrastructure
1. Install MongoDB Community Edition
2. Create database: `sma`
3. Create collections with indexes
4. Seed `sma_config` with default documents
5. Create Google Sheet with correct structure
6. Add 5 dummy briefs to Sheet

### Phase 2: n8n Workflows (build & test one by one)
1. SMA/Data/Read/FetchBriefs — test with dummy Sheet data
2. SMA/Data/Read/FetchPastPosts — test with empty collection (should return empty)
3. SMA/Data/Read/SearchExperiences — test with empty collection
4. SMA/Data/Read/FetchConfig — test with seeded config
5. SMA/Data/Write/SaveConfig — test config update + version increment
6. SMA/Data/Write/UpdateSheetStatus — test status change in Sheet
7. SMA/Data/Write/SaveExperience — test insert + embedding generation
8. SMA/Data/Write/SavePost — test insert to linkedin_posts
9. SMA/Data/Write/SaveToNotion — test page creation in calendar

### Phase 3: End-to-End
1. Add real briefs via ChatGPT Custom GPT
2. Run content-ideation workflow through Claw
3. Verify all n8n calls succeed
4. Verify MongoDB documents created correctly
5. Verify Notion calendar updated
6. Verify Google Sheet statuses updated

---

## 10. File References

| File | Path |
|------|------|
| This plan | `plans/A-content-ideation-plan.md` |
| Project plan | `project-plan.md` |
| Requirement brief | `requirement-brief.md` |
| BMAD workflow | `workflows/content-ideation/workflow.md` |
| Step files | `workflows/content-ideation/steps-c/` |

---

## 11. Naming Convention Reference

```
Tier 1 (BMAD Workflow): Letter    → A, B, C...
Tier 2 (Step):          Number    → 1, 2, 3...
Tier 3 (n8n Call):      Lowercase → a, b, c...

Format: A.1.a

BMAD Workflows:
  A — SMA/Workflows/A-ContentIdeation
  B — SMA/Workflows/B-ContentDrafting
  C — SMA/Workflows/C-ContentReview
  D — SMA/Workflows/D-ContentPlanning
  E — SMA/Workflows/E-AnalyticsReview

n8n Workflow Names: Clean names, execution codes in description field.
  Name: SMA/Data/Read/FetchBriefs
  Description: "Used in: A.1.a, A.6.d"
```
