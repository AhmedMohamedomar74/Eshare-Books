import { Avatar, Box, Typography } from "@mui/material";

const BookOwner = ({ avatar, name }) => (
  <>
    <Typography fontWeight="bold" mb={1}>
      Listed By:
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar src={avatar} />
      <Box>
        <Typography sx={{ fontWeight: "bold" }}>{name || "Unknown"}</Typography>
      </Box>
    </Box>
  </>
);

export default BookOwner;
