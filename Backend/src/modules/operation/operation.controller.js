import operationModel from "../../DB/models/operation.model.js";
import { operationStatusEnum } from "../../enum.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { findByIdAndUpdate, softDelete } from "../../DB/db.services.js";
import userModel from "../../DB/models/User.model.js";
import bookmodel from "../../DB/models/bookmodel.js";
import {
  validateActiveStatus,
  validateBookTransactionType,
  validateDuplicateOperation,
  validateOperationOwnership,
} from "./operationValidation.service.js";
import { successResponce } from "../../utils/Response.js";
import { AppError } from "../../utils/AppError.js";

// Helper Functions

// Find book by ID
const findBookById = async (bookId) => await bookmodel.findById(bookId);

// Find user by ID
const findUserById = async (userId) => await userModel.findById(userId);

// Check if user owns a specific book
// const checkBookOwnership = async (bookId, userId) =>
//   await bookmodel.findOne({ _id: bookId, UserID: userId });

// // Check if book is already in another pending operation
// const checkActiveBookOperation = async (bookId) =>
//   await operationModel.findOne({
//     $or: [{ book_src_id: bookId }, { book_dest_id: bookId }],
//     status: operationStatusEnum.PENDING,
//     isDeleted: false,
//   });

// Check if same operation already exists
// const checkExistingOperation = async ({
//   user_src,
//   user_dest,
//   book_src_id,
//   book_dest_id,
//   operationType,
// }) =>
//   await operationModel.findOne({
//     user_src,
//     user_dest,
//     book_src_id,
//     book_dest_id,
//     operationType,
//     status: operationStatusEnum.PENDING,
//     isDeleted: false,
//   });

// Controllers

// @desc    Get all operations
// @route   GET /api/operations
export const getAllOperation = asyncHandler(async (req, res) => {
  const operations = await operationModel
    .find({ isDeleted: false })
    .populate("user_src", "firstName secondName email")
    .populate("user_dest", "firstName secondName email")
    .populate("book_src_id", "title author")
    .populate("book_dest_id", "title author");

  return successResponce({
    res,
    status: 200,
    message: "All operations retrieved successfully",
    data: operations,
  });
});

// @desc    Create new operation (exchange / borrow)
// @route   POST /api/operations
export const createOperation = asyncHandler(async (req, res) => {
  const {
    user_dest,
    book_src_id,
    book_dest_id,
    startDate,
    endDate,
    operationType,
  } = req.validatedBody;

  const user_src = req.user._id;

  // Prevent user from performing an operation with themselves
  if (user_src.toString() === user_dest.toString()) {
    throw new AppError("You cannot perform an operation with yourself.", 400);
  }

  // Verify destination user
  const destUser = await findUserById(user_dest);
  if (!destUser) {
    throw new AppError("Destination user does not exist.", 404);
  }

  // Verify source book
  const srcBook = await findBookById(book_dest_id);
  if (!srcBook) {
    throw new AppError("Source book does not exist.", 404);
  }

  // Verify destination book (only for exchange)
  const destBook =
    operationType === "exchange" && book_dest_id
      ? await findBookById(book_dest_id)
      : null;

  // validate transaction type
  await validateBookTransactionType({
    operationType,
    srcBook,
    destBook,
  });

  // Validate ownership logic
  await validateOperationOwnership({
    operationType,
    user_src,
    user_dest,
    srcBook,
    destBook,
  });

  // Validate that involved books are not already in another active operation
  await validateActiveStatus({ operationType, book_src_id, book_dest_id });

  // Validate that the same operation is not already pending
  await validateDuplicateOperation({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
  });

  // Create the operation
  const newOperationData = {
    user_src,
    user_dest,
    book_src_id,
    operationType,
    startDate,
    endDate,
  };

  if (book_dest_id) newOperationData.book_dest_id = book_dest_id;

  const newOperation = await operationModel.create(newOperationData);

  return successResponce({
    res,
    status: 201,
    message: "Operation created successfully",
    data: newOperation,
  });
});

// @desc    Update operation status
// @route   PUT /api/operations/:id
export const updateOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const value = req.validatedBody;

  const updated = await findByIdAndUpdate({
    model: operationModel,
    id,
    data: value,
    options: { new: true },
  });

  if (!updated) {
    throw new AppError("Operation not found.", 404);
  }

  return successResponce({
    res,
    status: 200,
    message: "Operation updated successfully",
    data: updated,
  });
});

// @desc    Soft delete an operation
// @route   DELETE /api/operations/:id
export const deleteOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await softDelete({
    model: operationModel,
    filter: { _id: id },
    options: { new: true },
  });

  if (!deleted) {
    throw new AppError("Operation not found.", 404);
  }

  return successResponce({
    res,
    status: 200,
    message: "Operation deleted successfully",
    data: deleted,
  });
});
