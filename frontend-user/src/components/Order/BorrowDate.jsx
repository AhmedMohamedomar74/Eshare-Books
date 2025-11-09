import { Box, TextField, Typography } from "@mui/material";

const BorrowDate = ({ startDate, endDate, setStartDate, setEndDate }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body1" mb={1}>
      Select Borrow Duration:
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        type="date"
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
      />
      <TextField
        type="date"
        label="End Date"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
      />
    </Box>
  </Box>
);

export default BorrowDate;
