# LinkRight SMA — React Dashboard Build Plan

**Goal:** Take 36 Stitch HTML screens → production React + MUI v6 + Material 3 app
**Tech:** React 18 + Vite + MUI v6 + Material 3 Design Kit + Recharts + React Router
**Data:** All via n8n webhooks through Express.js proxy (already built at `ui/backend/`)

---

## Phase 0: Inventory (DONE)

**36 unique Stitch screens:**
- Dashboard: 9 variants (light/dark/empty/loading/teal)
- Analytics: 5 variants (light v1/v2/dark/empty/j5-review)
- Posts: 6 (list light/dark, empty/empty-v2, detail light/dark)
- Settings: 6 (main light, dark/dark-v2, error, loading, review dialog)
- Journeys: 7 (briefs J1, drafting J2, formatting J3×2, review J4, batch J4, conflicts J1)
- Strategy: 1 (AI recommendations)
- Dialogs: 1 (notifications/warnings)

---

## Phase 1: Foundation (MUST DO FIRST)

### 1.1 Theme Setup
**Source:** `ui/frontend/m3-design-tokens.md` + Stitch color analysis
**File:** `src/theme.js`

```
CHANGES FROM STITCH:
- Source color: #1B6B3A (keep — green/LinkedIn alignment)
- Light mode primary: #1B6B3A → keep
- Dark mode primary: #89D89E → keep
- Remove all orange/navy from Stitch screens (ContentPro CMS remnants)
- Pillar chip colors: use our 7 defined colors (not Stitch generic)
- Score ring conditional: green ≥80, amber 60-79, red <60 (out of 160)
```

### 1.2 Layout Shell
**Source:** `analytics-empty.html` (best NavRail), `dashboard-dark-v3.html`
**Files:** `src/App.jsx`, `src/components/NavRail.jsx`, `src/components/TopAppBar.jsx`

```
FIXES FROM STITCH:
- NavRail: ALWAYS left sidebar (256px expanded, 80px collapsed)
  NOT top navigation bar (Stitch inconsistent across screens)
- 4 nav items ONLY: Dashboard (📊), Posts (📝), Analytics (📈), Settings (⚙️)
- Remove: Content, Schedule, Briefs, Drafts, Calendar, Audience, Inbox
- Remove: notification bell, search icon, user avatar/profile
- Remove: "Alex Morgan/Rivera/Rivers", "Pro Account", "Admin", "Workspace"
- Bottom links (below divider): ChatGPT ↗, Telegram ↗
- Dark mode toggle: keep (moon/sun icon in TopAppBar)
- TopAppBar: "LinkRight SMA" + logo (40px green diamond) + dark toggle
- No footer ("© 2024" → remove entirely)
```

### 1.3 Router Setup
**File:** `src/App.jsx`

```
Routes:
  /                → redirect to /dashboard
  /dashboard       → Dashboard.jsx
  /posts           → Posts.jsx (list view)
  /posts/:id       → PostDetail.jsx
  /analytics       → Analytics.jsx
  /settings        → Settings.jsx
  /settings/:tab   → Settings.jsx with tab pre-selected
```

---

## Phase 2: Shared Components (BUILD ONCE, USE EVERYWHERE)

### 2.1 ScoreRing
**Source:** posts-list (score circles), post-detail (large ring)
**File:** `src/components/ScoreRing.jsx`

```
FIXES FROM STITCH:
- Scale: /160 (NOT /100)
- Formula display: "F×8 + P×5 + R×3" (NOT "F×2 + P×3 + R×5")  
- Colors: green ≥80 (50%), amber 60-79 (37-49%), red <60 (<37%)
  Stitch shows green for 65/100 → WRONG, 65/160=40.6% → should be amber
- Sizes: small (40px, for cards), medium (64px, for detail), large (96px, for dashboard stat)
```

### 2.2 StatusChip
**Source:** posts-list, dashboard pipeline
**File:** `src/components/StatusChip.jsx`

```
FIXES FROM STITCH:
- 9 statuses (not 6-7 inconsistent):
  Scheduled_NoDraft (gray), Drafting (light green), Drafted (medium green),
  Formatting (teal light), Previewed (teal), Ready_ToPublish (green light),
  Published (green filled), Publish_Failed (red), Cancelled (gray strikethrough)
- Label: "Scheduled" → "No Draft"
- Label: "Ready" → "Ready to Publish"
- Stitch uses: "PUBLISHED", "DRAFTING", "PREVIEWED" (caps) → use sentence case
```

### 2.3 PillarChip
**Source:** posts-list (chip colors)
**File:** `src/components/PillarChip.jsx`

```
FIXES FROM STITCH (CRITICAL — wrong in EVERY screen):
  "Product Features" → ai_automation (#2196F3 blue)
  "Company Culture" → startup (#FF9800 orange)
  "Industry Insights" → pm (#9C27B0 purple)
  "Customer Stories" → career (#4CAF50 green)
  "Tech Trends" → hottake (#F44336 red)
  "Tutorials" → personal (#E91E63 pink)
  "News & Events" → howto (#009688 teal)
  "SAAS TRENDS" → DROP (not a real pillar)
  
Weights (for Settings page):
  ai_automation: 25%, startup: 20%, pm: 20%, career: 15%,
  hottake: 10%, personal: 5%, howto: 5%
```

### 2.4 PipelineFunnel
**Source:** dashboard-dark-v3 (7 chips), dashboard-light-v4
**File:** `src/components/PipelineFunnel.jsx`

```
FIXES FROM STITCH:
- ALWAYS 7 chips (some screens show 6 — missing "Published")
- Order: No Draft → Drafting → Drafted → Formatting → Previewed → Ready → Published
- Each chip: count number + status label + clickable → /posts?status=X
- Arrow connector between chips (chevron_right SVG)
```

### 2.5 MetricCard
**Source:** dashboard (4 cards), analytics (4 cards)
**File:** `src/components/MetricCard.jsx`

```
FIXES FROM STITCH:
Dashboard cards:
  "Total Posts 142" → "Posts this week: 3/5" (we don't have 142 posts!)
  "Avg Engagement 78" → "Avg engagement: 151" (our actual metric)
  "Best Pillar" → keep
  "Next Scheduled" → keep
  
Analytics cards:
  "Total Clicks" → "Posts published" (NO LinkedIn click API)
  "Impressions" → "Avg engagement" (NO impression API)
  "Engagement Rate" → keep (= engagement/followers × 100)
  "New Followers" → "Top pillar" (NO follower API)
```

### 2.6 PostCard
**Source:** posts-list (2×2 grid card)
**File:** `src/components/PostCard.jsx`

```
FIXES FROM STITCH:
- Score ring: /160 not /100
- Pillar chip: use our 7 names + colors
- Status chip: use our 9 statuses
- Date: 2026 not 2023
- Truncated preview text (max 2 lines)
- Click → /posts/:id
- Action icons: edit only (no share — we can't share from dashboard)
```

### 2.7 LinkedInPreview
**Source:** post-detail (right column mock), formatting-report (right panel)
**File:** `src/components/LinkedInPreview.jsx`

```
FIXES FROM STITCH:
- Profile: "Satvik Jain" (NOT Alex Rivers/Morgan)
- Subtitle: "Senior PM at American Express"
- Avatar: "SJ" initials in primary color circle
- Remove: Twitter tab (LinkedIn only v1)
- Reactions: 👍 Like, 💬 Comment, 🔄 Repost, 📤 Send
- Character count: show at bottom
```

### 2.8 ScoreBreakdown
**Source:** post-detail (F/P/R bars)
**File:** `src/components/ScoreBreakdown.jsx`

```
FIXES FROM STITCH (CRITICAL):
- Labels: "Fluency" → "Freshness (F)"
  "Precision" → "Personal Experience (P)"  
  "Readability" → "Research Quality (R)"
- Scale: each dimension 1-10, weight shown
- Formula: Score = F×8 + P×5 + R×3
- Example: F=8, P=7, R=6 → 64+35+18 = 117/160
- Progress bar: value/10 as percentage
```

### 2.9 StatusStepper
**Source:** post-detail (horizontal timeline)
**File:** `src/components/StatusStepper.jsx`

```
7 steps: No Draft → Drafting → Drafted → Formatting → Previewed → Ready → Published
Completed: filled green circle + solid connector
Current: filled green + pulsing ring  
Future: outlined gray + dashed connector
```

### 2.10 ActionRequired
**Source:** dashboard-dark-v3
**File:** `src/components/ActionRequired.jsx`

```
3 priority levels: Urgent (red, today), Soon (teal, tomorrow), Info (gray, gap)
Each item: priority dot + label + post title + description + action button
Empty state: "All caught up!" with checkmark
```

### 2.11 WeekCalendar
**Source:** dashboard-empty-v2
**File:** `src/components/WeekCalendar.jsx`

```
Mon-Sun day cards showing scheduled posts
Today highlighted with left border
Click empty day → /posts?date=YYYY-MM-DD
Click post day → /posts/:id
```

### 2.12 FAB (Floating Action Button)
**Source:** Figma spec (missing from most Stitch screens)
**File:** `src/components/FAB.jsx`

```
Position: fixed bottom-right
Label: "+ New Post"
On click: menu with 3 options → all open ChatGPT external
  "Plan (Ideation)", "Draft", "Quick Post"
```

---

## Phase 3: Pages (5 core pages)

### 3.1 Dashboard (`/dashboard`)
**Primary source:** `dashboard-dark-v3.html` (best variant)
**Reference:** `dashboard-light-v4`, `dashboard-empty-v2`, `dashboard-loading`

```
Layout (top to bottom, scrollable):
1. Pipeline Funnel (7 chips with counts)
2. Action Required (urgent items list)
3. Weekly Calendar (Mon-Sun)
4. Quick Stats (4 metric cards)
+ FAB bottom-right

States: loaded, loading (skeleton), empty (no posts), error
```

### 3.2 Posts List (`/posts`)
**Primary source:** `posts-list.html` + `posts-list-dark.html`
**Reference:** `posts-empty-v2.html`

```
Layout:
1. Page title: "Posts" (NOT "Content Library")
2. Filter bar: SegmentedButton (All/Active/Published/Cancelled) + search + sort
3. Post cards in responsive grid (2-col desktop, 1-col mobile)
4. Pagination
+ FAB bottom-right

FIXES:
- Remove "Alex Rivera / Admin"
- Remove "Content Library" → "Posts"
- Dates: 2026
- Filter tabs: All, Active (Drafting→Ready), Published, Cancelled
```

### 3.3 Post Detail (`/posts/:id`)
**Primary source:** `post-detail.html` + `post-detail-dark.html` + `post-review-j4.html`

```
Layout:
1. Breadcrumb: Posts / {post title}
2. Status Stepper (7-step horizontal)
3. Split view:
   Left (40%): Metadata panel + ScoreBreakdown + edit fields
   Right (60%): LinkedInPreview mock
4. Action bar: context-sensitive buttons per status
5. History timeline (status changes log)
6. Engagement table (published posts only — Day 1,3,7,14,30)

FIXES:
- "Alex Rivers" → "Satvik Jain"
- Dimension labels: F/P/R with correct names
- Score /160
- Remove Twitter tab
- Remove "FORMAT_BOLD MOOD" text → actual toolbar icons
- Revision tracking: "REVISION 2/5" badge (from drafting-editor)
```

### 3.4 Analytics (`/analytics`)
**Primary source:** `analytics-v2.html` + `analytics-dark.html` + `analytics-j5-review.html`
**Reference:** `analytics-empty.html`, `strategy-recommendations.html`

```
Layout:
1. Time range selector: 7d / 30d / 90d (SegmentedButton)
2. Overview cards (4 metrics)
3. Engagement Over Time (line chart — Recharts)
4. Side-by-side: By Pillar (horizontal bars) + By Framework (horizontal bars)
5. Post Rankings table (sortable)
6. Resurgence alert banner (conditional)
7. Collection schedule (conditional)

FIXES:
- Metric cards: remove Clicks/Impressions/Followers (no API)
  Use: Posts Published, Avg Engagement, Avg Rate, Top Pillar
- Chart: engagement score line, not "Likes/Other"
- Pillars: our 7 with correct colors
- Resurgence: Day14 > Day7 by >20%
- Score /160
- Add engagement_rate column to rankings table
```

### 3.5 Settings (`/settings`)
**Primary source:** `settings-main.html` + `settings-dark.html` + `screen-1.html` (review dialog)
**Reference:** `settings-error.html`, `settings-loading.html`, `strategy-recommendations.html`

```
Layout:
1. Page title: "Settings"
2. Tabs: Scoring | Schedule | Formatting | Engagement | Review | Analytics | Account
3. Tab content (one visible at a time)
4. Save / Reset buttons per tab

Tab 1 - Scoring:
  - Formula: Score = F×8 + P×5 + R×3 (FIX from F×2+P×3+R×5!)
  - 3 Fibonacci sliders: Freshness(8), PersonalExp(5), Research(3)
  - Labels: NOT "Follower Weight/Post Frequency/Reach"
  - Threshold inputs: min score 80, min F≥5, P≥3, R≥2
  - Impact preview

Tab 2 - Schedule:
  - Day chips: Mon/Wed/Fri default (keep from Stitch ✅)
  - Time: 06:00 PM default (keep ✅)
  - Posts per day: 1 (NOT 3!)
  - Planning horizon: 7 days
  - Publish delay: 0-60 min

Tab 3 - Formatting:
  - 10 fields from formatting_config (min/max chars, emojis, hashtags, FK grade, etc.)
  - 2 switches (staircase layout, uppercase headers)

Tab 4 - Engagement:
  - Weights: Like=1, Comment=2, Share=3
  - Collection days: 1,3,7,14,30 (FilterChips)
  - Resurgence threshold: 20%

Tab 5 - Review:
  - 5 switches (auto-approve, max edits, require formatting, allow reschedule, allow send back)

Tab 6 - Analytics:
  - Default period, min posts, confidence, trend window
  - 7 pillar priority sliders (must sum 100%)

Tab 7 - Account:
  - Read-only: Satvik Jain, Senior PM at AmEx
  - Connected services: LinkedIn, Sheets, Notion, Telegram (status badges)
  - n8n webhook base URL

States: loaded, loading (skeleton from settings-loading), error (from settings-error)
Save confirmation: review dialog (from screen-1) with before/after table
Strategy recommendations: optional banner (from strategy-recommendations)
```

---

## Phase 4: Journey Screens (OVERLAY/DIALOG, not separate pages)

### 4.1 Briefs Selection (J1)
**Source:** `briefs-selection.html`
**Trigger:** "Plan Content" from Dashboard FAB or ChatGPT redirect
**Implementation:** Dialog/modal overlay on Dashboard

### 4.2 Drafting Editor (J2)
**Source:** `drafting-editor.html`
**Trigger:** Click "Draft" on a Scheduled_NoDraft post
**Implementation:** Editor mode within PostDetail page (not separate page)

### 4.3 Formatting Report (J3)
**Source:** `formatting-report.html`
**Trigger:** After formatting step completes, or click "View Report"
**Implementation:** Full-page overlay or dedicated tab in PostDetail

### 4.4 Post Review (J4)
**Source:** `post-review-j4.html`, `batch-review.html`
**Trigger:** Click on Previewed post
**Implementation:** Review mode within PostDetail + batch summary dialog

### 4.5 Scheduling Conflicts (J1)
**Source:** `scheduling-conflicts.html`
**Trigger:** When scheduling violates rules (max 3/week, 1/day, similarity)
**Implementation:** Alert banner + dialog within Dashboard/Posts

### 4.6 Dialogs & Notifications
**Source:** `dialogs-notifications.html`
**Implementation:** Reusable dialog components + Snackbar provider

```
Dialogs:
- UnsavedChanges: "Keep Editing" / "Discard"
- PublishWarning: "One-shot. No retry." + "Publish Now"
- ReviewChangesDialog: Before/after config comparison table
- CancelPost: Type "cancel" to confirm

Snackbars:
- Error: red, with RETRY action
- Warning: amber, with dismiss
- Success: green, auto-dismiss 5s
```

---

## Phase 5: Data Layer

### 5.1 API Client
**File:** `src/api.js` (already exists, needs expansion)
**Backend:** `ui/backend/server.js` (already built, 14 routes)

```
Endpoints (via Express proxy → n8n webhooks):
GET  /api/posts         → sma-fetch-briefs (list)
GET  /api/posts/:id     → sma-fetch-post (detail)
PUT  /api/posts/:id     → sma-update-post
POST /api/posts         → sma-save-post (create)
GET  /api/config        → sma-fetch-config
PUT  /api/config        → sma-save-config
GET  /api/analytics     → sma-analytics-collect
POST /api/publish/:id   → sma-publish-linkedin
POST /api/notify        → sma-notify-telegram

BLOCKED (needs Satvik's n8n work):
  sma-fetch-post (cmg.4.1)
  sma-update-post (cmg.4.2)
  sma-publish-linkedin (cmg.4.3)
  sma-notify-telegram (cmg.4.4)
  sma-analytics-collect (cmg.4.5)
```

### 5.2 State Management
**Approach:** React Query (TanStack Query) for server state + useState for UI state
**No Redux** — overkill for single-user app

### 5.3 Mock Data
**For development** before n8n workflows exist:
- 5 mock posts across all statuses
- Mock config docs (7 configs)
- Mock analytics data (engagement scores)

---

## Phase 6: Build Order (dependency-sorted)

```
SPRINT 1 (Foundation — 2-3 hours):
  [x] theme.js (M3 tokens, light/dark)
  [x] App.jsx (router + layout shell)
  [x] NavRail.jsx (4 items + external links)
  [x] TopAppBar.jsx (logo + dark toggle)
  [x] Mock data files

SPRINT 2 (Shared Components — 3-4 hours):
  [ ] StatusChip.jsx (9 variants)
  [ ] PillarChip.jsx (7 pillars + colors)
  [ ] ScoreRing.jsx (conditional colors, /160)
  [ ] MetricCard.jsx (icon + value + label + delta)
  [ ] PostCard.jsx (composing StatusChip + PillarChip + ScoreRing)
  [ ] PipelineFunnel.jsx (7 chips)
  [ ] FAB.jsx (menu with 3 options)

SPRINT 3 (Dashboard — 2-3 hours):
  [ ] Dashboard.jsx (funnel + action required + calendar + stats)
  [ ] ActionRequired.jsx
  [ ] WeekCalendar.jsx
  [ ] Empty/loading/error states

SPRINT 4 (Posts — 3-4 hours):
  [ ] Posts.jsx (list with filters + search + pagination)
  [ ] PostDetail.jsx (split view + stepper + actions)
  [ ] LinkedInPreview.jsx
  [ ] ScoreBreakdown.jsx
  [ ] StatusStepper.jsx
  [ ] History timeline component

SPRINT 5 (Analytics — 2-3 hours):
  [ ] Analytics.jsx (charts + table + resurgence)
  [ ] Recharts integration (LineChart, BarChart)
  [ ] Post rankings DataTable

SPRINT 6 (Settings — 3-4 hours):
  [ ] Settings.jsx (7 tabs)
  [ ] ScoringTab.jsx (Fibonacci sliders)
  [ ] ScheduleTab.jsx (day chips + time)
  [ ] FormattingTab.jsx, EngagementTab.jsx, ReviewTab.jsx, AnalyticsTab.jsx, AccountTab.jsx
  [ ] ReviewChangesDialog.jsx (before/after)

SPRINT 7 (Journey overlays — 2-3 hours):
  [ ] BriefsSelectionDialog.jsx (J1)
  [ ] FormattingReportOverlay.jsx (J3)
  [ ] SchedulingConflictsBanner.jsx (J1)
  [ ] Dialog components (unsaved, publish, cancel)
  [ ] Snackbar provider

SPRINT 8 (Polish — 2 hours):
  [ ] Dark mode full pass
  [ ] Responsive breakpoints (1440 → 1024 → 768 → 375)
  [ ] Loading skeletons for all pages
  [ ] Error states for all pages
  [ ] Keyboard navigation
```

**Total estimated: ~20-25 hours of dev work**

---

## Global Search-Replace Checklist (for every component/page)

| # | Find | Replace With |
|---|------|-------------|
| 1 | `/100` or `of 100` | `/160` |
| 2 | `F×2` or `F*2` | `F×8` |
| 3 | `P×3` or `P*3` | `P×5` |
| 4 | `R×5` or `R*5` | `R×3` |
| 5 | `Fluency` | `Freshness` |
| 6 | `Precision` | `Personal Experience` |
| 7 | `Readability` | `Research Quality` |
| 8 | `Follower Weight` | `Freshness` |
| 9 | `Post Frequency` | `Personal Experience` |
| 10 | `Reach` | `Research Quality` |
| 11 | `Product Features` | `ai_automation` |
| 12 | `Company Culture` | `startup` |
| 13 | `Industry Insights` | `pm` |
| 14 | `Customer Stories` | `career` |
| 15 | `Tech Trends` | `hottake` |
| 16 | `Tutorials` | `personal` |
| 17 | `News & Events` | `howto` |
| 18 | `SAAS TRENDS` | (remove) |
| 19 | `Alex Rivers` / `Alex Morgan` / `Alex Rivera` | `Satvik Jain` |
| 20 | `Social Media Manager` | `Senior PM at American Express` |
| 21 | `Marketing Team A` | (remove) |
| 22 | `Workspace Admin` | (remove) |
| 23 | `Pro Account` / `Free Plan` | (remove) |
| 24 | `2023` / `2024` (year) | `2026` |
| 25 | `Posts per Day: 3` | `Posts per Day: 1` |
| 26 | `Friendly & Conversational` | `vulnerable-conversational` |
| 27 | `Content Library` | `Posts` |
| 28 | `Total Clicks` | `Posts Published` |
| 29 | `Impressions` | `Avg Engagement` |
| 30 | `New Followers` | `Top Pillar` |
| 31 | `Home` (nav) | `Dashboard` |
| 32 | `Skill Building` (strategy) | Use our 7 pillar names |
| 33 | `Participation` / `Quiz Scores` | Use F/P/R dimension names |

---

## Dependencies on Satvik

Before the app is **fully functional** (not just visual):

| # | Task | Beads ID | Status |
|---|------|----------|--------|
| 1 | Build FetchPostById n8n workflow | cmg.4.1 | ❌ Blocked |
| 2 | Build UpdatePost n8n workflow | cmg.4.2 | ❌ Blocked |
| 3 | Build PublishLinkedIn n8n workflow | cmg.4.3 | ❌ Blocked |
| 4 | Build NotifyTelegram n8n workflow | cmg.4.4 | ❌ Blocked |
| 5 | Build AnalyticsCollect n8n workflow | cmg.4.5 | ❌ Blocked |
| 6 | Create analytics_config in MongoDB | cmg.4.6 | ❌ Blocked |
| 7 | Verify SavePost handles new fields | cmg.4.7 | ❌ Blocked |

**I can build the ENTIRE UI with mock data** — it'll look and feel production-ready.
When Satvik builds the n8n workflows, we just swap mock data for real API calls.

---

## Decision: Start Now?

Say `go` and I'll spawn agents for Sprint 1+2 in parallel. 
The app will be runnable at `localhost:5173` within 1-2 hours.
