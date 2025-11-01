// user.routes.js
import { Router } from "express";
import {
    getUsers,
    getUserById,
    getProfile,
    updateUser,
    updateProfile,
    changePassword,
    deleteUser,
    confirmUser,
    sendFriendRequest,
    listFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    removeFriend
} from "./user.controller.js";
import { auth, adminCheckmiddelware } from "./../../middelwares/auth.middleware.js";
import { validateChangePassword, validateFriendId, validateGetUsers, validateListFriendRequests, validateRequestId, validateSendFriendRequest, validateUpdateProfile, validateUserId } from "../../middelwares/validation.middleware.js";

const router = Router();

// Public routes
// Protected routes (require authentication)
router.use(auth); // Apply auth middleware to all routes below

router.get("/profile", getProfile);
router.put("/profile", validateUpdateProfile,updateProfile);
router.patch("/change-password", validateChangePassword,changePassword);


router.post("/friend-request", validateSendFriendRequest, sendFriendRequest);
router.get("/friend-requests", validateListFriendRequests, listFriendRequests); // Can use ?status=pending|accepted|rejected
router.patch("/friend-request/:requestId/accept", validateRequestId, acceptFriendRequest);
router.patch("/friend-request/:requestId/reject", validateRequestId, rejectFriendRequest);
router.get("/friends", getFriendsList);
router.delete("/friends/:friendId", validateFriendId, removeFriend);

// Admin only routes
router.get("/", adminCheckmiddelware,validateGetUsers, getUsers);
router.get("/:id", adminCheckmiddelware, validateUserId,getUserById);
// router.put("/:id", adminCheckmiddelware, updateUser);


export default router;