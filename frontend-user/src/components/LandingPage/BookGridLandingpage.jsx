import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import BookCard from "./BookCardLandingpage";
import useTranslate from "../../hooks/useTranslate";

export default function BookGrid({ books = [], columns = 3, bigCards = false }) {
  const { t } = useTranslate();

  if (!books || books.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "transparent",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t("noBooksFound", "No books found.")}
        </Typography>
      </Box>
    );
  }

  const mdSize = columns === 4 ? 3 : 4;

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ width: "100%" }}>
      {books.map((book) => (
        <Grid
          item
          key={book._id || book.id}
          xs={12}
          sm={6}
          md={mdSize}
          display="flex"
          justifyContent="center"
        >
          <BookCard book={book} big={bigCards} />
        </Grid>
      ))}
    </Grid>
  );
}
