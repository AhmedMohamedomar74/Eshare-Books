import { useState, useEffect, useRef, useCallback } from "react";
import { socketService } from "../services/Soket_Io/socketService.js";
import api from "../axiosInstance/axiosInstance.js";

export const useSocketNotifications = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [operations, setOperations] = useState([]);

  const logsEndRef = useRef(null);

  const addLog = useCallback((message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  }, []);

  useEffect(() => {
    socketService.connect();

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

    const handleNewInvitation = (invitation) => {
      console.log("📦 Received invitation:", invitation);
      addLog(`📨 New invitation from user ${invitation.fromUserId}`, "info");

      const enrichedInvitation = {
        ...invitation,
        metadata: invitation.metadata || {},
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [...prev, enrichedInvitation]);
      setPendingInvitations((prev) => [...prev, enrichedInvitation]);

      if (Notification.permission === "granted") {
        new Notification("New Invitation", {
          body: invitation.message,
          icon: "/notification-icon.png",
        });
      }
    };

    const handleOperationUpdated = (updatedOp) => {
      addLog(
        `🔄 Operation ${updatedOp._id} updated to ${updatedOp.status}`,
        "info"
      );
      setOperations((prev) => {
        const exists = prev.find((op) => op._id === updatedOp._id);
        return exists
          ? prev.map((op) => (op._id === updatedOp._id ? updatedOp : op))
          : [...prev, updatedOp];
      });

      // ✅ لو الـ operation بقى completed، نشيل الـ invitation المرتبطة بيه
      if (updatedOp.status === "completed") {
        setPendingInvitations((prev) =>
          prev.filter((inv) => inv.metadata?.operationId !== updatedOp._id)
        );
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
          message: `Your invitation was refused${
            data.reason ? `: ${data.reason}` : ""
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

    socketService.on("connection-change", handleConnectionChange);
    socketService.on("connection-error", handleConnectionError);
    socketService.on("user-connected", handleUserConnected);
    socketService.on("new-invitation", handleNewInvitation);
    socketService.on("operation-updated", handleOperationUpdated);
    socketService.on("invitation-sent", handleInvitationSent);
    socketService.on("invitation-accepted", handleInvitationAccepted);
    socketService.on("invitation-refused", handleInvitationRefused);
    socketService.on("invitation-canceled", handleInvitationCanceled);
    socketService.on("pending-invitations", handlePendingInvitations);
    socketService.on("invitation-error", handleInvitationError);

    return () => {
      socketService.off("connection-change", handleConnectionChange);
      socketService.off("connection-error", handleConnectionError);
      socketService.off("user-connected", handleUserConnected);
      socketService.off("new-invitation", handleNewInvitation);
      socketService.off("operation-updated", handleOperationUpdated);
      socketService.off("invitation-sent", handleInvitationSent);
      socketService.off("invitation-accepted", handleInvitationAccepted);
      socketService.off("invitation-refused", handleInvitationRefused);
      socketService.off("invitation-canceled", handleInvitationCanceled);
      socketService.off("pending-invitations", handlePendingInvitations);
      socketService.off("invitation-error", handleInvitationError);

      socketService.disconnect();
    };
  }, [addLog]);

  // ✅ تعديل دالة قبول الدعوة لتحميل العملية المرتبطة بها
  const acceptInvitation = useCallback(
    async ({ invitationId, userId, operationId }) => {
      addLog(`✅ Accepting invitation ${invitationId}`, "info");

      // ✅ ابعت الـ request للـ backend
      socketService.acceptInvitation({ invitationId, userId, operationId });

      // ✅ مش نشيل الـ invitation فورًا - نستنى الـ backend يرد
      // هنشيلها في handleInvitationAccepted أو بعد ما نتأكد إن الـ operation اتحدث

      if (operationId) {
        try {
          const res = await api.get(`/operations/${operationId}`);
          const op = res.data.operation || res.data.data || res.data;

          setOperations((prev) => {
            const exists = prev.find((o) => o._id === op._id);
            return exists ? prev : [...prev, op];
          });
          addLog(`📦 Operation ${op._id} loaded`, "success");

          // ✅ دلوقتي نشيل الـ invitation بعد ما تأكدنا إن كل حاجة تمام
          setPendingInvitations((prev) =>
            prev.filter((inv) => inv.id !== invitationId)
          );

          addLog(`📦 Operation ${op._id} loaded after acceptance`, "success");
        } catch (err) {
          console.error("❌ Error loading operation:", err);
          addLog(
            `❌ Failed to load operation ${operationId}: ${err.message}`,
            "error"
          );
        }
      } else {
        // لو مفيش operationId، نشيلها بعد شوية
        setTimeout(() => {
          setPendingInvitations((prev) =>
            prev.filter((inv) => inv.id !== invitationId)
          );
        }, 1000);
      }
    },
    [addLog]
  );

  const refuseInvitation = useCallback(
    (invitationId, reason) => {
      addLog(`❌ Refusing invitation ${invitationId}`, "info");
      socketService.refuseInvitation({
        invitationId,
        userId: currentUser._id,
        reason,
      });
      setPendingInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    },
    [addLog, currentUser]
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

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return {
    isConnected,
    currentUser,
    notifications,
    pendingInvitations,
    sentInvitations,
    logs,
    logsEndRef,
    addLog,
    acceptInvitation,
    refuseInvitation,
    cancelInvitation,
    setPendingInvitations,
    setSentInvitations,
    operations,
  };
};
