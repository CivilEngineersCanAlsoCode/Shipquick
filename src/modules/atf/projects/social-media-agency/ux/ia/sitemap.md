# Information Architecture — Sitemap

**Product:** LinkRight SMA Dashboard
**Scope:** v1, single user, desktop-first

---

## Full Sitemap

```
LinkRight SMA (root: /)
│
├── 📊 Dashboard (/dashboard) ................................. HOME
│   ├── Pipeline Funnel ..................................... inline section
│   │   └── [click stage] → Posts filtered by status
│   ├── Action Required ..................................... inline section
│   │   ├── [Publish Now] → Confirmation dialog → D.2 webhook
│   │   ├── [Review Now] → /posts/:id (review mode)
│   │   └── [Start Ideation] → ChatGPT external link
│   ├── Weekly Calendar ..................................... inline section
│   │   └── [click day] → /posts/:id or /posts?date=YYYY-MM-DD
│   └── Quick Stats ......................................... inline section
│
├── 📝 Posts (/posts) ........................................ LIST
│   ├── Filters: status, pillar, date range, search ........ query params
│   ├── Sort: date, status, score, engagement ............... query param
│   ├── Pagination .......................................... query param
│   ├── [+ New Ideation] → ChatGPT external link
│   │
│   └── 📝 Post Detail (/posts/:id) ......................... DETAIL
│       ├── Status Progress Bar ............................. inline
│       ├── Metadata Panel .................................. inline (left col)
│       ├── Preview Panel ................................... inline (right col)
│       │   └── [Full Preview ↗] → Full-screen dialog
│       ├── History Timeline ................................ inline section
│       ├── Engagement Table (if published) ................. inline section
│       │   └── [click row] → /analytics/post/:id
│       └── Actions Menu:
│           ├── [Publish] → Confirmation dialog → D.2 webhook
│           ├── [Review/Approve] → C.2 webhook
│           ├── [Edit] → Inline editor
│           ├── [Format] → ChatGPT external link (F workflow)
│           ├── [Reschedule] → Date picker dialog
│           ├── [Send Back] → Confirmation → status reset
│           └── [Drop] → Typed confirmation dialog → cancel
│
├── 📈 Analytics (/analytics) ................................ SUMMARY
│   ├── Period Selector: 7d, 30d, 90d, custom .............. query param
│   ├── Overview Cards (4) .................................. inline row
│   ├── Engagement Over Time Chart .......................... inline section
│   ├── By Pillar (bar chart) ............................... inline (left col)
│   ├── By Framework (bar chart) ............................ inline (right col)
│   ├── Post Rankings Table ................................. inline section
│   │   └── [click row] → /analytics/post/:id
│   ├── Collection Schedule ................................. inline section
│   │   └── [Collect Metrics Guide] → help dialog
│   │
│   └── 📈 Post Analytics (/analytics/post/:id) ............. DETAIL
│       ├── Engagement Trajectory Chart (Day 1→30) ......... inline
│       ├── Metric Breakdown Table .......................... inline
│       ├── Comparison vs Average ........................... inline
│       ├── Resurgence Detection ............................ inline (if applicable)
│       └── [View Post] → /posts/:id
│
├── ⚙️ Settings (/settings) .................................. TABBED
│   ├── Tab: Scoring (/settings/scoring)
│   │   ├── Fibonacci Weight Sliders (F, P, R)
│   │   ├── Threshold Inputs (min total, individual mins)
│   │   ├── Impact Preview (expandable)
│   │   └── [Save] / [Reset to Default]
│   │
│   ├── Tab: Schedule (/settings/schedule)
│   │   ├── Active Days (chip multi-select)
│   │   ├── Max Posts/Day (number input)
│   │   ├── Planning Horizon (number input)
│   │   ├── Publish Delay Range (dual slider)
│   │   ├── Preferred Times (time range picker)
│   │   └── [Save] / [Reset]
│   │
│   ├── Tab: Formatting (/settings/formatting)
│   │   ├── Character Limits (min/max inputs)
│   │   ├── Emoji Limit (number input)
│   │   ├── Hindi Sentence Limit (number input)
│   │   ├── Hashtag Range (min/max inputs)
│   │   ├── Hook Max Chars (number input)
│   │   ├── FK Grade Target (number input)
│   │   ├── Layout Toggles (staircase, uppercase headers)
│   │   └── [Save] / [Reset]
│   │
│   ├── Tab: Engagement (/settings/engagement)
│   │   ├── Weight Inputs (like, comment, share)
│   │   ├── Collection Days (chip multi-select)
│   │   ├── Resurgence Threshold (% input)
│   │   ├── Benchmark Period (number input)
│   │   └── [Save] / [Reset]
│   │
│   ├── Tab: Review (/settings/review)
│   │   ├── Auto-approve Toggle (switch)
│   │   ├── Max Edits Per Review (number input)
│   │   ├── Require Formatting Check (switch)
│   │   ├── Allow Reschedule (switch)
│   │   ├── Allow Send Back (switch)
│   │   └── [Save] / [Reset]
│   │
│   ├── Tab: Analytics (/settings/analytics)
│   │   ├── Default Period (dropdown)
│   │   ├── Min Posts for Analysis (number input)
│   │   ├── Confidence Threshold (number input)
│   │   ├── Trend Window (number input)
│   │   ├── Pillar Priority (sliders per pillar)
│   │   ├── Preferred Methods (chip list, add/remove)
│   │   ├── Underperformer Flags (chip list, add/remove)
│   │   └── [Save] / [Reset]
│   │
│   └── Tab: Account (/settings/account)
│       ├── User Profile (name, role — read-only)
│       ├── Connected Services
│       │   ├── LinkedIn: Connected ✅ / [Reconnect]
│       │   ├── Google Sheets: Connected ✅ / [Reconnect]
│       │   ├── Notion: Connected ✅ / [Reconnect]
│       │   └── Telegram: Connected ✅ / [Reconnect]
│       └── n8n Webhook Base URL (text input)
│
└── 🔗 External Links (sidebar bottom)
    ├── ChatGPT (LinkRight HQ) → new tab
    └── Telegram (SMA Group) → new tab
```

---

## Content Relationships

### Post is the Central Entity

```
                    ┌─────────────┐
                    │  Google     │
                    │  Sheet      │  ← Brief source
                    │  (external) │
                    └──────┬──────┘
                           │ A.1 fetch
                           ▼
┌──────────┐       ┌───────────────┐       ┌──────────┐
│ Experience│──────▶│     POST      │◀──────│  Config  │
│ (vector) │ A.3   │               │ scoring│  (7 docs)│
└──────────┘       │ _id           │       └──────────┘
                   │ title         │
                   │ content_pillar│       ┌──────────┐
                   │ score         │──────▶│  Notion  │
                   │ status        │ A.8   │ Calendar │
                   │ scheduled_date│       │(external)│
                   │ raw_content   │       └──────────┘
                   │ formatted_cont│
                   │ linkedin_urn  │       ┌──────────┐
                   │ published_at  │──────▶│ LinkedIn │
                   │ metrics_hist[]│ D.2   │(external)│
                   │ frameworks    │       └──────────┘
                   │ iteration_cnt │
                   └───────┬───────┘       ┌──────────┐
                           │ D.4           │ Telegram │
                           └──────────────▶│(external)│
                                           └──────────┘
```

### Cross-Page Navigation Flows

| From | To | Trigger | Context |
|------|----|---------|---------|
| Dashboard → Post Detail | Click calendar day or action item | Carries post_id |
| Dashboard → Posts (filtered) | Click pipeline stage | Carries status filter |
| Posts List → Post Detail | Click post card | Carries post_id |
| Post Detail → Analytics Post | Click engagement row | Carries post_id |
| Analytics Summary → Analytics Post | Click ranking row | Carries post_id |
| Analytics Post → Post Detail | "View Post" link | Carries post_id |
| Post Detail → ChatGPT | "Format" or "Draft" action | Opens external with post context |
| Any page → Settings | Sidebar nav | Direct navigation |

---

## Content Inventory

### Dashboard Page
| Content Block | Data Source | Update Frequency |
|---------------|-------------|-----------------|
| Pipeline funnel counts | Aggregated from Posts | Real-time (60s poll) |
| Action required items | Posts with upcoming dates + status | Real-time (60s poll) |
| Weekly calendar | Posts by scheduled_date | Real-time (60s poll) |
| Quick stats | Aggregated from Posts + Analytics | On page load |

### Posts Page
| Content Block | Data Source | Update Frequency |
|---------------|-------------|-----------------|
| Post list | MongoDB `linkedin_posts` | On demand |
| Post metadata | MongoDB `linkedin_posts` | On post load |
| Post preview | `formatted_content` field | On post load |
| Status history | `status_history[]` field | On post load |
| Engagement data | `metrics_history[]` field | On post load |

### Analytics Page
| Content Block | Data Source | Update Frequency |
|---------------|-------------|-----------------|
| Overview cards | Aggregated from metrics | On period change |
| Engagement chart | `metrics_history[]` time series | On period change |
| Pillar/framework bars | Aggregated by pillar/framework | On period change |
| Post rankings | Sorted by engagement_score | On period change |
| Collection schedule | Calculated from published_at + collection_days | On page load |

### Settings Page
| Content Block | Data Source | Update Frequency |
|---------------|-------------|-----------------|
| Config values | MongoDB `sma_config` (7 docs) | On tab load |
| Impact preview | Calculated from config + past briefs | On value change |
| Connected services | Account metadata | On tab load |
