import { Box, Button, Alert, Snackbar } from "@mui/material";
import { ChatBubbleOutline, OutlinedFlag } from "@mui/icons-material";
import { Link } from "react-router-dom";

const BookActions = ({ bookId }) => {
  return (
    <>
      {/* Buttons section */}
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

        {/* Proceed to Order */}
        <Button
          component={Link}
          to={`/order/${bookId}`}
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            backgroundColor: "#c0a427",
            color: "black",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#b39b20" },
          }}
        >
          Proceed to Order
        </Button>
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
          marginTop: "32px",
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
