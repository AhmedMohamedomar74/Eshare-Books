import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import WishlistHeartButton from "../WishlistComponents/WishlistHeartButton";
import useTranslate from "../../hooks/useTranslate";

const BookCard = ({ book }) => {
  const { t } = useTranslate();

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const imageUrl =
    typeof book.image === "object"
      ? book.image.secure_url
      : book.image || book.Image;

  const title = book.title || book.Title || t("untitled", "Untitled");
  const type = book.TransactionType || book.type || book.Type || "Other";
  const price = book.price || book.Price || 0;
  const pricePerDay = book.PricePerDay || book.pricePerDay || 0;
  const description =
    book.description ||
    book.Description ||
    t("noDescription", "No description available.");
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
    description.length > 70 ? description.slice(0, 70) + "..." : description;

  return (
    <Card
      sx={{
        position: "relative",
        width: 290,
        height: 420,
        borderRadius: 3,
        bgcolor: "white",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Report Flag */}
      {isHovered && (
        <Link
          to={`/reports/book/${book._id}`}
          style={{ textDecoration: "none" }}
          title={t("reportBook", "report this book")}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 10,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "all 0.25s ease",
              "&:hover": { bgcolor: "white", transform: "scale(1.08)" },
            }}
          >
            <OutlinedFlagIcon sx={{ fontSize: 20, color: "#d32f2f" }} />
          </Box>
        </Link>
      )}

      {/* Wishlist */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "50%",
          p: 0.4,
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.2s ease",
          "&:hover": { bgcolor: "white", transform: "scale(1.05)" },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistHeartButton bookId={book._id} />
      </Box>

      {/* Image */}
      <CardMedia
        component="img"
        image={
          imageUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt={title}
        sx={{
          height: 200,
          objectFit: "contain",
          backgroundColor: "#f7f7f7",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          p: 1,
        }}
      />

      {/* Content */}
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
            label={t(type, type)}
            color={getChipColor(type)}
            size="small"
            sx={{ mb: 0.8, fontWeight: 700 }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
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
            sx={{ mb: 1, fontSize: "0.85rem", minHeight: 38, lineHeight: 1.4 }}
          >
            {shortDescription}
          </Typography>

          {type === "toSale" && (
            <Typography
              variant="subtitle1"
              color="success.main"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              {price} {t("egp", "EGP")}
            </Typography>
          )}

          {type === "toBorrow" && (
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              {pricePerDay} {t("egpPerDay", "EGP / day")}
            </Typography>
          )}

          {type !== "toSale" && type !== "toBorrow" && (
            <Box sx={{ height: 20, mb: 1 }} />
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
            fontWeight: 700,
            fontSize: "0.9rem",
            py: 1,
          }}
        >
          {t("viewDetails", "View Details")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
