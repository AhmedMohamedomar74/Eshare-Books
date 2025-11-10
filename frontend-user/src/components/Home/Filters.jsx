import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  Button,
} from "@mui/material";

export default function Filters({ categories, onCategoryClick }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>

      {categories.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No categories found
        </Typography>
      ) : (
        categories.map((cat) => (
          <Button
            key={cat._id}
            variant="outlined"
            fullWidth
            sx={{ mb: 1, textTransform: "none" }}
            onClick={() => onCategoryClick(cat._id)}
          >
            {cat.name}
          </Button>
        ))
      )}
    </Box>
  );
}

