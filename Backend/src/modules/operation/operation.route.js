import express from "express";
import {
  createOperation,
  deleteOperation,
  getAllOperation,
  updateOperation,
} from "./operation.controller.js";
const operationRouter = express.Router();

// @desc    Get all operations
// @route   GET /api/operations
operationRouter.get("/all", getAllOperation);

// @desc    Create new operation
// @route   POST /api/operations
operationRouter.post("/", createOperation);

// @desc    Update operation status
// @route   PUT /api/operations/:id
operationRouter.put("/:id", updateOperation);

// @desc    Delete an operation
// @route   DELETE /api/operations/:id
operationRouter.delete("/:id", deleteOperation);

export default operationRouter;
