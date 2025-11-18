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
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WishlistCounterIcon from "./WishlistComponents/WishlistCounterIcon";
import HomeIcon from "@mui/icons-material/Home";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { fetchWishlist } from "../redux/slices/wishlist.slice";
import UserAvatar from "./common/UserAvatar";
import { logout } from "../services/auth/auth.service";
import NotificationBell from "./Notification/NotificationBell";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch({ type: "auth/logout" });
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({ type: "auth/logout" });
      handleMenuClose();
      navigate("/login");
    }
  };

  const navLinks = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Add Book", path: "/add-book", icon: <LibraryAddIcon /> },
    { label: "Wishlist", path: "/wishlist" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
        EshareBook
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <UserAvatar size={48} onAvatarClick={handleAvatarClick} />
      </Box>

      <List>
        {navLinks.map(({ label, path, icon }) => (
          <ListItem
            key={label}
            component={Link}
            to={path}
            sx={{
              justifyContent: "center",
              textAlign: "center",
              py: 1,
            }}
          >
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {icon}
                  {label}
                  {label === "Wishlist" && <WishlistCounterIcon />}
                </Box>
              }
            />
          </ListItem>
        ))}
        {user && (
          <>
            <ListItem
              component={Link}
              to="/profile"
              sx={{ justifyContent: "center", py: 1 }}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                justifyContent: "center",
                py: 1,
                color: "red",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.04)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LogoutIcon fontSize="small" />
                <ListItemText primary="Logout" />
              </Box>
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
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="logo"
              style={{ width: "28px", height: "28px" }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
              }}
            >
              EshareBook
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navLinks.map(({ label, path, icon }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  color: "gray",
                  textTransform: "none",
                  fontWeight: "500",
                  "&:hover": { color: "black" },
                }}
              >
                {icon}
                {label === "Wishlist" && <WishlistCounterIcon />}
              </Button>
            ))}

            <NotificationBell />

            {/* User Avatar with Dropdown */}
            <Box sx={{ ml: 1 }}>
              <UserAvatar size={32} onAvatarClick={handleAvatarClick} />
            </Box>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 140,
                borderRadius: 2,
                overflow: "hidden",
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1,
                  fontSize: "0.9rem",
                  backgroundColor: "white !important",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={handleProfileClick}
              sx={{
                backgroundColor: "white !important",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                },
              }}
            >
              My Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "red",
                backgroundColor: "white !important",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.04) !important",
                  color: "red",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LogoutIcon fontSize="small" />
                Logout
              </Box>
            </MenuItem>
          </Menu>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" } }}
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
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
