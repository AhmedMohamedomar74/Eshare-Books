import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOperation, fetchBookId, checkReportWarning } from '../../redux/slices/OrderSlice';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import OperationForm from '../../components/Order/OperationForm';
import BookInfo from '../../components/Order/BookInfo';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '../../components/Order/ConfirmDialog';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { content } = useSelector((state) => state.lang);

  const { book, loading } = useSelector((state) => state.orders);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [checkingReport, setCheckingReport] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchBookId(id));
  }, [id, dispatch]);

  if (loading) return <Spinner />;

  if (!book)
    return (
      <Typography textAlign="center" mt={4}>
        {content.noBookFound}
      </Typography>
    );

  const operationType =
    book.TransactionType === 'toSale'
      ? 'buy'
      : book.TransactionType === 'toBorrow'
      ? 'borrow'
      : book.TransactionType === 'toExchange'
      ? 'exchange'
      : 'donate';

  const reservedBorrows = book?.reservedBorrows || [];

  const getBorrowDays = () => {
    if (operationType !== 'borrow' || !startDate || !endDate) return 0;
    const diff = endDate.startOf('day').diff(startDate.startOf('day'), 'day');
    return diff > 0 ? diff : 0;
  };

  const borrowDays = getBorrowDays();

  const totalPrice =
    operationType === 'borrow'
      ? (book.PricePerDay || 0) * borrowDays
      : operationType === 'buy'
      ? book.Price || 0
      : 0;

  // ✅ NEW: Check for reports BEFORE showing confirmation dialog
  const handleCompleteClick = async (e) => {
    e.preventDefault();

    if (operationType === 'borrow') {
      if (!startDate || !endDate) {
        enqueueSnackbar(content.selectDates, { variant: 'warning' });
        return;
      }

      if (endDate.isSameOrBefore(startDate, 'day')) {
        enqueueSnackbar(content.endDateAfterStart, { variant: 'warning' });
        return;
      }
    }

    // ✅ Check for reports first
    setCheckingReport(true);
    try {
      const result = await dispatch(
        checkReportWarning({
          user_dest: book.UserID?._id,
          book_dest_id: book._id,
        })
      );

      if (checkReportWarning.fulfilled.match(result)) {
        const { hasWarning, warningMessage: msg } = result.payload;

        if (hasWarning) {
          setWarningMessage(msg);
        }

        setConfirmOpen(true);
      } else {
        // If check failed (e.g., book reported)
        const errorMsg = result.payload?.message || content.errorMessage;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(content.errorMessage, { variant: 'error' });
    } finally {
      setCheckingReport(false);
    }
  };

  // ✅ This now only executes if user confirms (with or without warning)
  const handleConfirmOperation = async () => {
    const operationData = {
      user_dest: book.UserID?._id,
      book_dest_id: book._id,
      operationType,
    };

    if (operationType === 'borrow') {
      operationData.startDate = startDate.toISOString();
      operationData.endDate = endDate.toISOString();
    }

    const result = await dispatch(createOperation(operationData));

    if (createOperation.fulfilled.match(result)) {
      enqueueSnackbar(content.requestSuccess, { variant: 'success' });
      setConfirmOpen(false);
      setWarningMessage(null);
    } else {
      const backendMsg = result.payload?.message || result.error?.message || content.errorMessage;
      enqueueSnackbar(backendMsg, { variant: 'error' });
      setConfirmOpen(false);
      setWarningMessage(null);
    }
  };

  const handleCancelOperation = () => {
    setConfirmOpen(false);
    setWarningMessage(null);
    enqueueSnackbar(content.operationCancelled || 'تم إلغاء العملية', {
      variant: 'info',
    });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 4 },
        bgcolor: '#fafafa',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.25fr 0.75fr' },
        gap: 3,
        alignItems: 'start',
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
        borrowDays={borrowDays}
        totalPrice={totalPrice}
        reservedBorrows={reservedBorrows}
        checkingReport={checkingReport}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCancelOperation}
        onConfirm={handleConfirmOperation}
        operationType={operationType}
        warningMessage={warningMessage}
      />
    </Box>
  );
};

export default OrderPage;
