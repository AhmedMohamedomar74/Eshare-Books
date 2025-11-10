import { Box, Button, Alert, Snackbar } from "@mui/material";
import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  OutlinedFlag,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addToWishlist } from "../../redux/slices/wishlist.slice";

const BookActions = ({ bookId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.wishlist);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToWishlist = async () => {
    try {
      const result = await dispatch(addToWishlist(bookId));
      if (result.meta.requestStatus === "fulfilled") {
        setMessage("Book added to wishlist!");
      } else {
        setMessage("Failed to add book to wishlist.");
      }
    } catch {
      setMessage("Something went wrong.");
    }
    setOpenSnackbar(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "15px",
          mt: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<ChatBubbleOutline />}
          sx={{
            backgroundColor: "#2e7d32",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Contact Owner
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<FavoriteBorderOutlined sx={{ color: "black" }} />}
          onClick={handleAddToWishlist}
          disabled={loading}
          sx={{
            textTransform: "none",
            backgroundColor: "#f5f5dc",
            borderColor: "#c0a427ff",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {loading ? "Adding..." : "Add to Wishlist"}
        </Button>
      </Box>

      {/* Report Link */}
      <Box
        component={Link}
        to={`/reports/book/${bookId}`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "0.8rem",
          color: "#0e0101",
          marginTop: "32px",
          fontWeight: "bold",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <OutlinedFlag sx={{ fontSize: "18px" }} />
        Report this book
      </Box>

      {/* Snackbar Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.includes("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookActions;
