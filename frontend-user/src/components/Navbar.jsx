import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WishlistCounterIcon from './WishlistComponents/WishlistCounterIcon';
import HomeIcon from '@mui/icons-material/Home';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ReportIcon from '@mui/icons-material/Report';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { fetchWishlist } from '../redux/slices/wishlist.slice';
import UserAvatar from './common/UserAvatar';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    handleMenuClose();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Add Book', path: '/add-book', icon: <LibraryAddIcon /> },
    { label: 'Wishlist', path: '/wishlist' },
  ];

  const authLinks = user
    ? []
    : [
        { label: 'Login', path: '/login', icon: <LoginIcon /> },
        { label: 'Register', path: '/register', icon: <AppRegistrationIcon /> },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
        EshareBook
      </Typography>

      {/* drawer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <UserAvatar size={48} />
      </Box>

      <List>
        {[...navLinks, ...authLinks].map(({ label, path, icon }) => (
          <ListItem
            key={label}
            component={Link}
            to={path}
            sx={{
              justifyContent: 'center',
              textAlign: 'center',
              py: 1,
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                  {label}
                  {label === 'Wishlist' && <WishlistCounterIcon />}
                </Box>
              }
            />
          </ListItem>
        ))}
        {user && (
          <>
            <ListItem component={Link} to="/profile" sx={{ justifyContent: 'center', py: 1 }}>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout} sx={{ justifyContent: 'center', py: 1 }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="logo"
              style={{ width: '28px', height: '28px' }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              EshareBook
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            {navLinks.map(({ label, path, icon }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  color: 'gray',
                  textTransform: 'none',
                  fontWeight: '500',
                  '&:hover': { color: 'black' },
                }}
              >
                {icon}
                {label === 'Wishlist' && <WishlistCounterIcon />}
              </Button>
            ))}
            {authLinks.map(({ label, path, icon }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  color: 'gray',
                  textTransform: 'none',
                  fontWeight: '500',
                  '&:hover': { color: 'black' },
                }}
              >
                {icon}
              </Button>
            ))}
            {user ? (
              <Box sx={{ ml: 1 }}>
                <UserAvatar size={32} />
              </Box>
            ) : (
              <Box sx={{ ml: 1 }}>
                <UserAvatar size={32} />
              </Box>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
