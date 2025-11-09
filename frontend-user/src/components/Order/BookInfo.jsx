import { Box, Typography } from "@mui/material";

const BookInfo = ({ book }) => {
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
          {book.Title}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {book.Description}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Category:</strong> {book.categoryId?.name || "N/A"}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Type:</strong> {book.TransactionType}
        </Typography>
        <Typography variant="body1" mb={1}>
          <strong>Price:</strong>{" "}
          {book.TransactionType === "toDonate" ? "Free" : `${book.Price} EGP`}
        </Typography>
      </Box>
    </Box>
  );
};

export default BookInfo;