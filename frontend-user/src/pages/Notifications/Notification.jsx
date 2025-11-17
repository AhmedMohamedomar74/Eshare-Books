import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  Collapse,
  Stack,
} from "@mui/material";
import { useSocketNotifications } from "../../hooks/useSocketNotifications";

const NotificationsPage = () => {
  const {
    isConnected,
    currentUser,
    notifications,
    pendingInvitations,
    sentInvitations,
    logs,
    logsEndRef,
    acceptInvitation,
    refuseInvitation,
    cancelInvitation,
    operations,
  } = useSocketNotifications();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Notifications Center
      </Typography>

      {/* Connection Status */}
      <Box mb={3}>
        <Alert severity={isConnected ? "success" : "error"}>
          Status: {isConnected ? "Connected" : "Disconnected"}
        </Alert>
        {currentUser && (
          <Typography mt={1}>
            Logged in as: <b>{currentUser.firstName}</b>
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Pending Invitations */}
      <Typography variant="h5" mb={2}>
        Pending Invitations
      </Typography>

      {pendingInvitations.length === 0 ? (
        <Alert severity="info">No pending invitations</Alert>
      ) : (
        <Grid container spacing={2}>
          {pendingInvitations.map((inv) => (
            <Grid item xs={12} md={6} key={inv.id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {inv.message}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  From: <b>{inv.fromUserId}</b>
                </Typography>

                {/* ✅ عرض معلومات الدعوة */}
                <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                  <Chip
                    label={inv.type || inv.transactionType || "Unknown"}
                    color="primary"
                    size="small"
                  />
                  {inv.metadata?.operationId && (
                    <Chip
                      label={`Operation: ${inv.metadata.operationId.slice(-6)}`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                  {inv.metadata?.operationType && (
                    <Chip
                      label={inv.metadata.operationType}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Stack>

                {/* ✅ Actions */}
                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      acceptInvitation({
                        invitationId: inv.id,
                        userId: currentUser._id,
                        operationId: inv.metadata?.operationId,
                      })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => refuseInvitation(inv.id, "Not interested")}
                  >
                    Refuse
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Notifications */}
      <Typography variant="h5" mb={2}>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Alert severity="info">No notifications received yet.</Alert>
      ) : (
        <Grid container spacing={2}>
          {notifications.map((note, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {note.message}
                </Typography>
                <Chip
                  label={note.type}
                  color="info"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  Time:{" "}
                  {new Date(note.timestamp || note.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Sent Invitations */}
      <Typography variant="h5" mb={2}>
        Sent Invitations
      </Typography>

      {sentInvitations.length === 0 ? (
        <Alert severity="info">No sent invitations</Alert>
      ) : (
        <Grid container spacing={2}>
          {sentInvitations.map((inv) => (
            <Grid item xs={12} md={6} key={inv.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sent to user: <b>{inv.toUserId}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {inv.message}
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={inv.type || inv.invitationType || "Pending"}
                    color="secondary"
                    size="small"
                  />
                  <Chip
                    label="Waiting for response"
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => cancelInvitation(inv.id)}
                >
                  Cancel Invitation
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Operations */}
      <Typography variant="h5" mb={2}>
        Operations
      </Typography>

      {operations.length === 0 ? (
        <Alert severity="info">No operations yet.</Alert>
      ) : (
        <Grid container spacing={2}>
          {operations.map((op) => (
            <Grid item xs={12} md={6} key={op._id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Operation #{op._id.slice(-6)}
                </Typography>

                <Stack direction="row" spacing={1} mb={1}>
                  <Chip
                    label={op.status}
                    color={op.status === "completed" ? "success" : "warning"}
                    size="small"
                  />
                  <Chip
                    label={op.operationType}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  Type: {op.operationType}
                </Typography>

                {op.updatedAt && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={1}
                  >
                    Updated: {new Date(op.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Logs */}
      <Typography variant="h5" mb={2}>
        Logs
      </Typography>

      <Collapse in={true}>
        <Box
          sx={{
            backgroundColor: "#1e1e1e",
            color: "#fff",
            p: 2,
            borderRadius: 2,
            height: 250,
            overflowY: "auto",
            fontFamily: "monospace",
          }}
        >
          {logs.map((log, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                mb: 1,
                color:
                  log.type === "error"
                    ? "#ff6b6b"
                    : log.type === "success"
                    ? "#51cf66"
                    : "#fff",
              }}
            >
              [{log.timestamp}] {log.message}
            </Typography>
          ))}
          <div ref={logsEndRef} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default NotificationsPage;
