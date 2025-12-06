import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import useTranslate from "../../hooks/useTranslate";
import { useNavigate } from "react-router-dom";

const MAIN_COLOR = "#22a699";

export default function SideCategoryFilter({
  categories = [],
  selectedCategoryId,
  onChangeCategory,
}) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const filteredCats = useMemo(() => {
    if (!query.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categories, query]);

  const handleClearAll = () => {
    setQuery("");
    onChangeCategory?.(null);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.2,
        borderRadius: 2,          // ✅ أقل rounded
        bgcolor: "white",
        height: "fit-content",
        position: "sticky",
        top: 90,
        border: "1px solid #eef1f5",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h6" fontWeight={800}>
          {t("bookCategories", "Book Categories")}
        </Typography>

        <IconButton
          size="small"
          onClick={handleClearAll}
          sx={{
            color: MAIN_COLOR,
            "&:hover": { bgcolor: `${MAIN_COLOR}15` },
          }}
        >
          <ClearIcon />
        </IconButton>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder={t("searchCategory", "Search category...")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,      // ✅ بدل 999px
            bgcolor: "#f7f9fb",
          },
        }}
      />

      <Divider sx={{ mb: 1.5 }} />

      {/* List */}
      <Box sx={{ maxHeight: 600, overflowY: "auto", pr: 0.5 }}>
        {/* All Categories */}
        <Box
          onClick={() => onChangeCategory?.(null)}
          sx={{
            cursor: "pointer",
            px: 1.5,
            py: 1.2,
            borderRadius: 2,     // ✅ أقل rounded
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: !selectedCategoryId ? `${MAIN_COLOR}15` : "transparent",
            border: !selectedCategoryId
              ? `1.5px solid ${MAIN_COLOR}`
              : "1.5px solid transparent",
            transition: "0.2s ease",
            "&:hover": {
              bgcolor: `${MAIN_COLOR}12`,
              borderColor: MAIN_COLOR,
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: MAIN_COLOR,
                opacity: !selectedCategoryId ? 1 : 0.5,
              }}
            />
            <Typography fontWeight={800}>
              {t("allCategories", "All Categories")}
            </Typography>
          </Box>

          <MenuBookOutlinedIcon sx={{ fontSize: 18, color: MAIN_COLOR }} />
        </Box>

        {/* Categories */}
        {filteredCats.map((cat) => {
          const active = selectedCategoryId === cat._id;

          return (
            <Box
              key={cat._id}
              onClick={() => onChangeCategory?.(cat._id)}
              sx={{
                cursor: "pointer",
                px: 1.5,
                py: 1.15,
                mt: 0.8,
                borderRadius: 2,  // ✅ أقل rounded
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: active ? `${MAIN_COLOR}18` : "transparent",
                border: active
                  ? `1.5px solid ${MAIN_COLOR}`
                  : "1.5px solid transparent",
                transition: "0.2s ease",
                "&:hover": {
                  bgcolor: `${MAIN_COLOR}12`,
                  borderColor: MAIN_COLOR,
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: MAIN_COLOR,
                    opacity: active ? 1 : 0.5,
                  }}
                />
                <Typography
                  fontWeight={active ? 900 : 700}
                  sx={{ fontSize: "0.95rem" }}
                >
                  {cat.name}
                </Typography>
              </Box>

              <MenuBookOutlinedIcon sx={{ fontSize: 18, color: MAIN_COLOR }} />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
