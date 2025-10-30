import Book from "../../DB/models/bookmodel.js";
import cloudinary from "../../utils/file Uploadind/cloudinaryConfig.js";
import streamifier from "streamifier";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { nanoid } from "nanoid";

// Helper Function: Upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/* ──────────────────────────────
   📘 Add New Book
────────────────────────────── */
export const addBook = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const data = req.body;
  const bookData = { ...data, UserID: userId };
  const customId = nanoid(6);

  if (req.file) {
    const folderPath = `Books/${userId}/book_${customId}`;
    const upload = await uploadToCloudinary(req.file.buffer, folderPath);
    bookData.image = {
      secure_url: upload.secure_url,
      public_id: upload.public_id,
    };
  }

  const newBook = await Book.create(bookData);
  res.status(201).json({
    message: "✅ Book added successfully",
    book: newBook,
  });
});

/* ──────────────────────────────
   📘 Get All Books (Ignore Deleted)
────────────────────────────── */
export const getAllBooks = asyncHandler(async (req, res, next) => {
  const { category, title, page = 1, limit = 10 } = req.query;
  const filter = { isDeleted: false };

  if (category) filter.Category = { $regex: category, $options: "i" };
  if (title) filter.Title = { $regex: title, $options: "i" };

  const skip = (page - 1) * limit;
  const books = await Book.find(filter).skip(skip).limit(Number(limit));
  const count = await Book.countDocuments(filter);

  res.json({
    message: "✅ Books fetched successfully",
    total: count,
    page: Number(page),
    books,
  });
});

/* ──────────────────────────────
   📘 Get Book by ID
────────────────────────────── */
export const getBookById = asyncHandler(async (req, res, next) => {
  const book = await Book.findOne({ _id: req.params.id, isDeleted: false });
  if (!book) throw new AppError("❌ Book not found", 404);

  res.json({ message: "✅ Book fetched successfully", book });
});

/* ──────────────────────────────
   📘 Update Book
────────────────────────────── */
export const updateBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const book = await Book.findOne({ _id: id, isDeleted: false });
  if (!book) throw new AppError("❌ Book not found", 404);

  if (book.UserID.toString() !== userId.toString()) {
    throw new AppError("⛔ Unauthorized to edit this book", 403);
  }

  if (req.file) {
    if (book.image?.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }
    const upload = await uploadToCloudinary(req.file.buffer, `Books/${userId}/book_${nanoid(6)}`);
    req.body.image = {
      secure_url: upload.secure_url,
      public_id: upload.public_id,
    };
  }

  const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "✅ Book updated successfully", book: updatedBook });
});

/* ──────────────────────────────
   📘 Soft Delete Book
────────────────────────────── */
export const deleteBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const book = await Book.findOne({ _id: id, isDeleted: false });
  if (!book) throw new AppError("❌ Book not found", 404);

  if (book.UserID.toString() !== userId.toString()) {
    throw new AppError("⛔ Unauthorized to delete this book", 403);
  }

  book.isDeleted = true;
  await book.save();

  res.json({ message: "🗑️ Book soft-deleted successfully" });
});
