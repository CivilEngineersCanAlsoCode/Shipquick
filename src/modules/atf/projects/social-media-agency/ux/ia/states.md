# UI States Specification

**Scope:** Empty states, error states, loading states, and notification patterns for every view.

---

## Loading States

### Global Loading Pattern
- **Component:** M3 `LinearProgress` (indeterminate) at the top of the main content area
- **Behavior:** Appears on page navigation and data fetch; disappears when data is loaded
- **Duration threshold:** Show spinner only if loading takes > 300ms (avoid flash for fast loads)

### Per-View Loading

#### Dashboard
```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Pipeline Overview                              🔄 Refresh   │
├──────────────────────────────────────────────────────────────────┤
│  ═══════════════════════ (linear progress) ═══════════════════   │
│                                                                  │
│  ┌─── PIPELINE FUNNEL ──────────────────────────────────────┐   │
│  │  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐           │   │
│  │  │ ░░░░ │    │ ░░░░ │    │ ░░░░ │    │ ░░░░ │           │   │
│  │  │      │    │      │    │      │    │      │           │   │
│  │  └──────┘    └──────┘    └──────┘    └──────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── ACTION REQUIRED ──────────────────────────────────────┐   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                    │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

- **Skeleton:** M3 placeholder shapes (`surfaceVariant` color) matching card layouts
- **Shimmer animation:** Left-to-right shimmer on skeleton elements
- **Pipeline funnel cards:** Show outline with shimmer placeholder for count
- **Action items:** 2–3 shimmer lines in card
- **Calendar:** Shimmer boxes for each day

#### Posts List
- Skeleton: 3–4 post card outlines with shimmer lines for title, metadata, chips
- Filter chips: Rendered immediately (from cached config), content loads behind

#### Post Detail
- Status bar: Rendered immediately (status known from list click)
- Metadata panel: Shimmer key-value pairs
- Preview panel: Large shimmer block
- History: Shimmer timeline items

#### Analytics
- Overview cards: 4 shimmer cards in row
- Charts: Shimmer rectangles matching chart dimensions
- Table: Shimmer rows (5 rows)

#### Settings
- Tabs: Rendered immediately
- Form fields: Shimmer for current values, labels rendered immediately

### Inline Loading (Actions)

| Action | Loading Indicator | Location |
|--------|-------------------|----------|
| Publish post | `CircularProgress` (small, 24px) replacing button icon | Inside "Publish" button |
| Save config | `CircularProgress` replacing button text | Inside "Save" button |
| Refresh data | Rotating refresh icon | Refresh button in header |
| Filter change | `LinearProgress` (indeterminate) | Top of content area |
| Webhook call | `CircularProgress` + "Connecting to n8n..." text | Inline with action |

---

## Empty States

### Dashboard — No Posts at All (Fresh Start)

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Pipeline Overview                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌────────────────────┐                        │
│                    │                    │                        │
│                    │    📝              │                        │
│                    │                    │                        │
│                    └────────────────────┘                        │
│                                                                  │
│              Your content pipeline is empty.                     │
│                                                                  │
│     Add briefs to Google Sheets, then start ideation             │
│     in ChatGPT to fill your pipeline.                            │
│                                                                  │
│         [Open Google Sheets ↗]    [Open ChatGPT ↗]              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Dashboard — No Action Items

```
┌─── ACTION REQUIRED ──────────────────────────────────────────┐
│                                                              │
│  ✅ All caught up! No posts need your attention right now.   │
│                                                              │
│  Next scheduled post: "SQL for PMs" on Mon Mar 16 (in 2d)   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Posts List — No Posts

```
┌──────────────────────────────────────────────────────────────────┐
│  📝 Posts                                      [+ New Ideation]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌────────────────────┐                        │
│                    │                    │                        │
│                    │    📄              │                        │
│                    │                    │                        │
│                    └────────────────────┘                        │
│                                                                  │
│              No posts yet.                                       │
│                                                                  │
│     Start by adding briefs to Google Sheets                      │
│     and running Content Ideation in ChatGPT.                     │
│                                                                  │
│              [Start Ideation in ChatGPT ↗]                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Posts List — No Results (Filters Active)

```
┌──────────────────────────────────────────────────────────────────┐
│  Filter: [Status: Drafted ✕] [Pillar: Tech ✕]    [Clear All]   │
│                                                                  │
│              No posts match your filters.                        │
│              Try adjusting or [Clear All] filters.               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Analytics — No Published Posts

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Analytics                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌────────────────────┐                        │
│                    │                    │                        │
│                    │    📈              │                        │
│                    │                    │                        │
│                    └────────────────────┘                        │
│                                                                  │
│              No analytics data yet.                              │
│                                                                  │
│     Publish your first post and collect metrics                  │
│     to see performance insights here.                            │
│                                                                  │
│     Pipeline status: 3 posts in progress →                       │
│              [View Pipeline]                                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Analytics — Published But No Metrics Collected

```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Analytics                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  You have 3 published posts but no metrics collected.            │
│                                                                  │
│  Collect metrics using the JS snippet in Chrome DevTools:        │
│                                                                  │
│  Posts due for collection:                                       │
│  ⚠️  "SQL for PMs" — Day 1 (published yesterday)                │
│  ⚠️  "Design thinking" — Day 7 (published Mar 7)                │
│  ⚠️  "AmEx year one" — Day 3 (published Mar 11)                 │
│                                                                  │
│              [How to Collect Metrics]                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Analytics — Insufficient Data for Recommendations

```
┌─── STRATEGY RECOMMENDATIONS ─────────────────────────────────┐
│                                                              │
│  ⚠️ Need more data for reliable recommendations.             │
│                                                              │
│  Current: 2 posts with metrics                               │
│  Required: 5+ posts for pillar analysis                      │
│  Required: 3+ posts per category for framework analysis      │
│                                                              │
│  Keep publishing and collecting metrics!                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Settings — Config Not Found

```
┌─── Scoring Weights ──────────────────────────────────────────┐
│                                                              │
│  ⚠️ Scoring config not found in database.                    │
│                                                              │
│  This usually means the config hasn't been initialized.      │
│  Initialize with default values?                             │
│                                                              │
│  Default: F×8 + P×5 + R×3, threshold 80 (50%)               │
│                                                              │
│           [Initialize Defaults]    [Cancel]                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Post Detail — Engagement Section (Not Yet Published)

```
┌─── ENGAGEMENT ───────────────────────────────────────────────┐
│                                                              │
│  Engagement data will appear after this post is published    │
│  and metrics are collected.                                  │
│                                                              │
│  Status: Ready_ToPublish | Scheduled: Mon Mar 16             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Error States

### Global Error Banner

For critical errors affecting the entire page:

```
┌──────────────────────────────────────────────────────────────────┐
│  ❌  Failed to load data. Check your connection and try again.   │
│                                               [Retry]  [Dismiss] │
└──────────────────────────────────────────────────────────────────┘
```

- **Component:** M3 `Snackbar` (error variant) or inline `Banner`
- **Position:** Top of main content area, below breadcrumbs
- **Color:** `errorContainer` background, `onErrorContainer` text
- **Actions:** Retry button + dismiss

### Per-View Error States

#### n8n Webhook Unreachable

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚠️  Cannot connect to n8n webhooks.                             │
│                                                                  │
│  The automation server may be down or unreachable.               │
│  Dashboard data may be stale (last updated: 5 min ago).          │
│                                                                  │
│  Showing cached data. Some actions may not work.                 │
│                                               [Retry Connection] │
└──────────────────────────────────────────────────────────────────┘
```

#### Publish Failed (Post Detail)

```
┌─── STATUS ───────────────────────────────────────────────────┐
│                                                              │
│  ❌ PUBLISH FAILED                                           │
│                                                              │
│  Error: 403 Forbidden — "Access token expired"               │
│  Attempted: Mon Mar 16, 9:47 AM IST                          │
│  One-shot rule: No automatic retry.                          │
│                                                              │
│  Steps to resolve:                                           │
│  1. Check LinkedIn connection in Settings → Account          │
│  2. Refresh your LinkedIn access token                       │
│  3. Re-queue this post for publishing                        │
│                                                              │
│           [Go to Settings]    [Re-queue Post]                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Config Save Failed

```
┌──────────────────────────────────────────────────────────────────┐
│  ❌  Failed to save configuration.                               │
│                                                                  │
│  Your changes:                                                   │
│  • P weight: 5 → 6                                               │
│  • Threshold: 80 → 70                                            │
│                                                                  │
│  These changes have NOT been applied.                            │
│                                               [Retry]  [Discard] │
└──────────────────────────────────────────────────────────────────┘
```

#### Validation Error (Settings Form)

```
  Minimum threshold:  [  200  ]  ← ❌ Must be ≤ max score (160)
  Min Freshness:      [  12   ]  ← ❌ Must be 1–10
  Min Personal Exp:   [   3   ]  ← ✅
```

- **Component:** M3 `OutlinedTextField` with `error` state
- **Supporting text:** Red error message below the field
- **Save button:** Disabled while validation errors exist

#### Post Not Found (404)

```
┌──────────────────────────────────────────────────────────────────┐
│  Posts / ???                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌────────────────────┐                        │
│                    │                    │                        │
│                    │    🔍              │                        │
│                    │                    │                        │
│                    └────────────────────┘                        │
│                                                                  │
│              Post not found.                                     │
│                                                                  │
│     This post may have been deleted or the ID is incorrect.      │
│                                                                  │
│              [Back to Posts]                                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Notification Patterns

### In-App Notifications

#### Snackbar (Transient)
For action confirmations and non-critical feedback.

| Event | Message | Duration | Action |
|-------|---------|----------|--------|
| Post published | "Post published to LinkedIn" | 6s | [View Post] |
| Config saved | "Scoring weights updated" | 4s | [Undo] |
| Post approved | "Post approved — Ready to Publish" | 4s | [View] |
| Post dropped | "Post cancelled" | 6s | [Undo] |
| Post rescheduled | "Post rescheduled to Mar 20" | 4s | [View] |
| Metrics collected | "Metrics saved for 3 posts" | 4s | None |

**M3 implementation:**
- Position: Bottom-center of main content area
- Component: `Snackbar` with optional action button
- Dismiss: Auto-dismiss after duration, or swipe/click X
- Queue: If multiple snackbars, queue them (don't stack)

#### Banner (Persistent)
For states that need ongoing attention.

| Condition | Banner Content | Dismiss |
|-----------|---------------|---------|
| n8n unreachable | "Automation server unreachable. Some features unavailable." | Manual dismiss, re-appears on refresh if still down |
| LinkedIn token expiring | "LinkedIn token expires in 2 days. Reconnect in Settings." | Manual dismiss |
| Pipeline gap | "No posts scheduled for Thu–Fri. Start ideation?" | Dismiss or "Start Ideation" action |
| Metrics overdue | "3 posts overdue for metric collection." | Dismiss or "View Schedule" action |

**M3 implementation:**
- Position: Top of main content area, below breadcrumbs
- Component: Custom banner with `secondaryContainer` (warning) or `errorContainer` (critical)
- Dismiss: X button (manual)

### Telegram Notifications (External)

| Event | Telegram Message | Triggered By |
|-------|-----------------|-------------|
| Post published | "New post: [title] — [LinkedIn URL] — [timestamp]" | D.4 webhook |

**Future Telegram notifications (not in v1, but designed for):**
| Event | Message |
|-------|---------|
| Metrics due | "3 posts due for Day 7 collection today" |
| Pipeline gap | "No posts scheduled for Thu. Run ideation?" |
| Publish failed | "Publish failed for [title]. Check dashboard." |
| Weekly summary | "This week: 5 posts, avg engagement 151 (+12%)" |

### Notification Center (Future v2)

For v1, notifications are snackbars + banners only. No notification center/bell icon.

The bell icon in the header is a placeholder for v2:
```
🔔 (badge count)
├── Publish: "SQL for PMs" published 2h ago
├── Metrics: 2 posts due for collection
├── Pipeline: No posts for Friday
└── [Mark All Read]
```

---

## Confirmation Dialogs

### Destructive Actions

#### Drop/Cancel Post
```
┌──────────────────────────────────────────────┐
│  Cancel this post?                           │
│                                              │
│  "Why PMs should learn SQL"                  │
│  Scheduled: Mon Mar 16                       │
│                                              │
│  This will mark the post as Cancelled.       │
│  You can re-create it via new ideation.      │
│                                              │
│  Type "cancel" to confirm:                   │
│  ┌────────────────────────────┐              │
│  │                            │              │
│  └────────────────────────────┘              │
│                                              │
│              [Go Back]    [Cancel Post]       │
│                                              │
└──────────────────────────────────────────────┘
```

#### Reset Config to Default
```
┌──────────────────────────────────────────────┐
│  Reset to defaults?                          │
│                                              │
│  This will revert scoring_weights to:        │
│  F×8 + P×5 + R×3, threshold 80              │
│                                              │
│  Your current custom values will be lost.    │
│                                              │
│              [Cancel]    [Reset]              │
│                                              │
└──────────────────────────────────────────────┘
```

### Non-Destructive Confirmations

#### Publish Post
```
┌──────────────────────────────────────────────┐
│  Publish to LinkedIn?                        │
│                                              │
│  "Why PMs should learn SQL"                  │
│                                              │
│  ⚠️ One-shot: Cannot retry if it fails.      │
│  Random delay: 0–60 min after confirmation.  │
│                                              │
│    [Cancel]  [Publish with Delay]  [Now]     │
│                                              │
└──────────────────────────────────────────────┘
```

#### Approve Post (Review)
```
┌──────────────────────────────────────────────┐
│  Approve for publishing?                     │
│                                              │
│  "Why PMs should learn SQL"                  │
│  Status will change: Previewed → Ready       │
│                                              │
│              [Cancel]    [Approve]            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## State Transition Summary

| View | Loading | Empty | Error | Success |
|------|---------|-------|-------|---------|
| **Dashboard** | Skeleton shimmer | "Pipeline is empty" + CTA | n8n unreachable banner | Normal view with data |
| **Posts List** | 3–4 skeleton cards | "No posts yet" + CTA | Load error banner + retry | Post cards rendered |
| **Posts (filtered)** | Content fade | "No matching posts" + clear filters | Same as list | Filtered results |
| **Post Detail** | Skeleton panels | N/A (404 if not found) | Load error + back button | Full detail view |
| **Analytics** | Skeleton charts + cards | "No data yet" or "No metrics" | Load error banner | Charts + tables |
| **Settings** | Shimmer form fields | "Config not found" + initialize | Save error with changes listed | Form with current values |
