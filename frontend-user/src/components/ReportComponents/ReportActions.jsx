import { Button, Box } from '@mui/material';

export default function ReportActions({ onCancel, onSend }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
      <Button
        onClick={onCancel}
        sx={{
          color: '#000',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 600,
          backgroundColor: '#f0f0f0',
          borderRadius: '6px',
          padding: '8px 24px',
          '&:hover': { backgroundColor: '#e0e0e0' },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSend}
        sx={{
          backgroundColor: '#2563eb',
          color: 'white',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 600,
          borderRadius: '6px',
          padding: '8px 24px',
          '&:hover': { backgroundColor: '#1d4ed8' },
        }}
      >
        Send Report
      </Button>
    </Box>
  );
}
