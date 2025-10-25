import operationModel from "../DB/models/operation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authorizeOperation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const operation = await operationModel.findById(id);

  if (!operation) {
    return res.status(404).json({ message: "Operation not found" });
  }

  if (
    operation.user_src.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  next();
});
