import Book from '../../DB/models/bookmodel.js';
import cloudinary from '../../utils/file Uploadind/cloudinaryConfig.js';
import streamifier from 'streamifier';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { nanoid } from 'nanoid';

// Helper Function: Upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// /* ──────────────────────────────
//    📘 Add New Book
// ────────────────────────────── */
// export const addBook = asyncHandler(async (req, res) => {
//   const userId = req.user._id; // ✅ جاي من التوكن

//   const data = req.body;
//   const bookData = { ...data, UserID: userId };
//   const customId = nanoid(6);
//   if (req.file) {
//     const folderPath = `Books/${userId}/book_${customId}`;
//     const upload = await uploadToCloudinary(req.file.buffer, folderPath);

//     bookData.image = {
//       secure_url: upload.secure_url,
//       public_id: upload.public_id,
//     };
//   }

//   const newBook = await Book.create(bookData);
//   res.status(201).json({
//     message: "✅ Book added successfully",
//     book: newBook,
//   });
// });

// Helper Function: Delete from Cloudinary
const deleteFromCloudinary = async (fileUrl) => {
  try {
    const parts = fileUrl.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const folderPath = parts.slice(parts.indexOf('Books')).slice(0, -1).join('/');
    const publicId = `${folderPath}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};
/* ──────────────────────────────
   Add New Book (with AI Moderation)
────────────────────────────── */
export const addBook = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = req.body;
  const customId = nanoid(6);
  let uploadedImage = null;

  // Check the text first
  const textModeration = await moderateText(data.Title || '', data.Description || '');
  if (textModeration.flagged) {
    return res.status(400).json({
      success: false,
      message: `🚫 Book rejected: ${
        textModeration.reason || 'Text contains harmful or hateful language.'
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
        message: 'Book rejected: Image contains inappropriate or NSFW content.',
        source: imageModeration.source || 'huggingface',
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
    message: '✅ Book added successfully (AI Approved)',
    book: newBook,
  });
});

/* ──────────────────────────────
   📘 Get All Books (Admin Only)
────────────────────────────── */
export const getAllBooks = asyncHandler(async (req, res) => {
  const { category, title, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (category) filter.Category = { $regex: category, $options: 'i' };
  if (title) filter.Title = { $regex: title, $options: 'i' };

  const skip = (page - 1) * limit;
  const books = await Book.find(filter).skip(skip).limit(Number(limit));
  const count = await Book.countDocuments(filter);

  res.json({
    message: '✅ Books fetched successfully',
    total: count,
    page: Number(page),
    books,
  });
});

/* ──────────────────────────────
   📘 Get Book by ID
────────────────────────────── */
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  //const book = await Book.findById(req.params.id).populate("UserID", "name email");

  if (!book) return res.status(404).json({ message: '❌ Book not found' });
  res.json({ message: '✅ Book fetched successfully', book });
});

/* ──────────────────────────────
   📘 Update Book
────────────────────────────── */
export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // ✅ من التوكن

  const book = await Book.findById(id);

  if (!book) return res.status(404).json({ message: '❌ Book not found' });
  if (book.UserID.toString() !== userId.toString()) {
    return res.status(403).json({ message: '⛔ Unauthorized to edit this book' });
  }

  // ✅ لو في صورة جديدة
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
  res.json({ message: '✅ Book updated successfully', book: updatedBook });
});

/* ──────────────────────────────
   📘 Delete Book
────────────────────────────── */
export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // ✅ من التوكن

  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: '❌ Book not found' });

  if (book.UserID.toString() !== userId.toString()) {
    return res.status(403).json({ message: '⛔ Unauthorized to delete this book' });
  }

  // ✅ حذف الصورة من Cloudinary
  if (book.image?.public_id) {
    await cloudinary.uploader.destroy(book.image.public_id);
  }

  await Book.findByIdAndDelete(id);
  res.json({ message: '✅ Book deleted successfully' });
});
