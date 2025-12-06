import React, { useEffect, useState } from "react";
import { Box, Container, Pagination } from "@mui/material";

import HeroSection from "../../components/Home/HeroSection";
import BookGrid from "../../components/LandingPage/BookGridLandingpage";
import Spinner from "../../components/Spinner";
import EmptyBooksState from "../../components/Home/EmptyBooksState";
import bookService from "../../services/book.service";
import useTranslate from "../../hooks/useTranslate";

// ✅ new filters
import TopTypeTabs from "../../components/LandingPage/TopTypeTabs";
import SideCategoryFilter from "../../components/LandingPage/SideCategoryFilter";

export default function Home() {
  const { t } = useTranslate();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState({
    type: null,
    categoryId: null,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 12;
  const SEARCH_FETCH_LIMIT = 5000;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, activeFilter]);

  const fetchBooks = async (sortOption = null) => {
    try {
      setLoading(true);
      const { type, categoryId } = activeFilter;
      let list = [];

      // ✅ Search priority
      if (searchTerm.trim()) {
        const data = await bookService.getAllBooks(
          1,
          SEARCH_FETCH_LIMIT,
          searchTerm
        );
        list = data?.books || [];
      } else {
        // ✅ Filters
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
          const data = await bookService.getAllBooks(
            1,
            SEARCH_FETCH_LIMIT,
            ""
          );
          list = data?.books || [];
        }
      }

      // ✅ Apply sorting based on filter button
      if (sortOption === "latest") {
        list = list.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.CreatedAt || 0);
          const dateB = new Date(b.createdAt || b.CreatedAt || 0);
          return dateB - dateA; // Newest first
        });
      } else if (sortOption === "popular") {
        // Sort by views or favorites if available
        list = list.sort((a, b) => {
          const viewsA = a.views || a.Views || 0;
          const viewsB = b.views || b.Views || 0;
          return viewsB - viewsA;
        });
      } else if (sortOption === "trending") {
        // Sort by recent activity or combination of views and date
        list = list.sort((a, b) => {
          const scoreA = (a.views || 0) + (new Date(a.createdAt || 0).getTime() / 1000000);
          const scoreB = (b.views || 0) + (new Date(b.createdAt || 0).getTime() / 1000000);
          return scoreB - scoreA;
        });
      }

      const pages = Math.ceil(list.length / limit) || 1;
      setTotalPages(pages);

      const start = (page - 1) * limit;
      const end = start + limit;
      setBooks(list.slice(start, end));
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

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Clear all filters function
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setActiveFilter({ type: null, categoryId: null });
    setPage(1);
  };

  // ✅ Handle filter button clicks
  const handleFilterClick = (filter) => {
    setPage(1);
    fetchBooks(filter);
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* ✅ Hero + Search inside */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        onSearchSubmit={() => {
          setPage(1);
          fetchBooks();
        }}
        onFilterClick={handleFilterClick}
      />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        {/* ✅ Top Tabs Filter (All / Borrow / Sell / Donate) */}
        <TopTypeTabs
          selectedType={activeFilter.type}
          onChange={(type) => {
            setPage(1);
            setActiveFilter((prev) => ({ ...prev, type }));
          }}
        />

        {/* ✅ Layout: Sidebar LEFT + Books RIGHT */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* ✅ Sidebar Category Filter (LEFT) */}
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
              order: { xs: 2, md: 1 },
            }}
          >
            <SideCategoryFilter
              categories={categories}
              selectedCategoryId={activeFilter.categoryId}
              onChangeCategory={(categoryId) => {
                setPage(1);
                setActiveFilter((prev) => ({ ...prev, categoryId }));
              }}
              onClearAllFilters={handleClearAllFilters}
            />
          </Box>

          {/* ✅ Books Grid (RIGHT) */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              order: { xs: 1, md: 2 },
            }}
          >
            {loading ? (
              <Spinner />
            ) : books.length === 0 ? (
              <EmptyBooksState
                hasFiltersOrSearch={
                  !!searchTerm.trim() ||
                  !!activeFilter.categoryId ||
                  !!activeFilter.type
                }
                onClearFilters={handleClearAllFilters}
              />
            ) : (
              <>
                <BookGrid books={books} columns={4} bigCards />

                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
                    <Pagination
                      page={page}
                      count={totalPages}
                      onChange={handlePageChange}
                      shape="rounded"
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                          fontWeight: "bold",
                          "&.Mui-selected": {
                            bgcolor: "#22a699",
                            color: "white",
                            "&:hover": {
                              bgcolor: "#1b8b7f",
                            },
                          },
                          "&:hover": {
                            bgcolor: "#22a69915",
                          },
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