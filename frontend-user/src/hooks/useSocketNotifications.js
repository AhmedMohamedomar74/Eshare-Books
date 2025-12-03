// useSocketNotifications.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services/Soket_Io/socketService.js';

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
  const addLog = useCallback((message, type = 'info') => {
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
        addLog(`🔴 Disconnected: ${reason}`, 'error');
      } else {
        addLog('🟢 Connected to server', 'success');
      }
    };

    const handleConnectionError = ({ error }) => {
      addLog(`❌ Connection error: ${error.message}`, 'error');
    };

    const handleUserConnected = (data) => {
      setCurrentUser(data.user);
      addLog(`✅ ${data.message}`, 'success');
      addLog(`👤 Logged in as: ${data.user.firstName || data.user._id}`, 'info');
      socketService.getPendingInvitations();
    };

    // Invitation events
    const handleNewInvitation = (invitation) => {
      addLog(`📨 New invitation from user ${invitation.fromUserId}`, 'info');
      setNotifications((prev) => [
        ...prev,
        {
          ...invitation,
          type: 'invitation',
          timestamp: new Date().toISOString(),
        },
      ]);
      setPendingInvitations((prev) => [...prev, invitation]);

      if (Notification.permission === 'granted') {
        new Notification('New Invitation', {
          body: invitation.message,
          icon: '/notification-icon.png',
        });
      }
    };

    const handleInvitationSent = (result) => {
      addLog(`✉️ Invitation sent to user ${result.toUserId}`, 'success');
      setSentInvitations((prev) => [...prev, result.invitation]);
    };

    const handleInvitationAccepted = (data) => {
      addLog(`✅ User ${data.acceptedBy} accepted your invitation`, 'success');
      setNotifications((prev) => [
        ...prev,
        {
          type: 'acceptance',
          message: `Your Order was accepted`,
          timestamp: new Date().toISOString(),
          ...data,
        },
      ]);
      setSentInvitations((prev) => prev.filter((inv) => inv.id !== data.invitationId));
    };

    const handleInvitationRefused = (data) => {
      addLog(`❌ User ${data.refusedBy} refused your invitation`, 'error');
      setNotifications((prev) => [
        ...prev,
        {
          type: 'refusal',
          message: `Your Order was refused${data.reason ? `: ${data.reason}` : ''}`,
          timestamp: new Date().toISOString(),
          ...data,
        },
      ]);
      setSentInvitations((prev) => prev.filter((inv) => inv.id !== data.invitationId));
    };

    const handleInvitationCanceled = (data) => {
      addLog(`🚫 Invitation ${data.invitationId} was canceled`, 'info');
      setPendingInvitations((prev) => prev.filter((inv) => inv.id !== data.invitationId));
    };

    const handlePendingInvitations = (data) => {
      addLog(`📋 Received ${data.invitations.length} pending invitations`, 'info');
      setPendingInvitations(data.invitations);
    };

    const handleInvitationError = (error) => {
      addLog(`⚠️ Error: ${error.error}`, 'error');
      alert(`Error: ${error.error}`);
    };

    // Payment & general notifications
    const handleNewNotification = (data) => {
      addLog(`💰 New notification: ${data.message}`, 'info');
      setNotifications((prev) => [
        ...prev,
        { ...data, type: 'notification', timestamp: new Date().toISOString() },
      ]);
    };

    const handlePaymentRequired = (data) => {
      addLog(`💳 Payment required for operation ${data.operationId}`, 'info');
      setPaymentQueue((prev) => [...prev, data]);
      setNotifications((prev) => [
        ...prev,
        { ...data, type: 'payment', timestamp: new Date().toISOString() },
      ]);
    };

    // ✅ إشعارات حذف الكتاب - أضفها هنا
    const handleBookDeleted = (data) => {
      addLog(`📘 Book deleted notification received: ${data.bookTitle}`, 'warning');

      const notification = {
        ...data,
        id: `book-deleted-${Date.now()}`,
        type: 'book_deletion',
        title: 'Book Removed',
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      // عرض إشعار فوري للمستخدم
      if (Notification.permission === 'granted') {
        new Notification('Book Removed', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    // ✅ إشعارات إلغاء العملية - أضفها هنا
    const handleOperationCancelled = (data) => {
      addLog(`🔄 Operation cancelled: ${data.bookTitle}`, 'info');

      const notification = {
        ...data,
        id: `op-cancelled-${Date.now()}`,
        type: 'operation_cancellation',
        title: 'Operation Cancelled',
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      // عرض إشعار فوري للمستخدم
      if (Notification.permission === 'granted') {
        new Notification('Operation Cancelled', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    const handleBookRestored = (data) => {
      console.log('📘 Book restored notification:', data);
      addLog(`✅ Your book "${data.data?.bookTitle}" has been restored`, 'success');

      const notification = {
        ...data,
        id: `book-restored-${Date.now()}`,
        type: 'book_restored',
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      if (Notification.permission === 'granted') {
        new Notification('Book Restored', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    const handleBookApproved = (data) => {
      console.log('✅ Book approved notification:', data);
      addLog(
        `✅ Your book "${data.data?.bookTitle}" has been approved and is now available`,
        'success'
      );

      const notification = {
        ...data,
        id: `book-approved-${Date.now()}`,
        type: 'book_approved',
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      if (Notification.permission === 'granted') {
        new Notification('Book Approved', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    const handleBookRejected = (data) => {
      console.log('❌ Book rejected notification:', data);
      addLog(`❌ Your book "${data.data?.bookTitle}" has been rejected`, 'error');

      const notification = {
        ...data,
        id: `book-rejected-${Date.now()}`,
        type: 'book_rejected',
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      if (Notification.permission === 'granted') {
        new Notification('Book Rejected', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    const handleReportStatusUpdated = (data) => {
      console.log('📋 Report status updated notification:', data);

      let logMessage = '';
      let type = 'info';

      switch (data.type) {
        case 'report_reviewed':
          logMessage = `Your report has been reviewed: ${data.data?.targetName}`;
          type = 'success';
          break;
        case 'report_against_you_reviewed':
          logMessage = `A report against you has been reviewed`;
          type = 'warning';
          break;
        case 'report_dismissed':
          logMessage = `Your report has been dismissed: ${data.data?.targetName}`;
          type = 'error';
          break;
        default:
          logMessage = 'Report status updated';
      }

      addLog(logMessage, type);

      const notification = {
        ...data,
        id: `report-status-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [notification, ...prev]);

      if (Notification.permission === 'granted') {
        new Notification(data.title || 'Report Status Updated', {
          body: data.message,
          icon: '/notification-icon.png',
        });
      }
    };

    // Subscribe to events
    socketService.on('connection-change', handleConnectionChange);
    socketService.on('connection-error', handleConnectionError);
    socketService.on('user-connected', handleUserConnected);
    socketService.on('new-invitation', handleNewInvitation);
    socketService.on('invitation-sent', handleInvitationSent);
    socketService.on('invitation-accepted', handleInvitationAccepted);
    socketService.on('invitation-refused', handleInvitationRefused);
    socketService.on('invitation-canceled', handleInvitationCanceled);
    socketService.on('pending-invitations', handlePendingInvitations);
    socketService.on('invitation-error', handleInvitationError);
    socketService.on('new-notification', handleNewNotification);
    socketService.on('payment-required', handlePaymentRequired);
    // ✅ استمع للإشعارات الجديدة
    socketService.on('book-deleted', handleBookDeleted);
    socketService.on('operation-cancelled', handleOperationCancelled);
    socketService.on('book-restored', handleBookRestored);
    socketService.on('book_approved', handleBookApproved);
    socketService.on('book_rejected', handleBookRejected);
    socketService.on('report-status-updated', handleReportStatusUpdated);

    // Cleanup on unmount
    return () => {
      socketService.off('book-deleted', handleBookDeleted);
      socketService.off('book-restored', handleBookRestored);
      socketService.off('operation-cancelled', handleOperationCancelled);
      socketService.off('book_approved', handleBookApproved);
      socketService.off('book_rejected', handleBookRejected);
      socketService.off('report-status-updated', handleReportStatusUpdated);
      socketService.off('connection-change', handleConnectionChange);
      socketService.off('connection-error', handleConnectionError);
      socketService.off('user-connected', handleUserConnected);
      socketService.off('new-invitation', handleNewInvitation);
      socketService.off('invitation-sent', handleInvitationSent);
      socketService.off('invitation-accepted', handleInvitationAccepted);
      socketService.off('invitation-refused', handleInvitationRefused);
      socketService.off('invitation-canceled', handleInvitationCanceled);
      socketService.off('pending-invitations', handlePendingInvitations);
      socketService.off('invitation-error', handleInvitationError);
      socketService.off('new-notification', handleNewNotification);
      socketService.off('payment-required', handlePaymentRequired);
      socketService.disconnect();
    };
  }, [addLog]);

  // Action methods
  const sendInvitation = useCallback((invitationData) => {
    socketService.sendInvitation(invitationData);
  }, []);

  const acceptInvitation = useCallback(
    (invitationId, operationId = null) => {
      if (!currentUser?._id) return;
      addLog(`✅ Accepting invitation ${invitationId}`, 'info');
      socketService.acceptInvitation(invitationId, currentUser._id, operationId);
      setPendingInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    },
    [addLog, currentUser]
  );

  const refuseInvitation = useCallback(
    (invitationId, reason) => {
      addLog(`❌ Refusing invitation ${invitationId}`, 'info');
      socketService.refuseInvitation(invitationId, reason);
      setPendingInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    },
    [addLog]
  );

  const cancelInvitation = useCallback(
    (invitationId) => {
      addLog(`🚫 Canceling invitation ${invitationId}`, 'info');
      socketService.cancelInvitation(invitationId);
      setSentInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    },
    [addLog]
  );

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
