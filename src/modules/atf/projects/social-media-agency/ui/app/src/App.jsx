import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';

import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Settings from './pages/Settings';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Posts', icon: <ArticleIcon />, path: '/posts' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');

  const currentTab = NAV_ITEMS.findIndex((item) => item.path === location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
            SMA Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, mt: 16, mb: isMobile ? 16 : 0, px: { xs: 4, sm: 6 }, py: 4, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      {isMobile ? (
        <BottomNavigation
          value={currentTab === -1 ? 0 : currentTab}
          onChange={(_, idx) => navigate(NAV_ITEMS[idx].path)}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}
        >
          {NAV_ITEMS.map((item) => (
            <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      ) : (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            width: 80,
            height: 'calc(100vh - 64px)',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 4,
            gap: 2,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === location.pathname;
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': { bgcolor: isActive ? 'primary.main' : 'action.hover' },
                  transition: 'all 0.2s',
                  width: 64,
                }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ mt: 1, fontSize: '0.65rem' }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Push main content right on desktop to clear side rail */}
      <style>{`
        @media (min-width: 769px) {
          main { margin-left: 80px !important; }
        }
      `}</style>
    </Box>
  );
}
