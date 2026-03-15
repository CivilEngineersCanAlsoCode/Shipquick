import { useState } from 'react';
import { Alert, Button, Collapse } from '@mui/material';

export default function ErrorBanner({ message, onRetry }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <Alert
        severity="error"
        onClose={() => setOpen(false)}
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
}
