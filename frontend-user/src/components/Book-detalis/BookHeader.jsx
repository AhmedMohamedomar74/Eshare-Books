import { Box, Typography } from "@mui/material";
import WishlistHeartButton from "../WishlistComponents/WishlistHeartButton";
import { useSelector } from "react-redux";

const BookHeader = ({ title, author, bookId }) => {
  const { content } = useSelector((state) => state.lang);
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
        {content.by} {author || content.unknownAuthor}
      </Typography>
    </>
  );
};

export default BookHeader;
