import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import bookService from "../../services/book.service";
import BookGrid from "../../components/LandingPage/BookGridLandingpage";
import Spinner from "../../components/Spinner";
import EmptyBooksState from "../../components/Home/EmptyBooksState";

export default function CategoryPage() {
  const { catId } = useParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBooksByCategory(catId);
        setBooks(data || []);

        // لو الـ backend بيرجع categoryId populated
        if (data?.length && data[0]?.categoryId?.name) {
          setCategoryName(data[0].categoryId.name);
        }
      } catch (err) {
        console.error("Error fetching category books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (catId) fetchCategoryBooks();
  }, [catId]);

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          {categoryName ? categoryName : "Category Books"}
        </Typography>

        {loading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <EmptyBooksState hasFiltersOrSearch={false} />
        ) : (
          <BookGrid books={books} />
        )}
      </Container>
    </Box>
  );
}
