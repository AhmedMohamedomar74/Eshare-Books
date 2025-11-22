import Joi from 'joi';

export const wishlistSchema = Joi.object({
  bookId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid book ID format.',
      'string.empty': 'Book ID is required.',
      'any.required': 'Book ID is required.',
    }),
});
