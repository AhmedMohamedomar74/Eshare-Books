// user.controller.js
import userModel, { roleEnum } from "./../../DB/models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponce } from "../../utils/Response.js";
import { 
    findOne, 
    create, 
    update, 
    deleteOne, 
    findMany, 
    findById, 
    countDocuments,
    findWithPagination 
} from "../../DB/db.services.js";
import { compareHash, genrateHash } from "../../utils/secuirty/hash.services.js";

// Create User
export const createUser = asyncHandler(async (req, res, next) => {
    const { firstName, secondName, email, password, address, role, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await findOne({
        model: userModel,
        filter: { email }
    });

    if (existingUser) {
        return next(new Error("User already exists with this email", { cause: 409 }));
    }

    // Hash password
    const hashedPassword = await genrateHash({ plainText: password  , saltRound : process.env.SALT});

    // Create user
    const user = await create({
        model: userModel,
        data: {
            firstName,
            secondName,
            email,
            password: hashedPassword,
            address,
            role: role || roleEnum.user,
            profilePic,
            isConfirmed: false
        }
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return successResponce({
        res,
        status: 201,
        message: "User created successfully",
        data: userResponse
    });
});

// Get All Users (with pagination and filtering) - UPDATED
export const getUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, search, role } = req.query;

    // Build filter
    const filter = {};

    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { secondName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    if (role && Object.values(roleEnum).includes(role)) {
        filter.role = role;
    }

    // Get users with pagination using the new service
    const result = await findWithPagination({
        model: userModel,
        filter,
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select: '-password'
    });

    return successResponce({
        res,
        message: "Users retrieved successfully",
        data: {
            users: result.data,
            pagination: result.pagination
        }
    });
});

// Get User by ID - UPDATED
export const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await findById({
        model: userModel, 
        id: id,
        select: '-password'
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    return successResponce({
        res,
        message: "User retrieved successfully",
        data: user
    });
});

// Get Current User Profile
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await findOne({
        model: userModel,
        filter: { _id: req.user._id },
        select: '-password'
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    return successResponce({
        res,
        message: "Profile retrieved successfully",
        data: user
    });
});

// Update User - UPDATED
export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, secondName, email, address, role, profilePic } = req.body;

    // Check if user exists
    const existingUser = await findById({
        model: userModel,
        id: id
    });

    if (!existingUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
        const emailExists = await findOne({
            model: userModel,
            filter: { email, _id: { $ne: id } }
        });

        if (emailExists) {
            return next(new Error("Email already taken", { cause: 409 }));
        }
    }

    // Update user
    const updatedUser = await update({
        model: userModel,
        filter: { _id: id },
        data: {
            ...(firstName && { firstName }),
            ...(secondName && { secondName }),
            ...(email && { email }),
            ...(address && { address }),
            ...(role && { role }),
            ...(profilePic && { profilePic })
        },
        options: { new: true }
    });

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return successResponce({
        res,
        message: "User updated successfully",
        data: userResponse
    });
});

// Update Profile (for current user) - UPDATED
export const updateProfile = asyncHandler(async (req, res, next) => {
    const { firstName, secondName, email, address, profilePic } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
        const emailExists = await findOne({
            model: userModel,
            filter: { email, _id: { $ne: req.user._id } }
        });

        if (emailExists) {
            return next(new Error("Email already taken", { cause: 409 }));
        }
    }

    // Update user using findByIdAndUpdate for better performance
    const updatedUser = await update({
        model: userModel,
        filter: { _id: req.user._id },
        data: {
            ...(firstName && { firstName }),
            ...(secondName && { secondName }),
            ...(email && { email }),
            ...(address && { address }),
            ...(profilePic && { profilePic }),
        },
        options: { new: true }
    });

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return successResponce({
        res,
        message: "Profile updated successfully",
        data: userResponse
    });
});

// Change Password - UPDATED
export const changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new Error("Current password and new password are required", { cause: 400 }));
    }

    // Get user with password
    const user = await findById({
        model: userModel,
        id: req.user._id
    });

    // Verify current password
    const isMatch = await compareHash({
        plainText: currentPassword,
        hashText: user.password
    });

    if (!isMatch) {
        return next(new Error("Current password is incorrect", { cause: 401 }));
    }

    // Hash new password
    const hashedNewPassword = await genrateHash({ plainText: newPassword  , saltRound: parseInt(process.env.HASH_SALT_ROUND)});

    // Update password using findByIdAndUpdate
    await update({
        model: userModel,
        filter: { _id: req.user._id },
        data: { password: hashedNewPassword }
    });

    return successResponce({
        res,
        message: "Password changed successfully"
    });
});

// Delete User - UPDATED
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if user exists
    const user = await findById({
        model: userModel,
        id: id
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // Prevent users from deleting themselves (optional)
    if (req.user._id.toString() === id) {
        return next(new Error("You cannot delete your own account", { cause: 400 }));
    }

    // Delete user using findByIdAndDelete
    await deleteOne({
        model: userModel,
        filter: { _id: id }
    });

    return successResponce({
        res,
        message: "User deleted successfully"
    });
});

// Confirm User (for admin) - UPDATED
export const confirmUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await findById({
        model: userModel,
        id: id
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (user.isConfirmed) {
        return next(new Error("User is already confirmed", { cause: 400 }));
    }

    const updatedUser = await update({
        model: userModel,
        filter: { _id: id },
        data: { isConfirmed: true },
        options: { new: true }
    });

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return successResponce({
        res,
        message: "User confirmed successfully",
        data: userResponse
    });
});