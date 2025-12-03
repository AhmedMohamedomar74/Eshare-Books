import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0f172a",
        color: "white",
        py: 4,
        mt: 6,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h6" fontWeight={800}>
          BookSwap
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Share, donate, sell, or borrow books easily.
        </Typography>

        <Typography
          variant="caption"
          sx={{ display: "block", mt: 2, opacity: 0.6 }}
        >
          © {new Date().getFullYear()} BookSwap. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
