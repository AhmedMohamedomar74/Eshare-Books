import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

export const fileValidation = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  pdfs: ["application/pdf"],
};

export const upload = (filetype, folder) => {
  // Configure storage
  const storage = diskStorage({
    destination: (req, file, cb) => {
 const folderPath=path.resolve(".",`${folder}/${req.user._id}`) 
      // Create folder if not exists
      if (fs.existsSync(folderPath)) {
        return cb(null, folderPath);
      } else {
        fs.mkdirSync(folderPath, { recursive: true });
        const filename =  `${folder}/${req.user._id}`;
        cb(null, filename);
      }
    },

    filename: (req, file, cb) => {
      const uniqueName = `${nanoid()}___${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  // File filter
  const fileFilter = (req, file, cb) => {
    if (filetype.includes(file.mimetype)) {
      cb(null, true); // ✅ Allowed type
    } else {
      cb(new Error(" File type not allowed!"), false);
    }
  };

  // Create multer instance
  const multerUpload = multer({ storage, fileFilter });

  return multerUpload;
};
