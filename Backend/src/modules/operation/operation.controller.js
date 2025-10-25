import operationModel from "../../DB/models/operation.model.js";
import { operationStatusEnum } from "../../enum.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { findByIdAndUpdate, softDelete } from "../../DB/db.services.js";

// @desc    Get all operations
// @route   GET /api/operations
export const getAllOperation = asyncHandler(async (req, res) => {
  const operations = await operationModel
    .find({ isDeleted: false })
    .populate("user_src", "firstName secondName email")
    .populate("user_dest", "firstName secondName email")
    .populate("book_src_id", "title author")
    .populate("book_dest_id", "title author");

  res.status(200).json({
    success: true,
    message: "Get all operations successfully",
    data: operations,
  });
});

// @desc    Create new operation
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

  //Check if a similar pending operation already exists
  const existingOperation = await operationModel.findOne({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
    status: operationStatusEnum.PENDING,
    isDeleted: false,
  });

  if (existingOperation) {
    return res.status(400).json({
      success: false,
      message: "This operation already exists and is pending.",
    });
  }

  // Create the new operation
  const newOperation = await operationModel.create({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
    startDate,
    endDate,
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
  const value = req.validatedBody;

  const updated = await findByIdAndUpdate({
    model: operationModel,
    id,
    data: value,
    options: { new: true },
  });

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

  const deleted = await softDelete({
    model: operationModel,
    filter: { _id: id },
    options: { new: true },
  });

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Operation not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Operation deleted successfully",
    data: deleted,
  });
});
