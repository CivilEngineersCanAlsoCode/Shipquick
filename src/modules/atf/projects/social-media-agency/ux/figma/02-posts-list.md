# Figma Spec — Posts List Page

**Route:** `/posts`
**Frame size:** 1440 × 900px (viewport), content scrolls
**Purpose:** Browse, filter, sort, and manage all posts

---

## Page Header

| Property | Value |
|----------|-------|
| Layout | Row: title left, FAB right |
| Title | "Posts", `headlineSmall` (24px), `onSurface` #191C19 |
| Margin-bottom | 24px (spacing.lg) |

---

## Filter Bar

**Layout:** Horizontal row, wraps on smaller viewports

| Property | Value |
|----------|-------|
| Container | No card — inline within content area |
| Height | 48px |
| Margin-bottom | 16px |
| Gap between elements | 8px |
| Alignment | Vertical center |

### Status Filter — SegmentedButton

**M3 Component:** `SegmentedButton` (multi-select variant) OR row of `FilterChip`

> **Recommended:** Use `FilterChip` row for status filtering (9 statuses is too many for SegmentedButton). Use `SegmentedButton` only for a simplified "All | Active | Published | Cancelled" grouping.

#### Simplified SegmentedButton

| Property | Value |
|----------|-------|
| Component | `SegmentedButton` (4 segments) |
| Height | 40px |
| Corner radius | 20px (fully rounded) |
| Border | 1px `outline` #717971 |
| Segments | "All", "Active", "Published", "Cancelled" |
| Selected bg | `secondaryContainer` #D1E8D4 |
| Selected text | `onSecondaryContainer` #0C1F13 |
| Unselected bg | transparent |
| Unselected text | `onSurface` #191C19 |
| Label | `labelLarge` (14px, Medium) |
| Checkmark | 18px `check` icon left of label when selected |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Hover (unselected) | 8% `onSurface` overlay |
| Pressed | 12% `onSurface` overlay |
| Selected | Filled with `secondaryContainer` |

#### Detailed FilterChip Row (alternative)

If using individual `FilterChip` per status:

| Property | Value |
|----------|-------|
| Component | `FilterChip` (multi-select) |
| Height | 32px |
| Corner radius | 8px |
| Gap | 8px |
| Selected | Status-specific color (see StatusChip in 00-setup-guide.md) |
| Unselected | `surface` with `outline` border |

### Pillar Filter

**M3 Component:** `FilterChip` (multi-select)

| Property | Value |
|----------|-------|
| Chips | "Career", "Personal", "Skill-Building", "Leadership", "Tech" |
| Height | 32px |
| Corner radius | 8px |
| Gap | 8px |
| Selected bg | `primaryContainer` #A4F5B8 |
| Selected text | `onPrimaryContainer` #002109 |
| Selected icon | `check` 18px, left of label |
| Unselected bg | transparent |
| Unselected border | 1px `outline` #717971 |
| Unselected text | `onSurfaceVariant` #414941 |
| Label | `labelLarge` (14px, Medium) |

### Search Bar

**M3 Component:** `SearchBar`

| Property | Value |
|----------|-------|
| Width | 280px (fixed) or flexible |
| Height | 48px |
| Corner radius | 28px (fully rounded per M3 SearchBar) |
| Background | `surfaceContainerHigh` #E7EAE4 |
| Leading icon | `search` 24px, `onSurfaceVariant` #414941 |
| Placeholder text | "Search posts...", `bodyLarge` (16px), `onSurfaceVariant` at 60% |
| Input text | `bodyLarge` (16px), `onSurface` #191C19 |
| Trailing icon (when active) | `close` 24px (clears input) |

**Interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Focused | 2px `primary` #1B6B3A outline, background `surfaceContainerLowest` #FFFFFF |
| With text | Trailing close icon appears |

### Sort Dropdown

| Property | Value |
|----------|-------|
| Trigger | `OutlinedButton` with `sort` icon + "Sort: Date ↓" label |
| Component | `DropdownMenu` |
| Options | "Scheduled date", "Status", "Score", "Engagement" |
| Menu bg | `surfaceContainerHigh` #E7EAE4 |
| Item height | 48px |
| Item label | `bodyLarge` (16px), `onSurface` |
| Selected item | `check` icon trailing, `primary` text |
| Corner radius | 12px |

### Dark Mode Filter Bar

| Element | Dark Value |
|---------|-----------|
| SegmentedButton border | `outlineVariant` #414941 |
| SegmentedButton selected bg | `secondaryContainer` #374B3D |
| FilterChip selected bg | `primaryContainer` #005225 |
| SearchBar bg | `surfaceContainerHigh` #272A27 |
| SearchBar focused outline | `primary` #89D89E |

---

## Post Cards (List Items)

**M3 Component:** `OutlinedCard` (clickable)

### Card Layout

| Property | Value |
|----------|-------|
| Width | 100% (fill container) |
| Min height | 96px |
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 16px all sides |
| Gap between cards | 8px |
| Layout | Row: status indicator (left) → content (center, flex-grow) → actions (right) |

### Card Content — Left: Status Indicator

| Property | Value |
|----------|-------|
| Component | StatusChip (custom, see 00-setup-guide.md) |
| Position | Left-aligned, vertically centered |
| Width | auto (fits content) |
| Margin-right | 16px |

### Card Content — Center: Post Info

**Vertical stack, 4px gap between elements:**

| Element | Style | Token |
|---------|-------|-------|
| Title | `titleMedium` (16px, Medium 500) | `onSurface` #191C19 |
| Metadata row | `bodySmall` (12px, Regular) | `onSurfaceVariant` #414941 |
| Framework chips row | Row of `AssistChip` components | — |
| Preview text (truncated) | `bodyMedium` (14px), max 2 lines, ellipsis | `onSurfaceVariant` #414941 |

**Metadata row format:** `{date} | {pillar} | Score: {score} | {char_count} chars`

- Date: `bodySmall`, formatted "Mon Mar 16"
- Separator: " | " in `onSurfaceVariant` at 50% opacity
- Pillar: `bodySmall`, `primary` #1B6B3A
- Score: `bodySmall`, `onSurface`

**Framework chips (AssistChip):**

| Property | Value |
|----------|-------|
| Component | `AssistChip` |
| Height | 24px |
| Corner radius | 8px |
| Background | transparent |
| Border | 1px `outlineVariant` #C1C9BF |
| Label | `labelSmall` (11px, Medium) |
| Text color | `onSurfaceVariant` #414941 |
| Gap | 4px |
| Examples | "Hook: Contrarian", "Tone: Conversational" |

### Card Content — Right: Action Buttons

| Property | Value |
|----------|-------|
| Layout | Vertical stack, 8px gap |
| Alignment | Right-aligned, vertically centered |

**Action buttons per status:**

| Status | Primary Action | Secondary Action |
|--------|---------------|-----------------|
| Scheduled_NoDraft | `OutlinedButton` "Draft" | — |
| Drafting | — | — |
| Drafted | `FilledTonalButton` "Format" | — |
| Formatting | — | — |
| Previewed | `FilledTonalButton` "Review" | — |
| Ready_ToPublish | `FilledButton` "Publish" | `OutlinedButton` "Review" |
| Published | `TextButton` "Analytics" | — |
| Publish_Failed | `FilledButton` "Retry" | — |
| Cancelled | — | — |

**Button specs:**

| Property | Value |
|----------|-------|
| Height | 36px |
| Corner radius | 18px (fully rounded) |
| Padding | 16px horizontal |
| Label | `labelLarge` (14px, Medium) |

### Card Interactive States

| State | Change |
|-------|--------|
| Default | As above |
| Hover | Background `surfaceContainerLow` #F2F5EF, cursor pointer |
| Pressed | Background `surfaceContainerHigh` #E7EAE4 |
| Focus | 2px `primary` outline |
| Click | Navigate to `/posts/:id` |

### Card — Published Variant

Published posts show engagement data instead of score:

| Element | Content |
|---------|---------|
| Metadata row | `{published_date} | {pillar} | Engagement: {score} | 📈 Day {N}` |
| Extra line | `bodySmall`: "URN: urn:li:share:712... | Published 9:47 AM" |

### Dark Mode Card

| Property | Dark Value |
|----------|-----------|
| Border | `outlineVariant` #414941 |
| Hover bg | `surfaceContainerLow` #191C19 |
| Title | `onSurface` #E1E4DE |
| Metadata | `onSurfaceVariant` #C1C9BF |

---

## Empty States

### No Posts at All

| Property | Value |
|----------|-------|
| Container | Centered in content area |
| Icon | `description` 64px, `onSurfaceVariant` #414941 at 50% |
| Title | "No posts yet.", `titleLarge` (22px), `onSurface` |
| Body | "Start by adding briefs to Google Sheets\nand running Content Ideation in ChatGPT.", `bodyMedium`, `onSurfaceVariant` |
| CTA | `FilledTonalButton` "Start Ideation in ChatGPT", opens external |
| Vertical spacing | 16px between elements |

### No Results (Filters Active)

| Property | Value |
|----------|-------|
| Container | Inline in content area (replaces cards) |
| Active filters shown | Row of `FilterChip` with `×` trailing icon + "Clear All" `TextButton` |
| Title | "No posts match your filters.", `titleMedium` (16px), `onSurface` |
| Body | "Try adjusting or clearing filters.", `bodyMedium`, `onSurfaceVariant` |

### Loading State

| Property | Value |
|----------|-------|
| Skeleton | 3–4 outlined card shapes with shimmer |
| Shimmer lines | 3 per card: title (60% width), metadata (80% width), chips (40% width) |
| Filter chips | Rendered immediately (not skeletonized) |
| Progress | `LinearProgress` indeterminate, top of content area |

### Error State

| Property | Value |
|----------|-------|
| Component | `Banner` at top of content area |
| Background | `errorContainer` #FFDAD6 |
| Text | "Failed to load posts. Check your connection and try again.", `bodyMedium`, `onErrorContainer` #410002 |
| Actions | `TextButton` "Retry", `TextButton` "Dismiss" |

---

## Pagination

**Layout:** Row, centered below post cards

| Property | Value |
|----------|-------|
| Margin-top | 24px |
| Height | 40px |
| Gap | 4px |
| Info text | "Showing 1–10 of 21 posts", `bodySmall`, `onSurfaceVariant` #414941, left-aligned |

**Page buttons:**

| Element | Component | Specs |
|---------|-----------|-------|
| Previous | `IconButton` (outlined) | `chevron_left` 24px, 40 × 40px |
| Page numbers | `IconButton` (tonal for current) | 40 × 40px, `labelLarge` text |
| Current page | `IconButton` (filled tonal) | `secondaryContainer` bg |
| Next | `IconButton` (outlined) | `chevron_right` 24px |
| Disabled (no more pages) | `IconButton` disabled | 38% opacity |

---

## FAB

**M3 Component:** `ExtendedFAB`

| Property | Value |
|----------|-------|
| Position | Fixed bottom-right (same as dashboard) |
| Icon | `add` 24px |
| Label | "New Ideation" |
| Background | `primaryContainer` #A4F5B8 |
| Text/Icon color | `onPrimaryContainer` #002109 |
| Click action | Opens ChatGPT external link |
| Corner radius | 16px |
| Elevation | Level 3 |

---

## Component Summary

| Component | M3 Kit Name | Count |
|-----------|-------------|-------|
| SegmentedButton | `SegmentedButton` | 1 (status filter) |
| FilterChip | `FilterChip` | 5 (pillar) + optional 9 (status) |
| SearchBar | `SearchBar` | 1 |
| OutlinedCard | `OutlinedCard` | 10 (posts per page) |
| AssistChip | `AssistChip` | 2 per card × 10 = 20 |
| StatusChip (custom) | — | 10 (1 per card) |
| FilledButton | `FilledButton` | Variable |
| FilledTonalButton | `FilledTonalButton` | Variable |
| OutlinedButton | `OutlinedButton` | Variable |
| TextButton | `TextButton` | Variable |
| IconButton | `IconButton` | 4+ (pagination) |
| DropdownMenu | `DropdownMenu` | 1 (sort) |
| ExtendedFAB | `ExtendedFAB` | 1 |
| LinearProgress | `LinearProgress` | 1 (loading) |
| Banner | `Banner` | 1 (error state) |
