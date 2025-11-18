import { Box, Stack, Typography, Avatar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const NotificationItem = ({ notification, formatTime }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: 1,
      borderColor: "divider",
      "&:hover": { bgcolor: "action.hover" },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor:
            notification.type === "acceptance" ? "success.main" : "error.main",
          fontSize: "0.9rem",
        }}
      >
        {notification.type === "acceptance" ? <CheckIcon /> : <CloseIcon />}
      </Avatar>

      <Box flex={1}>
        <Typography variant="body2">{notification.message}</Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          {formatTime(notification.timestamp || notification.createdAt)}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

export default NotificationItem;
