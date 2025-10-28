import express from "express";
import {
  adminCheckmiddelware,
  auth,
} from "../../middelwares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import { validationMiddleware } from "../../middelwares/category.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validations/category.validation.js";

const categoryRouter = express.Router();
categoryRouter.use(auth);

// @desc    Get all categories
// @route   GET /api/categories
categoryRouter.get("/", getAllCategories);

// @desc    Get category by id
// @route   GET /api/categories/:id
categoryRouter.get("/:id", getCategoryById);

// @desc    Create category
// @route   POST /api/categories
// @access  Admin only
categoryRouter.post(
  adminCheckmiddelware,
  validationMiddleware(createCategorySchema),
  createCategory
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin only
categoryRouter.put(
  "/:id",
  adminCheckmiddelware,
  validationMiddleware(updateCategorySchema),
  updateCategory
);

// @desc    delete category
// @route   DELETE /api/categories/:id
// @access  Admin only
categoryRouter.delete("/:id", adminCheckmiddelware, deleteCategory);

export default categoryRouter;
