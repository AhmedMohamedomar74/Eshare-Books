import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
} from "@mui/material";
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
  borrowDays,
  totalPrice,
  reservedBorrows = [],
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
        <>
          <BorrowDate
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            reservedBorrows={reservedBorrows}
          />

          <Typography variant="body1" mb={1}>
            Borrow days:{" "}
            {borrowDays > 0 ? `${borrowDays} day(s)` : "Select valid dates"}
          </Typography>

          <Typography variant="body1" mb={3}>
            Price per day: {book.PricePerDay || 0} EGP
          </Typography>
        </>
      )}

      <Typography fontWeight="bold" mb={3}>
        Total:{" "}
        {operationType === "borrow"
          ? borrowDays > 0
            ? `${totalPrice} EGP`
            : "Select valid dates"
          : operationType === "buy"
          ? `${totalPrice} EGP`
          : book.TransactionType === "toDonate"
          ? "Free"
          : `${book.Price || 0} EGP`}
      </Typography>

      <Box sx={{ textAlign: "center" }}>
        {/* ✅ الزرار دايمًا شغال */}
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
          Process {operationType}
        </Button>

        {successMessage && (
          <Typography color="success.main" mt={2}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default OperationForm;
