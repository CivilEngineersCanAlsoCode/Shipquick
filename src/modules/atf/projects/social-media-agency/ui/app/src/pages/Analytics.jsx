import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Typography, Box, Skeleton, Alert, Tooltip,
  ToggleButtonGroup, ToggleButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  ArticleOutlined, TrendingUpOutlined, PercentOutlined, EmojiEventsOutlined,
  BarChartOutlined,
} from '@mui/icons-material';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { MetricCard, PillarChip, EmptyState, ErrorBanner } from '../components';
import { PILLAR_COLORS } from '../theme';

const PILLAR_LABELS = {
  ai_automation: 'AI & Automation',
  startup: 'Startup',
  pm: 'Product Mgmt',
  career: 'Career',
  hottake: 'Hot Take',
  personal: 'Personal',
  howto: 'How-To',
};

const PERIOD_DAYS = { '7': 7, '30': 30, '90': 90, all: null };

const DEFAULT_WEIGHTS = { likes: 1, comments: 3, shares: 2 };

async function n8nFetch(path, body = {}) {
  const res = await fetch('http://172.17.0.2:5678/webhook/' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Webhook failed: ' + res.status);
  return res.json();
}

function calcScore(m, w) {
  if (!m) return 0;
  return (m.likes || 0) * w.likes + (m.comments || 0) * w.comments + (m.shares || 0) * w.shares;
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Analytics() {
  const [posts, setPosts] = useState([]);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30');
  const [sortCol, setSortCol] = useState('engagement');
  const [sortDir, setSortDir] = useState('desc');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, configRes] = await Promise.all([
        n8nFetch('sma-fetch-past-posts', { channel: 'linkedin', limit: 50 }),
        n8nFetch('sma-fetch-config', { config_id: 'engagement_config' }),
      ]);
      setPosts(postsRes.posts || []);
      const ew = configRes.engagement_config?.engagement_weights;
      if (ew) setWeights(ew);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Filter to published posts with metrics, within period
  const filtered = useMemo(() => {
    const now = new Date();
    const days = PERIOD_DAYS[period];
    const cutoff = days ? new Date(now.getTime() - days * 86400000) : null;

    return posts
      .filter((p) => p.status === 'Published' && p.metrics)
      .filter((p) => {
        if (!cutoff) return true;
        const d = new Date(p.scheduled_date);
        return d >= cutoff;
      })
      .map((p) => ({ ...p, engagement: calcScore(p.metrics, weights) }));
  }, [posts, weights, period]);

  const avgEngagement = useMemo(() => {
    if (!filtered.length) return 0;
    return filtered.reduce((s, p) => s + p.engagement, 0) / filtered.length;
  }, [filtered]);

  const topPillar = useMemo(() => {
    if (!filtered.length) return '—';
    const byPillar = {};
    filtered.forEach((p) => {
      const k = p.content_pillar;
      if (!byPillar[k]) byPillar[k] = { sum: 0, count: 0 };
      byPillar[k].sum += p.engagement;
      byPillar[k].count += 1;
    });
    let best = null;
    let bestAvg = -1;
    for (const [k, v] of Object.entries(byPillar)) {
      const avg = v.sum / v.count;
      if (avg > bestAvg) { bestAvg = avg; best = k; }
    }
    return PILLAR_LABELS[best] || best || '—';
  }, [filtered]);

  // Chart data: engagement over time
  const lineData = useMemo(() => {
    return [...filtered]
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
      .map((p) => ({
        date: fmtDate(p.scheduled_date),
        fullDate: p.scheduled_date,
        title: p.title,
        engagement: p.engagement,
      }));
  }, [filtered]);

  // Bar chart: avg engagement by pillar
  const barData = useMemo(() => {
    const byPillar = {};
    filtered.forEach((p) => {
      const k = p.content_pillar;
      if (!byPillar[k]) byPillar[k] = { sum: 0, count: 0 };
      byPillar[k].sum += p.engagement;
      byPillar[k].count += 1;
    });
    return Object.entries(byPillar).map(([k, v]) => ({
      pillar: k,
      label: PILLAR_LABELS[k] || k,
      avg: Math.round(v.sum / v.count),
      count: v.count,
      color: PILLAR_COLORS[k] || '#888',
    })).sort((a, b) => b.avg - a.avg);
  }, [filtered]);

  // Sorted table data
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let av, bv;
      switch (sortCol) {
        case 'title': av = a.title || ''; bv = b.title || ''; break;
        case 'pillar': av = a.content_pillar || ''; bv = b.content_pillar || ''; break;
        case 'likes': av = a.metrics?.likes || 0; bv = b.metrics?.likes || 0; break;
        case 'comments': av = a.metrics?.comments || 0; bv = b.metrics?.comments || 0; break;
        case 'shares': av = a.metrics?.shares || 0; bv = b.metrics?.shares || 0; break;
        case 'date': av = a.scheduled_date || ''; bv = b.scheduled_date || ''; break;
        default: av = a.engagement; bv = b.engagement;
      }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return copy;
  }, [filtered, sortCol, sortDir]);

  // Top performer insight
  const topPerformer = useMemo(() => {
    if (!avgEngagement || !filtered.length) return null;
    const star = filtered.find((p) => p.engagement > 2 * avgEngagement);
    if (!star) return null;
    const factor = (star.engagement / avgEngagement).toFixed(1);
    return { title: star.title, factor };
  }, [filtered, avgEngagement]);

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Analytics</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[0, 1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Skeleton variant="rounded" height={100} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" height={300} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" height={300} /></Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Analytics</Typography>
        <ErrorBanner message={error} onRetry={load} />
      </Box>
    );
  }

  if (!filtered.length) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Analytics</Typography>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small">
            <ToggleButton value="7">7 days</ToggleButton>
            <ToggleButton value="30">30 days</ToggleButton>
            <ToggleButton value="90">90 days</ToggleButton>
            <ToggleButton value="all">All</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <EmptyState
          icon={<BarChartOutlined />}
          title="No published posts yet"
          description="Publish some posts to see engagement analytics here."
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Analytics</Typography>

      {/* Period Selector */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small">
          <ToggleButton value="7">7 days</ToggleButton>
          <ToggleButton value="30">30 days</ToggleButton>
          <ToggleButton value="90">90 days</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard icon={<ArticleOutlined />} label="Posts Published" value={filtered.length} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard icon={<TrendingUpOutlined />} label="Avg Engagement" value={Math.round(avgEngagement)} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Tooltip title="Requires follower count from JS snippet" arrow>
            <Box>
              <MetricCard icon={<PercentOutlined />} label="Engagement Rate" value="N/A" />
            </Box>
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard icon={<EmojiEventsOutlined />} label="Top Pillar" value={topPillar} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Engagement Over Time */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Engagement Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <Paper sx={{ p: 1.5 }}>
                        <Typography variant="caption" display="block">{d.date}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.title}</Typography>
                        <Typography variant="body2">Score: {d.engagement}</Typography>
                      </Paper>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#006a6a"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#006a6a' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* By Pillar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              By Pillar
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={110} />
                <RTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <Paper sx={{ p: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.label}</Typography>
                        <Typography variant="body2">Avg: {d.avg}</Typography>
                        <Typography variant="body2">Posts: {d.count}</Typography>
                      </Paper>
                    );
                  }}
                />
                <Bar dataKey="avg" radius={[0, 4, 4, 0]} label={{ position: 'insideLeft', fill: '#fff', fontSize: 12, formatter: (_, __, idx) => barData[idx]?.count ? `${barData[idx].count} posts` : '' }}>
                  {barData.map((d) => (
                    <Cell key={d.pillar} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights Banner */}
      {topPerformer && (
        <Alert severity="info" sx={{ mb: 4 }}>
          🔥 <strong>{topPerformer.title}</strong> is a top performer! {topPerformer.factor}× above average engagement.
        </Alert>
      )}

      {/* Post Rankings Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { id: 'title', label: 'Title' },
                { id: 'pillar', label: 'Pillar' },
                { id: 'engagement', label: 'Engagement Score' },
                { id: 'likes', label: 'Likes' },
                { id: 'comments', label: 'Comments' },
                { id: 'shares', label: 'Shares' },
                { id: 'date', label: 'Date' },
              ].map((col) => (
                <TableCell key={col.id} sortDirection={sortCol === col.id ? sortDir : false}>
                  <TableSortLabel
                    active={sortCol === col.id}
                    direction={sortCol === col.id ? sortDir : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((p, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </TableCell>
                <TableCell><PillarChip pillar={p.content_pillar} /></TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{p.engagement}</TableCell>
                <TableCell>{p.metrics?.likes ?? 0}</TableCell>
                <TableCell>{p.metrics?.comments ?? 0}</TableCell>
                <TableCell>{p.metrics?.shares ?? 0}</TableCell>
                <TableCell>{fmtDate(p.scheduled_date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
