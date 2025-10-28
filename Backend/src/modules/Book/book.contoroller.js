import { Router } from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "./book.service.js";
import {
  upload,
  fileValidation,
} from "../../utils/file Uploadind/multerCloud.js";
import { auth, adminCheckmiddelware } from "../../middelwares/auth.middleware.js";
import { validateRequest } from "../../middelwares/validation.middleware.js"; // ✅ استيراد الفاليديشن
import { BookValidation } from "./book.validation.js"; // ✅ استيراد سكيمة Joi

const router = Router();

/* ──────────────────────────────
   📘 Add Book (With Validation)
────────────────────────────── */
router.post(
  "/addbook",
  auth,
  upload(fileValidation.images).single("image"),
  validateRequest(BookValidation, "body"), // ✅ التحقق من البيانات قبل الإضافة
  addBook
);

    //📘 Get All Books (Admin Only)
 router.get("/allbooks", auth, adminCheckmiddelware, getAllBooks);

 
router.get("/:id", auth, getBookById);

  
router.patch(
  "/:id",
  auth,
  upload(fileValidation.images).single("image"),
  updateBook
);

 
router.delete("/:id", auth, deleteBook);

export default router;
