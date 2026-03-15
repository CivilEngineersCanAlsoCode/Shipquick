import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import CancelIcon from '@mui/icons-material/Cancel';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EventIcon from '@mui/icons-material/Event';
import ReplayIcon from '@mui/icons-material/Replay';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CircleIcon from '@mui/icons-material/Circle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  StatusChip,
  PillarChip,
  ScoreBreakdown,
  LinkedInPreview,
  ErrorBanner,
} from '../components';
import { fetchPost } from '../api';
import { STATUS_COLORS } from '../theme';

function formatDateTime(iso) {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function truncate(str, len = 40) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

const WEBHOOK_MSG = 'Action requires sma-update-post webhook (not built yet)';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [post, setPost] = useState(state?.post || null);
  const [loading, setLoading] = useState(!state?.post);
  const [fetchError, setFetchError] = useState(null);
  const [snack, setSnack] = useState(null);

  // Try fetching if no state passed (direct URL access)
  useEffect(() => {
    if (post) return;
    setLoading(true);
    fetchPost(id)
      .then((data) => setPost(data))
      .catch(() => setFetchError('Navigate from Posts list to see post details. Direct URL access requires sma-fetch-post webhook.'))
      .finally(() => setLoading(false));
  }, [id, post]);

  const handleAction = () => setSnack(WEBHOOK_MSG);

  // Loading
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Skeleton width={200} height={24} sx={{ mb: 2 }} />
        <Skeleton width={300} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // No data
  if (fetchError || !post) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/posts')} sx={{ mb: 2 }}>
          Back to Posts
        </Button>
        <ErrorBanner message={fetchError || 'Post data unavailable. The sma-fetch-post webhook needs to be built.'} />
      </Box>
    );
  }

  const { title, content_pillar, status, scheduled_date, published_at, scores, metrics, content, hook, body, cta, hashtags, tone } = post;
  const engagement = metrics
    ? (metrics.likes || 0) + (metrics.comments || 0) * 3 + (metrics.shares || 0) * 2
    : null;

  // Build content for LinkedInPreview from available fields
  const previewContent = content || [hook, body, cta].filter(Boolean).join('\n\n') || null;

  // Action buttons per status
  const renderActions = () => {
    const btn = (label, icon, color = 'primary') => (
      <Button key={label} variant="outlined" color={color} startIcon={icon} onClick={handleAction} size="small">
        {label}
      </Button>
    );

    switch (status) {
      case 'Previewed':
        return (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {btn('Approve', <CheckCircleIcon />, 'success')}
            {btn('Send Back', <UndoIcon />, 'warning')}
            {btn('Cancel', <CancelIcon />, 'error')}
          </Box>
        );
      case 'Ready_ToPublish':
        return (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {btn('Publish', <RocketLaunchIcon />, 'success')}
            {btn('Reschedule', <EventIcon />)}
          </Box>
        );
      case 'Published':
        return null;
      case 'Publish_Failed':
        return (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {btn('Retry', <ReplayIcon />)}
            {btn('Cancel', <CancelIcon />, 'error')}
          </Box>
        );
      default:
        return (
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            href="https://chat.openai.com"
            target="_blank"
            rel="noopener"
            size="small"
          >
            Open ChatGPT to continue
          </Button>
        );
    }
  };

  // Metric stat helper
  const StatBox = ({ icon, label, value }) => (
    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', flex: 1, minWidth: 100 }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>{value ?? '--'}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Paper>
  );

  // Timeline entries
  const timelineEntries = [];
  if (scheduled_date) timelineEntries.push({ label: 'Scheduled', date: formatDateTime(scheduled_date), color: '#29b6f6' });
  if (published_at) timelineEntries.push({ label: 'Published', date: formatDateTime(published_at), color: '#66bb6a' });
  if (status && status !== 'Published') {
    const sc = STATUS_COLORS[status];
    timelineEntries.push({ label: (status || '').replace(/_/g, ' '), date: 'Current status', color: sc?.bg || '#64748b' });
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      {/* Back + Breadcrumb */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/posts')} sx={{ mb: 1 }} size="small">
        Back
      </Button>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/posts" underline="hover" color="inherit">Posts</Link>
        <Typography color="text.primary">{truncate(title)}</Typography>
      </Breadcrumbs>

      {/* Header: Status + Pillar */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <StatusChip status={status} />
        {content_pillar && <PillarChip pillar={content_pillar} />}
      </Box>

      {/* Split view */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{title}</Typography>

          {/* Metadata */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {scheduled_date && (
                <Typography variant="body2">
                  <strong>Scheduled:</strong> {formatDateTime(scheduled_date)}
                </Typography>
              )}
              {published_at && (
                <Typography variant="body2">
                  <strong>Published:</strong> {formatDateTime(published_at)}
                </Typography>
              )}
              {content_pillar && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2"><strong>Pillar:</strong></Typography>
                  <PillarChip pillar={content_pillar} />
                </Box>
              )}
              <Typography variant="body2">
                <strong>Tone:</strong> {tone || 'vulnerable-conversational'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Scores */}
          {scores ? (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Content Score</Typography>
              <ScoreBreakdown scores={scores} />
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Content Score</Typography>
              <Typography variant="body2" color="text.secondary">
                Score data not available (requires sma-fetch-post webhook)
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Engagement */}
          {status === 'Published' && metrics && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Engagement</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <StatBox icon={<ThumbUpIcon color="action" fontSize="small" />} label="Likes" value={metrics.likes} />
                <StatBox icon={<ChatBubbleIcon color="action" fontSize="small" />} label="Comments" value={metrics.comments} />
                <StatBox icon={<ShareIcon color="action" fontSize="small" />} label="Shares" value={metrics.shares} />
                <StatBox icon={<VisibilityIcon color="action" fontSize="small" />} label="Impressions" value={metrics.impressions} />
              </Box>
              {engagement != null && (
                <Typography variant="body2" color="text.secondary">
                  Engagement Score: <strong>{engagement}</strong> (likes&times;1 + comments&times;3 + shares&times;2)
                </Typography>
              )}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Actions</Typography>
            {renderActions()}
          </Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>LinkedIn Preview</Typography>
          {previewContent ? (
            <LinkedInPreview
              content={previewContent}
              hashtags={Array.isArray(hashtags) ? hashtags : []}
            />
          ) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Post content not available. Build sma-fetch-post webhook to see full post.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Status Timeline */}
      {timelineEntries.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Status Timeline</Typography>
          <List dense>
            {timelineEntries.map((entry, i) => (
              <ListItem key={i}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CircleIcon sx={{ fontSize: 12, color: entry.color }} />
                </ListItemIcon>
                <ListItemText
                  primary={entry.label}
                  secondary={entry.date}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Snackbar for webhook-not-built actions */}
      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        <Alert severity="warning" onClose={() => setSnack(null)} variant="filled">
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
}
