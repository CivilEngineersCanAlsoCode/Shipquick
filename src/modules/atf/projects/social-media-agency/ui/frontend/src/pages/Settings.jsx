import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Slider,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useConfig, useSaveConfig } from '../api/client';

const FIBONACCI_MARKS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 8, label: '8' },
  { value: 13, label: '13' },
];

const TABS = ['Scoring', 'Schedule', 'Formatting', 'Engagement', 'Review', 'Analytics'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Settings() {
  const { data: configs, isLoading } = useConfig();
  const saveMutation = useSaveConfig();
  const [tab, setTab] = useState(0);
  const [localConfig, setLocalConfig] = useState({});
  const [snack, setSnack] = useState(null);

  useEffect(() => {
    if (configs) setLocalConfig(structuredClone(configs));
  }, [configs]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 20 }}><CircularProgress /></Box>;
  }

  const updateField = (configId, path, value) => {
    setLocalConfig((prev) => {
      const next = structuredClone(prev);
      const doc = next[configId] || (next[configId] = { data: {} });
      const keys = path.split('.');
      let obj = doc.data;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] || (obj[keys[i]] = {});
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async (configId) => {
    try {
      await saveMutation.mutateAsync({ configId, data: localConfig[configId]?.data });
      setSnack({ severity: 'success', message: 'Settings saved.' });
    } catch {
      setSnack({ severity: 'error', message: 'Save failed.' });
    }
  };

  const handleReset = () => {
    if (configs) setLocalConfig(structuredClone(configs));
    setSnack({ severity: 'info', message: 'Reset to saved values.' });
  };

  const scoring = localConfig?.scoring_weights?.data || {};
  const schedule = localConfig?.posting_schedule?.data || {};
  const formatting = localConfig?.formatting_config?.data || {};
  const engagement = localConfig?.engagement_config?.data || {};
  const review = localConfig?.review_config?.data || {};
  const analyticsConfig = localConfig?.analytics_config?.data || {};

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 6 }}>Settings</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 6 }}>
        {TABS.map((t) => <Tab key={t} label={t} />)}
      </Tabs>

      {/* Scoring */}
      {tab === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Scoring Weights</Typography>
            {[
              { key: 'freshness_weight', label: 'Freshness' },
              { key: 'personal_weight', label: 'Personal Experience' },
              { key: 'research_weight', label: 'Research Quality' },
            ].map(({ key, label }) => (
              <Box key={key} sx={{ mb: 6 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>{label}: {scoring[key] ?? 8}</Typography>
                <Slider
                  value={scoring[key] ?? 8}
                  onChange={(_, v) => updateField('scoring_weights', key, v)}
                  step={null}
                  marks={FIBONACCI_MARKS}
                  min={1}
                  max={13}
                />
              </Box>
            ))}

            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" sx={{ mb: 4 }}>Thresholds</Typography>
            {[
              { key: 'min_total', label: 'Minimum threshold' },
              { key: 'min_freshness', label: 'Min Freshness' },
              { key: 'min_personal', label: 'Min Personal Exp' },
              { key: 'min_research', label: 'Min Research' },
            ].map(({ key, label }) => (
              <TextField
                key={key}
                label={label}
                type="number"
                size="small"
                value={scoring[key] ?? ''}
                onChange={(e) => updateField('scoring_weights', key, Number(e.target.value))}
                sx={{ mr: 3, mb: 3, width: 180 }}
              />
            ))}

            <Box sx={{ display: 'flex', gap: 3, mt: 6 }}>
              <Button variant="contained" onClick={() => handleSave('scoring_weights')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Schedule */}
      {tab === 1 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Posting Schedule</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Active days</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {DAYS.map((day) => {
                const active = (schedule.active_days || []).includes(day);
                return (
                  <Chip
                    key={day}
                    label={day}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    onClick={() => {
                      const days = schedule.active_days || [];
                      const next = active ? days.filter((d) => d !== day) : [...days, day];
                      updateField('posting_schedule', 'active_days', next);
                    }}
                  />
                );
              })}
            </Box>
            <TextField
              label="Post time"
              type="time"
              size="small"
              value={schedule.post_time || '09:45'}
              onChange={(e) => updateField('posting_schedule', 'post_time', e.target.value)}
              sx={{ mr: 3, mb: 3 }}
            />
            <TextField
              label="Max posts/day"
              type="number"
              size="small"
              value={schedule.max_per_day ?? 1}
              onChange={(e) => updateField('posting_schedule', 'max_per_day', Number(e.target.value))}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <Button variant="contained" onClick={() => handleSave('posting_schedule')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Formatting */}
      {tab === 2 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Formatting Config</Typography>
            {[
              { key: 'max_chars', label: 'Max characters', type: 'number' },
              { key: 'max_emojis', label: 'Max emojis', type: 'number' },
              { key: 'max_hashtags', label: 'Max hashtags', type: 'number' },
              { key: 'max_hindi', label: 'Max Hindi words', type: 'number' },
            ].map(({ key, label, type }) => (
              <TextField
                key={key}
                label={label}
                type={type}
                size="small"
                value={formatting[key] ?? ''}
                onChange={(e) => updateField('formatting_config', key, Number(e.target.value))}
                sx={{ mr: 3, mb: 3, width: 180 }}
              />
            ))}
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <Button variant="contained" onClick={() => handleSave('formatting_config')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Engagement */}
      {tab === 3 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Engagement Config</Typography>
            <TextField
              label="Resurgence threshold %"
              type="number"
              size="small"
              value={engagement.resurgence_threshold ?? ''}
              onChange={(e) => updateField('engagement_config', 'resurgence_threshold', Number(e.target.value))}
              sx={{ mr: 3, mb: 3, width: 220 }}
            />
            <TextField
              label="Min engagement score"
              type="number"
              size="small"
              value={engagement.min_score ?? ''}
              onChange={(e) => updateField('engagement_config', 'min_score', Number(e.target.value))}
              sx={{ mb: 3, width: 220 }}
            />
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <Button variant="contained" onClick={() => handleSave('engagement_config')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Review */}
      {tab === 4 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Review Config</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={review.auto_approve ?? false}
                  onChange={(e) => updateField('review_config', 'auto_approve', e.target.checked)}
                />
              }
              label="Auto-approve posts that pass scoring"
            />
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <Button variant="contained" onClick={() => handleSave('review_config')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Analytics Config */}
      {tab === 5 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 4 }}>Analytics Config</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Collection day intervals</Typography>
            {[1, 3, 7, 14, 30].map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Switch
                    checked={(analyticsConfig.collection_days || []).includes(day)}
                    onChange={(e) => {
                      const days = analyticsConfig.collection_days || [];
                      const next = e.target.checked ? [...days, day].sort((a, b) => a - b) : days.filter((d) => d !== day);
                      updateField('analytics_config', 'collection_days', next);
                    }}
                  />
                }
                label={`Day ${day}`}
              />
            ))}
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <Button variant="contained" onClick={() => handleSave('analytics_config')} disabled={saveMutation.isPending}>Save</Button>
              <Button variant="outlined" onClick={handleReset}>Reset</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        {snack && <Alert severity={snack.severity} onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </Box>
  );
}
