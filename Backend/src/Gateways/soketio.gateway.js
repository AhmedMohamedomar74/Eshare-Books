import { Server } from "socket.io";
import { 
    getConnectedSockets, 
    removeFromConnectedSockets, 
    socketAuthMiddleware,
    getUserSockets 
} from "../middelwares/socket.auth.middleware.js";
import { ChatEvents } from "./chat.events.js";
import { ChatService } from "./chat.service.js";

let ioServer = null;
let chatService = null;

// Get the connectedSockets map from the middleware
const connectedSockets = getConnectedSockets();

const disconnectHandler = (socket) => {
    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected: ${reason}`);
        
        const userID = socket.data.userID;
        if (userID) {
            removeFromConnectedSockets(userID, socket.id);
        }
        
        console.log("Remaining connections:", Object.fromEntries(connectedSockets));
    });
};

const connectionHandler = (socket) => {
    console.log(`New connection: ${socket.id} for user: ${socket.data.userID}`);
    
    // Send connection confirmation
    socket.emit("connected", { 
        user: { 
            _id: socket.data.userID,
            firstName: socket.data.user?.firstName 
        },
        message: "Successfully connected to socket server"
    });
    
    // Initialize chat events
    initializeChatEvents(socket);
    
    disconnectHandler(socket);
};

// Initialize chat events for the connected socket
const initializeChatEvents = (socket) => {
    const chatEvents = new ChatEvents(socket, chatService);
    chatEvents.initialize();
};

export const initializeSocketIO = (httpServer) => {
    ioServer = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
            methods: ["GET", "POST"]
        }
    });
    
    // Initialize chat service
    chatService = new ChatService(ioServer);
    
    // Apply authentication middleware
    ioServer.use(socketAuthMiddleware);
    
    // Handle connections
    ioServer.on("connection", connectionHandler);
    
    console.log("Socket.IO server initialized");
    return ioServer;
};

export const getIo = () => {
    if (!ioServer) {
        throw new Error("Socket.IO not initialized", { cause: 500 });
    }
    return ioServer;
};

export const getChatService = () => {
    if (!chatService) {
        throw new Error("Chat service not initialized");
    }
    return chatService;
};

// Helper to get all sockets for a user
export const getUserSocketsFromGateway = (userId) => {
    return getUserSockets(userId);
};

// Helper to emit to specific user
export const emitToUser = (userId, event, data) => {
    const userSockets = getUserSockets(userId);
    userSockets.forEach(socketId => {
        ioServer.to(socketId).emit(event, data);
    });
};

// Helper to broadcast to all connected users
export const broadcastToAll = (event, data) => {
    ioServer.emit(event, data);
};

// Helper to get all connected users count
export const getConnectedUsersCount = () => {
    return connectedSockets.size;
};

// Helper to check if a user is connected
export const isUserConnected = (userId) => {
    return connectedSockets.has(userId);
};