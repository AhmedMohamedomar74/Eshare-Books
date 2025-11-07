import { useState, useEffect } from 'react';
import { Stack, Box, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ReportHeader from './ReportHeader';
import ReportReasonSelect from './ReportReasonSelect';
import ReportDescriptionField from './ReportDescriptionField';
import ReportActions from './ReportActions';
import { createNewReport, clearReportMessage } from '../../redux/slices/reportSlice';

export default function ReportForm({ targetType, targetId }) {
  const dispatch = useDispatch();
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
    setReason('');
    setDescription('');
    setErrors({});
  };

  const handleSendReport = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(createNewReport({ reason, description, targetType, targetId }));
  };

  useEffect(() => {
    if (successMessage) {
      setSnackbarType('success');
      setSnackbarMsg(successMessage);
      setOpenSnackbar(true);
      setReason('');
      setDescription('');
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    } else if (error) {
      setSnackbarType('error');
      setSnackbarMsg(error);
      setOpenSnackbar(true);
      setTimeout(() => dispatch(clearReportMessage()), 3000);
    }
  }, [successMessage, error, dispatch]);

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
        <ReportReasonSelect reason={reason} onChange={handleReasonChange} error={errors.reason} />
        <ReportDescriptionField
          value={description}
          onChange={handleDescriptionChange}
          error={errors.description}
          charCount={description.length}
        />
        <ReportActions onCancel={handleCancel} onSend={handleSendReport} loading={loading} />
      </Stack>
    </Box>
  );
}
