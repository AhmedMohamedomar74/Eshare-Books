import { Box, TextField, Typography } from "@mui/material";

const BorrowDate = ({ startDate, endDate, setStartDate, setEndDate }) => {
  // ✅ تاريخ النهاردة بصيغة YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  return (
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
          inputProps={{ min: todayStr }} // ✅ يمنع past
          fullWidth
        />

        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          inputProps={{
            min: startDate || todayStr, // ✅ endDate مينفعش قبل startDate
          }}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default BorrowDate;
