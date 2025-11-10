import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";

export default function BookCard({ book }) {
  const getChipColor = (type) => {
    switch (type) {
      case "For Sale":
        return "success";
      case "Donate":
        return "warning";
      case "Borrow":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card
  sx={{
    borderRadius: 3,
    boxShadow: 2,
    overflow: "hidden",
    transition: "0.3s",
    "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
    height: 420,
    width: 300, // ✅ حجم ثابت يخلي التوزيع مضبوط
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
      {/* صورة الكتاب */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8f8f8",
          height: 220, // ✅ جزء الصورة ثابت
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={book.image}
          alt={book.title}
          sx={{
            height: "100%",
            width: "auto",
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent sx={{ textAlign: "left", flexGrow: 1 }}>
        <Chip
          label={book.type}
          color={getChipColor(book.type)}
          size="small"
          sx={{ mb: 1, fontWeight: 500 }}
        />

        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mt: 1, mb: 0.5, color: "text.primary" }}
        >
          {book.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {book.author}
        </Typography>

        {book.type === "For Sale" && (
          <Typography variant="subtitle1" color="success.main" sx={{ mb: 1 }}>
            ${book.price}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: "#3b4d61",
            "&:hover": { backgroundColor: "#2e3e51" },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
