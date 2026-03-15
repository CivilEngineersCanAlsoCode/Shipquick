import { Box, Button, Typography } from '@mui/material';

export default function EmptyState({ icon, title, description, actionLabel, onAction, actionHref }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, px: 4, textAlign: 'center' }}>
      <Box sx={{ color: 'text.secondary', opacity: 0.5, mb: 4, '& .MuiSvgIcon-root': { fontSize: 64 } }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {actionLabel && actionHref && !onAction && (
        <Button variant="outlined" href={actionHref} target="_blank" rel="noopener noreferrer">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
