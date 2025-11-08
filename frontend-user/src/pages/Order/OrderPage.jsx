import { EmailOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOperation,
  fetchBookId,
  completeOperation,
} from "../../redux/slices/OrderSlice";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { book, loading, error, successMessage } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (id) dispatch(fetchBookId(id));
  }, [id, dispatch]);

  if (loading) return <Spinner />;
  if (!book)
    return (
      <Typography textAlign="center" mt={4}>
        No book found.
      </Typography>
    );

  const operationType =
    book.TransactionType === "toSale"
      ? "buy"
      : book.TransactionType === "toBorrow"
      ? "borrow"
      : book.TransactionType === "toExchange"
      ? "exchange"
      : "donate";

  const currentUserId = "6900c6fa1121ca51e4588227";

  const handleComplete = async () => {
    const operationData = {
      user_dest: book.UserID?._id,
      book_dest_id: book._id,
      operationType,
    };

    const result = await dispatch(createOperation(operationData));
    const operationId = result.payload?._id;
    if (operationId) {
      dispatch(completeOperation(operationId));
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
      }}
    >
      {/* Book Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {book.Title}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {book.Description}
        </Typography>

        <Typography variant="body1" mb={1}>
          <strong>Category:</strong> {book.categoryId?.name || "N/A"}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Type:</strong> {book.TransactionType}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Price:</strong>{" "}
          {book.TransactionType === "toDonate" ? "Free" : `${book.Price} EGP`}
        </Typography>
      </Box>

      {/* Operation Box */}
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

        <Typography fontWeight="bold" mb={3}>
          Total:{" "}
          {book.TransactionType === "toDonate" ? "Free" : `${book.Price} EGP`}
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Button
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

          {successMessage && (
            <Typography mt={2} color="green" fontWeight="bold">
              {successMessage}
            </Typography>
          )}

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
    </Box>
  );
};

export default OrderPage;
