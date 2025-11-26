import { Box, Button } from "@mui/material";
import { OutlinedFlag } from "@mui/icons-material";
import { Link } from "react-router-dom";

const BookActions = ({ bookId }) => {
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
        {/* ✅ Proceed to Order دايمًا شغال */}
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
            py: 1.5,
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
