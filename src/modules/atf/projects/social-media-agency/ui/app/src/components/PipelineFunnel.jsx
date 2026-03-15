import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import { STATUS_COLORS } from '../theme';

const STAGES = [
  { key: 'Scheduled_NoDraft', label: 'No Draft' },
  { key: 'Drafting',          label: 'Drafting' },
  { key: 'Drafted',           label: 'Drafted' },
  { key: 'Formatting',        label: 'Formatting' },
  { key: 'Previewed',         label: 'Previewed' },
  { key: 'Ready_ToPublish',   label: 'Ready' },
  { key: 'Published',         label: 'Published' },
];

export default function PipelineFunnel({ counts }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
      {STAGES.map((stage, i) => (
        <Box key={stage.key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component={Link}
            to={`/posts?status=${stage.key}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1,
              '&:hover': { opacity: 0.8 },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: STATUS_COLORS[stage.key]?.bg || '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                {counts[stage.key] ?? 0}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {stage.label}
            </Typography>
          </Box>
          {i < STAGES.length - 1 && (
            <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.5 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
