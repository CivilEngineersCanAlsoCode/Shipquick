import { Chip } from '@mui/material';
import { STATUS_COLORS } from '../theme';

const STATUS_LABELS = {
  Scheduled_NoDraft: 'No Draft',
  Drafting:          'Drafting',
  Drafted:           'Drafted',
  Formatting:        'Formatting',
  Previewed:         'Previewed',
  Ready_ToPublish:   'Ready to Publish',
  Published:         'Published',
  Publish_Failed:    'Failed',
  Cancelled:         'Cancelled',
};

export default function StatusChip({ status, size = 'medium' }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Cancelled;
  const bg = colors.bg;
  const fg = colors.text;
  const label = STATUS_LABELS[status] || status;

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: bg,
        color: fg,
        fontWeight: 600,
        fontSize: size === 'small' ? 11 : 13,
      }}
    />
  );
}
