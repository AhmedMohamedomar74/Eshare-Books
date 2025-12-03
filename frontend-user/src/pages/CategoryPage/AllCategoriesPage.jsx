import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/book.service";
import useTranslate from "../../hooks/useTranslate";

const MAIN_COLOR = "#22a699";

export default function AllCategoriesPage() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const cats = await bookService.getAllCategories();
        setCategories(cats || []);
      } catch (e) {
        console.error("fetch categories error", e);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const filteredCats = useMemo(() => {
    if (!query.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categories, query]);

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>
          {t("bookCategories", "Book Categories")}
        </Typography>

        {/* Search bar */}
        <Paper
          elevation={0}
          sx={{
            p: 1.2,
            borderRadius: 3,
            mb: 3,
            border: "1px solid #e6eaee",
            bgcolor: "white",
          }}
        >
          <TextField
            fullWidth
            placeholder={t("searchCategory", "Search for category")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: MAIN_COLOR }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiInputBase-input": { py: 1 },
            }}
          />
        </Paper>

        {/* Categories list */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {loading ? (
            <Typography>{t("loading", "Loading...")}</Typography>
          ) : filteredCats.length === 0 ? (
            <Typography color="text.secondary">
              {t("noCategoriesFound", "No categories found")}
            </Typography>
          ) : (
            filteredCats.map((cat) => (
              <Paper
                key={cat._id}
                onClick={() => navigate(`/category/${cat._id}`)}
                elevation={0}
                sx={{
                  p: 1.8,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  border: "1px solid #e6eaee",
                  bgcolor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: MAIN_COLOR,
                    bgcolor: `${MAIN_COLOR}0d`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <MenuBookOutlinedIcon sx={{ color: MAIN_COLOR }} />
                  <Typography fontWeight={800}>{cat.name}</Typography>
                </Box>

                <Typography
                  sx={{ color: MAIN_COLOR, fontWeight: 700, fontSize: 14 }}
                >
                  {t("viewBooks", "View Books")}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
