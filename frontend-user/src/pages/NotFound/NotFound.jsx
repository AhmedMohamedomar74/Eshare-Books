import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        bgcolor: "background.default",
      }}
    >
      {/* texts */}
      <Typography variant="h1" fontWeight="bold" color="error" mb={2}>
        Oops!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
        sx={{ maxWidth: 400 }}
      >
        The page you’re looking for doesn’t exist, has been moved, or is
        temporarily unavailable.
      </Typography>

      {/* Buttons */}
      <Button
        component={Link}
        to="/"
        color="primary"
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          boxShadow: 3,
          fontWeight: "bold",
          "&:hover": {
            bgcolor: "secondary.main",
          },
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
