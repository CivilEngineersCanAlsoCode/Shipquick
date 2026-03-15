import { createTheme } from '@mui/material/styles';

// Status colors for pipeline chips
export const STATUS_COLORS = {
  Scheduled_NoDraft: '#414941',
  Drafting:          '#374B3D',
  Drafted:           '#B5CCB9',
  Formatting:        '#204B47',
  Previewed:         '#A0CDC7',
  Ready_ToPublish:   '#005225',
  Published:         '#89D89E',
  Publish_Failed:    '#93000A',
  Cancelled:         '#414941',
};

export const STATUS_TEXT_COLORS = {
  Scheduled_NoDraft: '#C1C9BF',
  Drafting:          '#D1E8D4',
  Drafted:           '#213527',
  Formatting:        '#BCE9E3',
  Previewed:         '#013731',
  Ready_ToPublish:   '#A4F5B8',
  Published:         '#003916',
  Publish_Failed:    '#FFDAD6',
  Cancelled:         '#C1C9BF',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#89D89E', contrastText: '#003916' },
    secondary: { main: '#B5CCB9', contrastText: '#213527' },
    error: { main: '#FFB4AB', contrastText: '#690005' },
    background: { default: '#111411', paper: '#1D201D' },
    text: { primary: '#E1E4DE', secondary: '#C1C9BF' },
    divider: '#414941',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  spacing: 4,
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
