import operationModel from "../../DB/models/operation.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// @desc    Get all operations
// @route   GET /api/operations

export const getAllOperation = asyncHandler(async (req, res) => {
  const operations = await operationModel
    .find()
    .populate("user_src", "firstName secondName email")
    .populate("user_dest", "firstName secondName email")
    .populate("book_id", "title author");

  res.status(200).json({
    success: true,
    message: "Get all operations successfully",
    data: operations,
  });
});

// @desc    Create new operation
// @route   POST /api/operations

export const createOperation = asyncHandler(async (req, res) => {
  const { user_src, user_dest, book_id, startDate, endDate, operationType } =
    req.body;

  if (!user_src || !user_dest || !book_id || !operationType) {
    return res.status(400).json({
      success: false,
      message: "user_src, user_dest, book_id, and operationType are required.",
    });
  }

  if (operationType === "borrow") {
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required for borrowing.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "endDate must be after startDate.",
      });
    }
  }

  const existingOperation = await operationModel.findOne({
    user_src,
    user_dest,
    book_id,
    status: "pending",
  });

  if (existingOperation) {
    return res.status(400).json({
      success: false,
      message: "This operation already exists and is pending.",
    });
  }

  const newOperation = await operationModel.create({
    user_src,
    user_dest,
    book_id,
    operationType,
    startDate: operationType === "borrow" ? startDate : undefined,
    endDate: operationType === "borrow" ? endDate : undefined,
  });

  res.status(201).json({
    success: true,
    message: "Operation created successfully",
    data: newOperation,
  });
});

// @desc    Update operation status
// @route   PUT /api/operations/:id

export const updateOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await operationModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Operation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Operation updated successfully",
    data: updated,
  });
});

// @desc    Delete an operation
// @route   DELETE /api/operations/:id

export const deleteOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await operationModel.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Operation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Operation deleted successfully",
  });
});
