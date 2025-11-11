import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const imageUrl =
    typeof book.image === "object"
      ? book.image.secure_url
      : book.image || book.Image;

  const title = book.title || book.Title || "Untitled";
  const type = book.TransactionType || book.type || book.Type || "Other";
  const price = book.price || book.Price || 0;
  const description =
    book.description || book.Description || "No description available.";
  const id = book._id || book.id;

  const getChipColor = (type) => {
    switch (type) {
      case "toSale":
        return "success";
      case "toExchange":
        return "info";
      case "toDonate":
        return "warning";
      case "toBorrow":
        return "primary";
      default:
        return "default";
    }
  };

  const shortDescription =
    description.length > 70
      ? description.slice(0, 70) + "..."
      : description;

  return (
    <Card
      sx={{
        width: 290,
        height: 420,
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      {/* الصورة */}
      <CardMedia
        component="img"
        image={
          imageUrl ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt={title}
        sx={{
          height: 200,
          objectFit: "contain", // الصورة تظهر كاملة
          backgroundColor: "#f5f5f5",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* المحتوى */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
          pb: 2,
        }}
      >
        <Box>
          <Chip
            label={type}
            color={getChipColor(type)}
            size="small"
            sx={{ mb: 0.8, fontWeight: 500 }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              mb: 0.5,
              lineHeight: 1.3,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: "0.85rem",
              minHeight: "38px",
              lineHeight: 1.3,
            }}
          >
            {shortDescription}
          </Typography>

          {type === "toSale" ? (
            <Typography
              variant="subtitle1"
              color="success.main"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              ${price}
            </Typography>
          ) : (
            <Box sx={{ height: "20px", mb: 1 }} />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate(`/details/${id}`)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            py: 1,
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
