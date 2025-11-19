import { getNotificationService } from "./soketio.gateway.js";

export const NotificationInstance = {
  send: (options) => {
    const service = getNotificationService();
    return service.sendInvitation(options);
  },

  notifyUser: (userId, event, payload) => {
    const service = getNotificationService();
    return service.emitToUser(userId, event, payload);
  },
};
