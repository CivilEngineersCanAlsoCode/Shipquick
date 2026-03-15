import { Chip } from '@mui/material';
import { PILLAR_COLORS, PILLAR_WEIGHTS } from '../theme';

const PILLAR_LABELS = {
  ai_automation: 'AI & Automation',
  startup:       'Startup',
  pm:            'Product Management',
  career:        'Career',
  hottake:       'Hot Take',
  personal:      'Personal',
  howto:         'How-To',
};

export default function PillarChip({ pillar, showWeight = false }) {
  const color = PILLAR_COLORS[pillar] || '#888';
  let label = PILLAR_LABELS[pillar] || pillar;
  if (showWeight && PILLAR_WEIGHTS[pillar] != null) {
    label += ` (${PILLAR_WEIGHTS[pillar]}%)`;
  }

  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        borderColor: color,
        color,
        fontWeight: 600,
        fontSize: 13,
      }}
    />
  );
}
