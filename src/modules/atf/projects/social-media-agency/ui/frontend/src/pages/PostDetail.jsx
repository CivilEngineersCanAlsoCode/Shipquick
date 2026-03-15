import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { usePost, useUpdatePost, usePublishPost } from '../api/client';
import PipelineChip from '../components/PipelineChip';
import ScoreBreakdown from '../components/ScoreBreakdown';
import LinkedInPreview from '../components/LinkedInPreview';

const PIPELINE_STEPS = [
  'Scheduled_NoDraft',
  'Drafting',
  'Drafted',
  'Formatting',
  'Previewed',
  'Ready_ToPublish',
  'Published',
];

const STEP_LABELS = ['Scheduled', 'Drafting', 'Drafted', 'Formatting', 'Previewed', 'Ready', 'Published'];

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id);
  const updateMutation = useUpdatePost();
  const publishMutation = usePublishPost();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [snack, setSnack] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  if (isLoading || !post) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 20 }}><CircularProgress /></Box>;
  }

  const activeStep = PIPELINE_STEPS.indexOf(post.status);

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(post._id);
      setSnack({ severity: 'success', message: 'Published!' });
    } catch {
      setSnack({ severity: 'error', message: 'Publish failed.' });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateMutation.mutateAsync({ id: post._id, data: { content: editContent } });
      setEditing(false);
      setSnack({ severity: 'success', message: 'Content saved.' });
    } catch {
      setSnack({ severity: 'error', message: 'Save failed.' });
    }
  };

  const handleStatusChange = async (newStatus) => {
    setMenuAnchor(null);
    try {
      await updateMutation.mutateAsync({ id: post._id, data: { status: newStatus } });
      setSnack({ severity: 'success', message: `Status changed to ${newStatus}` });
    } catch {
      setSnack({ severity: 'error', message: 'Status change failed.' });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate('/posts')}><ArrowBackIcon /></IconButton>
        <Typography variant="h1" sx={{ flex: 1 }}>{post.title}</Typography>
        {!editing && (
          <Button variant="outlined" onClick={() => { setEditContent(post.content || ''); setEditing(true); }}>
            Edit
          </Button>
        )}
        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}><MoreVertIcon /></IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {post.status === 'Ready_ToPublish' && <MenuItem onClick={handlePublish}>Publish</MenuItem>}
          {post.status !== 'Cancelled' && <MenuItem onClick={() => handleStatusChange('Cancelled')}>Cancel</MenuItem>}
        </Menu>
      </Box>

      {/* Status Stepper */}
      <Card variant="outlined" sx={{ mb: 6 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEP_LABELS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Split view: Metadata + Preview */}
      <Box sx={{ display: 'flex', gap: 6, mb: 6, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Metadata */}
        <Card variant="outlined" sx={{ flex: '1 1 340px' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MetaRow label="Status"><PipelineChip status={post.status} size="small" /></MetaRow>
              <MetaRow label="Pillar">{post.pillar}</MetaRow>
              <MetaRow label="Scheduled">{post.scheduled_date}</MetaRow>
              {post.hook_type && <MetaRow label="Hook">{post.hook_type}</MetaRow>}
              {post.narrative_type && <MetaRow label="Narrative">{post.narrative_type}</MetaRow>}
              {post.cta_type && <MetaRow label="CTA">{post.cta_type}</MetaRow>}
              {post.tone && <MetaRow label="Tone">{post.tone}</MetaRow>}
              {post.char_count != null && <MetaRow label="Characters">{post.char_count.toLocaleString()}</MetaRow>}
              {post.fk_grade != null && <MetaRow label="FK Grade">{post.fk_grade}</MetaRow>}
              {post.emoji_count != null && <MetaRow label="Emojis">{post.emoji_count}</MetaRow>}
              {post.hashtag_count != null && <MetaRow label="Hashtags">{post.hashtag_count}</MetaRow>}
              {post.hindi_count != null && <MetaRow label="Hindi words">{post.hindi_count}</MetaRow>}
              {post.experience && (
                <MetaRow label="Experience">
                  "{post.experience.text}" (sim: {post.experience.similarity})
                </MetaRow>
              )}
            </Box>
            <Divider sx={{ my: 4 }} />
            <ScoreBreakdown score={post.score} />
          </CardContent>
        </Card>

        {/* Preview / Editor */}
        <Box sx={{ flex: '1 1 400px' }}>
          {editing ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Edit Content</Typography>
                <TextField
                  multiline
                  minRows={12}
                  maxRows={24}
                  fullWidth
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button variant="contained" onClick={handleSaveEdit} disabled={updateMutation.isPending}>Save</Button>
                  <Button variant="outlined" onClick={() => setEditing(false)}>Cancel</Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>LinkedIn Preview</Typography>
              <LinkedInPreview content={post.content} title={post.title} />
            </>
          )}
        </Box>
      </Box>

      {/* History */}
      {post.history && post.history.length > 0 && (
        <Card variant="outlined" sx={{ mb: 6 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>History</Typography>
            {post.history
              .slice()
              .reverse()
              .map((entry, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 3, py: 1.5, borderBottom: i < post.history.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 140 }}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Status → {entry.status} ({entry.source}){entry.note && ` — ${entry.note}`}
                  </Typography>
                </Box>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Engagement table */}
      {post.metrics_history && post.metrics_history.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>Engagement</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  <TableCell align="right">Likes</TableCell>
                  <TableCell align="right">Comments</TableCell>
                  <TableCell align="right">Shares</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {post.metrics_history.map((m) => (
                  <TableRow key={m.day}>
                    <TableCell>Day {m.day}</TableCell>
                    <TableCell align="right">{m.likes}</TableCell>
                    <TableCell align="right">{m.comments}</TableCell>
                    <TableCell align="right">{m.shares}</TableCell>
                    <TableCell align="right">{m.engagement_score}</TableCell>
                    <TableCell align="right">{(m.engagement_rate * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
        {snack && <Alert severity={snack.severity} onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </Box>
  );
}

function MetaRow({ label, children }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{children}</Typography>
    </Box>
  );
}
