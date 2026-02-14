import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BookOwner = ({ avatar, name, userId }) => (
  <>
    <Typography fontWeight="bold" mb={1}>
      Listed By:
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar src={avatar} />
      <Box>
        <Typography
          component={Link}
          to={`/public-profile/${userId}`}
          sx={{
            fontWeight: "bold",
            textDecoration: "none",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {name || "Unknown"}
        </Typography>
      </Box>
    </Box>
  </>
);

export default BookOwner;
