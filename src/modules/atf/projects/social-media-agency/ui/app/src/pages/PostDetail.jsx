import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PostDetail() {
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/posts')}
        sx={{ mb: 2 }}
      >
        Back to Posts
      </Button>
      <Typography variant="h4">Post Detail</Typography>
    </Box>
  );
}
