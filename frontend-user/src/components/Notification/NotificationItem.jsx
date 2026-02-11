import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Collapse,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import api from '../../axiosInstance/axiosInstance';
import { useSelector } from 'react-redux';

const NotificationItem = ({ notification, formatTime }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { content } = useSelector((state) => state.lang);

  const handlePayNow = async () => {
    console.log('Notification received:', notification);
    if (!notification.operationId || !notification.totalPrice) {
      alert(content.invalidPaymentNotification);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/orders/paymob/card', {
        operationID: notification.operationId,
        amount: notification.totalPrice,
      });

      if (response.data.success && response.data.data?.iframeUrl) {
        setPaymentUrl(response.data.data.iframeUrl);
        setShowPaymentModal(true);
      } else {
        alert(content.paymentFailed);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(content.paymentFailedTryAgain);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarContent = () => {
    switch (notification.type) {
      case 'acceptance':
        return <CheckIcon />;
      case 'payment':
        return <CreditCardIcon />;
      case 'book_deletion':
        return <span style={{ fontSize: '20px' }}>📘</span>;
      case 'book_restored':
        return <span style={{ fontSize: '20px' }}>🔄</span>;
      case 'operation_cancellation':
        return <span style={{ fontSize: '20px' }}>🔄</span>;
      case 'book_approved':
        return <CheckIcon />;
      case 'book_rejected':
        return <CloseIcon />;
      case 'report_reviewed':
      case 'report_against_you_reviewed':
      case 'report_dismissed':
        return <span style={{ fontSize: '20px' }}>📋</span>;
      case 'book_report_reviewed':
        return <span style={{ fontSize: '20px' }}>📖</span>;
      case 'role_promoted':
        return <span style={{ fontSize: '20px' }}>👑</span>;
      case 'category_suggestion_accepted':
        return <span style={{ fontSize: '20px' }}>✅</span>;
      case 'category_suggestion_rejected':
        return <span style={{ fontSize: '20px' }}>❌</span>;
      case 'category_update':
        return <CategoryIcon />;
      default:
        return <CloseIcon />;
    }
  };

  const getAvatarColor = () => {
    switch (notification.type) {
      case 'acceptance':
        return 'success.main';
      case 'payment':
        return 'warning.main';
      case 'book_deletion':
        return 'error.main';
      case 'book_restored':
        return 'success.main';
      case 'operation_cancellation':
        return 'info.main';
      case 'book_approved':
        return 'success.main';
      case 'book_rejected':
        return 'error.main';
      case 'report_reviewed':
        return 'success.main';
      case 'report_against_you_reviewed':
        return 'warning.main';
      case 'report_dismissed':
        return 'error.main';
      case 'book_report_reviewed':
        return 'warning.main';
      case 'role_promoted':
        return 'success.main';
      case 'category_suggestion_accepted':
        return 'success.main';
      case 'category_suggestion_rejected':
        return 'error.main';
      case 'category_update':
        return 'info.main';
      default:
        return 'error.main';
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: 1,
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={1.5}
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        <Avatar
          sx={{
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            bgcolor: getAvatarColor(),
            fontSize: '0.9rem',
          }}
        >
          {getAvatarContent()}
        </Avatar>

        <Box flex={1}>
          <Typography variant="body2" sx={{ fontSize: isMobile ? '0.85rem' : '0.95rem' }}>
            {notification.message}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={0.5}
            sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
          >
            {formatTime(notification.timestamp || notification.createdAt)}
          </Typography>

          {/* payment */}
          {notification.type === 'payment' && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? content.processing : content.payNow}
            </Button>
          )}

          {notification.type === 'book_deletion' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Reason: {notification.reason || 'Policy violation'}
              </Typography>
            </Box>
          )}

          {notification.type === 'operation_cancellation' && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Operation Type: {notification.operationType}
              </Typography>
            </Box>
          )}

          {/* ✅ Category Update Notification (NEW) */}
          {notification.type === 'category_update' && notification.data && (
            <Box sx={{ mt: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Chip
                  label={notification.data.oldCategoryName}
                  size="small"
                  color="default"
                  sx={{ textDecoration: 'line-through' }}
                />
                <Typography variant="caption">→</Typography>
                <Chip
                  label={notification.data.newCategoryName}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              {notification.data.affectedBooksCount > 0 && (
                <>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Affected Books: {notification.data.affectedBooksCount}
                  </Typography>

                  {notification.data.affectedBooks &&
                    notification.data.affectedBooks.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={() => setExpanded(!expanded)}
                          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{ mt: 0.5, textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          {expanded ? 'Hide Books' : 'Show Books'}
                        </Button>

                        <Collapse in={expanded}>
                          <Box
                            sx={{
                              mt: 1,
                              pl: 2,
                              borderLeft: 2,
                              borderColor: 'primary.main',
                              maxHeight: 150,
                              overflowY: 'auto',
                            }}
                          >
                            {notification.data.affectedBooks.map((book, index) => (
                              <Typography
                                key={book.id || index}
                                variant="caption"
                                display="block"
                                sx={{ py: 0.5 }}
                              >
                                • {book.title}
                              </Typography>
                            ))}
                          </Box>
                        </Collapse>
                      </>
                    )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Stack>

      {/* Modal */}
      {showPaymentModal && (
        <Dialog
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{content.completePayment}</DialogTitle>
          <DialogContent>
            <iframe
              src={paymentUrl}
              width="100%"
              height="600px"
              style={{ border: 'none' }}
              title="Payment"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPaymentModal(false)}>{content.close}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default NotificationItem;
