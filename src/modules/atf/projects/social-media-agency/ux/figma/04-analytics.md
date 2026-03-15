# Figma Spec — Analytics Page

**Route:** `/analytics`
**Frame size:** 1440 × 900px (viewport), content scrolls to ~1600px
**Purpose:** Performance metrics, trends, rankings, and strategy insights

---

## Page Header

| Property | Value |
|----------|-------|
| Layout | Row: title left, period selector + refresh right |
| Title | "Analytics", `headlineSmall` (24px), `onSurface` #191C19 |
| Right controls | `SegmentedButton` (period) + `IconButton` (refresh) |
| Gap between right controls | 8px |
| Margin-bottom | 24px |

### Time Range Selector

**M3 Component:** `SegmentedButton` (single-select, 3 segments)

| Property | Value |
|----------|-------|
| Segments | "7 days", "30 days", "90 days" |
| Width | 280px |
| Height | 40px |
| Corner radius | 20px (fully rounded) |
| Border | 1px `outline` #717971 |
| Selected bg | `secondaryContainer` #D1E8D4 |
| Selected text | `onSecondaryContainer` #0C1F13 |
| Selected icon | `check` 18px, left of label |
| Unselected bg | transparent |
| Unselected text | `onSurface` #191C19 |
| Label | `labelLarge` (14px, Medium) |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Hover (unselected) | 8% `onSurface` overlay |
| Pressed | 12% `onSurface` overlay |
| Selected → triggers data refetch | Selected bg fills segment |

### Dark Mode Header

| Element | Dark Value |
|---------|-----------|
| Title | `onSurface` #E1E4DE |
| SegmentedButton border | `outlineVariant` #414941 |
| Selected bg | `secondaryContainer` #374B3D |
| Selected text | `onSecondaryContainer` #D1E8D4 |
| Unselected text | `onSurface` #E1E4DE |

---

## Section 1: Overview Cards (4 Metrics)

**Layout:** Row of 4 equal-width cards

| Property | Value |
|----------|-------|
| Gap | 16px |
| Margin-bottom | 32px (spacing.xl) |

### MetricCard

**M3 Component:** `FilledCard`

| Property | Value |
|----------|-------|
| Background | `surfaceContainerHighest` #E1E4DE |
| Corner radius | 12px |
| Padding | 20px |
| Min width | 200px |
| Height | 112px |
| Layout | Vertical stack, 4px gap |

**Card content:**

| Element | Style | Token |
|---------|-------|-------|
| Icon | 24px Material icon | `primary` #1B6B3A |
| Value | `headlineMedium` (28px, Regular) | `onSurface` #191C19 |
| Label | `labelMedium` (12px, Medium) | `onSurfaceVariant` #414941 |
| Delta | `bodySmall` (12px) with ▲/▼ icon | `primary` if up, `error` if down |

**The 4 cards:**

| # | Icon | Value | Label | Delta |
|---|------|-------|-------|-------|
| 1 | `article` | "5" | "Posts published" | — |
| 2 | `trending_up` | "151" | "Avg engagement" | "+12% ▲" |
| 3 | `percent` | "1.26%" | "Avg engagement rate" | "+0.3% ▲" |
| 4 | `star` | "Skill-Building" | "Top pillar" | — |

**Delta styling:**

| Direction | Icon | Color (light) | Color (dark) |
|-----------|------|---------------|-------------|
| Up (positive) | `arrow_upward` 12px | `primary` #1B6B3A | `primary` #89D89E |
| Down (negative) | `arrow_downward` 12px | `error` #BA1A1A | `error` #FFB4AB |
| Flat | `remove` 12px | `onSurfaceVariant` #414941 | `onSurfaceVariant` #C1C9BF |

### Dark Mode Cards

| Property | Dark Value |
|----------|-----------|
| Card bg | `surfaceContainerHighest` #323532 |
| Icon | `primary` #89D89E |
| Value | `onSurface` #E1E4DE |
| Label | `onSurfaceVariant` #C1C9BF |

---

## Section 2: Engagement Over Time Chart

**Layout:** Full-width card

| Property | Value |
|----------|-------|
| Component | `OutlinedCard` |
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 24px |
| Height | 360px |
| Margin-bottom | 32px (spacing.xl) |

**Section header (inside card):**

| Property | Value |
|----------|-------|
| Title | "Engagement Over Time", `titleLarge` (22px), `onSurface` |
| Margin-bottom | 16px |

### Line Chart (Recharts)

| Property | Value |
|----------|-------|
| Chart type | `LineChart` with `ResponsiveContainer` |
| Width | Fill card (minus padding) |
| Height | 280px |
| Background | transparent |

**Axes:**

| Axis | Style |
|------|-------|
| X-axis (dates) | `labelSmall` (11px), `onSurfaceVariant` #414941, 45° rotation if >14 labels |
| Y-axis (engagement score) | `labelSmall` (11px), `onSurfaceVariant` #414941 |
| Grid lines | 1px `outlineVariant` #C1C9BF at 30% opacity, horizontal only |
| Axis line | 1px `outline` #717971 |

**Data lines:**

| Series | Stroke Color (light) | Stroke Color (dark) | Width | Dash |
|--------|---------------------|---------------------|-------|------|
| Engagement score | `primary` #1B6B3A | `primary` #89D89E | 2px | Solid |
| Benchmark average | `outline` #717971 | `outline` #8B938A | 1px | 4px dash, 4px gap |

**Data points:**

| Property | Value |
|----------|-------|
| Dot | 6px circle |
| Fill | `primary` #1B6B3A (light) / `primary` #89D89E (dark) |
| Active dot (hover) | 8px circle, `primary` fill, 2px `surface` stroke |

**Tooltip (on hover):**

| Property | Value |
|----------|-------|
| Component | Custom card tooltip |
| Background | `surfaceContainerHighest` #E1E4DE |
| Corner radius | 8px |
| Padding | 12px |
| Shadow | 0 2px 8px rgba(0,0,0,0.1) |
| Date | `labelMedium` (12px, Medium), `onSurfaceVariant` |
| Value | `titleSmall` (14px, Medium), `onSurface` |
| Post title | `bodySmall` (12px), `onSurfaceVariant` |

**Legend:**

| Property | Value |
|----------|-------|
| Position | Top-right inside chart area |
| Items | Colored line + label for each series |
| Label | `labelSmall` (11px), `onSurfaceVariant` |
| Gap | 16px between items |

### Dark Mode Chart

| Element | Dark Value |
|---------|-----------|
| Card border | `outlineVariant` #414941 |
| Grid lines | `outlineVariant` #414941 at 30% |
| Axis text | `onSurfaceVariant` #C1C9BF |
| Tooltip bg | `surfaceContainerHighest` #323532 |

---

## Section 3: By Pillar & By Framework (Side-by-Side Charts)

**Layout:** Two-column row

| Property | Value |
|----------|-------|
| Gap | 24px |
| Left column | 50% width — "By Pillar" |
| Right column | 50% width — "By Framework" |
| Margin-bottom | 32px |

### Bar Chart Card (shared spec)

**M3 Component:** `OutlinedCard`

| Property | Value |
|----------|-------|
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 24px |
| Height | 320px |

**Section header (inside card):**

| Property | Value |
|----------|-------|
| Title | "By Pillar" / "By Framework", `titleLarge` (22px), `onSurface` |
| Margin-bottom | 16px |

### Horizontal Bar Chart

| Property | Value |
|----------|-------|
| Chart type | `BarChart` (horizontal) |
| Height | 240px |
| Bar height | 24px |
| Bar gap | 12px |
| Bar corner radius | 4px |
| Background | transparent |

**Bar colors (by pillar):**

| Pillar | Light Color | Dark Color |
|--------|------------|-----------|
| Skill-Building | `#1B6B3A` | `#89D89E` |
| Career | `#4F6354` | `#B5CCB9` |
| Leadership | `#3A635F` | `#A0CDC7` |
| Personal | `#6B5E3A` | `#D4C89E` |
| Tech | `#5A3A6B` | `#C89ED4` |

**Bar labels:**

| Element | Style |
|---------|-------|
| Category label (left) | `bodyMedium` (14px), `onSurface`, left-aligned |
| Value label (right of bar) | `labelMedium` (12px, Medium), `onSurfaceVariant` |

**Bar colors (by framework — uses primary/secondary/tertiary cycle):**

| Framework | Light Color | Dark Color |
|-----------|------------|-----------|
| Contrarian | `#1B6B3A` | `#89D89E` |
| Story Hook | `#4F6354` | `#B5CCB9` |
| Question | `#3A635F` | `#A0CDC7` |
| List Hook | `#6B5E3A` | `#D4C89E` |

**Interactive states:**

| State | Change |
|-------|--------|
| Hover on bar | Bar opacity 80%, tooltip with exact value |
| Tooltip | Same spec as line chart tooltip |

---

## Section 4: Post Rankings Table

**Layout:** Full-width card

| Property | Value |
|----------|-------|
| Margin-bottom | 32px |

**M3 Component:** `DataTable` inside `OutlinedCard`

| Property | Value |
|----------|-------|
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 0 (table fills card) |

### Table Header

| Property | Value |
|----------|-------|
| Background | `surfaceContainerHighest` #E1E4DE |
| Height | 48px |
| Text | `titleSmall` (14px, Medium), `onSurface` |
| Cell padding | 16px horizontal |
| Sort icon | `arrow_upward`/`arrow_downward` 16px, `onSurfaceVariant`, after column label |
| Sort active | Icon colored `primary` #1B6B3A |

### Table Columns

| Column | Width | Align | Sortable | Content |
|--------|-------|-------|----------|---------|
| # (rank) | 48px | Center | No | `bodyMedium`, `onSurfaceVariant` |
| Post | flex (fill) | Left | Yes | `titleSmall` (14px, Medium), `onSurface` — truncated |
| Pillar | 120px | Left | Yes | `FilterChip` (pillar-colored) |
| Engagement | 100px | Right | Yes (default desc) | `bodyMedium`, `onSurface`, bold if top 3 |
| Rate | 80px | Right | Yes | `bodyMedium`, `onSurface` |
| Trend | 80px | Center | Yes | ▲ / ▼ / ≈ icons, colored |

### Table Rows

| Property | Value |
|----------|-------|
| Height | 56px |
| Cell padding | 16px horizontal |
| Body text | `bodyMedium` (14px), `onSurface` |
| Divider | 1px `outlineVariant` between rows |
| Hover | `surfaceContainerLow` #F2F5EF bg |
| Click | Navigate to `/posts/:id` |
| Cursor | Pointer on hover |

**Trend indicator:**

| Trend | Icon | Color (light) | Color (dark) |
|-------|------|---------------|-------------|
| Strong up | `trending_up` 16px | `primary` #1B6B3A | `primary` #89D89E |
| Moderate up | `arrow_upward` 16px | `primary` #1B6B3A | `primary` #89D89E |
| Flat | `remove` 16px | `onSurfaceVariant` #414941 | `onSurfaceVariant` #C1C9BF |
| Down | `trending_down` 16px | `error` #BA1A1A | `error` #FFB4AB |
| Strong down | `trending_down` 16px (2×) | `error` #BA1A1A | `error` #FFB4AB |

**Resurgence badge (inline):**

| Property | Value |
|----------|-------|
| Icon | `local_fire_department` 16px |
| Color | `tertiary` #3A635F (light) / `#A0CDC7` (dark) |
| Position | After engagement value |
| Tooltip | "Resurgence: Day 14 engagement exceeded Day 7" |

### Dark Mode Table

| Element | Dark Value |
|---------|-----------|
| Header bg | `surfaceContainerHighest` #323532 |
| Row hover | `surfaceContainerLow` #191C19 |
| Sort active icon | `primary` #89D89E |
| Divider | `outlineVariant` #414941 |
| Card border | `outlineVariant` #414941 |

---

## Section 5: Resurgence Alerts Banner

**M3 Component:** `Banner`

**Shown when:** Any published post has Day 14 engagement > Day 7 engagement

| Property | Value |
|----------|-------|
| Position | Between overview cards and chart (or top of page) |
| Background | `tertiaryContainer` #BCE9E3 |
| Text color | `onTertiaryContainer` #00201D |
| Corner radius | 12px |
| Padding | 16px |
| Margin-bottom | 24px |
| Icon | `local_fire_department` 24px, `tertiary` #3A635F |

**Content layout:**

| Element | Style |
|---------|-------|
| Title | "Resurgence Detected", `titleSmall` (14px, Medium), `onTertiaryContainer` |
| Body | "{post_title} saw {X}% more engagement on Day 14 than Day 7. This post may be going viral late.", `bodyMedium`, `onTertiaryContainer` |
| Action | `TextButton` "View Post", `tertiary` #3A635F |
| Dismiss | `IconButton` `close` 24px, right-aligned |

### Dark Mode Banner

| Element | Dark Value |
|---------|-----------|
| Background | `tertiaryContainer` #204B47 |
| Text | `onTertiaryContainer` #BCE9E3 |
| Icon | `tertiary` #A0CDC7 |
| Action button | `tertiary` #A0CDC7 |

---

## Section 6: Collection Schedule

**M3 Component:** `OutlinedCard` with `Badge`

| Property | Value |
|----------|-------|
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 16px |
| Background | `surface` #F8FAF5 |

**Content:**

| Element | Style |
|---------|-------|
| Header icon | `schedule` 24px, `error` #BA1A1A (if overdue) or `onSurfaceVariant` (normal) |
| Title | "{N} posts due for metric collection", `titleSmall`, `onSurface` |
| Post items | List of posts with day-due info |
| Post item | `bodyMedium`, `onSurface`: "{title} — Day {N} (published {relative_date})" |
| CTA | `FilledTonalButton` "Collect Metrics Guide" |

### Dark Mode Collection Schedule

| Element | Dark Value |
|---------|-----------|
| Border | `outlineVariant` #414941 |
| Background | `surface` #111411 |
| Overdue icon | `error` #FFB4AB |

---

## Empty States

### No Published Posts

| Property | Value |
|----------|-------|
| Icon | `analytics` 64px, `onSurfaceVariant` at 50% |
| Title | "No analytics data yet.", `titleLarge`, `onSurface` |
| Body | "Publish your first post and collect metrics to see performance insights here.", `bodyMedium`, `onSurfaceVariant` |
| Subtitle | "Pipeline status: {N} posts in progress →", `bodySmall` |
| CTA | `FilledTonalButton` "View Pipeline" → `/dashboard` |

### Published But No Metrics

| Property | Value |
|----------|-------|
| Title | "You have {N} published posts but no metrics collected.", `titleMedium` |
| Body | "Collect metrics using the JS snippet in Chrome DevTools" |
| Post list | Bulleted list of overdue posts |
| CTA | `FilledTonalButton` "How to Collect Metrics" → help dialog |

### Insufficient Data for Recommendations

| Property | Value |
|----------|-------|
| Component | `OutlinedCard` with `warning` icon |
| Background | `surfaceVariant` #DDE5DA at 50% |
| Title | "Need more data for reliable recommendations.", `titleSmall` |
| Body | "Current: {N} posts with metrics\nRequired: 5+ posts for pillar analysis" |
| Tone | Encouraging: "Keep publishing and collecting metrics!" |

### Loading State

| Element | Skeleton |
|---------|----------|
| Overview cards | 4 shimmer cards in row |
| Chart | Shimmer rectangle 100% × 280px |
| Bar charts | 2 shimmer rectangles side-by-side |
| Table | 5 shimmer rows (48px each) |
| Progress | `LinearProgress` indeterminate at top |

---

## Component Summary

| Component | M3 Kit Name | Count |
|-----------|-------------|-------|
| SegmentedButton | `SegmentedButton` | 1 (period) |
| FilledCard | `FilledCard` | 4 (overview) |
| OutlinedCard | `OutlinedCard` | 4 (chart, 2× bar, collection) |
| DataTable | `DataTable` | 1 (rankings) |
| FilterChip | `FilterChip` | 5 (pillar chips in table) |
| Banner | `Banner` | 1 (resurgence alert) |
| IconButton | `IconButton` | 2 (refresh, dismiss) |
| FilledTonalButton | `FilledTonalButton` | 2 (collect metrics, view pipeline) |
| TextButton | `TextButton` | 1 (view post in banner) |
| LinearProgress | `LinearProgress` | 1 (loading) |
| PlainTooltip | `PlainTooltip` | 2+ (chart, resurgence) |
| Divider | `Divider` | 1+ (table rows) |
