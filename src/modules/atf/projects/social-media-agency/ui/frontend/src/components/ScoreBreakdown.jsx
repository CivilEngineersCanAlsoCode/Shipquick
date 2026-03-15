import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const DIMENSIONS = [
  { key: 'freshness', label: 'Freshness', weight: 8, max: 10 },
  { key: 'personal', label: 'Personal Experience', weight: 5, max: 10 },
  { key: 'research', label: 'Research Quality', weight: 3, max: 10 },
];

export default function ScoreBreakdown({ score }) {
  if (!score) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Score: {score.total} / 160
      </Typography>
      {DIMENSIONS.map(({ key, label, weight, max }) => (
        <Box key={key} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">{label} (x{weight})</Typography>
            <Typography variant="body2" fontWeight={500}>
              {score[key]} / {max}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(score[key] / max) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      ))}
    </Box>
  );
}
