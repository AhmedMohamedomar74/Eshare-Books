import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Pagination,
  InputAdornment,
  Paper,
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

  // 🔍 Search by title
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

  // 🏷️ Filter by category
  const handleCategoryChange = async (selectedCategoryIds) => {
    if (selectedCategoryIds.length === 0) {
      fetchBooks();
      return;
    }
    const data = await bookService.getBooksByCategory(selectedCategoryIds[0]);
    setBooks(data);
  };

  // 💡 Filter by type
  const handleTypeChange = async (selectedType) => {
    if (!selectedType) {
      fetchBooks();
      return;
    }
    const data = await bookService.getBooksByType(selectedType);
    setBooks(data);
  };

  // 🔄 Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    fetchBooks();
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8" }}>
      <HeroSection />

      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        {/* Search Bar */}
        <Paper
          elevation={2}
          sx={{ p: 1.5, mb: 3, borderRadius: 3, bgcolor: "white" }}
        >
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
              sx: {
                height: 36,
                borderRadius: 2,
              },
            }}
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiInputBase-input": { py: 0.5 },
              bgcolor: "transparent",
            }}
          />
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Filters */}
          <Paper
            elevation={1}
            sx={{ p: 3, borderRadius: 3, bgcolor: "white", flex: "0 0 25%" }}
          >
            <Filters
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
              onClearFilters={handleClearFilters}
            />
          </Paper>

          {/* Books Grid */}
<Box sx={{ flex: 1 }}>
  <BookGrid books={books} />
  <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
    <Pagination
      count={5}
      shape="rounded"
      color="primary"
      size="large" // تكبير الأزرار
      sx={{
        '& .MuiPaginationItem-root': {
          borderRadius: 2,
          fontWeight: 'bold',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: '#1976d2',
            color: '#fff',
            transform: 'scale(1.1)',
          },
        },
        '& .Mui-selected': {
          backgroundColor: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
        },
      }}
    />
  </Box>
</Box>

        </Box>
      </Container>
    </Box>
  );
}
