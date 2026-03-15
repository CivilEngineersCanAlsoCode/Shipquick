import { fetchPosts, n8nFetch, WEBHOOKS } from '../api';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Fab,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CircleIcon from '@mui/icons-material/Circle';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import InboxOutlined from '@mui/icons-material/InboxOutlined';
import { PipelineFunnel, MetricCard, EmptyState, ErrorBanner } from '../components';
import { PILLAR_COLORS } from '../theme';


// ── Helpers ────────────────────────────────────────────────────────────
function getWeekBounds(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);
  return { mon, sun };
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_PREF_KEYS = { 0: 'mon', 1: 'tue', 2: 'wed', 3: 'thu', 4: 'fri', 5: 'sat', 6: 'sun' };

// ── Action config ──────────────────────────────────────────────────────
const ACTION_MAP = {
  Previewed:        { label: 'Review needed',          color: '#ec5b13' },
  Ready_ToPublish:  { label: 'Ready to publish',       color: '#66bb6a' },
  Publish_Failed:   { label: 'Publish failed — retry', color: '#d32f2f' },
  Drafted:          { label: 'Needs formatting',        color: '#006a6a' },
};

export default function Dashboard() {
  const [posts, setPosts] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchPosts(50),
      n8nFetch(WEBHOOKS.FETCH_CONFIG, { config_id: 'posting_schedule' }),
    ])
      .then(([postsRes, configRes]) => {
        setPosts(Array.isArray(postsRes?.posts) ? postsRes.posts : []);
        setConfig(configRes?.posting_schedule ?? null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Skeleton variant="rounded" height={60} />
        <Grid container spacing={3}>
          {[0, 1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rounded" height={100} sx={{ flex: 1 }} />
          ))}
        </Box>
      </Box>
    );
  }

  // ── Error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
        <ErrorBanner message={error} onRetry={loadData} />
      </Box>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
        <EmptyState
          icon={<InboxOutlined />}
          title="No posts yet"
          description="Create your first post in ChatGPT"
          actionLabel="Open ChatGPT"
          actionHref="https://chatgpt.com"
        />
      </Box>
    );
  }

  // ── Computed data ──────────────────────────────────────────────────
  const now = new Date();
  const { mon: weekStart, sun: weekEnd } = getWeekBounds(now);

  // Pipeline counts
  const counts = {};
  posts.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });

  // Action items
  const actionItems = posts.filter((p) => ACTION_MAP[p.status]);

  // Posts this week
  const postsThisWeek = posts.filter((p) => {
    if (!p.scheduled_date) return false;
    const d = new Date(p.scheduled_date);
    return d >= weekStart && d <= weekEnd;
  });

  // Avg engagement score (published only)
  const published = posts.filter((p) => p.status === 'Published' && p.metrics);
  const avgScore = published.length > 0
    ? Math.round(published.reduce((sum, p) => {
        const m = p.metrics;
        return sum + ((m.likes || 0) * 1 + (m.comments || 0) * 3 + (m.shares || 0) * 2);
      }, 0) / published.length)
    : 0;

  // Top pillar
  const pillarCounts = {};
  published.forEach((p) => {
    if (p.content_pillar) pillarCounts[p.content_pillar] = (pillarCounts[p.content_pillar] || 0) + 1;
  });
  const topPillar = Object.entries(pillarCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const topPillarLabel = topPillar.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Next scheduled
  const futurePosts = posts
    .filter((p) => p.scheduled_date && new Date(p.scheduled_date) > now)
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  const nextDate = futurePosts[0]
    ? new Date(futurePosts[0].scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'None planned';

  // Week calendar days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const dayPrefs = config?.day_preferences ?? {};

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4, display: 'flex', flexDirection: 'column', gap: 3, pb: 10 }}>
      <Typography variant="h4">Dashboard</Typography>

      {/* Section 1: Pipeline Funnel */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Pipeline</Typography>
        <PipelineFunnel counts={counts} />
      </Box>

      {/* Section 2: Action Required */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Action Required</Typography>
        {actionItems.length === 0 ? (
          <Typography variant="body2" sx={{ py: 1 }}>All caught up! ✅</Typography>
        ) : (
          <List disablePadding dense>
            {actionItems.map((post, i) => {
              const action = ACTION_MAP[post.status];
              return (
                <ListItem key={post.id || i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CircleIcon sx={{ fontSize: 10, color: action.color }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={post.title || post.hook || 'Untitled'}
                    secondary={action.label}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Section 3: Quick Stats */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard icon={<ArticleOutlined />} label="Posts This Week" value={postsThisWeek.length} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard icon={<TrendingUpOutlined />} label="Avg Score" value={avgScore} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            icon={<CategoryOutlined />}
            label="Top Pillar"
            value={topPillarLabel}
            color={PILLAR_COLORS[topPillar] || 'primary.main'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard icon={<ScheduleOutlined />} label="Next Scheduled" value={nextDate} />
        </Grid>
      </Grid>

      {/* Section 4: Weekly Calendar */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>This Week</Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, now);
            const prefKey = DAY_PREF_KEYS[i];
            const isScheduledDay = dayPrefs[prefKey] === true;
            const dayPosts = posts.filter((p) => p.scheduled_date && isSameDay(new Date(p.scheduled_date), day));

            return (
              <Paper
                key={i}
                variant="outlined"
                sx={{
                  flex: 1,
                  minWidth: 120,
                  p: 2,
                  borderLeft: isToday ? 3 : 1,
                  borderLeftColor: isToday ? 'primary.main' : 'divider',
                  bgcolor: isScheduledDay ? 'action.hover' : 'transparent',
                }}
              >
                <Typography variant="caption" color="text.secondary">{DAY_NAMES[i]}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{day.getDate()}</Typography>
                {dayPosts.map((p, j) => (
                  <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <CircleIcon sx={{ fontSize: 8, color: PILLAR_COLORS[p.content_pillar] || 'text.secondary' }} />
                    <Typography variant="caption" noWrap>{p.title || p.hook || 'Untitled'}</Typography>
                  </Box>
                ))}
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* FAB */}
      <Fab
        variant="extended"
        color="primary"
        onClick={() => window.open('https://chatgpt.com', '_blank')}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddOutlined sx={{ mr: 1 }} />
        Open ChatGPT
      </Fab>
    </Box>
  );
}
