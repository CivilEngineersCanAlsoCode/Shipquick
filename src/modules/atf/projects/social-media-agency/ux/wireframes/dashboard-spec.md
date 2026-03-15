# Dashboard Wireframe Specification

**Design system:** Google Material 3
**Layout:** Desktop-first, responsive (min 1024px, optimal 1440px)
**Framework:** Pipeline Status Dashboard (NOT chat-first)
**User:** Single user (Satvik), no multi-user/RBAC needed

---

## Global Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (64px)                                                      │
│  ┌──────┬──────────────────────────────────────────┬───────────────┐│
│  │ Logo │  LinkRight SMA                           │ 🔔  👤 Satvik ││
│  └──────┴──────────────────────────────────────────┴───────────────┘│
├────────────┬────────────────────────────────────────────────────────┤
│            │                                                        │
│  SIDEBAR   │  MAIN CONTENT AREA                                     │
│  (256px)   │  (remaining width, min 768px)                          │
│            │                                                        │
│  Nav Rail  │  ┌──────────────────────────────────────────────────┐  │
│  M3 style  │  │  Page Header + Breadcrumbs                      │  │
│            │  ├──────────────────────────────────────────────────┤  │
│  Dashboard │  │                                                  │  │
│  Posts     │  │  Page Content                                    │  │
│  Analytics │  │  (scrollable)                                    │  │
│  Settings  │  │                                                  │  │
│            │  │                                                  │  │
│            │  │                                                  │  │
│            │  └──────────────────────────────────────────────────┘  │
│            │                                                        │
├────────────┴────────────────────────────────────────────────────────┤
│  (no footer — content extends to bottom)                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Material 3 Component Library

### Core Components Used

| Component | M3 Name | Usage |
|-----------|---------|-------|
| **Navigation rail** | `NavigationRail` | Sidebar nav (Dashboard, Posts, Analytics, Settings) |
| **Top app bar** | `TopAppBar` (medium) | Header with title + actions |
| **Cards** | `FilledCard`, `OutlinedCard` | Pipeline cards, post cards, metric cards |
| **Chips** | `FilterChip`, `AssistChip` | Status filters, pillar tags, action triggers |
| **Data table** | `DataTable` | Post lists, analytics tables |
| **FAB** | `ExtendedFAB` | Primary action per page |
| **Dialogs** | `AlertDialog`, `FullScreenDialog` | Confirmations, post preview |
| **Snackbar** | `Snackbar` | Success/error notifications |
| **Progress indicators** | `LinearProgress`, `CircularProgress` | Loading states, pipeline progress |
| **Badges** | `Badge` | Notification counts, status indicators |
| **Icon buttons** | `IconButton` | Actions (edit, delete, refresh) |
| **Menus** | `DropdownMenu` | Filters, sort options |
| **Tabs** | `Tabs` | Sub-views within pages |
| **Tooltips** | `PlainTooltip` | Hover explanations |
| **Dividers** | `Divider` | Section separation |
| **Switch** | `Switch` | Settings toggles |
| **Text fields** | `OutlinedTextField` | Config editing |
| **Sliders** | `Slider` | Weight adjustment |

### Color Tokens (M3 Dynamic Color)

| Token | Usage |
|-------|-------|
| `primary` | Active nav item, FAB, primary buttons |
| `secondary` | Status chips, secondary actions |
| `tertiary` | Analytics accents, chart colors |
| `error` | Failed states, alerts |
| `surface` | Card backgrounds |
| `surfaceVariant` | Muted cards, disabled states |
| `onSurface` | Primary text |
| `onSurfaceVariant` | Secondary text |

### Status Color Mapping

| Status | Color | Chip Variant |
|--------|-------|-------------|
| Scheduled_NoDraft | `surfaceVariant` (grey) | Outlined |
| Drafting | `secondaryContainer` (light blue) | Tonal |
| Drafted | `secondary` (blue) | Tonal |
| Formatting | `tertiaryContainer` (light purple) | Tonal |
| Previewed | `tertiary` (purple) | Tonal |
| Ready_ToPublish | `primaryContainer` (light green) | Tonal |
| Published | `primary` (green) | Filled |
| Publish_Failed | `errorContainer` (red) | Filled |
| Cancelled | `surfaceVariant` (grey) | Outlined, strikethrough |

---

## View 1: Pipeline Overview (Dashboard Home)

**URL:** `/dashboard`
**Purpose:** At-a-glance pipeline health — answer "What needs my attention?"

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Pipeline Overview                              🔄 Refresh   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─── PIPELINE FUNNEL ──────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Scheduled    Drafting    Drafted    Formatting           │   │
│  │  ┌──────┐    ┌──────┐   ┌──────┐   ┌──────┐             │   │
│  │  │  3   │ →  │  0   │→  │  2   │→  │  0   │             │   │
│  │  │ posts│    │ posts│   │ posts│   │ posts│              │   │
│  │  └──────┘    └──────┘   └──────┘   └──────┘             │   │
│  │                                                          │   │
│  │  Previewed    Ready       Published                      │   │
│  │  ┌──────┐    ┌──────┐   ┌──────┐                        │   │
│  │  │  1   │ →  │  1   │→  │  14  │                        │   │
│  │  │ post │    │ post │   │ posts│                        │   │
│  │  └──────┘    └──────┘   └──────┘                        │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── ACTION REQUIRED ──────────────────────────────────────┐   │
│  │                                                          │   │
│  │  🔴 TODAY: "SQL for PMs" — Ready_ToPublish               │   │
│  │     Scheduled for today. [Publish Now]                    │   │
│  │                                                          │   │
│  │  🟡 TOMORROW: "AmEx year one" — Previewed                │   │
│  │     Needs review before tomorrow. [Review Now]            │   │
│  │                                                          │   │
│  │  ⚪ PIPELINE GAP: No posts scheduled for Thu–Fri         │   │
│  │     [Start Ideation]                                      │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── WEEKLY CALENDAR ──────────────────────────────────────┐   │
│  │  Mon        Tue        Wed        Thu        Fri         │   │
│  │  ┌────┐    ┌────┐    ┌────┐    ┌────┐    ┌────┐        │   │
│  │  │ 🟢 │    │ 🟣 │    │ ⬜ │    │ ⬜ │    │ ⬜ │        │   │
│  │  │Ready│    │Prev│    │Sch │    │ -- │    │ -- │        │   │
│  │  │SQL  │    │AmEx│    │Dsgn│    │OPEN│    │OPEN│        │   │
│  │  └────┘    └────┘    └────┘    └────┘    └────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── QUICK STATS ──────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Posts this week: 3/5        Avg engagement: 151         │   │
│  │  Pipeline health: ▓▓▓▓░     Top pillar: Skill-Building  │   │
│  │  Streak: 12 days             Metrics due: 2 posts        │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### M3 Components for Pipeline Overview

| Element | Component | Details |
|---------|-----------|---------|
| Pipeline funnel | `FilledCard` per stage | Count badge, click to filter Posts list |
| Action items | `OutlinedCard` with `FilledButton` | Color-coded priority (red/yellow/grey) |
| Calendar | Custom grid with `FilterChip` per day | Status-colored, clickable to post detail |
| Quick stats | `FilledCard` (horizontal row) | Icon + number + label |
| Refresh | `IconButton` | Top-right, triggers data re-fetch |

---

## View 2: Posts List + Detail

**URL:** `/posts` (list), `/posts/:id` (detail)
**Purpose:** Browse, filter, and manage all posts

### Posts List

```
┌──────────────────────────────────────────────────────────────────┐
│  📝 Posts                                      [+ New Ideation]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Filter: [All ▾] [Status ▾] [Pillar ▾] [Date range ▾] 🔍 Search│
│                                                                  │
│  Sort: Scheduled date ↓  |  Status  |  Score  |  Engagement     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ● Ready   "Why PMs should learn SQL"                    │   │
│  │  Mon Mar 16 | Skill-Building | Score: 134 | 1,089 chars  │   │
│  │  Hook: Contrarian | Tone: Conversational                  │   │
│  │                                    [Review] [Publish]     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ● Previewed  "My first year at AmEx"                    │   │
│  │  Tue Mar 17 | Career | Score: 121 | 987 chars             │   │
│  │  Hook: Story | Tone: Reflective                           │   │
│  │                                    [Review]               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ● Scheduled  "Design thinking tips"                     │   │
│  │  Wed Mar 18 | Leadership | Score: 96 | -- chars           │   │
│  │  No draft yet                                             │   │
│  │                                    [Draft]                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ✅ Published  "Remote work productivity"                 │   │
│  │  Fri Mar 13 | Personal | Engagement: 89 | 📈 Day 3       │   │
│  │  URN: urn:li:share:712... | Published 9:47 AM             │   │
│  │                                    [Analytics]            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Showing 1–10 of 21 posts                    ← 1 2 3 →         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Post Detail

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Posts / "Why PMs should learn SQL"          [Edit] [Actions▾]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─── STATUS BAR ───────────────────────────────────────────┐   │
│  │  ●──●──●──●──●──◐──○                                    │   │
│  │  Sch Draft Fmt  Prev Rdy  Pub                           │   │
│  │                     ↑ Current: Ready_ToPublish           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── METADATA ─────────────┬─── PREVIEW ──────────────────┐   │
│  │                          │                              │   │
│  │  Pillar: Skill-Building  │  ┌──────────────────────┐   │   │
│  │  Score: 134/160          │  │                      │   │   │
│  │  Scheduled: Mon Mar 16   │  │  Most PMs think SQL  │   │   │
│  │  Hook: Contrarian        │  │  is "nice to have."  │   │   │
│  │  Narrative: Story-to-    │  │                      │   │   │
│  │    Insight               │  │  They're wrong.      │   │   │
│  │  CTA: Follow+Engage     │  │                      │   │   │
│  │  Tone: Conversational    │  │  ...                 │   │   │
│  │  Format: 1,089 chars     │  │                      │   │   │
│  │  FK Grade: 6.2           │  │  [Full preview ↗]    │   │   │
│  │  Emojis: 2/3             │  │                      │   │   │
│  │  Hashtags: 5             │  └──────────────────────┘   │   │
│  │  Hindi: 1/3              │                              │   │
│  │                          │                              │   │
│  │  Experience linked:      │                              │   │
│  │  "Built dashboard query  │                              │   │
│  │   that saved 40hrs"      │                              │   │
│  │  Similarity: 0.91        │                              │   │
│  │                          │                              │   │
│  └──────────────────────────┴──────────────────────────────┘   │
│                                                                  │
│  ┌─── HISTORY ──────────────────────────────────────────────┐   │
│  │  Timeline (newest first):                                │   │
│  │  Mar 14 10:30  Status → Ready_ToPublish (C.2 approved)   │   │
│  │  Mar 14 10:25  Status → Previewed (F.4 approved)         │   │
│  │  Mar 14 10:20  Status → Formatting (F.1 selected)        │   │
│  │  Mar 13 19:45  Status → Drafted (B.4 finalized, v2)      │   │
│  │  Mar 13 19:30  Status → Drafting (B.1 started)           │   │
│  │  Mar 12 08:15  Status → Scheduled_NoDraft (A.8 saved)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── ENGAGEMENT (if published) ────────────────────────────┐   │
│  │  Day    Likes  Comments  Shares  Score   Rate            │   │
│  │  Day 1   12      3         1      23    0.19%            │   │
│  │  Day 3   45      8         4      77    0.64%            │   │
│  │  Day 7   89     14         7     131    1.09%            │   │
│  │  Day 14  --     --        --      --     --   (pending)  │   │
│  │  Day 30  --     --        --      --     --   (pending)  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### M3 Components for Posts

| Element | Component | Details |
|---------|-----------|---------|
| Post list items | `OutlinedCard` (clickable) | Status chip, metadata row, action buttons |
| Status filter | `FilterChip` (multi-select) | One chip per status |
| Pillar filter | `FilterChip` | One chip per pillar |
| Search | `SearchBar` (M3) | Full-text post search |
| Sort | `DropdownMenu` | Sort by date, status, score, engagement |
| Pagination | `IconButton` (prev/next) + page numbers | 10 posts per page |
| Post detail status bar | Custom `Stepper` (horizontal) | Filled/outlined circles per status |
| Metadata | `DataTable` (vertical key-value) | Left column on detail page |
| Preview card | `FilledCard` | Code-block styled content preview |
| History timeline | `List` with `ListItem` | Timestamp + event description |
| Engagement table | `DataTable` | Sortable, with pending indicators |
| Actions menu | `DropdownMenu` | Publish, Review, Edit, Reschedule, Drop |
| FAB | `ExtendedFAB` | "New Ideation" on list page |

---

## View 3: Analytics Summary

**URL:** `/analytics`
**Purpose:** Performance metrics, trends, and strategy insights

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Analytics                     Period: [Last 7 days ▾] 🔄    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─── OVERVIEW CARDS ───────────────────────────────────────┐   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│   │
│  │  │ Posts    │  │ Avg Eng  │  │ Avg Rate │  │ Top      ││   │
│  │  │   5     │  │  151     │  │  1.26%   │  │ Skill-   ││   │
│  │  │ published│  │ +12% ▲  │  │ +0.3% ▲  │  │ Building ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── ENGAGEMENT OVER TIME ─────────────────────────────────┐   │
│  │                                                          │   │
│  │  300│         ╭─╮                                        │   │
│  │     │        ╱   ╲                                       │   │
│  │  200│  ╭────╱     ╲────╮                                 │   │
│  │     │ ╱                 ╲                                │   │
│  │  100│╱                   ╲────╮                          │   │
│  │     │                         ╲                          │   │
│  │    0│─────────────────────────────                       │   │
│  │     Mon   Tue   Wed   Thu   Fri                          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── BY PILLAR ────────────┬─── BY FRAMEWORK ─────────────┐   │
│  │                          │                              │   │
│  │  Skill-Building ▓▓▓▓▓▓▓ │  Contrarian   ▓▓▓▓▓▓▓▓      │   │
│  │  Career         ▓▓▓▓▓   │  Story Hook   ▓▓▓▓▓▓        │   │
│  │  Leadership     ▓▓▓▓    │  Question     ▓▓▓▓           │   │
│  │  Personal       ▓▓      │  List Hook    ▓▓             │   │
│  │  Tech           ▓       │                              │   │
│  │                          │                              │   │
│  └──────────────────────────┴──────────────────────────────┘   │
│                                                                  │
│  ┌─── POST RANKINGS ───────────────────────────────────────┐   │
│  │  #  Post                    Engagement  Rate   Trend    │   │
│  │  1  "SQL for PMs"           247         2.1%   ▲▲       │   │
│  │  2  "AmEx year one"         198         1.7%   ▲        │   │
│  │  3  "Design thinking"       156         1.3%   ≈  🔥    │   │
│  │  4  "Remote work"           89          0.7%   ▼        │   │
│  │  5  "AI tools"              62          0.5%   ▼▼       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── COLLECTION SCHEDULE ──────────────────────────────────┐   │
│  │  ⚠️ 2 posts due for metric collection:                   │   │
│  │     "SQL for PMs" — Day 1 (published yesterday)          │   │
│  │     "Design thinking" — Day 7 (published last Mon)       │   │
│  │  [Collect Metrics Guide]                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### M3 Components for Analytics

| Element | Component | Details |
|---------|-----------|---------|
| Overview cards | `FilledCard` (row of 4) | Number + delta + arrow indicator |
| Period selector | `DropdownMenu` | Last 7d, 30d, 90d, custom |
| Engagement chart | Custom canvas or chart library | Line chart with M3 colors |
| Bar charts | Custom with M3 color tokens | Horizontal bars for pillar/framework |
| Post rankings table | `DataTable` (sortable) | Click row to go to post detail |
| Collection schedule | `OutlinedCard` with `Badge` | Warning icon for due items |
| Resurgence badge | `Badge` on post row | Fire icon (🔥) for viral late posts |

---

## View 4: Settings / Config

**URL:** `/settings`
**Purpose:** Manage all 7 config documents

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚙️ Settings                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tabs: [Scoring] [Schedule] [Formatting] [Engagement]           │
│        [Review] [Analytics] [Account]                            │
│                                                                  │
│  ═══ SCORING WEIGHTS (Tab 1) ═══                                │
│                                                                  │
│  ┌─── Fibonacci Weights ────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Freshness         ├─────────●───────┤  8               │   │
│  │                     1    3  5   8  13                     │   │
│  │                                                          │   │
│  │  Personal Exp      ├──────●─────────┤  5                │   │
│  │                     1   3  5   8  13                      │   │
│  │                                                          │   │
│  │  Research Quality  ├───●────────────┤  3                │   │
│  │                     1  3  5   8  13                       │   │
│  │                                                          │   │
│  │  Max score: 160    Formula: F×8 + P×5 + R×3              │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── Thresholds ───────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Minimum threshold:  [  80  ] points (50% of 160)        │   │
│  │  Min Freshness:      [   5  ] / 10                       │   │
│  │  Min Personal Exp:   [   3  ] / 10                       │   │
│  │  Min Research:       [   2  ] / 10                       │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── Impact Preview ──────────────────────────────────────┐   │
│  │  If applied to last 5 briefs:                           │   │
│  │  3 would pass (same as current) | 0 new passes          │   │
│  │  [Show Details]                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Last updated: Mar 7, 2026           [Reset to Default] [Save]  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### M3 Components for Settings

| Element | Component | Details |
|---------|-----------|---------|
| Config tabs | `Tabs` (scrollable) | One tab per config document + Account |
| Weight sliders | `Slider` (discrete, Fibonacci steps) | Labels at 1,2,3,5,8,13 |
| Threshold inputs | `OutlinedTextField` (number) | With validation |
| Impact preview | `OutlinedCard` | Expandable details |
| Save button | `FilledButton` | Primary action |
| Reset button | `OutlinedButton` | Secondary action with confirmation dialog |
| Last updated | `SupportingText` | Timestamp + source (manual or via E.5) |
| Switches | `Switch` | Boolean settings (e.g., auto_approve) |
| Day selector | `FilterChip` (multi-select) | Mon–Sun for posting_schedule |

---

## Responsive Considerations

### Breakpoints

| Breakpoint | Width | Layout Change |
|------------|-------|---------------|
| Desktop (default) | ≥1024px | Sidebar (256px) + main content |
| Large desktop | ≥1440px | Sidebar + wider main + optional side panel on detail views |
| Tablet | 768–1023px | Collapsible sidebar (rail mode: 80px icons only) |
| Mobile | <768px | Bottom navigation bar replaces sidebar, single-column layout |

### Desktop-First Priority
- **Primary target:** 1440px wide desktop browser
- **Sidebar:** Always expanded on desktop; collapses to icon rail on tablet
- **Data tables:** Full columns visible on desktop; horizontal scroll on tablet
- **Side-by-side panels (post detail):** Metadata + preview side-by-side on desktop; stacked on tablet/mobile
- **Charts:** Full width on desktop; simplified/smaller on tablet

### Navigation Responsive Behavior

| Screen | Nav Component | Behavior |
|--------|--------------|----------|
| ≥1024px | `NavigationRail` (expanded) | Labels + icons, 256px wide |
| 768–1023px | `NavigationRail` (collapsed) | Icons only, 80px wide, labels on hover |
| <768px | `NavigationBar` (bottom) | 4 items: Dashboard, Posts, Analytics, Settings |

---

## Data Refresh Strategy

| Data | Refresh Method | Frequency |
|------|---------------|-----------|
| Pipeline counts | Auto-poll | Every 60 seconds |
| Post list | On-demand + after action | Pull-to-refresh or manual |
| Analytics | On-demand | Manual trigger (data changes infrequently) |
| Config | On page load | Cached until settings page revisited |
| Action items | Auto-poll | Every 60 seconds (same as pipeline) |

---

## Interaction Patterns

### Quick Actions from Dashboard
- **Publish Now** → Opens confirmation dialog → triggers D.2 webhook → snackbar result
- **Review Now** → Navigates to `/posts/:id` with review mode active
- **Start Ideation** → Opens ChatGPT in new tab (dashboard links to chat interface for interactive workflows)

### Post Actions
- **One-click actions:** Approve, Reject (with confirmation)
- **Multi-step actions:** Edit (opens inline editor), Reschedule (date picker dialog)
- **Destructive actions:** Drop/Cancel (requires typed confirmation)

### Navigation Between Views
- **Card click** → Navigate to detail view
- **Breadcrumbs** → Navigate back to list
- **Status chip click** → Filter posts list by that status
- **Pillar chip click** → Filter posts list by that pillar
