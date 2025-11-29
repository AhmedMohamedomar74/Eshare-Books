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
import { useSelector } from "react-redux";

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
  const { content } = useSelector((state) => state.lang);

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        height: "fit-content",
      }}
    >
      <Typography variant="h6" fontWeight={800} mb={0.5}>
        {content.operationSummary}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {content.reviewOrderDetails}
      </Typography>

      <RadioGroup value={operationType}>
        <FormControlLabel
          value={operationType}
          control={<Radio />}
          label={`${content.operation}: ${content[operationType]}`}
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

          {/* Borrow Info */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {content.borrowDays}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {borrowDays > 0 ? `${borrowDays} ${content.days}` : "—"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {content.pricePerDay}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {book.PricePerDay || 0} {content.currency}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography fontWeight={800}>{content.total}</Typography>
        <Typography fontWeight={800} sx={{ color: "#c0a427" }}>
          {operationType === "borrow"
            ? borrowDays > 0
              ? `${totalPrice} ${content.currency}`
              : content.selectValidDates
            : operationType === "buy"
            ? `${totalPrice} ${content.currency}`
            : book.TransactionType === "toDonate"
            ? content.free
            : `${book.Price || 0} ${content.currency}`}
        </Typography>
      </Box>

      {/* Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleComplete}
        sx={{
          py: 1.3,
          fontWeight: 800,
          borderRadius: 2,
          textTransform: "none",
          backgroundColor: "#c0a427",
          color: "black",
          "&:hover": { backgroundColor: "#b39b20" },
        }}
      >
        {content.process} {content[operationType]}
      </Button>

      {successMessage && (
        <Typography color="success.main" mt={2} textAlign="center">
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default OperationForm;
