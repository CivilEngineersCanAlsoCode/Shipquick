# Figma Spec — Dashboard Page

**Route:** `/dashboard`
**Purpose:** At-a-glance pipeline health — "What needs my attention?"
**Frame size:** 1440 × 1080px (auto-height content)
**Background:** `surface` (`#F8FAF5` light / `#111411` dark)

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  TopAppBar (64px)                                                    │
├────────────┬────────────────────────────────────────────────────────┤
│            │  Page Header (48px padding-top)                         │
│  NavRail   │  ┌──────────────────────────────────────────────────┐  │
│  (256px)   │  │ "Pipeline Overview"     headlineSmall    🔄 Ref  │  │
│            │  └──────────────────────────────────────────────────┘  │
│            │                                                        │
│            │  Section 1: Pipeline Funnel                            │
│            │  (24px gap)                                             │
│            │  Section 2: Action Required                            │
│            │  (24px gap)                                             │
│            │  Section 3: Weekly Calendar                            │
│            │  (24px gap)                                             │
│            │  Section 4: Quick Stats Row                            │
│            │  (48px bottom padding)                                  │
│            │                                                        │
│            │  FAB (bottom-right, 16px from edges)                   │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
```

Main content area: padding 24px all sides, max-width 1200px.

---

## Section 1: Pipeline Funnel

### Container
- **M3 component:** None (custom section)
- **Section label:** "Pipeline" — `titleMedium`, `onSurfaceVariant`
- **Margin-bottom:** 16px from label to cards

### Pipeline Stage Cards (7 cards in a row)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Scheduled │ →  │ Drafting  │ →  │ Drafted  │ →  │Formatting│ →  │Previewed │ →  │  Ready   │ →  │Published │
│          │    │          │    │          │    │          │    │          │    │          │    │          │
│    3     │    │    0     │    │    2     │    │    0     │    │    1     │    │    1     │    │   14     │
│  posts   │    │  posts   │    │  posts   │    │  posts   │    │  post    │    │  post    │    │  posts   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

#### Individual Stage Card

| Property | Value |
|----------|-------|
| **M3 component** | `FilledCard` |
| **Width** | 140px (flexible, auto-distribute in row) |
| **Height** | 96px |
| **Border radius** | 12px |
| **Padding** | 16px |
| **Background** | Status color token (see mapping below) |
| **Cursor** | Pointer (navigates to `/posts?status=X`) |

#### Card Internal Layout (vertical, centered)

| Element | Typography | Color | Position |
|---------|-----------|-------|----------|
| Status label | `labelMedium` (12px/16px, weight 500) | `onSurfaceVariant` | Top |
| Count | `headlineMedium` (28px/36px, weight 400) | `onSurface` | Center |
| "posts" / "post" | `bodySmall` (12px/16px) | `onSurfaceVariant` | Bottom |

#### Stage Card Color Mapping

| Stage | Card Background (Light) | Card Background (Dark) |
|-------|------------------------|----------------------|
| Scheduled_NoDraft | `surfaceVariant` `#DDE5DA` | `surfaceVariant` `#414941` |
| Drafting | `secondaryContainer` `#D1E8D4` | `secondaryContainer` `#374B3D` |
| Drafted | `secondaryContainer` `#D1E8D4` | `secondaryContainer` `#374B3D` |
| Formatting | `tertiaryContainer` `#BCE9E3` | `tertiaryContainer` `#204B47` |
| Previewed | `tertiaryContainer` `#BCE9E3` | `tertiaryContainer` `#204B47` |
| Ready_ToPublish | `primaryContainer` `#A4F5B8` | `primaryContainer` `#005225` |
| Published | `primaryContainer` `#A4F5B8` | `primaryContainer` `#005225` |

#### Arrow Connectors Between Cards
- **Element:** SVG arrow icon (`arrow_forward`, 20px)
- **Color:** `outlineVariant` (`#C1C9BF` light / `#414941` dark)
- **Gap:** 8px between card edge and arrow, 8px between arrow and next card
- **Vertical alignment:** Centered to card height

#### Interactive States

| State | Card Change |
|-------|------------|
| Default | As specified above |
| Hover | Elevation Level 2 (8% primary tint overlay), cursor pointer |
| Pressed | Elevation Level 1, slight scale 0.98 |
| Focused | 2px `primary` outline |
| Zero count | `onSurfaceVariant` text at 60% opacity, no hover elevation |

---

## Section 2: Action Required

### Container
- **Section label:** "Action Required" — `titleMedium`, `onSurfaceVariant`
- **Margin-top:** 24px from pipeline section
- **Margin-bottom:** 16px from label to cards

### Action Item Cards

Each item is an `OutlinedCard` stacked vertically with 8px gap between cards.

#### Card Spec

| Property | Value |
|----------|-------|
| **M3 component** | `OutlinedCard` |
| **Width** | 100% of content area |
| **Min height** | 72px |
| **Border radius** | 12px |
| **Border** | 1px `outlineVariant` (`#C1C9BF` / `#414941`) |
| **Background** | `surfaceContainerLow` (`#F2F5EF` / `#191C19`) |
| **Padding** | 16px |

#### Card Internal Layout (horizontal)

```
┌─────────────────────────────────────────────────────────────────┐
│  ● Priority   Label text describing what needs attention         │
│    indicator   Supporting text with date/context                  │
│  (12px circle) ────────────────────────────  [Action Button]     │
└─────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Priority indicator | Circle, 12px diameter, left-aligned |
| — Urgent (today) | Fill: `error` (`#BA1A1A` / `#FFB4AB`) |
| — Soon (tomorrow) | Fill: `tertiary` (`#3A635F` / `#A0CDC7`) |
| — Info (gap) | Fill: `surfaceVariant` (`#DDE5DA` / `#414941`) |
| Label | `titleMedium` (16px, weight 500), `onSurface` |
| Supporting text | `bodySmall` (12px), `onSurfaceVariant` |
| Action button | `FilledTonalButton`, 36px height, `labelLarge` |
| — "Publish Now" | Uses `primary` / `onPrimary` (urgent) |
| — "Review Now" | Uses `secondary` / `onSecondary` (soon) |
| — "Start Ideation" | Uses `surfaceVariant` / `onSurfaceVariant` (info) |

#### Empty State (No Action Items)

| Property | Value |
|----------|-------|
| **M3 component** | `OutlinedCard` |
| **Content** | Check icon (`check_circle`, 40px, `primary`) |
| | "All caught up!" — `titleMedium`, `onSurface` |
| | "Next scheduled: [title] on [date]" — `bodySmall`, `onSurfaceVariant` |
| **Alignment** | Center-aligned, 32px vertical padding |

#### Interactive States

| State | Change |
|-------|--------|
| Default | As specified |
| Hover | Border color → `outline` (`#717971`), subtle elevation |
| Pressed | Background → `surfaceContainerHigh` |
| Focused | 2px `primary` outline |

---

## Section 3: Weekly Calendar

### Container
- **Section label:** "This Week" — `titleMedium`, `onSurfaceVariant`
- **Margin-top:** 24px
- **Layout:** 5 cards in a horizontal row (Mon–Fri), equal width

### Day Card

| Property | Value |
|----------|-------|
| **M3 component** | Custom component (based on `FilledCard`) |
| **Width** | Flexible, equal-distribute across row (approx 220px at 1200px content) |
| **Height** | 120px |
| **Border radius** | 12px |
| **Padding** | 12px |
| **Background** | Status color of the post assigned to that day |
| **Empty day** | `surfaceContainerLow` fill, dashed 1px `outlineVariant` border |

#### Day Card Internal Layout

| Element | Spec |
|---------|------|
| Day label | `labelMedium`, `onSurfaceVariant`, top-left |
| Date | `bodySmall`, `onSurfaceVariant`, top-right |
| Post title | `titleSmall` (14px, weight 500), `onSurface`, centered, max 2 lines, ellipsis |
| Status chip | `StatusChip` component (from 00-setup), bottom-center, 24px height variant |
| Empty label | "OPEN" — `labelMedium`, `onSurfaceVariant`, centered, 50% opacity |

#### Interactive States

| State | Change |
|-------|--------|
| Default | As specified |
| Hover (has post) | Elevation Level 2, cursor pointer |
| Hover (empty) | Border solid (not dashed), cursor default |
| Pressed | Scale 0.98 |

---

## Section 4: Quick Stats Row

### Container
- **Section label:** "Stats" — `titleMedium`, `onSurfaceVariant`
- **Margin-top:** 24px
- **Layout:** 4 `MetricCard` components in a horizontal row, 16px gap

### MetricCard Instances

| Card | Icon | Label | Example Value | Delta |
|------|------|-------|---------------|-------|
| Total Posts | `article` | "Posts this week" | "3/5" | — |
| Avg Engagement | `trending_up` | "Avg engagement" | "151" | "+12% ▲" (`primary`) |
| Best Pillar | `star` | "Top pillar" | "Skill-Building" | — |
| Next Scheduled | `schedule` | "Next scheduled" | "Mon Mar 16" | "in 2d" |

#### MetricCard Spec (per card)

| Property | Value |
|----------|-------|
| **M3 component** | `FilledCard` |
| **Width** | Flexible, equal-distribute (approx 280px at 1200px) |
| **Height** | 100px |
| **Border radius** | 12px |
| **Background** | `surfaceContainerHighest` (`#E1E4DE` / `#323532`) |
| **Padding** | 16px |

| Element | Typography | Color |
|---------|-----------|-------|
| Icon | 24px Material Symbol | `onSurfaceVariant` |
| Label | `labelMedium` (12px) | `onSurfaceVariant` |
| Value | `headlineSmall` (24px) | `onSurface` |
| Delta (positive) | `bodySmall` (12px) | `primary` (`#1B6B3A` / `#89D89E`) |
| Delta (negative) | `bodySmall` (12px) | `error` (`#BA1A1A` / `#FFB4AB`) |

---

## FAB (Floating Action Button)

| Property | Value |
|----------|-------|
| **M3 component** | `ExtendedFAB` |
| **Position** | Fixed, bottom-right of main content, 16px from right edge, 16px from bottom |
| **Label** | "Plan" |
| **Icon** | `add` (24px) |
| **Background** | `primaryContainer` (`#A4F5B8` / `#005225`) |
| **Text/Icon color** | `onPrimaryContainer` (`#002109` / `#A4F5B8`) |
| **Height** | 56px |
| **Border radius** | 16px |
| **Padding** | 16px horizontal |
| **Elevation** | Level 3 (resting), Level 4 (hovered) |

### FAB Menu (on click)

Opens a speed-dial menu upward with 3 options:

| Item | Icon | Label | Action |
|------|------|-------|--------|
| Plan | `lightbulb` | "Plan Post" | Opens ChatGPT (external) |
| Draft | `edit_note` | "Draft Post" | Opens ChatGPT (external) |
| Quick Post | `bolt` | "Quick Post" | Opens ChatGPT (external) |

Menu items: `surfaceContainerHigh` background, `onSurface` text, 48px height each, 8px gap, 12px border radius.

---

## Refresh Button

| Property | Value |
|----------|-------|
| **M3 component** | `IconButton` (standard) |
| **Position** | Page header row, right-aligned |
| **Icon** | `refresh` (24px) |
| **Color** | `onSurfaceVariant` |
| **Size** | 40px touch target |
| **Loading state** | Icon rotates 360° continuously (CSS animation) |

---

## Loading State (Skeleton)

When data is loading (>300ms threshold):

| Section | Skeleton |
|---------|----------|
| Pipeline funnel | 7 cards with `surfaceVariant` fill, shimmer animation left-to-right |
| Action items | 2–3 rectangular shimmer blocks (72px height, full width) |
| Calendar | 5 equal-width shimmer rectangles (120px height) |
| Stats row | 4 shimmer rectangles (100px height, equal width) |

Shimmer: linear gradient animation from `surfaceVariant` → `surfaceContainerLow` → `surfaceVariant`, 1.5s duration, infinite.

---

## Error State

### n8n Unreachable Banner

| Property | Value |
|----------|-------|
| **M3 component** | Custom `Banner` |
| **Position** | Top of main content, below page header |
| **Background** | `errorContainer` (`#FFDAD6` / `#93000A`) |
| **Text color** | `onErrorContainer` (`#410002` / `#FFDAD6`) |
| **Icon** | `error` (24px), left-aligned |
| **Message** | "Cannot connect to automation server. Showing cached data." |
| **Action** | `TextButton` "Retry" — `onErrorContainer` color |
| **Dismiss** | `IconButton` `close` (24px), right-aligned |
| **Border radius** | 12px |
| **Padding** | 16px |
| **Height** | Auto (min 56px) |

---

## Dark Mode Variant Notes

All components use semantic color tokens (not hard-coded hex), so switching to dark mode requires only swapping the color scheme:

| Element | Light | Dark |
|---------|-------|------|
| Page background | `#F8FAF5` | `#111411` |
| Pipeline cards | Lighter container tones | Darker container tones |
| Card borders | `#C1C9BF` | `#414941` |
| Text primary | `#191C19` | `#E1E4DE` |
| Text secondary | `#414941` | `#C1C9BF` |
| FAB | `#A4F5B8` bg | `#005225` bg |
| Arrows | `#C1C9BF` | `#414941` |

Elevation in dark mode: tonal surface tint becomes more visible (lighter overlay on dark surfaces) rather than shadow-based.

---

## M3 Components Summary

| Component | M3 Name | Count on Page |
|-----------|---------|---------------|
| `FilledCard` | Pipeline stage cards, MetricCards | 11 |
| `OutlinedCard` | Action item cards | 1–5 |
| `ExtendedFAB` | Primary action | 1 |
| `IconButton` | Refresh | 1 |
| `FilledTonalButton` | Action item CTAs | 1–3 |
| `StatusChip` (custom) | Calendar day status | 5 |
| `TopAppBar` | Header (global) | 1 |
| `NavigationRail` | Sidebar (global) | 1 |
| `LinearProgress` | Loading state | 1 |
| `Snackbar` | Action confirmations | (overlay) |
| `AlertDialog` | Publish confirmation | (overlay) |
