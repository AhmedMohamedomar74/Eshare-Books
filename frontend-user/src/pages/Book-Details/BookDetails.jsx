import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  OutlinedFlag,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../axiosInstance/axiosInstance.js";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setloading] = useState(true);

  const getTransactionLabel = (type) => {
    switch (type) {
      case "toSale":
        return `For Sale: $${book.Price}`;
      case "toBorrow":
        return "Available to Borrow";
      case "toExchange":
        return "Available to Exchange";
      case "toDonate":
        return "Free to Donate";
      default:
        return "";
    }
  };

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => {
        console.log(res.data.book);
        setBook(res.data.book);
      })

      .catch((err) => console.error("Error fetching book details:", err))
      .finally(() => setloading(false));
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!book) {
    return (
      <Typography textAlign="center" mt={5} color="error">
        Book not found or unavailable.
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: { xs: "20px 10px", md: "50px 20px" },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: "0.9rem" }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            to={`/category/${book.categoryId?._id || book.categoryId}`}
            underline="hover"
            color="inherit"
          >
            {book.categoryId?.name || "Category"}
          </MuiLink>
          <Typography color="text.primary">{book.Title}</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "20px", md: "40px" },
          }}
        >
          {/* Book Image */}
          <Box
            component="img"
            src={book.image?.secure_url}
            alt={book.Title}
            sx={{
              width: { xs: "100%", sm: "250px", md: "300px" },
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />

          {/* Book Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {book.Title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              by {book.UserID?.name || "Unknown Author"}
            </Typography>

            {/* Category + Price */}
            <Box sx={{ display: "flex", gap: "10px", mb: 2, flexWrap: "wrap" }}>
              <Chip
                label={book.categoryId?.name || "General"}
                variant="outlined"
              />
              <Chip
                label={getTransactionLabel(book.TransactionType, book.Price)}
                color="success"
              />
            </Box>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            {/* Description */}
            <Typography
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7, textAlign: "justify" }}
            >
              {book.Description}
            </Typography>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            {/* Owner Info */}
            <Typography fontWeight="bold" mb={1}>
              Listed By:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar src={book.UserID?.avatar} />
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {book.UserID?.name || "Unknown"}
                </Typography>
              </Box>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                mt: 4,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<ChatBubbleOutline />}
                sx={{
                  backgroundColor: "#2e7d32",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Contact Owner
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FavoriteBorderOutlined sx={{ color: "black" }} />}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#f5f5dc",
                  borderColor: "#c0a427ff",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Add to Wishlist
              </Button>
            </Box>

            {/* Report Link */}
            <Box
              component={Link}
              to="/report"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "0.8rem",
                color: "#0e0101",
                marginTop: "32px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <OutlinedFlag sx={{ fontSize: "18px" }} />
              Report this book
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetails;
