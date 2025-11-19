import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { useSocketNotifications } from "../../hooks/useSocketNotifications";


export default function NotificationPage() {
  const {
    isConnected,
    logs,
    logsEndRef,
    notifications,
    pendingInvitations,
    sentInvitations,
    acceptInvitation,
    refuseInvitation,
    cancelInvitation,
  } = useSocketNotifications();

  return (
    <Box sx={{ p: 3, display: "grid", gap: 3 }}>
      {/* Connection Status */}
      <Card
        sx={{
          borderLeft: "5px solid",
          borderColor: isConnected ? "green" : "red",
        }}
      >
        <CardContent>
          <Typography variant="h6">Socket Status</Typography>
          <Chip
            label={isConnected ? "Connected 🟢" : "Disconnected 🔴"}
            color={isConnected ? "success" : "error"}
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent>
          <Typography variant="h6">Notifications</Typography>
          <List>
            {notifications.length === 0 && (
              <Typography sx={{ mt: 2 }}>No notifications yet…</Typography>
            )}
            {notifications.map((n, i) => (
              <React.Fragment key={i}>
                <ListItem>
                  <ListItemText
                    primary={n.message || "New Notification"}
                    secondary={new Date(n.timestamp).toLocaleString()}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardContent>
          <Typography variant="h6">Pending Invitations</Typography>
          <List>
            {pendingInvitations.length === 0 && (
              <Typography>No pending invitations</Typography>
            )}

            {pendingInvitations.map((inv) => (
              <React.Fragment key={inv._id || inv.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => acceptInvitation(inv.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => refuseInvitation(inv.id, "No reason")}
                      >
                        Refuse
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`From user: ${inv.fromUserId}`}
                    secondary={inv.message}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Sent Invitations */}
      <Card>
        <CardContent>
          <Typography variant="h6">Sent Invitations</Typography>
          <List>
            {sentInvitations.length === 0 && (
              <Typography>No sent invitations</Typography>
            )}

            {sentInvitations.map((inv) => (
              <React.Fragment key={inv._id || inv.id}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => cancelInvitation(inv.id)}
                    >
                      Cancel
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`To user: ${inv.toUserId}`}
                    secondary={inv.message}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardContent>
          <Typography variant="h6">System Logs</Typography>

          <Box
            sx={{
              background: "#111",
              color: "#0f0",
              fontFamily: "monospace",
              height: 200,
              overflowY: "auto",
              p: 2,
            }}
          >
            {logs.map((log, i) => (
              <div key={i}>
                <span>[{log.timestamp}] </span>
                <span>{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
