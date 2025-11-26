import { Box, Typography } from "@mui/material";

const BookInfo = ({ book }) => {
  //Helper function
  const truncateWords = (text, count) => {
    if (!text) return "";
    const words = text.split(" ");
    return (
      words.slice(0, count).join(" ") + (words.length > count ? "..." : "")
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "flex-start",
        mb: 4,
      }}
    >
      {/* Book Image */}
      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          height: 300,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <img
          src={book.image?.secure_url}
          alt={book.Title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Book Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {truncateWords(book.Title, 4)}
        </Typography>
        <Typography
          color="text.secondary"
          mb={2}
          sx={{
            minHeight: "80px",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {truncateWords(book.Description, 8)}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Category:</strong> {book.categoryId?.name || "N/A"}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Type:</strong> {book.TransactionType}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Price:</strong>{" "}
          {book.TransactionType === "toDonate"
            ? "Free"
            : book.TransactionType === "toBorrow"
            ? `${book.PricePerDay} EGP / day`
            : `${book.Price} EGP`}
        </Typography>
      </Box>
    </Box>
  );
};

export default BookInfo;
