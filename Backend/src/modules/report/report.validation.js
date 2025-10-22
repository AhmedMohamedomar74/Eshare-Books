import Joi from 'joi';

// Report Validation Schema
const reportSchema = Joi.object({
  targetType: Joi.string().valid('Book', 'user').required().messages({
    'any.only': 'Target type must be either Book or User.',
    'any.required': 'Target type is required.',
  }),

  targetId: Joi.string().required().messages({
    'string.empty': 'Target ID is required.',
    'any.required': 'Target ID is required.',
  }),

  reason: Joi.string()
    .valid(
      'Inappropriate Content',
      'Spam or Fake',
      'Offensive Language',
      'Harassment',
      'Scam or Fraud',
      'Other'
    )
    .required()
    .messages({
      'any.only': 'Invalid reason type. Must be one of the allowed reasons.',
      'any.required': 'Reason is required.',
    }),

  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description must not exceed 500 characters.',
  }),
});

export default reportSchema;
