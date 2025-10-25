import { v2 as cloudinary } from 'cloudinary'

export const cloud = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });

    return cloudinary
}



export const uploadfile = async ({ buffer, filePath } = {}) => {
    return new Promise(async (resolve, reject) => {
        await cloud().uploader.upload_stream(
            { folder: filePath },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve({
                    success: true,
                    result: {
                        url: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                        width: result.width,
                        height: result.height
                    }
                });
            }
        ).end(buffer);
    }
    )
}