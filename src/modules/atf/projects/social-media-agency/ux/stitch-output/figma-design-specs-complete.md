# Figma Setup Guide — LinkRight SMA Dashboard

**Design system:** Google Material 3
**Source color:** `#1B6B3A` (green — growth/LinkedIn brand alignment)
**Target:** Desktop-first (1440px optimal, 1024px min)

---

## Step 1: Import Material 3 Design Kit

1. Open Figma → **Community** tab (left sidebar)
2. Search **"Material 3 Design Kit"** by Google
3. Click **"Open in Figma"** → duplicate to your drafts
4. This kit includes all M3 components: Buttons, Cards, Chips, FAB, NavigationRail, TopAppBar, TextField, Slider, Switch, DataTable, Tabs, Dialogs, Snackbar, etc.

> **Version:** Use the latest M3 kit (v3.x+). Ensure it includes tonal elevation and dynamic color support.

---

## Step 2: Apply Custom Theme (Dynamic Color)

### 2a. Generate Palette via Material Theme Builder

1. Go to [Material Theme Builder](https://m3.material.io/theme-builder)
2. Enter source color: **`#1B6B3A`**
3. The builder generates primary, secondary, tertiary, error, and neutral palettes automatically
4. Export → **Figma** format (DSP or JSON)

### 2b. Apply to M3 Kit in Figma

1. Open the duplicated M3 Kit file
2. Navigate to **Local Styles** panel
3. Update each color style to match the generated palette:

#### Light Mode Colors

| Style Name | Hex Value | Figma Style Path |
|------------|-----------|------------------|
| `Primary` | `#1B6B3A` | `M3/sys/light/primary` |
| `On Primary` | `#FFFFFF` | `M3/sys/light/on-primary` |
| `Primary Container` | `#A4F5B8` | `M3/sys/light/primary-container` |
| `On Primary Container` | `#002109` | `M3/sys/light/on-primary-container` |
| `Secondary` | `#4F6354` | `M3/sys/light/secondary` |
| `On Secondary` | `#FFFFFF` | `M3/sys/light/on-secondary` |
| `Secondary Container` | `#D1E8D4` | `M3/sys/light/secondary-container` |
| `On Secondary Container` | `#0C1F13` | `M3/sys/light/on-secondary-container` |
| `Tertiary` | `#3A635F` | `M3/sys/light/tertiary` |
| `On Tertiary` | `#FFFFFF` | `M3/sys/light/on-tertiary` |
| `Tertiary Container` | `#BCE9E3` | `M3/sys/light/tertiary-container` |
| `On Tertiary Container` | `#00201D` | `M3/sys/light/on-tertiary-container` |
| `Error` | `#BA1A1A` | `M3/sys/light/error` |
| `On Error` | `#FFFFFF` | `M3/sys/light/on-error` |
| `Error Container` | `#FFDAD6` | `M3/sys/light/error-container` |
| `On Error Container` | `#410002` | `M3/sys/light/on-error-container` |
| `Surface` | `#F8FAF5` | `M3/sys/light/surface` |
| `On Surface` | `#191C19` | `M3/sys/light/on-surface` |
| `Surface Variant` | `#DDE5DA` | `M3/sys/light/surface-variant` |
| `On Surface Variant` | `#414941` | `M3/sys/light/on-surface-variant` |
| `Outline` | `#717971` | `M3/sys/light/outline` |
| `Outline Variant` | `#C1C9BF` | `M3/sys/light/outline-variant` |
| `Surface Container Lowest` | `#FFFFFF` | `M3/sys/light/surface-container-lowest` |
| `Surface Container Low` | `#F2F5EF` | `M3/sys/light/surface-container-low` |
| `Surface Container` | `#ECF0E9` | `M3/sys/light/surface-container` |
| `Surface Container High` | `#E7EAE4` | `M3/sys/light/surface-container-high` |
| `Surface Container Highest` | `#E1E4DE` | `M3/sys/light/surface-container-highest` |

#### Dark Mode Colors

| Style Name | Hex Value | Figma Style Path |
|------------|-----------|------------------|
| `Primary` | `#89D89E` | `M3/sys/dark/primary` |
| `On Primary` | `#003916` | `M3/sys/dark/on-primary` |
| `Primary Container` | `#005225` | `M3/sys/dark/primary-container` |
| `On Primary Container` | `#A4F5B8` | `M3/sys/dark/on-primary-container` |
| `Secondary` | `#B5CCB9` | `M3/sys/dark/secondary` |
| `On Secondary` | `#213527` | `M3/sys/dark/on-secondary` |
| `Secondary Container` | `#374B3D` | `M3/sys/dark/secondary-container` |
| `On Secondary Container` | `#D1E8D4` | `M3/sys/dark/on-secondary-container` |
| `Tertiary` | `#A0CDC7` | `M3/sys/dark/tertiary` |
| `On Tertiary` | `#013731` | `M3/sys/dark/on-tertiary` |
| `Tertiary Container` | `#204B47` | `M3/sys/dark/tertiary-container` |
| `On Tertiary Container` | `#BCE9E3` | `M3/sys/dark/on-tertiary-container` |
| `Error` | `#FFB4AB` | `M3/sys/dark/error` |
| `On Error` | `#690005` | `M3/sys/dark/on-error` |
| `Error Container` | `#93000A` | `M3/sys/dark/error-container` |
| `On Error Container` | `#FFDAD6` | `M3/sys/dark/on-error-container` |
| `Surface` | `#111411` | `M3/sys/dark/surface` |
| `On Surface` | `#E1E4DE` | `M3/sys/dark/on-surface` |
| `Surface Variant` | `#414941` | `M3/sys/dark/surface-variant` |
| `On Surface Variant` | `#C1C9BF` | `M3/sys/dark/on-surface-variant` |
| `Outline` | `#8B938A` | `M3/sys/dark/outline` |
| `Outline Variant` | `#414941` | `M3/sys/dark/outline-variant` |
| `Surface Container Lowest` | `#0C0F0C` | `M3/sys/dark/surface-container-lowest` |
| `Surface Container Low` | `#191C19` | `M3/sys/dark/surface-container-low` |
| `Surface Container` | `#1D201D` | `M3/sys/dark/surface-container` |
| `Surface Container High` | `#272A27` | `M3/sys/dark/surface-container-high` |
| `Surface Container Highest` | `#323532` | `M3/sys/dark/surface-container-highest` |

### 2c. Publish as Team Library

1. After updating all color styles, click **Publish** (top-right)
2. Name the library: **"LinkRight SMA — M3 Theme"**
3. All project files will inherit these styles via library link

---

## Step 3: Set Up Figma File Structure

Create a new Figma file: **"LinkRight SMA — UI Design"**

### Pages (5 total)

| Page | Name | Description |
|------|------|-------------|
| 1 | `Dashboard` | Pipeline overview, action items, calendar, stats |
| 2 | `Posts` | Posts list + post detail (both frames on one page) |
| 3 | `Analytics` | Charts, tables, overview cards |
| 4 | `Settings` | Tabbed config editor |
| 5 | `Components` | Local component library (overrides, custom patterns) |

### Per-Page Frame Setup

Each page should contain:
- **Desktop frame:** 1440 × 900px (viewport, scrollable content extends below)
- **Tablet frame:** 768 × 1024px (for responsive variant)
- **Mobile frame:** 375 × 812px (for responsive variant)
- **Dark mode variant:** Duplicate desktop frame, apply dark color styles

---

## Step 4: Typography Scale

Apply the M3 type scale using **Roboto** (default in M3 kit).

| Figma Text Style | Weight | Size | Line Height | Letter Spacing | Usage |
|------------------|--------|------|-------------|----------------|-------|
| `M3/Display/Large` | Regular (400) | 57px | 64px | -0.25px | — |
| `M3/Display/Medium` | Regular (400) | 45px | 52px | 0px | — |
| `M3/Display/Small` | Regular (400) | 36px | 44px | 0px | — |
| `M3/Headline/Large` | Regular (400) | 32px | 40px | 0px | Page titles |
| `M3/Headline/Medium` | Regular (400) | 28px | 36px | 0px | Pipeline funnel counts |
| `M3/Headline/Small` | Regular (400) | 24px | 32px | 0px | Section headers |
| `M3/Title/Large` | Regular (400) | 22px | 28px | 0px | Card titles, dialog titles |
| `M3/Title/Medium` | Medium (500) | 16px | 24px | 0.15px | Post titles, nav labels |
| `M3/Title/Small` | Medium (500) | 14px | 20px | 0.1px | Subtitles |
| `M3/Body/Large` | Regular (400) | 16px | 24px | 0.5px | Post content preview |
| `M3/Body/Medium` | Regular (400) | 14px | 20px | 0.25px | Metadata values, table cells |
| `M3/Body/Small` | Regular (400) | 12px | 16px | 0.4px | Timestamps, secondary info |
| `M3/Label/Large` | Medium (500) | 14px | 20px | 0.1px | Buttons, chips |
| `M3/Label/Medium` | Medium (500) | 12px | 16px | 0.5px | Pipeline stage labels |
| `M3/Label/Small` | Medium (500) | 11px | 16px | 0.5px | Badges, tiny labels |

---

## Step 5: Spacing Grid & Layout

### Base Grid

- **Grid unit:** 4px
- **Column grid (desktop):** 12 columns, 24px gutters, 24px margins (on main content area)
- **Column grid (tablet):** 8 columns, 16px gutters, 16px margins
- **Column grid (mobile):** 4 columns, 16px gutters, 16px margins

### Spacing Tokens (as Figma Variables)

Create these as Figma variables under `spacing/`:

| Variable | Value | Usage |
|----------|-------|-------|
| `spacing/xs` | 4px | Chip padding, icon margins |
| `spacing/sm` | 8px | Inner card padding, chip gaps |
| `spacing/md` | 16px | Card padding, section gaps |
| `spacing/lg` | 24px | Page margins, major section gaps |
| `spacing/xl` | 32px | Between page sections |
| `spacing/2xl` | 48px | Page top padding |

### Corner Radius Tokens

| Variable | Value | Usage |
|----------|-------|-------|
| `radius/card` | 12px | All card components |
| `radius/chip` | 8px | Chips, small containers |
| `radius/button` | 20px | Buttons (fully rounded) |
| `radius/fab` | 16px | FAB |
| `radius/dialog` | 28px | Dialogs |

### Layout Dimensions

| Variable | Value | Usage |
|----------|-------|-------|
| `layout/topBarHeight` | 64px | Top app bar |
| `layout/navRailExpanded` | 256px | Sidebar (desktop) |
| `layout/navRailCollapsed` | 80px | Sidebar (tablet) |
| `layout/bottomNavHeight` | 80px | Bottom nav (mobile) |
| `layout/contentMaxWidth` | 1200px | Main content area max width |

---

## Step 6: Elevation (Tonal Elevation)

M3 uses **tonal elevation** (surface tint overlay) instead of drop shadows.

| Level | Surface Tint Opacity | Usage |
|-------|---------------------|-------|
| Level 0 | 0% | Page background (`surface`) |
| Level 1 | 5% | Cards, navigation rail |
| Level 2 | 8% | Top app bar, FAB (resting) |
| Level 3 | 11% | Snackbar, FAB (hovered) |
| Level 4 | 12% | Menus, dialogs |

**In Figma:** Apply elevation by layering a rectangle with `primary` fill at the specified opacity on top of the `surface` color. Or use the M3 kit's built-in elevation component variants.

---

## Step 7: Component Library Checklist

Ensure these M3 kit components are available and themed before starting screens:

| Component | M3 Kit Name | Variants Needed |
|-----------|-------------|-----------------|
| Navigation Rail | `NavigationRail` | Expanded (256px), Collapsed (80px) |
| Top App Bar | `TopAppBar` | Medium (64px height) |
| Filled Card | `FilledCard` | Default, hovered, pressed |
| Outlined Card | `OutlinedCard` | Default, hovered, pressed |
| Filter Chip | `FilterChip` | Selected, unselected, disabled |
| Assist Chip | `AssistChip` | Default, disabled |
| Extended FAB | `ExtendedFAB` | Default, hovered, pressed |
| Filled Button | `FilledButton` | Default, hovered, pressed, disabled |
| Filled Tonal Button | `FilledTonalButton` | Default, hovered, pressed, disabled |
| Outlined Button | `OutlinedButton` | Default, hovered, pressed, disabled |
| Text Button | `TextButton` | Default, hovered, pressed, disabled |
| Icon Button | `IconButton` | Standard, filled, tonal, outlined |
| Outlined TextField | `OutlinedTextField` | Default, focused, error, disabled |
| Search Bar | `SearchBar` | Default, focused, with suggestions |
| Slider | `Slider` | Continuous, discrete |
| Switch | `Switch` | On, off, disabled |
| Tabs | `Tabs` | Primary, secondary; scrollable |
| Data Table | `DataTable` | With header, sortable columns |
| Alert Dialog | `AlertDialog` | With icon, with title only |
| Snackbar | `Snackbar` | Single-line, multi-line, with action |
| Linear Progress | `LinearProgress` | Indeterminate |
| Circular Progress | `CircularProgress` | Indeterminate, small (24px) |
| Badge | `Badge` | Small dot, large with number |
| Divider | `Divider` | Full width, inset |
| Dropdown Menu | `DropdownMenu` | With items, with dividers |
| Tooltip | `PlainTooltip` | Default |
| Segmented Button | `SegmentedButton` | 2-segment, 3-segment, 5-segment |
| Banner | `Banner` | Single action, two actions |
| Stepper (custom) | — | Horizontal, 7 steps |

---

## Step 8: Custom Components to Create

These components are not in the standard M3 kit and need to be built:

### 8a. StatusChip (custom variant of FilterChip)

A FilterChip with 9 color variants mapped to post statuses:

| Status | Background Token | Text Token | Style |
|--------|-----------------|------------|-------|
| `Scheduled_NoDraft` | `surfaceVariant` #DDE5DA | `onSurfaceVariant` #414941 | Outlined |
| `Drafting` | `secondaryContainer` #D1E8D4 | `onSecondaryContainer` #0C1F13 | Tonal |
| `Drafted` | `secondary` #4F6354 | `onSecondary` #FFFFFF | Tonal |
| `Formatting` | `tertiaryContainer` #BCE9E3 | `onTertiaryContainer` #00201D | Tonal |
| `Previewed` | `tertiary` #3A635F | `onTertiary` #FFFFFF | Tonal |
| `Ready_ToPublish` | `primaryContainer` #A4F5B8 | `onPrimaryContainer` #002109 | Tonal |
| `Published` | `primary` #1B6B3A | `onPrimary` #FFFFFF | Filled |
| `Publish_Failed` | `errorContainer` #FFDAD6 | `onErrorContainer` #410002 | Filled |
| `Cancelled` | `surfaceVariant` #DDE5DA | `onSurfaceVariant` #414941 | Outlined + strikethrough |

### 8b. StatusStepper (horizontal)

7-step horizontal stepper: Scheduled → Drafting → Drafted → Formatting → Previewed → Ready → Published

- **Completed steps:** Filled circle (`primary`) + solid connector line
- **Current step:** Filled circle (`primary`) + pulsing ring
- **Future steps:** Outlined circle (`outline`) + dashed connector line
- **Circle size:** 24px diameter
- **Connector length:** 40px
- **Label:** `labelSmall` below each circle

### 8c. PipelineFunnelCard

A `FilledCard` variant for pipeline stages:
- **Size:** 96 × 80px
- **Background:** Status-specific color token
- **Count:** `headlineMedium` centered
- **Label:** `labelMedium` below count
- **Arrow:** 16px SVG chevron-right between cards
- **Corner radius:** 12px

---

## Quick Reference: File Organization

```
LinkRight SMA — M3 Theme (library file)
├── Color Styles (light + dark)
├── Typography Styles
├── Effect Styles (elevation)
└── Variables (spacing, radius, layout)

LinkRight SMA — UI Design (design file)
├── Page 1: Dashboard
│   ├── Desktop (1440px) — light
│   ├── Desktop (1440px) — dark
│   └── Tablet (768px) — light
├── Page 2: Posts
│   ├── Posts List — Desktop light
│   ├── Post Detail — Desktop light
│   └── Dark variants
├── Page 3: Analytics
│   ├── Analytics Summary — Desktop light
│   └── Dark variant
├── Page 4: Settings
│   ├── Settings (Scoring tab) — Desktop light
│   └── Dark variant
└── Page 5: Components
    ├── StatusChip (9 variants)
    ├── StatusStepper
    ├── PipelineFunnelCard
    ├── PostCard
    ├── MetricCard
    ├── ActionItemCard
    └── WeekCalendar
```

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