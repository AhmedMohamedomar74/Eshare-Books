import {
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

const PendingInvitationItem = ({
  invitation,
  onAccept,
  onRefuse,
  formatTime,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
        "&:hover": { bgcolor: "action.selected" },
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              bgcolor: "primary.main",
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>

          <Box flex={1}>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}
            >
              {invitation.message}
            </Typography>

            <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
              <Chip
                label={invitation.type || "Request"}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              {invitation.metadata?.operationType && (
                <Chip
                  label={invitation.metadata.operationType}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={0.5}
              sx={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
            >
              {formatTime(invitation.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          sx={{ pt: 1 }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            onClick={onAccept}
            fullWidth={isMobile}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={onRefuse}
            fullWidth={isMobile}
          >
            Refuse
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PendingInvitationItem;
