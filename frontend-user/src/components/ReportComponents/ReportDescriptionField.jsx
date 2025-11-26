import { Typography, TextField, Box } from '@mui/material';

export default function ReportDescriptionField({ value, onChange, error, charCount, disabled }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#000', mb: 1 }}>
        Additional Comments (Optional)
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="Provide more details here..."
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={error}
        disabled={disabled}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '6px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#ddd' },
            '&:hover fieldset': { borderColor: '#999' },
          },
        }}
        inputProps={{ maxLength: 500 }}
      />
      <Typography
        sx={{
          fontSize: '12px',
          color: '#999',
          mt: 0.5,
          textAlign: 'right',
        }}
      >
        {charCount}/500
      </Typography>
    </Box>
  );
}
