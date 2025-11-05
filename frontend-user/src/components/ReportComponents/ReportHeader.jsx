// components/Report/ReportHeader.jsx
import { Typography, Box } from '@mui/material';

export default function ReportHeader() {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#000',
          mb: 2,
        }}
      >
        Report Inappropriate Content
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#666',
          lineHeight: 1.6,
        }}
      >
        Please select a reason and provide details below. Your feedback helps keep our community
        safe.
      </Typography>
    </Box>
  );
}
