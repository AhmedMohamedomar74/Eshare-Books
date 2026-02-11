import { findById, update } from "../../DB/db.services.js";
import userModel from "../../DB/models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { cloud, uploadfile } from "../../utils/cloudinary.js";
import { successResponce } from "../../utils/Response.js";

export const uploadImage = asyncHandler(async (req, res, next) => {
    // Check if file exists
    // console.log("the body from form-data",req.body)
    if (!req.file) {
        next(new Error("No file uploaded", { cause: 400 }))
        return
    }

    if (!req.body.id) {
        next(new Error("there is no id", { cause: 400 }))
        return
    }

    const findUser = await findById({ model: userModel, id: req.body.id })

    if (!findUser) {
        next(new Error("User not found", { cause: 404 }));
        return
    }

    // Upload to Cloudinary using buffer
    // const result = await cloud().uploader.upload_stream(
    //     { folder: "test" },
    //     (error, result) => {
    //         if (error) {
    //             return res.status(500).json({ 
    //                 success: false, 
    //                 message: "Upload failed",
    //                 error: error.message 
    //             });
    //         }

    //         return res.json({ 
    //             success: true, 
    //             result: {
    //                 url: result.secure_url,
    //                 public_id: result.public_id,
    //                 format: result.format,
    //                 width: result.width,
    //                 height: result.height
    //             }
    //         });
    //     }
    // ).end(req.file.buffer);
     try {
        // Upload to Cloudinary
        const result = await uploadfile({ 
            buffer: req.file.buffer, 
            filePath: `user-profiles/${req.body.id}`
        });

        // Update user profile picture
        const updatedUser = await update({
            model: userModel,
            filter: { _id: req.body.id },
            data: { profilePic: result.url },
            options: { new: true }
        });

        return successResponce({
            res,
            message: "Profile picture updated successfully",
            data: {
                user: {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    email: updatedUser.email,
                    profilePic: updatedUser.profilePic
                },
                image: result
            }
        });

    } catch (error) {
        console.error("Image upload error:", error);
        return next(new Error(`Image upload failed: ${error.message}`, { cause: 500 }));
    }

});