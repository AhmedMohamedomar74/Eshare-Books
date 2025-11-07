import { Box, Button } from "@mui/material";
import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  OutlinedFlag,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const BookActions = () => (
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
        sx={{
          textTransform: "none",
          backgroundColor: "#f5f5dc",
          borderColor: "#c0a427ff",
          color: "black",
          fontWeight: "bold",
        }}
      >
        Add to Wishlist
      </Button>
    </Box>

    <Box
      component={Link}
      to="/report"
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
      }}
    >
      <OutlinedFlag sx={{ fontSize: "18px" }} />
      Report this book
    </Box>
  </>
);

export default BookActions;
