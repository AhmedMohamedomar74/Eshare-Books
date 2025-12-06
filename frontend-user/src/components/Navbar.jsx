import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
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

const MAIN_COLOR = "#22a699";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { content, lang } = useSelector((state) => state.lang);
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

  const handleLanguageToggle = () => {
    dispatch({ type: "TOGGLE_LANG" });
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

  const desktopNavIcons = [
    {
      path: "/home",
      icon: <HomeIcon />,
      tooltip: content.home || "Home",
      component: Link,
    },
    {
      path: "/add-book",
      icon: <LibraryAddIcon />,
      tooltip: content.addBook || "Add Book",
      component: Link,
    },
    {
      path: "/wishlist",
      icon: <WishlistCounterIcon />,
      tooltip: content.wishlist || "Wishlist",
      component: Link,
    },
    {
      path: "#",
      icon: <NotificationBell />,
      tooltip: content.notification || "Notification",
      component: "div",
    },
  ];

  const mobileNavLinks = [
    { label: content.home || "Home", path: "/", icon: <HomeIcon /> },
    {
      label: content.addBook || "Add Book",
      path: "/add-book",
      icon: <LibraryAddIcon />,
    },
    { label: content.wishlist || "Wishlist", path: "/wishlist", icon: null },
    {
      label: content.notification || "Notification",
      path: "#",
      icon: <NotificationBell />,
    },
    {
      label: content.language || "Language",
      path: "#",
      icon: <LanguageIcon />,
      onClick: handleLanguageToggle,
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: "bold", color: MAIN_COLOR }}
      >
        EshareBook
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <UserAvatar size={48} onAvatarClick={handleAvatarClick} />
      </Box>

      <List>
        {mobileNavLinks.map(({ label, path, icon, onClick }) => (
          <ListItem
            key={label}
            component={onClick ? "div" : Link}
            to={onClick ? undefined : path}
            onClick={onClick}
            sx={{
              justifyContent: "center",
              textAlign: "center",
              py: 1,
              cursor: "pointer",
              color: "#111827",
              "&:hover": {
                backgroundColor: `${MAIN_COLOR}12`,
                color: MAIN_COLOR,
              },
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
                    width: "auto",
                    color: "inherit",
                  }}
                >
                  {/* نخلي لون الايقونة MAIN_COLOR */}
                  <Box sx={{ color: MAIN_COLOR }}>{icon}</Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexDirection:
                        label === (content.wishlist || "Wishlist")
                          ? "row-reverse"
                          : "row",
                      color: "inherit",
                    }}
                  >
                    {label}
                    {label === (content.wishlist || "Wishlist") && (
                      <WishlistCounterIcon />
                    )}
                  </Box>
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
              sx={{
                justifyContent: "center",
                py: 1,
                color: "#111827",
                "&:hover": {
                  backgroundColor: `${MAIN_COLOR}12`,
                  color: MAIN_COLOR,
                },
              }}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={content.myProfile || "My Profile"} />
            </ListItem>

            <ListItem
              button
              onClick={handleLogout}
              sx={{
                justifyContent: "center",
                py: 1,
                color: "red",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.06)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LogoutIcon fontSize="small" />
                <ListItemText primary={content.logout || "Logout"} />
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
          color: MAIN_COLOR, // ✅ النص يخد اللون
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="logo"
              style={{
                width: "28px",
                height: "28px",
                // ✅ نخليه MAIN_COLOR
                filter:
                  "invert(43%) sepia(78%) saturate(367%) hue-rotate(124deg) brightness(92%) contrast(90%)",
              }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: MAIN_COLOR,
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
            {desktopNavIcons.map(({ path, icon, tooltip, component }) => (
              <Tooltip key={tooltip} title={tooltip}>
                <IconButton
                  component={component}
                  to={component === Link ? path : undefined}
                  sx={{
                    color: MAIN_COLOR,
                    width: 40,
                    height: 40,
                    "&:hover": {
                      backgroundColor: `${MAIN_COLOR}12`,
                      color: MAIN_COLOR,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}

            {/* Language Button */}
            <Tooltip
              title={
                lang === "en"
                  ? content.switchToArabic || "Switch to Arabic"
                  : content.switchToEnglish || "Switch to English"
              }
            >
              <IconButton
                onClick={handleLanguageToggle}
                sx={{
                  color: MAIN_COLOR,
                  width: 40,
                  height: 40,
                  "&:hover": {
                    backgroundColor: `${MAIN_COLOR}12`,
                    color: MAIN_COLOR,
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>

            {/* Avatar */}
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
                    backgroundColor: `${MAIN_COLOR}12 !important`,
                    color: MAIN_COLOR,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfileClick}>
              {content.myProfile || "My Profile"}
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "red",
                backgroundColor: "white !important",
                "&:hover": {
                  backgroundColor: "rgba(244, 67, 54, 0.06) !important",
                  color: "red",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LogoutIcon fontSize="small" />
                {content.logout || "Logout"}
              </Box>
            </MenuItem>
          </Menu>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              color: MAIN_COLOR,
            }}
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
