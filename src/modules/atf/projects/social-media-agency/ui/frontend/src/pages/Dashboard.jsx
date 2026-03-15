import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { usePipeline, useAnalytics, usePublishPost } from '../api/client';
import PipelineChip from '../components/PipelineChip';

const PIPELINE_ORDER = [
  'Scheduled_NoDraft',
  'Drafting',
  'Drafted',
  'Formatting',
  'Previewed',
  'Ready_ToPublish',
  'Published',
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: pipeline, isLoading: pipelineLoading, refetch } = usePipeline();
  const { data: analytics } = useAnalytics('7d');
  const publishMutation = usePublishPost();
  const [snack, setSnack] = React.useState(null);

  const counts = pipeline?.counts || {};
  const actionItems = pipeline?.actionItems || [];
  const calendar = pipeline?.calendar || [];

  const handlePublish = async (id) => {
    try {
      await publishMutation.mutateAsync(id);
      setSnack({ severity: 'success', message: 'Post published successfully!' });
    } catch {
      setSnack({ severity: 'error', message: 'Publish failed.' });
    }
  };

  if (pipelineLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 20 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
        <Typography variant="h1" sx={{ flex: 1 }}>Pipeline Overview</Typography>
        <IconButton onClick={() => refetch()}><RefreshIcon /></IconButton>
      </Box>

      {/* Pipeline Funnel */}
      <Card sx={{ mb: 6, bgcolor: (t) => t.palette.m3?.surfaceContainerLow || t.palette.background.paper }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Pipeline Funnel</Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {PIPELINE_ORDER.map((status, i) => (
              <React.Fragment key={status}>
                <Card
                  variant="outlined"
                  onClick={() => navigate(`/posts?status=${status}`)}
                  sx={{
                    minWidth: 100,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <CardContent>
                    <Typography variant="h2">{counts[status] || 0}</Typography>
                    <Typography variant="overline" color="text.secondary">
                      {status.replace(/_/g, ' ').replace('NoDraft', 'No Draft')}
                    </Typography>
                  </CardContent>
                </Card>
                {i < PIPELINE_ORDER.length - 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" fontSize={20}>→</Typography>
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Action Required */}
      {actionItems.length > 0 && (
        <Card variant="outlined" sx={{ mb: 6 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Action Required</Typography>
            {actionItems.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  py: 2,
                  borderBottom: i < actionItems.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.priority === 'urgent' ? 'error.main' : item.priority === 'soon' ? 'warning.main' : 'text.disabled',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body1" sx={{ flex: 1 }}>{item.label}</Typography>
                {item.action === 'publish' && item.postId && (
                  <Button variant="contained" size="small" onClick={() => handlePublish(item.postId)}>
                    Publish Now
                  </Button>
                )}
                {item.action === 'review' && item.postId && (
                  <Button variant="outlined" size="small" onClick={() => navigate(`/posts/${item.postId}`)}>
                    Review Now
                  </Button>
                )}
                {item.action === 'ideate' && (
                  <Button variant="outlined" size="small" href="https://chat.openai.com" target="_blank" rel="noopener">
                    Start Ideation
                  </Button>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weekly Calendar */}
      {calendar.length > 0 && (
        <Card variant="outlined" sx={{ mb: 6 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>This Week</Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {calendar.map((day) => (
                <Card
                  key={day.date}
                  variant="outlined"
                  onClick={() => day.postId && navigate(`/posts/${day.postId}`)}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    cursor: day.postId ? 'pointer' : 'default',
                    opacity: day.postId ? 1 : 0.5,
                  }}
                >
                  <CardContent>
                    <Typography variant="overline">{day.dayLabel}</Typography>
                    {day.postId ? (
                      <>
                        <PipelineChip status={day.status} size="small" />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {day.title}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">OPEN</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {analytics && (
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Posts this week', value: analytics.postsThisWeek ?? '--' },
            { label: 'Avg engagement', value: analytics.avgEngagement ?? '--' },
            { label: 'Top pillar', value: analytics.topPillar ?? '--' },
            { label: 'Streak', value: analytics.streak ? `${analytics.streak} days` : '--' },
          ].map((stat) => (
            <Card
              key={stat.label}
              sx={{
                flex: '1 1 200px',
                bgcolor: (t) => t.palette.m3?.surfaceContainerHighest || t.palette.action.hover,
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h2">{stat.value}</Typography>
                <Typography variant="overline" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* FAB */}
      <Fab
        color="primary"
        variant="extended"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        href="https://chat.openai.com"
        target="_blank"
        rel="noopener"
      >
        <AddIcon sx={{ mr: 1 }} />
        New Ideation
      </Fab>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        {snack && <Alert severity={snack.severity} onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </Box>
  );
}
