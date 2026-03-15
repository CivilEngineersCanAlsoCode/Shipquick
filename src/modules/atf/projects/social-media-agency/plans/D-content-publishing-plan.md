# D-ContentPublishing — Detailed Implementation Plan

> **Version:** 1.0
> **Created:** 2026-03-15
> **Status:** Planning
> **Scope:** LinkedIn only (v1)
> **Depends on:** C-ContentReview (must have Ready_ToPublish posts)

---

## 1. Overview

Content Publishing is the fifth workflow in the SMA pipeline (A→B→F→C→**D**→E). It takes an approved post (status: `Ready_ToPublish`), publishes it to LinkedIn via n8n, updates the post record, and sends a Telegram notification.

### Key Design Decisions
- **One-shot publish** — no automatic retry on failure
- **Random 0-60 minute delay** — avoids bot-like posting patterns
- **Duplicate guard** — check `linkedin_post_urn` before publish to prevent double-posting
- **Telegram notification** — SMA control group gets notified on publish
- **1 post per day maximum** (v1 constraint)

### Architecture Rules (inherited)
- **Claw (BMAD agent) has ZERO direct DB/API access**
- ALL reads and writes go through n8n webhook-triggered workflows
- MongoDB = user's own data

---

## 2. Data Flow

### Input (from C-ContentReview C.2)
Post in `linkedin_posts` with:
```json
{
  "_id": ObjectId,
  "title": "Why I turned down PWC to bet on myself",
  "content": "Full formatted post text...",
  "status": "Ready_ToPublish",
  "scheduled_date": "2026-03-17",
  "scheduled_time": "09:00",
  "timezone": "Asia/Kolkata",
  "review_metadata": { "decision": "approved", "reviewed_at": ISODate }
}
```

### Output (after Content Publishing)
Same document updated:
```json
{
  "status": "Published",
  "linkedin_post_urn": "urn:li:share:7000000000000000000",
  "published_at": ISODate,
  "publish_metadata": {
    "delay_seconds": 1847,
    "publish_method": "api_via_n8n",
    "telegram_notified": true
  }
}
```

Or on failure:
```json
{
  "status": "Publish_Failed",
  "publish_metadata": {
    "error": "LinkedIn API 403: rate limited",
    "failed_at": ISODate
  }
}
```

---

## 3. n8n Workflows

### 3.1 Existing Workflows (Reuse)

| # | Workflow | Webhook | Reuse For |
|---|----------|---------|-----------|
| 1 | SMA/Data/Read/FetchPostById | /sma-fetch-post | D.1 — Fetch ready posts |
| 2 | SMA/Data/Write/UpdatePost | /sma-update-post | D.3 — Update status after publish |

### 3.2 New Workflows

| # | Workflow | Webhook | Purpose |
|---|----------|---------|---------|
| 3 | SMA/Publish/LinkedIn | /sma-publish-linkedin | D.2 — Publish post to LinkedIn |
| 4 | SMA/Notify/Telegram | /sma-notify-telegram | D.4 — Send Telegram notification |

### 3.3 New Webhook Payloads

#### PublishLinkedIn (WRITE)
```
POST /sma-publish-linkedin
Request: {
  "content": "Full post text...",
  "post_id": "ObjectId string"
}
Response (success): {
  "success": true,
  "linkedin_post_urn": "urn:li:share:7000000000000000000",
  "published_at": ISODate
}
Response (failure): {
  "success": false,
  "error": "LinkedIn API error message"
}
```

#### NotifyTelegram (WRITE)
```
POST /sma-notify-telegram
Request: {
  "message": "📢 New post published!\n📌 Title\n📅 Date\n🔗 LinkedIn URL",
  "chat_id": "SMA control group ID"
}
Response: { "success": true }
```

---

## 4. BMAD Workflow Steps — Complete Execution Flow

### D.1 — Fetch Ready Posts
```
Agent: Content Publisher (flex-publisher)
Trigger: User says "Publish karo" / "Post daal do" / scheduled time

Sub-steps:

D.1.a — Fetch ready posts:
  n8n call: SMA/Data/Read/FetchPostById
  Input: { "status": "Ready_ToPublish", "channel": "linkedin", "limit": 5 }
  Sort: scheduled_date ascending
  Output: List of approved posts

D.1.b — Present:
  "📢 Ready to publish:

   1. 📌 'Why I turned down PWC to bet on myself'
      📅 Mar 17, 09:00 AM IST | Score: 143/160

   Publish karna hai? (post is scheduled for today)"

D.1.c — Edge cases:
  - No Ready_ToPublish posts → "Koi post ready nahi hai. Review kar pehle?"
  - Post not scheduled for today → warn: "Ye post Mar 19 ke liye scheduled hai. Aaj publish karna hai?"
  - Multiple posts → show list, default to today's scheduled post

D.1.d — Scheduling check:
  - If scheduled_date = today → proceed
  - If scheduled_date = future → warn, ask confirmation
  - If scheduled_date = past → warn: "Ye post overdue hai — publish karna hai?"

Next: D.2
```

### D.2 — Publish to LinkedIn
```
Agent: Content Publisher
Purpose: One-shot publish with delay and duplicate guard

Sub-steps:

D.2.a — Duplicate guard:
  Check if post already has linkedin_post_urn
  If yes → "⚠️ Ye post already published hai! URN: [urn]"
  → Skip to D.4 or exit

D.2.b — Random delay:
  Generate random delay: 0-60 minutes (0-3600 seconds)
  "⏱️ Publishing in [X] minutes (random delay for natural posting)..."

  NOTE: In v1, this delay is informational — Claw tells user to wait.
  Future: n8n handles delay internally.

D.2.c — Publish:
  n8n call: SMA/Publish/LinkedIn
  Input: {
    "content": post.content,
    "post_id": post._id
  }

  SUCCESS:
    Response: { success: true, linkedin_post_urn: "urn:...", published_at: ISODate }
    → D.3

  FAILURE:
    Response: { success: false, error: "..." }
    → D.2.d

D.2.d — Handle failure:
  n8n call: SMA/Data/Write/UpdatePost
  Input: {
    "post_id": post._id,
    "updates": {
      "status": "Publish_Failed",
      "publish_metadata": {
        "error": error_message,
        "failed_at": now
      }
    }
  }
  "❌ Publish failed: [error]. No auto-retry (one-shot rule).
   Fix the issue and manually re-queue, or cancel?"

Next: D.3 (on success) or exit (on failure)
```

### D.3 — Update Post Status
```
Agent: Content Publisher
Purpose: Save publish confirmation to MongoDB

Sub-steps:

D.3.a — Update post:
  n8n call: SMA/Data/Write/UpdatePost
  Input: {
    "post_id": post._id,
    "updates": {
      "status": "Published",
      "linkedin_post_urn": response.linkedin_post_urn,
      "published_at": response.published_at,
      "publish_metadata": {
        "delay_seconds": actual_delay,
        "publish_method": "api_via_n8n",
        "telegram_notified": false
      }
    }
  }

Next: D.4
```

### D.4 — Telegram Notification
```
Agent: Content Publisher
Purpose: Notify SMA control group

Sub-steps:

D.4.a — Send notification:
  n8n call: SMA/Notify/Telegram
  Input: {
    "message": "📢 New LinkedIn post published!\n\n📌 [title]\n📅 [date]\n🎯 [pillar]\n📊 Score: [total]/160\n\n🔗 linkedin.com/feed/update/[urn]",
    "chat_id": "SMA_CONTROL_GROUP_ID"
  }

D.4.b — Update telegram flag:
  n8n call: SMA/Data/Write/UpdatePost
  Input: {
    "post_id": post._id,
    "updates": {
      "publish_metadata.telegram_notified": true
    }
  }

D.4.c — Final summary:
  "✅ Published & notified!

   📌 'Why I turned down PWC to bet on myself'
   📅 Published: Mar 17, 09:23 AM IST
   🔗 linkedin.com/feed/update/[urn]
   📱 Telegram group notified ✅

   Next?
   1. 'Analytics start karo' → E
   2. 'Next post publish karo' → D.1
   3. 'Done' → exit"

Next: E (analytics) or D.1 (next post) or exit
```

---

## 5. Execution Flow Diagram

```
User: "Publish karo"
│
├─ D.1 ──[D.1.a]──→ n8n: FetchPostById ──→ MongoDB (Ready_ToPublish)
│   └─ Present ready post(s) → user confirms
│
├─ D.2 ── Duplicate guard → Random delay → Publish
│   ├──[D.2.c]──→ n8n: PublishLinkedIn ──→ LinkedIn API
│   │   ├── Success → D.3
│   │   └── Failure ──[D.2.d]──→ n8n: UpdatePost (Publish_Failed) → exit
│
├─ D.3 ──[D.3.a]──→ n8n: UpdatePost ──→ MongoDB (Published + URN)
│
└─ D.4 ──[D.4.a]──→ n8n: NotifyTelegram ──→ Telegram group
    ├──[D.4.b]──→ n8n: UpdatePost (telegram flag)
    └── Done! → E (analytics) or exit
```

---

## 6. n8n Calls Per Run

| Scenario | Calls | Breakdown |
|----------|-------|-----------|
| Happy path (1 post) | 5 | D.1.a + D.2.c + D.3.a + D.4.a + D.4.b |
| Publish failure | 2 | D.1.a + D.2.d |
| Duplicate detected | 1 | D.1.a only (abort) |

---

## 7. New n8n Workflow Specifications

### Workflow: SMA/Publish/LinkedIn

**Nodes:** 4

#### Node 1: Webhook
```
POST /sma-publish-linkedin
Response Mode: Using 'Respond to Webhook' Node
```

#### Node 2: Code (Prepare LinkedIn payload)
```javascript
const body = $input.first().json.body;
return [{
  json: {
    text: body.content,
    visibility: "PUBLIC"
  }
}];
```

#### Node 3: LinkedIn (Create Post)
```
├── Credential: LinkedIn OAuth2
├── Resource: Post
├── Operation: Create
├── Text: {{ $json.text }}
├── Visibility: PUBLIC
```

#### Node 4: Respond to Webhook
```javascript
const response = $input.first().json;
return [{
  json: {
    success: true,
    linkedin_post_urn: response.id || response.urn,
    published_at: new Date().toISOString()
  }
}];
```

### Workflow: SMA/Notify/Telegram

**Nodes:** 3

#### Node 1: Webhook
```
POST /sma-notify-telegram
Response Mode: Using 'Respond to Webhook' Node
```

#### Node 2: Telegram (Send Message)
```
├── Credential: Telegram Bot API
├── Chat ID: {{ $json.body.chat_id }}
├── Text: {{ $json.body.message }}
├── Parse Mode: Markdown
```

#### Node 3: Respond to Webhook
```
{{ { success: true } }}
```

---

## 8. Dependencies

### Prerequisites
- At least 1 post with status `Ready_ToPublish` (from C-ContentReview)
- LinkedIn OAuth2 credential configured in n8n
- Telegram Bot API credential configured in n8n
- SMA control group chat ID configured

### Build Order
```
1. SMA/Publish/LinkedIn workflow (new)
2. SMA/Notify/Telegram workflow (new)
3. Update/create step files for D workflow
4. End-to-end test: publish happy path
5. End-to-end test: publish failure → Publish_Failed
6. End-to-end test: duplicate guard
7. End-to-end test: Telegram notification
```

---

## 9. Naming Convention Reference

```
Tier 1 (BMAD Workflow): D (ContentPublishing)
Tier 2 (Step):          1-4
Tier 3 (n8n Call):      a, b, c, d

Steps:
  D.1 — Fetch Ready Posts
  D.2 — Publish to LinkedIn
  D.3 — Update Post Status
  D.4 — Telegram Notification

n8n Calls:
  D.1.a — FetchPostById (existing)
  D.2.c — PublishLinkedIn (NEW)
  D.2.d — UpdatePost (existing, on failure)
  D.3.a — UpdatePost (existing)
  D.4.a — NotifyTelegram (NEW)
  D.4.b — UpdatePost (existing, telegram flag)
```

---

## 10. File References

| File | Path |
|------|------|
| This plan | `plans/D-content-publishing-plan.md` |
| BMAD workflow | `workflows/content-publishing/workflow.md` |
| Step files | `workflows/content-publishing/steps-c/` |
| State machine | `docs/pipeline-state-machine.md` |
