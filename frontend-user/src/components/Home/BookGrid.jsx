import React from "react";
import { Grid } from "@mui/material";
import BookCard from "./BookCard";

export default function BookGrid({ books }) {
  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      sx={{
        width: "100%",
      }}
    >
      {books.map((book, index) => (
        <Grid
          item
          key={index}
          xs={12}   // شاشة صغيرة: كارت واحد في الصف
          sm={6}    // شاشة متوسطة: كارتين في الصف
          md={4}    // شاشة كبيرة: 3 كروت في الصف
          display="flex"
          justifyContent="center"
        >
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
}
