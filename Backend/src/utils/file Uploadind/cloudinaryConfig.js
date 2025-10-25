import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

 const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 dotenv.config({ path: path.resolve(__dirname, "../../../config/dev.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 

export default cloudinary;
