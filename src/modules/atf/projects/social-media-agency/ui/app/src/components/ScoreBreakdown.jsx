import { Box, Typography, LinearProgress, Divider, Stack } from '@mui/material';

const DIMENSIONS = [
  { key: 'freshness',            label: 'Freshness (F)',           weight: 8 },
  { key: 'personal_experience',  label: 'Personal Experience (P)', weight: 5 },
  { key: 'research_quality',     label: 'Research Quality (R)',    weight: 3 },
];

function scoreColor(val) {
  if (val >= 8) return 'success';
  if (val >= 5) return 'warning';
  return 'error';
}

export default function ScoreBreakdown({ scores }) {
  const total = scores?.total ?? 0;

  return (
    <Stack spacing={3}>
      {DIMENSIONS.map(({ key, label, weight }) => {
        const val = scores?.[key] ?? 0;
        const weighted = val * weight;
        return (
          <Box key={key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {val}/10 &times; {weight} = {weighted}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(val / 10) * 100}
              color={scoreColor(val)}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      })}

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Total</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{total}/160</Typography>
      </Box>

      <Typography variant="caption" color="text.secondary">
        Score = F&times;8 + P&times;5 + R&times;3 (max 160)
      </Typography>
    </Stack>
  );
}
