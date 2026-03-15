import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAnalytics } from '../api/client';
import { CHART_COLORS } from '../theme';

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('7d');
  const { data, isLoading, refetch } = useAnalytics(period);

  const isDark = document.documentElement.style.colorScheme === 'dark'; // simplified
  const colors = isDark ? CHART_COLORS.dark : CHART_COLORS.light;

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 20 }}><CircularProgress /></Box>;
  }

  const overview = data?.overview || {};
  const engagementData = data?.engagementOverTime || [];
  const byPillar = data?.byPillar || [];
  const byFramework = data?.byFramework || [];
  const posts = data?.posts || [];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
        <Typography variant="h1" sx={{ flex: 1 }}>Analytics</Typography>
        <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={() => refetch()}><RefreshIcon /></IconButton>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 6, flexWrap: 'wrap' }}>
        {[
          { label: 'Posts published', value: overview.postsPublished ?? '--', delta: overview.postsDelta },
          { label: 'Avg engagement', value: overview.avgEngagement ?? '--', delta: overview.engDelta },
          { label: 'Avg rate', value: overview.avgRate ? `${overview.avgRate}%` : '--', delta: overview.rateDelta },
          { label: 'Top pillar', value: overview.topPillar ?? '--' },
        ].map((card) => (
          <Card
            key={card.label}
            sx={{ flex: '1 1 200px', bgcolor: (t) => t.palette.m3?.surfaceContainerHighest || t.palette.action.hover }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2">{card.value}</Typography>
              {card.delta && (
                <Typography variant="caption" color={card.delta.startsWith('+') ? 'success.main' : 'error.main'}>
                  {card.delta}
                </Typography>
              )}
              <Typography variant="overline" color="text.secondary" display="block">{card.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Engagement Chart */}
      <Card variant="outlined" sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Engagement Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke={colors.primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* By Pillar + By Framework */}
      <Box sx={{ display: 'flex', gap: 6, mb: 6, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>By Pillar</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byPillar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="engagement" fill={colors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>By Framework</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byFramework} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="engagement" fill={colors.pillar3} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Post Rankings */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Post Rankings</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Post</TableCell>
                <TableCell align="right">Engagement</TableCell>
                <TableCell align="right">Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, i) => (
                <TableRow
                  key={post._id || i}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => post._id && navigate(`/posts/${post._id}`)}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell align="right">{post.engagement ?? '--'}</TableCell>
                  <TableCell align="right">{post.rate ? `${post.rate}%` : '--'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
