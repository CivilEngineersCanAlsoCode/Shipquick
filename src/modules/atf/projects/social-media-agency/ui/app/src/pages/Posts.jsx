import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Skeleton,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { PostCard, EmptyState, ErrorBanner } from '../components';
import { fetchPosts } from '../api';

const ACTIVE_STATUSES = new Set([
  'Scheduled_NoDraft', 'Drafting', 'Drafted', 'Formatting', 'Previewed', 'Ready_ToPublish',
]);
const CANCELLED_STATUSES = new Set(['Cancelled', 'Publish_Failed']);
const PER_PAGE = 12;

function pseudoId(title) {
  return btoa(title || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
}

export default function Posts() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPosts()
      .then((data) => {
        const enriched = (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          _id: pseudoId(p.title),
        }));
        setPosts(enriched);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    let list = posts;

    // Status filter
    if (filter === 'Active') list = list.filter((p) => ACTIVE_STATUSES.has(p.status));
    else if (filter === 'Published') list = list.filter((p) => p.status === 'Published');
    else if (filter === 'Cancelled') list = list.filter((p) => CANCELLED_STATUSES.has(p.status));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => (p.title || '').toLowerCase().includes(q));
    }

    // Sort
    if (sort === 'newest') {
      list = [...list].sort((a, b) => new Date(b.scheduled_date || 0) - new Date(a.scheduled_date || 0));
    } else if (sort === 'oldest') {
      list = [...list].sort((a, b) => new Date(a.scheduled_date || 0) - new Date(b.scheduled_date || 0));
    } else if (sort === 'score') {
      list = [...list].sort((a, b) => {
        const sa = a.metrics ? (a.metrics.likes || 0) + (a.metrics.comments || 0) * 3 + (a.metrics.shares || 0) * 2 : 0;
        const sb = b.metrics ? (b.metrics.likes || 0) + (b.metrics.comments || 0) * 3 + (b.metrics.shares || 0) * 2 : 0;
        return sb - sa;
      });
    }

    return list;
  }, [posts, filter, search, sort]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filter, search, sort]);

  // Loading skeletons
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Posts</Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Error
  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Posts</Typography>
        <ErrorBanner message={error} onRetry={load} />
      </Box>
    );
  }

  // Empty (no posts at all)
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Posts</Typography>
        <EmptyState
          icon={ArticleOutlinedIcon}
          title="No posts yet"
          description="Create your first LinkedIn post to get started."
          actionLabel="Open ChatGPT"
          actionHref="https://chat.openai.com"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>Posts</Typography>

      {/* Filter bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small"
        >
          {['All', 'Active', 'Published', 'Cancelled'].map((f) => (
            <ToggleButton key={f} value={f}>{f}</ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField
          size="small"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="score">Engagement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Result count */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Showing {paged.length} of {filtered.length} posts
      </Typography>

      {/* Filtered empty */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No posts match your filters"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          {/* Post cards grid */}
          <Grid container spacing={3}>
            {paged.map((post) => (
              <Grid key={post._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
