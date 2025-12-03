import React, { useEffect, useState } from "react";
import { Box, Container, Pagination } from "@mui/material";

import HeroSection from "../../components/Home/HeroSection";
import BookGrid from "../../components/LandingPage/BookGridLandingpage";
import Spinner from "../../components/Spinner";
import EmptyBooksState from "../../components/Home/EmptyBooksState";
import bookService from "../../services/book.service";
import useTranslate from "../../hooks/useTranslate";

import CategoryCarousel from "../../components/LandingPage/CategoryCarousel";
import Footer from "../../components/LandingPage/Footer";

// ✅ new filters
import TopTypeTabs from "../../components/LandingPage/TopTypeTabs";
import SideCategoryFilter from "../../components/LandingPage/SideCategoryFilter";

export default function LandingPage() {
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

  const fetchBooks = async () => {
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
      />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        {/* ✅ Top Tabs Filter (Borrow / Sell / Donate) */}
        <TopTypeTabs
          selectedType={activeFilter.type}
          onChange={(type) => {
            setPage(1);
            setActiveFilter((prev) => ({ ...prev, type }));
          }}
        />

        {/* ✅ Categories Carousel (optional) */}
        {/* <CategoryCarousel categories={categories} /> */}
        <CategoryCarousel
  categories={categories}
  selectedCategoryId={activeFilter.categoryId}
  onSelectCategory={(categoryId) => {
    setPage(1);
    setActiveFilter((prev) => ({ ...prev, categoryId }));
  }}
/>


        {/* ✅ Layout: Sidebar LEFT + Books RIGHT */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexDirection: { xs: "column", md: "row" }, // موبايل تحت بعض
          }}
        >
          {/* ✅ Sidebar Category Filter (LEFT) */}
          <Box
            sx={{
              width: { xs: "100%", md: 340 }, // ✅ أكبر من قبل
              flexShrink: 0,
              order: { xs: 2, md: 1 }, // ✅ في الديسكتوب يبقى أول عنصر
            }}
          >
            <SideCategoryFilter
              categories={categories}
              selectedCategoryId={activeFilter.categoryId}
              onChangeCategory={(categoryId) => {
                setPage(1);
                setActiveFilter((prev) => ({ ...prev, categoryId }));
              }}
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
                onClearFilters={() => {
                  setSearchTerm("");
                  setActiveFilter({ type: null, categoryId: null });
                  setPage(1);
                }}
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
                      color="primary"
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
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

      <Footer />
    </Box>
  );
}
