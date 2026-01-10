import { Box } from "@mui/material";

const BookImage = ({ src, alt }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: { xs: "100%", sm: "250px", md: "300px" },
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    }}
  />
);

export default BookImage;
