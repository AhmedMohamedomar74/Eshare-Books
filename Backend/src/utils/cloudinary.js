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

export const uploadfile = async ({ buffer, filePath, userId } = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Extract user ID from filePath or use provided userId
            const targetUserId = userId || filePath.split('/')[1];
            
            if (!targetUserId) {
                return reject(new Error('User ID not found in filePath or provided'));
            }

            // List all files in the user-profiles parent folder
            const { resources } = await cloud().api.resources({
                type: 'upload',
                prefix: 'user-profiles/',
                max_results: 500
            });

            // Filter to get ONLY the files that belong to this specific user
            const userFiles = resources.filter(resource => {
                const parts = resource.public_id.split('/');
                if (parts.length >= 2) {
                    const fileUserId = parts[1]; // This gets the userId part
                    return fileUserId === targetUserId;
                }
                return false;
            });

            // Delete only this user's files
            if (userFiles.length > 0) {
                const publicIds = userFiles.map(file => file.public_id);
                await cloud().api.delete_resources(publicIds);
            }

            // Upload new file
            await cloud().uploader.upload_stream(
                { 
                    folder: filePath,
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                        width: result.width,
                        height: result.height,
                        deletedCount: userFiles.length
                    });
                }
            ).end(buffer);

        } catch (error) {
            // If folder doesn't exist (404) or no files found, just upload the file
            if (error.http_code === 404 || error.message?.includes('not found')) {
                await cloud().uploader.upload_stream(
                    { 
                        folder: filePath,
                        transformation: [
                            { width: 300, height: 300, crop: 'limit' },
                            { quality: 'auto' },
                            { format: 'jpg' }
                        ]
                    },
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve({
                            url: result.secure_url,
                            public_id: result.public_id,
                            format: result.format,
                            width: result.width,
                            height: result.height,
                            deletedCount: 0
                        });
                    }
                ).end(buffer);
            } else {
                reject(error);
            }
        }
    });
}