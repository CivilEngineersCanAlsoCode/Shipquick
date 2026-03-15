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
