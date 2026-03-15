import { Card, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PillarChip from './PillarChip';
import StatusChip from './StatusChip';
import ScoreRing from './ScoreRing';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { _id, title, content_pillar, status, scheduled_date, scores, published_at } = post;

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/posts/${_id}`)}
      sx={{
        height: 180,
        p: 4,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': { boxShadow: 2 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PillarChip pillar={content_pillar} />
        <StatusChip status={status} size="small" />
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          my: 2,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ScoreRing score={scores?.total ?? 0} size="small" />
        <Typography variant="caption" color="text.secondary">
          {formatDate(published_at || scheduled_date)}
        </Typography>
      </Box>
    </Card>
  );
}
