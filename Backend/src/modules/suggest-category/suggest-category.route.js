import express from 'express';
import { auth, adminCheckmiddelware } from '../../middelwares/auth.middleware.js';
import {
  createSuggestedCategory,
  deleteSuggestedCategory,
  getAllSuggestedCategories,
  getSuggestedCategoryById,
} from './suggest-category.controller.js';
import { validateSuggestCategory } from '../../middelwares/validation.middleware.js';

const suggestCategoryRouter = express.Router();

// Create suggestion - Any authenticated user
suggestCategoryRouter.post('/', auth, validateSuggestCategory, createSuggestedCategory);

// Get all suggested categories - Admin only
suggestCategoryRouter.get('/', auth, adminCheckmiddelware, getAllSuggestedCategories);

// Get suggested category by id - Admin only
suggestCategoryRouter.get('/:id', auth, adminCheckmiddelware, getSuggestedCategoryById);

// Delete suggested category - Admin only
suggestCategoryRouter.delete('/:id', auth, adminCheckmiddelware, deleteSuggestedCategory);

export default suggestCategoryRouter;
