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

const MAIN_COLOR = "#22a699";

const typeStyles = {
  toSale: { bg: "#e8fbf6", color: "#0f766e", border: "#22a69955" },
  toBorrow: { bg: "#eaf4ff", color: "#1976d2", border: "#1976d255" },
  toDonate: { bg: "#fff7e6", color: "#d97706", border: "#f59e0b66" },
  toExchange: { bg: "#f1f5f9", color: "#334155", border: "#94a3b866" },
  Other: { bg: "#f3f4f6", color: "#374151", border: "#cbd5e166" },
};

const BookCard = ({ book, big = false, disabled = false }) => {
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

  const shortDescription =
    description.length > 90 ? description.slice(0, 90) + "..." : description;

  const chipStyle = typeStyles[type] || typeStyles.Other;

  return (
    <Card
      sx={{
        position: "relative",
        width: big ? 330 : 290,
        height: big ? 470 : 420,
        borderRadius: 3,
        bgcolor: "white",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, opacity 0.2s",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.75 : 1,
        "&:hover": {
          transform: disabled ? "none" : "translateY(-6px)",
          boxShadow: disabled
            ? "0 6px 18px rgba(0,0,0,0.08)"
            : `0 10px 28px ${MAIN_COLOR}33`,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!disabled) navigate(`/details/${id}`);
      }}
    >
      {/* Report Flag */}
      {isHovered && !disabled && (
        <Link
          to={`/reports/book/${book._id}`}
          style={{ textDecoration: "none" }}
          title={t("reportBook", "report this book")}
          onClick={(e) => e.stopPropagation()}
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
      {!disabled && (
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
      )}

      {/* Image */}
      <CardMedia
        component="img"
        image={
          imageUrl ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt={title}
        sx={{
          height: big ? 230 : 200,
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
          p: big ? 2.2 : 2,
          pb: 2,
        }}
      >
        <Box>
          <Chip
            label={t(type, type)}
            size="small"
            sx={{
              mb: 0.8,
              fontWeight: 800,
              bgcolor: chipStyle.bg,
              color: chipStyle.color,
              border: `1px solid ${chipStyle.border}`,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: big ? "1.1rem" : "1rem",
              mb: 0.6,
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
              mb: 1.2,
              fontSize: big ? "0.9rem" : "0.85rem",
              minHeight: big ? 52 : 42,
              lineHeight: 1.5,
            }}
          >
            {shortDescription}
          </Typography>

          {type === "toSale" && (
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 900, mb: 1, color: MAIN_COLOR }}
            >
              {price} {t("egp", "EGP")}
            </Typography>
          )}

          {type === "toBorrow" && (
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 900, mb: 1, color: "#1976d2" }}
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
          fullWidth
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) navigate(`/details/${id}`);
          }}
          sx={{
            borderRadius: 2.2,
            textTransform: "none",
            fontWeight: 900,
            fontSize: big ? "1rem" : "0.9rem",
            py: big ? 1.2 : 1,
            bgcolor: MAIN_COLOR,
            "&:hover": { bgcolor: "#1b8b7f" },
            "&.Mui-disabled": {
              bgcolor: "#cbd5e1",
              color: "#475569",
              fontWeight: 800,
            },
          }}
        >
          {disabled
            ? t("borrowedNow", "Borrowed Now")
            : t("viewDetails", "View Details")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
