// socketService.js
import { io } from "socket.io-client";
import { signatureLevelEnum } from "../../enum.js";
import { BaseUrl } from "../../axiosInstance/axiosInstance.js";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
  }

  // Initialize socket connection
  connect() {
    const SERVER_URL = BaseUrl;
    const AUTH_TOKEN = `${signatureLevelEnum.user} ${localStorage.getItem(
      "accessToken"
    )}`;

    this.socket = io(SERVER_URL, {
      auth: {
        authorization: { token: AUTH_TOKEN },
      },
      transports: ["websocket", "polling"],
    });

    this.setupConnectionEvents();
    this.setupNotificationListeners();

    return this.socket;
  }

  // Setup connection events
  setupConnectionEvents() {
    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("✅ Socket connected successfully");
      this.emitEvent("connection-change", { isConnected: true });
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.log("❌ Socket disconnected:", reason);
      this.emitEvent("connection-change", { isConnected: false, reason });
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      this.emitEvent("connection-error", { error });
    });

    this.socket.on("connected", (data) => {
      console.log("✅ Socket authenticated:", data);
      this.emitEvent("user-connected", data);
    });
  }

  // Setup notification event listeners
  setupNotificationListeners() {
    const notificationEvents = [
      "new-invitation",
      "invitation-sent",
      "invitation-accepted",
      "invitation-refused",
      "invitation-canceled",
      "pending-invitations",
      "invitation-error",
      "new-notification",
      "payment-required",
      "new-report-notification", 
    ];

    console.log("🔧 Setting up socket listeners for events:", notificationEvents);

    notificationEvents.forEach((event) => {
      this.socket.on(event, (data) => {
        console.log(`🔔 [${event}] received:`, data);
        this.emitEvent(event, data);
      });
    });

    // 🔥 EXTRA DEBUG: Listen to ALL events
    this.socket.onAny((eventName, ...args) => {
      console.log(`🌐 Socket received ANY event: ${eventName}`, args);
    });

    console.log("✅ All socket listeners registered successfully");
  }

  // Emit socket events
  sendInvitation(invitationData) {
    this.socket.emit("send-invitation", invitationData);
  }

  acceptInvitation(invitationId, userId, operationId) {
    this.socket.emit("accept-invitation", {
      invitationId,
      userId,
      operationId,
    });
  }

  refuseInvitation(invitationId, reason) {
    this.socket.emit("refuse-invitation", { invitationId, reason });
  }

  cancelInvitation(invitationId) {
    this.socket.emit("cancel-invitation", { invitationId });
  }

  getPendingInvitations() {
    this.socket.emit("get-pending-invitations");
  }

  // Event subscription methods
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
    console.log(`📝 Callback registered for event: ${event}`, {
      totalCallbacks: this.eventCallbacks.get(event).length
    });
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(`🗑️ Callback removed for event: ${event}`);
      }
    }
  }

  emitEvent(event, data) {
    console.log(`📤 Emitting event to callbacks: ${event}`, {
      hasCallbacks: this.eventCallbacks.has(event),
      callbackCount: this.eventCallbacks.has(event) ? this.eventCallbacks.get(event).length : 0
    });

    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach((callback) => {
        try {
          callback(data);
          console.log(`✅ Callback executed successfully for: ${event}`);
        } catch (error) {
          console.error(`❌ Error executing callback for ${event}:`, error);
        }
      });
    } else {
      console.warn(`⚠️ No callbacks registered for event: ${event}`);
    }
  }

  // Utility methods
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 Socket disconnected manually");
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  // 🔥 DEBUG METHOD: Check what events are being listened to
  getRegisteredEvents() {
    const socketEvents = this.socket?._callbacks ? Object.keys(this.socket._callbacks) : [];
    const callbackEvents = Array.from(this.eventCallbacks.keys());
    
    console.log("📊 Socket Debug Info:", {
      isConnected: this.isConnected,
      socketEvents: socketEvents,
      callbackEvents: callbackEvents,
      hasSocket: !!this.socket
    });

    return {
      socketEvents,
      callbackEvents
    };
  }
}

// Create a singleton instance
export const socketService = new SocketService();

// 🔥 DEBUG: Expose to window for testing
if (typeof window !== 'undefined') {
  window.socketService = socketService;
}