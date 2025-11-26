import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOperation, fetchBookId } from "../../redux/slices/OrderSlice";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import OperationForm from "../../components/Order/OperationForm";
import BookInfo from "../../components/Order/BookInfo";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../../components/Order/ConfirmDialog";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { book, loading, successMessage } = useSelector(
    (state) => state.orders
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const getBorrowDays = () => {
    if (operationType !== "borrow" || !startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end - start;
    if (diffTime <= 0) return 0;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const borrowDays = getBorrowDays();

  const totalPrice =
    operationType === "borrow"
      ? (book.PricePerDay || 0) * borrowDays
      : operationType === "buy"
      ? book.Price || 0
      : 0;

  const handleCompleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (operationType === "borrow") {
      if (!startDate || !endDate) {
        enqueueSnackbar(
          "Please select both start and end dates for borrowing.",
          { variant: "warning" }
        );
        return;
      }

      const today = new Date();
      today.setHours(0,0,0,0);

      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      // ✅ منع past
      if (start < today) {
        enqueueSnackbar("Start date cannot be in the past.", {
          variant: "warning",
        });
        return;
      }

      // ✅ end بعد start
      if (end <= start) {
        enqueueSnackbar("End date must be after start date.", {
          variant: "warning",
        });
        return;
      }
    }

    setConfirmOpen(true);
  };

  const handleConfirmOperation = async () => {
    const operationData = {
      user_dest: book.UserID?._id,
      book_dest_id: book._id,
      operationType,
    };

    if (operationType === "borrow") {
      const today = new Date();
      today.setHours(0,0,0,0);

      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      if (start < today) {
        enqueueSnackbar("Start date cannot be in the past.", {
          variant: "warning",
        });
        setConfirmOpen(false);
        return;
      }

      if (end <= start) {
        enqueueSnackbar("End date must be after start date.", {
          variant: "warning",
        });
        setConfirmOpen(false);
        return;
      }

      operationData.startDate = startDate;
      operationData.endDate = endDate;
    }

    const result = await dispatch(createOperation(operationData));

    if (createOperation.fulfilled.match(result)) {
      enqueueSnackbar("Request sent successfully. Waiting for owner approval.", {
        variant: "success",
      });
    } else {
      const backendMsg =
        result.payload?.message ||
        result.error?.message ||
        "Something went wrong while creating the operation.";
      enqueueSnackbar(backendMsg, { variant: "error" });
    }

    setConfirmOpen(false);
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
        handleComplete={handleCompleteClick}
        successMessage={successMessage}
        borrowDays={borrowDays}
        totalPrice={totalPrice}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmOperation}
        operationType={operationType}
      />
    </Box>
  );
};

export default OrderPage;
