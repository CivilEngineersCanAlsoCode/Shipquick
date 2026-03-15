# Navigation Specification

**Design system:** Google Material 3
**Pattern:** Sidebar navigation rail (desktop), bottom bar (mobile)
**User:** Single user, no role-based access

---

## Primary Navigation Structure

### Sidebar (NavigationRail)

```
┌──────────────────┐
│  LinkRight SMA   │  ← App identity (logo + name)
│                  │
│  ▐ 📊 Dashboard  │  ← Active indicator (M3 pill shape)
│    📝 Posts       │
│    📈 Analytics   │
│    ⚙️ Settings    │
│                  │
│                  │
│                  │
│                  │
│                  │  ← Spacer (pushes bottom items down)
│                  │
│  ─────────────── │  ← Divider
│    💬 ChatGPT ↗  │  ← External link to LinkRight HQ
│    📱 Telegram ↗ │  ← External link to Telegram group
│                  │
│    v1.0          │  ← Version label
└──────────────────┘
```

### Navigation Items

| Item | Icon | Label | URL | Badge |
|------|------|-------|-----|-------|
| Dashboard | `dashboard` | Dashboard | `/dashboard` | Red dot if action items > 0 |
| Posts | `edit_note` | Posts | `/posts` | Count of posts needing action |
| Analytics | `analytics` | Analytics | `/analytics` | Count of metrics due for collection |
| Settings | `settings` | Settings | `/settings` | None |

### External Links (bottom section, separated by divider)

| Item | Icon | Label | URL | Behavior |
|------|------|-------|-----|----------|
| ChatGPT | `chat` | ChatGPT | LinkRight HQ URL | Opens in new tab |
| Telegram | `send` | Telegram | Telegram group URL | Opens in new tab |

---

## Page Hierarchy & URLs

```
/
├── /dashboard                          ← Pipeline Overview (home/default)
│
├── /posts                              ← Posts List (filterable, sortable)
│   ├── /posts?status=Scheduled_NoDraft ← Filtered by status
│   ├── /posts?pillar=career            ← Filtered by pillar
│   └── /posts/:id                      ← Post Detail
│       ├── /posts/:id/preview          ← Full-screen preview (dialog)
│       └── /posts/:id/history          ← Version history (tab within detail)
│
├── /analytics                          ← Analytics Summary
│   ├── /analytics?period=7d            ← Period filter via query param
│   ├── /analytics?period=30d
│   └── /analytics/post/:id             ← Single post engagement deep-dive
│
└── /settings                           ← Settings (tabbed)
    ├── /settings/scoring               ← Scoring weights tab
    ├── /settings/schedule              ← Posting schedule tab
    ├── /settings/formatting            ← Formatting config tab
    ├── /settings/engagement            ← Engagement formula tab
    ├── /settings/review                ← Review config tab
    ├── /settings/analytics             ← Analytics config tab
    └── /settings/account               ← User profile/connections
```

---

## Breadcrumb Patterns

Breadcrumbs appear in the page header area, below the top app bar.

| Page | Breadcrumb |
|------|-----------|
| Dashboard | `Dashboard` (no breadcrumb — home page) |
| Posts list | `Posts` |
| Post detail | `Posts / "Why PMs should learn SQL"` |
| Post preview | `Posts / "Why PMs..." / Preview` |
| Analytics | `Analytics` |
| Analytics post | `Analytics / "Why PMs should learn SQL"` |
| Settings scoring | `Settings / Scoring` |

### Breadcrumb M3 Implementation

```
┌──────────────────────────────────────────────────────────────────┐
│  Posts  ›  "Why PMs should learn SQL"                            │
│  ↑ link    ↑ current page (not clickable, onSurfaceVariant)      │
└──────────────────────────────────────────────────────────────────┘
```

- Separator: `›` (M3 style)
- Previous levels: Clickable links (`primary` color)
- Current level: Non-clickable text (`onSurfaceVariant` color)
- Truncate long titles with ellipsis at 40 characters

---

## Back Navigation

| Context | Back Behavior |
|---------|--------------|
| Post detail → Posts list | Browser back or breadcrumb "Posts" link |
| Post preview dialog | Close dialog (X button or Escape key) |
| Analytics post → Analytics | Browser back or breadcrumb "Analytics" link |
| Settings tab → Settings | Tabs handle this (no navigation change) |
| Any page → Dashboard | Click Dashboard in sidebar |

### Back Button
- No explicit back button in the UI — rely on breadcrumbs and sidebar nav
- Browser back button works naturally (SPA with proper URL routing)
- Keyboard shortcut: `Alt+←` for browser back

---

## Navigation State

### Active Indicator
- M3 pill-shaped indicator on active nav item
- `primaryContainer` background color for active item
- `onPrimaryContainer` icon and label color for active item
- `onSurfaceVariant` for inactive items

### Nested Page Highlighting
- `/posts/:id` → "Posts" nav item stays highlighted
- `/analytics/post/:id` → "Analytics" nav item stays highlighted
- `/settings/scoring` → "Settings" nav item stays highlighted

---

## Filter & Sort Navigation (Posts Page)

Filters are applied via URL query parameters for bookmarkability and shareability.

### URL Query Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `status` | `all`, `scheduled`, `drafting`, `drafted`, `formatting`, `previewed`, `ready`, `published`, `failed` | `all` |
| `pillar` | `all`, `career`, `skill_building`, `leadership`, `personal`, `tech` | `all` |
| `sort` | `date_asc`, `date_desc`, `score_desc`, `engagement_desc` | `date_desc` |
| `search` | Free text | (empty) |
| `page` | Number | `1` |

**Example:** `/posts?status=drafted&pillar=career&sort=score_desc`

### Filter Chips (M3)
- Displayed as `FilterChip` row below page header
- Active filters show as filled chips with checkmark
- Click to toggle; click X to remove filter
- "Clear all" text button when any filter is active

---

## Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `1` – `4` | Navigate to Dashboard / Posts / Analytics / Settings (when no input focused) |
| `/` | Focus search on Posts page |
| `Escape` | Close dialog / clear search / deselect |
| `Enter` | Confirm action in dialog |
| `Tab` / `Shift+Tab` | Standard focus navigation |
| `↑` / `↓` | Navigate post list items |
| `Space` | Toggle filter chip |

---

## Notification Badges

### Dashboard Badge (Red Dot)
Shown when any of:
- Post is Ready_ToPublish and scheduled_date ≤ today
- Post is Previewed and scheduled_date ≤ tomorrow
- Pipeline gap detected (no posts for upcoming active day)

### Posts Badge (Count)
Shows count of posts needing action:
- Ready_ToPublish (needs publish)
- Previewed (needs review)
- Publish_Failed (needs attention)

### Analytics Badge (Count)
Shows count of published posts due for metric collection (based on Day 1/3/7/14/30 schedule).

### Badge M3 Styling
- **Red dot** (no number): `Badge` with no label, `error` color
- **Count**: `Badge` with number label, `error` color
- Position: Top-right of nav icon
- Max display: "9+" for counts > 9

---

## Page Transitions

| Transition | Animation |
|------------|-----------|
| Sidebar nav click | Fade-through (M3 motion, 300ms) |
| List → Detail | Shared axis (forward, 300ms) — card expands to detail |
| Detail → List | Shared axis (backward, 300ms) |
| Dialog open | Fade-in + scale-up (M3 dialog motion) |
| Dialog close | Fade-out + scale-down |
| Tab switch | Fade-through within content area |
| Filter apply | Content area cross-fade (150ms) |
