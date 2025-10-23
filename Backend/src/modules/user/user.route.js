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

const router = Router();

// Public routes
// Protected routes (require authentication)
router.use(auth); // Apply auth middleware to all routes below

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.patch("/change-password", changePassword);

// Admin only routes
router.get("/", adminCheckmiddelware, getUsers);
router.get("/:id", adminCheckmiddelware, getUserById);
// router.put("/:id", adminCheckmiddelware, updateUser);


export default router;