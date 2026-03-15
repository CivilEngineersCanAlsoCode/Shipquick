import { n8nFetch, WEBHOOKS, fetchAllConfig, saveConfig } from '../api';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Slider,
  TextField,
  Switch,
  Button,
  Chip,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const FIB_MARKS = [1, 2, 3, 5, 8, 13].map((v) => ({ value: v, label: String(v) }));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CONFIG_KEYS = [
  'scoring_weights',
  'scoring_scales',
  'posting_schedule',
  'formatting_config',
  'engagement_config',
  'review_config',
  'analytics_config',
];

// ── Deep-equal helper ──────────────────────────────────────────────────
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

// ── Deep-clone helper ──────────────────────────────────────────────────
function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

// ── Tab panel wrapper ──────────────────────────────────────────────────
function TabPanel({ value, index, children }) {
  return value === index ? (
    <Box sx={{ maxWidth: 800, pt: 3 }}>{children}</Box>
  ) : null;
}

// ── Number field shorthand ─────────────────────────────────────────────
function NumField({ label, value, onChange, ...props }) {
  return (
    <TextField
      label={label}
      type="number"
      size="small"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      sx={{ minWidth: 140 }}
      {...props}
    />
  );
}

// ── Loading skeletons ──────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 800, pt: 3 }}>
      <Skeleton variant="rounded" height={40} />
      <Skeleton variant="rounded" height={56} />
      <Skeleton variant="rounded" height={56} />
      <Skeleton variant="rounded" height={56} />
      <Skeleton variant="rounded" height={40} />
      <Skeleton variant="rounded" height={56} />
    </Stack>
  );
}

// ── Error banner ───────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <Alert severity="error" sx={{ mt: 2 }} action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>
      {message}
    </Alert>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function Settings() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // original (from server) and draft (editable) configs
  const [original, setOriginal] = useState({});
  const [draft, setDraft] = useState({});

  // save UI
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState('');
  const [saveError, setSaveError] = useState(null);

  // ── Fetch all configs ──────────────────────────────────────────────
  const loadConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllConfig();
      const normalized = Array.isArray(data) ? data[0] : data;
      setOriginal(clone(normalized));
      setDraft(clone(normalized));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConfigs(); }, [loadConfigs]);

  // ── Dirty detection ────────────────────────────────────────────────
  const currentKey = CONFIG_KEYS[tab];
  const isDirty = useMemo(() => {
    if (!original[currentKey] || !draft[currentKey]) return false;
    return !deepEqual(original[currentKey], draft[currentKey]);
  }, [original, draft, currentKey]);

  // ── Generic updater ────────────────────────────────────────────────
  const update = useCallback((configKey, path, value) => {
    setDraft((prev) => {
      const next = clone(prev);
      let obj = next[configKey];
      const parts = path.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  // ── Save handler ───────────────────────────────────────────────────
  const handleSave = async () => {
    setConfirmOpen(false);
    setSaving(true);
    setSaveError(null);
    try {
      await n8nFetch(WEBHOOKS.SAVE_CONFIG, {
        config_id: currentKey,
        data: draft[currentKey],
      });
      setOriginal((prev) => ({ ...prev, [currentKey]: clone(draft[currentKey]) }));
      setSnack('Settings saved ✅');
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // shorthand
  const cfg = (key) => draft[key] || {};

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Settings</Typography>

      {error && <ErrorBanner message={error} onRetry={loadConfigs} />}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Scoring Weights" />
        <Tab label="Scoring Scales" />
        <Tab label="Schedule" />
        <Tab label="Formatting" />
        <Tab label="Engagement" />
        <Tab label="Review" />
        <Tab label="Analytics" />
      </Tabs>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? null : (
        <>
          {/* ── Tab 0: Scoring Weights ──────────────────────────── */}
          <TabPanel value={tab} index={0}>
            <ScoringWeightsTab cfg={cfg('scoring_weights')} update={(p, v) => update('scoring_weights', p, v)} />
          </TabPanel>

          {/* ── Tab 1: Scoring Scales ──────────────────────────── */}
          <TabPanel value={tab} index={1}>
            <ScoringScalesTab cfg={cfg('scoring_scales')} />
          </TabPanel>

          {/* ── Tab 2: Posting Schedule ─────────────────────────── */}
          <TabPanel value={tab} index={2}>
            <PostingScheduleTab cfg={cfg('posting_schedule')} update={(p, v) => update('posting_schedule', p, v)} />
          </TabPanel>

          {/* ── Tab 3: Formatting ──────────────────────────────── */}
          <TabPanel value={tab} index={3}>
            <FormattingTab cfg={cfg('formatting_config')} update={(p, v) => update('formatting_config', p, v)} />
          </TabPanel>

          {/* ── Tab 4: Engagement ──────────────────────────────── */}
          <TabPanel value={tab} index={4}>
            <EngagementTab cfg={cfg('engagement_config')} update={(p, v) => update('engagement_config', p, v)} />
          </TabPanel>

          {/* ── Tab 5: Review ──────────────────────────────────── */}
          <TabPanel value={tab} index={5}>
            <ReviewTab cfg={cfg('review_config')} update={(p, v) => update('review_config', p, v)} />
          </TabPanel>

          {/* ── Tab 6: Analytics ───────────────────────────────── */}
          <TabPanel value={tab} index={6}>
            <AnalyticsTab cfg={cfg('analytics_config')} update={(p, v) => update('analytics_config', p, v)} />
          </TabPanel>

          {/* ── Save bar ──────────────────────────────────────── */}
          {tab !== 1 && (
            <Box sx={{ maxWidth: 800, mt: 4 }}>
              {saveError && <ErrorBanner message={saveError} onRetry={handleSave} />}
              <Button
                variant="contained"
                disabled={!isDirty || saving}
                onClick={() => setConfirmOpen(true)}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* ── Confirm dialog ────────────────────────────────────── */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Save changes to <strong>{currentKey?.replace(/_/g, ' ')}</strong>?
          </Typography>
          <Box component="pre" sx={{ fontSize: 12, overflow: 'auto', maxHeight: 300, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            {JSON.stringify(draft[currentKey], null, 2)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ──────────────────────────────────────────── */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 0: Scoring Weights
// ═══════════════════════════════════════════════════════════════════════
function ScoringWeightsTab({ cfg, update }) {
  const w = cfg.weights || {};
  const t = cfg.thresholds || {};
  const indMin = t.individual_minimum || {};
  const fVal = w.freshness ?? 8;
  const pVal = w.personal_experience ?? 5;
  const rVal = w.research_quality ?? 3;
  const maxScore = fVal * 10 + pVal * 10 + rVal * 10;

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle2" color="text.secondary">
        Score = F×{fVal} + P×{pVal} + R×{rVal} &nbsp;(max {maxScore})
      </Typography>

      {[
        { label: 'Freshness (F)', key: 'freshness', val: fVal },
        { label: 'Personal Experience (P)', key: 'personal_experience', val: pVal },
        { label: 'Research Quality (R)', key: 'research_quality', val: rVal },
      ].map(({ label, key, val }) => (
        <Box key={key}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="body2">{label}</Typography>
            <Chip label={`FIB: ${val}`} size="small" color="primary" />
          </Stack>
          <Slider
            value={val}
            onChange={(_, v) => update('weights.' + key, v)}
            min={1}
            max={13}
            step={null}
            marks={FIB_MARKS}
            valueLabelDisplay="auto"
          />
        </Box>
      ))}

      <Typography variant="subtitle2" sx={{ mt: 2 }}>Thresholds</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <NumField label="Min Freshness" value={indMin.freshness ?? 5} onChange={(v) => update('thresholds.individual_minimum.freshness', v)} />
        <NumField label="Min Personal Exp" value={indMin.personal_experience ?? 3} onChange={(v) => update('thresholds.individual_minimum.personal_experience', v)} />
        <NumField label="Min Research" value={indMin.research_quality ?? 2} onChange={(v) => update('thresholds.individual_minimum.research_quality', v)} />
        <NumField label="Min Total %" value={t.total_minimum_percent ?? 50} onChange={(v) => update('thresholds.total_minimum_percent', v)} />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumField label="Top N" value={cfg.top_n ?? 3} onChange={(v) => update('top_n', v)} />
        <NumField label="Lookback Days" value={cfg.lookback_days ?? 14} onChange={(v) => update('lookback_days', v)} />
      </Stack>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 1: Scoring Scales (read-only)
// ═══════════════════════════════════════════════════════════════════════
function ScoringScalesTab({ cfg }) {
  const sections = [
    { title: 'Freshness Scale', key: 'freshness' },
    { title: 'Personal Experience Scale', key: 'personal_experience' },
    { title: 'Research Quality Scale', key: 'research_quality' },
  ];

  return (
    <Stack spacing={2}>
      {sections.map(({ title, key }) => {
        const rules = cfg[key] || [];
        return (
          <Accordion key={key} defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Array.isArray(rules) ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rules.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell><Typography variant="body2">{r.condition || r.description || JSON.stringify(r)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{r.score ?? r.value ?? '—'}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : typeof rules === 'object' ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Condition</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(rules).map(([cond, score]) => (
                      <TableRow key={cond}>
                        <TableCell><Typography variant="body2">{cond.replace(/_/g, ' ')}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{typeof score === 'object' ? JSON.stringify(score) : String(score)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">No rules configured.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        Scales are configured by the AI system. Contact admin to modify.
      </Typography>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 2: Posting Schedule
// ═══════════════════════════════════════════════════════════════════════
function PostingScheduleTab({ cfg, update }) {
  const dayPrefs = cfg.day_preferences || {};
  const activeDays = DAYS.filter((d) => dayPrefs[d.toLowerCase()] != null);

  const handleDayToggle = (_, newDays) => {
    const next = {};
    DAYS.forEach((d) => {
      const k = d.toLowerCase();
      if (newDays.includes(d)) {
        next[k] = dayPrefs[k] ?? 'general';
      } else {
        next[k] = null;
      }
    });
    update('day_preferences', next);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle2">Active Days</Typography>
      <ToggleButtonGroup value={activeDays} onChange={handleDayToggle} sx={{ flexWrap: 'wrap' }}>
        {DAYS.map((d, i) => (
          <ToggleButton key={d} value={d} sx={{ px: 2 }}>
            <Stack alignItems="center" spacing={0.5}>
              <span>{DAY_SHORT[i]}</span>
              {dayPrefs[d.toLowerCase()] != null && (
                <Typography variant="caption" sx={{ fontSize: 10, opacity: 0.7 }}>
                  {dayPrefs[d.toLowerCase()]}
                </Typography>
              )}
            </Stack>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <TextField
        label="Default Posting Time"
        type="time"
        size="small"
        value={cfg.default_posting_time || '09:00'}
        onChange={(e) => update('default_posting_time', e.target.value)}
        sx={{ maxWidth: 200 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        label="Timezone"
        size="small"
        value={cfg.timezone || ''}
        disabled
        sx={{ maxWidth: 300 }}
      />
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 3: Formatting
// ═══════════════════════════════════════════════════════════════════════
function FormattingTab({ cfg, update }) {
  const charLimits = cfg.character_limits || {};
  const refinement = cfg.refinement || {};
  const readability = cfg.readability || {};
  const hashtags = cfg.hashtags || {};

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle2">Character Limits</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Min" value={charLimits.min ?? ''} onChange={(v) => update('character_limits.min', v)} />
        <NumField label="Max" value={charLimits.max ?? ''} onChange={(v) => update('character_limits.max', v)} />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <NumField label="Max Emojis" value={cfg.max_emojis ?? ''} onChange={(v) => update('max_emojis', v)} />
        <NumField label="Max Hindi Sentences" value={cfg.max_hindi_sentences ?? ''} onChange={(v) => update('max_hindi_sentences', v)} />
        <NumField label="Max Lines per Block" value={cfg.max_lines_per_block ?? ''} onChange={(v) => update('max_lines_per_block', v)} />
      </Stack>

      <Typography variant="subtitle2">Refinement</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Max Iterations" value={refinement.max_iterations ?? ''} onChange={(v) => update('refinement.max_iterations', v)} />
        <NumField label="Warning Threshold" value={refinement.warning_threshold ?? ''} onChange={(v) => update('refinement.warning_threshold', v)} />
      </Stack>

      <Typography variant="subtitle2">Readability</Typography>
      <NumField label="FK Max Grade" value={readability.flesch_kincaid_max_grade ?? ''} onChange={(v) => update('readability.flesch_kincaid_max_grade', v)} />

      <Typography variant="subtitle2">Hashtags</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Min" value={hashtags.min ?? ''} onChange={(v) => update('hashtags.min', v)} />
        <NumField label="Max" value={hashtags.max ?? ''} onChange={(v) => update('hashtags.max', v)} />
      </Stack>

      <Typography variant="subtitle2">Switches</Typography>
      <Stack spacing={2}>
        <FormControl size="small" sx={{ maxWidth: 250 }}>
          <InputLabel>Staircase Direction</InputLabel>
          <Select
            label="Staircase Direction"
            value={cfg.staircase_direction || 'ascending'}
            onChange={(e) => update('staircase_direction', e.target.value)}
          >
            <MenuItem value="ascending">Ascending</MenuItem>
            <MenuItem value="descending">Descending</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={!!cfg.positioning_line_enabled} onChange={(e) => update('positioning_line_enabled', e.target.checked)} />}
          label="Positioning Line"
        />
        <FormControlLabel
          control={<Switch checked={!!cfg.follow_line_enabled} onChange={(e) => update('follow_line_enabled', e.target.checked)} />}
          label="Follow Line"
        />
      </Stack>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 4: Engagement
// ═══════════════════════════════════════════════════════════════════════
function EngagementTab({ cfg, update }) {
  const dup = cfg.duplicate_detection || {};
  const topPerf = cfg.top_performing || {};
  const engW = cfg.engagement_weights || {};

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle2">Duplicate Detection</Typography>
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>High Threshold: {dup.threshold_high ?? 0.9}</Typography>
        <Slider
          value={dup.threshold_high ?? 0.9}
          onChange={(_, v) => update('duplicate_detection.threshold_high', v)}
          min={0} max={1} step={0.05}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>Similar Threshold: {dup.threshold_similar ?? 0.7}</Typography>
        <Slider
          value={dup.threshold_similar ?? 0.7}
          onChange={(_, v) => update('duplicate_detection.threshold_similar', v)}
          min={0} max={1} step={0.05}
          valueLabelDisplay="auto"
        />
      </Box>

      <Typography variant="subtitle2">Top Performing Posts</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Posts Count" value={topPerf.posts_count ?? ''} onChange={(v) => update('top_performing.posts_count', v)} />
        <NumField label="Lookback Days" value={topPerf.lookback_days ?? ''} onChange={(v) => update('top_performing.lookback_days', v)} />
      </Stack>

      <Typography variant="subtitle2">Engagement Weights</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Likes" value={engW.likes ?? ''} onChange={(v) => update('engagement_weights.likes', v)} />
        <NumField label="Comments" value={engW.comments ?? ''} onChange={(v) => update('engagement_weights.comments', v)} />
        <NumField label="Shares" value={engW.shares ?? ''} onChange={(v) => update('engagement_weights.shares', v)} />
      </Stack>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 5: Review
// ═══════════════════════════════════════════════════════════════════════
function ReviewTab({ cfg, update }) {
  return (
    <Stack spacing={3}>
      <FormControlLabel
        control={
          <Switch
            checked={!!cfg.quality_checks_enabled}
            onChange={(e) => update('quality_checks_enabled', e.target.checked)}
          />
        }
        label="Quality Checks Enabled"
      />
      <FormControlLabel
        control={
          <Switch
            checked={!!cfg.auto_fix_enabled}
            onChange={(e) => update('auto_fix_enabled', e.target.checked)}
            disabled={!cfg.quality_checks_enabled}
          />
        }
        label="Auto-Fix Enabled"
      />
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB 6: Analytics
// ═══════════════════════════════════════════════════════════════════════
function AnalyticsTab({ cfg, update }) {
  const benchmarks = cfg.engagement_benchmarks || {};

  return (
    <Stack spacing={3}>
      <NumField label="No-Data Reminder (hours)" value={cfg.no_data_reminder_hours ?? ''} onChange={(v) => update('no_data_reminder_hours', v)} />
      <NumField label="Report Period (days)" value={cfg.report_period_days ?? ''} onChange={(v) => update('report_period_days', v)} />
      <NumField label="Top Posts in Report" value={cfg.top_posts_in_report ?? ''} onChange={(v) => update('top_posts_in_report', v)} />

      <Typography variant="subtitle2">Engagement Benchmarks</Typography>
      <Stack direction="row" spacing={2}>
        <NumField label="Likes" value={benchmarks.likes ?? ''} onChange={(v) => update('engagement_benchmarks.likes', v)} />
        <NumField label="Comments" value={benchmarks.comments ?? ''} onChange={(v) => update('engagement_benchmarks.comments', v)} />
      </Stack>
    </Stack>
  );
}
