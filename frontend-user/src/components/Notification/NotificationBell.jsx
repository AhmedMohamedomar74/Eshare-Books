import React, { useState } from 'react';
import { IconButton, Badge, useTheme, useMediaQuery } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationMenu from './NotificationMenu';
import { useSocketNotifications } from '../../hooks/useSocketNotifications';

const NotificationBell = () => {
  const { pendingInvitations, notifications, currentUser, acceptInvitation, refuseInvitation } =
    useSocketNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const unreadCount = pendingInvitations.length;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={isMobile ? 'small' : 'medium'}
        sx={{
          color: open ? 'primary.main' : 'inherit',
          p: isMobile ? 0.5 : 1,
          '&:hover': {
            backgroundColor: 'transparent !important',
          },
          '&:focus': {
            backgroundColor: 'transparent !important',
            outline: 'none',
          },
          '& .MuiTouchRipple-root': {
            display: 'none',
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: isMobile ? '0.6rem' : '0.75rem',
              minWidth: isMobile ? 16 : 20,
              height: isMobile ? 16 : 20,
            },
          }}
        >
          <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
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
