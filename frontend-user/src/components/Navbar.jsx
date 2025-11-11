// src/components/Navbar.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import WishlistCounterIcon from './WishlistComponents/WishlistCounterIcon';
import { fetchWishlist } from '../redux/slices/wishlist.slice';

const pages = ['Home', 'Wishlist', 'Profile', 'Chat', 'Order'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);
  const user = useSelector((state) => state.auth?.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch wishlist on mount (after login or refresh)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EshareBook
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem
            key={page}
            component={Link}
            to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText
              primary={
                page === 'Wishlist' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center',
                    }}
                  >
                    Wishlist
                    <WishlistCounterIcon />
                  </Box>
                ) : (
                  page
                )
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="logo"
              style={{ width: '28px', height: '28px' }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}
            >
              EshareBook
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                sx={{
                  color: 'gray',
                  textTransform: 'none',
                  fontWeight: '500',
                  '&:hover': { color: 'black' },
                }}
              >
                {page === 'Wishlist' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Wishlist
                    <WishlistCounterIcon />
                  </Box>
                ) : (
                  page
                )}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

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
