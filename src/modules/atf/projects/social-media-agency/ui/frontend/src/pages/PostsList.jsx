import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  InputAdornment,
  Fab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { usePosts } from '../api/client';
import PostCard from '../components/PostCard';

const STATUSES = [
  'All',
  'Scheduled_NoDraft',
  'Drafting',
  'Drafted',
  'Formatting',
  'Previewed',
  'Ready_ToPublish',
  'Published',
  'Publish_Failed',
  'Cancelled',
];

const STATUS_LABELS = {
  All: 'All',
  Scheduled_NoDraft: 'Scheduled',
  Drafting: 'Drafting',
  Drafted: 'Drafted',
  Formatting: 'Formatting',
  Previewed: 'Previewed',
  Ready_ToPublish: 'Ready',
  Published: 'Published',
  Publish_Failed: 'Failed',
  Cancelled: 'Cancelled',
};

export default function PostsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('scheduled_date');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filters = {
    ...(status !== 'All' && { status }),
    sort,
    page,
    ...(search && { q: search }),
  };

  const { data, isLoading } = usePosts(filters);
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  const handleAction = (action, id) => {
    if (action === 'review' || action === 'draft') navigate(`/posts/${id}`);
    if (action === 'analytics') navigate(`/analytics`);
    if (action === 'publish') navigate(`/posts/${id}`);
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 6 }}>Posts</Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, v) => { if (v) { setStatus(v); setPage(1); } }}
          size="small"
          sx={{ flexWrap: 'wrap' }}
        >
          {STATUSES.map((s) => (
            <ToggleButton key={s} value={s} sx={{ textTransform: 'none', px: 3 }}>
              {STATUS_LABELS[s]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
        <TextField
          size="small"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="scheduled_date">Scheduled Date</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="score">Score</MenuItem>
            <MenuItem value="engagement">Engagement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Posts */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box>
      ) : posts.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', pt: 10 }}>No posts found</Typography>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onAction={handleAction}
              onClick={() => navigate(`/posts/${post._id}`)}
            />
          ))}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
            </Box>
          )}
        </>
      )}

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
    </Box>
  );
}
