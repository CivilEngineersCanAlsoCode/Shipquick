import { Box, Typography, useTheme } from '@mui/material';

const SIZES = { small: 40, medium: 64, large: 96 };
const STROKE = { small: 3, medium: 4, large: 5 };

function getColor(score) {
  if (score >= 128) return '#2e7d32';
  if (score >= 80) return '#ed6c02';
  return '#d32f2f';
}

export default function ScoreRing({ score, max = 160, size = 'medium' }) {
  const theme = useTheme();
  const dim = SIZES[size] || SIZES.medium;
  const stroke = STROKE[size] || STROKE.medium;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score / max, 0), 1);
  const offset = circumference * (1 - pct);
  const color = getColor(score);
  const center = dim / 2;

  return (
    <Box sx={{ position: 'relative', width: dim, height: dim, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={theme.palette.divider}
          strokeWidth={stroke}
          opacity={0.2}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
      </svg>
      {size !== 'small' && (
        <Typography
          sx={{
            position: 'absolute',
            fontSize: size === 'large' ? 14 : 11,
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1,
          }}
        >
          {size === 'large' ? `${score}/${max}` : score}
        </Typography>
      )}
    </Box>
  );
}
