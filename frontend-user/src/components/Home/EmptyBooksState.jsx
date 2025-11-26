import React from "react";
import { Paper, Typography, Button } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

export default function EmptyBooksState({
  hasFiltersOrSearch = false,
  onClearFilters,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: { xs: 4, md: 13 },
        borderRadius: 4,
        textAlign: "center",
        bgcolor: "white",
        border: "1px dashed #d0d7de",
      }}
    >
      <MenuBookOutlinedIcon
        sx={{ fontSize: 70, color: "primary.main", mb: 1 }}
      />

      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        No books found 📚
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {hasFiltersOrSearch
          ? "Try changing your search or filters to see more results."
          : "There are no books available right now. Check back later!"}
      </Typography>

      {hasFiltersOrSearch && (
        <Button
          variant="contained"
          onClick={onClearFilters}
          sx={{ px: 4, py: 1.2, borderRadius: 2 }}
        >
          Clear Search & Filters
        </Button>
      )}
    </Paper>
  );
}
