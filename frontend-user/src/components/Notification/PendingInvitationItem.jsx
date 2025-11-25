import {
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";

const PendingInvitationItem = ({
  invitation,
  onAccept,
  onRefuse,
  formatTime,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
  const [reason, setReason] = useState("");

  const handleRefuseClick = () => {
    setOpenRefuseDialog(true);
  };

  const handleConfirmRefuse = () => {
    if (reason.trim().length === 0) return;

    onRefuse(reason);
    setOpenRefuseDialog(false);
    setReason("");
  };

  return (
    <>
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
              onClick={() =>
                onAccept(invitation.id, invitation.metadata?.operationId)
              }
              fullWidth={isMobile}
            >
              Accept
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseIcon />}
              onClick={handleRefuseClick}
              fullWidth={isMobile}
            >
              Refuse
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={openRefuseDialog}
        onClose={() => setOpenRefuseDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Write the reason for refusal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefuseDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmRefuse}
          >
            Send Refusal
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingInvitationItem;
