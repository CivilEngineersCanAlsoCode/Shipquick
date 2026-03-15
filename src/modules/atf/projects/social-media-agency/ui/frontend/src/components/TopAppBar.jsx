import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function TopAppBar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: (t) => t.palette.m3?.surfaceContainerHighest || t.palette.background.paper,
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        height: 64,
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ height: 64 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 500 }}>
          LinkRight SMA
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
