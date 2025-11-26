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

// ✅ Plugins لازم تتفعل
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { book, loading, successMessage } = useSelector(
    (state) => state.orders
  );

  const [startDate, setStartDate] = useState(null); // dayjs
  const [endDate, setEndDate] = useState(null); // dayjs
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchBookId(id));
  }, [id, dispatch]);

  // ✅ لا تخرجي قبل ما كل الـ hooks تخلص
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

  // ✅ الفترات المحجوزة جاية من الباك
  const reservedBorrows = book?.reservedBorrows || [];
  const currentBorrow = book?.currentBorrow || null;

  const getBorrowDays = () => {
    if (operationType !== "borrow" || !startDate || !endDate) return 0;

    const diff = endDate.startOf("day").diff(startDate.startOf("day"), "day");
    if (diff <= 0) return 0;

    return diff;
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

    // ✅ حتى لو الكتاب محجوز دلوقتي، سيبي اليوزر يكمل
    setConfirmOpen(true);
  };

  const handleConfirmOperation = async () => {
    const operationData = {
      user_dest: book.UserID?._id,
      book_dest_id: book._id,
      operationType,
    };

    if (operationType === "borrow") {
      if (!startDate || !endDate) {
        enqueueSnackbar("Borrow dates are required.", {
          variant: "warning",
        });
        setConfirmOpen(false);
        return;
      }

      if (endDate.isSameOrBefore(startDate, "day")) {
        enqueueSnackbar("End date must be after start date.", {
          variant: "warning",
        });
        setConfirmOpen(false);
        return;
      }

      // ✅ نبعت للباك ISO
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
        p: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
      }}
    >
      {/* Book Info */}
      <Box sx={{ flex: 1 }}>
        <BookInfo book={book} />

        {/* ✅ لو محجوز حاليًا، نعرض تنبيه بسيط من غير منع */}
        {operationType === "borrow" && currentBorrow && (
          <Typography
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#fff3e0",
              color: "#e65100",
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            This book is currently borrowed until{" "}
            {dayjs(currentBorrow.endDate).format("YYYY-MM-DD")}.  
            You can still reserve another period.
          </Typography>
        )}
      </Box>

      {/* Operation Form */}
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

      {/* Confirm Dialog */}
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
