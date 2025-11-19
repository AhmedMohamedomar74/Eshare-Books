import { getUserSockets } from "../middelwares/socket.auth.middleware.js";

export class ChatEvents {
    constructor(socket, chatService) {
        this.socket = socket;
        this.chatService = chatService;
        this.userId = socket.data.userID;
    }

    // Initialize all chat event listeners
    initialize() {
        this.onSendMessage();
        this.onJoinRoom();
        this.onLeaveRoom();
        this.onTyping();
        this.onStopTyping();
        this.onMessageRead();
        this.onMessageDelivered();
    }

    // Handle sending messages
    onSendMessage() {
        this.socket.on("send-message", async (data) => {
            try {
                const { roomId, recipientId, message, messageType = "text" } = data;

                console.log(`Message from ${this.userId}:`, data);

                // Here you would typically save to database
                const savedMessage = {
                    _id: Date.now().toString(), // Replace with actual DB ID
                    senderId: this.userId,
                    recipientId,
                    roomId,
                    message,
                    messageType,
                    timestamp: new Date().toISOString(),
                    status: "sent"
                };

                // Send to recipient
                if (recipientId) {
                    this.chatService.sendMessageToUser(recipientId, savedMessage);
                }

                // Send to room if specified
                if (roomId) {
                    this.chatService.sendMessageToRoom(roomId, savedMessage);
                }

                // Acknowledge to sender
                this.socket.emit("message-sent", {
                    tempId: data.tempId,
                    message: savedMessage
                });

            } catch (error) {
                console.error("Error sending message:", error);
                this.socket.emit("message-error", {
                    error: "Failed to send message"
                });
            }
        });
    }

    // Handle joining chat rooms
    onJoinRoom() {
        this.socket.on("join-room", async (data) => {
            try {
                const { roomId } = data;
                
                await this.socket.join(roomId);
                console.log(`User ${this.userId} joined room: ${roomId}`);

                // Notify others in the room
                this.socket.to(roomId).emit("user-joined-room", {
                    userId: this.userId,
                    firstName: this.socket.data.user?.firstName,
                    roomId,
                    timestamp: new Date().toISOString()
                });

                // Send confirmation to user
                this.socket.emit("room-joined", {
                    roomId,
                    message: "Successfully joined room"
                });

            } catch (error) {
                console.error("Error joining room:", error);
                this.socket.emit("room-error", {
                    error: "Failed to join room"
                });
            }
        });
    }

    // Handle leaving chat rooms
    onLeaveRoom() {
        this.socket.on("leave-room", async (data) => {
            try {
                const { roomId } = data;
                
                await this.socket.leave(roomId);
                console.log(`User ${this.userId} left room: ${roomId}`);

                // Notify others in the room
                this.socket.to(roomId).emit("user-left-room", {
                    userId: this.userId,
                    roomId,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error("Error leaving room:", error);
            }
        });
    }

    // Handle typing indicator
    onTyping() {
        this.socket.on("typing", (data) => {
            const { roomId, recipientId } = data;

            if (roomId) {
                this.chatService.notifyTyping(roomId, this.userId, true);
            } else if (recipientId) {
                const recipientSockets = getUserSockets(recipientId);
                recipientSockets.forEach(socketId => {
                    this.socket.to(socketId).emit("user-typing", {
                        userId: this.userId,
                        isTyping: true
                    });
                });
            }
        });
    }

    // Handle stop typing indicator
    onStopTyping() {
        this.socket.on("stop-typing", (data) => {
            const { roomId, recipientId } = data;

            if (roomId) {
                this.chatService.notifyTyping(roomId, this.userId, false);
            } else if (recipientId) {
                const recipientSockets = getUserSockets(recipientId);
                recipientSockets.forEach(socketId => {
                    this.socket.to(socketId).emit("user-typing", {
                        userId: this.userId,
                        isTyping: false
                    });
                });
            }
        });
    }

    // Handle message read receipts
    onMessageRead() {
        this.socket.on("message-read", (data) => {
            const { roomId, messageIds } = data;

            if (roomId) {
                this.chatService.notifyMessageRead(roomId, this.userId, messageIds);
            }
        });
    }

    // Handle message delivered receipts
    onMessageDelivered() {
        this.socket.on("message-delivered", (data) => {
            const { messageId, senderId } = data;

            if (senderId) {
                this.chatService.notifyMessageDelivered(senderId, messageId);
            }
        });
    }
}