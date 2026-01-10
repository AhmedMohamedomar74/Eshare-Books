import { Router } from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksByCategory,
} from "./book.service.js";
import {
  upload,
  fileValidation,
} from "../../utils/file Uploadind/multerCloud.js";
import { auth, adminCheckmiddelware } from "../../middelwares/auth.middleware.js";
import { validateRequest } from "../../middelwares/validation.middleware.js";  
import { BookValidation } from "./book.validation.js";  

const router = Router();

/* ──────────────────────────────
   📘 Add Book (With Validation)
────────────────────────────── */
router.post(
  "/addbook",
  auth,
  upload(fileValidation.images).single("image"),
  validateRequest(BookValidation, "body"), 
  addBook
);

    //📘 Get All Books  
 router.get("/allbooks", auth,  getAllBooks);
 /* ──────────────────────────────
   📘 Get Books by Category ID
────────────────────────────── */
router.get("/category/:categoryId", auth,getBooksByCategory);
 
router.get("/:id", auth, getBookById);

  
router.patch(
  "/:id",
  auth,
  upload(fileValidation.images).single("image"),
  updateBook
);

 
router.delete("/:id", auth, deleteBook);

export default router;
