import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TelegramIcon from '@mui/icons-material/Telegram';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 256;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon />, activeIcon: <DashboardIcon /> },
  { label: 'Posts',     path: '/posts',     icon: <ArticleOutlinedIcon />,   activeIcon: <ArticleIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsOutlinedIcon />, activeIcon: <AnalyticsIcon /> },
  { label: 'Settings',  path: '/settings',  icon: <SettingsOutlinedIcon />,  activeIcon: <SettingsIcon /> },
];

const EXTERNAL_LINKS = [
  { label: 'ChatGPT', href: 'https://chat.openai.com', icon: <OpenInNewIcon /> },
  { label: 'Telegram', href: 'https://web.telegram.org', icon: <TelegramIcon /> },
];

export default function NavigationRail() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { mode, setMode } = useColorScheme();

  const width = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const toggleDarkMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          transition: 'width 200ms ease',
          overflowX: 'hidden',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: expanded ? 'flex-start' : 'center', px: 2, py: 2.5, minHeight: 64 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}
        >
          {expanded ? 'LinkRight' : 'LR'}
        </Typography>
      </Box>

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/posts' && location.pathname.startsWith('/posts/'));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  justifyContent: expanded ? 'flex-start' : 'center',
                  px: expanded ? 2 : 1,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: expanded ? 40 : 'unset',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                {expanded && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 1 }} />

      {/* External links */}
      <List sx={{ px: 1 }}>
        {EXTERNAL_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minHeight: 44,
                borderRadius: 2,
                justifyContent: expanded ? 'flex-start' : 'center',
                px: expanded ? 2 : 1,
                color: 'text.secondary',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: expanded ? 40 : 'unset',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {link.icon}
              </ListItemIcon>
              {expanded && (
                <ListItemText
                  primary={`${link.label} ↗`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Dark mode toggle */}
      <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center' }}>
        <IconButton onClick={toggleDarkMode} color="inherit" size="small">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
}
