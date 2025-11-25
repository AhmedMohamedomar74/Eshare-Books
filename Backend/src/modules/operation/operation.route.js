import express from "express";
import {
  createOperation,
  deleteOperation,
  getAllOperation,
  getUserOperations,
  updateOperation,
} from "./operation.controller.js";
import { auth } from "../../middelwares/auth.middleware.js";
import {
  validateCreateOperation,
  validateUpdateOperation,
} from "../../middelwares/validationOperation.middleware.js";
import { authorizeOperation } from "../../middelwares/authOperation.middleware.js";

const operationRouter = express.Router();
operationRouter.use(auth);

// @desc    Get all operations
// @route   GET /api/operations
// @access  Authenticated users (Admin sees all, Users see their own)
operationRouter.get("/all", getAllOperation);

// @desc    Create new operation
// @route   POST /api/operations
// @access  Authenticated users
operationRouter.post("/", validateCreateOperation, createOperation);

// @desc    Update operation status
// @route   PUT /api/operations/:id
// @access  Authenticated users (only involved users or admin)
operationRouter.put(
  "/:id",
  validateUpdateOperation,
  authorizeOperation,
  updateOperation
);

// @desc    Delete an operation
// @route   DELETE /api/operations/:id
// @access  Authenticated users (only involved users or admin)
operationRouter.delete("/:id", authorizeOperation, deleteOperation);

// Add this route
operationRouter.get("/user", getUserOperations);

export default operationRouter;
