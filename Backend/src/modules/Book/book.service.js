import Book from "../../DB/models/bookmodel.js";
import cloudinary from "../../utils/file Uploadind/cloudinaryConfig.js";
import streamifier from "streamifier";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { nanoid } from "nanoid";
import { moderateImage, moderateText } from "../../utils/ai/moderation.js";
import mongoose from "mongoose";

// 👇 إضافة موديل العمليات + الـ enums
import Operation from "../../DB/models/operation.model.js";
import { operationStatusEnum, operationTypeEnum } from "../../enum.js";

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

// Helper Function: Delete from Cloudinary
const deleteFromCloudinary = async (fileUrl) => {
  try {
    const parts = fileUrl.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folderPath = parts.slice(parts.indexOf("Books")).slice(0, -1).join("/");
    const publicId = `${folderPath}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

/* ──────────────────────────────
   Add New Book (with AI Moderation)
────────────────────────────── */
export const addBook = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const data = req.body;
  const customId = nanoid(6);
  let uploadedImage = null;

  // Check the text first
  const textModeration = await moderateText(data.Title || "", data.Description || "");
  if (textModeration.flagged) {
    return res.status(400).json({
      success: false,
      message: `🚫 Book rejected: ${
        textModeration.reason || "Text contains harmful or hateful language."
      }`,
      source: textModeration.source,
    });
  }

  // Upload the image after verifying the text
  if (req.file) {
    const folderPath = `Books/${userId}/book_${customId}`;
    const upload = await uploadToCloudinary(req.file.buffer, folderPath);
    uploadedImage = {
      secure_url: upload.secure_url,
      public_id: upload.public_id,
    };

    // Check the image after it has been uploaded
    const imageModeration = await moderateImage(uploadedImage.secure_url);
    if (!imageModeration.safe) {
      await deleteFromCloudinary(uploadedImage.secure_url);
      return res.status(400).json({
        success: false,
        message: "Book rejected: Image contains inappropriate or NSFW content.",
        source: imageModeration.source || "huggingface",
      });
    }
  }

  const newBook = await Book.create({
    ...data,
    UserID: userId,
    image: uploadedImage,
    IsModerated: true,
  });

  res.status(201).json({
    success: true,
    message: "✅ Book added successfully (AI Approved)",
    book: newBook,
  });
});

/* ──────────────────────────────
   📘 Get All Books (Home) + Pagination
   - Ignore Deleted
   - Hide sold/donated books (buy/donate + completed)
   - Mark borrowed now (borrow + completed & date in range)
────────────────────────────── */
export const getAllBooks = asyncHandler(async (req, res, next) => {
  let { title, page = 1, limit = 10 } = req.query;

  const filter = { isDeleted: false };
  if (title) filter.Title = { $regex: title, $options: "i" };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const now = new Date();

  // 1️⃣ الكتب اللي اتباعت أو اتمدت (BUY + DONATE مكتملة)
  const soldBookIds = await Operation.distinct("book_dest_id", {
    operationType: { $in: [operationTypeEnum.BUY, operationTypeEnum.DONATE] },
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
  });

  // 2️⃣ عمليات الـ BORROW النشطة حاليًا
  const activeBorrowOps = await Operation.find({
    operationType: operationTypeEnum.BORROW,
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).select("book_dest_id");

  const activeBorrowIds = new Set(
    activeBorrowOps.map((op) => op.book_dest_id.toString())
  );

  // 3️⃣ نجيب الكتب اللي مش متباعة/متمدية – الأحدث أولاً
  const books = await Book.find({
    ...filter,
    _id: { $nin: soldBookIds },
  })
    .populate("UserID", "firstName secondName email avatar name")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // 4️⃣ فلاغ availability
  const booksWithAvailability = books.map((book) => ({
    ...book,
    isBorrowedNow: activeBorrowIds.has(book._id.toString()),
  }));

  const count = await Book.countDocuments({
    ...filter,
    _id: { $nin: soldBookIds },
  });

  res.json({
    message: "✅ Books fetched successfully",
    total: count,
    page: pageNum,
    limit: limitNum,
    books: booksWithAvailability,
  });
});

/* ──────────────────────────────
   📘 Get Books by Category
   - نفس منطق availability + إخفاء الكتب المباعة/المتمدية
────────────────────────────── */
export const getBooksByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const now = new Date();

  const soldBookIds = await Operation.distinct("book_dest_id", {
    operationType: { $in: [operationTypeEnum.BUY, operationTypeEnum.DONATE] },
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
  });

  const activeBorrowOps = await Operation.find({
    operationType: operationTypeEnum.BORROW,
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).select("book_dest_id");

  const activeBorrowIds = new Set(
    activeBorrowOps.map((op) => op.book_dest_id.toString())
  );

  const books = await Book.find({
    categoryId,
    isDeleted: false,
    _id: { $nin: soldBookIds },
  })
    .populate("UserID", "firstName secondName email avatar name")
    .populate("categoryId", "name")
    .lean();

  const booksWithAvailability = books.map((book) => ({
    ...book,
    isBorrowedNow: activeBorrowIds.has(book._id.toString()),
  }));

  res.json({
    message: "✅ Books fetched successfully for this category",
    total: booksWithAvailability.length,
    books: booksWithAvailability,
  });
});

/* ──────────────────────────────
   📘 Get Book by ID
   - يخفي الكتب اللي اتباعت أو اتمدت (BUY / DONATE + COMPLETED)
   - يعلّم الكتب المستعارة حاليًا بـ isBorrowedNow + currentBorrow
────────────────────────────── */
export const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const now = new Date();

  // 1️⃣ لو فيه عملية BUY أو DONATE مكتملة على الكتاب → اعتبره غير موجود
  const soldOrDonatedOp = await Operation.findOne({
    book_dest_id: id,
    operationType: { $in: [operationTypeEnum.BUY, operationTypeEnum.DONATE] },
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
  });

  if (soldOrDonatedOp) {
    throw new AppError("❌ Book not found", 404);
  }

  // 2️⃣ هل فيه عملية BORROW نشطة حاليًا على الكتاب؟
  const activeBorrowOp = await Operation.findOne({
    book_dest_id: id,
    operationType: operationTypeEnum.BORROW,
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  // 3️⃣ نجيب الكتاب نفسه
  const bookDoc = await Book.findOne({ _id: id, isDeleted: false })
    .populate("UserID", "firstName secondName email avatar name")
    .populate("categoryId", "name");

  if (!bookDoc) throw new AppError("❌ Book not found", 404);

  // 4️⃣ نضيف فلاغ isBorrowedNow + مدة الاستعارة (لو موجودة)
  const book = bookDoc.toObject();
  book.isBorrowedNow = !!activeBorrowOp;
  book.currentBorrow = activeBorrowOp
    ? {
        startDate: activeBorrowOp.startDate,
        endDate: activeBorrowOp.endDate,
      }
    : null;

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
    const upload = await uploadToCloudinary(
      req.file.buffer,
      `Books/${userId}/book_${nanoid(6)}`
    );
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
  res.json({ message: "✅ Book deleted successfully" });
});

/* ──────────────────────────────
   📘 Get Books by Transaction Type
   - تستخدم في الفلتر by type في Home
   - نفس منطق الكتب المباعة + الاستعارة
────────────────────────────── */
export const getBooksByTransactionType = asyncHandler(async (req, res) => {
  const { type } = req.params; // toSale / toBorrow / ...

  const validTypes = ["toSale", "toBorrow", "toExchange", "toDonate"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "❌ Invalid transaction type.",
      allowedTypes: validTypes,
    });
  }

  const now = new Date();

  const soldBookIds = await Operation.distinct("book_dest_id", {
    operationType: { $in: [operationTypeEnum.BUY, operationTypeEnum.DONATE] },
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
  });

  const activeBorrowOps = await Operation.find({
    operationType: operationTypeEnum.BORROW,
    status: operationStatusEnum.COMPLETED,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).select("book_dest_id");

  const activeBorrowIds = new Set(
    activeBorrowOps.map((op) => op.book_dest_id.toString())
  );

  const books = await Book.find({
    TransactionType: type,
    isDeleted: false,
    _id: { $nin: soldBookIds },
  })
    .populate("UserID", "firstName secondName email avatar name")
    .populate("categoryId", "name")
    .lean();

  const booksWithAvailability = books.map((book) => ({
    ...book,
    isBorrowedNow: activeBorrowIds.has(book._id.toString()),
  }));

  res.json({
    success: true,
    message: `✅ Books fetched successfully for type: ${type}`,
    total: booksWithAvailability.length,
    books: booksWithAvailability,
  });
});

/* ──────────────────────────────
   📘 Get Books by UserId
────────────────────────────── */
export const getBooksByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("❌ Invalid user ID", 400);
  }

  const books = await Book.find({
    UserID: userId,
    isDeleted: false,
  })
    .populate("UserID", "firstName secondName email avatar name")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "✅ Books fetched successfully for this user",
    total: books.length,
    books,
  });
});
