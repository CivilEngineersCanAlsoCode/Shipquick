import { Box, Card, Typography } from '@mui/material';

function deltaColor(delta) {
  if (!delta) return 'text.secondary';
  if (delta.startsWith('+')) return '#66bb6a';
  if (delta.startsWith('-')) return '#ef5350';
  return 'text.secondary';
}

export default function MetricCard({ icon, label, value, delta, color = 'primary.main' }) {
  return (
    <Card variant="outlined" elevation={0} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: color,
            color: 'background.default',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {delta && (
            <Typography variant="caption" sx={{ color: deltaColor(delta), fontWeight: 600 }}>
              {delta}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
