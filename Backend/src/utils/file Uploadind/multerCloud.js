import multer from "multer";

export const fileValidation = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  pdfs: ["application/pdf"],
};

export const upload = (allowedTypes = fileValidation.images) => {
  const storage = multer.memoryStorage();  

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("❌ File type not allowed!"), false);
    }
  };

  return multer({ storage, fileFilter });
};
