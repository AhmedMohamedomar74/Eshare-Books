import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Button,
} from "@mui/material";

export default function Filters({
  categories = [],
  onCategoryChange,
  onTypeChange,
  onClearFilters,
}) {
  // ✅ بقي اختيار واحد زي الـ type
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleCategoryChange = (event) => {
    const catId = event.target.value; // "" أو id
    setSelectedCategory(catId);
    onCategoryChange?.(catId); // ✅ بيرجع قيمة واحدة مش array
  };

  const handleTypeChange = (event) => {
    const type = event.target.value; // "" أو toSale/toBorrow/toDonate
    setSelectedType(type);
    onTypeChange?.(type);
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedType("");
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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleClear}
          sx={{
            color: "primary.main",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* ✅ Category Filter (Radio زي Transaction Type) */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Category
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
        <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
          {/* All categories */}
          <FormControlLabel
            value=""
            control={<Radio size="small" />}
            label={<Typography variant="body2">All Categories</Typography>}
          />

          {categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No categories found
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

      {/* ✅ Type Filter */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Transaction Type
      </Typography>

      <RadioGroup value={selectedType} onChange={handleTypeChange}>
        {/* All types */}
        <FormControlLabel
          value=""
          control={<Radio size="small" />}
          label={<Typography variant="body2">All Types</Typography>}
        />

        {["toSale", "toBorrow", "toDonate"].map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio size="small" />}
            label={
              <Typography variant="body2">
                {type.replace("to", "To ")}
              </Typography>
            }
          />
        ))}
      </RadioGroup>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
