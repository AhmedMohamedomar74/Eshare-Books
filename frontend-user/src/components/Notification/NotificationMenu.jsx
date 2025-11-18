import {
  Menu,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PendingInvitationItem from "./PendingInvitationItem";
import NotificationItem from "./NotificationItem";

const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  pendingInvitations,
  notifications,
  acceptInvitation,
  refuseInvitation,
}) => {
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          width: 400,
          maxHeight: 500,
          overflow: "auto",
          borderRadius: 2,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" fontWeight="bold">Notifications</Typography>
      </Box>

      {pendingInvitations.length === 0 && notifications.length === 0 && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <NotificationsIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      )}

      {pendingInvitations.length > 0 && (
        <>
          <Box sx={{ px: 2, py: 1, bgcolor: "primary.light", color: "primary.contrastText" }}>
            <Typography variant="caption" fontWeight="bold">
              ACTION REQUIRED ({pendingInvitations.length})
            </Typography>
          </Box>

          {pendingInvitations.map((inv) => (
            <PendingInvitationItem
              key={inv.id}
              invitation={inv}
              onAccept={() => acceptInvitation(inv.id)}
              onRefuse={() => refuseInvitation(inv.id)}
              formatTime={formatTime}
            />
          ))}
          <Divider />
        </>
      )}

      {notifications.length > 0 && (
        <>
          <Box sx={{ px: 2, py: 1, bgcolor: "grey.100" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              RECENT ACTIVITY
            </Typography>
          </Box>

          {notifications.slice(0, 5).map((note, i) => (
            <NotificationItem key={i} notification={note} formatTime={formatTime} />
          ))}
        </>
      )}

      {(pendingInvitations.length > 0 || notifications.length > 0) && (
        <Box sx={{ p: 1.5, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
          <Button fullWidth variant="text" onClick={() => {
            onClose();
            window.location.href = "/notification";
          }}>
            View All Notifications
          </Button>
        </Box>
      )}
    </Menu>
  );
};

export default NotificationMenu;