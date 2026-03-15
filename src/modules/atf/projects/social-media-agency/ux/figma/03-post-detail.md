# Figma Spec — Post Detail Page

**Route:** `/posts/:id`
**Frame size:** 1440 × 900px (viewport), content scrolls to ~1800px
**Purpose:** Full post view with editor, preview, status tracking, and engagement data

---

## Page Header

| Property | Value |
|----------|-------|
| Layout | Row: breadcrumb left, actions right |
| Breadcrumb | "Posts / {post title}", `titleMedium` (16px, Medium), `onSurface` |
| "Posts" link | `TextButton` style, `primary` #1B6B3A, clickable → `/posts` |
| " / " separator | `onSurfaceVariant` #414941 |
| Post title | `titleMedium`, `onSurface` #191C19 (not clickable) |
| Right actions | `IconButton` "Edit" (`edit` icon) + `OutlinedButton` "Actions ▾" |
| Margin-bottom | 24px |

### Actions Dropdown Menu

**M3 Component:** `DropdownMenu`

| Property | Value |
|----------|-------|
| Trigger | `OutlinedButton` "Actions ▾", `more_vert` icon |
| Background | `surfaceContainerHigh` #E7EAE4 |
| Corner radius | 12px |
| Elevation | Level 4 (12% tint) |
| Item height | 48px |
| Item padding | 16px horizontal |
| Item label | `bodyLarge` (16px), `onSurface` |
| Divider | `Divider` between action groups |

**Menu items (shown/hidden based on status):**

| Item | Icon | Shown When | Text Color |
|------|------|-----------|------------|
| Publish | `send` | Ready_ToPublish | `primary` #1B6B3A |
| Approve | `check_circle` | Previewed | `primary` |
| Reject | `cancel` | Previewed | `error` #BA1A1A |
| Edit | `edit` | Scheduled, Drafted, Previewed | `onSurface` |
| Format | `format_paint` | Drafted | `onSurface` |
| Reschedule | `event` | Any pre-publish | `onSurface` |
| — divider — | | | |
| Send Back | `undo` | Drafted, Formatted, Previewed | `onSurfaceVariant` |
| Drop | `delete` | Any pre-publish | `error` #BA1A1A |

---

## Section 1: Status Timeline (Stepper)

**M3 Component:** Custom `StatusStepper` (horizontal)

| Property | Value |
|----------|-------|
| Container | Full-width `OutlinedCard` |
| Card padding | 24px horizontal, 16px vertical |
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Margin-bottom | 24px |

### Stepper Layout

**7 steps in a horizontal row with connectors:**

```
●───────●───────●───────●───────●───────◐───────○
Sch     Draft   Draftd  Fmt     Prev    Ready   Pub
```

**Step order:** Scheduled → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published

*Note: This follows the pipeline flow A→B→F→C→D→E mapped to statuses.*

| Element | Property | Value |
|---------|----------|-------|
| Step circle (completed) | Size | 24px diameter |
| | Fill | `primary` #1B6B3A |
| | Icon | `check` 16px, `onPrimary` #FFFFFF |
| Step circle (current) | Size | 24px diameter |
| | Fill | `primary` #1B6B3A |
| | Ring | 4px pulsing ring, `primaryContainer` #A4F5B8 at 50% |
| | Icon | None (filled dot) |
| Step circle (future) | Size | 24px diameter |
| | Fill | transparent |
| | Border | 2px `outline` #717971 |
| Connector (completed) | Height | 2px |
| | Width | 40px (flexible, fills gap) |
| | Color | `primary` #1B6B3A |
| Connector (future) | Height | 2px dashed |
| | Width | 40px (flexible) |
| | Color | `outline` #717971 |
| | Dash | 4px dash, 4px gap |
| Step label | Style | `labelSmall` (11px, Medium) |
| | Color (completed) | `primary` #1B6B3A |
| | Color (current) | `primary` #1B6B3A |
| | Color (future) | `onSurfaceVariant` #414941 |
| | Position | 4px below circle, center-aligned |

**Current status indicator:**

| Property | Value |
|----------|-------|
| Text | "Current: {status_name}", `bodySmall` (12px), `primary` |
| Position | Below stepper, right-aligned |
| Margin-top | 8px |

### Dark Mode Stepper

| Element | Dark Value |
|---------|-----------|
| Completed circle fill | `primary` #89D89E |
| Completed check icon | `onPrimary` #003916 |
| Current ring | `primaryContainer` #005225 at 50% |
| Future border | `outline` #8B938A |
| Completed connector | `primary` #89D89E |
| Future connector | `outline` #8B938A |
| Completed/current label | `primary` #89D89E |
| Future label | `onSurfaceVariant` #C1C9BF |

---

## Section 2: Split View (Metadata + Preview)

**Layout:** Two-column row

| Property | Value |
|----------|-------|
| Gap | 24px (spacing.lg) |
| Left column (metadata) | 40% width, min 360px |
| Right column (preview) | 60% width, min 480px |
| Margin-bottom | 24px |

### Left Column: Metadata Panel / Editor

**M3 Component:** `OutlinedCard`

| Property | Value |
|----------|-------|
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 24px |

#### View Mode (default)

**Key-value pairs in vertical stack, 12px gap:**

| Key | Style | Value Style |
|-----|-------|-------------|
| Label (key) | `labelMedium` (12px, Medium), `onSurfaceVariant` #414941 | — |
| Value | `bodyMedium` (14px, Regular), `onSurface` #191C19 | — |
| Divider | `Divider` (1px, `outlineVariant`) between groups | — |

**Metadata fields:**

| Group | Key | Value Example | Special |
|-------|-----|---------------|---------|
| **Identity** | Pillar | "Skill-Building" | `FilterChip` with pillar color |
| | Score | "134 / 160" | Score badge (see below) |
| | Scheduled | "Mon Mar 16, 2026" | — |
| **Divider** | | | |
| **Framework** | Hook | "Contrarian" | `AssistChip` |
| | Narrative | "Story-to-Insight" | `AssistChip` |
| | CTA | "Follow+Engage" | `AssistChip` |
| | Tone | "Conversational" | `AssistChip` |
| **Divider** | | | |
| **Format** | Characters | "1,089" | — |
| | FK Grade | "6.2" | Green if ≤7, yellow if ≤9, red if >9 |
| | Emojis | "2 / 3" | — |
| | Hashtags | "5" | — |
| | Hindi sentences | "1 / 3" | — |
| **Divider** | | | |
| **Experience** | Linked experience | "Built dashboard query that saved 40hrs" | Quoted, `bodySmall` |
| | Similarity | "0.91" | — |

#### Score Breakdown Card

**Nested inside metadata panel, below Identity group:**

| Property | Value |
|----------|-------|
| Container | `FilledCard` (inline) |
| Background | `surfaceContainerHighest` #E1E4DE |
| Corner radius | 8px |
| Padding | 12px |

**Score breakdown layout:**

```
┌─────────────────────────────────┐
│  F = 8 × 8  = 64  ████████░░  │
│  P = 7 × 5  = 35  ███████░░░  │
│  R = 7 × 3  = 21  ███████░░░  │
│  ─────────────────────────────  │
│  Total:        134 / 160       │
└─────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Dimension label (F, P, R) | `labelMedium` (12px, Medium), `onSurfaceVariant` |
| Formula | `bodySmall` (12px), `onSurfaceVariant` |
| Result | `bodyMedium` (14px, Medium 500), `onSurface` |
| Progress bar | `LinearProgress` (determinate), 4px height, score/10 as % |
| | `primary` #1B6B3A fill, `surfaceVariant` #DDE5DA track |
| Total label | `titleSmall` (14px, Medium), `onSurface` |
| Total value | `titleMedium` (16px, Medium), `primary` #1B6B3A |

#### Edit Mode (inline editor)

When "Edit" is triggered, metadata fields become editable:

| Field | Component |
|-------|-----------|
| Content body | `OutlinedTextField` (multiline) |
| Character counter | `bodySmall` below text field, "{count} / 1600 chars" |
| | Red if > 1600 or < 800 |
| Formatting toolbar | Row of `IconButton`: Bold, Italic, Emoji picker, Hashtag |
| | 32px icons, 4px gap |

**TextField specs:**

| Property | Value |
|----------|-------|
| Component | `OutlinedTextField` (multiline) |
| Min height | 200px |
| Border | 1px `outline` #717971 |
| Focused border | 2px `primary` #1B6B3A |
| Error border | 2px `error` #BA1A1A |
| Label | "Post Content", `bodySmall`, floating |
| Input text | `bodyLarge` (16px), `onSurface`, monospace for content |
| Corner radius | 4px (M3 TextField standard) |

### Right Column: LinkedIn Preview

**M3 Component:** `FilledCard`

| Property | Value |
|----------|-------|
| Corner radius | 12px |
| Background | `surfaceContainerLowest` #FFFFFF |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 0 (content fills card) |

#### LinkedIn Post Mock

Render a mock LinkedIn post card:

```
┌──────────────────────────────────────────────┐
│  ┌────┐  Satvik Jain                         │
│  │ 👤 │  Senior PM at American Express       │
│  │    │  Just now · 🌐                       │
│  └────┘                                      │
│                                              │
│  Most PMs think SQL is "nice to have."       │
│                                              │
│  They're wrong.                              │
│                                              │
│  Here's why every PM should learn SQL...     │
│  ...                                         │
│  ... (content continues) ...                 │
│  ...                                         │
│  #ProductManagement #SQL #CareerGrowth       │
│                                              │
│  ─────────────────────────────────────────── │
│  👍 12  💬 3  🔄 1                           │
│  ─────────────────────────────────────────── │
│  👍 Like  💬 Comment  🔄 Repost  📤 Send    │
└──────────────────────────────────────────────┘
```

**Mock specs:**

| Element | Style |
|---------|-------|
| Profile pic | 48px circle, `primary` #1B6B3A with "SJ" in `onPrimary` |
| Name | `titleSmall` (14px, Medium 500), `onSurface` |
| Subtitle | `bodySmall` (12px), `onSurfaceVariant` |
| Content | `bodyLarge` (16px), `onSurface`, line-height 24px |
| Hashtags | `bodyMedium` (14px), `primary` #1B6B3A |
| Reactions bar | `bodySmall` (12px), `onSurfaceVariant` |
| Action bar | `labelMedium` (12px, Medium), `onSurfaceVariant` |
| Dividers | 1px `outlineVariant` #C1C9BF |
| Padding | 16px all sides |

**Scroll behavior:** If content exceeds card height, card scrolls internally (max-height 600px).

**"Full Preview" button:**

| Property | Value |
|----------|-------|
| Position | Bottom-right of preview card |
| Component | `TextButton` with `open_in_full` icon |
| Label | "Full preview", `labelLarge`, `primary` |
| Action | Opens `FullScreenDialog` with complete post preview |

---

## Section 3: Action Bar

**Position:** Below split view (or sticky at bottom of viewport)

| Property | Value |
|----------|-------|
| Container | `surfaceContainerHigh` #E7EAE4 |
| Height | 64px |
| Padding | 16px horizontal |
| Corner radius | 12px (if card) or 0 (if sticky bar) |
| Layout | Row: left-aligned secondary actions, right-aligned primary actions |
| Gap | 8px between buttons |
| Margin-bottom | 24px |

**Action buttons (shown based on status):**

| Status | Left Actions | Right Actions |
|--------|-------------|---------------|
| Scheduled_NoDraft | — | `FilledTonalButton` "Draft" |
| Drafting | `OutlinedButton` "Cancel Edit" | `FilledButton` "Save Draft" |
| Drafted | `OutlinedButton` "Send Back" | `FilledTonalButton` "Format" |
| Formatting | — | — (processing) |
| Previewed | `OutlinedButton` "Send Back" | `FilledTonalButton` "Approve" |
| Ready_ToPublish | `OutlinedButton` "Send Back" | `FilledButton` "Publish" |
| Published | — | `OutlinedButton` "View Analytics" |
| Publish_Failed | — | `FilledButton` "Re-queue" |

**Button sizes:**

| Variant | Height | Padding | Corner Radius | Label |
|---------|--------|---------|---------------|-------|
| FilledButton | 40px | 24px horiz | 20px | `labelLarge` (14px, Medium), `onPrimary` #FFFFFF |
| FilledTonalButton | 40px | 24px horiz | 20px | `labelLarge`, `onSecondaryContainer` #0C1F13 |
| OutlinedButton | 40px | 24px horiz | 20px | `labelLarge`, `primary` #1B6B3A |

**Button interactive states:**

| State | FilledButton | FilledTonalButton | OutlinedButton |
|-------|-------------|-------------------|---------------|
| Default | bg `primary` #1B6B3A | bg `secondaryContainer` #D1E8D4 | border `outline` #717971 |
| Hover | 8% `onPrimary` overlay | 8% `onSecondaryContainer` overlay | 8% `primary` overlay |
| Pressed | 12% `onPrimary` overlay | 12% `onSecondaryContainer` overlay | 12% `primary` overlay |
| Disabled | bg `onSurface` at 12%, text at 38% | same pattern | border at 12%, text at 38% |

### Dark Mode Action Bar

| Element | Dark Value |
|---------|-----------|
| Container bg | `surfaceContainerHigh` #272A27 |
| FilledButton bg | `primary` #89D89E, text `onPrimary` #003916 |
| FilledTonalButton bg | `secondaryContainer` #374B3D, text `onSecondaryContainer` #D1E8D4 |
| OutlinedButton border | `outline` #8B938A, text `primary` #89D89E |

---

## Section 4: History Timeline

**Spacing from Section 3:** 24px

**Section header:**

| Property | Value |
|----------|-------|
| Title | "History", `titleLarge` (22px), `onSurface` |
| Margin-bottom | 16px |

**M3 Component:** `List` with `ListItem`

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` |
| Corner radius | 12px |
| Padding | 16px |
| Border | 1px `outlineVariant` #C1C9BF |

**Timeline items (newest first):**

| Element | Style |
|---------|-------|
| Timestamp | `bodySmall` (12px), `onSurfaceVariant` #414941 |
| Status change | `bodyMedium` (14px), `onSurface` #191C19 |
| Source tag | `labelSmall` (11px), `AssistChip`, e.g. "C.2 approved" |
| Timeline dot | 8px circle, `primary` #1B6B3A (latest) or `outline` #717971 (older) |
| Connector line | 1px `outlineVariant`, vertical, connecting dots |
| Item height | min 48px |
| Item padding | 8px vertical, 16px left (from dot), 0 right |

**Timeline item layout:**

```
  ●  Mar 14 10:30  Status → Ready_ToPublish  [C.2 approved]
  │
  ○  Mar 14 10:25  Status → Previewed  [F.4 approved]
  │
  ○  Mar 14 10:20  Status → Formatting  [F.1 selected]
```

### Dark Mode Timeline

| Element | Dark Value |
|---------|-----------|
| Card border | `outlineVariant` #414941 |
| Latest dot | `primary` #89D89E |
| Older dot | `outline` #8B938A |
| Connector | `outlineVariant` #414941 |

---

## Section 5: Engagement Table (Published Posts Only)

**Spacing from Section 4:** 24px

**Section header:**

| Property | Value |
|----------|-------|
| Title | "Engagement Metrics", `titleLarge` (22px), `onSurface` |
| Subtitle | "Collected at Day 1, 3, 7, 14, 30", `bodySmall`, `onSurfaceVariant` |
| Margin-bottom | 16px |

**M3 Component:** `DataTable`

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` |
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Header row bg | `surfaceContainerHighest` #E1E4DE |
| Header text | `titleSmall` (14px, Medium), `onSurface` |
| Body cell text | `bodyMedium` (14px), `onSurface` |
| Row height | 48px |
| Cell padding | 16px horizontal |
| Row divider | 1px `outlineVariant` |
| Hover row | `surfaceContainerLow` #F2F5EF bg |

**Columns:**

| Column | Width | Align | Content |
|--------|-------|-------|---------|
| Day | 80px | Left | "Day 1", "Day 3", etc. |
| Likes | 80px | Right | Number |
| Comments | 100px | Right | Number |
| Shares | 80px | Right | Number |
| Score | 80px | Right | Number, bold if highest |
| Rate | 100px | Right | Percentage |

**Pending rows:**

| Property | Value |
|----------|-------|
| Cell content | "—" in `onSurfaceVariant` at 50% |
| Row bg | `surfaceVariant` #DDE5DA at 20% |
| Label | "(pending)" in `bodySmall`, `onSurfaceVariant` |

**Resurgence indicator:**

If Day 14 score > Day 7 score:

| Property | Value |
|----------|-------|
| Icon | `local_fire_department` 16px, inline with Day 14 score |
| Color | `tertiary` #3A635F |
| Tooltip | "Resurgence detected: Day 14 > Day 7" |

### Empty State (Not Published)

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` |
| Content | "Engagement data will appear after this post is published and metrics are collected." |
| Text style | `bodyMedium`, `onSurfaceVariant`, center-aligned |
| Subtitle | "Status: {status} | Scheduled: {date}", `bodySmall` |
| Padding | 32px |

### Dark Mode Table

| Element | Dark Value |
|---------|-----------|
| Header bg | `surfaceContainerHighest` #323532 |
| Row hover | `surfaceContainerLow` #191C19 |
| Pending row bg | `surfaceVariant` #414941 at 20% |
| Card border | `outlineVariant` #414941 |

---

## Confirmation Dialogs

### Publish Confirmation

**M3 Component:** `AlertDialog`

| Property | Value |
|----------|-------|
| Width | 312px |
| Corner radius | 28px |
| Background | `surfaceContainerHigh` #E7EAE4 |
| Elevation | Level 4 |
| Padding | 24px |

| Element | Style |
|---------|-------|
| Title | "Publish to LinkedIn?", `headlineSmall` (24px), `onSurface` |
| Post title | `bodyLarge` (16px), `onSurface`, quoted |
| Warning | "One-shot: Cannot retry if it fails.\nRandom delay: 0–60 min after confirmation.", `bodyMedium`, `onSurfaceVariant` |
| Warning icon | `warning` 24px, `error` #BA1A1A |
| **Buttons (row, right-aligned, 8px gap):** | |
| Cancel | `TextButton`, `primary` #1B6B3A |
| Publish with Delay | `FilledTonalButton`, `secondaryContainer` bg |
| Publish Now | `FilledButton`, `primary` #1B6B3A bg |

### Drop Confirmation (typed)

| Property | Value |
|----------|-------|
| Component | `AlertDialog` |
| Title | "Cancel this post?", `headlineSmall` |
| Body | Post title + scheduled date + "This will mark the post as Cancelled." |
| Input | `OutlinedTextField` with label "Type 'cancel' to confirm" |
| Confirm button | `FilledButton` "Cancel Post", `error` #BA1A1A bg, disabled until input matches |
| Cancel button | `TextButton` "Go Back" |

---

## Responsive Behavior

| Breakpoint | Change |
|------------|--------|
| ≥1440px | Full split view (40%/60%) |
| 1024–1439px | Split view narrows (45%/55%) |
| 768–1023px | Stacked: metadata full-width, then preview full-width |
| <768px | Single column, all sections stacked |

---

## Component Summary

| Component | M3 Kit Name | Count |
|-----------|-------------|-------|
| OutlinedCard | `OutlinedCard` | 4 (stepper, metadata, history, engagement) |
| FilledCard | `FilledCard` | 2 (score breakdown, preview) |
| StatusStepper (custom) | — | 1 |
| StatusChip (custom) | — | 1 (current status) |
| AssistChip | `AssistChip` | 4+ (framework tags, history source) |
| FilterChip | `FilterChip` | 1 (pillar) |
| OutlinedTextField | `OutlinedTextField` | 1–2 (edit mode, dialog) |
| FilledButton | `FilledButton` | 1–2 (action bar) |
| FilledTonalButton | `FilledTonalButton` | 1–2 (action bar) |
| OutlinedButton | `OutlinedButton` | 1–2 (action bar) |
| TextButton | `TextButton` | 2+ (breadcrumb, preview link) |
| IconButton | `IconButton` | 2 (edit, actions) |
| DropdownMenu | `DropdownMenu` | 1 (actions) |
| DataTable | `DataTable` | 1 (engagement) |
| AlertDialog | `AlertDialog` | 2 (publish, drop) |
| LinearProgress | `LinearProgress` | 3 (score bars) |
| Divider | `Divider` | 3+ (metadata groups) |
| List + ListItem | `List` | 1 (history timeline) |
| PlainTooltip | `PlainTooltip` | 1 (resurgence) |
