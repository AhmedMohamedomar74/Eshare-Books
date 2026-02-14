import { Box, Typography } from "@mui/material";
import WishlistHeartButton from "../WishlistComponents/WishlistHeartButton";

const BookHeader = ({ title, author, bookId }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <WishlistHeartButton bookId={bookId} />
      </Box>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        by {author || "Unknown Author"}
      </Typography>
    </>
  );
};

export default BookHeader;
