import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOperation,
  fetchBookId,
  completeOperation,
} from "../../redux/slices/OrderSlice";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import OperationForm from "../../components/Order/OperationForm";
import BookInfo from "../../components/Order/BookInfo";
import { useSnackbar } from "notistack";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { book, loading, error, successMessage } = useSelector(
    (state) => state.orders
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch book by ID when component mounts
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

  // Determine operation type dynamically
  const operationType =
    book.TransactionType === "toSale"
      ? "buy"
      : book.TransactionType === "toBorrow"
      ? "borrow"
      : book.TransactionType === "toExchange"
      ? "exchange"
      : "donate";

  // Handle create + complete operation
  const handleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const operationData = {
      user_dest: book.UserID?._id,
      book_dest_id: book._id,
      operationType,
    };

    // Extra validation for borrow operation
    if (operationType === "borrow") {
      if (!startDate || !endDate) {
        enqueueSnackbar(
          "Please select both start and end dates for borrowing.",
          { variant: "warning" }
        );
        return;
      }
      operationData.startDate = startDate;
      operationData.endDate = endDate;
    }

    // Dispatch create operation
    const result = await dispatch(createOperation(operationData));

    // Handle success or error from backend
    if (createOperation.fulfilled.match(result)) {
      const operationId = result.payload?._id;
      if (operationId) {
        await dispatch(completeOperation(operationId));
        enqueueSnackbar("Operation completed successfully!", {
          variant: "success",
        });
      }
    } else {
      const backendMsg =
        result.payload?.message ||
        result.error?.message ||
        "Something went wrong while creating the operation.";

      enqueueSnackbar(backendMsg, { variant: "error" });
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
      <BookInfo book={book} />

      <OperationForm
        operationType={operationType}
        book={book}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        handleComplete={handleComplete}
        successMessage={successMessage}
      />
    </Box>
  );
};

export default OrderPage;
