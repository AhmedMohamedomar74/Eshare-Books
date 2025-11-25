import React, { useState } from "react";
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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import api from "../../axiosInstance/axiosInstance";

const NotificationItem = ({ notification, formatTime }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayNow = async () => {
    console.log("Notification received:", notification);
    if (!notification.operationId || !notification.totalPrice) {
      alert("Invalid payment notification.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/v1/orders/paymob/card", {
        operationID: notification.operationId,
        amount: notification.totalPrice,
      });

      if (response.data.success && response.data.data?.iframeUrl) {
        setPaymentUrl(response.data.data.iframeUrl);
        setShowPaymentModal(true);
      } else {
        alert("Payment failed ");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarContent = () => {
    switch (notification.type) {
      case "acceptance":
        return <CheckIcon />;
      case "payment":
        return <CreditCardIcon />;
      default:
        return <CloseIcon />;
    }
  };

  const getAvatarColor = () => {
    switch (notification.type) {
      case "acceptance":
        return "success.main";
      case "payment":
        return "warning.main";
      default:
        return "error.main";
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: 1,
        borderColor: "divider",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1.5}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Avatar
          sx={{
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            bgcolor: getAvatarColor(),
            fontSize: "0.9rem",
          }}
        >
          {getAvatarContent()}
        </Avatar>

        <Box flex={1}>
          <Typography
            variant="body2"
            sx={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}
          >
            {notification.message}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={0.5}
            sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
          >
            {formatTime(notification.timestamp || notification.createdAt)}
          </Typography>

          {/* payment */}
          {notification.type === "payment" && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              sx={{ mt: 1 }}
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
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
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogContent>
            <iframe
              src={paymentUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Payment"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPaymentModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default NotificationItem;
