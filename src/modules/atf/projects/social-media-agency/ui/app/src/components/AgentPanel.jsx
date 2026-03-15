import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CircleIcon from '@mui/icons-material/Circle';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useAgentSocket from '../hooks/useAgentSocket';
import PromptSelector from './PromptSelector';

const STATUS_DOT = {
  connected: '#66bb6a',
  connecting: '#ffa726',
  disconnected: '#9e9e9e',
  error: '#d32f2f',
};

export default function AgentPanel({ open, onClose, initialPrompt, postContext }) {
  const { status, messages, isConnected, connect, disconnect, sendInput } = useAgentSocket();
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle prompt run (from PromptSelector)
  const handlePromptRun = async (prompt) => {
    try {
      const res = await fetch('http://localhost:3001/api/agent/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt),
      });
      const data = await res.json();
      const sid = data.sessionId || data.id;
      setSessionId(sid);
      connect(sid);
    } catch {
      // Show error in messages area
    }
  };

  // Run initial prompt if provided
  useEffect(() => {
    if (initialPrompt && open && !sessionId) {
      handlePromptRun(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendInput(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = () => {
    if (isConnected) {
      sendInput({ type: 'stop' });
    }
  };

  const handleClose = () => {
    disconnect();
    setSessionId(null);
    onClose();
  };

  const isRunning = isConnected && messages.length > 0 && !messages[messages.length - 1]?.done;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 420 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
        <SmartToyIcon color="primary" />
        <Chip label="Agent" size="small" color="primary" variant="outlined" />
        <CircleIcon sx={{ fontSize: 10, color: STATUS_DOT[status] || '#9e9e9e', ml: 0.5 }} />
        <Typography variant="caption" color="text.secondary">{status}</Typography>
        <IconButton onClick={handleClose} sx={{ ml: 'auto' }} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Prompt Selector (when no session) */}
      {!sessionId && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <PromptSelector onRun={handlePromptRun} postContext={postContext} />
        </Box>
      )}

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Select a prompt or type a message to start
            </Typography>
          </Box>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';

          return (
            <Box
              key={i}
              sx={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                bgcolor: isUser ? 'primary.main' : isSystem ? 'error.light' : 'action.hover',
                color: isUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              {isUser ? (
                <Typography variant="body2">{msg.text}</Typography>
              ) : (
                <Box
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    '& p': { m: 0, mb: 1 },
                    '& p:last-child': { mb: 0 },
                    '& pre': {
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      p: 1,
                      overflow: 'auto',
                      fontSize: '0.8rem',
                    },
                    '& code': {
                      bgcolor: 'background.default',
                      borderRadius: 0.5,
                      px: 0.5,
                      fontSize: '0.8rem',
                    },
                    '& pre code': { bgcolor: 'transparent', p: 0 },
                  }}
                >
                  <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
                </Box>
              )}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input Area */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <TextField
          size="small"
          fullWidth
          multiline
          maxRows={4}
          placeholder={sessionId ? 'Type a message...' : 'Start a session first'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!sessionId}
        />
        {isRunning ? (
          <IconButton color="error" onClick={handleStop} size="small">
            <StopIcon />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || !sessionId} size="small">
            <SendIcon />
          </IconButton>
        )}
      </Box>
    </Drawer>
  );
}
