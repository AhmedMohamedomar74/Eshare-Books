// useSocketNotifications.js
import { useState, useEffect, useRef, useCallback } from "react";
import { socketService } from "../services/Soket_Io/socketService.js";

export const useSocketNotifications = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [paymentQueue, setPaymentQueue] = useState([]);

  const logsEndRef = useRef(null);

  // Logging function
  const addLog = useCallback((message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    socketService.connect();

    // Connection events
    const handleConnectionChange = ({ isConnected, reason }) => {
      setIsConnected(isConnected);
      if (!isConnected) {
        addLog(`🔴 Disconnected: ${reason}`, "error");
      } else {
        addLog("🟢 Connected to server", "success");
      }
    };

    const handleConnectionError = ({ error }) => {
      addLog(`❌ Connection error: ${error.message}`, "error");
    };

    const handleUserConnected = (data) => {
      setCurrentUser(data.user);
      addLog(`✅ ${data.message}`, "success");
      addLog(
        `👤 Logged in as: ${data.user.firstName || data.user._id}`,
        "info"
      );
      socketService.getPendingInvitations();
    };

    // Invitation events
    const handleNewInvitation = (invitation) => {
      addLog(`📨 New invitation from user ${invitation.fromUserId}`, "info");
      setNotifications((prev) => [
        ...prev,
        {
          ...invitation,
          type: "invitation",
          timestamp: new Date().toISOString(),
        },
      ]);
      setPendingInvitations((prev) => [...prev, invitation]);

      if (Notification.permission === "granted") {
        new Notification("New Invitation", {
          body: invitation.message,
          icon: "/notification-icon.png",
        });
      }
    };

    const handleInvitationSent = (result) => {
      addLog(`✉️ Invitation sent to user ${result.toUserId}`, "success");
      setSentInvitations((prev) => [...prev, result.invitation]);
    };

    const handleInvitationAccepted = (data) => {
      addLog(`✅ User ${data.acceptedBy} accepted your invitation`, "success");
      setNotifications((prev) => [
        ...prev,
        {
          type: "acceptance",
          message: `Your invitation was accepted`,
          timestamp: new Date().toISOString(),
          ...data,
        },
      ]);
      setSentInvitations((prev) =>
        prev.filter((inv) => inv.id !== data.invitationId)
      );
    };

    const handleInvitationRefused = (data) => {
      addLog(`❌ User ${data.refusedBy} refused your invitation`, "error");
      setNotifications((prev) => [
        ...prev,
        {
          type: "refusal",
          message: `Your invitation was refused${data.reason ? `: ${data.reason}` : ""
            }`,
          timestamp: new Date().toISOString(),
          ...data,
        },
      ]);
      setSentInvitations((prev) =>
        prev.filter((inv) => inv.id !== data.invitationId)
      );
    };

    const handleInvitationCanceled = (data) => {
      addLog(`🚫 Invitation ${data.invitationId} was canceled`, "info");
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== data.invitationId)
      );
    };

    const handlePendingInvitations = (data) => {
      addLog(
        `📋 Received ${data.invitations.length} pending invitations`,
        "info"
      );
      setPendingInvitations(data.invitations);
    };

    const handleInvitationError = (error) => {
      addLog(`⚠️ Error: ${error.error}`, "error");
      alert(`Error: ${error.error}`);
    };

    // Payment & general notifications
    const handleNewNotification = (data) => {
      addLog(`💰 New notification: ${data.message}`, "info");
      setNotifications((prev) => [
        ...prev,
        { ...data, type: "notification", timestamp: new Date().toISOString() },
      ]);
    };

    const handlePaymentRequired = (data) => {
      addLog(`💳 Payment required for operation ${data.operationId}`, "info");
      setPaymentQueue((prev) => [...prev, data]);
      setNotifications((prev) => [
        ...prev,
        { ...data, type: "payment", timestamp: new Date().toISOString() },
      ]);
    };

    const handleNewReportNotification = (notification) => {
      console.log('📋 New report notification:', notification);

      addLog(`📋 Report: ${notification.message}`, "info");

      setNotifications((prev) => [
        ...prev,
        {
          ...notification,
          type: "report",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Show different UI based on notification type
      switch (notification.subType) {
        case 'report-accepted':
          showToast('success', '✅ Your report was accepted!');
          break;

        case 'report-refused':
          showToast('warning', '⚠️ Your report was refused.');
          break;

        case 'warning':
        case 'warning-1':
        case 'warning-2':
          showAlert('Warning', notification.message);
          break;

        case 'account-suspended':
          showAlert('Account Suspended', notification.message);
          // Force logout if current user is suspended
          if (currentUser?._id === notification.metadata?.userId) {
            logoutUser();
          }
          break;

        case 'book-reported':
          showToast('info', '📚 ' + notification.message);
          break;

        case 'book-deleted':
          showAlert('Book Removed', notification.message);
          break;
      }

      // Optional: Send browser notification
      if (Notification.permission === "granted") {
        new Notification("Report Update", {
          body: notification.message,
          icon: "/notification-icon.png",
        });
      }
    };




    // Subscribe to events
    socketService.on("connection-change", handleConnectionChange);
    socketService.on("connection-error", handleConnectionError);
    socketService.on("user-connected", handleUserConnected);
    socketService.on("new-invitation", handleNewInvitation);
    socketService.on("invitation-sent", handleInvitationSent);
    socketService.on("invitation-accepted", handleInvitationAccepted);
    socketService.on("invitation-refused", handleInvitationRefused);
    socketService.on("invitation-canceled", handleInvitationCanceled);
    socketService.on("pending-invitations", handlePendingInvitations);
    socketService.on("invitation-error", handleInvitationError);
    socketService.on("new-notification", handleNewNotification);
    socketService.on("payment-required", handlePaymentRequired);
    socketService.on("new-report-notification", handleNewReportNotification);

    // Cleanup on unmount
    return () => {
      socketService.off("connection-change", handleConnectionChange);
      socketService.off("connection-error", handleConnectionError);
      socketService.off("user-connected", handleUserConnected);
      socketService.off("new-invitation", handleNewInvitation);
      socketService.off("invitation-sent", handleInvitationSent);
      socketService.off("invitation-accepted", handleInvitationAccepted);
      socketService.off("invitation-refused", handleInvitationRefused);
      socketService.off("invitation-canceled", handleInvitationCanceled);
      socketService.off("pending-invitations", handlePendingInvitations);
      socketService.off("invitation-error", handleInvitationError);
      socketService.off("new-notification", handleNewNotification);
      socketService.off("payment-required", handlePaymentRequired);
      socketService.off("new-report-notification", handleNewReportNotification);
      socketService.disconnect();
    };
  }, [addLog]);

  useEffect(() => {
    console.log('Registered socket events:', socketService.eventCallbacks);
  }, []);

  // Action methods
  const sendInvitation = useCallback((invitationData) => {
    socketService.sendInvitation(invitationData);
  }, []);

  const acceptInvitation = useCallback(
    (invitationId, operationId = null) => {
      if (!currentUser?._id) return;
      addLog(`✅ Accepting invitation ${invitationId}`, "info");
      socketService.acceptInvitation(
        invitationId,
        currentUser._id,
        operationId
      );
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    },
    [addLog, currentUser]
  );

  const refuseInvitation = useCallback(
    (invitationId, reason) => {
      addLog(`❌ Refusing invitation ${invitationId}`, "info");
      socketService.refuseInvitation(invitationId, reason);
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    },
    [addLog]
  );

  const cancelInvitation = useCallback(
    (invitationId) => {
      addLog(`🚫 Canceling invitation ${invitationId}`, "info");
      socketService.cancelInvitation(invitationId);
      setSentInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    },
    [addLog]
  );

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return {
    isConnected,
    currentUser,
    notifications,
    pendingInvitations,
    sentInvitations,
    paymentQueue,
    logs,
    logsEndRef,
    addLog,
    sendInvitation,
    acceptInvitation,
    refuseInvitation,
    cancelInvitation,
    setPendingInvitations,
    setSentInvitations,
    setNotifications,
    setPaymentQueue,
  };
};
