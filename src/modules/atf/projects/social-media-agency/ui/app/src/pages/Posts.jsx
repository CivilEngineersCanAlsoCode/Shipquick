import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchPosts } from '../api';
import { STATUS_COLORS, STATUS_TEXT_COLORS } from '../theme';

const FILTER_TABS = ['All', 'Drafting', 'Previewed', 'Published'];

function formatStatus(s) {
  return (s || '').replace(/_/g, ' ');
}

export default function Posts() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!posts || posts.length === 0) return <Alert severity="info" sx={{ mt: 4 }}>No posts found.</Alert>;

  const filterLabel = FILTER_TABS[tab];
  const filtered = filterLabel === 'All'
    ? posts
    : posts.filter((p) => (p.status || '').toLowerCase().includes(filterLabel.toLowerCase()));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>Posts</Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => { setTab(v); setExpanded(null); }}
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        {FILTER_TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing {filtered.length} post{filtered.length !== 1 ? 's' : ''}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((post, i) => {
          const id = post.id || i;
          const isExpanded = expanded === id;
          return (
            <Card key={id} variant="outlined">
              <CardActionArea onClick={() => setExpanded(isExpanded ? null : id)}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap>
                      {post.title || post.hook || post.content_pillar || 'Untitled'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.scheduled_date || post.publish_date || 'No date'}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={formatStatus(post.status)}
                    sx={{
                      bgcolor: STATUS_COLORS[post.status] || '#414941',
                      color: STATUS_TEXT_COLORS[post.status] || '#E1E4DE',
                      flexShrink: 0,
                    }}
                  />
                  {post.content_pillar && (
                    <Chip size="small" label={post.content_pillar} variant="outlined" sx={{ flexShrink: 0 }} />
                  )}
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </CardContent>
              </CardActionArea>
              <Collapse in={isExpanded}>
                <CardContent sx={{ pt: 0, bgcolor: 'background.default' }}>
                  {post.hook && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Hook</Typography>
                      <Typography variant="body2">{post.hook}</Typography>
                    </Box>
                  )}
                  {post.body && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Body</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{post.body}</Typography>
                    </Box>
                  )}
                  {post.cta && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">CTA</Typography>
                      <Typography variant="body2">{post.cta}</Typography>
                    </Box>
                  )}
                  {post.score != null && (
                    <Typography variant="body2" color="text.secondary">Score: {post.score}</Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
