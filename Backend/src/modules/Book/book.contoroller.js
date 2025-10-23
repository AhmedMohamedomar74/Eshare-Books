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
// import { authuntcation, AllowTo } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/addbook",
  upload(fileValidation.images).single("image"),
  addBook
);

router.get("/allbooks", getAllBooks);
router.get("/:id", getBookById);

router.patch(
  "/:id",
  upload(fileValidation.images).single("image"),
  updateBook
);

router.delete(
  "/:id",
  //   authuntcation,
  //   AllowTo(["User", "Admin"]),
  deleteBook
);

export default router;
