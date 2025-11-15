import { getUserSockets } from "../middelwares/socket.auth.middleware.js";

// notification.service.js
export class NotificationService {
    constructor(io) {
        this.io = io;
        this.pendingInvitations = new Map(); // Store pending invitations in memory
        // In production, you might want to use Redis or database for persistence
    }

    // Send invitation to user
    async sendInvitation(data) {
        const { fromUserId, toUserId, transactionType, message, metadata } = data;

        // Check if recipient is connected
        const recipientSockets = getUserSockets(toUserId);
        if (recipientSockets.length === 0) {
            throw new Error("User is not connected");
        }

        const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const invitation = {
            id: invitationId,
            fromUserId,
            toUserId,
            type: transactionType,
            message: message || `You have a new ${transactionType} invitation`,
            metadata: metadata || {},
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Store invitation
        if (!this.pendingInvitations.has(toUserId)) {
            this.pendingInvitations.set(toUserId, []);
        }
        this.pendingInvitations.get(toUserId).push(invitation);

        // Send to recipient
        recipientSockets.forEach(socketId => {
            this.io.to(socketId).emit("new-invitation", invitation);
        });

        return {
            invitationId,
            toUserId,
            status: 'sent',
            invitation
        };
    }

    // Accept invitation
    async acceptInvitation(invitationId, userId) {
        const invitation = this.findInvitation(invitationId, userId);
        
        if (!invitation) {
            throw new Error("Invitation not found");
        }

        invitation.status = 'accepted';
        invitation.respondedAt = new Date().toISOString();

        // Notify the sender
        const senderSockets = getUserSockets(invitation.fromUserId);
        senderSockets.forEach(socketId => {
            this.io.to(socketId).emit("invitation-accepted", {
                invitationId,
                acceptedBy: userId,
                invitation
            });
        });

        // Remove from pending
        this.removeInvitation(invitationId, userId);

        return {
            invitationId,
            status: 'accepted',
            invitation
        };
    }

    // Refuse invitation
    async refuseInvitation(invitationId, userId, reason) {
        const invitation = this.findInvitation(invitationId, userId);
        
        if (!invitation) {
            throw new Error("Invitation not found");
        }

        invitation.status = 'refused';
        invitation.refusalReason = reason;
        invitation.respondedAt = new Date().toISOString();

        // Notify the sender
        const senderSockets = getUserSockets(invitation.fromUserId);
        senderSockets.forEach(socketId => {
            this.io.to(socketId).emit("invitation-refused", {
                invitationId,
                refusedBy: userId,
                reason,
                invitation
            });
        });

        // Remove from pending
        this.removeInvitation(invitationId, userId);

        return {
            invitationId,
            status: 'refused',
            invitation
        };
    }

    // Cancel invitation
    async cancelInvitation(invitationId, userId) {
        // Find invitation by ID and sender
        let invitation = null;
        let recipientId = null;

        for (const [toUserId, invitations] of this.pendingInvitations.entries()) {
            const foundInvitation = invitations.find(inv => 
                inv.id === invitationId && inv.fromUserId === userId
            );
            if (foundInvitation) {
                invitation = foundInvitation;
                recipientId = toUserId;
                break;
            }
        }

        if (!invitation) {
            throw new Error("Invitation not found or you are not the sender");
        }

        invitation.status = 'canceled';
        invitation.canceledAt = new Date().toISOString();

        // Notify the recipient
        const recipientSockets = getUserSockets(recipientId);
        recipientSockets.forEach(socketId => {
            this.io.to(socketId).emit("invitation-canceled", {
                invitationId,
                canceledBy: userId,
                invitation
            });
        });

        // Remove from pending
        this.removeInvitation(invitationId, recipientId);

        return {
            invitationId,
            status: 'canceled',
            invitation
        };
    }

    // Get pending invitations for user
    async getPendingInvitations(userId) {
        return this.pendingInvitations.get(userId) || [];
    }

    // Helper method to find invitation
    findInvitation(invitationId, userId) {
        const userInvitations = this.pendingInvitations.get(userId) || [];
        return userInvitations.find(inv => inv.id === invitationId);
    }

    // Helper method to remove invitation
    removeInvitation(invitationId, userId) {
        const userInvitations = this.pendingInvitations.get(userId);
        if (userInvitations) {
            const index = userInvitations.findIndex(inv => inv.id === invitationId);
            if (index !== -1) {
                userInvitations.splice(index, 1);
                if (userInvitations.length === 0) {
                    this.pendingInvitations.delete(userId);
                }
            }
        }
    }

    // Get all pending invitations (for admin purposes)
    getAllPendingInvitations() {
        const allInvitations = [];
        for (const [userId, invitations] of this.pendingInvitations.entries()) {
            allInvitations.push(...invitations.map(inv => ({ ...inv })));
        }
        return allInvitations;
    }

    // Clean up expired invitations (call this periodically)
    cleanupExpiredInvitations(expiryTime = 24 * 60 * 60 * 1000) { // Default: 24 hours
        const now = new Date();
        for (const [userId, invitations] of this.pendingInvitations.entries()) {
            const validInvitations = invitations.filter(invitation => {
                const created = new Date(invitation.createdAt);
                return (now - created) < expiryTime;
            });
            
            if (validInvitations.length === 0) {
                this.pendingInvitations.delete(userId);
            } else {
                this.pendingInvitations.set(userId, validInvitations);
            }
        }
    }
}