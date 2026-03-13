---
name: "Social Media Agency"
created: "2026-03-13"
status: "REQUIREMENTS_COMPLETE"
complexity: "complex"
estimated_workflows: 12
---

# 📋 Requirement Brief: Social Media Agency

## Overview

Complete social media management system with AI-powered content creation, multi-platform posting, and analytics tracking.

---

## Content Source: Notion

**Database:** Strategic Content System 2026

### Garden of Ideas (Idea Bank)
| Column | Type | Purpose |
|--------|------|---------|
| Title / Idea | Text | Content idea name |
| Impact | Number | Score 1-10 |
| Idea Status | Select | Raw Idea / In Production / Published / Archived |
| Reference Link | URL | Inspiration source |
| Facility | Number | Ease score |
| ICE Score | Formula | Calculated priority |
| Trust | Number | Confidence score |

### Content Calendar 2026 (Schedule)
| Column | Type | Purpose |
|--------|------|---------|
| Title / Idea | Text | Content piece name |
| Content Idea Relationship | Relation | Links to Garden of Ideas |
| Target | Select | Nurture audience / Generate leads / Position authority / Drive traffic |
| Status | Select | Raw idea / Validated / In Production / Ready / Published |
| Type of piece | Select | Reel / Carousel / Post / Story / Thread |
| Main Channel | Select | Instagram / YouTube / LinkedIn / Substack / X / Telegram |
| Content pillar | Select | Educational / Promotional / Inspirational / Conversational |
| Date of publication | Date | Scheduled publish date |
| Priority | Select | High / Medium / Low |
| URL published | URL | Link after publishing |
| ✅ Copys ready | Checkbox | Content written |
| ✅ Layout/editing ready | Checkbox | Visuals done |
| ✅ Script ready | Checkbox | Video script done |
| ✅ Scheduled | Checkbox | Queued in platform |
| ✅ Uploaded to channel | Checkbox | Published |

### Social Media KPIs (Analytics)
| Column | Type | Purpose |
|--------|------|---------|
| Content Calendar 2026 | Relation | Links to published content |
| Channel | Select | Platform |
| Start and end date | Date | Tracking period |
| Interactions | Number | Likes + comments + shares |
| Reach | Number | Views/impressions |
| Engagement Rate | Formula | Interactions / Reach |
| Followers current month | Number | Current count |
| Followers previous month | Number | Previous count |
| Growth Rate | Formula | % change |

---

## Target Platforms

| Platform | Credential | Frequency | Status |
|----------|------------|-----------|--------|
| X (Twitter) | ✅ X account | 1/day | Ready |
| LinkedIn | ✅ LinkedIn - satvikiitd | 1/day | Ready |
| YouTube | ✅ youtube-klickbae | 1/week | Ready |
| Telegram | ✅ telegram-linkright | 1/day | Ready |
| Instagram | ❌ Need credential | 1/day | Missing |
| Substack | ❌ Need credential | 1/week | Missing |

---

## Content Generation

| Setting | Value |
|---------|-------|
| AI Model | Gemini (gemini-klickbae) |
| Default Tone | Casual + Witty |
| Language | English only |
| Platform Variations | Yes (adapt per platform) |

### Tone by Platform
| Platform | Tone |
|----------|------|
| X | Witty, punchy, hashtags |
| LinkedIn | Professional but personable |
| YouTube | Engaging, hook-focused |
| Telegram | Direct, community-focused |
| Instagram | Visual-first, casual |

---

## Rate Limit Strategy

| Platform | API Limit | Our Buffer |
|----------|-----------|------------|
| X | 50 tweets/day | Max 5/day |
| LinkedIn | 100 posts/day | Max 3/day |
| YouTube | 6 videos/day | Max 1/day |
| Telegram | 30 msg/sec | Batch with 1s delay |
| Notion | 3 req/sec | Queue with 500ms delay |
| Gemini | 60 req/min | Max 30/min |

### Anti-Rate-Limit Patterns
1. **Batch Processing**: Queue posts, process every 15 min
2. **Staggered Posting**: 5-10 min gaps between platforms
3. **Retry with Backoff**: 1s → 5s → 30s → fail
4. **Daily Limits**: Track usage, stop before hitting limits

---

## Workflow Architecture

### Phase 1: Foundation
1. **notion-sync** — Bidirectional sync with Notion databases
2. **content-generator** — AI-powered content creation

### Phase 2: Platform Posters
3. **x-poster** — Tweet/thread posting
4. **linkedin-poster** — Post to LinkedIn
5. **telegram-broadcaster** — Send to channel
6. **youtube-uploader** — Upload videos

### Phase 3: Intelligence
7. **cross-poster** — Adapt content across platforms
8. **hashtag-optimizer** — Generate relevant hashtags
9. **scheduler** — Queue management with rate limiting

### Phase 4: Analytics
10. **analytics-collector** — Gather metrics from all platforms
11. **report-generator** — Weekly performance reports

### Phase 5: Orchestration
12. **agency-orchestrator** — Master controller

---

## Notion Integration Points

| Workflow | Reads | Writes |
|----------|-------|--------|
| content-generator | Garden of Ideas | Content Calendar (drafts) |
| scheduler | Content Calendar (ready) | Content Calendar (scheduled) |
| x-poster | Content Calendar | URL published, ✅ Uploaded |
| linkedin-poster | Content Calendar | URL published, ✅ Uploaded |
| analytics-collector | Content Calendar | Social Media KPIs |
| report-generator | Social Media KPIs | (email/Telegram report) |

---

## Success Criteria

✅ Posts scheduled content automatically on time
✅ Adapts content tone per platform
✅ Never exceeds rate limits
✅ Updates Notion with published URLs
✅ Tracks analytics back to Notion
✅ Weekly report delivered

---

**Scout Handoff:** Requirements complete. Ready for Forge Master design.
