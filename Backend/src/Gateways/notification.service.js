import { getUserSockets } from "../middelwares/socket.auth.middleware.js";
import operationModel from "../DB/models/operation.model.js";

export class NotificationService {
  constructor(io) {
    this.io = io;
    this.pendingInvitations = new Map();
  }

  // Send invitation to user
  async sendInvitation(data) {
    const { fromUserId, toUserId, transactionType, message, metadata } = data;

    const invitationId = `inv_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const invitation = {
      id: invitationId,
      fromUserId: fromUserId.toString(),
      toUserId: toUserId.toString(),
      type: transactionType,
      message: message || `You have a new ${transactionType} invitation`,
      metadata: metadata || {},
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // ✅ Store invitation (حتى لو User offline)
    const key = toUserId.toString();
    if (!this.pendingInvitations.has(key)) {
      this.pendingInvitations.set(key, []);
    }
    this.pendingInvitations.get(key).push(invitation);

    console.log(`💾 Invitation saved for user ${key}, ID: ${invitationId}`);

    // ✅ Send if online
    const recipientSockets = getUserSockets(toUserId);
    if (recipientSockets.length > 0) {
      recipientSockets.forEach((socketId) => {
        this.io.to(socketId).emit("new-invitation", invitation);
      });
      console.log(`✅ Invitation sent to online user: ${toUserId}`);
    } else {
      console.log(`📥 Invitation saved for offline user: ${toUserId}`);
    }

    return {
      invitationId,
      toUserId,
      status: "sent",
      invitation,
    };
  }

  // Accept invitation
  async acceptInvitation(invitationId, userId, operationId = null) {
    const key = userId.toString();
    const invitation = this.findInvitation(invitationId, key);

    console.log("🔍 acceptInvitation:", {
      invitationId,
      userId,
      operationId,
      found: !!invitation,
    });

    // ✅ Get operationId from invitation or parameter
    const finalOperationId = operationId || invitation?.metadata?.operationId;

    if (!invitation && !finalOperationId) {
      throw new Error("Invitation not found and no operationId provided");
    }

    // Update invitation status
    if (invitation) {
      invitation.status = "accepted";
      invitation.respondedAt = new Date().toISOString();
    }

    const senderId = invitation?.fromUserId;
    const senderSockets = senderId ? getUserSockets(senderId) : [];
    const recipientSockets = getUserSockets(userId);

    // ✅ Update Operation in Database
    if (finalOperationId) {
      try {
        console.log(`🔄 Updating operation ${finalOperationId} to completed`);

        const updatedOperation = await operationModel.findByIdAndUpdate(
          finalOperationId,
          { status: "completed" },
          { new: true }
        );

        if (updatedOperation) {
          console.log(`✅ Operation ${finalOperationId} marked as completed`);

          // ✅ Send operation-updated event to both parties
          const allSockets = [...senderSockets, ...recipientSockets];
          allSockets.forEach((socketId) => {
            this.io.to(socketId).emit("operation-updated", updatedOperation);
          });
          console.log(
            `📡 Sent operation-updated to ${allSockets.length} sockets`
          );
        } else {
          console.warn(`⚠️ Operation not found: ${finalOperationId}`);
        }
      } catch (error) {
        console.error(`❌ Error updating operation:`, error);
      }
    }

    // Notify sender
    if (senderSockets.length > 0) {
      senderSockets.forEach((socketId) => {
        this.io.to(socketId).emit("invitation-accepted", {
          invitationId,
          acceptedBy: userId,
          invitation,
          operationId: finalOperationId,
        });
      });
    }

    // Remove invitation
    if (invitation) {
      this.removeInvitation(invitationId, key);
    }

    return {
      invitationId,
      status: "accepted",
      invitation,
      operationId: finalOperationId,
    };
  }

  // Refuse invitation
  async refuseInvitation(invitationId, userId, reason, operationId = null) {
    const key = userId.toString();
    const invitation = this.findInvitation(invitationId, key);

    console.log("🔍 refuseInvitation:", {
      invitationId,
      userId,
      found: !!invitation,
    });

    const finalOperationId = operationId || invitation?.metadata?.operationId;

    if (!invitation && !finalOperationId) {
      throw new Error("Invitation not found");
    }

    if (invitation) {
      invitation.status = "refused";
      invitation.refusalReason = reason;
      invitation.respondedAt = new Date().toISOString();
    }

    const senderId = invitation?.fromUserId;
    const senderSockets = senderId ? getUserSockets(senderId) : [];
    const recipientSockets = getUserSockets(userId);

    // ✅ Update Operation to rejected
    if (finalOperationId) {
      try {
        console.log(`🔄 Updating operation ${finalOperationId} to rejected`);

        const updatedOperation = await operationModel.findByIdAndUpdate(
          finalOperationId,
          { status: "rejected" },
          { new: true }
        );

        if (updatedOperation) {
          console.log(`✅ Operation ${finalOperationId} marked as rejected`);

          const allSockets = [...senderSockets, ...recipientSockets];
          allSockets.forEach((socketId) => {
            this.io.to(socketId).emit("operation-updated", updatedOperation);
          });
        }
      } catch (error) {
        console.error(`❌ Error updating operation:`, error);
      }
    }

    // Notify sender
    if (senderSockets.length > 0) {
      senderSockets.forEach((socketId) => {
        this.io.to(socketId).emit("invitation-refused", {
          invitationId,
          refusedBy: userId,
          reason,
          invitation,
        });
      });
    }

    // Remove invitation
    if (invitation) {
      this.removeInvitation(invitationId, key);
    }

    return {
      invitationId,
      status: "refused",
      invitation,
    };
  }

  // Cancel invitation
  async cancelInvitation(invitationId, userId) {
    let invitation = null;
    let recipientId = null;

    for (const [toUserId, invitations] of this.pendingInvitations.entries()) {
      const foundInvitation = invitations.find(
        (inv) => inv.id === invitationId && inv.fromUserId === userId.toString()
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

    invitation.status = "canceled";
    invitation.canceledAt = new Date().toISOString();

    const recipientSockets = getUserSockets(recipientId);
    if (recipientSockets.length > 0) {
      recipientSockets.forEach((socketId) => {
        this.io.to(socketId).emit("invitation-canceled", {
          invitationId,
          canceledBy: userId,
          invitation,
        });
      });
    }

    this.removeInvitation(invitationId, recipientId);

    return {
      invitationId,
      status: "canceled",
      invitation,
    };
  }

  // Get pending invitations for user
  async getPendingInvitations(userId) {
    const key = userId.toString();
    return this.pendingInvitations.get(key) || [];
  }

  // Helper: find invitation
  findInvitation(invitationId, userId) {
    const key = userId.toString();
    const userInvitations = this.pendingInvitations.get(key) || [];
    return userInvitations.find((inv) => inv.id === invitationId);
  }

  // Helper: remove invitation
  removeInvitation(invitationId, userId) {
    const key = userId.toString();
    const userInvitations = this.pendingInvitations.get(key);
    if (userInvitations) {
      const index = userInvitations.findIndex((inv) => inv.id === invitationId);
      if (index !== -1) {
        userInvitations.splice(index, 1);
        if (userInvitations.length === 0) {
          this.pendingInvitations.delete(key);
        }
      }
    }
  }

  // Get all pending invitations (admin)
  getAllPendingInvitations() {
    const allInvitations = [];
    for (const [userId, invitations] of this.pendingInvitations.entries()) {
      allInvitations.push(...invitations.map((inv) => ({ ...inv })));
    }
    return allInvitations;
  }

  // Cleanup expired invitations
  cleanupExpiredInvitations(expiryTime = 24 * 60 * 60 * 1000) {
    const now = new Date();
    for (const [userId, invitations] of this.pendingInvitations.entries()) {
      const validInvitations = invitations.filter((invitation) => {
        const created = new Date(invitation.createdAt);
        return now - created < expiryTime;
      });

      if (validInvitations.length === 0) {
        this.pendingInvitations.delete(userId);
      } else {
        this.pendingInvitations.set(userId, validInvitations);
      }
    }
  }
}
