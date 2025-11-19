import React from "react";
import { Grid, Box, Chip, Typography } from "@mui/material";
import BookCard from "./BookCard";

export default function BookGrid({ books = [] }) {
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
          No books found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ width: "100%" }}>
      {books.map((book) => {
        const isBorrowedNow =
          book.TransactionType === "toBorrow" && book.isBorrowedNow;

        return (
          <Grid
            item
            key={book._id || book.id}
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {isBorrowedNow && (
                <Chip
                  label="Currently borrowed"
                  color="warning"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    fontWeight: "bold",
                  }}
                />
              )}

              <BookCard book={book} disabled={isBorrowedNow} />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
