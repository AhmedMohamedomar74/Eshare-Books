import Joi from 'joi';

// Suggest Category Validation Schema
const suggestCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[^\d]*$/) // No numbers allowed
    .required()
    .messages({
      'string.empty': 'Category name is required.',
      'string.min': 'Category name must be at least 3 characters long.',
      'string.max': 'Category name must not exceed 50 characters.',
      'string.pattern.base': 'Category name cannot contain numbers.',
      'any.required': 'Category name is required.',
    }),
});

export default suggestCategorySchema;
