import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserReports,
  cancelUserReport,
  clearReportMessage,
} from '../redux/slices/reportSlice.js';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Snackbar,
  Alert,
  Stack,
  Card,
  CardContent,
} from '@mui/material';

export default function MyReports() {
  const dispatch = useDispatch();
  const { reports, loading, successMessage, error } = useSelector((state) => state.reports);

  const [snackbar, setSnackbar] = useState({ open: false, msg: '', type: 'success' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) dispatch(getUserReports(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (successMessage) {
      setSnackbar({ open: true, msg: successMessage, type: 'success' });
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    } else if (error) {
      setSnackbar({ open: true, msg: error, type: 'error' });
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    }
  }, [successMessage, error, dispatch]);

  const handleCancel = (id) => {
    dispatch(cancelUserReport(id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Reports
      </Typography>

      {loading && <CircularProgress />}

      <Stack spacing={3}>
        {reports?.length > 0 ? (
          reports.map((report) => (
            <Card key={report._id} sx={{ borderRadius: '12px', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">{report.reason}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
                <Typography mt={1}>Status: {report.status}</Typography>

                {report.status === 'Pending' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancel(report._id)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Report
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No reports found.</Typography>
        )}
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
