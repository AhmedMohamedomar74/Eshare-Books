// user.controller.js
import userModel from "./../../DB/models/User.model.js";
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
import { AppError } from "../../utils/AppError.js";
import { friendRequestStatusEnum, roleEnum } from "../../enum.js";

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


export const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const { friendId } = req.body;
    const userId = req.user._id;

    // Prevent sending friend request to yourself
    if (userId.toString() === friendId) {
        return next(new AppError("You cannot send a friend request to yourself", 400));
    }

    // Check if friend exists
    const friend = await findById({
        model: userModel,
        id: friendId
    });

    if (!friend) {
        return next(new AppError("User not found", 404));
    }

    // Get current user
    const currentUser = await findById({
        model: userModel,
        id: userId
    });

    // Check if already friends
    if (currentUser.friends.includes(friendId)) {
        return next(new AppError("You are already friends with this user", 400));
    }

    // Check if friend request already exists (pending)
    const existingRequest = currentUser.sentFriendRequests.find(
        req => req.userId.toString() === friendId && req.status === friendRequestStatusEnum.pending
    );

    if (existingRequest) {
        return next(new AppError("Friend request already sent", 400));
    }

    // Check if there's a pending request from the friend
    const incomingRequest = currentUser.receivedFriendRequests.find(
        req => req.userId.toString() === friendId && req.status === friendRequestStatusEnum.pending
    );

    if (incomingRequest) {
        return next(new AppError("This user has already sent you a friend request. Please accept or reject it.", 400));
    }

    // Add to sent requests for current user
    currentUser.sentFriendRequests.push({
        userId: friendId,
        status: friendRequestStatusEnum.pending,
        requestedAt: new Date()
    });

    // Add to received requests for friend
    friend.receivedFriendRequests.push({
        userId: userId,
        status: friendRequestStatusEnum.pending,
        requestedAt: new Date()
    });

    await currentUser.save();
    await friend.save();

    return successResponce({
        res,
        status: 201,
        message: "Friend request sent successfully",
        data: {
            requestedTo: {
                _id: friend._id,
                firstName: friend.firstName,
                secondName: friend.secondName,
                email: friend.email,
                profilePic: friend.profilePic
            }
        }
    });
});

// List Friend Requests (with status filter)
export const listFriendRequests = asyncHandler(async (req, res, next) => {
    const { status } = req.query;
    const userId = req.user._id;

    // Get current user with populated friend requests
    const user = await userModel.findById(userId)
        .populate({
            path: 'receivedFriendRequests.userId',
            select: 'firstName secondName email profilePic'
        })
        .select('-password');

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Filter received friend requests based on status
    let friendRequests = user.receivedFriendRequests;

    if (status) {
        friendRequests = friendRequests.filter(req => req.status === status);
    }

    // Format the response
    const formattedRequests = friendRequests.map(req => ({
        requestId: req._id,
        user: req.userId,
        status: req.status,
        requestedAt: req.requestedAt,
        respondedAt: req.respondedAt
    }));

    return successResponce({
        res,
        message: "Friend requests retrieved successfully",
        data: {
            friendRequests: formattedRequests,
            total: formattedRequests.length
        }
    });
});

// Accept Friend Request
export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    console.log({ requestId })
    const userId = req.user._id;

    // Get current user
    const user = await findById({
        model: userModel,
        id: userId
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Find the friend request

    console.log(user.receivedFriendRequests)
    const friendRequest = user.receivedFriendRequests[0];

    if (!friendRequest) {
        return next(new AppError("Friend request not found", 404));
    }

    if (friendRequest.status !== friendRequestStatusEnum.pending) {
        return next(new AppError("Friend request has already been responded to", 400));
    }

    const friendId = friendRequest.userId;

    // Get the friend
    const friend = await findById({
        model: userModel,
        id: friendId
    });

    if (!friend) {
        return next(new AppError("User not found", 404));
    }

    // Update the request status in received requests
    friendRequest.status = friendRequestStatusEnum.accepted;
    friendRequest.respondedAt = new Date();

    // Update the request status in friend's sent requests
    const sentRequest = friend.sentFriendRequests.find(
        req => req.userId.toString() === userId.toString()
    );
    
    if (sentRequest) {
        sentRequest.status = friendRequestStatusEnum.accepted;
        sentRequest.respondedAt = new Date();
    }

    // Add to friends list for both users
    if (!user.friends.includes(friendId)) {
        user.friends.push(friendId);
    }
    if (!friend.friends.includes(userId)) {
        friend.friends.push(userId);
    }

    await user.save();
    await friend.save();

    return successResponce({
        res,
        message: "Friend request accepted successfully",
        data: {
            friend: {
                _id: friend._id,
                firstName: friend.firstName,
                secondName: friend.secondName,
                email: friend.email,
                profilePic: friend.profilePic
            }
        }
    });
});

// Reject Friend Request
export const rejectFriendRequest = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const userId = req.user._id;

    // Get current user
    const user = await findById({
        model: userModel,
        id: userId
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Find the friend request
    const friendRequest = user.receivedFriendRequests.id(requestId);

    if (!friendRequest) {
        return next(new AppError("Friend request not found", 404));
    }

    if (friendRequest.status !== friendRequestStatusEnum.pending) {
        return next(new AppError("Friend request has already been responded to", 400));
    }

    const friendId = friendRequest.userId;

    // Get the friend
    const friend = await findById({
        model: userModel,
        id: friendId
    });

    if (!friend) {
        return next(new AppError("User not found", 404));
    }

    // Update the request status in received requests
    friendRequest.status = friendRequestStatusEnum.rejected;
    friendRequest.respondedAt = new Date();

    // Update the request status in friend's sent requests
    const sentRequest = friend.sentFriendRequests.find(
        req => req.userId.toString() === userId.toString()
    );
    
    if (sentRequest) {
        sentRequest.status = friendRequestStatusEnum.rejected;
        sentRequest.respondedAt = new Date();
    }

    await user.save();
    await friend.save();

    return successResponce({
        res,
        message: "Friend request rejected successfully"
    });
});

// Get Friends List
export const getFriendsList = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await userModel.findById(userId)
        .populate({
            path: 'friends',
            select: 'firstName secondName email profilePic'
        })
        .select('-password');

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    return successResponce({
        res,
        message: "Friends list retrieved successfully",
        data: {
            friends: user.friends,
            total: user.friends.length
        }
    });
});

// Remove Friend
export const removeFriend = asyncHandler(async (req, res, next) => {
    const { friendId } = req.params;
    const userId = req.user._id;

    // Get both users
    const user = await findById({
        model: userModel,
        id: userId
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const friend = await findById({
        model: userModel,
        id: friendId
    });

    if (!friend) {
        return next(new AppError("User not found", 404));
    }

    // Check if they are actually friends
    if (!user.friends.includes(friendId)) {
        return next(new AppError("You are not friends with this user", 400));
    }

    // Remove from friends list
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

    await user.save();
    await friend.save();

    return successResponce({
        res,
        message: "Friend removed successfully"
    });
});


export const getUserPublicProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await findOne({
        model: userModel,
        filter: { _id: id },
        select: 'firstName secondName email profilePic address friends createdAt'
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // Get friend count
    const friendCount = user.friends.length;

    // Prepare public profile data (exclude sensitive information)
    const publicProfile = {
        _id: user._id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        profilePic: user.profilePic,
        address: user.address,
        friendCount: friendCount,
        memberSince: user.createdAt
    };

    return successResponce({
        res,
        message: "User public profile retrieved successfully",
        data: publicProfile
    });
});