import { createTheme } from '@mui/material/styles';

// ── Status colors for pipeline chips ──────────────────────────────────
export const STATUS_COLORS = {
  Scheduled_NoDraft: { bg: '#64748b', text: '#fff' },
  Drafting:          { bg: '#006a6a30', text: '#006a6a' },
  Drafted:           { bg: '#006a6a50', text: '#004d4d' },
  Formatting:        { bg: '#7e57c230', text: '#7e57c2' },
  Previewed:         { bg: '#7e57c250', text: '#5e35b1' },
  Ready_ToPublish:   { bg: '#ec5b1330', text: '#ec5b13' },
  Published:         { bg: '#2e7d32', text: '#fff' },
  Publish_Failed:    { bg: '#d32f2f', text: '#fff' },
  Cancelled:         { bg: '#9e9e9e30', text: '#757575' },
};

export const STATUS_COLORS_DARK = {
  Scheduled_NoDraft: { bg: '#64748b', text: '#fff' },
  Drafting:          { bg: '#006a6a30', text: '#80d5d5' },
  Drafted:           { bg: '#006a6a50', text: '#80d5d5' },
  Formatting:        { bg: '#7e57c230', text: '#b39ddb' },
  Previewed:         { bg: '#7e57c250', text: '#b39ddb' },
  Ready_ToPublish:   { bg: '#ec5b1330', text: '#ffb599' },
  Published:         { bg: '#2e7d32', text: '#fff' },
  Publish_Failed:    { bg: '#d32f2f', text: '#fff' },
  Cancelled:         { bg: '#9e9e9e30', text: '#9e9e9e' },
};

// ── Pillar colors (data colors, not theme) ────────────────────────────
export const PILLAR_COLORS = {
  ai_automation: '#26a69a',
  startup:       '#ec5b13',
  pm:            '#7e57c2',
  career:        '#66bb6a',
  hottake:       '#ef5350',
  personal:      '#d81b60',
  howto:         '#29b6f6',
};

// ── Pillar weights for content mix targeting ──────────────────────────
export const PILLAR_WEIGHTS = {
  ai_automation: 25,
  startup:       20,
  pm:            20,
  career:        15,
  hottake:       10,
  personal:       5,
  howto:           5,
};

// ── MUI v6 theme with cssVariables (light + dark) ─────────────────────
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary:    { main: '#006a6a' },
        secondary:  { main: '#ec5b13' },
        tertiary:   { main: '#7e57c2' },
        error:      { main: '#ba1a1a' },
        background: { default: '#f8f6f6', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary:    { main: '#80d5d5' },
        secondary:  { main: '#ffb599' },
        tertiary:   { main: '#b39ddb' },
        error:      { main: '#ffb4ab' },
        background: { default: '#221610', paper: '#2d2420' },
      },
    },
  },
  typography: {
    fontFamily: 'Public Sans, Roboto, sans-serif',
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
    MuiChip:   { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard:   { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
