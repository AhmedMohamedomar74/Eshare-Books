import React, { useRef } from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate";

const MAIN_COLOR = "#22a699";

export default function CategoryCarousel({
  categories = [],
  selectedCategoryId = null,
  onSelectCategory, // ✅ optional: لو عايزة يفلتر في نفس الصفحة
}) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const rowRef = useRef(null);

  if (!categories.length) return null;

  // ✅ سكرول لأول الكاروسيل
  const scrollToStart = () => {
    if (!rowRef.current) return;
    rowRef.current.scrollTo({ left: 0, behavior: "smooth" });
  };

  // ✅ سكرول لآخر الكاروسيل
  const scrollToEnd = () => {
    if (!rowRef.current) return;
    rowRef.current.scrollTo({
      left: rowRef.current.scrollWidth,
      behavior: "smooth",
    });
  };

  const handleClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      navigate(`/category/${catId}`);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: "white",
        mb: 4,
        border: "1px solid #eef1f5",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Typography variant="h6" fontWeight={800}>
          {t("categories", "Categories")}
        </Typography>

        {/* ✅ Arrows to START/END */}
        <Box>
          <IconButton
            onClick={scrollToStart}
            sx={{
              bgcolor: `${MAIN_COLOR}12`,
              border: `1px solid ${MAIN_COLOR}40`,
              mr: 1,
              "&:hover": {
                bgcolor: MAIN_COLOR,
                color: "#fff",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={scrollToEnd}
            sx={{
              bgcolor: `${MAIN_COLOR}12`,
              border: `1px solid ${MAIN_COLOR}40`,
              "&:hover": {
                bgcolor: MAIN_COLOR,
                color: "#fff",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Carousel Row */}
      <Box
        ref={rowRef}
        sx={{
          display: "flex",
          gap: 1.2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          pb: 1,

          // ✅ شكل الاسكرول أحسن
          "&::-webkit-scrollbar": { height: 7 },
          "&::-webkit-scrollbar-track": {
            background: "#f1f3f5",
            borderRadius: 999,
          },
          "&::-webkit-scrollbar-thumb": {
            background: MAIN_COLOR,
            borderRadius: 999,
          },
        }}
      >
        {categories.map((cat) => {
          const active = selectedCategoryId === cat._id;

          return (
            <Box
              key={cat._id}
              onClick={() => handleClick(cat._id)}
              sx={{
                cursor: "pointer",
                px: 2.2,
                py: 1.1,
                borderRadius: "999px", // ✅ دائري/كبسولة
                fontSize: "0.95rem",
                fontWeight: 800,
                whiteSpace: "nowrap",
                bgcolor: active ? MAIN_COLOR : "#f5f7fa",
                color: active ? "#fff" : "#111",

                border: active
                  ? `1.5px solid ${MAIN_COLOR}`
                  : "1.5px solid transparent",

                transition: "0.2s ease",
                "&:hover": {
                  bgcolor: MAIN_COLOR,
                  color: "#fff",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {cat.name}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
