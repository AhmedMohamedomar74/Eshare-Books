// socket.auth.middleware.js
import { verify } from "../utils/secuirty/token.services.js";
import { signatureKeySelectEnum, signatureLevelEnum } from "../enum.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const connectedSockets = new Map();

// Socket.io authentication middleware
export const socketAuthMiddleware = asyncHandler(async (socket, next) => {
    try {
        const { auth } = socket.handshake;
        const { authorization } = auth;
        const {token} = authorization 

        if (!token) {
            return next(new Error("Authorization header is required", { cause: 401 }));
        }

        const [bearerType, clientToken] = token.split(" ");

        if (!clientToken) {
            return next(new Error("Token is required", { cause: 401 }));
        }

        let client;
        let signatureKey;

        // Determine which signature key to use based on token type
        switch (bearerType) {
            case signatureLevelEnum.user:
                signatureKey = process.env.USER_ACESS_TOKEN_SIGNATURE;
                break;
            case signatureLevelEnum.admin:
                signatureKey = process.env.SYSTEM_ACESS_TOKEN_SIGNATURE;
                break;
            default:
                return next(new Error("Invalid token type", { cause: 401 }));
        }

        // Verify the token
        client = await verify({ 
            token: clientToken, 
            key: signatureKey 
        });

        // Attach user data to socket
        socket.data = {
            userID: client._id,
            user: client, // Attach full user data for potential use
            tokenType: bearerType
        };

        // Add to connected sockets map
        addToConnectedSockets(client._id, socket.id);

        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Authentication failed", { cause: 401 }));
    }
});

// Socket.io admin check middleware
export const socketAdminCheckMiddleware = asyncHandler(async (socket, next) => {
    try {
        // This would require the user object to be populated with role
        // You might need to fetch the full user from DB if role isn't in token
        if (socket.data.user?.role !== roleEnum.admin) {
            return next(new Error("Unauthorized user - Admin access required", { cause: 401 }));
        }
        next();
    } catch (error) {
        console.error("Socket admin check error:", error);
        next(new Error("Authorization check failed", { cause: 401 }));
    }
});

// Helper function to manage connected sockets
const addToConnectedSockets = (userId, socketId) => {
    if (connectedSockets.has(userId)) {
        const existingSockets = connectedSockets.get(userId);
        if (!existingSockets.includes(socketId)) {
            connectedSockets.set(userId, [...existingSockets, socketId]);
        }
    } else {
        connectedSockets.set(userId, [socketId]);
    }
};

// Helper function to remove from connected sockets
export const removeFromConnectedSockets = (userId, socketId) => {
    if (connectedSockets.has(userId)) {
        const existingSockets = connectedSockets.get(userId);
        const updatedSockets = existingSockets.filter(id => id !== socketId);
        
        if (updatedSockets.length === 0) {
            connectedSockets.delete(userId);
        } else {
            connectedSockets.set(userId, updatedSockets);
        }
    }
};

// Export the connectedSockets map
export const getConnectedSockets = () => {
    return connectedSockets;
};

// Helper to get sockets for a specific user
export const getUserSockets = (userId) => {
    return connectedSockets.get(userId) || [];
};