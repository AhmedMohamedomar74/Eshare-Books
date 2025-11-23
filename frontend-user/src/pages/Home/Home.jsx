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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [activeFilter, setActiveFilter] = useState({
    type: null,
    categoryId: null,
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchBooks = async () => {
    if (activeFilter.type) {
      const data = await bookService.getBooksByType(activeFilter.type);
      setBooks(data || []);
      setTotalPages(1);
      return;
    }

    if (activeFilter.categoryId) {
      const data = await bookService.getBooksByCategory(activeFilter.categoryId);
      setBooks(data || []);
      setTotalPages(1);
      return;
    }

    const data = await bookService.getAllBooks(page, limit, searchTerm);
    setBooks(data?.books || []);
    const pages = Math.ceil((data?.total || 0) / (data?.limit || limit));
    setTotalPages(pages || 1);
  };

  const fetchCategories = async () => {
    const cats = await bookService.getAllCategories();
    setCategories(cats || []);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    setActiveFilter({ type: null, categoryId: null });

    const data = await bookService.getAllBooks(1, limit, value);
    setBooks(data?.books || []);
    const pages = Math.ceil((data?.total || 0) / (data?.limit || limit));
    setTotalPages(pages || 1);
  };

  const handleCategoryChange = async (selectedCategoryIds) => {
    if (selectedCategoryIds.length === 0) {
      setActiveFilter((prev) => ({ ...prev, categoryId: null }));
      setPage(1);
      fetchBooks();
      return;
    }

    const catId = selectedCategoryIds[0];
    setActiveFilter({ type: null, categoryId: catId });
    setPage(1);

    const data = await bookService.getBooksByCategory(catId);
    setBooks(data || []);
    setTotalPages(1);
  };

  const handleTypeChange = async (selectedType) => {
    if (!selectedType) {
      setActiveFilter((prev) => ({ ...prev, type: null }));
      setPage(1);
      fetchBooks();
      return;
    }

    setActiveFilter({ type: selectedType, categoryId: null });
    setPage(1);

    const data = await bookService.getBooksByType(selectedType);
    setBooks(data || []);
    setTotalPages(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveFilter({ type: null, categoryId: null });
    setPage(1);
    fetchBooks();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {/* ✅ Layout: Filters always beside cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", // ✅ always row, even on xs
            gap: 3,
            alignItems: "flex-start",
            overflowX: { xs: "auto", md: "visible" }, // ✅ horizontal scroll on small screens
          }}
        >
          {/* Filters */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "white",
              flex: "0 0 280px",
              minWidth: 320,
            }}
          >
            <Filters
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
              onClearFilters={handleClearFilters}
            />
          </Paper>

          {/* Books Grid + Pagination */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <BookGrid books={books} />

            <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
              <Pagination
                page={page}
                count={totalPages}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: "bold",
                    color: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      transform: "scale(1.1)",
                    },
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold",
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
