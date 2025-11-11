import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
  Divider,
  Button,
} from "@mui/material";

export default function Filters({
  categories = [],
  onCategoryChange,
  onTypeChange,
  onPriceChange,
  onClearFilters,
}) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    const updatedCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((c) => c !== value);

    setSelectedCategories(updatedCategories);
    onCategoryChange?.(updatedCategories);
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    onTypeChange?.(type);
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedType("");
    setPriceRange([0, 100]);
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

      {/* Category Filter */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Category
      </Typography>

      <FormGroup sx={{ mb: 2 }}>
        {categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No categories found
          </Typography>
        ) : (
          categories.map((cat) => (
            <FormControlLabel
              key={cat._id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat._id)}
                  onChange={handleCategoryChange}
                  value={cat._id}
                  size="small"
                />
              }
              label={<Typography variant="body2">{cat.name}</Typography>}
            />
          ))
        )}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Type Filter */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Transaction Type
      </Typography>
      <RadioGroup value={selectedType} onChange={handleTypeChange}>
        {["toSale", "toBorrow",   "toDonate"].map((type) => (
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
