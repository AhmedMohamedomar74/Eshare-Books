import Wishlist from '../../DB/models/wishlist.model.js';
import Book from '../../DB/models/bookmodel.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { successResponce } from '../../utils/Response.js';
import mongoose from 'mongoose';

// Add a book to user's wishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) return next(new AppError('Invalid book ID', 400));

  // Check if book exists & not deleted
  const book = await Book.findOne({ _id: bookId, isDeleted: false });
  if (!book) return next(new AppError('Book not found or has been deleted', 404));

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [{ bookId }] });
  } else {
    const alreadyExists = wishlist.items.some((item) => item.bookId.toString() === bookId);
    if (alreadyExists) return next(new AppError('Book already in wishlist', 400));

    wishlist.items.push({ bookId });
  }

  await wishlist.save();

  return successResponce({
    res,
    status: 201,
    message: 'Book added to wishlist',
    data: wishlist,
  });
});

// Get the user's wishlist (only active books)
export const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate({
      path: 'items.bookId',
      match: { isDeleted: false },
      select: 'Title Price image TransactionType',
    })
    .lean();

  const activeItems = wishlist?.items?.filter((i) => i.bookId !== null) || [];

  return successResponce({
    res,
    message: 'Wishlist fetched successfully',
    data: { items: activeItems },
  });
});

// Remove a book from wishlist
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) return next(new AppError('Invalid book ID', 400));

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { items: { bookId } } },
    { new: true }
  ).populate({
    path: 'items.bookId',
    match: { isDeleted: false },
  });

  if (!wishlist) return next(new AppError('Wishlist not found for this user', 404));

  return successResponce({
    res,
    message: 'Book removed from wishlist',
    data: wishlist,
  });
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { items: [] },
    { new: true }
  );

  return successResponce({
    res,
    message: 'Wishlist cleared successfully',
    data: wishlist,
  });
});
