import { Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function ReportActions({ onCancel, onSend, loading }) {
  const { content } = useSelector((state) => state.lang);

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
      <Button
        onClick={onCancel}
        disabled={loading}
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
        {content.cancel || 'Cancel'}
      </Button>
      <Button
        onClick={onSend}
        disabled={loading}
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
        {loading ? content.sending || 'Sending...' : content.sendReport || 'Send Report'}
      </Button>
    </Box>
  );
}
