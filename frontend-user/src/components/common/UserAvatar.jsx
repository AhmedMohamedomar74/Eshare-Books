import { Avatar, Tooltip, Box, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user/userService';

const UserAvatar = ({ size = 40, sx = {} }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const defaultGuestImage = 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    const isLoggedIn = !!localStorage.getItem('accessToken') && !!user;

    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.secondName)
      return `${user.firstName[0]}${user.secondName[0]}`.toUpperCase();
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.fullName) {
      const parts = user.fullName.trim().split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return 'U';
  };

  const isLoggedIn = !!localStorage.getItem('accessToken') && !!user;

  const avatarImage = isLoggedIn && user?.profilePic ? user.profilePic : defaultGuestImage;

  const avatarAlt = isLoggedIn ? `${user?.firstName || 'User'} avatar` : 'Guest user';

  const tooltipTitle = loading
    ? 'Loading...'
    : isLoggedIn
    ? `Hi ${user?.firstName || 'there'}! Click to view profile`
    : 'Not logged in - Click to login';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
        <CircularProgress size={size} thickness={4} />
      </Box>
    );
  }

  const avatarElement = (
    <Avatar
      src={avatarImage}
      alt={avatarAlt}
      onClick={handleAvatarClick}
      sx={{
        width: size,
        height: size,
        cursor: 'pointer',
        border: '3px solid transparent',
        transition: 'all 0.3s ease',
        backgroundColor: isLoggedIn ? 'transparent' : '#f0f0f0',
        '&:hover': {
          borderColor: isLoggedIn ? '#1976d2' : '#666',
          transform: 'scale(1.1)',
          boxShadow: isLoggedIn
            ? '0 8px 20px rgba(25, 118, 210, 0.3)'
            : '0 8px 20px rgba(0, 0, 0, 0.2)',
        },
        ...sx,
      }}
    >
      {isLoggedIn && avatarImage === defaultGuestImage && getInitials()}
      {!isLoggedIn && null}
    </Avatar>
  );

  return (
    <Tooltip title={tooltipTitle} arrow placement="bottom">
      {avatarElement}
    </Tooltip>
  );
};

export default UserAvatar;
