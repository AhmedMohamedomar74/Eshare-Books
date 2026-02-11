import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import useTranslate from "../../hooks/useTranslate";

const MAIN_COLOR = "#22a699";

export default function EmptyBooksState({
  hasFiltersOrSearch = false,
  onClearFilters,
}) {
  const { t } = useTranslate();

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: { xs: 6, md: 16 },
        borderRadius: 4,
        textAlign: "center",
        bgcolor: "white",
        border: `2px dashed ${MAIN_COLOR}44`,
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: `${MAIN_COLOR}15`,
          borderRadius: "50%",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <MenuBookOutlinedIcon
          sx={{ fontSize: 80, color: MAIN_COLOR }}
        />
      </Box>

      <Typography 
        variant="h4" 
        fontWeight={800} 
        sx={{ 
          mb: 2,
          color: "#111827",
          fontSize: { xs: "1.8rem", md: "2.2rem" }
        }}
      >
        {t("noBooksTitle", "No books found 📚")}
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: 4,
          fontSize: { xs: "1rem", md: "1.1rem" },
          maxWidth: 500,
          lineHeight: 1.7,
        }}
      >
        {hasFiltersOrSearch
          ? t("noBooksWithFilters", "Try changing your search or filters to see more results.")
          : t("noBooksNoFilters", "There are no books available right now. Check back later!")}
      </Typography>

      {hasFiltersOrSearch && (
        <Button
          variant="contained"
          onClick={onClearFilters}
          sx={{ 
            px: 5, 
            py: 1.5, 
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "1rem",
            textTransform: "none",
            bgcolor: MAIN_COLOR,
            "&:hover": { 
              bgcolor: "#1b8b7f",
              transform: "translateY(-2px)",
              boxShadow: `0 6px 20px ${MAIN_COLOR}44`,
            },
            transition: "all 0.3s ease",
          }}
        >
          {t("clearSearchFilters", "Clear Search & Filters")}
        </Button>
      )}
    </Paper>
  );
}