import { Typography, FormControl, Select, MenuItem, FormHelperText, Box } from '@mui/material';
import { useSelector } from 'react-redux';

const reportReasons = [
  'Inappropriate Content',
  'Spam or Fake',
  'Offensive Language',
  'Harassment',
  'Scam or Fraud',
  'Other',
];

export default function ReportReasonSelect({ reason, onChange, error, disabled }) {
  const { content } = useSelector((state) => state.lang);

  const getTranslatedReason = (reasonKey) => {
    const reasonMap = {
      'Inappropriate Content': content.inappropriateContent || 'Inappropriate Content',
      'Spam or Fake': content.spamOrFake || 'Spam or Fake',
      'Offensive Language': content.offensiveLanguage || 'Offensive Language',
      Harassment: content.harassment || 'Harassment',
      'Scam or Fraud': content.scamOrFraud || 'Scam or Fraud',
      Other: content.other || 'Other',
    };
    return reasonMap[reasonKey] || reasonKey;
  };

  return (
    <Box>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#000', mb: 1 }}>
        {content.reasonForReporting || 'Reason for Reporting'}
      </Typography>
      <FormControl fullWidth error={Boolean(error)}>
        <Select
          value={reason}
          onChange={onChange}
          disabled={disabled}
          displayEmpty
          sx={{
            backgroundColor: '#fff',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ddd' },
              '&:hover fieldset': { borderColor: '#999' },
            },
          }}
        >
          <MenuItem value="" disabled>
            {content.selectReason || 'Select a reason'}
          </MenuItem>
          {reportReasons.map((item) => (
            <MenuItem key={item} value={item}>
              {getTranslatedReason(item)}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
