import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
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
    operations, // ✅ تم إضافتها
  } = useSocketNotifications();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Notifications Center
      </Typography>

      {/* Connection Status */}
      <Box mb={3}>
        <Typography sx={{ fontWeight: "bold" }}>
          Status:{" "}
          <span style={{ color: isConnected ? "green" : "red" }}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </Typography>

        {currentUser && (
          <Typography>
            Logged in as: <b>{currentUser.firstName}</b>
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Pending Invitations */}
      <Typography variant="h5" mb={2}>
        Pending Invitations
      </Typography>

      {pendingInvitations.length === 0 && (
        <Typography>No pending invitations</Typography>
      )}

      <Stack spacing={2}>
        {pendingInvitations.map((inv) => (
          <Card key={inv.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{inv.message}</Typography>
              <Typography variant="body2" color="text.secondary">
                From user: {inv.fromUserId}
              </Typography>
              <Typography variant="body2">
                Type: {inv.transactionType}
              </Typography>

              <Stack direction="row" spacing={2} mt={2}>
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
                  variant="contained"
                  color="error"
                  onClick={() => refuseInvitation(inv.id, "Not interested")}
                >
                  Refuse
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Notifications */}
      <Typography variant="h5" mb={2}>
        Notifications
      </Typography>

      {notifications.length === 0 && (
        <Typography>No notifications received yet.</Typography>
      )}

      <Stack spacing={2}>
        {notifications.map((note, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Typography variant="h6">{note.message}</Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {note.type}
              </Typography>
              <Typography variant="body2">
                Time: {new Date(note.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Sent Invitations */}
      <Typography variant="h5" mb={2}>
        Sent Invitations
      </Typography>

      {sentInvitations.length === 0 && (
        <Typography>No sent invitations</Typography>
      )}

      <Stack spacing={2}>
        {sentInvitations.map((inv) => (
          <Card key={inv.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">Sent to user: {inv.toUserId}</Typography>
              <Typography variant="body2">
                Type: {inv.invitationType}
              </Typography>

              <Button
                variant="outlined"
                color="warning"
                sx={{ mt: 2 }}
                onClick={() => cancelInvitation(inv.id)}
              >
                Cancel Invitation
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Operations */}
      <Typography variant="h5" mb={2}>
        Operations
      </Typography>

      {operations.length === 0 && <Typography>No operations yet.</Typography>}

      <Stack spacing={2}>
        {operations.map((op) => (
          <Card key={op._id} variant="outlined">
            <CardContent>
              <Typography variant="h6">Operation ID: {op._id}</Typography>
              <Typography>Status: {op.status}</Typography>
              {op.operationType && (
                <Typography>Type: {op.operationType}</Typography>
              )}
              {op.updatedAt && (
                <Typography>
                  Updated: {new Date(op.updatedAt).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Logs */}
      <Typography variant="h5" mb={2}>
        Logs
      </Typography>

      <Box
        sx={{
          background: "#111",
          color: "white",
          p: 2,
          borderRadius: 2,
          height: 250,
          overflowY: "auto",
        }}
      >
        {logs.map((log, idx) => (
          <Typography key={idx} sx={{ mb: 1 }}>
            [{log.timestamp}] {log.message}
          </Typography>
        ))}

        <div ref={logsEndRef} />
      </Box>
    </Box>
  );
};

export default NotificationsPage;
