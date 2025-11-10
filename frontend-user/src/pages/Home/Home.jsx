import React from "react";
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

export default function Home() {
  const books = [
    {
      title: "The Mind of a Leader",
      author: "Kevin Anderson",
      type: "For Sale",
      price: "12.99",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      type: "Donate",
      image: "https://images.unsplash.com/photo-1544717305-996b815c338c",
    },
    {
      title: "Fairy Tales",
      author: "Hans Christian Andersen",
      type: "Borrow",
      image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4",
    },
    {
      title: "The Classics Collection",
      author: "Various Authors",
      type: "For Sale",
      price: "45.00",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    },
    {
      title: "A Reader’s Journal",
      author: "Jane Doe",
      type: "Donate",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    },
    {
      title: "Colorful Stories",
      author: "John Smith",
      type: "For Sale",
      price: "9.50",
      image: "https://images.unsplash.com/photo-1528209392021-b781a9c131c5",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      type: "For Sale",
      price: "14.99",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      type: "Borrow",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383",
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      type: "For Sale",
      price: "18.75",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    },
    {
      title: "The Art of Happiness",
      author: "Dalai Lama",
      type: "Donate",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      type: "For Sale",
      price: "22.50",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    },
    {
      title: "Educated",
      author: "Tara Westover",
      type: "Borrow",
      image: "https://images.unsplash.com/photo-1526318472351-bc6fa96b1f1a",
    },
    {
      title: "Man’s Search for Meaning",
      author: "Viktor Frankl",
      type: "Donate",
      image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383",
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      type: "For Sale",
      price: "27.99",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      type: "Donate",
      image: "https://images.unsplash.com/photo-1544717305-996b815c338c",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f4f6f8" }}>
      {/* Hero Section */}
      <HeroSection />

      <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
        {/* Search Bar */}
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            mb: 5,
            borderRadius: 3,
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, author, or ISBN..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& fieldset": { border: "none" },
              bgcolor: "transparent",
            }}
          />
        </Paper>

        {/* Filters + Books side by side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          {/* Sidebar Filters */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "white",
              position: "sticky",
              top: 100,
              flex: "0 0 25%", // sidebar width
              height: "fit-content",
            }}
          >
            <Filters />
          </Paper>

          {/* Books Grid */}
          <Box sx={{ flex: 1 }}>
            <BookGrid books={books} />

            {/* Pagination */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 5 }}
            >
              <Pagination count={5} shape="rounded" color="primary" />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
