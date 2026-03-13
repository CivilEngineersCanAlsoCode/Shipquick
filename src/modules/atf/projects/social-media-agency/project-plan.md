---
name: "Social Media Agency"
created: "2026-03-13"
status: "IN_PROGRESS"
owner: "satvik395"
platforms:
  - x_twitter
  - linkedin
  - youtube
  - telegram
tools:
  - notion
  - google_sheets
  - gemini_ai
---

# 🏢 Social Media Agency — Project Plan

## Overview

Complete social media management system with AI-powered content creation, multi-platform posting, and analytics.

---

## Phase 1: Foundation (Build First)

| # | Workflow | Priority | Nodes | Status |
|---|----------|----------|-------|--------|
| 1 | content-calendar | 🔴 Critical | ~8 | ⬜ |
| 2 | content-generator | 🔴 Critical | ~12 | ⬜ |

**Why first:** Everything else depends on having content and a schedule.

---

## Phase 2: Platform Posters

| # | Workflow | Priority | Nodes | Status |
|---|----------|----------|-------|--------|
| 3 | x-poster | 🟡 High | ~5 | ⬜ |
| 4 | linkedin-poster | 🟡 High | ~5 | ⬜ |
| 5 | telegram-broadcaster | 🟡 High | ~4 | ⬜ |
| 6 | youtube-uploader | 🟢 Medium | ~8 | ⬜ |

**Why second:** These are the actual posting workflows.

---

## Phase 3: Automation & Intelligence

| # | Workflow | Priority | Nodes | Status |
|---|----------|----------|-------|--------|
| 7 | cross-poster | 🟡 High | ~10 | ⬜ |
| 8 | engagement-responder | 🟢 Medium | ~10 | ⬜ |
| 9 | hashtag-optimizer | 🟢 Medium | ~6 | ⬜ |

**Why third:** Enhance the basic posting with smart features.

---

## Phase 4: Analytics & Reporting

| # | Workflow | Priority | Nodes | Status |
|---|----------|----------|-------|--------|
| 10 | analytics-collector | 🟢 Medium | ~15 | ⬜ |
| 11 | report-generator | 🟢 Medium | ~8 | ⬜ |

**Why last:** Need data from posting to analyze.

---

## Phase 5: Master Orchestrator

| # | Workflow | Priority | Nodes | Status |
|---|----------|----------|-------|--------|
| 12 | agency-orchestrator | 🔴 Critical | ~10 | ⬜ |

**Final:** Connects all workflows into unified system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENCY ORCHESTRATOR                       │
│         (Master controller - triggers everything)            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   CONTENT    │    │   POSTING    │    │  ANALYTICS   │
│   CALENDAR   │───▶│   WORKFLOWS  │───▶│  COLLECTOR   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                  │                     │
        ▼                  ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   CONTENT    │    │    X/LI/TG   │    │    REPORT    │
│  GENERATOR   │    │    YOUTUBE   │    │  GENERATOR   │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Credentials Map

| Workflow | Credentials Needed |
|----------|-------------------|
| content-calendar | gsheets-klickbae, Notion |
| content-generator | gemini-klickbae |
| x-poster | X account |
| linkedin-poster | LinkedIn - satvikiitd |
| telegram-broadcaster | telegram-linkright |
| youtube-uploader | youtube-klickbae |
| analytics-collector | All platform APIs |
| report-generator | gsheets-klickbae |

---

## Estimated Time

| Phase | Workflows | Est. Time |
|-------|-----------|-----------|
| Phase 1 | 2 | ~40 min |
| Phase 2 | 4 | ~50 min |
| Phase 3 | 3 | ~45 min |
| Phase 4 | 2 | ~30 min |
| Phase 5 | 1 | ~15 min |
| **Total** | **12** | **~3 hours** |

---

## Current Progress

**Phase:** 1 - Foundation
**Building:** content-calendar
**Status:** Starting...
