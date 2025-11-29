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
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { book, loading, successMessage } = useSelector(
    (state) => state.orders
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const reservedBorrows = book?.reservedBorrows || [];

  const getBorrowDays = () => {
    if (operationType !== "borrow" || !startDate || !endDate) return 0;
    const diff = endDate.startOf("day").diff(startDate.startOf("day"), "day");
    return diff > 0 ? diff : 0;
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

    if (operationType === "borrow") {
      if (!startDate || !endDate) {
        enqueueSnackbar("Please select both start and end dates.", {
          variant: "warning",
        });
        return;
      }

      if (endDate.isSameOrBefore(startDate, "day")) {
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
      operationData.startDate = startDate.toISOString();
      operationData.endDate = endDate.toISOString();
    }

    const result = await dispatch(createOperation(operationData));

    if (createOperation.fulfilled.match(result)) {
      enqueueSnackbar("Request sent successfully.", { variant: "success" });
    } else {
      const backendMsg =
        result.payload?.message ||
        result.error?.message ||
        "Something went wrong.";
      enqueueSnackbar(backendMsg, { variant: "error" });
    }

    setConfirmOpen(false);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 4 },
        bgcolor: "#fafafa",
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" },
        gap: 3,
        alignItems: "start",
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
        reservedBorrows={reservedBorrows}
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
