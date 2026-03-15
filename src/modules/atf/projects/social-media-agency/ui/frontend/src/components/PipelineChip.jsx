import React from 'react';
import { Chip } from '@mui/material';

const STATUS_STYLES = {
  Scheduled_NoDraft: { variant: 'outlined', color: 'default' },
  Drafting: { variant: 'filled', color: 'secondary' },
  Drafted: { variant: 'filled', color: 'secondary' },
  Formatting: { variant: 'filled', color: 'default' },
  Previewed: { variant: 'filled', color: 'default' },
  Ready_ToPublish: { variant: 'filled', color: 'primary' },
  Published: { variant: 'filled', color: 'success' },
  Publish_Failed: { variant: 'filled', color: 'error' },
  Cancelled: { variant: 'outlined', color: 'default' },
};

const STATUS_LABELS = {
  Scheduled_NoDraft: 'Scheduled',
  Drafting: 'Drafting',
  Drafted: 'Drafted',
  Formatting: 'Formatting',
  Previewed: 'Previewed',
  Ready_ToPublish: 'Ready',
  Published: 'Published',
  Publish_Failed: 'Failed',
  Cancelled: 'Cancelled',
};

export default function PipelineChip({ status, count, onClick, size = 'medium' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Scheduled_NoDraft;
  const label = count !== undefined ? `${STATUS_LABELS[status]} (${count})` : STATUS_LABELS[status];

  return (
    <Chip
      label={label}
      variant={style.variant}
      color={style.color}
      size={size}
      onClick={onClick}
      sx={{
        textDecoration: status === 'Cancelled' ? 'line-through' : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    />
  );
}
