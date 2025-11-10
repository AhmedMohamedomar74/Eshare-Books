import React, { useEffect, useState } from "react";
import {
  Box, Container, TextField, Pagination, InputAdornment, Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HeroSection from "../../components/Home/HeroSection";
import Filters from "../../components/Home/Filters";
import BookGrid from "../../components/Home/BookGrid";
import bookService from "../../services/book.service";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    const data = await bookService.getAllBooks();
    setBooks(data);
  };

  const fetchCategories = async () => {
    const cats = await bookService.getAllCategories();
    setCategories(cats);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchBooks();
    } else {
      const data = await bookService.searchBooks(value);
      setBooks(data);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    const data = await bookService.getBooksByCategory(categoryId);
    setBooks(data);
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8" }}>
      <HeroSection />

      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 1.5, mb: 5, borderRadius: 3, bgcolor: "white" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ "& fieldset": { border: "none" }, bgcolor: "transparent" }}
          />
        </Paper>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          {/* Filters */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: "white", flex: "0 0 25%" }}>
            <Filters categories={categories} onCategoryClick={handleCategoryClick} />
          </Paper>

          {/* Books Grid */}
          <Box sx={{ flex: 1 }}>
            <BookGrid books={books} />
            <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
              <Pagination count={5} shape="rounded" color="primary" />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
