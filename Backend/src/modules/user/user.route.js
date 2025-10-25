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
    confirmUser
} from "./user.controller.js";
import { auth, adminCheckmiddelware } from "./../../middelwares/auth.middleware.js";
import { validateChangePassword, validateGetUsers, validateUpdateProfile, validateUserId } from "../../middelwares/validation.middleware.js";

const router = Router();

// Public routes
// Protected routes (require authentication)
router.use(auth); // Apply auth middleware to all routes below

router.get("/profile", getProfile);
router.put("/profile", validateUpdateProfile,updateProfile);
router.patch("/change-password", validateChangePassword,changePassword);

// Admin only routes
router.get("/", adminCheckmiddelware,validateGetUsers, getUsers);
router.get("/:id", adminCheckmiddelware, validateUserId,getUserById);
// router.put("/:id", adminCheckmiddelware, updateUser);


export default router;