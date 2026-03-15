import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Divider } from '@mui/material';

export default function LinkedInPreview({ content, title }) {
  if (!content) {
    return (
      <Card variant="outlined" sx={{ bgcolor: 'action.hover', minHeight: 200 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <Typography color="text.secondary">No content yet</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 520 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>S</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Satvik</Typography>
            <Typography variant="caption" color="text.secondary">Product Manager</Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
