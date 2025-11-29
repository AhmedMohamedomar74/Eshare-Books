import { Box, Typography, Divider, Chip } from "@mui/material";
import { useSelector } from "react-redux";

const BookInfo = ({ book }) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        alignItems: "flex-start",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: { xs: "100%", md: 260 },
          height: { xs: 260, md: 320 },
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#f5f5f5",
          flexShrink: 0,
        }}
      >
        <img
          src={book.image?.secure_url}
          alt={book.Title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={800} mb={1}>
          {book.Title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip
            label={book.categoryId?.name || content.notAvailable}
            size="small"
          />
          <Chip
            label={content[book.TransactionType]}
            size="small"
            color="success"
          />

          <Chip
            label={
              book.TransactionType === "toDonate"
                ? content.free
                : book.TransactionType === "toBorrow"
                ? `${book.PricePerDay} ${content.currency} / ${content.perDay}`
                : `${book.Price} ${content.currency}`
            }
            size="small"
            color="warning"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/*  Description  */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.8,
            fontSize: "0.95rem",
            whiteSpace: "pre-line",
          }}
        >
          {book.Description || content.noDescription}
        </Typography>
      </Box>
    </Box>
  );
};

export default BookInfo;
