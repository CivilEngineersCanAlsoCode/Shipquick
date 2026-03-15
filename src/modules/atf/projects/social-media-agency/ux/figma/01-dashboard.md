# Figma Spec — Dashboard Page

**Route:** `/dashboard`
**Frame size:** 1440 × 900px (viewport), content scrolls to ~1400px
**Purpose:** Pipeline health at a glance — "What needs my attention?"

---

## Global Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TopAppBar (64px)                                                       │
│  ┌──────┬────────────────────────────────────────────┬────────────────┐ │
│  │ Logo │  LinkRight SMA                             │  🔔  👤 Satvik │ │
│  │ 40px │  titleLarge                                │  IconButtons   │ │
│  └──────┴────────────────────────────────────────────┴────────────────┘ │
├──────────────┬──────────────────────────────────────────────────────────┤
│              │                                                          │
│  NavRail     │  Main Content Area                                       │
│  (256px)     │  (1184px = 1440 - 256)                                   │
│              │  padding: 24px all sides                                  │
│  surfaceCont │  max-width: 1200px                                       │
│  ainer       │                                                          │
│  #ECF0E9     │  ┌────────────────────────────────────────────────────┐  │
│              │  │ Section 1: Pipeline Funnel                         │  │
│  ┌────────┐  │  ├────────────────────────────────────────────────────┤  │
│  │ 📊     │  │  │ Section 2: Action Required                        │  │
│  │Dashbrd │  │  ├────────────────────────────────────────────────────┤  │
│  │ACTIVE  │  │  │ Section 3: Weekly Calendar                        │  │
│  ├────────┤  │  ├────────────────────────────────────────────────────┤  │
│  │ 📝     │  │  │ Section 4: Quick Stats                            │  │
│  │Posts   │  │  └────────────────────────────────────────────────────┘  │
│  ├────────┤  │                                                          │
│  │ 📈     │  │                                                          │
│  │Analytcs│  │                                                          │
│  ├────────┤  │                                                          │
│  │ ⚙️     │  │                                                          │
│  │Settings│  │                                                          │
│  ├────────┤  │                                                          │
│  │        │  │                                                          │
│  │ SPACER │  │                                                          │
│  │        │  │                                                          │
│  ├────────┤  │                                                          │
│  │ChatGPT↗│  │                                                          │
│  │Telegram│  │                                                          │
│  └────────┘  │                                                          │
└──────────────┴──────────────────────────────────────────────────────────┘
```

---

## Navigation Rail

**M3 Component:** `NavigationRail` (expanded variant)

| Property | Value |
|----------|-------|
| Width | 256px |
| Background | `surfaceContainer` #ECF0E9 |
| Elevation | Level 1 (5% tint) |
| Padding top | 48px (below top app bar) |
| Item height | 56px |
| Item padding | 12px horizontal, 8px vertical |
| Active indicator | `secondaryContainer` #D1E8D4, border-radius 28px |
| Active icon/label | `onSecondaryContainer` #0C1F13 |
| Inactive icon/label | `onSurfaceVariant` #414941 |
| Label style | `labelLarge` (14px, Medium 500) |
| Icon size | 24px |

**Nav Items:**

| Order | Icon | Label | Route |
|-------|------|-------|-------|
| 1 | `dashboard` | Dashboard | `/dashboard` |
| 2 | `edit_note` | Posts | `/posts` |
| 3 | `analytics` | Analytics | `/analytics` |
| 4 | `settings` | Settings | `/settings` |

**Bottom section** (pinned to bottom, separated by `Divider`):

| Icon | Label | Action |
|------|-------|--------|
| `open_in_new` | ChatGPT | Opens external link |
| `send` | Telegram | Opens external link |

### Dark Mode Variant

| Property | Dark Value |
|----------|-----------|
| Background | `surfaceContainer` #1D201D |
| Active indicator | `secondaryContainer` #374B3D |
| Active icon/label | `onSecondaryContainer` #D1E8D4 |
| Inactive icon/label | `onSurfaceVariant` #C1C9BF |

---

## Top App Bar

**M3 Component:** `TopAppBar` (medium variant)

| Property | Value |
|----------|-------|
| Height | 64px |
| Background | `surfaceContainerHighest` #E1E4DE |
| Elevation | Level 2 (8% tint) |
| Left: Logo | 40 × 40px, 16px margin-left |
| Title | "LinkRight SMA", `titleLarge` (22px), `onSurface` #191C19 |
| Title margin-left | 16px from logo |
| Right actions | `IconButton` × 2, 8px gap |
| Right margin | 16px |

**Right action buttons:**
- Notification bell: `notifications` icon, 24px, `onSurfaceVariant` #414941
- Avatar: 32px circle with initial "S", `primary` #1B6B3A bg, `onPrimary` #FFFFFF text

### Dark Mode Variant

| Property | Dark Value |
|----------|-----------|
| Background | `surfaceContainerHighest` #323532 |
| Title color | `onSurface` #E1E4DE |
| Icon color | `onSurfaceVariant` #C1C9BF |
| Avatar bg | `primary` #89D89E, text `onPrimary` #003916 |

---

## Section 1: Pipeline Funnel

**Container:** Page header row

| Property | Value |
|----------|-------|
| Layout | Row: title left, refresh button right |
| Title | "Pipeline Overview", `headlineSmall` (24px), `onSurface` |
| Refresh button | `IconButton` outlined, `refresh` icon, 40 × 40px |
| Margin-bottom | 24px (spacing.lg) |

### Funnel Cards

**M3 Component:** `FilledCard` (custom `PipelineFunnelCard`)

**Layout:** Horizontal row with 7 cards + 6 arrow connectors, wrapped to 2 rows on narrower viewports.

```
Row 1: [Scheduled] → [Drafting] → [Drafted] → [Formatting]
Row 2: [Previewed] → [Ready] → [Published]
```

**Card dimensions:**

| Property | Value |
|----------|-------|
| Card size | 120 × 88px |
| Corner radius | 12px |
| Padding | 16px all sides |
| Gap between cards | 8px (arrow occupies 24px including gaps) |
| Row gap | 16px |

**Card content (vertical stack, centered):**

| Element | Style | Token |
|---------|-------|-------|
| Count number | `headlineMedium` (28px, Regular) | `onPrimaryContainer` (varies by status) |
| Status label | `labelMedium` (12px, Medium) | `onPrimaryContainer` (varies by status) |
| Sublabel ("posts") | `bodySmall` (12px, Regular) | `onPrimaryContainer` at 70% opacity |

**Card colors by status:**

| Status | Background | Text | Light Hex BG | Light Hex Text |
|--------|-----------|------|-------------|---------------|
| Scheduled_NoDraft | `surfaceVariant` | `onSurfaceVariant` | #DDE5DA | #414941 |
| Drafting | `secondaryContainer` | `onSecondaryContainer` | #D1E8D4 | #0C1F13 |
| Drafted | `secondaryContainer` | `onSecondaryContainer` | #D1E8D4 | #0C1F13 |
| Formatting | `tertiaryContainer` | `onTertiaryContainer` | #BCE9E3 | #00201D |
| Previewed | `tertiaryContainer` | `onTertiaryContainer` | #BCE9E3 | #00201D |
| Ready_ToPublish | `primaryContainer` | `onPrimaryContainer` | #A4F5B8 | #002109 |
| Published | `primaryContainer` | `onPrimaryContainer` | #A4F5B8 | #002109 |

**Arrow connector:**

| Property | Value |
|----------|-------|
| Type | SVG `chevron_right` icon |
| Size | 16 × 16px |
| Color | `outline` #717971 |
| Vertical alignment | Center of card |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As specified above |
| Hover | Elevation Level 2 (8% tint overlay), cursor pointer |
| Pressed | Elevation Level 1 (5% tint), slight scale 0.98 |
| Clicked | Navigates to `/posts?status={stage}` |

### Dark Mode

All cards use dark mode token equivalents from `m3-design-tokens.md` dark mode table. Arrow connector color: `outline` #8B938A.

---

## Section 2: Action Required

**Spacing from Section 1:** 32px (spacing.xl)

**Section header:**

| Property | Value |
|----------|-------|
| Title | "Action Required", `titleLarge` (22px), `onSurface` |
| Margin-bottom | 16px |

### ActionItemCard

**M3 Component:** `OutlinedCard`

| Property | Value |
|----------|-------|
| Width | 100% (fill container) |
| Min height | 72px |
| Corner radius | 12px |
| Border | 1px `outline` #717971 |
| Padding | 16px all sides |
| Gap between cards | 8px |
| Layout | Row: priority indicator → content → action button |

**Priority indicator (left):**

| Priority | Icon | Color Token | Hex |
|----------|------|-------------|-----|
| Urgent (today) | Filled circle 12px | `error` | #BA1A1A |
| Soon (tomorrow) | Filled circle 12px | `tertiary` | #3A635F |
| Info (gap) | Outlined circle 12px | `outline` | #717971 |

**Content (middle, flex-grow):**

| Element | Style |
|---------|-------|
| Label prefix ("TODAY:", "TOMORROW:", "PIPELINE GAP:") | `labelLarge` (14px, Medium), priority color |
| Post title | `titleMedium` (16px, Medium), `onSurface` #191C19 |
| Description | `bodyMedium` (14px), `onSurfaceVariant` #414941 |

**Action button (right):**

| Priority | Button Variant | Label |
|----------|---------------|-------|
| Urgent | `FilledButton` | "Publish Now" |
| Soon | `FilledTonalButton` | "Review Now" |
| Info | `OutlinedButton` | "Start Ideation" |

**Button specs:**

| Property | Value |
|----------|-------|
| Height | 40px |
| Corner radius | 20px (fully rounded) |
| Padding | 24px horizontal, 0 vertical |
| Label | `labelLarge` (14px, Medium) |
| Filled bg | `primary` #1B6B3A, text `onPrimary` #FFFFFF |
| Tonal bg | `secondaryContainer` #D1E8D4, text `onSecondaryContainer` #0C1F13 |
| Outlined | `outline` #717971 border, text `primary` #1B6B3A |

**Empty state (no action items):**

| Property | Value |
|----------|-------|
| Container | Same `OutlinedCard` |
| Icon | `check_circle` 48px, `primary` #1B6B3A |
| Title | "All caught up!", `titleMedium`, `onSurface` |
| Body | "No posts need your attention right now.", `bodyMedium`, `onSurfaceVariant` |
| Subtitle | "Next scheduled post: [title] on [date]", `bodySmall`, `onSurfaceVariant` |
| Text alignment | Center |

### Dark Mode

- Card border: `outlineVariant` #414941
- Priority urgent: `error` #FFB4AB
- Priority soon: `tertiary` #A0CDC7
- Filled button: `primary` #89D89E, text `onPrimary` #003916
- Tonal button: `secondaryContainer` #374B3D, text `onSecondaryContainer` #D1E8D4

---

## Section 3: Weekly Calendar

**Spacing from Section 2:** 32px (spacing.xl)

**Section header:**

| Property | Value |
|----------|-------|
| Title | "This Week", `titleLarge` (22px), `onSurface` |
| Margin-bottom | 16px |

### Calendar Grid

**Layout:** Row of 5 day cards (Mon–Fri) or 7 (Mon–Sun)

| Property | Value |
|----------|-------|
| Card width | Equal distribution (fill row) |
| Card height | 96px |
| Gap | 8px |
| Component | `FilledCard` variant |
| Corner radius | 12px |
| Padding | 12px |

**Card content (vertical stack):**

| Element | Style | Position |
|---------|-------|----------|
| Day label | `labelMedium` (12px, Medium), `onSurfaceVariant` | Top-left |
| Status indicator | Filled circle 8px, status color | Top-right |
| Post title (truncated) | `bodySmall` (12px), `onSurface`, max 2 lines, ellipsis | Center |
| Status label | `labelSmall` (11px), status color | Bottom |

**Day card backgrounds:**

| Content State | Background |
|---------------|-----------|
| Has post (any status) | `surfaceContainerLow` #F2F5EF |
| No post scheduled | `surfaceVariant` #DDE5DA at 40% opacity |
| Today | 2px left border in `primary` #1B6B3A |

**Status indicator dot colors:** Same as Pipeline Funnel card colors.

**Interactive states:**

| State | Change |
|-------|--------|
| Hover | Background shifts to `surfaceContainerHigh` #E7EAE4 |
| Pressed | Scale 0.98 |
| Click (has post) | Navigate to `/posts/:id` |
| Click (empty) | Navigate to `/posts?date=YYYY-MM-DD` |

### Dark Mode

- Card bg: `surfaceContainerLow` #191C19
- Empty bg: `surfaceVariant` #414941 at 40%
- Today border: `primary` #89D89E
- Hover bg: `surfaceContainerHigh` #272A27

---

## Section 4: Quick Stats

**Spacing from Section 3:** 32px (spacing.xl)

### MetricCard Row

**Layout:** Row of 4 equal-width cards

| Property | Value |
|----------|-------|
| Card component | `FilledCard` |
| Card background | `surfaceContainerHighest` #E1E4DE |
| Corner radius | 12px |
| Padding | 16px |
| Gap between cards | 16px |
| Min card width | 160px |
| Card height | 96px |

**Card content (vertical stack):**

| Element | Style | Token |
|---------|-------|-------|
| Icon | 24px M3 icon | `primary` #1B6B3A |
| Value | `headlineMedium` (28px, Regular) | `onSurface` #191C19 |
| Label | `labelMedium` (12px, Medium) | `onSurfaceVariant` #414941 |
| Delta (optional) | `bodySmall` (12px), with ▲/▼ arrow | `primary` for up, `error` for down |

**Four metric cards:**

| # | Icon | Value Example | Label | Delta Example |
|---|------|---------------|-------|---------------|
| 1 | `article` | "3/5" | "Posts this week" | — |
| 2 | `trending_up` | "151" | "Avg engagement" | "+12% ▲" |
| 3 | `star` | "Skill-Building" | "Top pillar" | — |
| 4 | `schedule` | "Mon 9:00" | "Next scheduled" | "in 2 days" |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Hover | Elevation Level 2 (8% tint) |

### Dark Mode

- Card bg: `surfaceContainerHighest` #323532
- Icon: `primary` #89D89E
- Value: `onSurface` #E1E4DE
- Label: `onSurfaceVariant` #C1C9BF
- Delta up: `primary` #89D89E, down: `error` #FFB4AB

---

## FAB (Floating Action Button)

**M3 Component:** `ExtendedFAB`

| Property | Value |
|----------|-------|
| Position | Fixed, bottom-right of main content area |
| Bottom offset | 24px |
| Right offset | 24px |
| Height | 56px |
| Corner radius | 16px |
| Background | `primaryContainer` #A4F5B8 |
| Icon | `add` 24px, `onPrimaryContainer` #002109 |
| Label | "New Post", `labelLarge` (14px, Medium), `onPrimaryContainer` #002109 |
| Elevation | Level 3 (11% tint) |
| Shadow | 0 4px 8px rgba(0,0,0,0.15) — M3 allows subtle shadow on FAB |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Hover | Elevation Level 4, overlay 8% `onPrimaryContainer` |
| Pressed | Elevation Level 2, overlay 12% `onPrimaryContainer` |

**FAB Menu (on click):** Opens a 3-item menu above the FAB:

| Item | Icon | Label | Action |
|------|------|-------|--------|
| 1 | `lightbulb` | "Plan (Ideation)" | Opens ChatGPT external |
| 2 | `edit` | "Draft" | Opens ChatGPT external |
| 3 | `bolt` | "Quick Post" | Opens ChatGPT external |

**Menu specs:**

| Property | Value |
|----------|-------|
| Component | `DropdownMenu` |
| Background | `surfaceContainerHigh` #E7EAE4 |
| Corner radius | 12px |
| Padding | 8px vertical |
| Item height | 48px |
| Item padding | 16px horizontal |
| Item icon | 24px, `onSurface` |
| Item label | `bodyLarge` (16px), `onSurface` |
| Elevation | Level 4 (12% tint) |

### Dark Mode FAB

- Background: `primaryContainer` #005225
- Icon/Label: `onPrimaryContainer` #A4F5B8
- Menu bg: `surfaceContainerHigh` #272A27

---

## Loading State (Skeleton)

When data is loading (> 300ms threshold):

| Element | Skeleton Appearance |
|---------|-------------------|
| Pipeline funnel cards | 7 cards with `surfaceVariant` fill, shimmer animation L→R |
| Action items | 2–3 outlined cards with shimmer lines (3 lines each) |
| Calendar | 5 day cards with shimmer fill |
| Quick stats | 4 cards with shimmer content |
| Global | `LinearProgress` (indeterminate) at top of main content, `primary` #1B6B3A |

**Shimmer specs:**

| Property | Value |
|----------|-------|
| Base color | `surfaceVariant` #DDE5DA |
| Highlight color | `surfaceContainerLow` #F2F5EF |
| Animation | 1.5s linear infinite, L→R sweep |
| Corner radius | Match component (12px for cards, 4px for text lines) |

---

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| ≥1440px | Full layout as specified |
| 1024–1439px | NavRail stays 256px; content area narrows; stat cards stack 2×2 |
| 768–1023px | NavRail collapses to 80px (icons only); pipeline wraps to 2 rows |
| <768px | Bottom nav (80px); single column; cards full-width stacked |

---

## Component Summary

| Component Used | M3 Kit Name | Count on Page |
|----------------|-------------|---------------|
| NavigationRail | `NavigationRail` | 1 |
| TopAppBar | `TopAppBar` (medium) | 1 |
| FilledCard | `FilledCard` | 7 (funnel) + 5 (calendar) + 4 (stats) = 16 |
| OutlinedCard | `OutlinedCard` | 2–3 (action items) |
| ExtendedFAB | `ExtendedFAB` | 1 |
| IconButton | `IconButton` | 3 (refresh, bell, avatar) |
| FilledButton | `FilledButton` | 1 (publish now) |
| FilledTonalButton | `FilledTonalButton` | 1 (review now) |
| OutlinedButton | `OutlinedButton` | 1 (start ideation) |
| DropdownMenu | `DropdownMenu` | 1 (FAB menu) |
| LinearProgress | `LinearProgress` | 1 (loading) |
| Divider | `Divider` | 1 (nav rail separator) |
| Badge | `Badge` | 1 (notification bell) |
