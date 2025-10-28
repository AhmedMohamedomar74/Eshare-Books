import { findByIdAndUpdate, softDelete, update } from "../../DB/db.services.js";
import categoryModel from "../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { successResponce } from "../../utils/Response.js";
import { AppError } from "../utils/AppError.js";

// @desc    Get all categories
// @route   GET /api/categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find({ isDeleted: false });

  return successResponce({
    res,
    status: 200,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

// @desc    Get category by id
// @route   GET /api/categories/:id
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOne({ _id: id, isDeleted: false });
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  return successResponce({
    res,
    message: "Category retrieved successfully",
    data: category,
  });
});

// @desc    Create category
// @route   POST /api/categories
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.validatedBody;

  const existing = await categoryModel.findOne({ name, isDeleted: false });
  if (existing) {
    return next(new AppError("Category already exists", 400));
  }

  const newCategory = await Category.create({ name });
  return successResponce({
    res,
    status: 201,
    message: "Category created successfully",
    data: newCategory,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updated = await findByIdAndUpdate({
    model: categoryModel,
    id,
    data: req.validatedBody,
    options: { new: true },
  });

  if (!update) {
    return next(new AppError("Category not found", 404));
  }

  return successResponce({
    res,
    message: "Category updated successfully",
    data: updated,
  });
});

// @desc    delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await softDelete({
    model: Category,
    filter: { _id: id },
    options: { new: true },
  });

  if (!deleted) {
    return next(new AppError("Category not found", 404));
  }

  return successResponce({
    res,
    message: "Category deleted successfully",
    data: deleted,
  });
});
