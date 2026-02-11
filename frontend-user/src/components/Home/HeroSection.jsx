import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useTranslate from "../../hooks/useTranslate";

const MAIN_COLOR = "#22a699";

export default function HeroSection({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  onFilterClick, // ✅ NEW prop for filter buttons
}) {
  const { t } = useTranslate();

  const images = [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearchSubmit?.();
  };

  // ✅ Filter options
  const filterButtons = [
    { label: "Trending today", filter: "trending" },
    { label: "Popular books", filter: "popular" },
    { label: "Latest books", filter: "latest" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 320, sm: 380, md: 450 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        borderRadius: 3,
        overflow: "hidden",
        mx: { xs: 1.5, md: 4 },
        mt: 3,
      }}
    >
      {/* Slider Background */}
      {images.map((img, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1s ease-in-out",
            opacity: i === activeIndex ? 1 : 0,
            transform: i === activeIndex ? "scale(1.03)" : "scale(1)",
          }}
        />
      ))}

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2, width: "100%", px: 2 }}>
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{ mb: 1, fontSize: { xs: "1.8rem", md: "2.5rem" } }}
        >
          {t("heroTitle", "Share, Donate, or Sell Your Books")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: "0.9rem", md: "1.05rem" },
          }}
        >
          {t(
            "heroSubtitle",
            "Join our community and give your books a new life. Start by listing your first book today."
          )}
        </Typography>

        {/* Search inside Hero */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          <TextField
            fullWidth
            placeholder={t("searchPlaceholder", "Search by title...")}
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: MAIN_COLOR }} />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "white",
              borderRadius: 999,
              "& fieldset": { border: "none" },
              input: { py: 1.4 },
              maxWidth: { xs: "100%", sm: 520 },
              outline: `2px solid ${MAIN_COLOR}22`,
            }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={onSearchSubmit}
            sx={{
              px: 4,
              borderRadius: 999,
              fontWeight: 900,
              textTransform: "none",
              height: 52,
              bgcolor: MAIN_COLOR,
              "&:hover": { bgcolor: "#1b8b7f" },
            }}
          >
            {t("search", "Search")}
          </Button>
        </Stack>

        
      </Box>
    </Box>
  );
}