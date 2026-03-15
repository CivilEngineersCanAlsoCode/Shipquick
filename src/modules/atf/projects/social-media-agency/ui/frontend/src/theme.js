import { createTheme } from '@mui/material/styles';

// --- Status color mapping (used by PipelineChip and other components) ---
export const STATUS_COLORS = {
  Scheduled_NoDraft: 'surfaceVariant',
  Drafting: 'secondaryContainer',
  Drafted: 'secondary',
  Formatting: 'tertiaryContainer',
  Previewed: 'tertiary',
  Ready_ToPublish: 'primaryContainer',
  Published: 'primary',
  Publish_Failed: 'errorContainer',
  Cancelled: 'surfaceVariant',
};

// --- Chart palette ---
export const CHART_COLORS = {
  light: {
    primary: '#1B6B3A',
    pillar1: '#1B6B3A',
    pillar2: '#4F6354',
    pillar3: '#3A635F',
    pillar4: '#6B5E3A',
    pillar5: '#5A3A6B',
    benchmark: '#717971',
  },
  dark: {
    primary: '#89D89E',
    pillar1: '#89D89E',
    pillar2: '#B5CCB9',
    pillar3: '#A0CDC7',
    pillar4: '#D4C89E',
    pillar5: '#C89ED4',
    benchmark: '#8B938A',
  },
};

// --- M3 custom tokens (not directly in MUI palette) ---
const m3Light = {
  primaryContainer: '#A4F5B8',
  onPrimaryContainer: '#002109',
  secondaryContainer: '#D1E8D4',
  onSecondaryContainer: '#0C1F13',
  tertiary: '#3A635F',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#BCE9E3',
  onTertiaryContainer: '#00201D',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  surfaceVariant: '#DDE5DA',
  onSurfaceVariant: '#414941',
  outline: '#717971',
  outlineVariant: '#C1C9BF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F2F5EF',
  surfaceContainer: '#ECF0E9',
  surfaceContainerHigh: '#E7EAE4',
  surfaceContainerHighest: '#E1E4DE',
};

const m3Dark = {
  primaryContainer: '#005225',
  onPrimaryContainer: '#A4F5B8',
  secondaryContainer: '#374B3D',
  onSecondaryContainer: '#D1E8D4',
  tertiary: '#A0CDC7',
  onTertiary: '#013731',
  tertiaryContainer: '#204B47',
  onTertiaryContainer: '#BCE9E3',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  surfaceVariant: '#414941',
  onSurfaceVariant: '#C1C9BF',
  outline: '#8B938A',
  outlineVariant: '#414941',
  surfaceContainerLowest: '#0C0F0C',
  surfaceContainerLow: '#191C19',
  surfaceContainer: '#1D201D',
  surfaceContainerHigh: '#272A27',
  surfaceContainerHighest: '#323532',
};

// --- Shared typography & shape ---
const typography = {
  fontFamily: 'Roboto, sans-serif',
  displayLarge: { fontSize: '57px', lineHeight: '64px', letterSpacing: '-0.25px', fontWeight: 400 },
  displayMedium: { fontSize: '45px', lineHeight: '52px', letterSpacing: '0px', fontWeight: 400 },
  displaySmall: { fontSize: '36px', lineHeight: '44px', letterSpacing: '0px', fontWeight: 400 },
  headlineLarge: { fontSize: '32px', lineHeight: '40px', letterSpacing: '0px', fontWeight: 400 },
  headlineMedium: { fontSize: '28px', lineHeight: '36px', letterSpacing: '0px', fontWeight: 400 },
  headlineSmall: { fontSize: '24px', lineHeight: '32px', letterSpacing: '0px', fontWeight: 400 },
  // MUI built-in variants mapped to M3 roles
  h1: { fontSize: '32px', lineHeight: '40px', fontWeight: 400 },
  h2: { fontSize: '28px', lineHeight: '36px', fontWeight: 400 },
  h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 400 },
  h4: { fontSize: '22px', lineHeight: '28px', fontWeight: 400 },
  h5: { fontSize: '16px', lineHeight: '24px', fontWeight: 500, letterSpacing: '0.15px' },
  h6: { fontSize: '14px', lineHeight: '20px', fontWeight: 500, letterSpacing: '0.1px' },
  subtitle1: { fontSize: '16px', lineHeight: '24px', fontWeight: 500, letterSpacing: '0.15px' },
  subtitle2: { fontSize: '14px', lineHeight: '20px', fontWeight: 500, letterSpacing: '0.1px' },
  body1: { fontSize: '16px', lineHeight: '24px', fontWeight: 400, letterSpacing: '0.5px' },
  body2: { fontSize: '14px', lineHeight: '20px', fontWeight: 400, letterSpacing: '0.25px' },
  caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 400, letterSpacing: '0.4px' },
  overline: { fontSize: '12px', lineHeight: '16px', fontWeight: 500, letterSpacing: '0.5px' },
  button: { fontSize: '14px', lineHeight: '20px', fontWeight: 500, letterSpacing: '0.1px', textTransform: 'none' },
};

const shape = { borderRadius: 12 };

const componentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 20, textTransform: 'none' },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: { borderRadius: 16 },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 28 },
    },
  },
};

// --- Light theme ---
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1B6B3A', contrastText: '#FFFFFF' },
    secondary: { main: '#4F6354', contrastText: '#FFFFFF' },
    error: { main: '#BA1A1A', contrastText: '#FFFFFF' },
    background: { default: '#F8FAF5', paper: '#FFFFFF' },
    text: { primary: '#191C19', secondary: '#414941' },
    divider: '#C1C9BF',
    m3: m3Light,
  },
  typography,
  shape,
  spacing: 4,
  components: componentOverrides,
});

// --- Dark theme ---
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#89D89E', contrastText: '#003916' },
    secondary: { main: '#B5CCB9', contrastText: '#213527' },
    error: { main: '#FFB4AB', contrastText: '#690005' },
    background: { default: '#111411', paper: '#1D201D' },
    text: { primary: '#E1E4DE', secondary: '#C1C9BF' },
    divider: '#414941',
    m3: m3Dark,
  },
  typography,
  shape,
  spacing: 4,
  components: componentOverrides,
});
