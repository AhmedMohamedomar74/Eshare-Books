export class ChatService {
    constructor(io) {
        this.io = io;
    }

    // Send message to specific user
    sendMessageToUser(userId, message) {
        const userSockets = getUserSockets(userId);
        userSockets.forEach(socketId => {
            this.io.to(socketId).emit("new-message", message);
        });
    }

    // Send message to a room/group
    sendMessageToRoom(roomId, message) {
        this.io.to(roomId).emit("new-message", message);
    }

    // Notify typing status
    notifyTyping(roomId, userId, isTyping) {
        this.io.to(roomId).emit("user-typing", {
            userId,
            isTyping,
            timestamp: new Date().toISOString()
        });
    }

    // Mark messages as read
    notifyMessageRead(roomId, userId, messageIds) {
        this.io.to(roomId).emit("messages-read", {
            userId,
            messageIds,
            timestamp: new Date().toISOString()
        });
    }

    // Notify message delivered
    notifyMessageDelivered(userId, messageId) {
        const userSockets = getUserSockets(userId);
        userSockets.forEach(socketId => {
            this.io.to(socketId).emit("message-delivered", {
                messageId,
                timestamp: new Date().toISOString()
            });
        });
    }

    // Get online users in a room
    async getRoomOnlineUsers(roomId) {
        const sockets = await this.io.in(roomId).fetchSockets();
        return sockets.map(socket => ({
            userId: socket.data.userID,
            firstName: socket.data.user?.firstName
        }));
    }
}