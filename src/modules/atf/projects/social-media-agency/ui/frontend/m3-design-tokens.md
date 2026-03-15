# Material 3 Design Tokens

**System:** Google Material 3 Dynamic Color
**Source color:** `#1B6B3A` (green — growth/LinkedIn brand alignment)
**Tool:** Material Theme Builder generated palette
**Implementation:** MUI v6 `createTheme()` with M3 mappings

---

## Color Scheme

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1B6B3A` | Active nav, FAB, primary buttons |
| `onPrimary` | `#FFFFFF` | Text/icons on primary |
| `primaryContainer` | `#A4F5B8` | Ready_ToPublish chip, light primary surfaces |
| `onPrimaryContainer` | `#002109` | Text on primary container |
| `secondary` | `#4F6354` | Secondary buttons, Drafted chip |
| `onSecondary` | `#FFFFFF` | Text on secondary |
| `secondaryContainer` | `#D1E8D4` | Drafting chip, secondary surfaces |
| `onSecondaryContainer` | `#0C1F13` | Text on secondary container |
| `tertiary` | `#3A635F` | Chart accents, Previewed chip |
| `onTertiary` | `#FFFFFF` | Text on tertiary |
| `tertiaryContainer` | `#BCE9E3` | Formatting chip, tertiary surfaces |
| `onTertiaryContainer` | `#00201D` | Text on tertiary container |
| `error` | `#BA1A1A` | Publish_Failed, error states |
| `onError` | `#FFFFFF` | Text on error |
| `errorContainer` | `#FFDAD6` | Error backgrounds |
| `onErrorContainer` | `#410002` | Text on error container |
| `surface` | `#F8FAF5` | Page background |
| `onSurface` | `#191C19` | Primary text |
| `surfaceVariant` | `#DDE5DA` | Muted cards, Scheduled_NoDraft chip |
| `onSurfaceVariant` | `#414941` | Secondary text, labels |
| `outline` | `#717971` | Card borders, dividers |
| `outlineVariant` | `#C1C9BF` | Subtle borders |
| `surfaceContainerLowest` | `#FFFFFF` | Elevated card backgrounds |
| `surfaceContainerLow` | `#F2F5EF` | Card backgrounds |
| `surfaceContainer` | `#ECF0E9` | Navigation rail background |
| `surfaceContainerHigh` | `#E7EAE4` | Dialog backgrounds |
| `surfaceContainerHighest` | `#E1E4DE` | Top app bar, inputs |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#89D89E` | Active nav, FAB, primary buttons |
| `onPrimary` | `#003916` | Text on primary |
| `primaryContainer` | `#005225` | Ready_ToPublish chip |
| `onPrimaryContainer` | `#A4F5B8` | Text on primary container |
| `secondary` | `#B5CCB9` | Secondary buttons, Drafted chip |
| `onSecondary` | `#213527` | Text on secondary |
| `secondaryContainer` | `#374B3D` | Drafting chip |
| `onSecondaryContainer` | `#D1E8D4` | Text on secondary container |
| `tertiary` | `#A0CDC7` | Chart accents, Previewed chip |
| `onTertiary` | `#013731` | Text on tertiary |
| `tertiaryContainer` | `#204B47` | Formatting chip |
| `onTertiaryContainer` | `#BCE9E3` | Text on tertiary container |
| `error` | `#FFB4AB` | Error states |
| `onError` | `#690005` | Text on error |
| `errorContainer` | `#93000A` | Error backgrounds |
| `onErrorContainer` | `#FFDAD6` | Text on error container |
| `surface` | `#111411` | Page background |
| `onSurface` | `#E1E4DE` | Primary text |
| `surfaceVariant` | `#414941` | Muted cards |
| `onSurfaceVariant` | `#C1C9BF` | Secondary text |
| `outline` | `#8B938A` | Borders |
| `outlineVariant` | `#414941` | Subtle borders |
| `surfaceContainerLowest` | `#0C0F0C` | Elevated backgrounds |
| `surfaceContainerLow` | `#191C19` | Card backgrounds |
| `surfaceContainer` | `#1D201D` | Navigation rail |
| `surfaceContainerHigh` | `#272A27` | Dialogs |
| `surfaceContainerHighest` | `#323532` | Top app bar |

---

## Status Color Mapping

| Status | Light Token | Dark Token | Chip Variant |
|--------|------------|-----------|-------------|
| `Scheduled_NoDraft` | `surfaceVariant` | `surfaceVariant` | Outlined |
| `Drafting` | `secondaryContainer` | `secondaryContainer` | Tonal |
| `Drafted` | `secondary` | `secondary` | Tonal |
| `Formatting` | `tertiaryContainer` | `tertiaryContainer` | Tonal |
| `Previewed` | `tertiary` | `tertiary` | Tonal |
| `Ready_ToPublish` | `primaryContainer` | `primaryContainer` | Tonal |
| `Published` | `primary` | `primary` | Filled |
| `Publish_Failed` | `errorContainer` | `errorContainer` | Filled |
| `Cancelled` | `surfaceVariant` | `surfaceVariant` | Outlined + strikethrough |

---

## Typography Scale

Based on M3 type scale using `Roboto` (system default for Material).

| Role | Font | Weight | Size | Line Height | Letter Spacing | Usage |
|------|------|--------|------|-------------|----------------|-------|
| `displayLarge` | Roboto | 400 | 57px | 64px | -0.25px | — |
| `displayMedium` | Roboto | 400 | 45px | 52px | 0px | — |
| `displaySmall` | Roboto | 400 | 36px | 44px | 0px | — |
| `headlineLarge` | Roboto | 400 | 32px | 40px | 0px | Page titles |
| `headlineMedium` | Roboto | 400 | 28px | 36px | 0px | Pipeline funnel counts |
| `headlineSmall` | Roboto | 400 | 24px | 32px | 0px | Section headers |
| `titleLarge` | Roboto | 400 | 22px | 28px | 0px | Card titles, dialog titles |
| `titleMedium` | Roboto | 500 | 16px | 24px | 0.15px | Post titles, nav labels |
| `titleSmall` | Roboto | 500 | 14px | 20px | 0.1px | Subtitles |
| `bodyLarge` | Roboto | 400 | 16px | 24px | 0.5px | Post content preview |
| `bodyMedium` | Roboto | 400 | 14px | 20px | 0.25px | Metadata values, table cells |
| `bodySmall` | Roboto | 400 | 12px | 16px | 0.4px | Timestamps, secondary info |
| `labelLarge` | Roboto | 500 | 14px | 20px | 0.1px | Buttons, chips |
| `labelMedium` | Roboto | 500 | 12px | 16px | 0.5px | Pipeline stage labels |
| `labelSmall` | Roboto | 500 | 11px | 16px | 0.5px | Badges, tiny labels |

---

## Spacing Tokens

M3 uses a 4px base grid.

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.xs` | 4px | Chip padding, icon margins |
| `spacing.sm` | 8px | Inner card padding, chip gaps |
| `spacing.md` | 16px | Card padding, section gaps |
| `spacing.lg` | 24px | Page margins, major section gaps |
| `spacing.xl` | 32px | Between page sections |
| `spacing.2xl` | 48px | Page top padding |

### Layout Dimensions

| Element | Value |
|---------|-------|
| Top app bar height | 64px |
| Navigation rail width (expanded) | 256px |
| Navigation rail width (collapsed) | 80px |
| Bottom nav height (mobile) | 80px |
| Card border radius | 12px |
| Chip border radius | 8px |
| Button border radius | 20px (fully rounded) |
| FAB border radius | 16px |
| Dialog border radius | 28px |
| Content max width | 1200px |

---

## Elevation

M3 uses tonal elevation (surface tint) instead of shadows.

| Level | Usage | Surface Tint Opacity |
|-------|-------|---------------------|
| Level 0 | Page background | 0% |
| Level 1 | Cards, navigation rail | 5% |
| Level 2 | Top app bar, FAB (resting) | 8% |
| Level 3 | Snackbar, FAB (hovered) | 11% |
| Level 4 | Menus, dialogs | 12% |
| Level 5 | (reserved) | 14% |

---

## Component Variants Used

### Cards

| Variant | Token | Usage |
|---------|-------|-------|
| Filled | `surfaceContainerHighest` | Metric cards, pipeline funnel stages |
| Outlined | `surface` + `outline` border | Post list cards, action items |
| Elevated | `surfaceContainerLow` + Level 1 | — |

### Buttons

| Variant | Usage |
|---------|-------|
| Filled | Save, Publish (primary actions) |
| Filled tonal | Review, Draft (secondary actions) |
| Outlined | Reset, Cancel |
| Text | Inline links, minor actions |

### Chips

| Variant | Usage |
|---------|-------|
| Filter (selected/unselected) | Status filters, pillar filters, day selectors |
| Assist | Framework tags (Hook, Tone, Narrative) |

### Text Fields

| Variant | Usage |
|---------|-------|
| Outlined | Config inputs, search bar |

---

## Chart Colors

For Recharts / chart components, mapped from M3 tokens:

| Series | Light | Dark | Usage |
|--------|-------|------|-------|
| Primary line | `#1B6B3A` | `#89D89E` | Engagement trend |
| Pillar 1 | `#1B6B3A` | `#89D89E` | Skill-Building |
| Pillar 2 | `#4F6354` | `#B5CCB9` | Career |
| Pillar 3 | `#3A635F` | `#A0CDC7` | Leadership |
| Pillar 4 | `#6B5E3A` | `#D4C89E` | Personal |
| Pillar 5 | `#5A3A6B` | `#C89ED4` | Tech |
| Benchmark | `#717971` | `#8B938A` | Dashed reference line |

---

## MUI Theme Implementation

```tsx
// theme.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1B6B3A', contrastText: '#FFFFFF' },
    secondary: { main: '#4F6354', contrastText: '#FFFFFF' },
    error: { main: '#BA1A1A', contrastText: '#FFFFFF' },
    background: {
      default: '#F8FAF5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#191C19',
      secondary: '#414941',
    },
    divider: '#C1C9BF',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 4,  // base 4px grid
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#89D89E', contrastText: '#003916' },
    secondary: { main: '#B5CCB9', contrastText: '#213527' },
    error: { main: '#FFB4AB', contrastText: '#690005' },
    background: {
      default: '#111411',
      paper: '#1D201D',
    },
    text: {
      primary: '#E1E4DE',
      secondary: '#C1C9BF',
    },
    divider: '#414941',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 4,
});
```
