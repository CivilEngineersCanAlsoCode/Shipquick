import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

import NavigationRail from './components/NavigationRail';
import TopAppBar from './components/TopAppBar';
import Dashboard from './pages/Dashboard';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isTablet = useMediaQuery('(max-width:1023px)');
  const railCollapsed = isTablet || collapsed;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopAppBar onMenuClick={() => setCollapsed((c) => !c)} />
      <Box sx={{ display: 'flex', flex: 1, pt: 16 }}>
        <NavigationRail
          collapsed={railCollapsed}
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            ml: railCollapsed ? '80px' : '256px',
            p: 6,
            maxWidth: 1200,
            transition: 'margin-left 0.2s',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => (prefersDark ? darkTheme : lightTheme), [prefersDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
