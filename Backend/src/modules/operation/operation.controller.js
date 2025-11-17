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
import { NotificationInstance } from "../../Gateways/notification.instance.js";

// Helper Functions

// Find book by ID
const findBookById = async (bookId) => await bookmodel.findById(bookId);

// Find user by ID
const findUserById = async (userId) => await userModel.findById(userId);

// Controllers

// @desc    Get all operations
// @route   GET /api/operations
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

// ----------------------------------------------------------------------
// @desc    Create new operation (buy / exchange / borrow / donate)
// @route   POST /api/operations
export const createOperation = asyncHandler(async (req, res) => {
  const {
    user_dest,
    book_src_id,
    book_dest_id,
    startDate,
    endDate,
    numberOfDays,
    operationType,
  } = req.validatedBody;

  const user_src = req.user._id; // الطالب (Source User)

  if (user_src.toString() === user_dest.toString()) {
    throw new AppError("You cannot perform an operation with yourself.", 400);
  }

  const destUser = await findUserById(user_dest);
  if (!destUser) {
    throw new AppError("Destination user does not exist.", 404);
  }

  const mainBook = await findBookById(book_dest_id);
  if (!mainBook) {
    throw new AppError("Requested book does not exist.", 404);
  }

  const exchangeBook =
    operationType === "exchange" && book_src_id
      ? await findBookById(book_src_id)
      : null; //  (Transaction Type Validation)

  await validateBookTransactionType({
    operationType,
    srcBook: mainBook,
    destBook: exchangeBook,
  }); //  (Ownership Validation)

  await validateOperationOwnership({
    operationType,
    user_src,
    user_dest,
    srcBook: mainBook,
    destBook: exchangeBook,
  });

  await validateActiveStatus({
    operationType,
    book_src_id,
    book_dest_id,
  });

  await validateDuplicateOperation({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
  });

  const newOperationData = {
    user_src,
    user_dest,
    book_dest_id,
    operationType,
  };

  if (book_src_id && operationType === "exchange") {
    newOperationData.book_src_id = book_src_id;
  } // --- ✅ منطق حساب مدة وسعر الاستعارة (Borrow Logic) ---

  if (operationType === "borrow") {
    let days = 0;
    const pricePerDay = Number(mainBook.PricePerDay) || 0;

    if (startDate && endDate) {
      // الحالة 1: تم إدخال تاريخ بداية ونهاية
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start)
        throw new AppError("End date must be after start date.", 400); // حساب الفرق بالأيام وتقريبه للأعلى

      const diffTime = Math.abs(end - start);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      newOperationData.startDate = startDate;
      newOperationData.endDate = endDate;
      newOperationData.numberOfDays = days;
    } else if (numberOfDays) {
      // الحالة 2: تم إدخال عدد الأيام مباشرة
      days = Number(numberOfDays);
      if (days <= 0) throw new AppError("Invalid number of days.", 400);
      newOperationData.numberOfDays = days;
    } else {
      // حالة خطأ: لا توجد مدة محددة
      throw new AppError(
        "Borrow duration (dates or number of days) is required.",
        400
      );
    } // حساب السعر الإجمالي (يتم دائماً على السيرفر لضمان الأمان والدقة)

    newOperationData.totalPrice = pricePerDay * days;
  } // --- نهاية منطق الاستعارة --- // إنشاء العملية في قاعدة البيانات
  const newOperation = await operationModel.create(newOperationData);
  await NotificationInstance.send({
    fromUserId: user_src,
    toUserId: user_dest,
    invitationType: "operation_request",
    message: `You have a new ${operationType} request.`,
    metadata: {
      operationId: newOperation._id.toString(),
      bookId: book_dest_id.toString(),
      type: operationType,
    },
  });

  return successResponce({
    res,
    status: 201,
    message: "Operation created successfully",
    data: newOperation,
  });
});

// @desc    Update operation status
// @route   PUT /api/operations/:id
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

  if (value.status === "completed") {
    await NotificationInstance.send({
      fromUserId: req.user._id,
      toUserId: updated.user_src.toString(),
      invitationType: "operation_completed",
      message: `Your ${updated.operationType} operation is completed.`,
      metadata: { operationId: updated._id.toString() },
    });
  }

  return successResponce({
    res,
    status: 200,
    message: "Operation updated successfully",
    data: updated,
  });
});

// @desc    Soft delete an operation
// @route   DELETE /api/operations/:id
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
