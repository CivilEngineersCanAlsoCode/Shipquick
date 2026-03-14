---
name: content-publishing
description: Fetch posts in Ready_ToPublish status, publish to LinkedIn with random delay and duplicate guard, update status to Published, notify team via Telegram.
code: D
initWorkflow: './steps-c/step-D1-fetch-ready-posts.md'
---

# D — Content Publishing

**Goal:** Take posts that have passed review (status = `Ready_ToPublish`), publish them to LinkedIn with safety guardrails (duplicate guard, random delay, one-shot rule), update their status to `Published`, and notify the team via Telegram.

**System:** This is a BMAD workflow — semi-automated. The agent executes each step, but the user confirms before the actual LinkedIn publish. ALL data reads and writes go through n8n webhooks. The agent has ZERO direct DB/API access.

**Scope:** LinkedIn only (v1). Max 1 post/day.

---

## Steps

| Step | File | Description | Key Webhooks |
|------|------|-------------|--------------|
| D.1 | `step-D1-fetch-ready-posts.md` | Fetch posts with status Ready_ToPublish | `sma-fetch-post` |
| D.2 | `step-D2-publish-to-linkedin.md` | Duplicate guard, random delay, publish (one shot) | `sma-publish-linkedin` |
| D.3 | `step-D3-update-status.md` | Update status to Published + save URN + timestamp | `sma-update-post` |
| D.4 | `step-D4-notify-telegram.md` | Send publish notification to SMA control group | (Telegram via n8n) |

---

## Flow Summary

```
User: "Publish karo" / "Post daal do" / starts publish workflow
  |
  D.1 ---> FetchPost (status=Ready_ToPublish)
  |          |-- Present list to user
  |          |-- User confirms which post to publish
  |          |-- If none found -> exit
  |
  D.2 ---> Duplicate Guard: linkedin_post_urn exists? -> SKIP
  |          |-- Generate random delay (0-60 min)
  |          |-- User can override delay
  |          |-- POST sma-publish-linkedin
  |          |-- ONE SHOT: error? -> Publish_Failed, do NOT retry
  |          |-- Success? -> capture linkedin_post_urn
  |
  D.3 ---> UpdatePost (status=Published, linkedin_post_urn, published_at)
  |          |-- Verify update succeeded
  |          |-- If fails -> warn user, do NOT rollback LinkedIn post
  |
  D.4 ---> Telegram notification to SMA control group
             |-- Post title, LinkedIn URL, published_at
             |-- If fails -> log warning, don't fail workflow
             |-- Done -> E-AnalyticsReview or exit
```

---

## Webhook Reference

| n8n Workflow Name | Webhook URL | Used In |
|-------------------|-------------|---------|
| SMA/Data/Read/FetchPost | `https://n8n.linkright.in/webhook/sma-fetch-post` | D.1 |
| SMA/Publish/LinkedIn | `https://n8n.linkright.in/webhook/sma-publish-linkedin` | D.2 |
| SMA/Data/Write/UpdatePost | `https://n8n.linkright.in/webhook/sma-update-post` | D.3 |

---

## Inputs
- MongoDB: `linkedin_posts` collection (status = `Ready_ToPublish`)
- User confirmation before publish
- Pipeline predecessor: C (Content Review) must have approved the post

## Outputs
- LinkedIn post published (live on LinkedIn)
- Post status updated to `Published` in MongoDB
- `linkedin_post_urn` and `published_at` saved to post record
- Telegram notification sent to SMA control group
