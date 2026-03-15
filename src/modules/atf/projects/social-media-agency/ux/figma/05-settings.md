# Figma Spec — Settings Page

**Route:** `/settings`
**Frame size:** 1440 × 900px (viewport), content scrolls per tab
**Purpose:** Manage all 7 config documents + account connections

---

## Page Header

| Property | Value |
|----------|-------|
| Title | "Settings", `headlineSmall` (24px), `onSurface` #191C19 |
| Margin-bottom | 0 (tabs directly below) |

---

## Tabs

**M3 Component:** `Tabs` (secondary, scrollable)

| Property | Value |
|----------|-------|
| Component | `Tabs` (secondary variant — underline indicator) |
| Position | Below page title, full content width |
| Height | 48px |
| Background | transparent |
| Indicator | 2px bottom border, `primary` #1B6B3A |
| Active tab text | `titleSmall` (14px, Medium), `primary` #1B6B3A |
| Inactive tab text | `titleSmall` (14px, Medium), `onSurfaceVariant` #414941 |
| Tab padding | 16px horizontal |
| Tab gap | 0 (flush, M3 standard) |
| Scrollable | Yes (for 7 tabs on narrower screens) |
| Margin-bottom | 24px |

**Tab items:**

| # | Label | Route |
|---|-------|-------|
| 1 | Scoring | `/settings/scoring` |
| 2 | Schedule | `/settings/schedule` |
| 3 | Formatting | `/settings/formatting` |
| 4 | Engagement | `/settings/engagement` |
| 5 | Review | `/settings/review` |
| 6 | Analytics | `/settings/analytics` |
| 7 | Account | `/settings/account` |

**Interactive states:**

| State | Change |
|-------|--------|
| Default (inactive) | No indicator, `onSurfaceVariant` text |
| Hover | 8% `onSurface` overlay |
| Pressed | 12% `onSurface` overlay |
| Active | 2px `primary` underline, `primary` text |

### Dark Mode Tabs

| Element | Dark Value |
|---------|-----------|
| Active text | `primary` #89D89E |
| Active indicator | `primary` #89D89E |
| Inactive text | `onSurfaceVariant` #C1C9BF |

---

## Tab 1: Scoring Weights

### Fibonacci Weight Sliders

**Section:** "Fibonacci Weights"

| Property | Value |
|----------|-------|
| Section title | "Fibonacci Weights", `titleLarge` (22px), `onSurface` |
| Container | `OutlinedCard` |
| Corner radius | 12px |
| Border | 1px `outlineVariant` #C1C9BF |
| Padding | 24px |
| Margin-bottom | 24px |

**M3 Component:** `Slider` (discrete)

3 sliders, one per scoring dimension:

| Slider | Label | Discrete Steps | Default |
|--------|-------|---------------|---------|
| Freshness (F) | "Freshness" | 1, 2, 3, 5, 8, 13 | 8 |
| Personal Experience (P) | "Personal Experience" | 1, 2, 3, 5, 8, 13 | 5 |
| Research Quality (R) | "Research Quality" | 1, 2, 3, 5, 8, 13 | 3 |

**Slider specs:**

| Property | Value |
|----------|-------|
| Width | 100% (fill card minus labels) |
| Height | 44px (including label space) |
| Track height | 4px |
| Active track color | `primary` #1B6B3A |
| Inactive track color | `surfaceVariant` #DDE5DA |
| Thumb | 20px circle, `primary` #1B6B3A fill |
| Thumb shadow | 0 1px 3px rgba(0,0,0,0.2) |
| Tick marks | 6px dots at each Fibonacci value |
| Tick mark color (active) | `onPrimary` #FFFFFF |
| Tick mark color (inactive) | `outline` #717971 |
| Value label (above thumb) | `labelMedium` (12px, Medium), `onPrimary` #FFFFFF |
| Value label bg | `primary` #1B6B3A, rounded 4px, padding 4px 8px |
| Step labels (below track) | `labelSmall` (11px), `onSurfaceVariant` #414941 |
| | Positioned at: "1", "2", "3", "5", "8", "13" marks |
| Row label (left of slider) | `bodyLarge` (16px), `onSurface` #191C19, width 180px |
| Current value (right of slider) | `titleMedium` (16px, Medium), `primary` #1B6B3A, width 40px |
| Gap between sliders | 24px |

**Slider interactive states:**

| State | Change |
|-------|--------|
| Default | Thumb at current value |
| Hover | Thumb grows to 24px, halo ring appears (`primary` at 12%) |
| Pressed/dragging | Value label visible above thumb |
| Disabled | Track + thumb at 38% opacity |

**Formula display (below sliders):**

| Property | Value |
|----------|-------|
| Text | "Max score: {F×10 + P×10 + R×10} Formula: F×{F_weight} + P×{P_weight} + R×{R_weight}" |
| Style | `bodyMedium` (14px), `onSurfaceVariant` |
| Update | Live as slider values change |
| Example | "Max score: 160 Formula: F×8 + P×5 + R×3" |

### Threshold Inputs

**Section:** "Thresholds"

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` |
| Corner radius | 12px |
| Padding | 24px |
| Margin-bottom | 24px |

**M3 Component:** `OutlinedTextField` (number type)

4 input fields:

| Field | Label | Default | Validation |
|-------|-------|---------|------------|
| Minimum threshold | "Min total score" | 80 | ≤ max score |
| Min Freshness | "Min Freshness" | 5 | 1–10 |
| Min Personal Exp | "Min Personal Experience" | 3 | 1–10 |
| Min Research | "Min Research" | 2 | 1–10 |

**TextField specs:**

| Property | Value |
|----------|-------|
| Width | 200px |
| Height | 56px |
| Corner radius | 4px (M3 TextField standard) |
| Border | 1px `outline` #717971 |
| Focused border | 2px `primary` #1B6B3A |
| Error border | 2px `error` #BA1A1A |
| Label (floating) | `bodySmall` (12px), `onSurfaceVariant` when float; `bodyLarge` when inline |
| Input text | `bodyLarge` (16px), `onSurface` |
| Supporting text | `bodySmall` (12px), `onSurfaceVariant` |
| Error text | `bodySmall` (12px), `error` #BA1A1A |
| Layout | 2×2 grid, 16px gap |

**TextField interactive states:**

| State | Change |
|-------|--------|
| Default | 1px `outline` border, label inline |
| Focused | 2px `primary` border, label floats, caret visible |
| Error | 2px `error` border, error text below, `error` label |
| Disabled | Fill `surfaceVariant` at 4%, 38% opacity text |

### Impact Preview

**Section:** "Impact Preview"

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` |
| Corner radius | 12px |
| Padding | 16px |
| Background | `surfaceContainerLow` #F2F5EF |
| Margin-bottom | 24px |

| Element | Style |
|---------|-------|
| Title | "If applied to last 5 briefs:", `titleSmall`, `onSurface` |
| Result | "{N} would pass (same as current) | {M} new passes", `bodyMedium`, `onSurface` |
| Detail button | `TextButton` "Show Details", `primary` |
| Expanded details | Table of 5 recent briefs with old_score, new_score, pass/fail |

### Save / Reset Footer

| Property | Value |
|----------|-------|
| Layout | Row: "Last updated: {date}" left, buttons right |
| Gap | 8px between buttons |
| Margin-top | 24px |
| Timestamp | `bodySmall` (12px), `onSurfaceVariant` #414941 |

**Buttons:**

| Button | Variant | Specs |
|--------|---------|-------|
| Reset to Default | `OutlinedButton` | border `outline`, text `primary`, 40px height, 20px radius |
| Save | `FilledButton` | bg `primary` #1B6B3A, text `onPrimary` #FFFFFF, 40px height, 20px radius |
| Save (disabled) | `FilledButton` disabled | bg `onSurface` at 12%, text at 38% |
| Save (loading) | `FilledButton` | `CircularProgress` 24px replaces label text, `onPrimary` color |

### Dark Mode Scoring Tab

| Element | Dark Value |
|---------|-----------|
| Card border | `outlineVariant` #414941 |
| Slider active track | `primary` #89D89E |
| Slider inactive track | `surfaceVariant` #414941 |
| Slider thumb | `primary` #89D89E |
| Value label bg | `primary` #89D89E, text `onPrimary` #003916 |
| TextField border | `outline` #8B938A |
| TextField focused | `primary` #89D89E |
| Impact preview bg | `surfaceContainerLow` #191C19 |
| Save button bg | `primary` #89D89E, text `onPrimary` #003916 |

---

## Tab 2: Schedule

### Active Days Picker

**M3 Component:** `FilterChip` (multi-select)

| Property | Value |
|----------|-------|
| Container | `OutlinedCard`, padding 24px |
| Section title | "Posting Days", `titleLarge`, `onSurface` |
| Chips | "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" |
| Chip height | 32px |
| Gap | 8px |
| Selected bg | `primaryContainer` #A4F5B8 |
| Selected text | `onPrimaryContainer` #002109 |
| Selected icon | `check` 18px |
| Unselected bg | transparent |
| Unselected border | 1px `outline` |
| Unselected text | `onSurfaceVariant` |

### Time Picker

**M3 Component:** `TimePicker` (or `OutlinedTextField` with time input)

| Property | Value |
|----------|-------|
| Fields | "Earliest post time" + "Latest post time" |
| Layout | Row, 16px gap |
| Width | 160px each |
| Format | HH:MM (24h or AM/PM based on locale) |
| Component | `OutlinedTextField` with `schedule` trailing icon |

### Other Schedule Fields

| Field | Component | Default |
|-------|-----------|---------|
| Max posts/day | `OutlinedTextField` (number) | 1 |
| Planning horizon (days) | `OutlinedTextField` (number) | 7 |
| Publish delay min (minutes) | `OutlinedTextField` (number) | 0 |
| Publish delay max (minutes) | `OutlinedTextField` (number) | 60 |

---

## Tab 3: Formatting

### Form Fields

All in a single `OutlinedCard`, padding 24px:

| Field | Component | Default | Validation |
|-------|-----------|---------|------------|
| Min characters | `OutlinedTextField` (number) | 800 | >0 |
| Max characters | `OutlinedTextField` (number) | 1600 | > min |
| Max emojis | `OutlinedTextField` (number) | 3 | 0–10 |
| Max Hindi sentences | `OutlinedTextField` (number) | 3 | 0–10 |
| Min hashtags | `OutlinedTextField` (number) | 3 | ≥0 |
| Max hashtags | `OutlinedTextField` (number) | 7 | > min |
| Hook max chars | `OutlinedTextField` (number) | 210 | >0 |
| FK Grade target | `OutlinedTextField` (number) | 7.0 | 1–12 |
| Staircase layout | `Switch` | On | — |
| Uppercase headers | `Switch` | On | — |

**Layout:** 2-column grid, 16px gap, labels above fields.

---

## Tab 4: Engagement

| Field | Component | Default |
|-------|-----------|---------|
| Like weight | `OutlinedTextField` (number) | 1 |
| Comment weight | `OutlinedTextField` (number) | 2 |
| Share weight | `OutlinedTextField` (number) | 3 |
| Collection days | `FilterChip` row: "1", "3", "7", "14", "30" | All selected |
| Resurgence threshold (%) | `OutlinedTextField` (number) | 20 |
| Benchmark period (posts) | `OutlinedTextField` (number) | 10 |

---

## Tab 5: Review

| Field | Component | Default |
|-------|-----------|---------|
| Auto-approve | `Switch` | Off |
| Max edits per review | `OutlinedTextField` (number) | 3 |
| Require formatting check | `Switch` | On |
| Allow reschedule | `Switch` | On |
| Allow send back | `Switch` | On |

### Switch Specs

**M3 Component:** `Switch`

| Property | Value |
|----------|-------|
| Track width | 52px |
| Track height | 32px |
| Thumb size | 24px (off), 28px (on) |
| Track on color | `primary` #1B6B3A |
| Track off color | `surfaceVariant` #DDE5DA |
| Thumb on color | `onPrimary` #FFFFFF |
| Thumb off color | `outline` #717971 |
| Track on (dark) | `primary` #89D89E |
| Track off (dark) | `surfaceVariant` #414941 |
| Thumb on (dark) | `onPrimary` #003916 |
| Thumb off (dark) | `outline` #8B938A |

**Switch interactive states:**

| State | Change |
|-------|--------|
| Default | As above |
| Hover | Halo ring around thumb (12% `primary` / `onSurface`) |
| Pressed | Thumb grows to 28px |
| Disabled | 38% opacity all elements |

**Switch row layout:**

| Element | Style |
|---------|-------|
| Label (left) | `bodyLarge` (16px), `onSurface`, flex-grow |
| Description (below label) | `bodySmall` (12px), `onSurfaceVariant` |
| Switch (right) | Right-aligned |
| Row height | 56px |
| Divider | 1px `outlineVariant` between rows |

---

## Tab 6: Analytics Config

| Field | Component | Default |
|-------|-----------|---------|
| Default period | `Select` / `DropdownMenu` | "30 days" |
| Min posts for analysis | `OutlinedTextField` (number) | 5 |
| Confidence threshold | `OutlinedTextField` (number) | 0.7 |
| Trend window (posts) | `OutlinedTextField` (number) | 5 |

### Pillar Priority Sliders

**7 sliders, each 0–100%, must sum to 100%:**

| Property | Value |
|----------|-------|
| Component | `Slider` (continuous) |
| Layout | Same as scoring sliders |
| Track active | Pillar-specific color (chart colors from tokens) |
| Thumb | Pillar-specific color |
| Value display | "{N}%" right of slider, `titleMedium` |
| Constraint | Show error if sum ≠ 100%: "Weights must total 100% (current: {N}%)" |
| Error style | `bodySmall`, `error` #BA1A1A |

**Pillar list:**

| # | Pillar | Default Weight | Color |
|---|--------|---------------|-------|
| 1 | Skill-Building | 25% | `#1B6B3A` |
| 2 | Career | 20% | `#4F6354` |
| 3 | Leadership | 20% | `#3A635F` |
| 4 | Personal | 15% | `#6B5E3A` |
| 5 | Tech | 10% | `#5A3A6B` |
| 6 | Industry | 5% | `#717971` |
| 7 | Other | 5% | `#414941` |

### Select (Dropdown)

**M3 Component:** `Select` / `DropdownMenu` trigger

| Property | Value |
|----------|-------|
| Trigger | `OutlinedTextField` with trailing `arrow_drop_down` icon |
| Width | 200px |
| Height | 56px |
| Menu | `DropdownMenu` with options |
| Selected item | `check` icon trailing |

---

## Tab 7: Account

### User Profile

| Property | Value |
|----------|-------|
| Container | `OutlinedCard`, padding 24px |
| Name | "Satvik Jain", `titleLarge`, `onSurface` (read-only) |
| Role | "Senior PM, American Express", `bodyMedium`, `onSurfaceVariant` (read-only) |
| Avatar | 64px circle, `primary` bg, "SJ" initials |

### Connected Services

| Property | Value |
|----------|-------|
| Container | `OutlinedCard`, padding 24px |
| Section title | "Connected Services", `titleLarge` |
| Layout | Vertical list, 56px row height, `Divider` between |

**Per service row:**

| Element | Style |
|---------|-------|
| Service icon | 24px, service-specific |
| Service name | `bodyLarge` (16px), `onSurface` |
| Status | `Badge` "Connected" green or "Disconnected" red |
| Connected badge | `labelSmall`, bg `primaryContainer` #A4F5B8, text `onPrimaryContainer` |
| Disconnected badge | `labelSmall`, bg `errorContainer` #FFDAD6, text `onErrorContainer` |
| Action | `OutlinedButton` "Reconnect" (if connected) or `FilledButton` "Connect" |

**Services:**

| Service | Icon | Status |
|---------|------|--------|
| LinkedIn | `link` | Connected |
| Google Sheets | `table_chart` | Connected |
| Notion | `event_note` | Connected |
| Telegram | `send` | Connected |

### n8n Webhook Base URL

| Property | Value |
|----------|-------|
| Component | `OutlinedTextField` |
| Label | "n8n Webhook Base URL" |
| Width | 100% (fill card) |
| Placeholder | "https://n8n.example.com/webhook/" |

---

## Error State: Config Not Found

| Property | Value |
|----------|-------|
| Container | `OutlinedCard` centered in tab content |
| Icon | `warning` 48px, `error` #BA1A1A |
| Title | "{Config name} config not found in database.", `titleMedium`, `onSurface` |
| Body | "This usually means the config hasn't been initialized.\nInitialize with default values?", `bodyMedium`, `onSurfaceVariant` |
| Default preview | "Default: F×8 + P×5 + R×3, threshold 80 (50%)", `bodySmall`, `onSurfaceVariant` |
| Buttons | `OutlinedButton` "Cancel" + `FilledButton` "Initialize Defaults" |

---

## Loading State

| Element | Skeleton |
|---------|----------|
| Tabs | Rendered immediately (not skeletonized) |
| Form labels | Rendered immediately |
| Form values | Shimmer placeholders matching field sizes |
| Sliders | Shimmer track |
| Progress | `LinearProgress` indeterminate at top of tab content |

---

## Responsive Behavior

| Breakpoint | Change |
|------------|--------|
| ≥1440px | Full layout, 2-column form grid |
| 1024–1439px | Same layout, slightly narrower |
| 768–1023px | Tabs become scrollable, form fields stack single-column |
| <768px | Tabs at top, full-width single-column forms |

---

## Component Summary

| Component | M3 Kit Name | Count (across all tabs) |
|-----------|-------------|-------------------------|
| Tabs | `Tabs` (secondary) | 1 (7 tabs) |
| Slider | `Slider` (discrete) | 3 (scoring) + 7 (pillar) = 10 |
| OutlinedTextField | `OutlinedTextField` | ~20 (across all tabs) |
| Switch | `Switch` | 5 (review) + 2 (formatting) = 7 |
| FilterChip | `FilterChip` | 7 (days) + 5 (collection days) = 12 |
| FilledButton | `FilledButton` | 7 (save per tab) + 1 (connect) |
| OutlinedButton | `OutlinedButton` | 7 (reset per tab) + 4 (reconnect) |
| TextButton | `TextButton` | 1 (show details) |
| OutlinedCard | `OutlinedCard` | ~10 (sections across tabs) |
| CircularProgress | `CircularProgress` | 1 (save loading) |
| LinearProgress | `LinearProgress` | 1 (page loading) |
| DropdownMenu | `DropdownMenu` | 1 (analytics default period) |
| Badge | `Badge` | 4 (service status) |
| Divider | `Divider` | 5+ (between form rows) |
| AlertDialog | `AlertDialog` | 1 (reset confirmation) |
