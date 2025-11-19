import {
  Box,
  Stack,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const NotificationItem = ({ notification, formatTime }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: 1,
        borderColor: "divider",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1.5}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Avatar
          sx={{
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            bgcolor:
              notification.type === "acceptance"
                ? "success.main"
                : "error.main",
            fontSize: "0.9rem",
          }}
        >
          {notification.type === "acceptance" ? <CheckIcon /> : <CloseIcon />}
        </Avatar>

        <Box flex={1}>
          <Typography
            variant="body2"
            sx={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}
          >
            {notification.message}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={0.5}
            sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
          >
            {formatTime(notification.timestamp || notification.createdAt)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default NotificationItem;
