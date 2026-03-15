import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const PROMPTS = [
  { id: 'planContent', label: 'Plan This Week\'s Content', stage: 'A-Ideation', needsPost: false },
  { id: 'draftPost', label: 'Draft Selected Post', stage: 'B-Drafting', needsPost: true },
  { id: 'formatPost', label: 'Format Post', stage: 'F-Formatting', needsPost: true },
  { id: 'reviewPending', label: 'Review All Pending', stage: 'C-Review', needsPost: false },
  { id: 'analyzePerformance', label: 'Analyze Performance', stage: 'E-Analytics', needsPost: false },
  { id: 'publishPost', label: 'Publish Post', stage: 'D-Publishing', needsPost: true },
];

export const PROMPT_MAP = Object.fromEntries(PROMPTS.map((p) => [p.id, p]));

export default function PromptSelector({ onRun, postContext, disabled }) {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [agent, setAgent] = useState('claude');
  const [customPrompt, setCustomPrompt] = useState('');

  const selected = PROMPTS.find((p) => p.id === selectedPrompt);
  const needsPost = selected?.needsPost && !postContext;

  const handleRun = () => {
    const prompt = selectedPrompt
      ? { promptId: selectedPrompt, label: selected.label, agent, postContext }
      : { promptId: 'custom', label: 'Custom', agent, customText: customPrompt, postContext };

    if (onRun) onRun(prompt);
  };

  const canRun = !disabled && (selectedPrompt || customPrompt.trim()) && !needsPost;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl size="small" fullWidth>
        <InputLabel>Prompt Template</InputLabel>
        <Select
          value={selectedPrompt}
          label="Prompt Template"
          onChange={(e) => setSelectedPrompt(e.target.value)}
        >
          <MenuItem value="">
            <em>Custom prompt</em>
          </MenuItem>
          {PROMPTS.map((p) => (
            <MenuItem key={p.id} value={p.id} disabled={p.needsPost && !postContext}>
              {p.label} ({p.stage})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {needsPost && (
        <Typography variant="caption" color="warning.main">
          This prompt requires a post context. Open from a post detail page.
        </Typography>
      )}

      {!selectedPrompt && (
        <TextField
          size="small"
          multiline
          minRows={2}
          maxRows={4}
          placeholder="Type a custom prompt..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          fullWidth
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ToggleButtonGroup
          value={agent}
          exclusive
          onChange={(_, v) => v && setAgent(v)}
          size="small"
        >
          <ToggleButton value="claude">Claude</ToggleButton>
          <ToggleButton value="gemini">Gemini</ToggleButton>
          <ToggleButton value="opencode">OpenCode</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon />}
          onClick={handleRun}
          disabled={!canRun}
          sx={{ ml: 'auto' }}
        >
          Run
        </Button>
      </Box>
    </Box>
  );
}
