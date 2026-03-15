import React, { Suspense, lazy, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Drawer, Fab, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import NavigationRail from './components/NavigationRail';
import TopAppBar from './components/TopAppBar';
import { AgentPanel } from './components';

const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Posts       = lazy(() => import('./pages/Posts'));
const PostDetail  = lazy(() => import('./pages/PostDetail'));
const Analytics   = lazy(() => import('./pages/Analytics'));
const Settings    = lazy(() => import('./pages/Settings'));

const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState(null);
  const [agentPostContext, setAgentPostContext] = useState(null);

  const openAgent = useCallback((prompt, postCtx) => {
    setAgentPrompt(prompt || null);
    setAgentPostContext(postCtx || null);
    setAgentOpen(true);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop: permanent NavigationRail */}
      {!isMobile && <NavigationRail />}

      {/* Mobile: temporary Drawer with NavigationRail inside */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 256 } }}
        >
          <NavigationRail />
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Mobile TopAppBar */}
        <TopAppBar onMenuClick={() => setMobileOpen(true)} />

        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3 },
            py: 3,
            mt: isMobile ? '64px' : 0,
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard openAgent={openAgent} />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail openAgent={openAgent} />} />
              <Route path="/analytics" element={<Analytics openAgent={openAgent} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
      {/* Agent FAB */}
      <Fab
        color="primary"
        onClick={() => openAgent()}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
      >
        <SmartToyIcon />
      </Fab>

      {/* Agent Panel */}
      <AgentPanel
        open={agentOpen}
        onClose={() => { setAgentOpen(false); setAgentPrompt(null); setAgentPostContext(null); }}
        initialPrompt={agentPrompt}
        postContext={agentPostContext}
      />
    </Box>
  );
}
