import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { fetchPosts } from '../api';
import { STATUS_COLORS, STATUS_TEXT_COLORS } from '../theme';

const STATUS_ORDER = [
  'Scheduled_NoDraft',
  'Drafting',
  'Drafted',
  'Formatting',
  'Previewed',
  'Ready_ToPublish',
  'Published',
];

function formatStatus(s) {
  return s.replace(/_/g, ' ');
}

export default function Dashboard() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!posts || posts.length === 0) return <Alert severity="info" sx={{ mt: 4 }}>No posts found.</Alert>;

  // Group by status
  const statusCounts = {};
  for (const p of posts) {
    const s = p.status || 'Unknown';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  // Today's scheduled
  const today = new Date().toISOString().slice(0, 10);
  const todayPosts = posts.filter((p) => {
    const d = p.scheduled_date || p.publish_date || '';
    return d.startsWith(today);
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>Pipeline Overview</Typography>

      {/* Status chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
        {STATUS_ORDER.map((status) => {
          const count = statusCounts[status] || 0;
          return (
            <Chip
              key={status}
              label={`${formatStatus(status)}: ${count}`}
              sx={{
                bgcolor: STATUS_COLORS[status] || '#414941',
                color: STATUS_TEXT_COLORS[status] || '#E1E4DE',
                fontWeight: 500,
                fontSize: '0.85rem',
                px: 2,
                py: 1,
                height: 'auto',
              }}
            />
          );
        })}
      </Box>

      {/* Additional statuses not in the standard order */}
      {Object.keys(statusCounts)
        .filter((s) => !STATUS_ORDER.includes(s))
        .map((status) => (
          <Chip
            key={status}
            label={`${formatStatus(status)}: ${statusCounts[status]}`}
            sx={{ bgcolor: '#414941', color: '#C1C9BF', fontWeight: 500, mr: 2, mb: 2 }}
          />
        ))}

      {/* Today's scheduled */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Today&apos;s Scheduled ({todayPosts.length})
          </Typography>
          {todayPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No posts scheduled for today.</Typography>
          ) : (
            <List disablePadding>
              {todayPosts.map((post, i) => (
                <ListItem key={post.id || i} divider={i < todayPosts.length - 1}>
                  <ListItemText
                    primary={post.title || post.hook || post.content_pillar || 'Untitled'}
                    secondary={`${formatStatus(post.status)} · ${post.content_pillar || ''}`}
                  />
                  <Chip
                    size="small"
                    label={formatStatus(post.status)}
                    sx={{
                      bgcolor: STATUS_COLORS[post.status] || '#414941',
                      color: STATUS_TEXT_COLORS[post.status] || '#E1E4DE',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Summary stats */}
      <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Total Posts</Typography>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>{posts.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Published</Typography>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>{statusCounts['Published'] || 0}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">In Progress</Typography>
            <Typography variant="h4" sx={{ color: 'primary.main' }}>
              {(statusCounts['Drafting'] || 0) + (statusCounts['Formatting'] || 0) + (statusCounts['Previewed'] || 0)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
