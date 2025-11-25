import suggestCategoryModel from '../../DB/models/suggest-category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponce } from '../../utils/Response.js';
import { AppError } from '../../utils/AppError.js';

// @desc    Get all suggested categories (non-deleted only) - Admin only
// @route   GET /api/suggest-categories
export const getAllSuggestedCategories = asyncHandler(async (req, res) => {
  const categories = await suggestCategoryModel
    .find({ isDeleted: false })
    .populate('suggestedBy', 'firstName secondName email')
    .sort({ createdAt: -1 });

  return successResponce({
    res,
    status: 200,
    message: 'Suggested categories retrieved successfully',
    data: categories,
  });
});

// @desc    Get suggested category by id (non-deleted only) - Admin only
// @route   GET /api/suggest-categories/:id
export const getSuggestedCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await suggestCategoryModel
    .findOne({ _id: id, isDeleted: false })
    .populate('suggestedBy', 'firstName secondName email');

  if (!category) {
    return next(new AppError('Suggested category not found', 404));
  }

  return successResponce({
    res,
    message: 'Suggested category retrieved successfully',
    data: category,
  });
});

// @desc    Create suggested category - Any authenticated user
// @route   POST /api/suggest-categories
export const createSuggestedCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await suggestCategoryModel.create({
    name,
    suggestedBy: req.user._id,
  });

  await newCategory.populate('suggestedBy', 'firstName secondName email');

  return successResponce({
    res,
    status: 201,
    message: 'Category suggestion created successfully',
    data: newCategory,
  });
});

// @desc    Delete suggested category (soft delete) - Admin only
// @route   DELETE /api/suggest-categories/:id
export const deleteSuggestedCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await suggestCategoryModel
    .findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true })
    .populate('suggestedBy', 'firstName secondName email');

  if (!deleted) {
    return next(new AppError('Suggested category not found', 404));
  }

  return successResponce({
    res,
    message: 'Suggested category deleted successfully',
    data: deleted,
  });
});
