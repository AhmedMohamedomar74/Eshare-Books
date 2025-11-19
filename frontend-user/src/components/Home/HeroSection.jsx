import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 250, sm: 350, md: 420 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        borderRadius: 3,
        overflow: "hidden",
        mx: { xs: 2, md: 5 },
        mt: 4,
      }}
    >
      {/* الخلفية */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)",
        }}
      />

      {/* المحتوى */}
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: "700px", px: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Share, Donate, or Sell Your Books
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Join our community and give your books a new life. Start by listing your first book today.
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1b4332",
            "&:hover": { bgcolor: "#2d6a4f" },
            px: 4,
            py: 1.2,
            borderRadius: 2,
          }}
        >
          List Your Book
        </Button>
      </Box>
    </Box>
  );
}
