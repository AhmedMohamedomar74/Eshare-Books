import { Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function ReportHeader() {
  const { content } = useSelector((state) => state.lang);

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
        {content.reportTitle || 'Report Inappropriate Content'}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          color: '#666',
          lineHeight: 1.6,
        }}
      >
        {content.reportDescription ||
          'Please select a reason and provide details below. Your feedback helps keep our community safe.'}
      </Typography>
    </Box>
  );
}
