import { useState, useEffect } from 'react';
import { Stack, Box, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReportHeader from './ReportHeader';
import ReportReasonSelect from './ReportReasonSelect';
import ReportDescriptionField from './ReportDescriptionField';
import ReportActions from './ReportActions';
import { createNewReport, clearReportMessage } from '../../redux/slices/report.slice.js';

export default function ReportForm({ targetType, targetId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage, error } = useSelector((state) => state.reports);

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setErrors((prev) => ({ ...prev, reason: '' }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setErrors((prev) => ({ ...prev, description: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!reason) newErrors.reason = 'Please select a reason for reporting.';
    if (description.length > 500)
      newErrors.description = 'Description cannot exceed 500 characters.';
    return newErrors;
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSendReport = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reportData = {
      targetType,
      targetId,
      reason,
      description: description || '',
    };

    dispatch(createNewReport(reportData));
  };

  useEffect(() => {
    if (successMessage) {
      setSnackbarType('success');
      setSnackbarMsg('Report sent successfully! It will be reviewed shortly.');
      setOpenSnackbar(true);
      setReason('');
      setDescription('');

      // Navigate to previous page after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearReportMessage());
        navigate(-1);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (error) {
      let userFriendlyError = 'Failed to send report. Please try again.';

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          userFriendlyError = 'You have already submitted this exact report.';
        } else if (status === 403) {
          userFriendlyError = 'You cannot report yourself.';
        } else if (status === 404) {
          userFriendlyError = 'Book or user not found.';
        } else if (status === 500) {
          userFriendlyError = 'Server error. Please try again later.';
        }
      }

      setSnackbarType('error');
      setSnackbarMsg(userFriendlyError);
      setOpenSnackbar(true);
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    }
  }, [successMessage, error, dispatch, navigate]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarType}
          onClose={() => setOpenSnackbar(false)}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>

      <Stack spacing={3}>
        <ReportHeader />
        <ReportReasonSelect
          reason={reason}
          onChange={handleReasonChange}
          error={errors.reason}
          disabled={loading}
        />
        <ReportDescriptionField
          value={description}
          onChange={handleDescriptionChange}
          error={errors.description}
          charCount={description.length}
          disabled={loading}
        />
        <ReportActions onCancel={handleCancel} onSend={handleSendReport} loading={loading} />
      </Stack>
    </Box>
  );
}
