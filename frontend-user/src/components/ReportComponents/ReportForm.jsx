import { useState } from 'react';
import { Stack, CardContent, Alert, Box } from '@mui/material';
import ReportHeader from './ReportHeader';
import ReportReasonSelect from './ReportReasonSelect';
import ReportDescriptionField from './ReportDescriptionField';
import ReportActions from './ReportActions';

export default function ReportForm() {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
  };

  const handleSendReport = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Report submitted:', { reason, description });

    setSuccess(true);
    setReason('');
    setDescription('');
    setErrors({});

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.4s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
          onClose={() => setSuccess(false)}
        >
          Your report has been sent successfully. Thank you for helping keep our community safe!
        </Alert>
      )}

      <Stack spacing={3}>
        <ReportHeader />
        <ReportReasonSelect reason={reason} onChange={handleReasonChange} error={errors.reason} />
        <ReportDescriptionField
          value={description}
          onChange={handleDescriptionChange}
          error={errors.description}
          charCount={description.length}
        />
        <ReportActions onCancel={handleCancel} onSend={handleSendReport} />
      </Stack>
    </Box>
  );
}
