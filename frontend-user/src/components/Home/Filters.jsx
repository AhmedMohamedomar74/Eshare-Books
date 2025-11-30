import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Button,
} from "@mui/material";
import useTranslate from "../../hooks/useTranslate";

export default function Filters({
  categories = [],
  onCategoryChange,
  onTypeChange,
  onClearFilters,

  // ✅ controlled values from Home
  selectedCategoryId = null,
  selectedType = null,
}) {
  const { t } = useTranslate();

  const handleCategoryChange = (event) => {
    const catId = event.target.value; // "" أو id
    onCategoryChange?.(catId);
  };

  const handleTypeChange = (event) => {
    const type = event.target.value; // "" أو toSale/toBorrow/toDonate
    onTypeChange?.(type);
  };

  const handleClear = () => {
    onClearFilters?.();
  };

  return (
    <Box
      sx={{
        p: 2.5,
        width: 250,
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fff",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("filters", "Filters")}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleClear}
          sx={{
            color: "primary.main",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          {t("clearFilters", "Clear Filters")}
        </Button>
      </Box>

      {/* Category */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
        {t("category", "Category")}
      </Typography>

      <Box
        sx={{
          maxHeight: 270,
          overflowY: "auto",
          mb: 2,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
        }}
      >
        {/* ✅ controlled value */}
        <RadioGroup
          value={selectedCategoryId || ""}
          onChange={handleCategoryChange}
        >
          <FormControlLabel
            value=""
            control={<Radio size="small" />}
            label={
              <Typography variant="body2">
                {t("allCategories", "All Categories")}
              </Typography>
            }
          />

          {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("noCategoriesFound", "No categories found")}
            </Typography>
          ) : (
            categories.map((cat) => (
              <FormControlLabel
                key={cat._id}
                value={cat._id}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{cat.name}</Typography>}
              />
            ))
          )}
        </RadioGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Type */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
        {t("transactionType", "Transaction Type")}
      </Typography>

      {/* ✅ controlled value */}
      <RadioGroup value={selectedType || ""} onChange={handleTypeChange}>
        <FormControlLabel
          value=""
          control={<Radio size="small" />}
          label={
            <Typography variant="body2">
              {t("allTypes", "All Types")}
            </Typography>
          }
        />

        {["toSale", "toBorrow", "toDonate"].map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio size="small" />}
            label={<Typography variant="body2">{t(type, type)}</Typography>}
          />
        ))}
      </RadioGroup>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
