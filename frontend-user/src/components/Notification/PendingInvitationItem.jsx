import {
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const PendingInvitationItem = ({ invitation, onAccept, onRefuse, formatTime }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: 1,
      borderColor: "divider",
      bgcolor: "action.hover",
      "&:hover": { bgcolor: "action.selected" },
    }}
  >
    <Stack spacing={1}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontSize: "1rem" }}>
          {invitation.fromUserId?.slice(0, 2).toUpperCase() || "??"}
        </Avatar>

        <Box flex={1}>
          <Typography variant="body2" fontWeight="medium">
            {invitation.message}
          </Typography>

          <Stack direction="row" spacing={0.5} mt={0.5}>
            <Chip label={invitation.type || "Request"} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: "0.7rem" }} />
            {invitation.metadata?.operationType && (
              <Chip label={invitation.metadata.operationType} size="small" color="secondary" variant="outlined" sx={{ height: 20, fontSize: "0.7rem" }} />
            )}
          </Stack>

          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            {formatTime(invitation.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="success" size="small" startIcon={<CheckIcon />} onClick={onAccept} fullWidth>
          Accept
        </Button>
        <Button variant="outlined" color="error" size="small" startIcon={<CloseIcon />} onClick={onRefuse} fullWidth>
          Refuse
        </Button>
      </Stack>
    </Stack>
  </Box>
);

export default PendingInvitationItem;