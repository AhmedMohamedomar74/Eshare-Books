import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="logo"
            style={{ width: "28px", height: "28px" }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "black", fontWeight: "bold" }}
          >
            EshareBook
          </Typography>
        </Box>

        {/* Links */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          {["Home", "Wishlist", "Profile", "Chat"].map((page) => (
            <Button
              key={page}
              component={Link}
              to={`/${page.toLowerCase()}`}
              sx={{
                color: "gray",
                textTransform: "none",
                fontWeight: "500",
                "&:hover": { color: "black" },
              }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
