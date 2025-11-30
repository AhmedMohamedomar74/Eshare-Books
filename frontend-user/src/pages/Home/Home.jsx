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
import Spinner from "../../components/Spinner";
import EmptyBooksState from "../../components/Home/EmptyBooksState";
import bookService from "../../services/book.service";
import useTranslate from "../../hooks/useTranslate";

export default function Home() {
  const { t } = useTranslate();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 9;
  const SEARCH_FETCH_LIMIT = 5000;

  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState({
    type: null,
    categoryId: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeFilter, searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const { type, categoryId } = activeFilter;
      let list = [];

      if (searchTerm.trim()) {
        const data = await bookService.getAllBooks(
          1,
          SEARCH_FETCH_LIMIT,
          searchTerm
        );
        list = data?.books || [];
      } else {
        if (type && categoryId) {
          const data = await bookService.getBooksByCategory(categoryId);
          list = (data || []).filter(
            (b) => (b.TransactionType || b.type) === type
          );
        } else if (categoryId) {
          list = (await bookService.getBooksByCategory(categoryId)) || [];
        } else if (type) {
          list = (await bookService.getBooksByType(type)) || [];
        } else {
          const data = await bookService.getAllBooks(page, limit, "");
          setBooks((data?.books || []).slice(0, limit));

          const pages = Math.ceil(
            (data?.total || 0) / (data?.limit || limit)
          );
          setTotalPages(pages || 1);
          return;
        }
      }

      if (categoryId) {
        list = list.filter(
          (b) => (b.categoryId?._id || b.categoryId) === categoryId
        );
      }

      if (type) {
        list = list.filter(
          (b) => (b.TransactionType || b.type) === type
        );
      }

      const pages = Math.ceil(list.length / limit) || 1;
      setTotalPages(pages);

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      setBooks(list.slice(startIndex, endIndex));
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await bookService.getAllCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

  const handleCategoryChange = (catId) => {
    setPage(1);
    setActiveFilter((prev) => ({
      ...prev,
      categoryId: catId || null,
    }));
  };

  const handleTypeChange = (selectedType) => {
    setPage(1);
    setActiveFilter((prev) => ({
      ...prev,
      type: selectedType || null,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setActiveFilter({ type: null, categoryId: null });
    setPage(1);
  };

  const handlePageChange = (_, value) => {
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
            placeholder={t("searchPlaceholder", "Search by title...")}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { height: 40, borderRadius: 2 },
            }}
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiInputBase-input": { py: 0.8 },
              bgcolor: "transparent",
            }}
          />
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            alignItems: "stretch",
            overflowX: { xs: "auto", md: "visible" },
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
              minWidth: 340,
              height: "100%",
              minHeight: "185vh",
            }}
          >
            <Filters
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
              onClearFilters={handleClearFilters}
              selectedCategoryId={activeFilter.categoryId}
              selectedType={activeFilter.type}
            />
          </Paper>

          {/* Books Grid + Pagination */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Spinner />
            ) : books.length === 0 ? (
              <EmptyBooksState
                hasFiltersOrSearch={
                  !!searchTerm.trim() ||
                  !!activeFilter.categoryId ||
                  !!activeFilter.type
                }
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                <BookGrid books={books} />

                {totalPages > 1 && (
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
                            transform: "scale(1.06)",
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
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
