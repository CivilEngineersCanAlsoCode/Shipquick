---
name: content-ideation
description: Fetch briefs from Google Sheet, enrich with personal experiences, score using Fibonacci-weighted system, and produce a 3-day LinkedIn content schedule saved to MongoDB + Notion.
code: A
initWorkflow: './steps-c/step-A1-fetch-briefs.md'
---

# A — Content Ideation

**Goal:** Take raw topic briefs (from ChatGPT via Google Sheets), score them using personal experience + freshness + research quality, select the top 3, assign them to open calendar slots, and save to MongoDB + Notion.

**System:** This is a BMAD workflow — interactive, human-in-the-loop. The agent collaborates with the user at key decision points. ALL data reads and writes go through n8n webhooks. The agent has ZERO direct DB/API access.

**Scope:** LinkedIn only (v1)

---

## Steps

| Step | File | Description | Key Webhooks |
|------|------|-------------|--------------|
| A.1 | `step-A1-fetch-briefs.md` | Fetch new briefs from Google Sheet | `sma-fetch-briefs` |
| A.2 | `step-A2-fetch-past-posts.md` | Fetch last 14 days of LinkedIn posts | `sma-fetch-past-posts` |
| A.3 | `step-A3-fetch-experiences-preview.md` | Semantic search: top 1 experience per brief | `sma-search-experiences` |
| A.4 | `step-A4-load-scoring-config.md` | Load scoring weights + scales, ask user to confirm | `sma-fetch-config` |
| A.5 | `step-A5-update-scoring-config.md` | (Optional) Update scoring config if user wants changes | `sma-save-config` |
| A.6 | `step-A6-score-and-select.md` | Score all briefs locally, discard failures, present top N, user selects | `sma-update-sheet-status`, `sma-save-experience`, `sma-fetch-briefs` (loop) |
| A.7 | `step-A7-prioritize-and-schedule.md` | Check open slots, assign posts to dates, user confirms schedule | `sma-fetch-past-posts`, `sma-fetch-config` |
| A.8 | `step-A8-save.md` | Save to MongoDB + Notion + mark Sheet as Used | `sma-save-post`, `sma-save-to-notion`, `sma-update-sheet-status` |

---

## Flow Summary

```
User: "Let's brainstorm" / "Ideas do"
  │
  A.1 ──→ FetchBriefs → Google Sheet (status=New)
  A.2 ──→ FetchPastPosts → MongoDB (14 days)
  A.3 ──→ SearchExperiences → MongoDB (vector, top 1/brief)
  A.4 ──→ FetchConfig → MongoDB (scoring_weights, scoring_scales)
  │         └─ User confirms defaults? N → A.5 → SaveConfig
  A.6 ──→ Score locally (F×8 + P×5 + R×3, gate checks)
  │         ├─ UpdateSheetStatus (discarded)
  │         ├─ Present top N qualifying → user picks
  │         ├─ SaveExperience (if user shares story)
  │         ├─ UpdateSheetStatus (selected)
  │         └─ Loop? → re-fetch → re-score → re-present
  A.7 ──→ FetchPastPosts (3-day slots) + FetchConfig (posting_schedule)
  │         └─ User confirms schedule
  A.8 ──→ SavePost (MongoDB) + SaveToNotion + UpdateSheetStatus (Used)
            └─ Done → B-ContentDrafting or exit
```

---

## Webhook Reference

| n8n Workflow Name | Webhook URL | Used In |
|-------------------|-------------|---------|
| SMA/Data/Read/FetchBriefs | `https://n8n.linkright.in/webhook/sma-fetch-briefs` | A.1, A.6 (loop) |
| SMA/Data/Read/FetchPastPosts | `https://n8n.linkright.in/webhook/sma-fetch-past-posts` | A.2, A.6 (loop), A.7 |
| SMA/Data/Read/SearchExperiences | `https://n8n.linkright.in/webhook/sma-search-experiences` | A.3, A.6 (loop) |
| SMA/Data/Read/FetchConfig | `https://n8n.linkright.in/webhook/sma-fetch-config` | A.4, A.7 |
| SMA/Data/Write/SaveConfig | `https://n8n.linkright.in/webhook/sma-save-config` | A.5 |
| SMA/Data/Write/UpdateSheetStatus | `https://n8n.linkright.in/webhook/sma-update-sheet-status` | A.6 (discard + select), A.8 |
| SMA/Data/Write/SaveExperience | `https://n8n.linkright.in/webhook/sma-save-experience` | A.6 |
| SMA/Data/Write/SavePost | `https://n8n.linkright.in/webhook/sma-save-post` | A.8 |
| SMA/Data/Write/SaveToNotion | `https://n8n.linkright.in/webhook/sma-save-to-notion` | A.8 |

---

## Inputs
- Google Sheet: `ChatGPT Briefs` (status = New)
- MongoDB: `linkedin_posts`, `life_experiences`, `sma_config`
- User decisions at A.4, A.6, A.7

## Outputs
- Up to 3 LinkedIn posts saved to MongoDB (`linkedin_posts` collection, status: `Scheduled_NoDraft`)
- Same posts added to Notion Content Calendar (status: `Scheduled - No Draft`)
- Source briefs marked `Selected` then `Used` in Google Sheet
- New life experiences saved to MongoDB if shared by user
