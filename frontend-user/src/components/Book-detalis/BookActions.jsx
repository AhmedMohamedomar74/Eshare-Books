import { Box, Button } from "@mui/material";
import { ChatBubbleOutline, OutlinedFlag } from "@mui/icons-material";
import { Link } from "react-router-dom";

const BookActions = ({ bookId, disabled = false }) => {
  return (
    <>
      {/* Buttons section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        {/* Contact Owner (currently disabled) */}
        {/* <Button
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
        </Button> */}

        {/* Proceed to Order */}
        {disabled ? (
          // ⛔ If the book is currently borrowed → button disabled and not a link
          <Button
            variant="contained"
            disabled
            sx={{
              textTransform: "none",
              backgroundColor: "#bdbdbd",
              color: "#555",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#bdbdbd" },
            }}
          >
            Not available now
          </Button>
        ) : (
          // ✅ Normal case → book is available
          <Button
            component={Link}
            to={`/order/${bookId}`}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#c0a427",
              color: "black",
              fontWeight: "bold",
              px: 3,
              "&:hover": { backgroundColor: "#b39b20" },
            }}
          >
            Proceed to Order
          </Button>
        )}
      </Box>

      {/* Report */}
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
          marginTop: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <OutlinedFlag sx={{ fontSize: "18px" }} />
        Report this book
      </Box>
    </>
  );
};

export default BookActions;
