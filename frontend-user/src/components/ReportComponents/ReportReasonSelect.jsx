import { Typography, FormControl, Select, MenuItem, FormHelperText, Box } from '@mui/material';

const reportReasons = [
  'Inappropriate Content',
  'Spam or Fake',
  'Offensive Language',
  'Harassment',
  'Scam or Fraud',
  'Other',
];

export default function ReportReasonSelect({ reason, onChange, error }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#000', mb: 1 }}>
        Reason for Reporting
      </Typography>
      <FormControl fullWidth error={Boolean(error)}>
        <Select
          value={reason}
          onChange={onChange}
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
            Select a reason
          </MenuItem>
          {reportReasons.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
