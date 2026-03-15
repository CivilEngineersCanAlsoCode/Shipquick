import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Posts', path: '/posts', icon: <ArticleIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function NavigationRail({ collapsed, currentPath, onNavigate }) {
  const width = collapsed ? 80 : 256;

  return (
    <Box
      component="nav"
      sx={{
        width,
        minWidth: width,
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        bgcolor: (t) => t.palette.m3?.surfaceContainer || t.palette.background.paper,
        borderRight: 1,
        borderColor: 'divider',
        transition: 'width 0.2s',
        overflow: 'hidden',
        zIndex: 1100,
      }}
    >
      <List sx={{ pt: 4 }}>
        {NAV_ITEMS.map((item) => {
          const active = currentPath.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => onNavigate(item.path)}
              sx={{
                mx: collapsed ? 1 : 2,
                mb: 1,
                borderRadius: 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'subtitle1' }} />}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
