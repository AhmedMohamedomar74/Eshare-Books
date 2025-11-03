import { Server } from "socket.io";
import { 
    getConnectedSockets, 
    removeFromConnectedSockets, 
    socketAuthMiddleware,
    getUserSockets 
} from "../middelwares/socket.auth.middleware.js";

let ioServer = null;

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
    
    // Example event handlers
    socket.on("say-hello", (data) => {
        console.log("Hello from client:", data);
        console.log("Socket user data:", socket.data);
        
        // Echo back to client
        socket.emit("hello-response", { 
            message: "Hello received!", 
            timestamp: new Date().toISOString() 
        });
    });
    
    // Add more event handlers as needed
    
    disconnectHandler(socket);
};

export const initializeSocketIO = (httpServer) => {
    ioServer = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
            methods: ["GET", "POST"]
        }
    });
    
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