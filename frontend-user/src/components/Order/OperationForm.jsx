import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
import BorrowDate from "./BorrowDate";

const OperationForm = ({
  operationType,
  book,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleComplete,
  successMessage,
}) => {
  return (
    <Box
      sx={{
        flex: 0.4,
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        p: "20px",
        backgroundColor: "#fafafa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Operation Summary
      </Typography>

      <RadioGroup defaultValue={operationType}>
        <FormControlLabel
          value={operationType}
          control={<Radio />}
          label={`Operation: ${operationType}`}
        />
      </RadioGroup>

      <Divider sx={{ my: 2 }} />

      {operationType === "borrow" && (
        <BorrowDate
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      )}

      <Typography fontWeight="bold" mb={3}>
        Total:{" "}
        {book.TransactionType === "toDonate" ? "Free" : `${book.Price} EGP`}
      </Typography>

      <Box sx={{ textAlign: "center" }}>
        <Button
          type="button"
          variant="contained"
          onClick={handleComplete}
          sx={{
            py: 1.5,
            px: 3,
            fontWeight: "bold",
            backgroundColor: "#004d40",
            borderRadius: "8px",
            width: "300px",
            "&:hover": { backgroundColor: "#00695c" },
          }}
        >
          Complete {operationType}
        </Button>

        <Button
          variant="contained"
          startIcon={<EmailOutlined />}
          sx={{
            mt: 2,
            backgroundColor: "#c0ca33",
            color: "black",
            fontWeight: "bold",
            textTransform: "none",
            width: "300px",
            "&:hover": { backgroundColor: "#afb42b" },
          }}
        >
          Contact Owner
        </Button>
      </Box>
    </Box>
  );
};

export default OperationForm;
