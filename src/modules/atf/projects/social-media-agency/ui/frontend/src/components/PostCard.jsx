import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import PipelineChip from './PipelineChip';

export default function PostCard({ post, onAction, onClick }) {
  const isPublished = post.status === 'Published';
  const isReady = post.status === 'Ready_ToPublish';
  const needsDraft = post.status === 'Scheduled_NoDraft';

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{ mb: 2, cursor: onClick ? 'pointer' : 'default', '&:hover': { borderColor: 'primary.main' } }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PipelineChip status={post.status} size="small" />
          <Typography variant="h5" sx={{ flex: 1 }}>
            {post.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {post.scheduled_date} | {post.pillar}
          {post.score ? ` | Score: ${post.score.total}` : ''}
          {post.char_count ? ` | ${post.char_count.toLocaleString()} chars` : ''}
        </Typography>
        {(post.hook_type || post.tone) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {post.hook_type && <Chip label={post.hook_type} size="small" variant="outlined" />}
            {post.tone && <Chip label={post.tone} size="small" variant="outlined" />}
          </Box>
        )}
      </CardContent>
      {onAction && (
        <CardActions sx={{ px: 4, pb: 3 }}>
          {isReady && (
            <>
              <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); onAction('review', post._id); }}>
                Review
              </Button>
              <Button size="small" variant="contained" onClick={(e) => { e.stopPropagation(); onAction('publish', post._id); }}>
                Publish
              </Button>
            </>
          )}
          {post.status === 'Previewed' && (
            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); onAction('review', post._id); }}>
              Review
            </Button>
          )}
          {needsDraft && (
            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); onAction('draft', post._id); }}>
              Draft
            </Button>
          )}
          {isPublished && (
            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); onAction('analytics', post._id); }}>
              Analytics
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
