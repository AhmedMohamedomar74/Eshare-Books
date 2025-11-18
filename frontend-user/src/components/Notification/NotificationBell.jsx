import React, { useState } from "react";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationMenu from "./NotificationMenu";
import { useSocketNotifications } from "../../hooks/useSocketNotifications";

const NotificationBell = () => {
  const {
    pendingInvitations,
    notifications,
    currentUser,
    acceptInvitation,
    refuseInvitation,
  } = useSocketNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const unreadCount = pendingInvitations.length;

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: open ? "primary.main" : "inherit" }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        pendingInvitations={pendingInvitations}
        notifications={notifications}
        acceptInvitation={acceptInvitation}
        refuseInvitation={refuseInvitation}
      />
    </>
  );
};

export default NotificationBell;
