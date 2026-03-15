import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
import { fetchConfig } from '../api';

export default function Settings() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig()
      .then((data) => setConfig(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!config) return <Alert severity="info" sx={{ mt: 4 }}>No configuration found.</Alert>;

  // Handle both single object and array responses
  const cfg = Array.isArray(config) ? config[0] : config;
  if (!cfg) return <Alert severity="info" sx={{ mt: 4 }}>No configuration found.</Alert>;

  const scoringWeights = cfg.scoring_weights || cfg.scoringWeights || {};
  const postingSchedule = cfg.posting_schedule || cfg.postingSchedule || {};
  const pillarWeights = cfg.pillar_weights || cfg.pillarWeights || cfg.content_pillars || {};

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>Settings</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Configuration is read-only in MVP. Edit via n8n workflows.
      </Typography>

      {/* Scoring Weights */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Scoring Weights</Typography>
          {Object.keys(scoringWeights).length === 0 ? (
            <Typography variant="body2" color="text.secondary">No scoring weights configured.</Typography>
          ) : (
            <Table size="small">
              <TableBody>
                {Object.entries(scoringWeights).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ border: 0, pl: 0 }}>
                      <Typography variant="body2">{key.replace(/_/g, ' ')}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 0 }} align="right">
                      <Chip size="small" label={typeof value === 'number' ? value.toFixed(2) : String(value)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Posting Schedule */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Posting Schedule</Typography>
          {Object.keys(postingSchedule).length === 0 ? (
            <Typography variant="body2" color="text.secondary">No schedule configured.</Typography>
          ) : (
            <Table size="small">
              <TableBody>
                {Object.entries(postingSchedule).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ border: 0, pl: 0 }}>
                      <Typography variant="body2">{key.replace(/_/g, ' ')}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 0 }} align="right">
                      <Typography variant="body2" color="text.secondary">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pillar Weights */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Content Pillars</Typography>
          {Object.keys(pillarWeights).length === 0 ? (
            <Typography variant="body2" color="text.secondary">No pillars configured.</Typography>
          ) : (
            <Table size="small">
              <TableBody>
                {Object.entries(pillarWeights).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ border: 0, pl: 0 }}>
                      <Typography variant="body2">{key.replace(/_/g, ' ')}</Typography>
                    </TableCell>
                    <TableCell sx={{ border: 0 }} align="right">
                      <Chip
                        size="small"
                        label={typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value)}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
