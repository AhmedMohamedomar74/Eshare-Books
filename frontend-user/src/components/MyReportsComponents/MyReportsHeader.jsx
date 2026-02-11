import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';

export default function MyReportsHeader() {
  const { content } = useSelector((state) => state.lang);

  return (
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
      {content.mySubmittedReports || 'My Submitted Reports'}
    </Typography>
  );
}
