import operationModel from "../DB/models/operation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authorizeOperation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const operation = await operationModel.findById(id);

  if (!operation) {
    return next(new AppError("Operation not found", 404));
  }

  if (
    operation.user_src.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("Not authorized to perform this action", 403));
  }

  next();
});
