import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BookOwner = ({ avatar, name, userId }) => {
  const { content } = useSelector((state) => state.lang);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check if this is the current user's profile
  const isCurrentUser = isAuthenticated && user?.id === userId;

  // Determine the correct profile link
  const profileLink = isCurrentUser ? "/profile" : `/public-profile/${userId}`;

  return (
    <>
      <Typography fontWeight="bold" mb={1}>
        {content.listedBy}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar src={avatar} />
        <Box>
          <Typography
            component={Link}
            to={profileLink}
            sx={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {name || content.unknown}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default BookOwner;
