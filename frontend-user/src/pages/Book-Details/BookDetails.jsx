import { Box, Chip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../axiosInstance/axiosInstance.js";
import Spinner from "../../components/Spinner.jsx";
import BreadcrumbNav from "../../components/Book-detalis/BreadcrumbNav.jsx";
import BookImage from "../../components/Book-detalis/BookImage.jsx";
import BookOwner from "../../components/Book-detalis/BookOwner.jsx";
import BookActions from "../../components/Book-detalis/BookActions.jsx";

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
        setBook(res.data.book);
      })
      .catch((err) => console.error("Error fetching book details:", err))
      .finally(() => setloading(false));
  }, [id]);

  if (loading) {
    return <Spinner />;
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
        <BreadcrumbNav title={book.Title} categoryId={book.categoryId} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "20px", md: "40px" },
          }}
        >
          <BookImage src={book.image?.secure_url} alt={book.Title} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {book.Title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              by {book.UserID?.name || "Unknown Author"}
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", mb: 2, flexWrap: "wrap" }}>
              <Chip
                label={book.categoryId?.name || "General"}
                variant="outlined"
              />
              <Chip
                label={getTransactionLabel(book.TransactionType)}
                color="success"
              />
            </Box>
            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />
            <Typography
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7, textAlign: "justify" }}
            >
              {book.Description}
            </Typography>
            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />
            <BookOwner avatar={book.UserID?.avatar} name={book.UserID?.name} />
            <BookActions />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetails;
