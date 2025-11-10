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
        width: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* صورة الكتاب */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8f8f8",
          height: 220,
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

      {/* محتوى الكتاب */}
      <CardContent
        sx={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Box>
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

          {/* السعر (مكانه ثابت حتى لو مش موجود) */}
          <Typography
            variant="subtitle1"
            color={book.type === "For Sale" ? "success.main" : "transparent"}
            sx={{ mb: 2, minHeight: "24px" }}
          >
            {book.type === "For Sale" ? `$${book.price}` : "."}
          </Typography>
        </Box>

        {/* الزرار دايمًا في نفس المكان */}
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
