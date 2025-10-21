import { asyncHandler } from "../../utils/asyncHandler.js";
import { cloud, uploadfile } from "../../utils/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res, next) => {
    // Check if file exists
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
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


        // Upload to Cloudinary using buffer
        const result = await uploadfile({buffer : req.file.buffer, filePath  : "1234"});

        return res.json({
            success: true,
            result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Upload failed",
            error: error.message
        });
    }

});