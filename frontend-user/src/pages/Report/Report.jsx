import { Box, Container, Card, CardContent } from '@mui/material';
import ReportForm from '../../components/ReportComponents/ReportForm';

export default function Report() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card
          sx={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <ReportForm />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
