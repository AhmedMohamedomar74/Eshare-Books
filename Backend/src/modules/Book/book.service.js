import Book from "../../DB/models/bookmodel.js";
import cloudinary from "../../utils/file Uploadind/cloudinaryConfig.js";
import streamifier from "streamifier";
import { asyncHandler } from "../../utils/asyncHandler.js";
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
export const addBook = asyncHandler(async (req, res) => {
  // 🔹 مؤقتًا إلى أن يتم ربط الـ JWT
  const userId = "670f12a42f6f8b7e5c123456";
//   const userId = req.user._id;
  const data = req.body;
  const bookData = { ...data, UserID: userId };

  let customId = nanoid(6); // معرف عشوائي للكتاب داخل فولدر المستخدم

  // 🔹 لو الصورة موجودة في الطلب
  if (req.file) {
    // 📁 نخزن الصورة داخل فولدر خاص بالمستخدم
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
   📘 Get All Books (with filter & pagination)
────────────────────────────── */
export const getAllBooks = asyncHandler(async (req, res) => {
  const { category, title, page = 1, limit = 10 } = req.query;
  const filter = {};

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
export const getBookById = asyncHandler(async (req, res) => {
//   const book = await Book.findById(req.params.id).populate("UserID", "name email");
    const book = await Book.findById(req.params.id) ;

  if (!book) return res.status(404).json({ message: "❌ Book not found" });
  res.json({ message: "✅ Book fetched successfully", book });
});

/* ──────────────────────────────
   📘 Update Book
────────────────────────────── */
export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
//   const userId = req.user._id;
  const userId = "670f12a42f6f8b7e5c123456"; // مؤقت لغاية ما يتربط التوكن

  const book = await Book.findById(id);

  if (!book) return res.status(404).json({ message: "❌ Book not found" });
  if (book.UserID.toString() !== userId.toString()) {
    return res.status(403).json({ message: "⛔ Unauthorized to edit this book" });
  }

  // لو في صورة جديدة
  if (req.file) {
    if (book.image?.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }
    const upload = await uploadToCloudinary(req.file.buffer, "books");
    req.body.image = {
      secure_url: upload.secure_url,
      public_id: upload.public_id,
    };
  }

  const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "✅ Book updated successfully", book: updatedBook });
});

/* ──────────────────────────────
   📘 Delete Book
────────────────────────────── */
export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
//   const userId = req.user._id;
const userId = "670f12a42f6f8b7e5c123456";


  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: "❌ Book not found" });
  if (book.UserID.toString() !== userId.toString()) {
    return res.status(403).json({ message: "⛔ Unauthorized to delete this book" });
  }

  // حذف الصورة من Cloudinary
  if (book.image?.public_id) {
    await cloudinary.uploader.destroy(book.image.public_id);
  }

  await Book.findByIdAndDelete(id);
  res.json({ message: "✅ Book deleted successfully" });
});
