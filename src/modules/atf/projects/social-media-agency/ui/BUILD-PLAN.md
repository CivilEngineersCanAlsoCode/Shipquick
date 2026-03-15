# LinkRight SMA — React Dashboard Build Plan v2 (Stress-Tested)

**Goal:** 36 Stitch HTML screens → production React + MUI v6 + Material 3 app  
**Last updated:** 2026-03-15  
**Status:** PLAN (not started)

---

## ⚠️ ASSUMPTIONS STRESS-TESTED

### What I Got WRONG in v1

| # | v1 Assumption | Reality | Impact |
|---|--------------|---------|--------|
| 1 | "All n8n webhooks need building" | **9 of 14 already work!** Only 5 are 404 | Less blocked than thought |
| 2 | "7 config tabs in Settings" | Only **3 config docs exist** in MongoDB. 4 missing (formatting, engagement, review, analytics) | Settings page needs seed data OR create-on-first-save |
| 3 | "Mock data needed" | **7 real posts exist** in MongoDB + 3 real configs. Real data available via working webhooks | Can use REAL data from day 1 |
| 4 | "Journey screens are overlays" | J1-J3 happen **IN ChatGPT**, not dashboard. Dashboard only handles J4 (review), J5 (analytics), J6 (settings). J1-J3 screens are VIEW-ONLY displays of what ChatGPT produced | Half the journey screens are read-only |
| 5 | "Need React Query" | Not in current `package.json`. Adding it = new dependency. v1 can use plain fetch + useState | Simpler initially |
| 6 | "MUI v6 has NavigationRail" | **No native NavigationRail** in MUI v6. Must build custom using Drawer permanent mode | More custom code needed |
| 7 | "Need 12 shared components" | Some overlap. ScoreBreakdown = ScoreRing extended. StatusStepper = reuse StatusChip. More like **8 core + 4 composite** | Fewer components |
| 8 | "Backend proxy needs expansion" | Backend already has **8 route files** with proper error handling, auth, logging | Backend is DONE, just need env config |
| 9 | "Posts per day = 1" | `posting_schedule` config has no `posts_per_day` field. It's per-day pillar preferences (mon→story_insight, etc.) | Settings page needs different field |
| 10 | "n8n base URL" | Config says `https://n8n.linkright.in/webhook` but n8n is local Docker at `172.17.0.2:5678`. No external domain exists | Must use `http://172.17.0.2:5678/webhook` or `http://localhost:5678/webhook` |

### What ChatGPT Owns vs What Dashboard Owns

**CRITICAL DISTINCTION** the v1 plan missed:

| Action | Owner | Dashboard Role |
|--------|-------|----------------|
| Plan content (A) | ChatGPT | View briefs list (read-only) |
| Draft content (B) | ChatGPT | View draft (read-only) |
| Format content (F) | ChatGPT | View formatting report (read-only) |
| Review content (C) | **DASHBOARD** | Approve / Request Changes / Send Back |
| Publish (D) | **DASHBOARD** | Click "Publish" button (one-shot) |
| Analytics (E) | **DASHBOARD** | View charts, enter metrics from JS snippet |
| Settings | **DASHBOARD** | View + edit all 7 config docs |

**Implication:** Dashboard is primarily a **review + analytics + settings** tool, NOT a content creation tool. The FAB button should say "Open ChatGPT" not "New Post".

### n8n Webhook Status (VERIFIED)

| Webhook | Status | Used By |
|---------|--------|---------|
| `sma-submit-brief` | ✅ 200 | ChatGPT (A) |
| `sma-fetch-briefs` | ✅ 200 | Dashboard (read) |
| `sma-fetch-past-posts` | ✅ 200 | Dashboard + ChatGPT |
| `sma-search-experiences` | ✅ 200 | ChatGPT (B) |
| `sma-fetch-config` | ✅ 200 | Dashboard + ChatGPT |
| `sma-update-sheet-status` | ✅ 200 | ChatGPT (A) |
| `sma-save-config` | ✅ 200 | Dashboard Settings |
| `sma-save-experience` | ✅ 200 | ChatGPT |
| `sma-save-post` | ✅ 200 | ChatGPT (B) |
| `sma-fetch-post` | ❌ 404 | Dashboard (list + detail) |
| `sma-update-post` | ❌ 404 | Dashboard (review actions) |
| `sma-publish-linkedin` | ❌ 404 | Dashboard (publish button) |
| `sma-notify-telegram` | ❌ 404 | Dashboard (after publish) |
| `sma-analytics-collect` | ❌ 404 | Dashboard (submit metrics) |

**What this means:** Dashboard can show configs and past posts RIGHT NOW. Review actions and publish are blocked on Satvik building 5 workflows.

### MongoDB Reality

**Existing data:**
- `linkedin_posts`: 7 documents (5 with full data, 2 empty shells)
- `sma_config`: 3 documents (`scoring_weights`, `scoring_scales`, `posting_schedule`)
- `life_experiences`: 7 documents (for ChatGPT, not dashboard)

**Missing config docs (need seeding):**
- `formatting_config` — schema defined in `frameworks/config-doc-schemas.md`
- `engagement_config` — schema defined
- `review_config` — schema defined  
- `analytics_config` — schema defined

**Post schema gaps:**
- No `formatting_report` field (FR01-FR16 results) — F workflow hasn't run yet
- No `review_history` field (approve/reject log) — C workflow hasn't run yet
- No `engagement_data` array (Day 1/3/7/14/30 snapshots) — E workflow hasn't run yet
- No `framework_used` field (Hook/Narrative/CTA)
- No `revision_count` field
- Posts only have `metrics` from n8n seed data, not real LinkedIn data

**Real post response shape (from `sma-fetch-past-posts`):**
```json
{
  "posts": [
    {
      "title": "string",
      "content_pillar": "career|pm|startup|hottake|...",
      "scheduled_date": "2026-03-12",
      "published_at": "ISO8601",
      "status": "Published",
      "metrics": { "likes": 290, "comments": 41, "shares": 22, "impressions": 15000 }
    }
  ]
}
```

**⚠️ NOTE:** `sma-fetch-past-posts` does NOT return `_id`, `content`, `scores`, `scheduled_time`, `timezone`, `created_at`. These fields exist in MongoDB but the n8n workflow strips them. We need `sma-fetch-post` (404) for full post data.

### MUI v6 Reality

- **Installed:** MUI v6.5.0 ✅
- **Material 3 support:** Partial. `cssVariables: true` in theme enables M3-like tokens. No native M3 components (NavigationRail, FAB extended, SegmentedButton)
- **Missing MUI components we need to build custom:**
  - NavigationRail → use `Drawer` with `variant="permanent"` + custom styling
  - SegmentedButton → use `ToggleButtonGroup`
  - Extended FAB → use `Fab` + `Menu`
  - Score Ring → use SVG circle (no MUI equivalent)
  - Pipeline Funnel → fully custom

### Dual Codebase Problem

There are TWO frontend codebases:
1. `ui/app/` — **runnable MVP** (3 pages, minimal, 2 API calls, dark-only)
2. `ui/frontend/` — **spec/scaffold** (5 pages, 6 components, React Query hooks, never built/run)

**Decision:** Merge into ONE codebase at `ui/app/`. Take the better code from `frontend/` (API client, component stubs) and bring into `app/`.

---

## Phase 0: Pre-Build Setup (30 min)

### 0.1 Seed Missing Config Docs
Insert 4 missing config documents into MongoDB so Settings page has real data:
```
formatting_config, engagement_config, review_config, analytics_config
```
Schema from `frameworks/config-doc-schemas.md`. This is a one-time database seed.

### 0.2 Fix Backend .env
```
N8N_BASE_URL=http://172.17.0.2:5678/webhook   # NOT https://n8n.linkright.in
SMA_API_KEY=dev-local-2026
CORS_ORIGIN=http://localhost:5173              # Vite port, NOT 3000
PORT=3001
```

### 0.3 Add Dependencies to app/package.json
```
+ @tanstack/react-query ^5.62.0    # server state management
+ @tanstack/react-query-devtools    # dev only
+ @mui/x-date-pickers ^7.0.0       # time picker in Settings
```
Remove: nothing (current deps are all needed)

### 0.4 Merge frontend/ → app/
Copy from `ui/frontend/src/`:
- `api/client.js` → `app/src/api/client.js` (replace current `api.js`)
- Component stubs as starting points (review, don't copy blindly)

---

## Phase 1: Foundation (2 hours)

### 1.1 Theme — Teal Multi-Color
**Source:** `dashboard-teal-dark.html` + user preference

```js
// Light mode
primary: '#006a6a',        // Teal
onPrimary: '#ffffff',
secondary: '#ec5b13',      // Orange (accent)
tertiary: '#7e57c2',       // Purple (accent)
background: '#f8f6f6',
surface: '#ffffff',
error: '#ba1a1a',

// Dark mode  
primary: '#80d5d5',        // Teal light
onPrimary: '#003737',
secondary: '#ffb599',      // Orange light
tertiary: '#b39ddb',       // Purple light
background: '#221610',     // Warm dark (NOT cold #121212!)
surface: '#2d2420',
error: '#ffb4ab',

// Semantic accent colors (for pillar chips, status chips, etc.)
accent: {
  pink: '#d81b60',
  coral: '#ff7043',
  skin: '#ffab91',
  silver: '#b0bec5',
}
```

**Pillar colors (DO NOT USE THEME COLORS — these are data colors):**
```js
PILLAR_COLORS = {
  ai_automation: '#26a69a',  // Teal variant (matches primary family)
  startup:       '#ec5b13',  // Orange (= secondary)
  pm:            '#7e57c2',  // Purple (= tertiary)
  career:        '#66bb6a',  // Green
  hottake:       '#ef5350',  // Red/Coral
  personal:      '#d81b60',  // Pink
  howto:         '#29b6f6',  // Light Blue
}
```

### 1.2 Layout Shell
**Custom NavigationRail** (MUI has no native one):
```
<Drawer variant="permanent" sx={{ width: 80 }}>
  // Collapsed: icon-only (80px)
  // Expanded: icon + label (256px) — expand on hover or hamburger
  
  Logo + "LR" (collapsed) / "LinkRight" (expanded)
  ---
  Dashboard (dashboard icon)
  Posts (article icon)
  Analytics (analytics icon)  
  Settings (settings icon)
  ---
  ChatGPT ↗ (external link)
  Telegram ↗ (external link)
  ---
  Dark mode toggle (bottom)
</Drawer>
```

### 1.3 Router
```
/              → redirect /dashboard
/dashboard     → Dashboard
/posts         → PostsList
/posts/:id     → PostDetail  
/analytics     → Analytics
/settings      → Settings
```
No nested routes needed. No auth routes.

---

## Phase 2: Core Components (3 hours)

### Component Inventory (8 core + 4 composite)

**Core (build from scratch):**

| # | Component | Props | Notes |
|---|-----------|-------|-------|
| 1 | `ScoreRing` | `score`, `max=160`, `size` | SVG circle. Green ≥80, amber 60-79, red <60. Show score number in center |
| 2 | `StatusChip` | `status` | 9 variants with distinct colors. Use MUI `Chip` |
| 3 | `PillarChip` | `pillar` | 7 pillars with `PILLAR_COLORS`. Use MUI `Chip` |
| 4 | `MetricCard` | `icon`, `label`, `value`, `delta`, `color` | MUI `Card` + `Typography` |
| 5 | `LinkedInPreview` | `content`, `author="Satvik Jain"` | Fake LinkedIn post card |
| 6 | `ScoreBreakdown` | `scores: {f,p,r}` | 3 progress bars: Freshness×8, PersonalExp×5, Research×3 |
| 7 | `EmptyState` | `icon`, `title`, `description`, `action` | Reusable across all pages |
| 8 | `ErrorBanner` | `message`, `onRetry` | Red banner with retry button |

**Composite (compose from core):**

| # | Component | Made From | Notes |
|---|-----------|-----------|-------|
| 9 | `PostCard` | ScoreRing + StatusChip + PillarChip | Grid card for Posts list |
| 10 | `PipelineFunnel` | StatusChip × 7 | Horizontal chip bar with counts |
| 11 | `ActionRequired` | MUI List | Urgent/soon/info items with action buttons |
| 12 | `WeekCalendar` | MUI Card × 7 | Mon-Sun with post indicators |

### What We DON'T Build (v1 cut)

| Component | v1 Plan | Why Cut |
|-----------|---------|---------|
| StatusStepper | 7-step horizontal | Overkill for v1. StatusChip is sufficient |
| FAB with menu | 3-option floating button | FAB = single "Open ChatGPT" link. No menu needed |
| BriefsSelectionDialog | J1 overlay | This happens in ChatGPT, not dashboard |
| DraftingEditor | J2 editor | This happens in ChatGPT |
| FormattingReportOverlay | J3 full-page | View-only: just render the report data in PostDetail tab |

---

## Phase 3: Pages (10 hours total)

### 3.1 Dashboard (2 hours)

**Data source:** `sma-fetch-past-posts` (✅ working) + `sma-fetch-config` (✅ working)

**⚠️ CANNOT use `sma-fetch-post` (404) for pipeline counts.** Workaround: fetch all posts via `sma-fetch-past-posts` and count statuses client-side. This works because we'll have <100 posts for months.

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Pipeline Funnel: [NoDraft] [Drafting] ...   │
├──────────────────────┬──────────────────────┤
│ Action Required      │ Quick Stats          │
│ • 1 post needs       │ • Posts this week: 3 │  
│   review (Previewed) │ • Avg score: 131/160 │
│ • 1 draft ready      │ • Top pillar: career │
│   for format check   │ • Next: Mon 6PM IST  │
├──────────────────────┴──────────────────────┤
│ Week Calendar                                │
│ [Mon ●] [Tue] [Wed ●] [Thu] [Fri ●] [Sat] [Sun] │
└──────────────────────────────────────────────┘
```

**Metrics derived CLIENT-SIDE (no new API needed):**
- Posts this week: filter by `scheduled_date` in current week
- Avg score: average of `scores.total` across published posts
- Top pillar: most frequent `content_pillar`
- Next scheduled: earliest future `scheduled_date`
- Pipeline counts: group by `status`
- Action required: posts with status `Previewed` (need review) or `Drafted` (need formatting)

### 3.2 Posts List (2 hours)

**Data source:** `sma-fetch-past-posts` (✅ working) — returns array with limited fields

**⚠️ PROBLEM:** Working webhook returns: title, content_pillar, scheduled_date, published_at, status, metrics. Does NOT return: `_id`, `scores`, `content`. Without `_id` we can't link to detail page.

**WORKAROUND OPTIONS:**
1. **(BEST)** Satvik builds `sma-fetch-post` workflow (30 min) — returns full data with `_id`
2. **(TEMP)** Use `sma-fetch-past-posts` for list, generate pseudo-IDs from title hash, link to detail page which calls `sma-fetch-post` (but that's also 404...)
3. **(LAST RESORT)** Direct MongoDB query from backend (bypass n8n for reads)

**RECOMMENDATION:** We need `sma-fetch-post` workflow. It's the #1 blocker for the dashboard. List + Detail both need it.

**Layout:**
```
┌──────────────────────────────────────────┐
│ Posts          [All] [Active] [Published] │
│ Search... [↕ Sort by date]               │
├──────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐            │
│ │ [career] 🟢│ │ [startup]  │            │
│ │ Score: 143 │ │ Score: 134 │            │
│ │ "Why I..." │ │ "Driver..." │            │
│ │ Published  │ │ Published  │            │
│ └────────────┘ └────────────┘            │
└──────────────────────────────────────────┘
```

### 3.3 Post Detail (3 hours) — MOST COMPLEX PAGE

**Data source:** `sma-fetch-post` (❌ 404) — BLOCKED

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ← Posts / "Why I turned down PWC..."            │
│ [Published] [career]                    [⋮]     │
├────────────────────────┬────────────────────────┤
│ METADATA               │ LINKEDIN PREVIEW       │
│                        │                        │
│ Score: 143/160 🟢      │ ┌──────────────────┐   │
│ F: 9/10 (×8 = 72)     │ │ SJ Satvik Jain   │   │
│ P: 10/10 (×5 = 50)    │ │ Senior PM @ AmEx  │   │
│ R: 7/10 (×3 = 21)     │ │                   │   │
│                        │ │ Everyone thought  │   │
│ Pillar: career         │ │ I was crazy...    │   │
│ Schedule: Mar 10, 9AM  │ │                   │   │
│ Framework: Narrative   │ │ 👍 245 💬 32 🔄 18│   │
│                        │ └──────────────────┘   │
│ ─────── ACTIONS ────── │                        │
│ [Approve] [Send Back]  │                        │
│ [Reschedule] [Cancel]  │                        │
│                        │                        │
│ ─── STATUS HISTORY ─── │                        │
│ Created: Mar 9         │                        │
│ Formatted: Mar 9       │                        │
│ Published: Mar 10      │                        │
├────────────────────────┴────────────────────────┤
│ ENGAGEMENT (if published)                        │
│ Day 1: 87 | Day 3: 156 | Day 7: 210 | ...      │
└──────────────────────────────────────────────────┘
```

**Actions are context-sensitive per status:**
| Status | Available Actions |
|--------|-------------------|
| Scheduled_NoDraft | "Open ChatGPT to draft" (external link) |
| Drafting | "Open ChatGPT to continue" |
| Drafted | "Open ChatGPT to format" |
| Formatting | (wait — no actions) |
| Previewed | **Approve**, **Send Back**, **Cancel** |
| Ready_ToPublish | **Publish** (one-shot, confirm dialog), **Reschedule** |
| Published | View engagement data |
| Publish_Failed | **Retry** (re-enter Ready), **Cancel** |
| Cancelled | **Uncancel** (→ back to Scheduled_NoDraft) |

**⚠️ "Approve" calls `sma-update-post` (404). "Publish" calls `sma-publish-linkedin` (404). Both blocked on Satvik.**

### 3.4 Analytics (2 hours)

**Data source:** `sma-fetch-past-posts` (✅ working) — has metrics for published posts

**Charts (Recharts):**
1. **Engagement Over Time** — Line chart: x=date, y=engagement_score (calculated: likes×1 + comments×3 + shares×2)
2. **By Pillar** — Horizontal bar chart: avg engagement per pillar
3. **Post Rankings** — Sortable table: title, pillar, score, engagement, date

**⚠️ No multi-day collection yet (Day 1/3/7/14/30).** All metrics are single-snapshot from seed data. Analytics page shows what we HAVE, not what we WISH we had. No resurgence detection until multi-day collection exists.

**Realistic v1 Analytics:**
```
┌────────────────────────────────────────────┐
│ Analytics     [7d] [30d] [90d]             │
├────────────────────────────────────────────┤
│ Posts: 5 | Avg Score: 130/160 | Top: career│
├───────────────────┬────────────────────────┤
│ Engagement/Time   │ By Pillar              │
│ (line chart)      │ (bar chart)            │
├───────────────────┴────────────────────────┤
│ Post Rankings                               │
│ Title          Pillar  Score  Eng.   Date   │
│ Hot take: MBA  hottake 117    896    Mar 5  │
│ PWC            career  143    555    Mar 10 │
│ ...                                         │
└────────────────────────────────────────────┘
```

### 3.5 Settings (3 hours)

**Data source:** `sma-fetch-config` (✅ working) + `sma-save-config` (✅ working)

**7 config docs → 7 tabs:**

| Tab | Config Doc | Status |
|-----|-----------|--------|
| Scoring | `scoring_weights` | ✅ Exists in MongoDB |
| Scales | `scoring_scales` | ✅ Exists |
| Schedule | `posting_schedule` | ✅ Exists |
| Formatting | `formatting_config` | ❌ Need to seed |
| Engagement | `engagement_config` | ❌ Need to seed |
| Review | `review_config` | ❌ Need to seed |
| Analytics | `analytics_config` | ❌ Need to seed |

**Tab 1 - Scoring Weights:**
```
Formula: Score = F×8 + P×5 + R×3 (max 160)

Freshness Weight:      [===========|   ] FIB: 8
Personal Exp Weight:   [=======|       ] FIB: 5  
Research Quality Weight:[====|          ] FIB: 3

Thresholds:
  Min Freshness:       [5] /10
  Min Personal Exp:    [3] /10
  Min Research:        [2] /10
  Min Total Score %:   [50] %

Top N for comparison:  [3]
Lookback days:         [14]
```

**Fibonacci slider behavior:**
Discrete steps: 1, 2, 3, 5, 8, 13 (only valid Fibonacci values)
MUI Slider with `marks` and `step={null}` for discrete values.

**Save flow:**
1. User edits fields
2. Click "Save" → ReviewChangesDialog opens
3. Dialog shows before/after comparison table
4. "Confirm" → PUT /api/config with { config_id, data }
5. Success snackbar
6. Fail → error banner with retry

---

## Phase 4: Build Order (dependency graph)

```
SPRINT 0 (Setup — 30 min):
  [ ] Seed 4 missing MongoDB config docs
  [ ] Fix backend .env (N8N_BASE_URL, CORS_ORIGIN)
  [ ] Add @tanstack/react-query to package.json
  [ ] npm install
  [ ] Verify: backend starts, frontend starts, health check passes

SPRINT 1 (Theme + Layout — 1 hour):
  [ ] theme.js (teal palette, light+dark, pillar colors, status colors)
  [ ] NavigationRail.jsx (custom Drawer, 4 items, 2 external links)
  [ ] TopAppBar.jsx (logo, dark mode toggle)
  [ ] App.jsx (router, layout shell, QueryClientProvider)
  [ ] api/client.js (merge from frontend/ spec, adapt hooks)
  MILESTONE: app renders with nav + empty pages

SPRINT 2 (Core Components — 2 hours):
  Batch A (independent):
    [ ] ScoreRing.jsx (SVG, conditional color, /160)
    [ ] StatusChip.jsx (9 variants)
    [ ] PillarChip.jsx (7 pillars)
    [ ] MetricCard.jsx
    [ ] EmptyState.jsx
    [ ] ErrorBanner.jsx
  Batch B (depends on A):
    [ ] PostCard.jsx (uses ScoreRing + StatusChip + PillarChip)
    [ ] PipelineFunnel.jsx (uses StatusChip)
    [ ] LinkedInPreview.jsx
    [ ] ScoreBreakdown.jsx
  MILESTONE: storybook-like demo page showing all components

SPRINT 3 (Dashboard — 1.5 hours):
  [ ] Dashboard.jsx (PipelineFunnel + ActionRequired + WeekCalendar + MetricCards)
  [ ] ActionRequired.jsx
  [ ] WeekCalendar.jsx
  [ ] usePipeline() → calls sma-fetch-past-posts, aggregates client-side
  MILESTONE: dashboard shows real data from MongoDB

SPRINT 4 (Settings — 2 hours):
  [ ] Settings.jsx (Tab container)
  [ ] ScoringTab.jsx (Fibonacci sliders + thresholds)
  [ ] ScalesTab.jsx (rules editor — read-only v1)
  [ ] ScheduleTab.jsx (day chips + time picker)
  [ ] FormattingTab.jsx, EngagementTab.jsx, ReviewTab.jsx, AnalyticsTab.jsx
  [ ] ReviewChangesDialog.jsx (before/after)
  MILESTONE: settings loads real configs, saves changes

SPRINT 5 (Analytics — 1.5 hours):
  [ ] Analytics.jsx (period selector + charts + table)
  [ ] Recharts: LineChart, BarChart integration
  [ ] Post rankings DataTable (sortable)
  [ ] Engagement calculation: likes×1 + comments×3 + shares×2
  MILESTONE: analytics shows real engagement data from 7 posts

SPRINT 6 (Posts List + Detail — 3 hours):
  ⚠️ PARTIALLY BLOCKED on sma-fetch-post
  [ ] PostsList.jsx (uses sma-fetch-past-posts, limited fields)
  [ ] PostDetail.jsx (NEEDS sma-fetch-post for full data)
  [ ] Action buttons (NEEDS sma-update-post)
  [ ] Publish button (NEEDS sma-publish-linkedin)
  WORKAROUND: build UI with mock data for detail view, swap when webhook ready
  MILESTONE: posts list shows real data, detail shows mock data

SPRINT 7 (States + Polish — 2 hours):
  [ ] Loading skeletons (all 5 pages)
  [ ] Error states (all 5 pages)
  [ ] Empty states (no posts, no analytics)
  [ ] Dark mode full validation
  [ ] Responsive: 1440 → 1024 → 768
  [ ] Snackbar provider (success/error/warning)
  [ ] Confirm dialogs (publish, cancel)
  MILESTONE: production-ready UI

TOTAL: ~14 hours (down from 20-25h in v1)
```

### Sprint Dependencies Graph
```
Sprint 0 ──→ Sprint 1 ──→ Sprint 2 ──→ Sprint 3 (Dashboard)
                                    ├──→ Sprint 4 (Settings)  
                                    ├──→ Sprint 5 (Analytics)
                                    └──→ Sprint 6 (Posts) ← BLOCKED on n8n
                                         ↓
                                    Sprint 7 (Polish)
```

Sprints 3, 4, 5 can run **IN PARALLEL** after Sprint 2.
Sprint 6 is partially blocked but list view works.
Sprint 7 depends on all pages existing.

---

## What ACTUALLY Works End-to-End Right Now

| Flow | Works? | Blocking Issue |
|------|--------|---------------|
| Dashboard → see pipeline counts | ✅ | Uses sma-fetch-past-posts (working) |
| Dashboard → see metrics | ✅ | Calculated client-side from working data |
| Settings → view configs | ✅ | sma-fetch-config works |
| Settings → save configs | ✅ | sma-save-config works |
| Analytics → see charts | ✅ | Uses metrics from sma-fetch-past-posts |
| Posts → see list | ⚠️ PARTIAL | sma-fetch-past-posts works but no `_id` field |
| Posts → see detail | ❌ | sma-fetch-post is 404 |
| Posts → approve/reject | ❌ | sma-update-post is 404 |
| Posts → publish | ❌ | sma-publish-linkedin is 404 |
| Notifications | ❌ | sma-notify-telegram is 404 |
| Analytics → submit metrics | ❌ | sma-analytics-collect is 404 |

**70% of the dashboard works with existing webhooks.**
**100% of Settings works right now.**
**Posts detail/actions are the only fully blocked feature.**

---

## Global Fix Checklist (33 items → 28 after dedup)

Removed 5 items from v1 that overlap or don't apply:

| # | Component | Fix | Priority |
|---|-----------|-----|----------|
| 1 | ScoreRing | /160 not /100 | P0 |
| 2 | ScoreBreakdown | F×8 + P×5 + R×3 | P0 |
| 3 | ScoreBreakdown | Labels: Freshness, Personal Experience, Research Quality | P0 |
| 4 | PillarChip | 7 names: ai_automation, startup, pm, career, hottake, personal, howto | P0 |
| 5 | PillarChip | 7 colors + weights (25/20/20/15/10/5/5) | P0 |
| 6 | NavigationRail | 4 items, LEFT sidebar, NO top nav | P0 |
| 7 | ALL | Remove user profile/avatar/bell/search | P1 |
| 8 | theme.js | Teal primary #006a6a, warm dark #221610 | P1 |
| 9 | StatusChip | 9 statuses with distinct colors | P1 |
| 10 | PipelineFunnel | Always 7 chips | P1 |
| 11 | LinkedInPreview | "Satvik Jain, Senior PM at American Express" | P1 |
| 12 | MetricCard | No clicks/impressions/followers (no API) | P1 |
| 13 | Settings/Scoring | Fibonacci discrete steps: 1,2,3,5,8,13 | P1 |
| 14 | Settings/Scoring | Label fix: Freshness/PersonalExp/Research | P1 |
| 15 | Settings/Schedule | Posts per day not in schema → use day_preferences instead | P1 |
| 16 | Dashboard | Add ActionRequired + WeekCalendar | P1 |
| 17 | Analytics | Engagement formula: likes×1 + comments×3 + shares×2 | P1 |
| 18 | ALL | Year 2026, no footer | P2 |
| 19 | Settings/Voice | "vulnerable-conversational" tone | P2 |
| 20 | PostDetail | No Twitter tab — LinkedIn only | P2 |
| 21 | ALL | Loading skeletons | P2 |
| 22 | ALL | Error states with retry | P2 |
| 23 | ALL | Dark mode (warm dark, teal accents) | P2 |
| 24 | PostDetail | Context-sensitive actions per status | P2 |
| 25 | Posts | Empty state with "Open ChatGPT" CTA | P2 |
| 26 | Dashboard | "Open ChatGPT" FAB (external link, not in-app) | P2 |
| 27 | Analytics | No resurgence detection v1 (no multi-day data) | P2 |
| 28 | Settings | ReviewChangesDialog on save | P2 |

---

## Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | `sma-fetch-post` never built → no post detail | HIGH | HIGH | Build mock data layer; nag Satvik; or add direct MongoDB route as bypass |
| 2 | MUI v6 M3 theming breaks with custom palette | MEDIUM | MEDIUM | Test theme.js early in Sprint 1; fallback to M2 styling |
| 3 | `sma-fetch-past-posts` doesn't return `_id` | HIGH | MEDIUM | Add `_id` to n8n workflow response OR generate from title hash |
| 4 | 4 config docs never seeded | LOW | LOW | We seed them ourselves in Sprint 0 |
| 5 | n8n container stops/restarts → webhooks down | MEDIUM | HIGH | Backend error handling already exists; add health check to dashboard |
| 6 | Dark mode color contrast fails WCAG | MEDIUM | LOW | Test with Chrome DevTools contrast checker |
| 7 | Recharts bundle size too large | LOW | LOW | Tree-shake: import only LineChart, BarChart |
| 8 | Fibonacci slider UX confusing | MEDIUM | LOW | Add tooltip "Score doubles with each step" |

---

## Satvik's Critical Path (unblock the dashboard)

**Minimum to make Posts page work (2 items, ~40 min total):**

1. **Build `sma-fetch-post` n8n workflow** (20 min)
   - Input: `{ action: "get"|"list"|"pipeline_summary", post_id?, filters?, sort?, page?, limit? }`
   - For "get": return full post document from `linkedin_posts` by `_id`
   - For "list": return posts with ALL fields (including `_id`, `scores`, `content`)
   - For "pipeline_summary": return `{ counts: { Scheduled_NoDraft: 0, Drafting: 1, ... } }`

2. **Build `sma-update-post` n8n workflow** (20 min)
   - Input: `{ post_id, status?, content?, scheduled_date?, metadata? }`
   - Merge updates into existing document
   - Return updated document

**Everything else (publish, notify, analytics-collect) can wait.**
