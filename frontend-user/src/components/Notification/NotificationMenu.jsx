import { Menu, Box, Typography, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PendingInvitationItem from "./PendingInvitationItem";
import NotificationItem from "./NotificationItem";
import { useSelector } from "react-redux";

const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  pendingInvitations,
  notifications,
  acceptInvitation,
  refuseInvitation,
}) => {
  const { content } = useSelector((state) => state.lang);

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    if (diff < 60) return content.justNow;
    if (diff < 3600) return `${Math.floor(diff / 60)}${content.minutesAgo}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${content.hoursAgo}`;
    return `${Math.floor(diff / 86400)}${content.daysAgo}`;
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
          width: { xs: 300, sm: 400 },
          maxHeight: "80vh",
          overflow: "auto",
          borderRadius: 2,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" fontWeight="bold">
          {content.notifications}
        </Typography>
      </Box>

      {/* No notifications */}
      {pendingInvitations.length === 0 && notifications.length === 0 && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <NotificationsIcon
            sx={{ fontSize: { xs: 36, sm: 48 }, color: "text.disabled", mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {content.noNotificationsYet}
          </Typography>
        </Box>
      )}

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && [
        <Box
          key="pending-header"
          sx={{
            px: 2,
            py: 1,
            bgcolor: "primary.light",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            {content.actionRequired} ({pendingInvitations.length})
          </Typography>
        </Box>,
        ...pendingInvitations.map((inv) => (
          <PendingInvitationItem
            key={inv.id}
            invitation={inv}
            onAccept={(invitationId, userId, operationId) =>
              acceptInvitation(invitationId, userId, operationId)
            }
            onRefuse={(reason) => refuseInvitation(inv.id, reason)}
            formatTime={formatTime}
          />
        )),
        <Divider key="pending-divider" />,
      ]}

      {/* Recent Notifications */}
      {notifications.length > 0 && [
        <Box
          key="recent-header"
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {content.recentActivity}
          </Typography>
        </Box>,
        ...notifications
          .slice(0, 5)
          .map((note, i) => (
            <NotificationItem
              key={i}
              notification={note}
              formatTime={formatTime}
            />
          )),
      ]}
    </Menu>
  );
};

export default NotificationMenu;