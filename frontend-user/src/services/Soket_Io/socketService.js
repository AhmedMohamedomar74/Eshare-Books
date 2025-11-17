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
      this.emitEvent("connection-change", { isConnected: true });
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      this.emitEvent("connection-change", { isConnected: false, reason });
    });

    this.socket.on("connect_error", (error) => {
      this.emitEvent("connection-error", { error });
    });

    this.socket.on("connected", (data) => {
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
    ];

    notificationEvents.forEach((event) => {
      this.socket.on(event, (data) => {
        this.emitEvent(event, data);
      });
    });
  }

  // Emit socket events
  sendInvitation(invitationData) {
    this.socket.emit("send-invitation", invitationData);
  }

  acceptInvitation(invitationId) {
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
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emitEvent(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach((callback) => {
        callback(data);
      });
    }
  }

  // Utility methods
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create a singleton instance
export const socketService = new SocketService();
