import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReportForm from '../../components/ReportComponents/ReportForm';

export default function Report() {
  const { type, targetId } = useParams();
  const { content } = useSelector((state) => state.lang);

  const targetType = type === 'book' ? 'Book' : type === 'user' ? 'user' : null;

  if (!targetType || !targetId) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          p: 3,
        }}
      >
        <Typography color="error" variant="h6" align="center">
          {content.invalidReportTarget || 'Invalid report target.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <CardContent sx={{ p: 4 }}>
            <ReportForm targetType={targetType} targetId={targetId} />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
