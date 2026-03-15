# Figma Setup Guide — LinkRight SMA Dashboard

**Design system:** Google Material 3
**Source color:** `#1B6B3A` (green — growth/LinkedIn alignment)
**Target:** Desktop-first, 1440px optimal, 1024px minimum

---

## Step 1: Install the Material 3 Design Kit

1. Open Figma and navigate to **Community** (left sidebar)
2. Search for **"Material 3 Design Kit"** by Google
3. Click **"Open in Figma"** — this duplicates the kit to your drafts
4. The kit includes all M3 components: buttons, cards, chips, FABs, navigation, text fields, dialogs, etc.

> **Exact kit:** "Material 3 Design Kit" — the official Google file with ~2,500 components and variants.

---

## Step 2: Apply Custom Theme

### Generate the palette

1. Visit [Material Theme Builder](https://www.figma.com/community/plugin/1034969338659738588) (Figma plugin) or the web tool at material-foundation.github.io
2. Set **Source color** to `#1B6B3A`
3. The builder auto-generates a full tonal palette for primary, secondary, tertiary, error, and neutral

### Apply in Figma

1. Open the duplicated M3 Kit file
2. Run the **Material Theme Builder** plugin inside Figma
3. Enter source color: `#1B6B3A`
4. Click **"Apply Theme"** — this updates all local color styles across the kit
5. Verify the following key tokens match:

| Token | Light Hex | Dark Hex |
|-------|-----------|----------|
| `primary` | `#1B6B3A` | `#89D89E` |
| `onPrimary` | `#FFFFFF` | `#003916` |
| `primaryContainer` | `#A4F5B8` | `#005225` |
| `secondary` | `#4F6354` | `#B5CCB9` |
| `secondaryContainer` | `#D1E8D4` | `#374B3D` |
| `tertiary` | `#3A635F` | `#A0CDC7` |
| `tertiaryContainer` | `#BCE9E3` | `#204B47` |
| `error` | `#BA1A1A` | `#FFB4AB` |
| `errorContainer` | `#FFDAD6` | `#93000A` |
| `surface` | `#F8FAF5` | `#111411` |
| `onSurface` | `#191C19` | `#E1E4DE` |
| `surfaceVariant` | `#DDE5DA` | `#414941` |
| `onSurfaceVariant` | `#414941` | `#C1C9BF` |
| `outline` | `#717971` | `#8B938A` |
| `outlineVariant` | `#C1C9BF` | `#414941` |
| `surfaceContainer` | `#ECF0E9` | `#1D201D` |
| `surfaceContainerLow` | `#F2F5EF` | `#191C19` |
| `surfaceContainerHigh` | `#E7EAE4` | `#272A27` |
| `surfaceContainerHighest` | `#E1E4DE` | `#323532` |
| `surfaceContainerLowest` | `#FFFFFF` | `#0C0F0C` |

---

## Step 3: Create Pages

Set up 5 pages in your Figma file (plus a "Components" page for local overrides):

| Page | Name | Content |
|------|------|---------|
| 0 | **Components** | Local component overrides, custom icons, status chip variants |
| 1 | **Dashboard** | Pipeline funnel, action items, weekly calendar, quick stats |
| 2 | **Posts** | Posts list (filters, cards, pagination) |
| 3 | **Post Detail** | Split view: metadata + preview, stepper, history, engagement |
| 4 | **Analytics** | Overview cards, charts, rankings table, collection schedule |
| 5 | **Settings** | Tabbed config editor with all 7 tabs |

### Per-page setup

Each page should contain:
- **Desktop frame:** 1440 × 900px (or auto-height)
- **Tablet frame:** 1024 × 768px (optional, for responsive variants)
- **Mobile frame:** 390 × 844px (optional, future reference)
- **Annotations frame:** Adjacent to each design frame for developer notes

---

## Step 4: Typography Scale

Use the M3 type scale with **Roboto** (already built into the M3 kit). Ensure these styles are defined:

| Style Name | Weight | Size | Line Height | Letter Spacing | Usage |
|------------|--------|------|-------------|----------------|-------|
| `Display/Large` | 400 | 57px | 64px | -0.25px | — (unused in v1) |
| `Display/Medium` | 400 | 45px | 52px | 0px | — (unused in v1) |
| `Display/Small` | 400 | 36px | 44px | 0px | — (unused in v1) |
| `Headline/Large` | 400 | 32px | 40px | 0px | Page titles |
| `Headline/Medium` | 400 | 28px | 36px | 0px | Pipeline funnel counts |
| `Headline/Small` | 400 | 24px | 32px | 0px | Section headers |
| `Title/Large` | 400 | 22px | 28px | 0px | Card titles, dialog titles |
| `Title/Medium` | 500 | 16px | 24px | 0.15px | Post titles, nav labels |
| `Title/Small` | 500 | 14px | 20px | 0.1px | Subtitles |
| `Body/Large` | 400 | 16px | 24px | 0.5px | Post content preview |
| `Body/Medium` | 400 | 14px | 20px | 0.25px | Metadata values, table cells |
| `Body/Small` | 400 | 12px | 16px | 0.4px | Timestamps, secondary info |
| `Label/Large` | 500 | 14px | 20px | 0.1px | Buttons, chips |
| `Label/Medium` | 500 | 12px | 16px | 0.5px | Pipeline stage labels |
| `Label/Small` | 500 | 11px | 16px | 0.5px | Badges, tiny labels |

---

## Step 5: Spacing Grid

Configure the layout grid on every desktop frame:

### 8px Base Grid
- **Grid type:** Rows + Columns
- **Grid size:** 8px (with 4px sub-grid visible at high zoom)
- **Grid color:** `#FF000010` (subtle red overlay)

### Column Grid (Desktop 1440px)
- **Columns:** 12
- **Gutter:** 24px
- **Margin:** 24px (left and right of main content area)
- **Content max width:** 1200px (centered)

### Spacing Tokens Reference

| Token | Value | Visual Shorthand |
|-------|-------|------------------|
| `xs` | 4px | Half grid unit |
| `sm` | 8px | 1 grid unit |
| `md` | 16px | 2 grid units |
| `lg` | 24px | 3 grid units |
| `xl` | 32px | 4 grid units |
| `2xl` | 48px | 6 grid units |

---

## Step 6: Global Layout Frame

Create a master layout component for consistent page structure:

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOP APP BAR — 64px height                                          │
│  Background: surfaceContainerHighest (#E1E4DE light / #323532 dark) │
│  Content: Logo (24px) + "LinkRight SMA" (titleLarge) + avatar       │
├────────────┬────────────────────────────────────────────────────────┤
│            │                                                        │
│  NAV RAIL  │  MAIN CONTENT                                          │
│  256px     │  Padding: 24px all sides                               │
│            │  Max width: 1200px                                      │
│  Bg:       │  Bg: surface (#F8FAF5 light / #111411 dark)            │
│  surface   │                                                        │
│  Container │  Scrollable vertically                                  │
│  (#ECF0E9) │                                                        │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
```

### Top App Bar (64px)
- **M3 component:** `TopAppBar` — medium variant
- **Left:** App icon (24×24) + 12px gap + "LinkRight SMA" (`titleLarge`, `onSurface`)
- **Right:** Avatar (`onSurfaceVariant`) with "S" initial or photo
- **Elevation:** Level 2 (8% surface tint)

### Navigation Rail (256px expanded)
- **M3 component:** `NavigationRail` — expanded with labels
- **Items:** 4 destinations with Material icons
  - Dashboard: `dashboard` icon
  - Posts: `article` icon
  - Analytics: `analytics` icon
  - Settings: `settings` icon
- **Active indicator:** `secondaryContainer` pill behind active icon
- **Active label:** `onSecondaryContainer` color
- **Inactive:** `onSurfaceVariant` icon + label
- **Bottom section:** External links (ChatGPT, Telegram) as `TextButton`s

### Responsive Variants

| Breakpoint | Navigation | Width |
|------------|-----------|-------|
| ≥1024px | `NavigationRail` expanded | 256px, labels + icons |
| 768–1023px | `NavigationRail` collapsed | 80px, icons only, tooltip labels |
| <768px | `NavigationBar` (bottom) | Full width, 80px height, 4 items |

---

## Step 7: Component Overrides to Create

Before building pages, create these custom local components (not in M3 kit):

### 1. StatusChip (variant of FilterChip)
Create 9 variants matching status-to-color mapping:

| Variant | Background | Text Color | Chip Style |
|---------|-----------|-----------|-----------|
| `Scheduled_NoDraft` | `surfaceVariant` | `onSurfaceVariant` | Outlined |
| `Drafting` | `secondaryContainer` | `onSecondaryContainer` | Tonal |
| `Drafted` | `secondary` | `onSecondary` | Tonal |
| `Formatting` | `tertiaryContainer` | `onTertiaryContainer` | Tonal |
| `Previewed` | `tertiary` | `onTertiary` | Tonal |
| `Ready_ToPublish` | `primaryContainer` | `onPrimaryContainer` | Tonal |
| `Published` | `primary` | `onPrimary` | Filled |
| `Publish_Failed` | `errorContainer` | `onErrorContainer` | Filled |
| `Cancelled` | `surfaceVariant` | `onSurfaceVariant` | Outlined + strikethrough |

All chips: height 32px, border-radius 8px, padding 8px 12px, `labelLarge` typography.

### 2. PillarChip (variant of AssistChip)
One chip per content pillar, all using `secondaryContainer` background:
- Career, Personal, Skill-Building, Leadership, Tech, Growth, Industry

### 3. MetricCard
Small stat card: 160×100px, `surfaceContainerHighest` fill, 12px radius.
- Top: icon (24px) + label (`labelMedium`, `onSurfaceVariant`)
- Center: value (`headlineMedium`, `onSurface`)
- Bottom: delta arrow + percentage (`bodySmall`, `primary` for up / `error` for down)

### 4. ScoreBadge
Circular badge showing post score: 40×40px, `primaryContainer` fill, 20px radius.
- Score number: `titleSmall`, `onPrimaryContainer`

---

## Step 8: Elevation Tokens

M3 uses tonal elevation (surface tint overlay) rather than drop shadows:

| Level | Tint Opacity | Usage |
|-------|-------------|-------|
| 0 | 0% | Page background (`surface`) |
| 1 | 5% | Cards, navigation rail |
| 2 | 8% | Top app bar, resting FAB |
| 3 | 11% | Snackbar, hovered FAB |
| 4 | 12% | Menus, dropdown overlays |
| 5 | 14% | Dialogs |

In Figma: apply as a fill layer on top of `surface` using `primary` color at the specified opacity.

---

## Step 9: Icon Set

Use **Material Symbols** (outlined, weight 400, size 24px):

| Icon Name | Usage |
|-----------|-------|
| `dashboard` | Nav: Dashboard |
| `article` | Nav: Posts |
| `analytics` | Nav: Analytics |
| `settings` | Nav: Settings |
| `add` | FAB icon |
| `refresh` | Refresh button |
| `edit` | Edit action |
| `delete` | Drop/cancel action |
| `publish` | Publish action |
| `check_circle` | Approved/success |
| `error` | Error states |
| `schedule` | Scheduled dates |
| `trending_up` | Positive delta |
| `trending_down` | Negative delta |
| `filter_list` | Filter toggle |
| `sort` | Sort toggle |
| `search` | Search bar |
| `more_vert` | Overflow menu |
| `arrow_forward` | Pipeline flow arrows |
| `chevron_left` / `chevron_right` | Pagination |
| `open_in_new` | External links |
| `local_fire_department` | Resurgence alert |

Install the **Material Symbols** Figma plugin for easy icon insertion.

---

## Checklist Before Starting Page Designs

- [ ] M3 Design Kit duplicated and themed with `#1B6B3A`
- [ ] All color styles verified against token table above
- [ ] Typography styles match the M3 type scale
- [ ] 5 pages created (Dashboard, Posts, Post Detail, Analytics, Settings)
- [ ] Components page with StatusChip, PillarChip, MetricCard, ScoreBadge
- [ ] Layout grid (12-column, 24px gutter) applied to desktop frames
- [ ] 8px base grid enabled
- [ ] Material Symbols plugin installed
- [ ] Global layout frame (TopAppBar + NavigationRail + Main) built as a component
